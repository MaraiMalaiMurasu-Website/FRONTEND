/*
  CustomBanners.jsx
  ──────────────────
  Reads `adSettings.customBanners` (managed in /admin → Ad Manager → My Custom Banners)
  and renders the ones assigned to the current page.

  Each banner has:
    { id, label, size, page, image, video, link, fit, bg, active }

  Usage in any page component:
    <CustomBannerStrip page="Homepage" />

  Or auto-detect the current page from window.location:
    <CustomBannerStrip />
*/

import React, { useState, useEffect } from 'react';

// Map URL pathnames to the page labels used in admin
function pathnameToPageLabel(pathname) {
  const path = (pathname || '/').toLowerCase();
  if (path === '/' || path === '/home') return 'Homepage';
  if (path.startsWith('/headlines')) return 'Headlines';
  if (path.startsWith('/law')) return 'Law';
  if (path.startsWith('/cinema')) return 'Cinema';
  if (path.startsWith('/sports')) return 'Sports';
  if (path.startsWith('/beauty')) return 'Beauty';
  if (path.startsWith('/cooking')) return 'Cooking';
  if (path.startsWith('/astrology')) return 'Astrology';
  if (path.startsWith('/spiritual')) return 'Spiritual';
  if (path.startsWith('/more')) return 'More';
  if (path.startsWith('/contact')) return 'Contact';
  if (path.startsWith('/subscription')) return 'Subscription';
  if (path.startsWith('/epaper')) return 'ePaper';
  return '';
}

function useCustomBanners(pageLabel) {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('adSettings');
        if (!raw) { setBanners([]); return; }
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed.customBanners) ? parsed.customBanners : [];
        // Filter: must be active, must match this page OR be "Every Page"
        const filtered = list.filter(b => {
          if (b.active === false) return false;
          if (!b.image && !b.video) return false; // skip blank slots
          if (b.page === 'Every Page') return true;
          return b.page === pageLabel;
        });
        setBanners(filtered);
      } catch (e) {
        setBanners([]);
      }
    };
    load();
    const onChange = (e) => { if (!e || e.key === 'adSettings') load(); };
    window.addEventListener('storage', onChange);
    window.addEventListener('adSettingsChanged', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('adSettingsChanged', onChange);
    };
  }, [pageLabel]);

  return banners;
}

function parseSize(sizeStr) {
  const m = (sizeStr || '728x90').match(/^(\d+)x(\d+)$/);
  if (!m) return { w: 728, h: 90 };
  return { w: parseInt(m[1], 10), h: parseInt(m[2], 10) };
}

function isYouTube(url) {
  return /youtu\.?be/.test(url || '');
}
function getYouTubeId(url) {
  const m = (url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return m ? m[1] : null;
}
function isVimeo(url) {
  return /vimeo\.com\/\d+/.test(url || '');
}
function getVimeoId(url) {
  const m = (url || '').match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function BannerMedia({ banner }) {
  const { w, h } = parseSize(banner.size);
  const fit = banner.fit || 'cover';
  const bg = banner.bg || '#000';

  const naturalStyle = fit === 'natural'
    ? { maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }
    : null;

  // Video first (priority over image)
  if (banner.video) {
    if (isYouTube(banner.video)) {
      const id = getYouTubeId(banner.video);
      return (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ width: '100%', height: '100%', display: 'block', background: bg, border: 0 }}
          title={banner.label || 'Banner'}
        />
      );
    }
    if (isVimeo(banner.video)) {
      const id = getVimeoId(banner.video);
      return (
        <iframe
          src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ width: '100%', height: '100%', display: 'block', background: bg, border: 0 }}
          title={banner.label || 'Banner'}
        />
      );
    }
    // Direct video file
    return (
      <video
        src={banner.video}
        autoPlay muted loop playsInline
        style={{ width: '100%', height: '100%', objectFit: fit === 'natural' ? 'contain' : fit, display: 'block', background: bg }}
      />
    );
  }

  // Image
  if (banner.image) {
    if (fit === 'natural') {
      return <img src={banner.image} alt={banner.label || 'Banner'} style={naturalStyle} />;
    }
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `${bg} url(${banner.image}) center/${fit} no-repeat`,
        }}
        role="img"
        aria-label={banner.label || 'Banner'}
      />
    );
  }

  return null;
}

/**
 * Strip of all custom banners assigned to a page, rendered top-to-bottom.
 *
 * @param {string} [page] - Page label from admin (e.g. "Homepage"). If omitted,
 *                         auto-detects from current URL.
 * @param {object} [style] - Optional wrapper styles.
 */
export function CustomBannerStrip({ page, style = {} }) {
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const pageLabel = page || pathnameToPageLabel(currentPath);
  const banners = useCustomBanners(pageLabel);

  if (banners.length === 0) return null;

  return (
    <div className="custom-banner-strip" style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0', ...style }}>
      {banners.map((b, i) => {
        const { w, h } = parseSize(b.size);
        const fit = b.fit || 'cover';
        const isNatural = fit === 'natural';

        const wrapStyle = isNatural
          ? { display: 'block', textDecoration: 'none', color: 'inherit', maxWidth: `${w}px`, margin: '0 auto' }
          : { display: 'block', width: '100%', maxWidth: `${w}px`, aspectRatio: `${w} / ${h}`, margin: '0 auto', textDecoration: 'none', color: 'inherit', background: b.bg || '#000', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' };

        const inner = <BannerMedia banner={b} />;

        if (b.link) {
          return (
            <a key={b.id || i} href={b.link} target="_blank" rel="noopener noreferrer sponsored" style={wrapStyle} title={b.label}>
              {inner}
            </a>
          );
        }
        return (
          <div key={b.id || i} style={wrapStyle} title={b.label}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export default CustomBannerStrip;
