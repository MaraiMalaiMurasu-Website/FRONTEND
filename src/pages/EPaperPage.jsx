import React, { useState, useEffect } from 'react';
import PdfViewer from '../components/PdfViewer.jsx';
import { resolvePdfUrl } from '../utils/pdfStorage.js';

/*
  ePaper page (செய்தித்தாள்கள்) — grid of weekly newspaper PDFs.
  Admin uploads PDFs via /admin → ePaper Editor.
  Visitor clicks a card → PDF opens in inline viewer modal.
*/

const DEFAULT_PAPERS = [
  { title: 'பிப்ரவரி 4வது வார செய்திகள்', desc: 'பிப்ரவரி 4வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
  { title: 'ஏப்ரல் 2வது வார செய்திகள்', desc: 'ஏப்ரல் 2வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
  { title: 'ஏப்ரல் 3வது வார செய்திகள்', desc: 'ஏப்ரல் 3வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
  { title: 'ஏப்ரல் 4வது வார செய்திகள்', desc: 'ஏப்ரல் 4வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
  { title: 'மே 1வது வார செய்திகள்', desc: 'மே 1வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' }
];

export default function EPaperPage() {
  const [pageContent, setPageContent] = useState({
    title: 'செய்தித்தாள்கள்',
    subtitle: 'செய்தித்தாள்களில் உள்ள அனைத்து செய்திகள் இங்கு பதிவேற்றிக் கொள்ளலாம்',
    heroBgImage: '',
    sections: {
      hero: true, subtitleBar: true, papersGrid: true, aboutFooter: true
    },
    papers: DEFAULT_PAPERS,
    aboutText: 'Driven by a bold vision, the founder of Marai Malai Murasu established the platform with a steadfast commitment to delivering accurate, timely, and meaningful news. From day one, the mission has been clear — to shape informed perspectives and keep the public empowered with truth. Today, Marai Malai Murasu stands as a trusted and influential news source, known for its integrity, reliability, and unwavering dedication to journalistic excellence. As the platform continues to grow, it remains focused on informing, inspiring, and empowering people across India with news that truly matters.'
  });

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customEPaperPage');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPageContent(prev => ({ ...prev, ...parsed }));
        } catch (e) { /* ignore */ }
      }
    };
    load();
    const onChange = (e) => { if (e.key === 'customEPaperPage') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const papers = pageContent.papers || [];
  const sec = pageContent.sections || {};
  const isOn = (key) => sec[key] !== false;
  const [pdfModal, setPdfModal] = useState(null);

  const openPaper = async (p) => {
    if (!p.pdfKey || !String(p.pdfKey).trim()) {
      alert(`"${p.title}" — PDF இன்னும் பதிவேற்றப்படவில்லை. நிர்வாகி (Admin) விரைவில் சேர்ப்பார்.`);
      return;
    }
    try {
      const url = await resolvePdfUrl(p.pdfKey);
      if (url) {
        setPdfModal({ src: url, title: p.title, downloadName: `${p.title}.pdf` });
      } else {
        alert('PDF காணப்படவில்லை — மீண்டும் பதிவேற்றவும்.');
      }
    } catch (err) {
      alert('PDF திறப்பதில் பிழை: ' + err.message);
    }
  };
  const closePdfModal = () => {
    if (pdfModal && pdfModal.src && pdfModal.src.startsWith('blob:')) {
      try { URL.revokeObjectURL(pdfModal.src); } catch (e) { /* ignore */ }
    }
    setPdfModal(null);
  };

  // Newspaper diagonal pattern for hero background (used when no image uploaded)
  const newsPattern = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 18px), linear-gradient(135deg, #2a3a4a 0%, #1f2a35 100%)';
  const heroBg = pageContent.heroBgImage
    ? `linear-gradient(135deg, rgba(20,30,40,0.75) 0%, rgba(15,25,35,0.85) 100%), url(${pageContent.heroBgImage}) center/cover no-repeat`
    : newsPattern;

  return (
    <div style={{ background: '#fff' }}>
      {/* HERO BANNER */}
      {isOn('hero') && (
        <section style={{ position: 'relative', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px', background: heroBg, color: '#fff' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '52px', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
              {pageContent.title}
            </h1>
          </div>
        </section>
      )}

      {/* SUBTITLE STRIP */}
      {isOn('subtitleBar') && pageContent.subtitle && (
        <div style={{ textAlign: 'center', padding: '28px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '18px', color: 'var(--ink)', fontWeight: 600 }}>
            {pageContent.subtitle}
          </p>
        </div>
      )}

      {/* PAPERS GRID */}
      {isOn('papersGrid') && (
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 24px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
            {papers.map((p, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {/* Thumbnail */}
              <button
                type="button"
                onClick={() => openPaper(p)}
                style={{ border: 0, padding: 0, background: 'transparent', cursor: p.pdfKey ? 'pointer' : 'default', display: 'block' }}
              >
                <div style={{ width: '100%', aspectRatio: '3/4', background: p.thumb ? `url(${p.thumb}) center/cover no-repeat` : '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid #E5E7EB' }}>
                  {!p.thumb && (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>📰</div>
                      <div>NEWSPAPER<br/>COVER</div>
                    </div>
                  )}
                  {p.pdfKey && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#059669', color: '#fff', padding: '3px 9px', borderRadius: '3px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>PDF</div>
                  )}
                </div>
              </button>
              {/* Body */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3 }}>{p.title}</h3>
                {p.desc && <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.5, flex: 1 }}>{p.desc}</p>}
                <button
                  type="button"
                  onClick={() => openPaper(p)}
                  style={{ alignSelf: 'flex-start', padding: '10px 22px', background: '#C8102E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' }}
                >
                  {p.ctaText || 'செய்திகள்'}
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* ABOUT FOOTER STRIP */}
      {isOn('aboutFooter') && pageContent.aboutText && (
        <div style={{ background: '#C8102E', color: '#fff', padding: '32px 24px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: '#fff', textAlign: 'left' }}>
              {pageContent.aboutText}
            </p>
          </div>
        </div>
      )}

      <PdfViewer pdf={pdfModal} onClose={closePdfModal} />
    </div>
  );
}
