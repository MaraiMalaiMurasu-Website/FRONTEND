import React, { useState, useEffect } from 'react';
import { HERO_SIDE, TOP_STORIES, TWO_COL_LEFT, TWO_COL_RIGHT, SPORTS } from '../data/homeData.js';
import { AdSlot } from '../components/Ads.jsx';
import { getCardHref, handleCardClick } from '../utils/cardLink.js';

export default function CategoryPage({ title = "தலைப்புச் செய்திகள்" }) {
  const [customArticles, setCustomArticles] = useState([]);

  useEffect(() => {
    const loadCustom = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map(a => ({
          cat: a.category || "செய்தி",
          img: a.img || "/img/vijay.avif",
          title: a.title,
          meta: `சமீபத்திய · ${a.date}`,
          pdf: a.pdf || ''
        }));
        setCustomArticles(formatted);
      } else {
        setCustomArticles([]);
      }
    };
    loadCustom();
    const onChange = (e) => { if (e.key === 'customArticles') loadCustom(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  // Combine admin articles FIRST, then default data
  const articles = [
    ...customArticles,
    ...TOP_STORIES,
    ...HERO_SIDE.map(h => ({ cat: "முக்கிய செய்தி", img: h.img, title: h.title, meta: h.meta })),
    ...TWO_COL_LEFT.rest.map(r => ({ cat: "மாநிலம்", img: r.img, title: r.title, meta: r.meta })),
    ...TWO_COL_RIGHT.rest.map(r => ({ cat: "தேசியம்", img: r.img, title: r.title, meta: r.meta })),
    ...SPORTS.rest.map(s => ({ cat: "விளையாட்டு", img: s.img, title: s.title, meta: s.meta }))
  ];

  return (
    <div className="category-page">
      <header className="category-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <h1 className="category-title">{title}</h1>
      </header>

      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <AdSlot network="google" size="970x250" slotId="category-mid-ad" note="Google AdSense · Billboard" />
      </div>

      <div className="category-grid">
        {articles.map((article, idx) => (
          <a href={getCardHref(article)} onClick={(e) => handleCardClick(e, article)} className="cat-article-card" key={idx}>
            <img src={article.img} alt={article.title} />
            <div className="cat-article-kicker">{article.cat}</div>
            <h2 className="cat-article-title">{article.title}</h2>
            <div className="cat-article-meta">{article.meta}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
