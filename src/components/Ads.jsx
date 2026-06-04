import React, { useState, useEffect } from 'react';
import { getYouTubeId } from './VideoPlayer.jsx';
import { normalizeImageUrl } from '../utils/imageUrl.js';

// Ad slot system — reusable placeholders for Google Ads, Meta Audience Network,
// and direct sponsor slots.

// Detect if a URL is a YouTube link (or just a video ID) — used by ad slots
// to decide whether to render a <video>/iframe or an <img>.
function detectVideoKind(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // YouTube
  if (getYouTubeId(trimmed)) return 'youtube';
  // Direct mp4/webm/ogg/mov video
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(trimmed)) return 'video';
  // Vimeo
  if (/vimeo\.com\/(\d+)/.test(trimmed)) return 'vimeo';
  return null;
}

// Build a muted-autoplay-loop YouTube embed URL for ad slots
function buildYouTubeAdEmbed(url) {
  const id = getYouTubeId(url);
  if (!id) return '';
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    playsinline: '1',
    disablekb: '1',
    fs: '0',
    cc_load_policy: '0',
    enablejsapi: '0',
    color: 'white',
    playlist: id, // required for loop=1 on single video
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

// Build a muted-autoplay-loop Vimeo embed URL for ad slots
function buildVimeoAdEmbed(url) {
  const m = url && url.match(/vimeo\.com\/(\d+)/);
  if (!m) return '';
  const id = m[1];
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&controls=0&background=1`;
}

const AdLabel = ({ network, copy }) => {
  const tag = {
    google:  { en: "Ad · Google",     ta: "விளம்பரம் · Google Ads" },
    meta:    { en: "Ad · Meta",       ta: "விளம்பரம் · Meta Audience" },
    sponsor: { en: "Sponsored",       ta: "ஆதரவாளர் விளம்பரம்" },
    house:   { en: "House Ad",        ta: "முரசு வாசகர்களுக்கு" },
  }[network] || { en: "Advertisement", ta: "விளம்பரம்" };
  return (
    <span className={`ad-tag ad-tag-${network}`}>
      <span className="ad-tag-dot" aria-hidden="true"></span>
      <span className="ad-tag-ta">{tag.ta}</span>
      <span className="ad-tag-en">{tag.en}</span>
      {copy && <span className="ad-tag-id">{copy}</span>}
    </span>
  );
};

function labelFor(network) {
  return ({
    google:  "Google AdSense / AdManager slot",
    meta:    "Meta Audience Network slot",
    sponsor: "Direct sponsor — sold by Murasu Sales",
    house:   "House promo · in-rotation",
  })[network] || "";
}

function cornerFor(network) {
  return ({
    google: "G", meta: "M", sponsor: "★", house: "M̄",
  })[network] || "·";
}

// Generic responsive slot — pass size as "728x90", "300x250", "300x600", "970x250", "320x100"
// Supports per-slot overrides via adSettings.houseAds[slotId]:
//   { image: dataURL | URL,   // any-size image, scaled to fill slot
//     video: 'https://youtu.be/...' | 'https://example.com/file.mp4',  // YouTube/Vimeo/MP4
//     fit: 'cover' | 'contain' | 'natural',  // how the content fills the slot
//        - cover (default): crops to fill, no bars but may lose edges
//        - contain: shows full content with bars on the empty sides
//        - natural: slot resizes to match the content's aspect ratio (NO crop + NO bars)
//     bg: '#000',  // optional letterbox background colour when fit=contain
//     link: 'https://...', label: 'My Ad' }
export function AdSlot({ network = "google", size = "728x90", slotId = "", note = "", className = "", style = {}, creative = null, href = "#" }) {
  const [w, h] = size.split("x").map(Number);
  const [settings, setSettings] = useState(null);
  // naturalAspect tracks the uploaded image's intrinsic width/height ratio.
  // It is set on <img onLoad> and used when fit === 'natural' to resize the
  // slot so the image fits perfectly (no crop, no bars).
  const [naturalAspect, setNaturalAspect] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('adSettings');
    if (saved) setSettings(JSON.parse(saved));
    // Reload when adSettings is updated elsewhere
    const onStorage = (e) => {
      if (!e || e.key === 'adSettings') {
        const s = localStorage.getItem('adSettings');
        if (s) { try { setSettings(JSON.parse(s)); } catch (err) { /* ignore */ } }
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('adSettingsChanged', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('adSettingsChanged', onStorage);
    };
  }, []);

  let displayNetwork = network;
  let displayCreative = creative;
  let displayVideo = null;
  let displayFit = 'cover';
  let displayBg = '#000';
  let displayHref = href;
  let displaySlotId = slotId;

  if (settings) {
    // Priority 1: Per-slot override — each ad slot can have its own image OR
    // video uploaded via Admin → Ad Manager → Per-slot ads list. This takes
    // precedence over the legacy single houseImageUrl override.
    const perSlot = settings.houseAds && settings.houseAds[slotId];
    if (perSlot && (perSlot.image || perSlot.video)) {
      displayNetwork = "house";
      // normalizeImageUrl auto-converts Google Drive / Dropbox / Imgur / GitHub
      // share URLs into direct image URLs so they render correctly.
      displayCreative = perSlot.image ? normalizeImageUrl(perSlot.image) : null;
      displayVideo = perSlot.video || null;
      // fit: cover | contain | natural — default is cover for backward compat
      if (perSlot.fit === 'contain') displayFit = 'contain';
      else if (perSlot.fit === 'natural') displayFit = 'natural';
      else displayFit = 'cover';
      displayBg = perSlot.bg || '#000';
      displayHref = perSlot.link || "#";
      displaySlotId = perSlot.label || "My Active Ad";
    }
    // Priority 2: Legacy single-ad override (matched by size)
    else if (settings.houseImageUrl && settings.houseLocation && settings.houseLocation.includes(size)) {
      displayNetwork = "house";
      displayCreative = normalizeImageUrl(settings.houseImageUrl);
      displayHref = settings.houseLink || "#";
      displaySlotId = "My Active Ad";
    }

    // Hide disabled networks
    if (displayNetwork === "google" && settings.googleActive === false) return null;
    if (displayNetwork === "meta" && settings.metaActive === false) return null;
  }

  // If caller provided a maxWidth in style, it OVERRIDES the natural size.
  // This lets us render a 970x250 ad inside a 1280px container, stretching
  // the image to fill the whole width while keeping the aspect ratio.
  const callerMaxWidth = style && (style.maxWidth || style.width);
  const hasContent = !!(displayCreative || displayVideo);

  // ---------- NATURAL FIT MODE ----------
  // When fit='natural' AND we have the image's intrinsic aspect ratio,
  // resize the slot to match the image so it displays perfectly (no crop,
  // no bars). Falls back to the configured size until the image loads.
  const useNatural = displayFit === 'natural' && naturalAspect && displayCreative;
  const effectiveStyle = useNatural
    ? {
        display: 'block',
        width: '100%',
        maxWidth: callerMaxWidth || `${w}px`,
        height: 'auto',
        aspectRatio: `${naturalAspect}`,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: displayBg,
        ...style,
      }
    : {
        display: 'block',
        width: '100%',
        maxWidth: callerMaxWidth || `${w}px`,
        height: callerMaxWidth ? 'auto' : `${h}px`,
        aspectRatio: callerMaxWidth ? `${w}/${h}` : undefined,
        margin: '0 auto',
        position: 'relative',
        // Only override CSS pattern background when we have an image/video to render.
        // For filled slots, use the user-chosen letterbox colour so any-size content
        // fits cleanly into the slot regardless of source aspect ratio.
        ...(hasContent ? { overflow: 'hidden', background: displayBg } : null),
        ...style,
      };

  // ---------- VIDEO AD ----------
  // YouTube / Vimeo / direct MP4 video — fills the entire ad slot,
  // muted + autoplay + looped (browser policy compliant).
  if (displayVideo) {
    const kind = detectVideoKind(displayVideo);
    let iframeSrc = '';
    let isFileVideo = false;
    if (kind === 'youtube') iframeSrc = buildYouTubeAdEmbed(displayVideo);
    else if (kind === 'vimeo') iframeSrc = buildVimeoAdEmbed(displayVideo);
    else if (kind === 'video') isFileVideo = true;

    // For YouTube/Vimeo: the iframe needs to be sized LARGER than the container,
    // maintaining 16:9 aspect ratio, so the actual video portion always covers
    // the entire visible ad slot area (no black bars).
    // Cover mode is the default; Contain mode keeps the original behaviour.
    const isYouTube = kind === 'youtube';
    const isVimeo = kind === 'vimeo';
    const useCover = displayFit !== 'contain';

    // When in Cover mode for YouTube/Vimeo iframes:
    //   - aspect-ratio: 16/9 forces the iframe's natural ratio
    //   - min-width: 100% + min-height: 100% force it to be at least as
    //     large as the container in BOTH dimensions
    //   - width: auto + height: auto let the browser compute the smaller of
    //     the two valid sizes that satisfy 16:9 + both min constraints,
    //     which guarantees the iframe overflows the container exactly enough
    //     for the video to fill it without bars.
    //   - overflow: hidden on the wrapper crops the excess.
    const iframeStyle = useCover
      ? {
          display: 'block',
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          aspectRatio: '16 / 9',
          transform: 'translate(-50%, -50%)',
          border: 0,
          pointerEvents: 'none',
          background: displayBg,
        }
      : {
          display: 'block',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          border: 0,
          pointerEvents: 'none',
          background: displayBg,
        };

    return (
      <a
        className={`ad-slot ad-slot-${displayNetwork} ad-slot-filled ad-slot-video ${className}`}
        data-size={size}
        style={effectiveStyle}
        aria-label="advertisement"
        href={displayHref}
        target={displayHref && displayHref !== '#' ? '_blank' : undefined}
        rel="noopener noreferrer"
      >
        <AdLabel network={displayNetwork} copy={displaySlotId} />
        {/* Inner crop wrapper — hides any iframe overflow so video fills cleanly */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: displayBg }}>
          {isFileVideo ? (
            <video
              src={displayVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                display: 'block',
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: displayFit,
                pointerEvents: 'none',
                background: displayBg,
              }}
            />
          ) : iframeSrc ? (
            <iframe
              src={iframeSrc}
              title="advertisement video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              tabIndex={-1}
              style={iframeStyle}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontFamily: 'monospace', background: '#111' }}>
              ▶ Unsupported video URL
            </div>
          )}
        </div>
        {/*
          Transparent hover-blocking overlay — sits ABOVE the iframe so YouTube
          never receives mouse events. This prevents the title bar, pause/skip
          arrows, and "More videos" panel from appearing on hover. The <a>
          parent still receives the click (overlay has pointer-events: auto
          inherited from default <span>) but the iframe inside doesn't see hover.
        */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            cursor: displayHref && displayHref !== '#' ? 'pointer' : 'default',
            background: 'transparent',
          }}
          aria-hidden="true"
        />
        <span className="ad-slot-corner" style={{ zIndex: 4 }}>{cornerFor(displayNetwork)}</span>
      </a>
    );
  }

  // ---------- IMAGE AD ----------
  // Any-size image — scaled to fully fill the slot.
  //  - 'cover' (default): crops to fill the slot, no bars, may lose edges
  //  - 'contain': shows the full image with letterbox bars on empty sides
  //  - 'natural': slot resizes to image's aspect ratio — full image, no bars
  if (displayCreative) {
    const isNatural = displayFit === 'natural';
    return (
      <a
        className={`ad-slot ad-slot-${displayNetwork} ad-slot-filled ${className}`}
        data-size={size}
        style={effectiveStyle}
        aria-label="advertisement"
        href={displayHref}
      >
        <AdLabel network={displayNetwork} copy={displaySlotId} />
        <img
          src={displayCreative}
          alt=""
          loading="lazy"
          onLoad={(e) => {
            const w = e.target.naturalWidth;
            const h = e.target.naturalHeight;
            if (w && h) {
              const ratio = w / h;
              // Only update state if the ratio actually changed (avoid infinite re-renders)
              setNaturalAspect((prev) => (prev !== ratio ? ratio : prev));
            }
          }}
          style={{
            display: 'block',
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            // In natural mode the slot itself adapts to the image aspect ratio,
            // so 'contain' is used so any rounding gaps stay transparent.
            objectFit: isNatural ? 'contain' : displayFit,
            objectPosition: 'center',
            background: displayBg,
          }}
        />
        <span className="ad-slot-corner">{cornerFor(displayNetwork)}</span>
      </a>
    );
  }
  return (
    <div
      className={`ad-slot ad-slot-${displayNetwork} ${className}`}
      data-size={size}
      style={effectiveStyle}
      aria-label="advertisement"
    >
      <AdLabel network={displayNetwork} copy={displaySlotId} />
      <div className="ad-slot-body">
        <span className="ad-slot-size">{w} × {h}</span>
        <span className="ad-slot-note">{note || labelFor(displayNetwork)}</span>
        <span className="ad-slot-id">{settings && displayNetwork === 'google' && settings.googleClientId ? settings.googleClientId : displaySlotId}</span>
      </div>
      <span className="ad-slot-corner">{cornerFor(displayNetwork)}</span>
    </div>
  );
}

// Sponsor card — branded native ad with photo + headline + CTA.
// If `image` is provided (URL or data URL), it replaces the text placeholder
// thumbnail. If `fullImage` is provided, the ENTIRE card is rendered as a
// clickable image banner (use for Tesco-style premium ad creatives).
export function SponsorCard({
  brand = "ஆதரவாளர்",
  headline = "உங்கள் வணிகம் — மறைமலை முரசு வாசகர்களை சென்றடையுங்கள்",
  copy = "தினசரி 14 லட்சம் வாசகர்கள் · 6 பதிப்புகள் · அனைத்து பகுதிகளிலும்",
  cta = "விளம்பர திட்டங்கள் →",
  thumb = "SPONSOR",
  image = "",
  fullImage = "",
  href = "#",
  variant = "wide",
  style = {},
}) {
  // Full-image mode — entire card is a single banner image
  if (fullImage) {
    return (
      <a
        className={`sponsor-card sponsor-card-${variant} sponsor-card-full`}
        style={{ ...style, display: 'block', textDecoration: 'none', color: 'inherit', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--rule)' }}
        href={href}
        aria-label="sponsored content"
      >
        <AdLabel network="sponsor" copy={brand} />
        <img src={fullImage} alt={headline || brand} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
      </a>
    );
  }

  // Standard mode — image thumbnail + text content
  return (
    <a
      className={`sponsor-card sponsor-card-${variant}`}
      style={{ ...style, textDecoration: 'none', color: 'inherit', display: 'block' }}
      href={href}
      aria-label="sponsored content"
    >
      <AdLabel network="sponsor" copy={brand} />
      <div className="sponsor-card-body">
        <div className="sponsor-thumb" style={image ? { padding: 0, background: 'transparent' } : undefined}>
          {image ? (
            <img src={image} alt={brand} loading="lazy" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
          ) : (
            <div className="ph">{thumb}</div>
          )}
        </div>
        <div className="sponsor-text">
          <div className="sponsor-brand">{brand}</div>
          <h4>{headline}</h4>
          <p>{copy}</p>
          <span className="sponsor-cta">{cta}</span>
        </div>
      </div>
    </a>
  );
}

// Sticky rail used on article / category sidebars
export function AdRail({ children }) {
  return <div className="ad-rail">{children}</div>;
}

// In-feed strip — small banner inserted between rows
export function InFeedAd({ network = "meta", slotId = "in-feed-1" }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('adSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  if (settings && network === "meta" && settings.metaActive === false) {
    return null;
  }

  return (
    <div className="ad-infeed" aria-label="advertisement">
      <AdLabel network={network} copy={slotId} />
      <div className="ad-infeed-body">
        <div className="ad-infeed-thumb">{cornerFor(network)}</div>
        <div className="ad-infeed-text">
          <strong>{network === "meta" ? "Meta Audience Network" : network === "google" ? "Google AdSense" : "ஆதரவாளர் விளம்பரம்"}</strong>
          <span>728 × 120 · in-feed slot · {settings && settings.metaPlacementId ? settings.metaPlacementId : slotId}</span>
        </div>
        <span className="ad-infeed-cta">›</span>
      </div>
    </div>
  );
}

// Floating bottom-of-screen anchor ad (mobile-style)
export function AnchorAd({ network = "google", slotId = "anchor-bottom" }) {
  const [closed, setClosed] = React.useState(false);
  if (closed) return null;
  return (
    <div className="ad-anchor" aria-label="advertisement">
      <button className="ad-anchor-close" onClick={() => setClosed(true)} aria-label="close">×</button>
      <AdLabel network={network} copy={slotId} />
      <div className="ad-anchor-body">
        <span className="ad-anchor-size">320 × 100</span>
        <span className="ad-anchor-note">{labelFor(network)}</span>
      </div>
    </div>
  );
}
