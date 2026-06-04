/*
  imageUrl.js — Normalize external image-sharing URLs into direct image URLs
  ───────────────────────────────────────────────────────────────────────────
  Many image-sharing services give users a "view" or "share" URL that points
  to an HTML preview page, not the raw image bytes. Embedding those as <img>
  source fails silently. This helper converts known share-URL patterns to
  their direct-image equivalents so admins can paste any URL and it works.

  Supported:
    • Google Drive   file/d/{ID}/view  →  uc?export=view&id={ID}
    • Imgur          /a/abc  /gallery  →  i.imgur.com/{ID}.png  (when possible)
    • Dropbox        ?dl=0             →  ?raw=1
    • OneDrive       embed share       →  &download=1
    • Direct URLs (https://...png) pass through unchanged

  Usage:
    import { normalizeImageUrl } from '../utils/imageUrl.js';
    <img src={normalizeImageUrl(rawUrl)} />
*/

/** Convert any pasted image URL into one a browser can actually load. */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  // Pass through data URLs and root-relative paths unchanged
  if (trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  if (trimmed.startsWith('blob:')) return trimmed;

  // ── Google Drive ────────────────────────────────────────────────────────
  // Match formats:
  //   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  //   https://drive.google.com/file/d/FILE_ID
  //   https://drive.google.com/open?id=FILE_ID
  //   https://drive.google.com/uc?id=FILE_ID
  {
    const m = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{15,})/);
    if (m) {
      // Use googleusercontent.com for direct image rendering — works
      // reliably for images shared with "Anyone with the link can view"
      return `https://lh3.googleusercontent.com/d/${m[1]}=w2000`;
    }
    const m2 = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]{15,})/);
    if (m2) {
      return `https://lh3.googleusercontent.com/d/${m2[1]}=w2000`;
    }
  }

  // ── Dropbox ─────────────────────────────────────────────────────────────
  // https://www.dropbox.com/s/abc123/image.png?dl=0  →  ?raw=1
  if (/dropbox\.com\/(?:s|scl)\//.test(trimmed)) {
    return trimmed.replace(/[?&]dl=\d/, '').replace(/\?$|&$/, '') + (trimmed.includes('?') ? '&raw=1' : '?raw=1');
  }

  // ── OneDrive (Sharing link) ─────────────────────────────────────────────
  if (/1drv\.ms\/|onedrive\.live\.com\//.test(trimmed)) {
    if (!/[?&]download=1/.test(trimmed)) {
      return trimmed + (trimmed.includes('?') ? '&download=1' : '?download=1');
    }
  }

  // ── Imgur ───────────────────────────────────────────────────────────────
  // Page link to direct image link
  //   https://imgur.com/abc123  →  https://i.imgur.com/abc123.png
  //   https://imgur.com/a/abc   → can't auto-resolve album, return as-is
  {
    const m = trimmed.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,8})(?:\.(?:png|jpg|jpeg|gif|webp))?$/);
    if (m && !trimmed.includes('/a/') && !trimmed.includes('/gallery/')) {
      return `https://i.imgur.com/${m[1]}.png`;
    }
  }

  // ── GitHub blob URLs → raw URLs ─────────────────────────────────────────
  // https://github.com/user/repo/blob/main/path/image.png  →  raw.githubusercontent.com
  {
    const m = trimmed.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)$/);
    if (m) {
      return `https://raw.githubusercontent.com/${m[1]}/${m[2]}`;
    }
  }

  // Already a direct URL — pass through
  return trimmed;
}

/** Convenience: report what the converter did (for debugging UI). */
export function describeUrlConversion(url) {
  const normalized = normalizeImageUrl(url);
  if (normalized === url) return null;
  let service = 'External service';
  if (/drive\.google\.com/.test(url)) service = 'Google Drive';
  else if (/dropbox\.com/.test(url)) service = 'Dropbox';
  else if (/onedrive|1drv\.ms/.test(url)) service = 'OneDrive';
  else if (/imgur\.com/.test(url)) service = 'Imgur';
  else if (/github\.com/.test(url)) service = 'GitHub';
  return { service, normalized, original: url };
}
