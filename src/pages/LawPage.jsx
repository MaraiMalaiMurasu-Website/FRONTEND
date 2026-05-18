import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import { usePageContent } from '../utils/pageContent.js';
import { getCardHref, handleCardClick } from '../utils/cardLink.js';
import './LawPage.css';

export default function LawPage() {
  const pc = usePageContent('law', {
    title: 'சட்டம் முரசு',
    eyebrow: 'நீதி அறிவிப்பு',
    subtitle: 'நீதிமன்ற செய்திகள், சட்ட விளக்கங்கள், குற்றவியல் வழக்குகள் மற்றும் அனைத்து சட்ட தகவல்களின் முழுமையான தொகுப்பு.',
    stats: [
      { num: '24', label: 'சட்ட செய்திகள்' },
      { num: '8.5K', label: 'வாசகர்கள்' },
      { num: '12', label: 'நீதிமன்றம்' },
      { num: '100%', label: 'உண்மை தகவல்' }
    ],
    featured: {
      cat: 'நீதிமன்றம்',
      img: '/img/crime-scene.avif',
      title: 'சிறுமி கொலை வழக்கு: குற்றவாளிக்கு தூக்கு தண்டனை — புதுச்சேரி நீதிமன்றம் அதிரடி தீர்ப்பு',
      excerpt: 'நீதிமன்ற செய்திகள், சட்ட விளக்கங்கள், குற்றவியல் வழக்குகள் — அனைத்து சட்டம் சம்பந்தமான தகவல்களின் முழுமையான ஆதாரம்.',
      meta: 'சட்ட டெஸ்க் · 2 மணி நேரம்',
      liveTime: 'LIVE',
      liveLabel: 'LAW'
    },
    secondary: [
      { cat: 'நீதிமன்றம்', img: '/img/crime-scene.avif', title: 'சப்-இன்ஸ்பெக்டர் சுட்டுக் கொலை: துப்பாக்கி முனையில் மிரட்டல்', meta: 'சட்ட டெஸ்க் · 1 மணி நேரம்' },
      { cat: 'சட்டம்', img: '/img/cheating-case.avif', title: 'காலிஸ்தான் கோவிட் முறைகேடு: 12 ஊர்களில் நடவடிக்கை எடுக்க உத்தரவு', meta: 'சட்ட டெஸ்க் · 3 மணி நேரம்' }
    ],
    sectionHead: 'நேரடி சட்ட செய்திகள்',
    sectionMore: 'அனைத்தும் காண்க ›',
    stream: [
      { time: '10:30', cat: 'நீதிமன்றம்', title: 'ரூ.5.13 கோடி மோசடி: நிதி நிறுவன உரிமையாளர் மனைவி கைது!', meta: 'சட்ட டெஸ்க் · 4 மணி நேரம்' },
      { time: '10:25', cat: 'சட்டம்', title: 'நகைக்காக மூதாட்டி கொலை: இளைஞர் கைது', meta: 'சட்ட டெஸ்க் · 5 மணி நேரம்' },
      { time: '10:20', cat: 'உரிமை', title: 'தொழிலாளர் உரிமைகள்: புதிய சட்டத் திருத்தங்கள் அறிவிப்பு', meta: 'சட்ட டெஸ்க் · 8 மணி நேரம்' },
      { time: '10:15', cat: 'சட்டம்', title: 'சைபர் குற்றம்: ஆன்லைன் மோசடி குறித்து விழிப்புணர்வு பிரசாரம்', meta: 'சட்ட டெஸ்க் · 10 மணி நேரம்' },
      { time: '10:10', cat: 'நீதிமன்றம்', title: 'பெண் பாதுகாப்பு: புதிய சட்டத் திருத்தம் அறிவிப்பு', meta: 'சட்ட டெஸ்க் · 12 மணி நேரம்' },
      { time: '10:05', cat: 'சட்டம்', title: 'நில உரிமை வழக்கு: உச்சநீதிமன்றம் முக்கிய தீர்ப்பு', meta: 'சட்ட டெஸ்க் · 1 நாள்' }
    ],
    loadMore: 'மேலும் செய்திகளை ஏற்றவும்',
    sidebarAdLabel: '300 × 360',
    mostReadHead: 'அதிகம் வாசிக்கப்பட்டவை',
    mostRead: [
      { title: 'ரூ.5.13 கோடி மோசடி: நிதி நிறுவன உரிமையாளர் மனைவி கைது!', link: '' },
      { title: 'சப்-இன்ஸ்பெக்டர் சுட்டுக் கொலை: துப்பாக்கி முனையில் மிரட்டல்', link: '' },
      { title: 'காலிஸ்தான் கோவிட் முறைகேடு: 12 ஊர்களில் நடவடிக்கை எடுக்க உத்தரவு', link: '' },
      { title: 'நகைக்காக மூதாட்டி கொலை: இளைஞர் கைது', link: '' }
    ],
    opinionHead: 'சட்ட கருத்துக்கள்',
    opinion: [
      { quote: 'சட்டம் அனைவருக்கும் சமமாக அமல்படுத்தப்பட வேண்டும்.', author: 'சட்ட நிபுணர் — சென்னை' },
      { quote: 'சைபர் குற்றங்கள் நாளுக்கு நாள் அதிகரித்து வருகின்றன.', author: 'வழக்கறிஞர் — பேட்டி' }
    ]
  });

  const [customLaw, setCustomLaw] = useState([]);

  useEffect(() => {
    const loadCustom = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        const parsed = JSON.parse(saved);
        const lawItems = parsed
          .filter((a) => a.category === 'சட்டம் முரசு' || a.category === 'நீதிமன்றம்' || a.category === 'சட்டம்')
          .map((a) => ({
            cat: a.category || 'சட்டம் முரசு',
            img: a.img || '/img/crime-scene.avif',
            title: a.title,
            meta: `சட்ட டெஸ்க் · ${a.date}`,
            thumb: 'LAW',
            pdf: a.pdf || ''
          }));
        setCustomLaw(lawItems);
      } else {
        setCustomLaw([]);
      }
    };
    loadCustom();
    const onChange = (e) => { if (e.key === 'customArticles') loadCustom(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const featured = pc.featured;
  const stats = pc.stats || [];
  const secondary = pc.secondary || [];
  const streamItems = [...customLaw.map((c, i) => ({ time: `0${i}:00`.slice(-5), cat: c.cat, title: c.title, meta: c.meta, link: '' })), ...(pc.stream || [])];
  const mostRead = pc.mostRead && pc.mostRead.length > 0 ? pc.mostRead : streamItems.slice(0, 4).map(s => ({ title: s.title, link: s.link || '' }));
  const opinion = pc.opinion || [];

  // Helper: resolve link — admin's custom `link` overrides default
  const resolveLink = (item, fallback = '/article') => (item && item.link && item.link.trim()) ? item.link.trim() : fallback;

  return (
    <div className="law-page">
      {/* TOP HEADER */}
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

      {/* MAIN GRID */}
      <div className="law-grid">
        {/* LEFT CONTENT */}
        <div className="law-main">
          {/* HERO */}
          <div className="law-hero">
            <a href={resolveLink(featured, '/article')} className="law-hero-image">
              <img src={featured.img} alt={featured.title} />
              <div className="law-category-pill">{featured.cat}</div>
              <div className="law-live-box">
                <div className="law-live-time">{featured.liveTime || 'LIVE'}</div>
                <div className="law-live-label">{featured.liveLabel || 'LAW'}</div>
              </div>
            </a>
            <div className="law-hero-content">
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="law-meta">{featured.meta}</div>
            </div>
          </div>

          {/* SECONDARY NEWS */}
          <div className="law-secondary">
            {secondary.map((article, idx) => (
              <a
                href={article.link && article.link.trim() ? article.link.trim() : getCardHref(article)}
                onClick={(e) => { if (!article.link) handleCardClick(e, article); }}
                className="law-card"
                key={idx}
              >
                <div className="law-card-image">
                  <img src={article.img} alt={article.title} />
                  <div className="law-category-pill small">{article.cat}</div>
                </div>
                <h3>{article.title}</h3>
                <div className="law-meta">{article.meta}</div>
              </a>
            ))}
          </div>

          {/* ADVERTISEMENT */}
          <div className="law-ad-wrapper">
            <AdSlot network="google" size="970x250" slotId="law-mid-ad" note="Google AdSense · Billboard" />
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
              {streamItems.slice(0, 8).map((article, idx) => (
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
        </div>

        {/* SIDEBAR */}
        <aside className="law-sidebar">
          {/* SIDE AD — uses per-slot image from Ad Manager */}
          <AdSlot network="google" size="300x600" slotId="law-sidebar-1" note="Google Ad Manager · Half Page" style={{ maxWidth: '100%' }} />

          {/* MOST READ */}
          <div className="law-sidebar-block">
            <div className="law-sidebar-head">{pc.mostReadHead}</div>
            <ol className="law-most-read">
              {mostRead.map((article, idx) => (
                <li key={idx}>
                  <a href={article.link && article.link.trim() ? article.link.trim() : '/article'} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <h5>{article.title}</h5>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* OPINION */}
          <div className="law-sidebar-block">
            <div className="law-sidebar-head">{pc.opinionHead}</div>
            <ul className="law-opinion">
              {opinion.map((o, idx) => (
                <li key={idx}>
                  <div className="quote">"</div>
                  <h5>"{o.quote}"</h5>
                  <div className="author">{o.author}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* SECONDARY SIDEBAR AD — fills empty space below opinion block */}
          <AdSlot network="google" size="300x250" slotId="law-sidebar-2" note="Google AdSense · Rectangle" style={{ maxWidth: '100%' }} />

          {/* TERTIARY SIDEBAR AD — bottom sticky ad */}
          <AdSlot network="meta" size="300x600" slotId="law-sidebar-3" note="Meta Audience Network · Half Page" style={{ maxWidth: '100%' }} />
        </aside>
      </div>
    </div>
  );
}
