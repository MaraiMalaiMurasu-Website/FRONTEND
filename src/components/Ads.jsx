import React, { useState, useEffect } from 'react';

// Ad slot system — reusable placeholders for Google Ads, Meta Audience Network,
// and direct sponsor slots.

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
export function AdSlot({ network = "google", size = "728x90", slotId = "", note = "", className = "", style = {}, creative = null, href = "#" }) {
  const [w, h] = size.split("x").map(Number);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('adSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  let displayNetwork = network;
  let displayCreative = creative;
  let displayHref = href;
  let displaySlotId = slotId;

  if (settings) {
    // Priority 1: Per-slot override — each ad slot can have its own image
    // uploaded via Admin → Ad Manager → Per-slot ads list. This takes
    // precedence over the legacy single houseImageUrl override.
    const perSlot = settings.houseAds && settings.houseAds[slotId];
    if (perSlot && perSlot.image) {
      displayNetwork = "house";
      displayCreative = perSlot.image;
      displayHref = perSlot.link || "#";
      displaySlotId = perSlot.label || "My Active Ad";
    }
    // Priority 2: Legacy single-ad override (matched by size)
    else if (settings.houseImageUrl && settings.houseLocation && settings.houseLocation.includes(size)) {
      displayNetwork = "house";
      displayCreative = settings.houseImageUrl;
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
  const effectiveStyle = {
    display: 'block',
    width: '100%',
    maxWidth: callerMaxWidth || `${w}px`,
    height: callerMaxWidth ? 'auto' : `${h}px`,
    aspectRatio: callerMaxWidth ? `${w}/${h}` : undefined,
    margin: '0 auto',
    ...style,
  };

  if (displayCreative) {
    return (
      <a
        className={`ad-slot ad-slot-${displayNetwork} ad-slot-filled ${className}`}
        data-size={size}
        style={effectiveStyle}
        aria-label="advertisement"
        href={displayHref}
      >
        <AdLabel network={displayNetwork} copy={displaySlotId} />
        <img src={displayCreative} alt="" loading="lazy" style={{ display: 'block', width: "100%", height: "100%", objectFit: "cover" }} />
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
