import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import { usePageContent } from '../utils/pageContent.js';
import { getCardHref, handleCardClick } from '../utils/cardLink.js';
import './LawPage.css'; // Reuse law-* styles for titlebar, hero, stream, sidebar

export default function HeadlinesPage() {
  const pc = usePageContent('headlines', {
    eyebrow: 'தலைப்புச் செய்திகள் · LIVE',
    title: 'தலைப்புச் செய்திகள்',
    subtitle: 'தினசரி தலைம, தேசம் மற்றும் தமிழகத்தில் இருந்து இறுதி நிமிடம் வரை — தேர்தெடுத்த, சரிபார்த்த செய்திகள்.',
    stats: [
      { num: '234', label: 'செய்திகள்' },
      { num: '6.4கோ', label: 'வாசகர்கள்' },
      { num: '76', label: 'எண்ணம்' },
      { num: '42', label: 'நாட்கள் முதல்' }
    ],
    featured: {
      cat: 'முதல்வரை செய்',
      img: '',
      placeholder: 'ALLIANCE PRESS MEET',
      title: 'தமிழக சட்டப்பேரவை தேர்தல் 2026: வேட்பாளர் பட்டியல் இன்று மாலை வெளியீடு',
      excerpt: 'ஒன்பது நாட்கள் நீடித்த அரசியல் கூட்டணி பேச்சுவார்த்தைகள் முடிவுக்கு வந்துள்ளன. திமுக 184 தொகுதிகளில் வேட்பாளர்களை நிறுத்தும். அதிமுக கூட்டணியில் பாஜகவுக்கு 22 தொகுதிகள் ஒதுக்கப்பட்டுள்ளதாக ஆதாரபூர்வ தகவல்கள் தெரிவிக்கின்றன.',
      meta: 'டெல்லி டெஸ்க் · 8 நிமிடம் · 5 நிமி வாசிப்பு',
      stampTime: '16:39'
    },
    secondary: [
      { cat: 'டெல்லி டெஸ்க்', img: '', placeholder: 'PARLIAMENT', title: 'மக்களவையில் காவல்துறை சீர்திருத்த மகாதோ நிறைவேற்றம்', meta: 'டெல்லி டெஸ்க் · 1 மணி நேரம்' },
      { cat: 'சர்வதேச டெஸ்க்', img: '', placeholder: 'FIRST SUMMIT', title: 'இந்தியா–ஜப்பான் வர்த்தக ஒப்பந்தம்: டோக்கியோ உச்சிமாநாடு', meta: 'சர்வதேச டெஸ்க் · 2 மணி நேரம்' }
    ],
    newsletterMain: {
      title: 'செய்திகள்',
      subtitle: 'முக்கிய காலையும் முக்கிய செய்திகள், கருத்துகள் — நேரடியாக உங்கள் இன்பாக்ஸுக்கு.',
      placeholder: 'உங்கள் மின்னஞ்சல் முகவரி...',
      buttonText: 'சந்தாதாரர் ஆகுக'
    },
    leaderboardLabel: 'விளம்பரம் · SPONSORED',
    leaderboardSize: '970 × 160',
    leaderboardText: 'Brand Lockup • 970 × 160 • In-feed',
    sectionHead: 'நேரடி செய்திச் சுருக்கம்',
    sectionMore: 'அனைத்தும் காண்க ›',
    stream: [
      { time: '11:42', cat: 'அரசியல்', title: 'திமுக கூட்டணியில் காங்கிரசுக்கு 24 தொகுதிகள் ஒதுக்கீடு', meta: 'டெல்லி டெஸ்க்' },
      { time: '11:18', cat: 'பொருளாதாரம்', title: 'ரூபாய் மதிப்பு டாலருக்கு எதிராக 83.42 ஆக சரிவு — RBI தலையிட எதிர்பார்ப்பு', meta: 'மும்பை டெஸ்க்' },
      { time: '10:54', cat: 'விளையாட்டு', title: 'ஐபிஎல் ஏலம்: ருத்ராக்ஷ் பாட்டீலுக்கு ₹14 கோடி — சிஎஸ்கேவில் சேர்ந்தார்', meta: 'விளையாட்டு டெஸ்க்' },
      { time: '10:30', cat: 'தமிழகம்', title: 'சென்னை விமான நிலையத்தில் புதிய டெர்மினல் — பிரதமர் திறப்பு', meta: 'சென்னை டெஸ்க்' },
      { time: '10:12', cat: 'சுற்றுச்சூழல்', title: 'டெல்லி காற்று மாசு குறைப்புக்கான பேரவை அமலாக்கச் சட்டம்', meta: 'டெல்லி டெஸ்க்' },
      { time: '09:48', cat: 'சினிமா', title: 'விஜய் — \'லியோ 2\' முதல் காட்சி டிசம்பர் 24-ல் ரிலீஸ்', meta: 'சினிமா டெஸ்க்' },
      { time: '09:24', cat: 'தமிழகம்', title: 'மதுரை–திருநெல்வேலி நெடுஞ்சாலையில் கோர விபத்து — 6 பேர் பலி', meta: 'தமிழக டெஸ்க்' },
      { time: '09:02', cat: 'அரசியல்', title: 'முதல் முறை வாக்காளர்கள் 18 லட்சம் — இளைஞர் பங்கேற்பு உச்சம்', meta: 'டெல்லி டெஸ்க்' },
      { time: '08:38', cat: 'அறிவியல்', title: 'கானூரி: சுற்றுலாப் பயணிகள் எண்ணிக்கை 50% அதிகரிப்பு', meta: 'அறிவியல் டெஸ்க்' },
      { time: '08:14', cat: 'பொருளாதாரம்', title: 'சென்செக்ஸ் 412 புள்ளிகள் சரிவு — ஐடி பங்குகள் ஆதிக்கம்', meta: 'மும்பை டெஸ்க்' }
    ],
    loadMore: 'மேலும் ஏற்றவும்',
    midAdLabel: 'விளம்பரம் · SPONSORED',
    midAdSize: '970 × 160',
    midAdText: 'Brand lockup • in-feed unit',
    photoStoryHead: 'இன்றைய படக் கதை',
    photoStoryMore: 'நாளின் சிறந்த புகைப்படங்கள் — காட்சிகள் காட்சிகளாக.',
    photoStory: [
      { img: '', placeholder: 'VICTORY 1', caption: 'சேப்பாக்கம் கிரிக்கெட் மைதானத்தில் வெற்றி கொண்டாடும் தமிழ்நாடு ரஞ்சி அணி' },
      { img: '', placeholder: 'PARLIAMENT', caption: 'டெல்லி மக்களவை வளாகத்தில் காற்று மாசு குறைப்பு மசோதாவின் வாக்கெடுப்பு' },
      { img: '', placeholder: 'TEMPLE', caption: 'மதுரை மீனாட்சி அம்மன் கோயிலில் தைப்பூச திருவிழா கூட்டம்' },
      { img: '', placeholder: 'TERMINAL', caption: 'சென்னை விமான நிலையத்தில் புதிய பயணிகள் முனையம்' }
    ],
    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'உங்கள் வணிகம் — மறைமலை முரசு வாசகர்களை சென்றடையுங்கள்',
      subtitle: 'தினசரி 14 லட்சம் வாசகர்கள் · 6 பதிப்புகள் · அனைத்து பகுதிகளிலும்',
      cta: 'விளம்பர திட்டங்கள் →',
      ctaHref: 'mailto:ads@maraimalaimurasu.com',
      placeholder: 'SPONSOR'
    },
    mostReadHead: 'அதிகம் வாசிக்கப்பட்டவை',
    mostRead: [
      { title: 'திமுக கூட்டணியில் காங்கிரசுக்கு 24 தொகுதிகள் ஒதுக்கீடு', meta: 'டெல்லி டெஸ்க்', link: '' },
      { title: 'ரூபாய் மதிப்பு டாலருக்கு எதிராக 83.42 ஆக சரிவு — RBI தலையிட எதிர்பார்ப்பு', meta: 'மும்பை டெஸ்க்', link: '' },
      { title: 'ஐபிஎல் ஏலம்: ருத்ராக்ஷ் பாட்டீலுக்கு ₹14 கோடி — சிஎஸ்கேவில் சேர்ந்தார்', meta: 'விளையாட்டு டெஸ்க்', link: '' },
      { title: 'இலையை வீரர்கள் நிலையத்தில் புதிய டெர்மினல் — பிரதமர் திறப்பு', meta: 'சென்னை டெஸ்க்', link: '' },
      { title: 'டெல்லி காற்று மாசு குறைப்புக்கான பேரவை அமலாக்கச் சட்டம்', meta: 'டெல்லி டெஸ்க்', link: '' }
    ],
    opinionHead: 'கருத்து · கட்டுரை',
    opinionItems: [
      { cat: 'கட்டுரை · கட்டுரை', title: 'சென்னை வாக்காளர் திரைக்கும் தீர்தலும் — புதிய காலம், புதிய எதிர்பார்ப்பு', meta: 'கட்டுரையாளர்: ஆசிரியர் குழு' },
      { cat: 'கட்டுரை', title: 'பாருண்ணை பீட்டோமாரை வேலையின்மை எதிர்நாடிகளை எப்படி காக்கிறது', meta: 'கட்டுரையாளர்: பேட்டர்' },
      { cat: 'கட்டுரை', title: 'OTT-வின் காலம்: தமிழ் சினிமா எங்கே நிற்கிறது?', meta: 'கட்டுரையாளர்: அருண்' }
    ],
    marketsHead: 'சந்தைச் சுருக்கம்',
    markets: [
      { name: 'SENSEX', value: '74,218', change: '▲ 412', dir: 'up' },
      { name: 'NIFTY', value: '22,586', change: '▲ 118', dir: 'up' },
      { name: 'USD/INR', value: '83.42', change: '▲ சரிவு', dir: 'dn' },
      { name: 'தங்கம் 24K', value: '₹74,820', change: '▲ 220', dir: 'up' },
      { name: 'வெள்ளி', value: '₹92,488', change: 'நிலையா (44) /1', dir: 'up' }
    ],
    railNewsletter: {
      head: 'செய்தி மடல்',
      copy: 'காலையிலும் தினசரி தினசரி செய்திகள் தொகுப்பு — உங்கள் இன்பாக்ஸுக்கு.',
      placeholder: 'மின்னஞ்சல் முகவரி...',
      button: 'சேர'
    },
    sideAdLabel: 'விளம்பரம்',
    sideAdSize: '300 × 600'
  });

  const [customHeadlines, setCustomHeadlines] = useState([]);

  useEffect(() => {
    const loadCustom = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map((a, i) => ({
          time: `0${i + 8}:00`.slice(-5),
          cat: a.category || 'தலைப்புச் செய்திகள்',
          img: a.img || '',
          title: a.title,
          meta: `சமீபத்திய · ${a.date}`,
          link: a.pdf || ''
        }));
        setCustomHeadlines(formatted);
      } else {
        setCustomHeadlines([]);
      }
    };
    loadCustom();
    const onChange = (e) => { if (e.key === 'customArticles') loadCustom(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const featured = pc.featured || {};
  const stats = pc.stats || [];
  const secondary = pc.secondary || [];
  const streamItems = [...customHeadlines.slice(0, 3), ...(pc.stream || [])];
  const mostRead = pc.mostRead || [];
  const opinionItems = pc.opinionItems || [];
  const markets = pc.markets || [];
  const photoStory = pc.photoStory || [];
  const bottomCta = pc.bottomCta || {};
  const newsletterMain = pc.newsletterMain || {};
  const railNewsletter = pc.railNewsletter || {};

  const stripe = 'repeating-linear-gradient(45deg, #E8E2D2 0, #E8E2D2 12px, #F5F1E8 12px, #F5F1E8 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  return (
    <div className="law-page">
      {/* ============ TOP HEADER (black) ============ */}
      <div className="law-titlebar">
        <div className="law-titlebar-inner">
          <div>
            <div className="law-eyebrow">{pc.eyebrow}</div>
            <h1>{pc.title}</h1>
            <p className="law-subtitle">{pc.subtitle}</p>
          </div>
          <div className="law-stats">
            {stats.map((s, i) => (
              <div className="law-stat" key={i}>
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MAIN GRID ============ */}
      <div className="law-grid">
        {/* LEFT */}
        <div className="law-main">
          {/* FEATURED */}
          <div className="law-hero">
            <a href={resolveLink(featured)} className="law-hero-image" style={{ background: featured.img ? `url(${featured.img}) center/cover no-repeat` : stripe }}>
              {featured.img && <img src={featured.img} alt={featured.title} />}
              {!featured.img && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--ink-3)', letterSpacing: '0.15em' }}>
                  {featured.placeholder || 'IMAGE'}
                </div>
              )}
              {featured.cat && <div className="law-category-pill">{featured.cat}</div>}
              {featured.stampTime && (
                <div className="law-live-box">
                  <div className="law-live-time" style={{ fontSize: '20px' }}>{featured.stampTime}</div>
                </div>
              )}
            </a>
            <div className="law-hero-content">
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="law-meta">{featured.meta}</div>
            </div>
          </div>

          {/* SECONDARY (2 cards side by side) */}
          <div className="law-secondary">
            {secondary.map((article, idx) => (
              <a
                href={article.link && article.link.trim() ? article.link.trim() : getCardHref(article)}
                onClick={(e) => { if (!article.link) handleCardClick(e, article); }}
                className="law-card"
                key={idx}
              >
                <div className="law-card-image" style={{ background: article.img ? undefined : stripe, position: 'relative' }}>
                  {article.img && <img src={article.img} alt={article.title} />}
                  {!article.img && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>
                      {article.placeholder || 'IMAGE'}
                    </div>
                  )}
                  {article.cat && <div className="law-category-pill small">{article.cat}</div>}
                </div>
                <h3>{article.title}</h3>
                <div className="law-meta">{article.meta}</div>
              </a>
            ))}
          </div>

          {/* INLINE AD #2 — between secondary cards and newsletter */}
          <div style={{ margin: '20px 0' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              விளம்பரம் · SPONSORED
            </div>
            <AdSlot network="sponsor" size="970x350" slotId="headlines-inline-2" note="In-feed Billboard · 970 × 350" style={{ maxWidth: '100%' }} />
          </div>

          {/* MAIN NEWSLETTER BANNER */}
          {newsletterMain && newsletterMain.title && (
            <div style={{ background: '#F5F1E8', border: '1px solid var(--rule)', borderRadius: '8px', padding: '24px 28px', margin: '24px 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>{newsletterMain.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{newsletterMain.subtitle}</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); alert('நன்றி!'); }} style={{ display: 'flex', gap: '8px' }}>
                <input type="email" placeholder={newsletterMain.placeholder} required style={{ flex: 1, padding: '11px 14px', border: '1px solid var(--rule)', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }} />
                <button type="submit" style={{ padding: '11px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{newsletterMain.buttonText}</button>
              </form>
            </div>
          )}

          {/* LEADERBOARD AD — uses per-slot upload from Admin → Ad Manager */}
          <div style={{ borderTop: '3px solid var(--accent)', borderBottom: '3px solid var(--accent)', padding: '18px 0', margin: '24px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase' }}>
              <span>{pc.leaderboardLabel}</span>
              <span>970 × 160</span>
            </div>
            <AdSlot network="sponsor" size="970x350" slotId="headlines-leaderboard" note={pc.leaderboardText || 'Brand Lockup · Tall Billboard'} style={{ maxWidth: '100%' }} />
          </div>

          {/* SECTION HEAD */}
          <div className="law-section-head">
            <h2>
              {pc.sectionHead}
              <span className="law-live-dot"></span>
            </h2>
            <div className="law-more">{pc.sectionMore}</div>
          </div>

          {/* STREAM */}
          <div className="law-stream">
            <ul className="law-stream-list">
              {streamItems.slice(0, 10).map((article, idx) => (
                <li key={idx}>
                  <a
                    href={article.link && article.link.trim() ? article.link.trim() : getCardHref(article)}
                    onClick={(e) => { if (!article.link) handleCardClick(e, article); }}
                  >
                    <div className="law-time">{article.time}</div>
                    <span className="law-chip">{article.cat}</span>
                    <h4>{article.title}</h4>
                    <div className="law-meta">{article.meta}</div>
                  </a>
                </li>
              ))}
            </ul>
            <button className="law-loadmore">{pc.loadMore}</button>
          </div>

          {/* MID AD — uses per-slot upload from Admin → Ad Manager */}
          <div style={{ margin: '24px 0' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {pc.midAdLabel}
            </div>
            <AdSlot network="sponsor" size="970x350" slotId="headlines-mid-ad" note={pc.midAdText || 'Brand lockup · Tall Billboard 970 × 350'} style={{ maxWidth: '100%' }} />
          </div>

          {/* INLINE AD #3 — extra mid-feed unit */}
          <div style={{ margin: '24px 0' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              விளம்பரம் · SPONSORED
            </div>
            <AdSlot network="sponsor" size="970x350" slotId="headlines-inline-3" note="In-feed Billboard · 970 × 350" style={{ maxWidth: '100%' }} />
          </div>

          {/* PHOTO STORY — now with tall ad box on the right side */}
          {photoStory.length > 0 && (
            <section style={{ marginTop: '32px' }}>
              <div className="law-section-head" style={{ marginBottom: '20px' }}>
                <h2>{pc.photoStoryHead}<span className="law-live-dot"></span></h2>
                <div className="law-more">{pc.photoStoryMore}</div>
              </div>
              {/* 3-column layout: big photo | stacked photos | tall ad */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 300px', gap: '16px', alignItems: 'stretch' }}>
                {/* Big left photo */}
                {photoStory[0] && (
                  <a href={resolveLink(photoStory[0])} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ flex: 1, minHeight: '720px', background: photoStory[0].img ? `url(${photoStory[0].img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)', letterSpacing: '0.15em' }}>
                      {!photoStory[0].img && <span>{photoStory[0].placeholder}</span>}
                    </div>
                    {photoStory[0].caption && (
                      <div style={{ padding: '12px 4px 0', fontSize: '13px', color: 'var(--ink-2)', fontFamily: 'var(--serif)', lineHeight: 1.4 }}>{photoStory[0].caption}</div>
                    )}
                  </a>
                )}
                {/* Middle column (stacked photos) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {photoStory.slice(1).map((p, i) => (
                    <a key={i} href={resolveLink(p)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', flex: 1 }}>
                      <div style={{ width: '100%', aspectRatio: '16/10', background: p.img ? `url(${p.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>
                        {!p.img && <span>{p.placeholder}</span>}
                      </div>
                      {p.caption && (
                        <div style={{ padding: '10px 4px 0', fontSize: '12px', color: 'var(--ink-2)', fontFamily: 'var(--serif)', lineHeight: 1.4 }}>{p.caption}</div>
                      )}
                    </a>
                  ))}
                </div>
                {/* Right column — TALL ad box matching the photo story height */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    விளம்பரம் · SPONSORED
                  </div>
                  <AdSlot
                    network="sponsor"
                    size="300x900"
                    slotId="headlines-photo-story-side"
                    note="Tall Skyscraper · 300 × 900"
                    style={{ maxWidth: '100%', flex: 1, height: '100%' }}
                  />
                </div>
              </div>
            </section>
          )}

          {/* BOTTOM CTA (உங்கள் வணிகம்) */}
          {bottomCta && bottomCta.title && (
            <section style={{ marginTop: '32px', borderTop: '3px solid var(--accent)', borderBottom: '3px solid var(--accent)', padding: '20px 0' }}>
              <div style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px' }}>
                {bottomCta.sponsored}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '24px', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  background: bottomCta.image
                    ? `url(${bottomCta.image}) center/cover no-repeat`
                    : stripe,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  color: 'var(--ink-3)',
                  letterSpacing: '0.15em',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  {!bottomCta.image && bottomCta.placeholder}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3 }}>{bottomCta.title}</h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink-2)' }}>{bottomCta.subtitle}</p>
                  <a href={bottomCta.ctaHref || '#'} style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>{bottomCta.cta}</a>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ============ RIGHT SIDEBAR ============ */}
        <aside className="law-sidebar">
          {/* MOST READ */}
          {mostRead.length > 0 && (
            <div className="law-sidebar-block">
              <div className="law-sidebar-head">{pc.mostReadHead}</div>
              <ol className="law-most-read">
                {mostRead.map((item, i) => (
                  <li key={i}>
                    <a href={resolveLink(item)} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <h5>{item.title}</h5>
                      {item.meta && <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>{item.meta}</div>}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* OPINION / EDITORIAL */}
          {opinionItems.length > 0 && (
            <div className="law-sidebar-block">
              <div className="law-sidebar-head">{pc.opinionHead}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: '14px 18px' }}>
                {opinionItems.map((o, i) => (
                  <li key={i} style={{ padding: '12px 0', borderBottom: i === opinionItems.length - 1 ? 'none' : '1px dashed var(--rule)' }}>
                    <div style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '4px' }}>{o.cat}</div>
                    <h5 style={{ margin: '0 0 4px 0', fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '13px', lineHeight: 1.35, color: 'var(--ink)' }}>{o.title}</h5>
                    {o.meta && <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{o.meta}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* MARKETS */}
          {markets.length > 0 && (
            <div className="law-sidebar-block">
              <div className="law-sidebar-head">{pc.marketsHead}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: '8px 18px 14px' }}>
                {markets.map((m, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 0', borderBottom: i === markets.length - 1 ? 'none' : '1px solid var(--rule)', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13px', fontFamily: 'var(--serif)', fontWeight: 600, color: 'var(--ink)' }}>{m.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{m.value}</div>
                      <div style={{ fontSize: '11px', color: m.dir === 'up' ? '#0a7f3f' : '#C8102E' }}>{m.change}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* RAIL NEWSLETTER */}
          {railNewsletter && railNewsletter.head && (
            <div className="law-sidebar-block">
              <div className="law-sidebar-head">{railNewsletter.head}</div>
              <div style={{ padding: '14px 18px 18px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{railNewsletter.copy}</p>
                <form onSubmit={(e) => { e.preventDefault(); alert('நன்றி!'); }} style={{ display: 'flex', gap: '6px' }}>
                  <input type="email" placeholder={railNewsletter.placeholder} required style={{ flex: 1, padding: '9px 11px', border: '1px solid var(--rule)', borderRadius: '5px', fontSize: '12px', fontFamily: 'inherit' }} />
                  <button type="submit" style={{ padding: '9px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>{railNewsletter.button}</button>
                </form>
              </div>
            </div>
          )}

          {/* SIDE AD (300 x 600) — primary sidebar slot */}
          <div className="law-sidebar-block" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {pc.sideAdLabel || 'விளம்பரம்'}
            </div>
            <AdSlot network="sponsor" size="300x600" slotId="headlines-sidebar-1" note="Half Page · 300 × 600" style={{ maxWidth: '100%' }} />
          </div>

          {/* SIDEBAR AD #2 (300x250 MPU) */}
          <div className="law-sidebar-block" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              விளம்பரம் · SPONSORED
            </div>
            <AdSlot network="sponsor" size="300x250" slotId="headlines-sidebar-2" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
          </div>

          {/* SIDEBAR AD #3 (300x250 MPU) */}
          <div className="law-sidebar-block" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              விளம்பரம் · SPONSORED
            </div>
            <AdSlot network="sponsor" size="300x250" slotId="headlines-sidebar-3" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
          </div>

          {/* SIDEBAR AD #4 (300x600 tall — fills the long empty space) */}
          <div className="law-sidebar-block" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              ஆதரவாளர் விளம்பரம்
            </div>
            <AdSlot network="sponsor" size="300x600" slotId="headlines-sidebar-4" note="Half Page · 300 × 600" style={{ maxWidth: '100%' }} />
          </div>

          {/* SIDEBAR AD #5 (300x600 tall — keeps the column filled till page bottom) */}
          <div className="law-sidebar-block" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              ஆதரவாளர் விளம்பரம்
            </div>
            <AdSlot network="sponsor" size="300x600" slotId="headlines-sidebar-5" note="Half Page · 300 × 600" style={{ maxWidth: '100%' }} />
          </div>

          {/* SIDEBAR AD #6 (300x250 MPU — bottom anchor) */}
          <div className="law-sidebar-block" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
              விளம்பரம் · SPONSORED
            </div>
            <AdSlot network="sponsor" size="300x250" slotId="headlines-sidebar-6" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
          </div>
        </aside>
      </div>
    </div>
  );
}
