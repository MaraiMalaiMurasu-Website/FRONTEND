import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import VideoPlayer, { getYouTubeThumb, getYouTubeId } from '../components/VideoPlayer.jsx';
import { usePageContent } from '../utils/pageContent.js';
import './LawPage.css'; // shared .cat-* styles

export default function SportsPage() {
  const pc = usePageContent('sports', {
    title: 'விளையாட்டு',
    subtitle: 'கிரிக்கெட், கால்பந்து, தடகளம் — தமிழ்நாடு மற்றும் சர்வதேச விளையாட்டுகளின் முழுமையான அலசல்.',
    stats: [
      { num: '3', label: 'நேரலை போட்டிகள்' },
      { num: '247', label: 'வீடியோ அப்டேட்ஸ்' }
    ],
    // Section visibility toggles — admin can hide any section
    sections: {
      filterTabs: true, featured: true, trending: true, scoreboard: true, midAd: true,
      newsGrid: true, cricket: true, samsungBanner: true,
      starPlayers: true, schedule: true, videos: true, stats: true,
      photos: true, sidebarAd: true, bottomCta: true
    },
    filterTabs: [
      { label: 'அனைத்தும்', value: 'all', active: true },
      { label: 'கிரிக்கெட்', value: 'cricket' },
      { label: 'கால்பந்து', value: 'football' },
      { label: 'டென்னிஸ்', value: 'tennis' },
      { label: 'கபடி', value: 'kabaddi' },
      { label: 'ஜபிலி', value: 'jubilee' },
      { label: 'உலகக்கோப்பை', value: 'worldcup' }
    ],
    featured: {
      cat: 'கிரிக்கெட்',
      live: true,
      liveText: 'LIVE',
      img: '',
      bgImage: '',
      placeholder: 'STADIUM',
      score1Label: 'TN', score1: '342/6',
      score2Label: 'MUM', score2: '318/10',
      kicker: 'சிறப்பு அறிக்கை · கிரிக்கெட்',
      title: 'ரஞ்சி அரையிறுதி: தமிழ்நாடு அணி இறுதிப் போட்டிக்கு — மும்பையை 6 விக்கெட் வித்தியாசத்தில் வீழ்த்தியது',
      excerpt: 'சேப்பாக்கம் M.A. சிதம்பரம் மைதானத்தில் நடைபெற்ற அரையிறுதியில் பார்த்திவ் ஐயப்பனின் 142 ரன்கள் வெற்றியின் முதுகெலும்பாக அமைந்தது. தமிழ்நாடு 11 ஆண்டுகளுக்குப் பிறகு இறுதியை எட்டியது.',
      meta: 'விளையாட்டு டெஸ்க் · 18 நிமிடங்களுக்கு முன் · 4.2 லட்சம் பார்வைகள்',
      link: ''
    },
    trendingHead: 'நேரலை அப்டேட்ஸ்',
    trending: [
      { title: 'ரஞ்சி அரையிறுதி', meta: 'TN vs MUM · ', score: '6-1', link: '' },
      { title: 'சென்னை சாலஞ்சர்ஸ் FC', meta: 'CSK vs MI · ', score: '2', link: '' },
      { title: 'பத்மினி X அமாமன்', meta: 'IND vs ENG · ', score: '6-7 - 6', link: '' }
    ],
    scoreboardHead: 'தேசிய மற்றும் சர்வதேச',
    scoreboard: [
      { match: 'இந்திய X', score: '148 · 8.4', meta: 'காசி டி-20 / 3வது ஓவர் · 4 இனிங்ஸ்' },
      { match: 'பாகிஸ்தான்', score: '152/4 (15.2)', meta: 'காசி டி-20 / 3வது ஓவர் · 4 இனிங்ஸ்' },
      { match: 'சென்னை சாலஞ்சர்ஸ் FC', score: '2', meta: 'ஐ.எஸ்.எல் · 7வது சுற்று' }
    ],
    midAdSub: 'sports-leaderboard',
    newsHead: 'விளையாட்டு செய்திகள்', newsMore: 'மேலும் →',
    news: [
      { cat: 'விளையாட்டு', img: '', placeholder: 'CRICKET', title: 'மாஜி பாட்டர் — மிரட்சிகர 2 + படிய அமைச்சர்', meta: 'விளையாட்டு டெஸ்க் · 4 மணி', link: '' },
      { cat: 'கால்பந்து', img: '', placeholder: 'FOOTBALL', title: 'இந்தியா — இங்கிலாந்து கடைசிக்கூத்தில் — வீழ்த்தியோ 2', meta: 'விளையாட்டு டெஸ்க் · 6 மணி', link: '' },
      { cat: 'டென்னிஸ்', img: '', placeholder: 'TENNIS', title: 'பெரசி உலகம் 2026 — ரத்திற்கு டில்வுல்லும்', meta: 'விளையாட்டு டெஸ்க் · 8 மணி', link: '' },
      { cat: 'விளையாட்டு', img: '', placeholder: 'KABADDI', title: 'தடகளம் - 100 மீட்டர் ஓட்டப்பந்தயம் இறுதி', meta: 'விளையாட்டு டெஸ்க் · 10 மணி', link: '' }
    ],
    cricketHead: 'கிரிக்கெட்', cricketMore: 'அனைத்தும் காண்க →',
    cricketFeatured: {
      title: 'தமிழ்நாடு வீரர் பாரத்வாஜ் ரம்பாயய் — ரஞ்சி அரையிறுதியில் ஒன்றரை சதம், சர்வதேச அழைப்புக்கு வாய்ப்பு',
      img: '', placeholder: 'CRICKET MOMENT', meta: 'வரிசை வீரர் · 5 மணி நேரம்', link: ''
    },
    cricketList: [
      { title: 'அவ்ஸ்திரேலியா Test 2 — ஒத்துழைப்பு ஞாயற்றுக்கிழமை', meta: 'TN vs AUS', link: '' },
      { title: 'அஜித்காலன் இந்திய அணியுடன் இணைய', meta: 'விளையாட்டு டெஸ்க்', link: '' },
      { title: 'IPL ஏலத்தில் ரோடிக்கப்படும்', meta: 'IPL அப்டேட்', link: '' },
      { title: 'ஒரு நாள் சர்வதேசம் — இந்தியா X ஆஸ்திரேலியா', meta: 'TN vs AUS', link: '' },
      { title: 'வீரர்கள் சந்திப்புகளில் கடற்றை வெளிநாட்டில் சர்வதேசம்', meta: 'விளையாட்டு டெஸ்க்', link: '' }
    ],
    samsungBanner: {
      enabled: true, brand: 'Samsung', title: 'Galaxy S25 / Galaxy AI+',
      subtitle: 'Limited Period Offer', copy: 'Own at ₹53999 (1 unit)',
      ctaText: 'Own now', ctaHref: '#',
      tagline: 'No.1 SELLING ANDROID SMARTPHONE', brandRight: 'Flipkart',
      placeholder: 'SAMSUNG GALAXY S25'
    },
    starPlayersHead: 'நட்சத்திர வீரர்கள்', starPlayersMore: 'முழுவதும் →',
    starPlayers: [
      { name: 'அஜித்காலன்', desc: 'விசி கப்தர்', img: '', placeholder: 'AJINKYA', link: '' },
      { name: 'நிமேதி', desc: 'மிட்-ஃபீல்டர்', img: '', placeholder: 'NIMETHI', link: '' },
      { name: 'விராட்', desc: '4 பல்லாயன்', img: '', placeholder: 'KOHLI', link: '' },
      { name: 'ரோஹித்', desc: '8 பல்லாயன்', img: '', placeholder: 'ROHIT', link: '' }
    ],
    scheduleHead: 'போட்டி அட்டவணை',
    schedule: [
      { date: '15 மே', match: 'மலேசியாதயை X தமிழ்நாடு', meta: 'டெலி', score: '6:30 PM' },
      { date: '16 மே', match: 'ஆஸ்திரேலியா X 11', meta: 'டெலி', score: '5:30 PM' },
      { date: '18 மே', match: 'நியூசி X', meta: 'டெலி', score: '6:30 PM' },
      { date: '20 மே', match: 'விற்றிலிற்கு X', meta: 'டெலி', score: '7:00 PM' },
      { date: '22 மே', match: 'ஆஸ்திரேலியா X X', meta: 'டெலி', score: '6:30 PM' }
    ],
    videoHead: 'வீடியோ ஹைலைட்ஸ்', videoMore: 'அனைத்து வீடியோ →',
    videos: [
      { title: 'தமிழ்நாடு X மும்பை — ரஞ்சி அரையிறுதி — முக்கிய தருணங்கள்', img: '', placeholder: 'CRICKET HIGHLIGHT', duration: '05:42', link: '' },
      { title: 'ரோஹித் சர்மா — 13 ஓவர் இடி கீத் ஒன்ட்னல் தற்போதைய', img: '', placeholder: 'BATTING', duration: '04:18', link: '' },
      { title: 'ICC சாம்பியன்ஸ் டிராபி 2026 — Live தமிழில்: jiostar-ல் மட்டும்', img: '', placeholder: 'ICC TROPHY', duration: '03:12', link: '' }
    ],
    statsHead: 'புள்ளிவிபரம்',
    statsItems: [
      { num: '01', label: 'முதல் பந்தில் வெற்றிகள்', value: '247', meta: 'இந்த மாதம்', change: '+10' },
      { num: '02', label: 'சர்வதேச ரிக்கார்ட்', value: '218', meta: 'இந்த வருடம்', change: '-1' },
      { num: '03', label: 'ஐ.பி.எல் வெற்றிகள்', value: '147', meta: 'இந்த மாதம்', change: '+18' },
      { num: '04', label: 'பந்தயங்களின் சாதனைகள்', value: '108', meta: 'இந்த வருடம்', change: '-9' },
      { num: '05', label: 'நகாட்டியில் வெற்றிகள்', value: '94', meta: 'இந்த வருடம்', change: '+12' }
    ],
    photosHead: 'விளையாட்டு புகைப்படங்கள்', photosMore: 'அனைத்து புகைப்படங்கள் →',
    photos: [
      { caption: 'ஐ.பி.எல் அரங்கம்', img: '', placeholder: 'IPL STADIUM' },
      { caption: 'தமிழ்நாடு வெற்றி கொண்டாட்டம்', img: '', placeholder: 'CELEBRATION' },
      { caption: 'விராட் கோல்லாட்டம்', img: '', placeholder: 'KOHLI' }
    ],
    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'விளையாட்டு உலகின் முழுமையான அலசல் — மொத்த வாசக 14 லட்சம் முன் கொண்டுசெல்லுங்கள்',
      subtitle: 'விளையாட்டு விளம்பர திட்டங்கள் — ஸ்பான்சர்ஷிப், விளம்பரம், சிறப்பு கட்டுரைகள்',
      cta: 'விளம்பர திட்டங்கள் →', ctaHref: 'mailto:ads@maraimalaimurasu.com'
    }
  });

  const stripe = 'repeating-linear-gradient(45deg, #E8E2D2 0, #E8E2D2 12px, #F5F1E8 12px, #F5F1E8 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  const [customSports, setCustomSports] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCustomSports(parsed.filter(a => a.category === 'விளையாட்டு').map(a => ({
            cat: 'விளையாட்டு', img: a.img || '', placeholder: 'NEWS',
            title: a.title, meta: `விளையாட்டு டெஸ்க் · ${a.date}`, link: a.pdf || ''
          })));
        } catch (e) { /* ignore */ }
      } else { setCustomSports([]); }
    };
    load();
    const onChange = (e) => { if (e.key === 'customArticles') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const sec = pc.sections || {};
  const isOn = (key) => sec[key] !== false;
  const featured = pc.featured || {};
  const stats = pc.stats || [];
  const trending = pc.trending || [];
  const scoreboard = pc.scoreboard || [];
  const newsItems = [...customSports.slice(0, 2), ...(pc.news || [])].slice(0, 4);
  const cricketList = pc.cricketList || [];
  const cricketFeatured = pc.cricketFeatured || {};
  const samsung = pc.samsungBanner || {};
  const starPlayers = pc.starPlayers || [];
  const schedule = pc.schedule || [];
  const videos = pc.videos || [];
  const statsItems = pc.statsItems || [];
  const photos = pc.photos || [];
  const cta = pc.bottomCta || {};

  const [activeVideo, setActiveVideo] = useState(null);
  const playVideo = (v) => {
    if (v.link && getYouTubeId(v.link)) setActiveVideo({ url: v.link, title: v.title });
    else if (v.link) window.open(v.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cat-page" style={{ background: '#fafaf7' }}>
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

      {/* FILTER TABS */}
      {isOn('filterTabs') && (pc.filterTabs || []).length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ display: 'flex', gap: '28px', overflowX: 'auto', padding: '14px 0' }}>
            {(pc.filterTabs || []).map((t, i) => (
              <a key={i} href="#" style={{ position: 'relative', fontSize: '14px', fontWeight: 700, color: t.active ? 'var(--accent)' : 'var(--ink-2)', textDecoration: 'none', paddingBottom: '12px', whiteSpace: 'nowrap', borderBottom: t.active ? '3px solid var(--accent)' : '3px solid transparent', marginBottom: '-14px' }}>
                {t.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="cat-grid">
        <div className="cat-main">
          {isOn('featured') && (
            <a href={resolveLink(featured)} style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '20px',
              position: 'relative',
              minHeight: '440px',
              background: featured.bgImage
                ? `linear-gradient(135deg, rgba(15, 25, 22, 0.85) 0%, rgba(10, 50, 20, 0.78) 50%, rgba(80, 15, 25, 0.85) 100%), url(${featured.bgImage}) center/cover no-repeat`
                : 'linear-gradient(135deg, #0a1a14 0%, #0e3520 30%, #221a16 65%, #4a0e1a 100%)'
            }}>
              {/* Diagonal subtle pattern overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 16px)',
                pointerEvents: 'none'
              }} />

              {/* Top row: category pill + LIVE + Score box */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '28px 32px 0' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {featured.cat && (
                    <div style={{ background: 'var(--accent)', color: '#fff', padding: '7px 16px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', borderRadius: '4px' }}>
                      {featured.cat}
                    </div>
                  )}
                  {featured.live && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', padding: '7px 14px', borderRadius: '4px', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em' }}>
                      <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px #ef4444', animation: 'pulse 1.5s infinite' }}></span>
                      {featured.liveText || 'LIVE'}
                    </div>
                  )}
                </div>

                {/* Score box */}
                {(featured.score1 || featured.score2) && (
                  <div style={{ background: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '14px 24px', minWidth: '170px' }}>
                    {featured.score1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{featured.score1Label}</span>
                        <span style={{ color: '#fff', fontSize: '20px', fontWeight: 800, fontFamily: 'var(--mono)' }}>{featured.score1}</span>
                      </div>
                    )}
                    {featured.score2 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{featured.score2Label}</span>
                        <span style={{ color: '#ef4444', fontSize: '20px', fontWeight: 800, fontFamily: 'var(--mono)' }}>{featured.score2}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
              `}</style>

              {/* Content */}
              <div style={{ position: 'relative', padding: '60px 32px 32px', maxWidth: '780px' }}>
                {featured.kicker && (
                  <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '14px', textTransform: 'uppercase' }}>
                    {featured.kicker}
                  </div>
                )}
                <h2 style={{ margin: '0 0 18px 0', color: '#fff', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '36px', lineHeight: 1.15, letterSpacing: '-0.01em', textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
                  {featured.title}
                </h2>
                <p style={{ margin: '0 0 16px 0', color: '#D1D5DB', fontSize: '15px', lineHeight: 1.6, maxWidth: '720px' }}>
                  {featured.excerpt}
                </p>
                <div style={{ color: '#9CA3AF', fontSize: '12px', fontFamily: 'var(--sans)' }}>
                  {featured.meta}
                </div>
              </div>
            </a>
          )}

          {isOn('scoreboard') && scoreboard.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '14px 18px', marginBottom: '24px', marginTop: '20px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>{pc.scoreboardHead}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {scoreboard.map((s, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: '#FAFAF7', borderRadius: '6px', border: '1px solid var(--rule)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{s.match}</div>
                    <div style={{ fontSize: '15px', fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--accent)', marginBottom: '2px' }}>{s.score}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>{s.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOn('midAd') && (
            <div style={{ margin: '24px 0' }}>
              <AdSlot network="google" size="970x90" slotId="sports-mid-ad" note={pc.midAdSub} style={{ maxWidth: '100%' }} />
            </div>
          )}

          {isOn('newsGrid') && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.newsHead}</h2>
                <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.newsMore}</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {newsItems.map((n, i) => (
                  <a key={i} href={resolveLink(n)} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: n.img ? `url(${n.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)' }}>
                      {!n.img && <span>{n.placeholder}</span>}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>{n.cat}</div>
                      <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '14px', lineHeight: 1.35, color: 'var(--ink)', fontWeight: 700 }}>{n.title}</h3>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>{n.meta}</div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {isOn('cricket') && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.cricketHead}</h2>
                <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.cricketMore}</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '36px' }}>
                <a href={resolveLink(cricketFeatured)} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', aspectRatio: '16/10', background: cricketFeatured.img ? `url(${cricketFeatured.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                    {!cricketFeatured.img && <span>{cricketFeatured.placeholder}</span>}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 700, lineHeight: 1.35, color: 'var(--ink)' }}>{cricketFeatured.title}</h3>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{cricketFeatured.meta}</div>
                  </div>
                </a>
                <ol style={{ listStyle: 'none', margin: 0, padding: 0, background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px' }}>
                  {cricketList.map((c, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '10px', padding: '12px 14px', alignItems: 'baseline', borderBottom: i === cricketList.length - 1 ? 'none' : '1px solid var(--rule)' }}>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <a href={resolveLink(c)} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h5 style={{ margin: '0 0 3px 0', fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35 }}>{c.title}</h5>
                        <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{c.meta}</div>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {isOn('samsungBanner') && samsung.enabled && (
            <a href={samsung.ctaHref || '#'} style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderRadius: '10px', overflow: 'hidden', marginBottom: '36px', background: 'linear-gradient(135deg, #1428A0 0%, #001E5F 100%)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', alignItems: 'center', padding: '24px 28px', color: '#fff' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>{samsung.brand}</div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '28px', lineHeight: 1.1 }}>{samsung.title}</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', opacity: 0.85, letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' }}>{samsung.subtitle}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{samsung.copy}</div>
                  <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '4px' }}>{samsung.brandRight}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.85, textAlign: 'center', lineHeight: 1.3 }}>{samsung.tagline}</span>
                    <span style={{ background: '#fff', color: '#1428A0', padding: '10px 22px', borderRadius: '5px', fontWeight: 800, fontSize: '13px' }}>{samsung.ctaText}</span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {isOn('starPlayers') && starPlayers.length > 0 && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.starPlayersHead}</h2>
                <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.starPlayersMore}</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {starPlayers.map((p, i) => (
                  <a key={i} href={resolveLink(p)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '50%', background: p.img ? `url(${p.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)', marginBottom: '10px', border: '3px solid var(--accent)' }}>
                      {!p.img && <span>{p.placeholder}</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', textAlign: 'center' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center' }}>{p.desc}</div>
                  </a>
                ))}
              </div>

              {/* INLINE AD #2 — after Star Players */}
              <div style={{ margin: '24px 0 36px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  விளம்பரம் · SPONSORED
                </div>
                <AdSlot network="sponsor" size="970x90" slotId="sports-inline-2" note="In-feed banner · 970 × 90" style={{ maxWidth: '100%' }} />
              </div>
            </>
          )}

          {isOn('schedule') && schedule.length > 0 && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.scheduleHead}</h2>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', overflow: 'hidden', marginBottom: '36px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px 100px', padding: '10px 18px', background: '#FAFAF7', borderBottom: '1px solid var(--rule)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span>தேதி</span><span>போட்டி</span><span>இடம்</span><span style={{ textAlign: 'right' }}>நேரம்</span>
                </div>
                {schedule.map((s, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px 100px', padding: '12px 18px', borderBottom: i === schedule.length - 1 ? 'none' : '1px solid var(--rule)', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700 }}>{s.date}</span>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{s.match}</span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{s.meta}</span>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--ink)', fontWeight: 700, textAlign: 'right' }}>{s.score}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {isOn('videos') && videos.length > 0 && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.videoHead}</h2>
                <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.videoMore}</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {videos.map((v, i) => {
                  const thumb = v.img || getYouTubeThumb(v.link) || '';
                  return (
                    <button key={i} type="button" onClick={() => playVideo(v)} style={{ textAlign: 'left', border: 0, padding: 0, cursor: v.link ? 'pointer' : 'default', background: '#1A1614', borderRadius: '6px', overflow: 'hidden', display: 'block', color: 'inherit' }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', background: thumb ? `url(${thumb}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {!thumb && <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>{v.placeholder}</span>}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(200, 16, 46, 0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '26px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>▶</div>
                        </div>
                        {v.duration && (
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontFamily: 'var(--mono)' }}>{v.duration}</div>
                        )}
                      </div>
                      <div style={{ padding: '14px', color: '#F2ECE0' }}>
                        <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, lineHeight: 1.4 }}>{v.title}</h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {isOn('stats') && statsItems.length > 0 && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.statsHead}</h2>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', marginBottom: '36px' }}>
                {statsItems.map((s, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: '14px', padding: '12px 18px', alignItems: 'center', borderBottom: i === statsItems.length - 1 ? 'none' : '1px solid var(--rule)' }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{s.num}</span>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{s.label}</h4>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{s.meta}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>{s.value}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700, color: String(s.change || '').startsWith('-') ? '#C8102E' : '#0a7f3f' }}>{s.change}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {isOn('photos') && photos.length > 0 && (
            <>
              <div className="cat-section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.photosHead}</h2>
                <a href="#" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>{pc.photosMore}</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: p.img ? `url(${p.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                      {!p.img && <span>{p.placeholder}</span>}
                    </div>
                    {p.caption && (<div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--ink-2)', fontFamily: 'var(--serif)' }}>{p.caption}</div>)}
                  </div>
                ))}
              </div>

              {/* INLINE AD #3 — after photos */}
              <div style={{ margin: '24px 0 36px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  விளம்பரம் · SPONSORED
                </div>
                <AdSlot network="sponsor" size="970x90" slotId="sports-inline-3" note="In-feed banner · 970 × 90" style={{ maxWidth: '100%' }} />
              </div>
            </>
          )}

          {isOn('bottomCta') && cta && cta.title && (
            <div style={{ background: '#1A1614', color: '#F2ECE0', borderRadius: '10px', padding: '24px 28px', marginTop: '24px' }}>
              <div style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.14em', marginBottom: '12px' }}>{cta.sponsored}</div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800 }}>{cta.title}</h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', opacity: 0.85 }}>{cta.subtitle}</p>
              <a href={cta.ctaHref || '#'} style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', padding: '11px 22px', borderRadius: '5px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>{cta.cta}</a>
            </div>
          )}
        </div>

        <aside className="cat-sidebar">
          {isOn('trending') && trending.length > 0 && (
            <div className="cat-rail-block">
              <div className="cat-rail-head">{pc.trendingHead}</div>
              <ol className="cat-trending">
                {trending.map((t, i) => (
                  <li key={i}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <a href={resolveLink(t)}>
                      <h5>{t.title}</h5>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>{t.meta} <strong style={{ color: 'var(--accent)' }}>{t.score}</strong></div>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {isOn('sidebarAd') && (
            <>
              <AdSlot network="google" size="300x600" slotId="sports-sidebar" note="Google Ad Manager · Half Page" />

              {/* SIDEBAR AD #2 — 300x250 MPU */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  விளம்பரம் · SPONSORED
                </div>
                <AdSlot network="sponsor" size="300x250" slotId="sports-sidebar-2" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
              </div>

              {/* SIDEBAR AD #3 — 300x250 MPU */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  விளம்பரம் · SPONSORED
                </div>
                <AdSlot network="sponsor" size="300x250" slotId="sports-sidebar-3" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
              </div>
            </>
          )}
        </aside>
      </div>

      <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
