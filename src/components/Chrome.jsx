import { useState, useEffect, useRef } from 'react';
import logoSrc from '../assets/logo.png';
import { AdSlot } from './Ads.jsx';

// ---------- Live timestamp ----------
function useLiveTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const TAMIL_DAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const TAMIL_MONTHS = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];

function fmtTamilDate(d) {
  return `${TAMIL_DAYS[d.getDay()]}, ${d.getDate()} ${TAMIL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtClock(d) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ---------- Utility Bar ----------
export function UtilityBar() {
  const now = useLiveTime();
  const [rni, setRni] = useState('RNI.No. TNTAM / 2023 / 88613');

  // Read RNI number from admin-saved customSiteSettings (or use default)
  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('customSiteSettings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.rniNumber && typeof parsed.rniNumber === 'string') {
            setRni(parsed.rniNumber);
          }
        }
      } catch (e) { /* ignore */ }
    };
    load();
    const onChange = (e) => {
      if (!e || e.key === 'customSiteSettings') load();
    };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const handleEPaperClick = (e) => {
    e.preventDefault();
    // Navigate to dedicated ePaper page that shows the full grid of weekly editions
    window.history.pushState({}, '', '/epaper');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleSubscriptionClick = (e) => {
    e.preventDefault();
    // Navigate to dedicated subscription (சந்தா) page
    window.history.pushState({}, '', '/subscription');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="utility-bar">
      <div className="utility-inner">
        <div className="utility-left">
          <span>{fmtTamilDate(now)}</span>
          <span className="sep">|</span>
          <span style={{ fontFamily: "var(--mono)" }}>{fmtClock(now)} IST</span>
          <span className="sep">|</span>
          <a href="#" onClick={handleEPaperClick} style={{ color: 'inherit', cursor: 'pointer' }}>இ-பேப்பர்</a>
          <span>போட்காஸ்ட்</span>
          <a href="#" onClick={handleSubscriptionClick} style={{ color: 'inherit', cursor: 'pointer' }}>சந்தா</a>
          {rni && (
            <>
              <span className="sep">|</span>
              <span className="rni-no" style={{ fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>{rni}</span>
            </>
          )}
        </div>
        <div className="utility-right">
          <span className="pill"><span className="dot"></span>நேரலை இணைப்பு</span>
          <span>தொடர்பு கொள்ள</span>
          <span>ஆங்கிலம் / EN</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Masthead ----------
export function Masthead() {
  return (
    <div className="masthead">
      <div className="masthead-inner">
        <div className="weather">
          <span className="row"><strong>சென்னை</strong></span>
          <span className="row">32°C · ஈரப்பதம் 68%</span>
          <span className="row">தென்மேற்கு பருவக்காற்று</span>
        </div>
        <div className="brand">
          <div className="ornament">
            <span className="line"></span>
            <span className="glyph">❖ நிறுவப்பட்டது 2023 ❖</span>
            <span className="line"></span>
          </div>
          <a href="/" style={{ display: "inline-block" }}>
            <img src={logoSrc} alt="மறைமலை முரசு" style={{ maxWidth: "520px", width: "100%", height: "auto", display: "block", margin: "0 auto" }} />
          </a>

        </div>
        <div className="edition-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
          <AdSlot network="google" size="250x250" slotId="header-right-sq" note="Google AdSense · Square" style={{ width: '250px' }} />
        </div>
      </div>
    </div>
  );
}

export function PrimaryNav({ active = "headlines", onSearch }) {
  const [openDrop, setOpenDrop] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize back to desktop, and on route navigation
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 720) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const buildNav = () => {
      let cats = [];
      try {
        const saved = localStorage.getItem('customCategories');
        if (saved) cats = JSON.parse(saved);
      } catch(e) {}
      
      if (!cats || cats.length === 0) {
        cats = [
          { id: 1, name: 'தலைப்புச் செய்திகள்', slug: 'headlines', count: 124 },
          { id: 2, name: 'சட்டம் முரசு', slug: 'law', count: 85 },
          { id: 3, name: 'ஆன்மீகம்', slug: 'spiritual', count: 50 },
          { id: 4, name: 'ஜோதிடம்', slug: 'astrology', count: 45, parentId: 3 },
          { id: 5, name: 'சினிமா', slug: 'cinema', count: 450 },
          { id: 6, name: 'விளையாட்டு', slug: 'sports', count: 320 },
          { id: 7, name: 'மற்றவை', slug: 'more', count: 200 },
          { id: 8, name: 'அழகுகுறிப்பு', slug: 'beauty', count: 65, parentId: 7 },
          { id: 9, name: 'சமையல்', slug: 'cooking', count: 110, parentId: 7 },
        ];
      }

      const rootItems = [ { id: 'home', label: 'முகப்பு', href: '/' } ];
      const topLevel = cats.filter(c => !c.parentId);
      const subLevel = cats.filter(c => c.parentId);

      topLevel.forEach(c => {
        const children = subLevel.filter(sub => String(sub.parentId) === String(c.id));
        const item = {
          id: c.slug,
          label: c.name,
          href: `/${c.slug}`
        };
        if (children.length > 0) {
          item.dropdown = children.map(sub => ({
            label: sub.name,
            href: `/${sub.slug}`
          }));
        }
        rootItems.push(item);
      });

      setNavItems(rootItems);
    };
    buildNav();
    window.addEventListener('storage', buildNav);
    return () => window.removeEventListener('storage', buildNav);
  }, []);

  const handleNav = (e, href) => {
    if (href && href.startsWith("/")) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('popstate'));
      setOpenDrop(null);
    }
  };

  return (
    <nav className="primary-nav">
      <div className="nav-inner">
        {/* Mobile hamburger toggle — hidden on desktop via CSS */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(v => !v)}
          style={{
            color: '#F2ECE0',
            border: '1px solid rgba(242, 236, 224, 0.3)',
            marginRight: 8,
          }}
        >
          {mobileMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
        <ul className={mobileMenuOpen ? "nav-list is-open" : "nav-list"}>
          {navItems.map(n => (
            <li
              key={n.id}
              className={n.dropdown ? "has-drop" : ""}
              onMouseEnter={() => n.dropdown && setOpenDrop(n.id)}
              onMouseLeave={() => n.dropdown && setOpenDrop(null)}
              style={{ position: "relative" }}
            >
              <a
                href={n.href}
                className={n.id === active ? "active" : ""}
                onClick={(e) => { setMobileMenuOpen(false); handleNav(e, n.href); }}
              >
                {n.label}
                {n.dropdown && <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>▾</span>}
              </a>
              {n.dropdown && openDrop === n.id && (
                <ul style={{
                  position: "absolute", top: "100%", left: 0,
                  background: "#1A1614", borderTop: "3px solid var(--accent)",
                  minWidth: 180, zIndex: 100, listStyle: "none",
                  padding: 0, margin: 0,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
                }}>
                  {n.dropdown.map(d => (
                    <li key={d.label} style={{ borderBottom: "1px solid #2A2420" }}>
                      <a href={d.href} style={{
                        display: "block", padding: "12px 18px",
                        fontFamily: "var(--serif)", fontSize: 15, color: "#F2ECE0",
                      }}
                        onClick={(e) => { setMobileMenuOpen(false); handleNav(e, d.href); }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#F2ECE0"; }}
                      >{d.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <button onClick={onSearch} aria-label="search" className="nav-search-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.6" y2="16.6" />
            </svg>
            <span>தேடுங்கள்...</span>
          </button>
          <a href="/contact" className="nav-cta" onClick={(e) => handleNav(e, "/contact")}>தொடர்பு</a>
        </div>
      </div>
    </nav>
  );
}

// ---------- SubNav (parent dropdown page sub-categories) ----------
// When the visitor is on a dropdown parent page (/spiritual, /more), this
// component shows the dropdown's children as a horizontal tab bar so they
// can jump between sub-categories without re-opening the dropdown.
export function SubNav({ currentPath }) {
  const [items, setItems] = useState([]);
  const [parentLabel, setParentLabel] = useState('');

  useEffect(() => {
    const buildSubNav = () => {
      let cats = [];
      try {
        const saved = localStorage.getItem('customCategories');
        if (saved) cats = JSON.parse(saved);
      } catch (e) { /* ignore */ }

      if (!cats || cats.length === 0) {
        cats = [
          { id: 1, name: 'தலைப்புச் செய்திகள்', slug: 'headlines' },
          { id: 2, name: 'சட்டம் முரசு', slug: 'law' },
          { id: 3, name: 'ஆன்மீகம்', slug: 'spiritual' },
          { id: 4, name: 'ஜோதிடம்', slug: 'astrology', parentId: 3 },
          { id: 5, name: 'சினிமா', slug: 'cinema' },
          { id: 6, name: 'விளையாட்டு', slug: 'sports' },
          { id: 7, name: 'மற்றவை', slug: 'more' },
          { id: 8, name: 'அழகுகுறிப்பு', slug: 'beauty', parentId: 7 },
          { id: 9, name: 'சமையல்', slug: 'cooking', parentId: 7 },
        ];
      }

      const slug = currentPath.replace(/^\//, '');
      const parent = cats.find(c => c.slug === slug && !c.parentId);
      let activeParentId = parent ? parent.id : null;

      // Also handle the case when we're already on a sub-page — keep the sub-nav
      if (!activeParentId) {
        const sub = cats.find(c => c.slug === slug && c.parentId);
        if (sub) activeParentId = sub.parentId;
      }

      if (activeParentId) {
        const parentCat = cats.find(c => c.id === activeParentId);
        const children = cats.filter(c => String(c.parentId) === String(activeParentId));
        if (children.length > 0) {
          // Prepend the parent itself as the first tab ("All")
          setItems([
            { name: 'அனைத்தும்', slug: parentCat.slug, isOverview: true },
            ...children.map(c => ({ name: c.name, slug: c.slug })),
          ]);
          setParentLabel(parentCat.name);
          return;
        }
      }
      setItems([]);
      setParentLabel('');
    };

    buildSubNav();
    window.addEventListener('storage', buildSubNav);
    return () => window.removeEventListener('storage', buildSubNav);
  }, [currentPath]);

  const handleNav = (e, slug) => {
    e.preventDefault();
    window.history.pushState({}, '', '/' + slug);
    window.dispatchEvent(new Event('popstate'));
  };

  if (items.length === 0) return null;

  const currentSlug = currentPath.replace(/^\//, '');

  return (
    <div className="sub-nav" style={{
      background: '#F5F1E8',
      borderBottom: '2px solid var(--accent)',
      padding: '0',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--sans)',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--ink-3)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '12px 0',
          flexShrink: 0,
          borderRight: '1px solid var(--rule)',
          paddingRight: '20px',
        }}>
          {parentLabel}
        </span>
        {items.map((item, i) => {
          const isActive = currentSlug === item.slug;
          return (
            <a
              key={i}
              href={'/' + item.slug}
              onClick={(e) => handleNav(e, item.slug)}
              style={{
                padding: '14px 4px',
                fontFamily: 'var(--serif)',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent)' : 'var(--ink-2)',
                textDecoration: 'none',
                borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                marginBottom: '-2px',
                transition: 'color 0.15s, border-color 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--ink-2)'; }}
            >
              {item.name}
            </a>
          );
        })}
      </div>
      <style>{`
        .sub-nav > div::-webkit-scrollbar { display: none; }
        @media (max-width: 720px) {
          .sub-nav > div { padding: 0 12px !important; gap: 14px !important; }
          .sub-nav > div > span { padding-right: 12px !important; font-size: 10px !important; }
          .sub-nav > div > a { font-size: 13px !important; padding: 12px 2px !important; }
        }
      `}</style>
    </div>
  );
}

// ---------- Ticker ----------
const TICKER_ITEMS = [
  "தமிழக சட்டப்பேரவை தேர்தல் 2026 — வாக்கெடுப்பு ஏப்ரல் 14 அன்று நடைபெறும் என தேர்தல் ஆணையம் அறிவிப்பு",
  "சென்னை விமான நிலையத்தில் புதிய டெர்மினல் — பிரதமர் இன்று காலை திறந்து வைப்பார்",
  "தமிழ்நாடு கிரிக்கெட் அணி ரஞ்சி இறுதிப் போட்டிக்கு தகுதி — மும்பையை 6 விக்கெட்டுகள் வித்தியாசத்தில் வீழ்த்தியது",
  "ரூபாய் மதிப்பு டாலருக்கு எதிராக 83.42 ஆக சரிவு — ஆர்பிஐ தலையீடு எதிர்பார்ப்பு",
  "மழைக்காலத்தில் சென்னை குடிநீர் தேவை 1,200 எம்எல்டியை எட்டியது — மெட்ரோ ஜல் தகவல்",
  "ஐபிஎல் ஏலம்: ருத்ராக்ஷ் பாட்டீலுக்கு ₹14 கோடி — சிஎஸ்கே அணியில் சேர்ந்தார்.",
];

export function Ticker() {
  const [items, setItems] = useState(TICKER_ITEMS);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('customHomeContent');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.liveTicker && Array.isArray(parsed.liveTicker) && parsed.liveTicker.length > 0) {
            setItems(parsed.liveTicker);
            return;
          }
        }
        setItems(TICKER_ITEMS);
      } catch (e) {
        setItems(TICKER_ITEMS);
      }
    };
    load();
    const onChange = (e) => { if (e.key === 'customHomeContent') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-label">
        <span className="blink"></span>
        உடனடி
      </div>
      <div className="ticker-track">
        <div className="ticker-content">
          {doubled.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ---------- Search Overlay ----------
// Default search chips — wired to the main navbar pages
const DEFAULT_SEARCH_CHIPS = [
  { label: 'தலைப்புச் செய்திகள்', href: '/headlines' },
  { label: 'சட்டம் முரசு', href: '/law' },
  { label: 'ஜோதிடம்', href: '/astrology' },
  { label: 'சினிமா', href: '/cinema' },
  { label: 'விளையாட்டு', href: '/sports' },
  { label: 'அழகுக் குறிப்பு', href: '/beauty' },
  { label: 'சமையல்', href: '/cooking' },
  { label: 'இ-பேப்பர்', href: '/epaper' },
  { label: 'தொடர்பு', href: '/contact' }
];

export function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null);
  const [chips, setChips] = useState(DEFAULT_SEARCH_CHIPS);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Load search chips from admin
  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('customSearchChips');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChips(parsed);
            return;
          }
        }
        setChips(DEFAULT_SEARCH_CHIPS);
      } catch (e) { setChips(DEFAULT_SEARCH_CHIPS); }
    };
    load();
    const onChange = (e) => { if (e.key === 'customSearchChips') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const handleChipClick = (chip, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chip.href) {
      onClose();
      window.history.pushState({}, '', chip.href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (q) {
      onClose();
      window.history.pushState({}, '', `/headlines?q=${encodeURIComponent(q)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className={`search-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <button className="close" onClick={onClose}>ESC ✕</button>
      <div className="panel" onClick={e => e.stopPropagation()}>
        <div className="label">செய்திகளில் தேடுங்கள்</div>
        <form onSubmit={handleSubmit}>
          <input ref={inputRef} placeholder="தலைப்பு, செய்தி, ஆசிரியர்..." />
        </form>
        <div className="suggestions">
          <div className="sug-head">பிரபல தேடல்கள் · Quick links</div>
          <div className="sug-list">
            {chips.map((chip, i) => (
              <a
                key={i}
                href={chip.href || '#'}
                onClick={(e) => handleChipClick(chip, e)}
                style={{ cursor: 'pointer', display: 'inline-block' }}
              >
                <span>{chip.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Footer ----------
export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="brand-block">
          <img src={logoSrc} alt="மறைமலை முரசு" style={{ maxWidth: "260px", width: "100%", height: "auto", display: "block", marginBottom: "12px", background: "#fff", padding: "8px" }} />
          <p>தமிழ்நாட்டின் முன்னணி தமிழ் தினசரி. நம்பகமான செய்திகள், ஆழமான பகுப்பாய்வு, மக்களின் குரல்.</p>
          <div className="social">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="YouTube">▶</a>
            <a href="#" title="Instagram">◉</a>
            <a href="#" title="WhatsApp">w</a>
          </div>
        </div>
        <div>
          <h4>செய்திகள்</h4>
          <ul>
            <li><a href="#">தமிழகம்</a></li>
            <li><a href="#">தேசியம்</a></li>
            <li><a href="#">உலகம்</a></li>
            <li><a href="#">அரசியல்</a></li>
            <li><a href="#">வணிகம்</a></li>
          </ul>
        </div>
        <div>
          <h4>பிரிவுகள்</h4>
          <ul>
            <li><a href="#">சினிமா</a></li>
            <li><a href="#">விளையாட்டு</a></li>
            <li><a href="#">வாழ்வியல்</a></li>
            <li><a href="#">சமையல்</a></li>
            <li><a href="#">கல்வி</a></li>
          </ul>
        </div>
        <div>
          <h4>நிறுவனம்</h4>
          <ul>
            <li><a href="#">எங்களைப் பற்றி</a></li>
            <li><a href="#">ஆசிரியர் குழு</a></li>
            <li><a href="#">விளம்பரம்</a></li>
            <li><a href="/contact">தொடர்பு</a></li>
            <li><a href="#">தொழில் வாய்ப்பு</a></li>
            <li><a href="/epaper" style={{ color: '#fff', fontWeight: 700 }}>📰 இ-பேப்பர்</a></li>
          </ul>
        </div>
        <div>
          <h4>குழும இதழ்கள்</h4>
          <ul>
            <li><a href="#">முரசு வாரம்</a></li>
            <li><a href="#">முரசு சினிமா</a></li>
            <li><a href="#">முரசு சிறுவர்</a></li>
            <li><a href="#">Murasu Today</a></li>
            <li><a href="#">அரிய புத்தகங்கள்</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 மறைமலை முரசு குழுமம் · சர்வ உரிமைகளும் பாதுகாக்கப்பட்டவை</span>
        <span>தனியுரிமை · விதிமுறைகள் · குக்கீ கொள்கை</span>
      </div>
    </footer>
  );
}
