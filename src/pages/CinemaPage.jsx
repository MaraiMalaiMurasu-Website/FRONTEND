import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import VideoPlayer, { getYouTubeThumb, getYouTubeId } from '../components/VideoPlayer.jsx';
import { usePageContent } from '../utils/pageContent.js';
import { getCardHref, handleCardClick } from '../utils/cardLink.js';
import './LawPage.css'; // shared .cat-* styles

export default function CinemaPage() {
  const pc = usePageContent('cinema', {
    title: 'சினிமா',
    subtitle: 'திரையுலகின் முக்கிய புதுப்பிப்புகள், விமர்சனங்கள், பாக்ஸ் ஆபிஸ் மற்றும் பிரபலங்களை பற்றிய அலசல்.',
    stats: [
      { num: '248', label: 'செய்திகள் / விமர்சனங்கள்' },
      { num: '14', label: 'வீடியோ அப்டேட்ஸ்' }
    ],
    featured: {
      cat: 'POLITICS',
      img: '',
      placeholder: 'JANANAYAGAN POLITICS',
      title: 'விஜய் "லியோ 2" முதல் காட்சி டிசம்பர் 24 — ஜூபிலி கனத்தில் பெருவிழா',
      excerpt: 'எச். வினோத் இயக்கத்தில் விஜய் நடிக்கும் கடைசி திரைப்படமான \'ஜனநாயகன்\', தளபதியின் பிறந்தநாளான ஜூன் 22-ம் தேதி வெளியாகும் என எதிர்பார்க்கப்படுகிறது. அரசியல் வருகைக்காக விஜய் நடிப்புக்கு முழுக்கு போடும் நிலையில் இப்படம் முன்கூட்டியே ஆன்லைனில் கசிந்து அதிர்ச்சியை ஏற்படுத்தியதால் அதன் OTT உரிமம் ₹50 கோடியாகக் குறைந்துள்ளது.',
      meta: 'திரை டெஸ்க் · 18 நிமிடம்',
      link: ''
    },
    trendingHead: 'பிரபல சினிமா செய்திகள்',
    trending: [
      { title: 'ஜனநாயகன் – தளபதி விஜய்யின் கடைசிப்படம்', meta: 'திரை டெஸ்க்', link: '' },
      { title: 'பௌர்ணமி – கமல்ஹாசன் நடிப்பில் பிரம்மாண்ட திட்டம்', meta: 'சினிமா டெஸ்க்', link: '' },
      { title: 'Suriya – ஜான்லேராஸ்வாமி – புதிய பிரஜெக்ட் அறிவிப்பு', meta: 'திரை டெஸ்க்', link: '' },
      { title: 'All Indian – ஏ.ஆர்.ரஹ்மான் – 2 விசேஷ பாராட்டுகள்', meta: 'இசை டெஸ்க்', link: '' },
      { title: 'சர்வராஜ்காந்த நீங்கல் இற்றற்றியில் பிராடல் ஆட்டம்', meta: 'திரை டெஸ்க்', link: '' }
    ],
    midAdLabel: 'விளம்பரம் · GOOGLE ADS · AD · GOOGLE',
    midAdSize: '970 × 90',
    midAdSub: 'cinema-leaderboard',
    newsHead: 'சினிமா செய்திகள்',
    newsMore: 'மேலும் →',
    news: [
      { cat: 'சினிமா', img: '', placeholder: 'STR 49', title: 'சிம்புவின் திட்டம் 0 — STR 49 முதலில் தோற்றுக்கொடுக்க ஆனாரா?', meta: 'திரை டெஸ்க் · 2 மணி', link: '' },
      { cat: 'OTT', img: '', placeholder: 'DISNEY HOTSTAR', title: 'Disney + Hotstar — தமிழில் சுதந்திரம் தினம் OTT அப்டேட்ஸ்', meta: 'OTT டெஸ்க் · 3 மணி', link: '' },
      { cat: 'பாலிவுட்', img: '', placeholder: 'BOLLYWOOD', title: 'கபிலதேவ் இந்தியன் 3 — திரைப்படத்தில் சிக்க கட்டப் பிரிய', meta: 'பாலிவுட் டெஸ்க் · 4 மணி', link: '' },
      { cat: 'விருதுகள்', img: '', placeholder: 'AWARDS', title: 'கர்ணட்-விரிசி தேசிய விருதுகள் — கோலிவுட் விழாவில் கூட்டம்', meta: 'நிகழ்வுகள் டெஸ்க் · 6 மணி', link: '' }
    ],
    reviewsHead: 'திரைப்பட விமர்சனங்கள்',
    reviewsMore: 'அனைத்தும் காண்க →',
    reviews: [
      { cat: 'விமர்சனம்', rating: 4, img: '', placeholder: 'MARATHAM', title: 'மரதாம்', verdict: 'அதிரடி உரிய படம், புதிய சாதனை.', meta: 'விமர்சனம் — அருண் சேகர்', link: '' },
      { cat: 'விமர்சனம்', rating: 4, img: '', placeholder: 'VENNILA', title: 'வெண்ணிலா குடிசையில்', verdict: 'மலர் காதல் கதையும், நகை சுவையும் — ஒரு இடம்.', meta: 'விமர்சனம் — வெண்ணிலா', link: '' },
      { cat: 'விமர்சனம்', rating: 5, img: '', placeholder: 'KEDI', title: 'கேடி', verdict: 'பெருந்திரை விமர்சகர் பாராட்டப்பெற்ற படம்.', meta: 'விமர்சனம் — ராமன்', link: '' }
    ],
    popularHead: 'பிரபலம் இன்று',
    popularMore: 'முழுமையாக →',
    popular: [
      { role: 'நடிகர்', name: 'ரஜினிகாந்த்', desc: "'தலைவர் 172' அறிவிப்பு", descLine2: '', img: '', placeholder: 'RAJINIKANTH', featured: false, link: '' },
      { role: 'நடிகை', name: 'நயன்தாரா', desc: 'Netflix தொடரில்', descLine2: 'இணைந்தார்', img: '', placeholder: 'NAYANTHARA', featured: false, link: '' },
      { role: 'இயக்குநர்', name: 'லோகேஷ் கனகராஜ்', desc: "'லியோ 2' விழா தயாரிப்பில்", descLine2: '', img: '', placeholder: 'LOKESH', featured: true, link: '' },
      { role: 'இசை', name: 'AR ரஹ்மான்', desc: "'வீர நாடகம்' சாதனை", descLine2: '', img: '', placeholder: 'AR RAHMAN', featured: false, link: '' },
      { role: 'நடிகர்', name: 'தனுஷ்', desc: 'செல்வராகவனுடன்', descLine2: 'இணைந்தார்', img: '', placeholder: 'DHANUSH', featured: false, link: '' },
      { role: 'நடிகை', name: 'ஐஸ்வர்யா ராஜேஷ்', desc: 'திரையரங்க பயணம்', descLine2: 'சர்வதேசம்', img: '', placeholder: 'AISHWARYA', featured: false, link: '' }
    ],
    samsungBanner: {
      enabled: true,
      brand: 'Samsung',
      title: 'Galaxy S25 / Galaxy AI+',
      subtitle: 'Limited Period Offer',
      copy: 'Own at ₹53999 (1 unit)',
      ctaText: 'Own now',
      ctaHref: '#',
      tagline: 'No.1 SELLING ANDROID SMARTPHONE',
      brandRight: 'Flipkart',
      placeholder: 'SAMSUNG GALAXY S25'
    },
    videoHead: 'வீடியோ செய்திகள்',
    videoMore: 'அனைத்து வீடியோ →',
    videos: [
      { title: 'AR ரஹ்மான் — "லியோ ஓம்" பிரம்மாண்ட இசை அமைப்பு', img: '', placeholder: 'AR RAHMAN', duration: '04:32', link: '' },
      { title: 'விஜய் — அரசியல் வருகை — மக்களின் எதிர்பார்ப்பு', img: '', placeholder: 'VIJAY POLITICS', duration: '03:18', link: '' }
    ],
    boxOfficeHead: 'பாக்ஸ் ஆபிஸ் — இந்த வாரம்',
    boxOfficeMore: 'முழு அட்டவணை →',
    boxOffice: [
      { rank: '01', title: 'மரதாம்', collection: '15ம் கோடி', meta: 'திரை வசூல் / 1ம் வாரம்' },
      { rank: '02', title: 'வெண்ணிலா குடிசையில்', collection: '12ம் கோடி', meta: 'திரை வசூல் / 1ம் வாரம்' },
      { rank: '03', title: 'கேடி', collection: '218 கோடி', meta: 'திரை வசூல் / 2ம் வாரம்' },
      { rank: '04', title: 'அஞ்சாதவை 02', collection: '484 கோடி', meta: 'திரை வசூல் / 3ம் வாரம்' },
      { rank: '05', title: 'STR 49', collection: '162 கோடி', meta: 'திரை வசூல் / 1ம் வாரம்' }
    ],
    photoHead: 'புகைப்பட தொகுப்பு',
    photoMore: 'அனைத்து புகைப்படங்கள் →',
    photos: [
      { caption: 'விஜய் சினிமா பதிப்பு', img: '', placeholder: 'GALA 1' },
      { caption: 'தளபதி பிறந்தநாள் கோலாகலம்', img: '', placeholder: 'BIRTHDAY' },
      { caption: 'விரு கோபால் தனிஞ்' , img: '', placeholder: 'GALLERY' },
      { caption: 'சினிமா கூட்டம்', img: '', placeholder: 'CROWD' }
    ],
    sidebarAdLabel: 'விளம்பரம் · GOOGLE ADS · AD · GOOGLE',
    sidebarAdSize: '300 × 600',
    sidebarAdSub: 'cinema-sidebar',
    ottHead: 'OTT வெளியீடுகள்',
    ottItems: [
      { title: 'நயன்தாரா — Netflix', meta: 'திரை டெஸ்க்', link: '' },
      { title: 'R கே ஸ்டுடியோஸ்', meta: 'திரை டெஸ்க்', link: '' },
      { title: 'விஜய் — அரசியல் வருகை', meta: 'திரை டெஸ்க்', link: '' }
    ],
    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'உங்கள் திரைப்பட விளம்பரங்கள் — 14 லட்சம் சினிமா ரசிகர்கள் முன் கொண்டு செல்லுங்கள்',
      subtitle: 'திரை விளம்பர திட்டங்கள் — 6 மொழிகள், 3 பதிப்புகள், 4 நாடுகள்',
      cta: 'விளம்பர திட்டங்கள் →',
      ctaHref: 'mailto:ads@maraimalaimurasu.com'
    }
  });

  const stripe = 'repeating-linear-gradient(45deg, #E8E2D2 0, #E8E2D2 12px, #F5F1E8 12px, #F5F1E8 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  // Pull custom articles for cinema category
  const [customCinema, setCustomCinema] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCustomCinema(parsed.filter(a => a.category === 'சினிமா').map(a => ({
            cat: 'சினிமா',
            img: a.img || '',
            placeholder: 'NEWS',
            title: a.title,
            meta: `சினிமா டெஸ்க் · ${a.date}`,
            link: a.pdf || ''
          })));
        } catch (e) { /* ignore */ }
      } else {
        setCustomCinema([]);
      }
    };
    load();
    const onChange = (e) => { if (e.key === 'customArticles') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const featured = pc.featured || {};
  const stats = pc.stats || [];
  const trending = pc.trending || [];
  const newsItems = [...customCinema.slice(0, 2), ...(pc.news || [])].slice(0, 4);
  const reviews = pc.reviews || [];
  const popular = pc.popular || [];
  const videos = pc.videos || [];
  const boxOffice = pc.boxOffice || [];
  const photos = pc.photos || [];
  const samsung = pc.samsungBanner || {};
  const cta = pc.bottomCta || {};
  const ottItems = pc.ottItems || [];

  // Video modal state
  const [activeVideo, setActiveVideo] = useState(null);
  const playVideo = (v) => {
    if (v.link && getYouTubeId(v.link)) {
      // YouTube URL — open in modal
      setActiveVideo({ url: v.link, title: v.title });
    } else if (v.link) {
      // External link — open in new tab
      window.open(v.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="cat-page" style={{ background: '#fafaf7' }}>
      {/* HEADER */}
      <div className="cat-titlebar">
        <div className="cat-titlebar-inner">
          <div className="cat-title-wrap">
            <h1 className="cat-title">{pc.title}</h1>
            <p className="cat-subtitle">{pc.subtitle}</p>
          </div>
          <div className="cat-stats">
            {stats.slice(0, 2).map((s, i) => (
              <div className="cat-stat" key={i}>
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="cat-grid">
        {/* MAIN COLUMN */}
        <div className="cat-main">
          {/* FEATURED (with POLITICS pill on image) */}
          <a href={resolveLink(featured)} className="cat-featured" style={{ background: '#1A1614', color: '#F2ECE0', borderColor: '#1A1614' }}>
            <div className="cat-featured-img" style={{ background: featured.img ? `url(${featured.img}) center/cover no-repeat` : stripe, position: 'relative', minHeight: '320px' }}>
              {!featured.img && <span className="cat-img-label" style={{ color: 'var(--ink-3)' }}>{featured.placeholder || 'CINEMA'}</span>}
              {featured.cat && (
                <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'var(--accent)', color: '#fff', padding: '6px 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', borderRadius: '4px' }}>
                  {featured.cat}
                </div>
              )}
            </div>
            <div className="cat-featured-body" style={{ background: '#1A1614' }}>
              <h2 className="cat-featured-title" style={{ color: '#F2ECE0' }}>{featured.title}</h2>
              <p className="cat-featured-excerpt" style={{ color: '#C9C3B6' }}>{featured.excerpt}</p>
              <div className="cat-card-meta" style={{ color: '#8a8478' }}>{featured.meta}</div>
            </div>
          </a>

          {/* MID AD — Per-slot upload (uses cinema-mid-ad from Ad Manager) */}
          <div style={{ margin: '24px 0' }}>
            <AdSlot network="google" size="970x90" slotId="cinema-mid-ad" note={pc.midAdSub} style={{ maxWidth: '100%' }} />
          </div>

          {/* NEWS GRID (4 cards) */}
          <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.newsHead}</h2>
            <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.newsMore}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
            {newsItems.map((n, i) => (
              <a key={i} href={resolveLink(n)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '4/3', background: n.img ? `url(${n.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>
                  {!n.img && <span>{n.placeholder || (n.cat || 'NEWS').toUpperCase()}</span>}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>{n.cat}</div>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '14px', lineHeight: 1.35, color: 'var(--ink)', fontWeight: 700 }}>{n.title}</h3>
                  <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>{n.meta}</div>
                </div>
              </a>
            ))}
          </div>

          {/* REVIEWS (3 cards) */}
          <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.reviewsHead}</h2>
            <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.reviewsMore}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
            {reviews.map((r, i) => (
              <a key={i} href={resolveLink(r)} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '16/10', background: r.img ? `url(${r.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)', position: 'relative' }}>
                  {!r.img && <span>{r.placeholder}</span>}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--accent)', color: '#fff', fontSize: '9px', padding: '3px 8px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '3px' }}>{r.cat}</div>
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>{r.title}</h3>
                  <div style={{ color: '#F59E0B', fontSize: '14px', letterSpacing: '2px', marginBottom: '6px' }}>{'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}</div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{r.verdict}</p>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{r.meta}</div>
                </div>
              </a>
            ))}
          </div>

          {/* POPULAR — 6 circular avatars with role labels + 2-line descriptions */}
          <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '22px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.popularHead}</h2>
            <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.popularMore}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(6, Math.max(4, popular.length))}, 1fr)`, gap: '14px', marginBottom: '36px' }}>
            {popular.map((p, i) => (
              <a key={i} href={resolveLink(p)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                {/* Role label above avatar (e.g., "நடிகர்", "இயக்குநர்", "இசை") */}
                {p.role && (
                  <div style={{ fontSize: '10px', color: p.featured ? 'var(--accent)' : 'var(--ink-3)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {p.role}
                  </div>
                )}
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  background: p.img ? `url(${p.img}) center/cover no-repeat` : stripe,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--mono)',
                  fontSize: '11px',
                  color: 'var(--ink-3)',
                  marginBottom: '12px',
                  border: p.featured ? '3px solid var(--accent)' : '1px solid var(--rule)',
                  boxShadow: p.featured ? '0 0 0 4px rgba(200, 16, 46, 0.08), 0 8px 18px rgba(200, 16, 46, 0.15)' : 'none',
                  transition: 'transform 0.2s ease'
                }}>
                  {!p.img && <span>{p.placeholder}</span>}
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 800, color: 'var(--ink)', textAlign: 'center', marginBottom: '4px' }}>{p.name}</div>
                {p.desc && (
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.4 }}>{p.desc}</div>
                )}
                {p.descLine2 && (
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.4 }}>{p.descLine2}</div>
                )}
              </a>
            ))}
          </div>

          {/* INLINE AD between Popular and Samsung */}
          <div style={{ margin: '0 0 32px 0' }}>
            <AdSlot network="google" size="970x90" slotId="cinema-inline-1" note="Google AdSense · In-feed" style={{ maxWidth: '100%' }} />
          </div>

          {/* SAMSUNG BANNER */}
          {samsung.enabled && (
            <a href={samsung.ctaHref || '#'} style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderRadius: '10px', overflow: 'hidden', marginBottom: '36px', background: 'linear-gradient(135deg, #1428A0 0%, #001E5F 100%)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '0', alignItems: 'center', padding: '24px 28px', color: '#fff' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>{samsung.brand}</div>
                  <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '28px', lineHeight: 1.1 }}>{samsung.title}</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', opacity: 0.85, letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>{samsung.subtitle}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{samsung.copy}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '4px' }}>{samsung.brandRight}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85, textAlign: 'center', lineHeight: 1.3 }}>{samsung.tagline}</span>
                    <span style={{ background: '#fff', color: '#1428A0', padding: '10px 22px', borderRadius: '5px', fontWeight: 800, fontSize: '13px' }}>{samsung.ctaText}</span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* VIDEO NEWS */}
          <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.videoHead}</h2>
            <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.videoMore}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '36px' }}>
            {videos.map((v, i) => {
              // Use the explicit image if set, else auto-derive YouTube thumbnail from URL
              const thumb = v.img || getYouTubeThumb(v.link) || '';
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => playVideo(v)}
                  style={{ textAlign: 'left', border: 0, padding: 0, cursor: v.link ? 'pointer' : 'default', background: '#1A1614', borderRadius: '6px', overflow: 'hidden', display: 'block', color: 'inherit' }}
                >
                  <div style={{ width: '100%', aspectRatio: '16/9', background: thumb ? `url(${thumb}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {!thumb && <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>{v.placeholder}</span>}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(200, 16, 46, 0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '26px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>▶</div>
                    </div>
                    {v.duration && (
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontFamily: 'var(--mono)' }}>
                        {v.duration}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '14px', color: '#F2ECE0' }}>
                    <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, lineHeight: 1.4 }}>{v.title}</h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* BOX OFFICE LEADERBOARD */}
          <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.boxOfficeHead}</h2>
            <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.boxOfficeMore}</a>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', marginBottom: '36px' }}>
            {boxOffice.map((b, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: '14px', padding: '12px 18px', alignItems: 'center', borderBottom: i === boxOffice.length - 1 ? 'none' : '1px solid var(--rule)' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>{b.rank}</span>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{b.title}</h4>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{b.meta}</div>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{b.collection}</span>
              </div>
            ))}
          </div>

          {/* INLINE AD between Box Office and Photo Gallery */}
          <div style={{ margin: '0 0 32px 0' }}>
            <AdSlot network="meta" size="970x90" slotId="cinema-inline-2" note="Meta Audience Network · In-feed" style={{ maxWidth: '100%' }} />
          </div>

          {/* PHOTO GALLERY (2x2 grid) */}
          <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.photoHead}</h2>
            <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.photoMore}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '36px' }}>
            {photos.map((p, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: p.img ? `url(${p.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                  {!p.img && <span>{p.placeholder}</span>}
                </div>
                {p.caption && (
                  <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--ink-2)', fontFamily: 'var(--serif)' }}>{p.caption}</div>
                )}
              </div>
            ))}
          </div>

          {/* BOTTOM CTA */}
          {cta && cta.title && (
            <div style={{ background: '#1A1614', color: '#F2ECE0', borderRadius: '10px', padding: '24px 28px', marginTop: '24px' }}>
              <div style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.14em', marginBottom: '12px' }}>{cta.sponsored}</div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800 }}>{cta.title}</h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', opacity: 0.85 }}>{cta.subtitle}</p>
              <a href={cta.ctaHref || '#'} style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', padding: '11px 22px', borderRadius: '5px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>{cta.cta}</a>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="cat-sidebar">
          {/* TRENDING */}
          {trending.length > 0 && (
            <div className="cat-rail-block">
              <div className="cat-rail-head">{pc.trendingHead}</div>
              <ol className="cat-trending">
                {trending.map((t, i) => (
                  <li key={i}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <a href={resolveLink(t)}>
                      <h5>{t.title}</h5>
                      {t.meta && <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>{t.meta}</div>}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* SIDEBAR AD 300x600 (per-slot from Ad Manager) */}
          <AdSlot network="google" size="300x600" slotId="cinema-sidebar" note={pc.sidebarAdSub} />

          {/* OTT RELEASES */}
          {ottItems.length > 0 && (
            <div className="cat-rail-block">
              <div className="cat-rail-head">{pc.ottHead}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: '8px 18px 14px' }}>
                {ottItems.map((o, i) => (
                  <li key={i} style={{ padding: '10px 0', borderBottom: i === ottItems.length - 1 ? 'none' : '1px solid var(--rule)' }}>
                    <a href={resolveLink(o)} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h5 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{o.title}</h5>
                      {o.meta && <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>{o.meta}</div>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* EXTRA SIDEBAR ADS — fill empty space below OTT */}
          <AdSlot network="google" size="300x250" slotId="cinema-sidebar-2" note="Google AdSense · Rectangle" />
          <AdSlot network="meta" size="300x600" slotId="cinema-sidebar-3" note="Meta Audience Network · Half Page" />

          {/* NEW SIDEBAR AD — next to வீடியோ செய்திகள் (Video News) */}
          <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginTop: '20px', marginBottom: '8px' }}>
            ஆதரவாளர் விளம்பரம் · வீடியோ
          </div>
          <AdSlot network="sponsor" size="300x600" slotId="cinema-sidebar-4" note="Half Page · 300 × 600 (next to Video News)" style={{ maxWidth: '100%' }} />

          {/* NEW SIDEBAR AD — next to பாக்ஸ் ஆபிஸ் (Box Office) */}
          <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginTop: '20px', marginBottom: '8px' }}>
            ஆதரவாளர் விளம்பரம் · பாக்ஸ் ஆபிஸ்
          </div>
          <AdSlot network="sponsor" size="300x250" slotId="cinema-sidebar-5" note="Rectangle · 300 × 250 (next to Box Office)" style={{ maxWidth: '100%' }} />

          {/* NEW SIDEBAR AD — next to புகைப்பட தொகுப்பு (Photo Gallery) */}
          <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginTop: '20px', marginBottom: '8px' }}>
            ஆதரவாளர் விளம்பரம் · புகைப்படம்
          </div>
          <AdSlot network="sponsor" size="300x600" slotId="cinema-sidebar-6" note="Half Page · 300 × 600 (next to Photo Gallery)" style={{ maxWidth: '100%' }} />
        </aside>
      </div>

      {/* Inline YouTube/video player modal */}
      <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
