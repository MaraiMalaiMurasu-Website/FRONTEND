import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import VideoPlayer, { getYouTubeThumb, getYouTubeId } from '../components/VideoPlayer.jsx';
import { usePageContent } from '../utils/pageContent.js';
import './LawPage.css'; // shared .cat-* styles

export default function BeautyPage() {
  const pc = usePageContent('beauty', {
    title: 'அழகுக் குறிப்பு',
    subtitle: 'பெண்களின் அழகியல் — சருமம் முடி, பராமரிப்பு, மேக்கப் மற்றும் இயற்கை குறிப்புகள்.',
    sections: {
      featured: true, trending: true, midAd: true, newsGrid: true,
      sidebarAd1: true, skincare: true, haircare: true, sidebarAd2: true,
      makeup: true, metaAd: true, naturalTips: true, videos: true,
      beforeAfter: true, womensWellness: true, bottomCta: true
    },
    featured: {
      cat: 'சருமம்', img: '', bgImage: '', placeholder: 'NATURAL BEAUTY',
      kicker: 'அழகு அறிக்கை',
      title: 'முக அழகை இயற்கை முறையில் பராமரிக்க? பெரியம்மா குறிப்புகள் — தினமும் 10 நிமிடம் போதும்',
      excerpt: 'மலர் சாறு, தேங்காய் எண்ணெய், சந்தனம் — பெண்களின் பல்லாயிரம் ஆண்டுக் காலமாக பயன்படுத்தும் இயற்கை குறிப்புகள் இன்றும் சிறந்த விளைவுகளைத் தருகின்றன.',
      meta: 'வாழ்வியல் டெஸ்க் · 2 மணி நேரம்', link: ''
    },
    trendingHead: 'பிரபல அழகு குறிப்புகள்',
    trending: [
      { title: 'முக அழகுக்கு தினசரி தண்ணீர் முக் சத்தி', meta: 'வாழ்வியல் டெஸ்க்', link: '' },
      { title: 'குறுகிய சேரம் பயன்பாட்டுக்கு வழிமுறை', meta: 'அழகு டெஸ்க்', link: '' },
      { title: 'திரும்ப காத்திற்கான குறிப்பு', meta: 'அழகு டெஸ்க்', link: '' },
      { title: 'நாள் முழுவதும் வாசம் வைக்கும் ரகசியம்', meta: 'அழகு டெஸ்க்', link: '' },
      { title: 'வீட்டில் செய்யக்கூடிய அழகு குறிப்புகள்', meta: 'வாழ்வியல் டெஸ்க்', link: '' }
    ],
    newsHead: 'அழகுக் குறிப்பு செய்திகள்', newsMore: 'மேலும் →',
    news: [
      { cat: 'சருமம்', icon: '🌿', img: '', placeholder: 'SKIN', title: 'அதிக சருமப் பளபளப்பு — 3 எளிய குறிப்புகள்', meta: 'வாழ்வியல் டெஸ்க் · 2 மணி', link: '' },
      { cat: 'முடி', icon: '🌸', img: '', placeholder: 'HAIR', title: 'முடி உதிர்வை குறைக்க இயற்கை மருத்துவம்', meta: 'வாழ்வியல் டெஸ்க் · 3 மணி', link: '' },
      { cat: 'மேக்கப்', icon: '💧', img: '', placeholder: 'MAKEUP', title: 'கோடைகாலத்திற்கு ஏற்ற மேக்கப் முறை', meta: 'வாழ்வியல் டெஸ்க் · 4 மணி', link: '' },
      { cat: 'வாசனை', icon: '🌷', img: '', placeholder: 'PERFUME', title: 'பாக்கெட் பத்து வாசனை — பெண்களுக்கான தேர்வுகள்', meta: 'வாழ்வியல் டெஸ்க் · 5 மணி', link: '' },
      { cat: 'மருந்து', icon: '🌱', img: '', placeholder: 'HERB', title: 'வீட்டிலேயே சிக்கனமான வழிமுறை', meta: 'வாழ்வியல் டெஸ்க் · 6 மணி', link: '' },
      { cat: 'பாதம்', icon: '🌺', img: '', placeholder: 'FEET', title: 'மென்மையான கால் பாதங்களுக்கு', meta: 'வாழ்வியல் டெஸ்க் · 7 மணி', link: '' },
      { cat: 'கண்', icon: '👁', img: '', placeholder: 'EYES', title: 'கண் சுற்றுவட்டு கருமை நீக்க', meta: 'வாழ்வியல் டெஸ்க் · 8 மணி', link: '' },
      { cat: 'நகம்', icon: '💅', img: '', placeholder: 'NAILS', title: 'மென்மையான மற்றும் வலுவான நகங்களுக்கு', meta: 'வாழ்வியல் டெஸ்க் · 9 மணி', link: '' }
    ],
    skincareHead: 'சரும பராமரிப்பு', skincareMore: 'மேலும் →',
    skincare: [
      { img: '', placeholder: 'CLEANSE', title: 'முக சருமத்தில் ஒளி தோன்ற "துளசி" மருத்துவ முறை இருக்கின்றனர் என்ன ருசிகள்', meta: 'நிபுணர் ஆலோசனை · ஞாயிறு', link: '' },
      { img: '', placeholder: 'GLOW', title: 'அதிகார்யன் ஆராய்ச்சி — தங்கம் முகம் தடவலாம்', meta: 'அழகு டெஸ்க்', link: '' },
      { img: '', placeholder: 'NIGHT', title: 'அழகி பெண்மணி குறிப்புகள் — இரவு டெய்லி', meta: 'அழகு டெஸ்க்', link: '' }
    ],
    haircareHead: 'முடி பராமரிப்பு', haircareMore: 'மேலும் →',
    haircare: [
      { img: '', placeholder: 'HAIR OIL', title: 'முடி உதிர்வை குறைக்க — 5 எளிய குறிப்புகள்?', meta: 'வாழ்வியல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'CONDITION', title: 'முடி பிஞ்சாட்டு — ஆலோசனை திருப்திகரம்', meta: 'அழகு டெஸ்க்', link: '' },
      { img: '', placeholder: 'COLOR', title: 'நரம்பு முடி கருமையாக்க — இயற்கை வழி', meta: 'அழகு டெஸ்க்', link: '' }
    ],
    makeupHead: 'மேக்கப் & ஃபேஷன்', makeupMore: 'மேலும் →',
    makeup: [
      { img: '', placeholder: 'LIPSTICK', title: 'பிக்கடியில் பயன்படுத்தும் லிப்ஸ்டிக்', meta: 'நிபுணர் டெஸ்க்', link: '' },
      { img: '', placeholder: 'EYESHADOW', title: 'புத்திகெட்ட பெண்களுக்கு புத்திக்கி குறிப்பு', meta: 'வாழ்வியல் டெஸ்க்', link: '' },
      { img: '', placeholder: 'FOUNDATION', title: 'தாட்டிய பெண் சருமம் 2023 கல எல்லாம்', meta: 'அழகு டெஸ்க்', link: '' },
      { img: '', placeholder: 'BLUSH', title: 'பெண்மணி ஆராய்ச்சி அழகுபரிசோதனை', meta: 'அழகு டெஸ்க்', link: '' }
    ],
    naturalTipsHead: 'இயற்கை அழகு குறிப்புகள்',
    naturalTipsSub: 'பல காலமாக நம் தலைமுறை பெண்கள் பயன்படுத்தி வந்த எளிய இயற்கை குறிப்புகள்',
    naturalTips: [
      { num: '01', title: 'இயற்கை அழகு — மேற்கொள்ளப்பட்ட டெய்லி', desc: 'காலை சாப்பாட்டில் சீரகம் கூடுதலாக சேர்க்க' },
      { num: '02', title: 'எளிய தினசரி குறிப்புகள்', desc: 'மலர் சாறு கொண்டு முகம் கழுவுதல்' },
      { num: '03', title: 'வீட்டில் சாதாரண வழி', desc: 'பால் கொண்டு முகம் கழுவுதல்' },
      { num: '04', title: 'காலை — காத்து, காப்பி', desc: 'காலை எழுந்தவுடன் தண்ணீர் குடிப்பது' },
      { num: '05', title: 'மாலை வேளை சாகம்', desc: 'காய் சாற்றை முகத்தில் தடவுதல்' },
      { num: '06', title: 'இரவு நீரகர் வைபம் சில்லொளி', desc: 'தூங்குவதற்கு முன் முகம் கழுவுதல்' }
    ],
    videoHead: 'வீடியோ குறிப்புகள்', videoMore: 'அனைத்தும் →',
    videos: [
      { title: 'எளிய அழகு குறிப்பு — 5 நிமிடத்தில்', img: '', placeholder: 'BEAUTY TIP', duration: '05:00', link: '' },
      { title: 'முக அழகுக்கு இயற்கை முறை', img: '', placeholder: 'NATURAL', duration: '04:32', link: '' },
      { title: 'முடி பராமரிப்பு பயிற்சி', img: '', placeholder: 'HAIR CARE', duration: '06:18', link: '' }
    ],
    beforeAfterHead: 'முன் & பின் மாற்றங்கள்', beforeAfterMore: 'அனைத்தும் →',
    beforeAfter: [
      { title: 'சருமம் — பெண்மணி #1', beforeImg: '', afterImg: '', placeholder: 'BEFORE / AFTER 1' },
      { title: 'சருமம் — பெண்மணி #2', beforeImg: '', afterImg: '', placeholder: 'BEFORE / AFTER 2' },
      { title: 'சருமம் — பெண்மணி #3', beforeImg: '', afterImg: '', placeholder: 'BEFORE / AFTER 3' }
    ],
    womensWellnessHead: 'பெண்கள் நலன்',
    womensWellness: {
      img: '', placeholder: 'WOMEN WELLNESS',
      title: 'உன் ஒளி வெளியில் தெரியும் — தாங்கம் தோராகிய அழகியல் சார்வை',
      copy: 'மென்மையான சருமம், ஆரோக்கியமான முடி, நிறைவான சத்து — பெண்களின் தினசரி வாழ்க்கைக்காக அமைந்த ஆலோசனை.',
      ctaText: 'மேலும் வாசிக்க', ctaHref: '/article'
    },
    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'டாக்டர்களின் ஆலோசனை — முழு பயனில் ஆர்வ செய்துவேன்',
      subtitle: 'நிபுணர்கள் வழங்கிய ஆரோக்கியமான வாழ்க்கைக்கு அழகியல் ஆலோசனை',
      cta: 'விளம்பர திட்டங்கள் →', ctaHref: 'mailto:ads@maraimalaimurasu.com'
    }
  });

  const stripe = 'repeating-linear-gradient(45deg, #FCE7E0 0, #FCE7E0 12px, #FDEAE0 12px, #FDEAE0 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  const [customBeauty, setCustomBeauty] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCustomBeauty(parsed.filter(a => a.category === 'அழகுகுறிப்பு' || a.category === 'அழகு குறிப்பு').map(a => ({
            cat: 'அழகு', img: a.img || '', placeholder: 'NEWS',
            title: a.title, meta: `வாழ்வியல் டெஸ்க் · ${a.date}`, link: a.pdf || ''
          })));
        } catch (e) { /* ignore */ }
      } else { setCustomBeauty([]); }
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
  const newsItems = [...customBeauty.slice(0, 2), ...(pc.news || [])].slice(0, 8);
  const skincareItems = pc.skincare || [];
  const haircareItems = pc.haircare || [];
  const makeupItems = pc.makeup || [];
  const naturalTips = pc.naturalTips || [];
  const videos = pc.videos || [];
  const beforeAfter = pc.beforeAfter || [];
  const wellness = pc.womensWellness || {};
  const cta = pc.bottomCta || {};

  const [activeVideo, setActiveVideo] = useState(null);
  const playVideo = (v) => {
    if (v.link && getYouTubeId(v.link)) setActiveVideo({ url: v.link, title: v.title });
    else if (v.link) window.open(v.link, '_blank', 'noopener,noreferrer');
  };

  // Reusable section header with pink theme
  const SectionHead = ({ icon, title, more }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #F472B6', paddingBottom: '8px', marginBottom: '18px' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && <span style={{ color: '#F472B6' }}>{icon}</span>} {title}
      </h2>
      {more && <a href="#" style={{ fontSize: '12px', color: '#F472B6', fontWeight: 700, textDecoration: 'none' }}>{more}</a>}
    </div>
  );

  return (
    <div className="cat-page" style={{ background: '#FDF7F5' }}>
      {/* HEADER (pink themed) */}
      <div style={{ background: 'linear-gradient(135deg, #FCE7E0 0%, #FBCFE8 100%)', borderBottom: '1px solid #F9A8D4', padding: '40px 0 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#9D174D', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>
            🌸 அழகியல் & பராமரிப்பு
          </div>
          <h1 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontWeight: 900, fontSize: '56px', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            {pc.title}
          </h1>
          <p style={{ margin: 0, maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', color: 'var(--ink-2)', fontSize: '15px', lineHeight: 1.6 }}>
            {pc.subtitle}
          </p>
        </div>
      </div>

      <div className="cat-grid" style={{ paddingTop: '32px' }}>
        <div className="cat-main">
          {/* FEATURED */}
          {isOn('featured') && (
            <a href={resolveLink(featured)} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0, textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ minHeight: '320px', background: featured.bgImage ? `url(${featured.bgImage}) center/cover no-repeat` : (featured.img ? `url(${featured.img}) center/cover no-repeat` : stripe), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)', position: 'relative' }}>
                {!featured.bgImage && !featured.img && <span>{featured.placeholder}</span>}
                {featured.cat && (
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: '#F472B6', color: '#fff', padding: '6px 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', borderRadius: '4px' }}>{featured.cat}</div>
                )}
              </div>
              <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(180deg, #fff 0%, #FDF2F8 100%)' }}>
                {featured.kicker && (
                  <div style={{ color: '#9D174D', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase' }}>{featured.kicker}</div>
                )}
                <h2 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '26px', lineHeight: 1.25, color: 'var(--ink)' }}>{featured.title}</h2>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.55, color: 'var(--ink-2)' }}>{featured.excerpt}</p>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{featured.meta}</div>
              </div>
            </a>
          )}

          {/* MID AD */}
          {isOn('midAd') && (
            <div style={{ margin: '24px 0' }}>
              <AdSlot network="google" size="970x90" slotId="beauty-mid-ad" note="Google AdSense · Beauty leaderboard" style={{ maxWidth: '100%' }} />
            </div>
          )}

          {/* NEWS GRID (4-card row with icons) */}
          {isOn('newsGrid') && (
            <>
              <SectionHead icon="🌿" title={pc.newsHead} more={pc.newsMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {newsItems.map((n, i) => (
                  <a key={i} href={resolveLink(n)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden', padding: '14px' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: n.img ? `url(${n.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', marginBottom: '10px', position: 'relative' }}>
                      {!n.img && (
                        <span style={{ fontSize: '24px' }}>{n.icon || '🌸'}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#F472B6', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>{n.cat}</div>
                    <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)', fontWeight: 700 }}>{n.title}</h3>
                    <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>{n.meta}</div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* SKINCARE */}
          {isOn('skincare') && skincareItems.length > 0 && (
            <>
              <SectionHead icon="🌸" title={pc.skincareHead} more={pc.skincareMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {skincareItems.map((s, i) => (
                  <a key={i} href={resolveLink(s)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: s.img ? `url(${s.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                      {!s.img && <span>{s.placeholder}</span>}
                    </div>
                    <div style={{ padding: '14px' }}>
                      <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '14px', lineHeight: 1.4, color: 'var(--ink)', fontWeight: 700 }}>{s.title}</h3>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{s.meta}</div>
                    </div>
                  </a>
                ))}
              </div>
              {/* Skincare gradient color band */}
              <div style={{ height: '8px', background: 'linear-gradient(90deg, #FCE7E0 0%, #FBCFE8 25%, #F9A8D4 50%, #F472B6 75%, #EC4899 100%)', borderRadius: '4px', marginBottom: '36px' }} />
            </>
          )}

          {/* INLINE AD between Skincare and Haircare */}
          <div style={{ margin: '0 0 32px 0' }}>
            <AdSlot network="google" size="970x90" slotId="beauty-inline-1" note="Google AdSense · In-feed" style={{ maxWidth: '100%' }} />
          </div>

          {/* HAIRCARE */}
          {isOn('haircare') && haircareItems.length > 0 && (
            <>
              <SectionHead icon="🌷" title={pc.haircareHead} more={pc.haircareMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {haircareItems.map((h, i) => (
                  <a key={i} href={resolveLink(h)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: h.img ? `url(${h.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                      {!h.img && <span>{h.placeholder}</span>}
                    </div>
                    <div style={{ padding: '14px' }}>
                      <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '14px', lineHeight: 1.4, color: 'var(--ink)', fontWeight: 700 }}>{h.title}</h3>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{h.meta}</div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* MAKEUP */}
          {isOn('makeup') && makeupItems.length > 0 && (
            <>
              <SectionHead icon="💄" title={pc.makeupHead} more={pc.makeupMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {makeupItems.map((m, i) => (
                  <a key={i} href={resolveLink(m)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: m.img ? `url(${m.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)' }}>
                      {!m.img && <span>{m.placeholder}</span>}
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontFamily: 'var(--serif)', fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)', fontWeight: 700 }}>{m.title}</h3>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>{m.meta}</div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* META AD */}
          {isOn('metaAd') && (
            <div style={{ margin: '24px 0 36px' }}>
              <AdSlot network="meta" size="728x120" slotId="beauty-meta-ad" note="Meta Audience Network" style={{ maxWidth: '100%' }} />
            </div>
          )}

          {/* NATURAL TIPS (numbered 01-06 grid) */}
          {isOn('naturalTips') && naturalTips.length > 0 && (
            <>
              <SectionHead icon="🌱" title={pc.naturalTipsHead} more={null} />
              <p style={{ margin: '-12px 0 18px 0', fontSize: '13px', color: 'var(--ink-3)' }}>{pc.naturalTipsSub}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {naturalTips.map((t, i) => (
                  <div key={i} style={{ background: 'linear-gradient(180deg, #FDF2F8 0%, #FCE7E0 100%)', border: '1px solid #FBCFE8', borderRadius: '10px', padding: '18px 16px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 900, color: '#F472B6', lineHeight: 1, marginBottom: '8px' }}>{t.num}</div>
                    <h4 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.35 }}>{t.title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* INLINE AD between Natural Tips and Videos */}
          <div style={{ margin: '0 0 32px 0' }}>
            <AdSlot network="meta" size="970x90" slotId="beauty-inline-2" note="Meta Audience Network · In-feed" style={{ maxWidth: '100%' }} />
          </div>

          {/* VIDEOS (dark themed) */}
          {isOn('videos') && videos.length > 0 && (
            <>
              <SectionHead icon="📹" title={pc.videoHead} more={pc.videoMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {videos.map((v, i) => {
                  const thumb = v.img || getYouTubeThumb(v.link) || '';
                  return (
                    <button key={i} type="button" onClick={() => playVideo(v)} style={{ textAlign: 'left', border: 0, padding: 0, cursor: v.link ? 'pointer' : 'default', background: '#1A1614', borderRadius: '8px', overflow: 'hidden', display: 'block', color: 'inherit' }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', background: thumb ? `url(${thumb}) center/cover no-repeat` : 'radial-gradient(circle, #444 0%, #1A1614 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {!thumb && <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#6B7280' }}>{v.placeholder}</span>}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(244, 114, 182, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>▶</div>
                        </div>
                        {v.duration && (
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontFamily: 'var(--mono)' }}>{v.duration}</div>
                        )}
                      </div>
                      <div style={{ padding: '14px', color: '#F2ECE0' }}>
                        <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '14px', fontWeight: 700, lineHeight: 1.4 }}>{v.title}</h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* BEFORE & AFTER */}
          {isOn('beforeAfter') && beforeAfter.length > 0 && (
            <>
              <SectionHead icon="✨" title={pc.beforeAfterHead} more={pc.beforeAfterMore} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
                {beforeAfter.map((b, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                      <div style={{ aspectRatio: '4/5', background: b.beforeImg ? `url(${b.beforeImg}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'flex-end', padding: '8px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-3)' }}>
                        <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>BEFORE</span>
                      </div>
                      <div style={{ aspectRatio: '4/5', background: b.afterImg ? `url(${b.afterImg}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'flex-end', padding: '8px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-3)' }}>
                        <span style={{ background: '#F472B6', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>AFTER</span>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <h4 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{b.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* WOMEN'S WELLNESS BANNER */}
          {isOn('womensWellness') && wellness.title && (
            <a href={wellness.ctaHref || '#'} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0, marginBottom: '36px', background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ aspectRatio: '4/3', background: wellness.img ? `url(${wellness.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                {!wellness.img && <span>{wellness.placeholder}</span>}
              </div>
              <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '11px', color: '#9D174D', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>{pc.womensWellnessHead}</div>
                <h3 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', lineHeight: 1.3, color: 'var(--ink)' }}>{wellness.title}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-2)' }}>{wellness.copy}</p>
                {wellness.ctaText && (
                  <span style={{ display: 'inline-block', padding: '10px 22px', background: '#F472B6', color: '#fff', borderRadius: '5px', fontWeight: 700, fontSize: '13px', alignSelf: 'flex-start' }}>{wellness.ctaText} →</span>
                )}
              </div>
            </a>
          )}

          {/* BOTTOM CTA */}
          {isOn('bottomCta') && cta && cta.title && (
            <div style={{ background: 'linear-gradient(135deg, #1A1614 0%, #4a0e2a 100%)', color: '#F2ECE0', borderRadius: '12px', padding: '28px 32px', marginTop: '12px' }}>
              <div style={{ display: 'inline-block', background: '#F472B6', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.14em', marginBottom: '12px', borderRadius: '3px' }}>{cta.sponsored}</div>
              <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800 }}>{cta.title}</h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', opacity: 0.85 }}>{cta.subtitle}</p>
              <a href={cta.ctaHref || '#'} style={{ display: 'inline-block', background: '#F472B6', color: '#fff', padding: '11px 22px', borderRadius: '5px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>{cta.cta}</a>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="cat-sidebar">
          {isOn('trending') && trending.length > 0 && (
            <div className="cat-rail-block" style={{ borderColor: '#FBCFE8' }}>
              <div className="cat-rail-head" style={{ background: '#FDF2F8', borderBottomColor: '#F472B6', color: '#9D174D' }}>{pc.trendingHead}</div>
              <ol className="cat-trending">
                {trending.map((t, i) => (
                  <li key={i}>
                    <span className="num" style={{ color: '#F472B6' }}>{String(i + 1).padStart(2, '0')}</span>
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
            <AdSlot network="google" size="300x250" slotId="beauty-sidebar-1" note="Google AdSense · Sidebar" />
          )}

          {isOn('sidebarAd2') && (
            <AdSlot network="google" size="300x600" slotId="beauty-sidebar-2" note="Google AdSense · Half Page" />
          )}

          {/* Extra sidebar fillers — newsletter promo + bottom sticky ad */}
          <div style={{ background: 'linear-gradient(180deg, #FDF2F8 0%, #FCE7E0 100%)', border: '1px solid #FBCFE8', borderRadius: '10px', padding: '20px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌸</div>
            <h4 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>அழகு குறிப்பு newsletter</h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--ink-2)', lineHeight: 1.5 }}>தினசரி அழகியல் ட்ரெண்டுகள் — உங்கள் இன்பாக்ஸில்</p>
            <input type="email" placeholder="மின்னஞ்சல்..." style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--rule)', borderRadius: '5px', fontSize: '12px', marginBottom: '8px', fontFamily: 'inherit' }} />
            <button type="button" style={{ width: '100%', padding: '8px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>சேர</button>
          </div>

          {/* Bottom sidebar rectangle ad */}
          <AdSlot network="google" size="300x250" slotId="beauty-sidebar-3" note="Google AdSense · Rectangle" />
        </aside>
      </div>

      <VideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
