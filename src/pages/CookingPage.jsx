import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import VideoPlayer, { getYouTubeThumb, getYouTubeId } from '../components/VideoPlayer.jsx';
import { usePageContent } from '../utils/pageContent.js';
import './LawPage.css'; // shared .cat-* styles

export default function CookingPage() {
  const pc = usePageContent('cooking', {
    title: 'சமையல்',
    subtitle: 'பாரம்பரிய தமிழ் சமையல், ஆரோக்கிய உணவுகள், செய்முறை மற்றும் வீடியோ பயிற்சிகள்.',
    sections: {
      filterTabs: true, featured: true, trending: true, midAd: true,
      recipesGrid: true, sidebarAd1: true, traditional: true,
      breakfast: true, lunch: true, sidebarAd2: true, sweets: true,
      metaAd: true, healthy: true, videos: true, stepByStep: true,
      gallery: true, bottomCta: true
    },
    filterTabs: [
      { label: 'அனைத்தும்', value: 'all', target: 'top', active: true },
      { label: 'பாரம்பரியம்', value: 'traditional', target: 'sec-traditional' },
      { label: 'காலை உணவு', value: 'breakfast', target: 'sec-breakfast' },
      { label: 'மதிய & இரவு', value: 'lunch', target: 'sec-lunch' },
      { label: 'ஸ்நாக்ஸ்', value: 'snacks', target: 'sec-recipes' },
      { label: 'இனிப்பு', value: 'sweets', target: 'sec-sweets' },
      { label: 'ஆரோக்யம்', value: 'healthy', target: 'sec-healthy' },
      { label: 'திருவிழா', value: 'festival', target: 'sec-gallery' },
      { label: 'ஸ்ட்ரீட் ஃபுட்', value: 'streetfood', target: 'sec-videos' }
    ],
    featured: {
      cat: 'சிறப்பு செய்முறை', img: '', bgImage: '', placeholder: 'CHETTINAD CHICKEN',
      kicker: '🍛 சிறப்பு செய்முறை',
      title: 'செட்டிநாடு சிக்கன் குழம்பு — 1947 முதல் வந்த உண்மையான கோராக்குடி குறிப்பு. 25 மசாலாக்கள்',
      excerpt: 'காரசாரமான செட்டிநாட்டு சிக்கன் குழம்பு — பாரம்பரிய மசாலா கலவை, புதிய தேங்காய், சீரகம் மற்றும் மிளகுடன் சுவையாக.',
      meta: 'சமையல் டெஸ்க் · 1 மணி நேரம் · 25 பாடல்களோடும்', link: ''
    },
    trendingHead: '5 முக்கியமான சமையல்',
    trending: [
      { title: 'சேப்பாக்கம் பெரியம் — 5 மாதங்களா', meta: 'சமையல் டெஸ்க்', link: '' },
      { title: 'வரம் சுவையை — பாரம்பரிய', meta: 'சமையல் டெஸ்க்', link: '' },
      { title: 'இந்திய — சைவ பின்னாலே', meta: 'சமையல் டெஸ்க்', link: '' },
      { title: 'பகுதி-2: மஞ்சள் பெட்டிய்', meta: 'சமையல் டெஸ்க்', link: '' },
      { title: 'எளிய காப்பி குடிப்பு செய்முறை', meta: 'சமையல் டெஸ்க்', link: '' }
    ],
    recipesHead: 'சமையல் குறிப்புகள்', recipesMore: 'மேலும் →',
    recipes: [
      { cat: 'சைவம்', icon: '🍲', img: '', placeholder: 'CURRY', title: 'சேப்பாக்கம் மட்டன் — 5 ருசிகளும்', meta: 'சமையல் டெஸ்க் · 2 மணி', link: '' },
      { cat: 'காரம்', icon: '🍛', img: '', placeholder: 'BIRYANI', title: 'மலையாள பிரியாணி — 5 ருசிகள்', meta: 'சமையல் டெஸ்க் · 3 மணி', link: '' },
      { cat: 'தண்ணீர்', icon: '🥣', img: '', placeholder: 'SOUP', title: 'வெண்ணெய் காய்கறி சாதம் — 30 நிமி', meta: 'சமையல் டெஸ்க் · 4 மணி', link: '' },
      { cat: 'பழம்', icon: '🍇', img: '', placeholder: 'FRUITS', title: 'பாலினம் சாதம் — பழ ரசம்', meta: 'சமையல் டெஸ்க் · 5 மணி', link: '' },
      { cat: 'வேப்பம்', icon: '🌿', img: '', placeholder: 'HERB', title: 'வேப்பம் சாதம் — காய் மருந்து', meta: 'சமையல் டெஸ்க் · 6 மணி', link: '' },
      { cat: 'பானம்', icon: '🥤', img: '', placeholder: 'DRINK', title: 'எளிய தண்ணீர் பானம் — செயல்', meta: 'சமையல் டெஸ்க் · 7 மணி', link: '' },
      { cat: 'காரம்', icon: '🌶', img: '', placeholder: 'SPICY', title: 'காரசாரம் சாம்பல் — காரம் ருசி', meta: 'சமையல் டெஸ்க் · 8 மணி', link: '' },
      { cat: 'இனிப்பு', icon: '🍯', img: '', placeholder: 'SWEET', title: 'பெருங்கல் தீப் — இனிப்பு ருசி', meta: 'சமையல் டெஸ்க் · 9 மணி', link: '' }
    ],
    traditionalHead: 'பாரம்பரிய சமையல்', traditionalMore: 'மேலும் →',
    traditionalFeatured: {
      title: 'காரக்கூட்டு சீரகம் — மிக புரட்சிக்கூட்டு குழம்பு செட்டிநாடு வீளிமார் நூற்றாண்டு வெளிவ்வீத்த ரகசிய சமையல்',
      img: '', placeholder: 'TRADITIONAL', meta: 'சமையல் டெஸ்க் · 1 மணி', link: ''
    },
    traditionalList: [
      { title: 'அடிப்படை — காய்கறி குழம்பு', img: '', placeholder: 'CURRY 1', meta: 'சமையல் டெஸ்க்', link: '' },
      { title: 'பாரம்பரிய — மட்டன் குழம்பு', img: '', placeholder: 'CURRY 2', meta: 'சமையல் டெஸ்க்', link: '' }
    ],
    breakfastHead: 'காலை உணவு', breakfastMore: 'மேலும் →',
    breakfast: [
      { img: '', placeholder: 'IDLI', title: 'வெண்ணெய் இட்லி — பாரம்பரிய தொழில் சீரகம்', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'DOSA', title: 'மலையாள தோசை — காலை ஊட்டச்சத்து', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'PONGAL', title: 'வென் பொங்கல் — காலை சிறந்த உணவு', meta: 'சமையல் டெஸ்க்', link: '' }
    ],
    lunchHead: '1/2 மதிய & இரவு உணவு', lunchMore: 'மேலும் →',
    lunch: [
      { img: '', placeholder: 'RICE', title: 'பாதியில் சிக்கன் பிரியாணி — செய்ய எளிய, முழுவதிமாக 1 மணி நேரத்தில்', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'CURRY', title: 'மட்டன் வரிசை குழம்பு', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'VEG', title: 'காய்கறி சேர்ந்த சாதம்', meta: 'சமையல் டெஸ்க்', link: '' }
    ],
    sweetsHead: 'பலகாரம் & இனிப்புகள்', sweetsMore: 'மேலும் →',
    sweets: [
      { img: '', placeholder: 'HALWA', title: 'அல்வா — பாரம்பரிய இனிப்பு', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'PAYASAM', title: 'பாயசம் — பால் இனிப்பு', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'LADDU', title: 'லட்டு — பாரம்பரிய இனிப்பு', meta: 'சமையல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'JALEBI', title: 'ஜிலேபி — காரம் இனிப்பு', meta: 'சமையல் டெஸ்க்', link: '' }
    ],
    healthyHead: 'ஆரோக்கிய உணவுகள்', healthyMore: 'மேலும் →',
    healthy: [
      { icon: '🥗', title: 'காய்கறி', desc: 'தினசரி காய்கறி உண்ணுதல் ஆரோக்கியம்', link: '' },
      { icon: '🥛', title: 'பால் பொருட்கள்', desc: 'பால் தயிர் — ஊட்டச்சத்து', link: '' },
      { icon: '🌾', title: 'தானியங்கள்', desc: 'பெரிய இலையும் தானியமே', link: '' }
    ],
    videoHead: 'வீடியோ சமையல் குறிப்புகள்', videoMore: 'அனைத்து வீடியோ →',
    videos: [
      { title: 'பாரம்பரிய சிக்கன் பிரியாணி — செய்ய எளிய', img: '', placeholder: 'BIRYANI', duration: '12:45', link: '' },
      { title: 'வென் பொங்கல் — காலை சிறந்த உணவு', img: '', placeholder: 'PONGAL', duration: '08:32', link: '' },
      { title: 'அல்வா — பாரம்பரிய இனிப்பு செய்முறை', img: '', placeholder: 'HALWA', duration: '06:18', link: '' }
    ],
    stepByStepHead: 'படிப்படியாக சமையல்',
    stepByStepRecipe: 'செட்டிநாடு சிக்கன் குழம்பு',
    stepByStepImage: '', stepByStepPlaceholder: 'RECIPE STEPS',
    stepByStep: [
      { num: '01', title: 'பொருட்கள் தயாரிப்பு', desc: 'சிக்கன், மசாலாக்கள், தேங்காய், சீரகம் — அனைத்தும் தயார் செய்யவும்' },
      { num: '02', title: 'மசாலா கலவை', desc: '25 மசாலாக்களையும் வறுத்து பொடி செய்யவும்' },
      { num: '03', title: 'சிக்கன் சீக்கு', desc: 'சிக்கனை மசாலாவுடன் சேர்த்து நாலு பக்கமும் சீக்க' },
      { num: '04', title: 'குழம்பு செய்தல்', desc: 'தேங்காய் பால் சேர்த்து குழம்பு செய்து கொதிக்க விடவும்' },
      { num: '05', title: 'சுவை சேர்த்தல்', desc: 'உப்பு, மிளகாய் தூள், கொத்தமல்லி இலை சேர்த்து' },
      { num: '06', title: 'சுவையாக சாப்பிடவும்', desc: 'பத்து நிமிடம் விட்டு பின் சாப்பிடவும்' }
    ],
    galleryHead: 'உணவு புகைப்படங்கள்', galleryMore: 'மேலும் →',
    gallery: [
      { img: '', placeholder: 'FOOD 1', caption: 'பாரம்பரிய சாதம்' },
      { img: '', placeholder: 'FOOD 2', caption: 'காரசாரமான குழம்பு' },
      { img: '', placeholder: 'FOOD 3', caption: 'இனிப்பு பலகாரம்' },
      { img: '', placeholder: 'FOOD 4', caption: 'காலை உணவு' }
    ],
    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'பேபிபூட் தயாரிப்பு — பெரும்மக்கள் 15 நிமிடத்திற்குள் முடியும்',
      subtitle: 'பேபிபூட் வழங்கினதில் உரிய சத்தான உணவுகள் — நிபுணர் ஆலோசனை',
      cta: 'விளம்பர திட்டங்கள் →', ctaHref: 'mailto:ads@maraimalaimurasu.com'
    }
  });

  const stripe = 'repeating-linear-gradient(45deg, #FFE4B5 0, #FFE4B5 12px, #FFD89A 12px, #FFD89A 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  const [customCooking, setCustomCooking] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCustomCooking(parsed.filter(a => a.category === 'சமையல்').map(a => ({
            cat: 'சமையல்', img: a.img || '', placeholder: 'RECIPE', icon: '🍳',
            title: a.title, meta: `சமையல் டெஸ்க் · ${a.date}`, link: a.pdf || ''
          })));
        } catch (e) { /* ignore */ }
      } else { setCustomCooking([]); }
    };
    load();
    const onChange = (e) => { if (e.key === 'customArticles') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const sec = pc.sections || {};
  const isOn = (key) => sec[key] !== false;
  const featured = pc.featured || {};
  const trending = pc.trending || [];
  const recipes = [...customCooking.slice(0, 2), ...(pc.recipes || [])].slice(0, 8);
  const traditionalFeatured = pc.traditionalFeatured || {};
  const traditionalList = pc.traditionalList || [];
  const breakfast = pc.breakfast || [];
  const lunch = pc.lunch || [];
  const sweets = pc.sweets || [];
  const healthy = pc.healthy || [];
  const videos = pc.videos || [];
  const stepByStep = pc.stepByStep || [];
  const gallery = pc.gallery || [];
  const cta = pc.bottomCta || {};

  const [activeVideo, setActiveVideo] = useState(null);
  const playVideo = (v) => {
    if (v.link && getYouTubeId(v.link)) setActiveVideo({ url: v.link, title: v.title });
    else if (v.link) window.open(v.link, '_blank', 'noopener,noreferrer');
  };

  // Track which filter tab is currently active (local state — overrides default `active: true`)
  // Initial value = index of the tab marked active in the schema, else 0.
  const initialActiveIndex = (() => {
    const tabs = pc.filterTabs || [];
    const i = tabs.findIndex(t => t.active);
    return i === -1 ? 0 : i;
  })();
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveIndex);

  // Orange-themed section header
  const SectionHead = ({ icon, title, more }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #F97316', paddingBottom: '8px', marginBottom: '18px' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && <span>{icon}</span>} {title}
      </h2>
      {more && <a href="#" style={{ fontSize: '12px', color: '#F97316', fontWeight: 700, textDecoration: 'none' }}>{more}</a>}
    </div>
  );

  return (
    <div className="cat-page" style={{ background: '#FFF8F0' }}>
      {/* HEADER (orange themed) */}
      <div style={{ background: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)', borderBottom: '1px solid #FB923C', padding: '40px 0 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#9A3412', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>
            🍳 சமையல் & சுவை
          </div>
          <h1 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontWeight: 900, fontSize: '56px', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            {pc.title}
          </h1>
          <p style={{ margin: 0, maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--ink-2)', fontSize: '15px', lineHeight: 1.6 }}>
            {pc.subtitle}
          </p>
        </div>
      </div>

      {/* FILTER TABS — clicking scrolls to matching section */}
      {isOn('filterTabs') && (pc.filterTabs || []).length > 0 && (
        <div className="cooking-filter-bar" style={{ position: 'sticky', top: 0, zIndex: 50, maxWidth: '1280px', margin: '0 auto', padding: '14px 24px', borderBottom: '1px solid #FED7AA', background: '#FFF8F0' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', flexWrap: 'wrap' }}>
            {(pc.filterTabs || []).map((t, i) => (
              <button
                key={i}
                type="button"
                className={`cooking-filter-tab ${activeTabIndex === i ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveTabIndex(i);
                  if (!t.target || t.target === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    const el = document.getElementById(t.target);
                    if (el) {
                      const offset = 80;
                      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cat-grid" style={{ paddingTop: '32px' }}>
        <div className="cat-main">
          {/* FEATURED (orange gradient) */}
          {isOn('featured') && (
            <a href={resolveLink(featured)} style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px', background: featured.bgImage ? `linear-gradient(135deg, rgba(154, 52, 18, 0.85), rgba(234, 88, 12, 0.78)), url(${featured.bgImage}) center/cover no-repeat` : 'linear-gradient(135deg, #9A3412 0%, #EA580C 50%, #F97316 100%)', minHeight: '300px', padding: '32px', position: 'relative', color: '#fff' }}>
              {/* Diagonal pattern overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 16px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                {featured.cat && (
                  <div style={{ display: 'inline-block', background: '#FBBF24', color: '#7C2D12', padding: '6px 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', borderRadius: '4px', marginBottom: '16px' }}>{featured.cat}</div>
                )}
                {featured.kicker && (
                  <div style={{ fontSize: '13px', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>{featured.kicker}</div>
                )}
                <h2 style={{ margin: '0 0 14px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '30px', lineHeight: 1.2, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{featured.title}</h2>
                <p style={{ margin: '0 0 14px 0', fontSize: '14px', lineHeight: 1.6, color: '#FFEDD5', maxWidth: '720px' }}>{featured.excerpt}</p>
                <div style={{ fontSize: '12px', color: '#FED7AA' }}>{featured.meta}</div>
              </div>
            </a>
          )}

          {/* MID AD */}
          {isOn('midAd') && (
            <div style={{ margin: '24px 0' }}>
              <AdSlot network="google" size="970x90" slotId="cooking-mid-ad" note="Google AdSense · Cooking leaderboard" style={{ maxWidth: '100%' }} />
            </div>
          )}

          {/* RECIPES GRID (8 cards with emoji) */}
          {isOn('recipesGrid') && (
            <section id="sec-recipes" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="🍲" title={pc.recipesHead} more={pc.recipesMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {recipes.map((r, i) => (
                  <a key={i} href={resolveLink(r)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#fff', background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)', borderRadius: '10px', overflow: 'hidden', padding: '14px', boxShadow: '0 2px 8px rgba(234, 88, 12, 0.2)' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: r.img ? `url(${r.img}) center/cover no-repeat` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '10px', fontSize: '36px' }}>
                      {!r.img && <span>{r.icon || '🍳'}</span>}
                    </div>
                    <div style={{ fontSize: '10px', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>{r.cat}</div>
                    <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '13px', lineHeight: 1.4, color: '#fff', fontWeight: 700 }}>{r.title}</h3>
                    <div style={{ fontSize: '10px', color: '#FFEDD5' }}>{r.meta}</div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* TRADITIONAL (featured + 2 small cards) */}
          {isOn('traditional') && (
            <section id="sec-traditional" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="🏺" title={pc.traditionalHead} more={pc.traditionalMore} />
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '36px' }}>
                <a href={resolveLink(traditionalFeatured)} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FED7AA', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', background: traditionalFeatured.img ? `url(${traditionalFeatured.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                    {!traditionalFeatured.img && <span>{traditionalFeatured.placeholder}</span>}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 700, lineHeight: 1.35 }}>{traditionalFeatured.title}</h3>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{traditionalFeatured.meta}</div>
                  </div>
                </a>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {traditionalList.map((t, i) => (
                    <a key={i} href={resolveLink(t)} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '12px', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FED7AA', borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
                      <div style={{ background: t.img ? `url(${t.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)' }}>
                        {!t.img && <span>{t.placeholder}</span>}
                      </div>
                      <div style={{ padding: '12px 14px 12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 700, lineHeight: 1.35 }}>{t.title}</h4>
                        <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>{t.meta}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* BREAKFAST */}
          {isOn('breakfast') && breakfast.length > 0 && (
            <section id="sec-breakfast" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="🌅" title={pc.breakfastHead} more={pc.breakfastMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {breakfast.map((b, i) => (
                  <a key={i} href={resolveLink(b)} style={{ textDecoration: 'none', color: '#fff', background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)', borderRadius: '10px', overflow: 'hidden', padding: '14px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: b.img ? `url(${b.img}) center/cover no-repeat` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '10px', fontFamily: 'var(--mono)', fontSize: '11px', color: '#FED7AA' }}>
                      {!b.img && <span>{b.placeholder}</span>}
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 700, lineHeight: 1.4 }}>{b.title}</h3>
                    <div style={{ fontSize: '10px', color: '#FFEDD5' }}>{b.meta}</div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* LUNCH & DINNER */}
          {isOn('lunch') && lunch.length > 0 && (
            <section id="sec-lunch" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="🍚" title={pc.lunchHead} more={pc.lunchMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {lunch.map((l, i) => (
                  <a key={i} href={resolveLink(l)} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FED7AA', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: l.img ? `url(${l.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                      {!l.img && <span>{l.placeholder}</span>}
                    </div>
                    <div style={{ padding: '14px' }}>
                      <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 700, lineHeight: 1.4 }}>{l.title}</h3>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{l.meta}</div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* SWEETS */}
          {isOn('sweets') && sweets.length > 0 && (
            <section id="sec-sweets" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="🍮" title={pc.sweetsHead} more={pc.sweetsMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {sweets.map((s, i) => (
                  <a key={i} href={resolveLink(s)} style={{ textDecoration: 'none', color: '#fff', background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)', borderRadius: '10px', overflow: 'hidden', padding: '14px' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: s.img ? `url(${s.img}) center/cover no-repeat` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '10px', fontFamily: 'var(--mono)', fontSize: '11px', color: '#FED7AA' }}>
                      {!s.img && <span>{s.placeholder}</span>}
                    </div>
                    <h3 style={{ margin: '0 0 5px 0', fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 700, lineHeight: 1.4 }}>{s.title}</h3>
                    <div style={{ fontSize: '10px', color: '#FFEDD5' }}>{s.meta}</div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* META AD */}
          {isOn('metaAd') && (
            <div style={{ margin: '24px 0 36px' }}>
              <AdSlot network="meta" size="728x120" slotId="cooking-meta-ad" note="Meta Audience Network" style={{ maxWidth: '100%' }} />
            </div>
          )}

          {/* HEALTHY (3 columns with icons) */}
          {isOn('healthy') && healthy.length > 0 && (
            <section id="sec-healthy" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="🥗" title={pc.healthyHead} more={pc.healthyMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {healthy.map((h, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>{h.icon}</div>
                    <h4 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{h.title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{h.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VIDEOS — 1 big featured + 3 smaller stacked (matches design image) */}
          {isOn('videos') && videos.length > 0 && (
            <section id="sec-videos" style={{ scrollMarginTop: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #F97316', paddingBottom: '8px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📹</span> {pc.videoHead} <span style={{ fontSize: '11px', color: 'var(--ink-3)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: '6px' }}>· TUTORIALS</span>
                </h2>
                {pc.videoMore && <a href="#" style={{ fontSize: '12px', color: '#F97316', fontWeight: 700, textDecoration: 'none' }}>YOUTUBE சேனல் →</a>}
              </div>

              {(() => {
                const big = videos[0];
                const rest = videos.slice(1, 4);
                const bigThumb = big ? (big.img || getYouTubeThumb(big.link) || '') : '';
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px', marginBottom: '36px' }}>
                    {/* LEFT — big featured video */}
                    {big && (
                      <button
                        type="button"
                        onClick={() => playVideo(big)}
                        style={{ textAlign: 'left', border: 0, padding: 0, cursor: big.link ? 'pointer' : 'default', background: '#1A0F08', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: 'inherit', position: 'relative' }}
                      >
                        <div style={{ flex: 1, minHeight: '520px', background: bigThumb ? `url(${bigThumb}) center/cover no-repeat` : 'radial-gradient(ellipse at center, #8B4513 0%, #1A0F08 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {!bigThumb && <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#FED7AA', letterSpacing: '0.15em' }}>{big.placeholder}</span>}
                          {big.duration && (
                            <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '5px 12px', borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 700 }}>{big.duration}</div>
                          )}
                          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '38px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>▶</div>
                        </div>
                        <div style={{ padding: '20px 24px', color: '#F2ECE0' }}>
                          <div style={{ fontSize: '10px', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '6px' }}>MASTER CLASS</div>
                          <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800, lineHeight: 1.3 }}>{big.title}</h3>
                        </div>
                      </button>
                    )}

                    {/* RIGHT — 3 smaller stacked videos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {rest.map((v, i) => {
                        const thumb = v.img || getYouTubeThumb(v.link) || '';
                        const labels = ['QUICK', 'STREET', 'SWEET'];
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => playVideo(v)}
                            style={{ textAlign: 'left', border: 0, padding: 0, cursor: v.link ? 'pointer' : 'default', background: '#1A0F08', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: 'inherit', flex: 1, position: 'relative' }}
                          >
                            <div style={{ flex: 1, minHeight: '160px', background: thumb ? `url(${thumb}) center/cover no-repeat` : 'radial-gradient(ellipse at center, #8B4513 0%, #1A0F08 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {!thumb && <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#FED7AA', letterSpacing: '0.12em' }}>{v.placeholder}</span>}
                              {v.duration && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '3px 9px', borderRadius: '3px', fontSize: '11px', fontFamily: 'var(--mono)', fontWeight: 700 }}>{v.duration}</div>
                              )}
                              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>▶</div>
                            </div>
                            <div style={{ padding: '12px 16px', color: '#F2ECE0' }}>
                              <div style={{ fontSize: '9px', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '3px' }}>{labels[i] || 'TUTORIAL'}</div>
                              <h4 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 700, lineHeight: 1.35 }}>{v.title}</h4>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

          {/* STEP BY STEP */}
          {isOn('stepByStep') && stepByStep.length > 0 && (
            <>
              <SectionHead icon="📖" title={pc.stepByStepHead} more={null} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px', marginBottom: '36px' }}>
                <div style={{ background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)', borderRadius: '10px', padding: '24px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ width: '100%', aspectRatio: '4/3', background: pc.stepByStepImage ? `url(${pc.stepByStepImage}) center/cover no-repeat` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '14px', fontFamily: 'var(--mono)', fontSize: '12px', color: '#FED7AA' }}>
                    {!pc.stepByStepImage && <span>{pc.stepByStepPlaceholder || 'RECIPE IMAGE'}</span>}
                  </div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 800, textAlign: 'center' }}>{pc.stepByStepRecipe}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stepByStep.map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '12px', background: '#fff', border: '1px solid #FED7AA', borderRadius: '8px', padding: '14px' }}>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 900, color: '#F97316', lineHeight: 1 }}>{s.num}</span>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{s.title}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FOOD GALLERY */}
          {isOn('gallery') && gallery.length > 0 && (
            <section id="sec-gallery" style={{ scrollMarginTop: '100px' }}>
              <SectionHead icon="📸" title={pc.galleryHead} more={pc.galleryMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '36px' }}>
                {gallery.map((g, i) => (
                  <div key={i} style={{ background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)', borderRadius: '10px', overflow: 'hidden', padding: '14px' }}>
                    <div style={{ width: '100%', aspectRatio: '1/1', background: g.img ? `url(${g.img}) center/cover no-repeat` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '8px', fontFamily: 'var(--mono)', fontSize: '11px', color: '#FED7AA' }}>
                      {!g.img && <span>{g.placeholder}</span>}
                    </div>
                    {g.caption && (
                      <div style={{ fontSize: '11px', color: '#fff', fontFamily: 'var(--serif)', textAlign: 'center' }}>{g.caption}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BOTTOM CTA */}
          {isOn('bottomCta') && cta && cta.title && (
            <div style={{ background: 'linear-gradient(135deg, #1A1614 0%, #7C2D12 100%)', color: '#F2ECE0', borderRadius: '12px', padding: '28px 32px', marginTop: '12px' }}>
              <div style={{ display: 'inline-block', background: '#F97316', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.14em', marginBottom: '12px', borderRadius: '3px' }}>{cta.sponsored}</div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800 }}>{cta.title}</h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', opacity: 0.85 }}>{cta.subtitle}</p>
              <a href={cta.ctaHref || '#'} style={{ display: 'inline-block', background: '#F97316', color: '#fff', padding: '11px 22px', borderRadius: '5px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>{cta.cta}</a>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="cat-sidebar">
          {isOn('trending') && trending.length > 0 && (
            <div className="cat-rail-block" style={{ borderColor: '#FED7AA' }}>
              <div className="cat-rail-head" style={{ background: '#FFF8F0', borderBottomColor: '#F97316', color: '#9A3412' }}>{pc.trendingHead}</div>
              <ol className="cat-trending">
                {trending.map((t, i) => (
                  <li key={i}>
                    <span className="num" style={{ color: '#F97316' }}>{String(i + 1).padStart(2, '0')}</span>
                    <a href={resolveLink(t)}>
                      <h5>{t.title}</h5>
                      {t.meta && <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '4px' }}>{t.meta}</div>}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {isOn('sidebarAd1') && (
            <AdSlot network="google" size="300x250" slotId="cooking-sidebar-1" note="Google AdSense · Sidebar" />
          )}

          {isOn('sidebarAd2') && (
            <AdSlot network="google" size="300x600" slotId="cooking-sidebar-2" note="Google AdSense · Half Page" />
          )}
        </aside>
      </div>

      <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
