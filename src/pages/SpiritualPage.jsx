/*
  SpiritualPage — ஆன்மீகம் hub
  ───────────────────────────────
  The dropdown parent landing page. Showcases all spiritual content:
  Astrology, Temple News, Festivals, Pujas, Vasthu, Spiritual articles.
  Admin-editable via the standard usePageContent() pattern (key: 'spiritual').
*/

import { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import { usePageContent } from '../utils/pageContent.js';

export default function SpiritualPage() {
  const pc = usePageContent('spiritual', {
    title: 'ஆன்மீகம்',
    subtitle: 'கோயில் செய்திகள், திருவிழாக்கள், பூஜை விதிகள், வாஸ்து மற்றும் ஜோதிடம் — ஆன்மீக வாழ்வின் முழுமையான தொகுப்பு.',
    breadcrumb: { home: 'முகப்பு', current: 'ஆன்மீகம்' },

    // Hero / featured spiritual article
    featured: {
      kicker: 'சிறப்பு கட்டுரை',
      title: 'திருவண்ணாமலை கிரிவலம்: பௌர்ணமி தினத்தில் ஐந்து லட்சம் பக்தர்கள்',
      excerpt: 'இம்மாத பௌர்ணமி தினத்தில் திருவண்ணாமலை அண்ணாமலையார் கோவிலில் கிரிவலம் வந்த பக்தர்கள் எண்ணிக்கை ஐந்து லட்சத்தைத் தாண்டியது. கோவில் நிர்வாகம் சிறப்பு ஏற்பாடுகள் செய்திருந்தது.',
      meta: 'ஆன்மீக டெஸ்க் · 2 மணி நேரம் முன்',
      placeholder: 'TEMPLE',
      img: '',
      link: ''
    },

    // Sub-category tiles
    categoriesHead: 'ஆன்மீக பிரிவுகள்',
    categories: [
      { name: 'ஜோதிடம்', desc: 'ராசிபலன், பஞ்சாங்கம், சுப முகூர்த்தம்', href: '/astrology', icon: '✨', color: '#7E22CE' },
      { name: 'கோயில் செய்திகள்', desc: 'தமிழ்நாடு கோவில்களின் சிறப்பு செய்திகள்', href: '/article', icon: '🛕', color: '#C2410C' },
      { name: 'திருவிழாக்கள்', desc: 'பண்டிகை விழாக்கள் மற்றும் சிறப்பு நாட்கள்', href: '/article', icon: '🪔', color: '#CA8A04' },
      { name: 'பூஜை விதிகள்', desc: 'வீட்டில் செய்யக்கூடிய எளிய பூஜை வழிமுறைகள்', href: '/article', icon: '🙏', color: '#0E7490' },
      { name: 'வாஸ்து சாஸ்திரம்', desc: 'வீடு கட்ட, அறை அமைக்க வாஸ்து வழிமுறைகள்', href: '/article', icon: '🏠', color: '#15803D' },
      { name: 'குரு வாக்கு', desc: 'ஆன்மீக குருமார்களின் உபதேசங்கள்', href: '/article', icon: '📿', color: '#B91C1C' },
    ],

    // Mini panchangam summary (links to /astrology for full)
    panchangamHead: 'இன்றைய பஞ்சாங்கம் — சுருக்கம்',
    panchangamCtaText: 'முழு பஞ்சாங்கம் காண →',
    panchangam: {
      date: '12 மே 2026, செவ்வாய்க்கிழமை',
      tamilYear: 'குரோதி',
      tithi: 'பௌர்ணமி',
      nakshatra: 'விசாகம்',
      goodTime: 'காலை 10:30 - 11:30',
      rahuKalam: 'மாலை 3:00 - 4:30'
    },

    // Article list
    articlesHead: 'ஆன்மீக செய்திகள்',
    articlesMore: 'அனைத்தும் காண →',
    articles: [
      { title: 'திருவண்ணாமலை கிரிவலம்: பௌர்ணமி தினத்தில் குவியும் பக்தர்கள்', time: '2 மணி நேரம் முன்', cat: 'கோயில்', img: '', placeholder: 'GIRIVALAM', link: '' },
      { title: 'சபரிமலை ஐயப்பன் கோவிலில் புதிய நடைமுறைகள் அறிமுகம்', time: '4 மணி நேரம் முன்', cat: 'கோயில்', img: '', placeholder: 'SABARIMALA', link: '' },
      { title: 'வீட்டில் செல்வம் பெருக செய்ய வேண்டிய எளிய பூஜைகள்', time: 'நேற்று', cat: 'பூஜை', img: '', placeholder: 'POOJA', link: '' },
      { title: 'வாஸ்து சாஸ்திரம்: வீட்டின் பிரதான வாசல் எந்த திசையில் இருக்க வேண்டும்?', time: 'நேற்று', cat: 'வாஸ்து', img: '', placeholder: 'VASTHU', link: '' },
      { title: 'மதுரை மீனாட்சி அம்மன் கோயிலில் தைப்பூச திருவிழா கூட்டம்', time: '2 நாட்கள் முன்', cat: 'திருவிழா', img: '', placeholder: 'MEENAKSHI', link: '' },
      { title: 'குரு பெயர்ச்சி பலன்கள்: எந்த ராசிக்கு என்ன பலன்?', time: '3 நாட்கள் முன்', cat: 'ஜோதிடம்', img: '', placeholder: 'GURU', link: '' }
    ],

    // Sidebar
    sidebarHead: 'சிறப்பு தலைப்புகள்',
    sidebarItems: [
      { title: 'இன்று சுபமுகூர்த்தம்: முகூர்த்த நேரங்கள் முழு விவரம்', link: '/astrology' },
      { title: 'சனி பெயர்ச்சி பலன்கள்: எந்தெந்த ராசிகளுக்கு அதிர்ஷ்டம்?', link: '/astrology' },
      { title: 'வாஸ்து நாட்கள்: புதிய வீடுகட்ட நல்ல நேரங்கள்', link: '/article' },
      { title: 'தைப்பூசம் 2026: விழா நாட்கள் மற்றும் நேரங்கள்', link: '/article' }
    ],

    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'உங்கள் ஆலயத்தின் செய்திகளை வாசகர்களுக்கு கொண்டு செல்லுங்கள்',
      subtitle: 'கோயில் விளம்பரங்கள், விழா அறிவிப்புகள் — மறைமலை முரசு வழியாக ஐந்து லட்சம் ஆன்மீக வாசகர்களை சென்றடையுங்கள்',
      cta: 'விளம்பர திட்டங்கள் →',
      ctaHref: 'mailto:ads@maraimalaimurasu.com'
    }
  });

  const stripe = 'repeating-linear-gradient(45deg, #F5F1E8 0, #F5F1E8 12px, #FAF5E8 12px, #FAF5E8 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  // Merge any admin-published articles tagged as ஆன்மீகம் into the article list
  const [extraArticles, setExtraArticles] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const spiritual = parsed.filter(a =>
            a.category === 'ஆன்மீகம்' || a.category === 'spiritual' ||
            a.category === 'ஜோதிடம்' || a.category === 'astrology'
          );
          setExtraArticles(spiritual.map(a => ({
            title: a.title,
            time: `சமீபத்திய · ${a.date}`,
            cat: a.category || 'ஆன்மீகம்',
            img: a.img || '',
            placeholder: 'NEWS',
            link: a.pdf || ''
          })));
        } catch (e) { /* ignore */ }
      } else { setExtraArticles([]); }
    };
    load();
    const onChange = (e) => { if (e.key === 'customArticles') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const featured = pc.featured || {};
  const categories = pc.categories || [];
  const panchangam = pc.panchangam || {};
  const articles = [...extraArticles, ...(pc.articles || [])].slice(0, 12);
  const sidebarItems = pc.sidebarItems || [];
  const cta = pc.bottomCta || {};

  return (
    <div className="spiritual-page" style={{ background: '#FAF5E8', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Breadcrumb + Page header */}
        <div style={{ padding: '24px 0 8px' }}>
          <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <a href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>{pc.breadcrumb?.home || 'முகப்பு'}</a>
            <span>›</span>
            <strong style={{ color: 'var(--ink)' }}>{pc.breadcrumb?.current || 'ஆன்மீகம்'}</strong>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 52px)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {pc.title}
          </h1>
          <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'var(--ink-2)', maxWidth: '760px', lineHeight: 1.6 }}>
            {pc.subtitle}
          </p>
          <div style={{ height: '1px', background: 'var(--rule)', margin: '12px 0 28px' }} />
        </div>

        {/* MAIN GRID: content + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', marginBottom: '40px' }} className="spiritual-grid">

          {/* LEFT: featured + categories + articles */}
          <div>
            {/* Featured spiritual article */}
            {featured.title && (
              <a href={resolveLink(featured)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0, textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #F0E6D2', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 2px 8px rgba(120,80,30,0.05)' }}>
                <div style={{ minHeight: '320px', background: featured.img ? `url(${featured.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)', position: 'relative' }}>
                  {!featured.img && <span>{featured.placeholder}</span>}
                  {featured.kicker && (
                    <div style={{ position: 'absolute', top: '14px', left: '14px', background: '#9D174D', color: '#fff', padding: '6px 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', borderRadius: '4px', textTransform: 'uppercase' }}>{featured.kicker}</div>
                  )}
                </div>
                <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(180deg, #fff 0%, #FAF5E8 100%)' }}>
                  <h2 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '24px', lineHeight: 1.25, color: 'var(--ink)' }}>{featured.title}</h2>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.55, color: 'var(--ink-2)' }}>{featured.excerpt}</p>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{featured.meta}</div>
                </div>
              </a>
            )}

            {/* Category tiles */}
            {categories.length > 0 && (
              <section style={{ marginBottom: '32px' }}>
                <h2 style={{ margin: '0 0 16px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)', borderBottom: '2px solid #9D174D', paddingBottom: '8px' }}>{pc.categoriesHead}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {categories.map((c, i) => (
                    <a key={i} href={c.href || '#'} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #F0E6D2', borderRadius: '10px', padding: '20px', gap: '8px', transition: 'transform 0.18s, box-shadow 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(120,80,30,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{c.icon}</div>
                      <h3 style={{ margin: '6px 0 2px 0', fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 700, color: c.color }}>{c.name}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.45 }}>{c.desc}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Mini panchangam */}
            <section style={{ marginBottom: '32px', background: '#FFF8EA', border: '1px solid #F0E6D2', borderRadius: '12px', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '18px', color: '#9D174D' }}>✱ {pc.panchangamHead}</h3>
                <a href="/astrology" style={{ fontSize: '12px', color: '#9D174D', fontWeight: 700, textDecoration: 'none' }}>{pc.panchangamCtaText}</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div><div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>தமிழ் வருடம்</div><div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{panchangam.tamilYear}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>திதி</div><div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{panchangam.tithi}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>நட்சத்திரம்</div><div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{panchangam.nakshatra}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>நல்ல நேரம்</div><div style={{ fontSize: '13px', fontWeight: 600, color: '#0E7490' }}>{panchangam.goodTime}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>ராகு காலம்</div><div style={{ fontSize: '13px', fontWeight: 600, color: '#B91C1C' }}>{panchangam.rahuKalam}</div></div>
                <div><div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>தேதி</div><div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-2)' }}>{panchangam.date}</div></div>
              </div>
            </section>

            {/* Mid ad */}
            <div style={{ margin: '20px 0 28px' }}>
              <AdSlot network="sponsor" size="970x90" slotId="spiritual-inline-1" note="In-feed banner · 970 × 90" style={{ maxWidth: '100%' }} />
            </div>

            {/* Article list */}
            {articles.length > 0 && (
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', borderBottom: '2px solid #9D174D', paddingBottom: '8px' }}>
                  <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.articlesHead}</h2>
                  <a href="/article" style={{ fontSize: '12px', color: '#9D174D', fontWeight: 700, textDecoration: 'none' }}>{pc.articlesMore}</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {articles.map((a, i) => (
                    <a key={i} href={resolveLink(a)} style={{ display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #F0E6D2', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
                      <div style={{ flex: '0 0 90px', height: '90px', background: a.img ? `url(${a.img}) center/cover no-repeat` : stripe, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-3)' }}>
                        {!a.img && <span>{a.placeholder}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10px', color: '#9D174D', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{a.cat}</div>
                        <h3 style={{ margin: '0 0 6px 0', fontFamily: 'var(--serif)', fontSize: '14px', lineHeight: 1.35, color: 'var(--ink)', fontWeight: 700 }}>{a.title}</h3>
                        <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{a.time}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom CTA */}
            {cta && cta.title && (
              <section style={{ marginTop: '40px', background: 'linear-gradient(135deg, #9D174D 0%, #BE123C 100%)', color: '#fff', borderRadius: '12px', padding: '28px 32px' }}>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '14px', borderRadius: '4px' }}>{cta.sponsored}</div>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800, lineHeight: 1.3 }}>{cta.title}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.95, lineHeight: 1.5 }}>{cta.subtitle}</p>
                <a href={cta.ctaHref || '#'} style={{ display: 'inline-block', background: '#fff', color: '#9D174D', padding: '11px 24px', borderRadius: '6px', fontWeight: 800, textDecoration: 'none', fontSize: '13px' }}>{cta.cta}</a>
              </section>
            )}
          </div>

          {/* RIGHT: sidebar */}
          <aside>
            {/* Featured sidebar links */}
            {sidebarItems.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #F0E6D2', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '14px 18px', borderBottom: '2px solid #9D174D' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>{pc.sidebarHead}</h3>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
                  {sidebarItems.map((item, i) => (
                    <li key={i} style={{ borderBottom: i === sidebarItems.length - 1 ? 'none' : '1px solid #F0E6D2' }}>
                      <a href={item.link || '/article'} style={{ display: 'flex', gap: '10px', padding: '12px 18px', textDecoration: 'none', color: 'inherit' }}>
                        <span style={{ flex: '0 0 auto', color: '#9D174D' }}>📌</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.4, fontFamily: 'var(--serif)' }}>{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sidebar ad */}
            <div style={{ marginBottom: '20px' }}>
              <AdSlot network="google" size="300x600" slotId="spiritual-sidebar-1" note="Google Ad Manager · Half Page" style={{ maxWidth: '100%' }} />
            </div>
            <div>
              <AdSlot network="sponsor" size="300x250" slotId="spiritual-sidebar-2" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
            </div>
          </aside>
        </div>
      </div>

      {/* Responsive collapse */}
      <style>{`
        @media (max-width: 900px) {
          .spiritual-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .spiritual-grid section > div[style*="grid-template-columns: repeat(3, 1fr)"],
          .spiritual-grid section > div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
