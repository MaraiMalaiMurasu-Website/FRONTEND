/*
  MorePage — மற்றவை hub
  ────────────────────────────────
  The மற்றவை dropdown parent landing page. Showcases lifestyle content:
  Beauty, Cooking, and other miscellaneous categories.
  Admin-editable via the standard usePageContent() pattern (key: 'more').
*/

import { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import { usePageContent } from '../utils/pageContent.js';

export default function MorePage() {
  const pc = usePageContent('more', {
    title: 'மற்றவை',
    subtitle: 'அழகு, சமையல், வாழ்க்கை முறை — பெண்களின் தினசரி வாழ்வுக்கான பயனுள்ள தொகுப்பு.',
    breadcrumb: { home: 'முகப்பு', current: 'மற்றவை' },

    // Featured lifestyle article
    featured: {
      kicker: 'வாழ்வியல் சிறப்பு',
      title: 'வீட்டிலேயே செய்யக்கூடிய எளிய இயற்கை அழகு குறிப்புகள் — பெரியம்மா மருந்துகள்',
      excerpt: 'மலர் சாறு, தேங்காய் எண்ணெய், சந்தனம் — பெண்களின் பல்லாயிரம் ஆண்டுக் காலமாக பயன்படுத்தும் இயற்கை குறிப்புகள் இன்றும் சிறந்த விளைவுகளைத் தருகின்றன.',
      meta: 'வாழ்வியல் டெஸ்க் · 3 மணி நேரம் முன்',
      placeholder: 'LIFESTYLE',
      img: '',
      link: ''
    },

    // Sub-category tiles
    categoriesHead: 'பிரிவுகள்',
    categories: [
      { name: 'அழகுகுறிப்பு', desc: 'அழகியல், சருமம், முடி, மேக்கப் குறிப்புகள்', href: '/beauty', icon: '🌸', color: '#DB2777' },
      { name: 'சமையல்', desc: 'தமிழக சமையல் ரெசிபிகள் மற்றும் கையேடு', href: '/cooking', icon: '🍲', color: '#EA580C' },
      { name: 'இயற்கை மருத்துவம்', desc: 'பெரியம்மா மருந்துகள், மூலிகை குறிப்புகள்', href: '/article', icon: '🌿', color: '#15803D' },
      { name: 'குழந்தை வளர்ப்பு', desc: 'குழந்தைகள் வளர்ப்பு மற்றும் ஆரோக்கியம்', href: '/article', icon: '👶', color: '#0E7490' },
      { name: 'வீட்டு உதவிக்குறிப்பு', desc: 'வீட்டு பராமரிப்பு, சுத்தம், அமைப்பு', href: '/article', icon: '🏡', color: '#A16207' },
      { name: 'மகளிர் நலம்', desc: 'பெண்களுக்கான ஆரோக்கிய ஆலோசனைகள்', href: '/article', icon: '💗', color: '#9D174D' },
    ],

    // Article list
    articlesHead: 'வாழ்வியல் செய்திகள்',
    articlesMore: 'அனைத்தும் காண →',
    articles: [
      { title: 'முக அழகுக்கு தினசரி தண்ணீர் முக்கியத்துவம்', time: '2 மணி நேரம் முன்', cat: 'அழகு', img: '', placeholder: 'SKIN', link: '/beauty' },
      { title: 'காரம் குறைவான பிரியாணி — எளிய ரெசிபி', time: '4 மணி நேரம் முன்', cat: 'சமையல்', img: '', placeholder: 'BIRYANI', link: '/cooking' },
      { title: 'முடி உதிர்வை குறைக்க இயற்கை மருந்து', time: 'நேற்று', cat: 'அழகு', img: '', placeholder: 'HAIR', link: '/beauty' },
      { title: 'வாரம் ஒரு புதிய ரெசிபி: இனிப்பு பிரசாதம்', time: 'நேற்று', cat: 'சமையல்', img: '', placeholder: 'SWEET', link: '/cooking' },
      { title: 'வீட்டில் பழங்கால அளவை முறை — எளிய அளவீடுகள்', time: '2 நாட்கள் முன்', cat: 'வீடு', img: '', placeholder: 'HOME', link: '/article' },
      { title: 'பெண்களின் ஊட்டச்சத்து தேவைகள் — முழு வழிகாட்டி', time: '3 நாட்கள் முன்', cat: 'நலம்', img: '', placeholder: 'HEALTH', link: '/article' }
    ],

    // Sidebar
    sidebarHead: 'சிறப்பு தலைப்புகள்',
    sidebarItems: [
      { title: 'மணப்பெண் மேக்கப்: புதிய சிக்கல்லாத ஸ்டைல்கள்', link: '/beauty' },
      { title: 'மீன் குழம்பு — பாட்டி கையேடு', link: '/cooking' },
      { title: 'வேலையிட பெண்களுக்கான விரைவு சமையல் குறிப்புகள்', link: '/cooking' },
      { title: 'கோடைகாலத்தில் சருமப் பராமரிப்பு — அத்தியாவசிய டிப்ஸ்', link: '/beauty' }
    ],

    bottomCta: {
      sponsored: 'SPONSORED',
      title: 'உங்கள் ப்ராண்ட் — பெண் வாசகர்களுக்கு பிரத்யேக விளம்பரம்',
      subtitle: 'அழகு, சமையல், வாழ்க்கை வசதி ப்ராண்ட்களுக்கு — பெண் வாசகர்களை சென்றடையும் சிறந்த தளம்',
      cta: 'விளம்பர திட்டங்கள் →',
      ctaHref: 'mailto:ads@maraimalaimurasu.com'
    }
  });

  const stripe = 'repeating-linear-gradient(45deg, #FCE7E0 0, #FCE7E0 12px, #FDEAE0 12px, #FDEAE0 24px)';
  const resolveLink = (item, fallback = '/article') => (item && item.link && String(item.link).trim()) ? String(item.link).trim() : fallback;

  // Merge admin-published articles tagged as அழகு / சமையல் / மற்றவை
  const [extraArticles, setExtraArticles] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const lifestyle = parsed.filter(a =>
            a.category === 'அழகுகுறிப்பு' || a.category === 'அழகு குறிப்பு' || a.category === 'beauty' ||
            a.category === 'சமையல்' || a.category === 'cooking' ||
            a.category === 'மற்றவை' || a.category === 'more'
          );
          setExtraArticles(lifestyle.map(a => ({
            title: a.title,
            time: `சமீபத்திய · ${a.date}`,
            cat: a.category || 'மற்றவை',
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
  const articles = [...extraArticles, ...(pc.articles || [])].slice(0, 12);
  const sidebarItems = pc.sidebarItems || [];
  const cta = pc.bottomCta || {};

  return (
    <div className="more-page" style={{ background: '#FDF7F5', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Breadcrumb + Page header */}
        <div style={{ padding: '24px 0 8px' }}>
          <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <a href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>{pc.breadcrumb?.home || 'முகப்பு'}</a>
            <span>›</span>
            <strong style={{ color: 'var(--ink)' }}>{pc.breadcrumb?.current || 'மற்றவை'}</strong>
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 52px)', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {pc.title}
          </h1>
          <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'var(--ink-2)', maxWidth: '760px', lineHeight: 1.6 }}>
            {pc.subtitle}
          </p>
          <div style={{ height: '1px', background: '#F0E6D2', margin: '12px 0 28px' }} />
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', marginBottom: '40px' }} className="more-grid">

          {/* LEFT */}
          <div>
            {/* Featured article */}
            {featured.title && (
              <a href={resolveLink(featured)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0, textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '12px', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 2px 8px rgba(219, 39, 119, 0.06)' }}>
                <div style={{ minHeight: '320px', background: featured.img ? `url(${featured.img}) center/cover no-repeat` : stripe, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink-3)', position: 'relative' }}>
                  {!featured.img && <span>{featured.placeholder}</span>}
                  {featured.kicker && (
                    <div style={{ position: 'absolute', top: '14px', left: '14px', background: '#DB2777', color: '#fff', padding: '6px 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', borderRadius: '4px', textTransform: 'uppercase' }}>{featured.kicker}</div>
                  )}
                </div>
                <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(180deg, #fff 0%, #FDF2F8 100%)' }}>
                  <h2 style={{ margin: '0 0 12px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '24px', lineHeight: 1.25, color: 'var(--ink)' }}>{featured.title}</h2>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.55, color: 'var(--ink-2)' }}>{featured.excerpt}</p>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{featured.meta}</div>
                </div>
              </a>
            )}

            {/* Category tiles */}
            {categories.length > 0 && (
              <section style={{ marginBottom: '32px' }}>
                <h2 style={{ margin: '0 0 16px 0', fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)', borderBottom: '2px solid #DB2777', paddingBottom: '8px' }}>{pc.categoriesHead}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {categories.map((c, i) => (
                    <a key={i} href={c.href || '#'} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', padding: '20px', gap: '8px', transition: 'transform 0.18s, box-shadow 0.18s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(219, 39, 119, 0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{c.icon}</div>
                      <h3 style={{ margin: '6px 0 2px 0', fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 700, color: c.color }}>{c.name}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.45 }}>{c.desc}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Inline ad */}
            <div style={{ margin: '20px 0 28px' }}>
              <AdSlot network="sponsor" size="970x90" slotId="more-inline-1" note="In-feed banner · 970 × 90" style={{ maxWidth: '100%' }} />
            </div>

            {/* Article list */}
            {articles.length > 0 && (
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', borderBottom: '2px solid #DB2777', paddingBottom: '8px' }}>
                  <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>{pc.articlesHead}</h2>
                  <a href="/article" style={{ fontSize: '12px', color: '#DB2777', fontWeight: 700, textDecoration: 'none' }}>{pc.articlesMore}</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {articles.map((a, i) => (
                    <a key={i} href={resolveLink(a)} style={{ display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', overflow: 'hidden', padding: '12px' }}>
                      <div style={{ flex: '0 0 90px', height: '90px', background: a.img ? `url(${a.img}) center/cover no-repeat` : stripe, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-3)' }}>
                        {!a.img && <span>{a.placeholder}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10px', color: '#DB2777', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{a.cat}</div>
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
              <section style={{ marginTop: '40px', background: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)', color: '#fff', borderRadius: '12px', padding: '28px 32px' }}>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '14px', borderRadius: '4px' }}>{cta.sponsored}</div>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 800, lineHeight: 1.3 }}>{cta.title}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.95, lineHeight: 1.5 }}>{cta.subtitle}</p>
                <a href={cta.ctaHref || '#'} style={{ display: 'inline-block', background: '#fff', color: '#DB2777', padding: '11px 24px', borderRadius: '6px', fontWeight: 800, textDecoration: 'none', fontSize: '13px' }}>{cta.cta}</a>
              </section>
            )}
          </div>

          {/* RIGHT */}
          <aside>
            {sidebarItems.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #FBCFE8', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '14px 18px', borderBottom: '2px solid #DB2777' }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>{pc.sidebarHead}</h3>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
                  {sidebarItems.map((item, i) => (
                    <li key={i} style={{ borderBottom: i === sidebarItems.length - 1 ? 'none' : '1px solid #FBCFE8' }}>
                      <a href={item.link || '/article'} style={{ display: 'flex', gap: '10px', padding: '12px 18px', textDecoration: 'none', color: 'inherit' }}>
                        <span style={{ flex: '0 0 auto', color: '#DB2777' }}>🌸</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.4, fontFamily: 'var(--serif)' }}>{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <AdSlot network="google" size="300x600" slotId="more-sidebar-1" note="Google Ad Manager · Half Page" style={{ maxWidth: '100%' }} />
            </div>
            <div>
              <AdSlot network="sponsor" size="300x250" slotId="more-sidebar-2" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .more-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .more-grid section > div[style*="grid-template-columns: repeat(3, 1fr)"],
          .more-grid section > div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
