import { useState, useEffect } from 'react';
import { AdSlot } from '../components/Ads.jsx';
import PdfViewer from '../components/PdfViewer.jsx';
import { usePageContent } from '../utils/pageContent.js';
import { resolvePdfUrl } from '../utils/pdfStorage.js';

const DEFAULT_RASI = [
  { sign: "மேஷம்", icon: "♈", desc: "இன்று நீங்கள் நினைத்த காரியங்கள் வெற்றிகரமாக முடியும். பணவரவு திருப்தியாக இருக்கும். புதிய முயற்சிகளைத் தொடங்கலாம்.", pdf: '', link: '' },
  { sign: "ரிஷபம்", icon: "♉", desc: "பணியிடத்தில் மதிப்பு அதிகரிக்கும். குடும்பத்தில் மகிழ்ச்சி நிலவும். வியாபாரத்தில் புதிய வாடிக்கையாளர்கள் கிடைப்பார்கள்.", pdf: '', link: '' },
  { sign: "மிதுனம்", icon: "♊", desc: "கொஞ்சம் நிதானமாக செயல்படுவது நல்லது. பேச்சில் கவனம் தேவை. வாகனப் பயணங்களில் எச்சரிக்கை அவசியம்.", pdf: '', link: '' },
  { sign: "கடகம்", icon: "♋", desc: "எதிர்பாராத தனவரவு கிடைக்கும். பழைய நண்பர்களைச் சந்தித்து மகிழ்வீர்கள். உடல் ஆரோக்கியம் சீராகும்.", pdf: '', link: '' },
  { sign: "சிம்மம்", icon: "♌", desc: "பணியில் கூடுதல் பொறுப்புகள் வரலாம். உங்களின் உழைப்பிற்கு ஏற்ற அங்கீகாரம் கிடைக்கும். குடும்பத்தினர் ஆதரவாக இருப்பார்கள்.", pdf: '', link: '' },
  { sign: "கன்னி", icon: "♍", desc: "பொருளாதார நிலை உயரும். மாணவர்கள் கல்வியில் சிறந்து விளங்குவார்கள். தொலைதூரப் பயணங்கள் பயனுள்ளதாக இருக்கும்.", pdf: '', link: '' },
  { sign: "துலாம்", icon: "♎", desc: "எடுத்த காரியங்களில் சிறு தடங்கல்கள் வந்து நீங்கும். நண்பர்களின் உதவி கிடைக்கும். புதிய முயற்சிகளை பிற்பகலில் தொடங்கவும்.", pdf: '', link: '' },
  { sign: "விருச்சிகம்", icon: "♏", desc: "நினைத்த காரியங்கள் கைக்கூடும். தொழில் வளர்ச்சி திருப்தியாக இருக்கும். மனைவியின் மூலம் நல்ல செய்தி வரும்.", pdf: '', link: '' },
  { sign: "தனுசு", icon: "♐", desc: "மனதில் புதிய தைரியம் பிறக்கும். சவால்களைச் சமாளித்து வெற்றி பெறுவீர்கள். புதிய ஆடை ஆபரணங்கள் வாங்குவீர்கள்.", pdf: '', link: '' },
  { sign: "மகரம்", icon: "♑", desc: "பணியிடத்தில் பொறுமை அவசியம். மேலதிகாரிகளின் ஆலோசனைகளைக் கேட்டு நடப்பது நல்லது. வீண் விவாதங்களைத் தவிர்க்கவும்.", pdf: '', link: '' },
  { sign: "கும்பம்", icon: "♒", desc: "உங்கள் திறமைகளை வெளிப்படுத்த நல்ல வாய்ப்பு கிடைக்கும். வியாபாரத்தில் லாபம் அதிகரிக்கும். தெய்வ வழிபாடு நல்லது.", pdf: '', link: '' },
  { sign: "மீனம்", icon: "♓", desc: "எதிர்பார்த்த உதவிகள் சரியான நேரத்தில் கிடைக்கும். மனக்குழப்பங்கள் நீங்கி தெளிவு பிறக்கும். சுப நிகழ்ச்சிகள் கைகூடும்.", pdf: '', link: '' },
];

export default function AstrologyPage() {
  const pc = usePageContent('astrology', {
    title: 'ஜோதிடம்',
    subtitle: 'ராசிபலன், பஞ்சாங்கம் மற்றும் ஆன்மீக செய்திகள்',
    panchangamHead: 'இன்றைய பஞ்சாங்கம்',
    panchangam: {
      date: '12 மே 2026, செவ்வாய்க்கிழமை',
      tamilYear: 'குரோதி',
      tithi: 'பௌர்ணமி',
      nakshatra: 'விசாகம்',
      yoga: 'சித்த யோகம்',
      goodTime: 'காலை 10:30 - 11:30',
      rahuKalam: 'மாலை 3:00 - 4:30'
    },
    rasiSectionHead: 'இன்றைய ராசிபலன்',
    readMoreLabel: 'மேலும் படிக்க ›',
    rasi: DEFAULT_RASI,
    sidebarHead: 'சிறப்பு செய்திகள்',
    sidebarItems: [
      { title: 'இன்று சுபமுகூர்த்தம்: முகூர்த்த நேரங்கள் முழு விவரம்', link: '/article' },
      { title: 'சனி பெயர்ச்சி பலன்கள்: எந்தெந்த ராசிகளுக்கு அதிர்ஷ்டம்?', link: '/article' },
      { title: 'வாஸ்து நாட்கள்: புதிய வீடுகட்ட நல்ல நேரங்கள்', link: '/article' }
    ],
    spiritualHead: 'ஆன்மீக செய்திகள்',
    spiritualMore: 'மேலும் →',
    spiritualArticles: [
      { title: 'திருவண்ணாமலை கிரிவலம்: பௌர்ணமி தினத்தில் குவியும் பக்தர்கள்', time: '2 மணி நேரத்திற்கு முன்', img: '', link: '' },
      { title: 'சபரிமலை ஐயப்பன் கோவிலில் புதிய நடைமுறைகள் அறிமுகம்', time: '4 மணி நேரத்திற்கு முன்', img: '', link: '' },
      { title: 'வீட்டில் செல்வம் பெருக செய்ய வேண்டிய எளிய பூஜைகள்', time: 'நேற்று', img: '', link: '' },
      { title: 'வாஸ்து சாஸ்திரம்: வீட்டின் பிரதான வாசல் எந்த திசையில் இருக்க வேண்டும்?', time: 'நேற்று', img: '', link: '' }
    ]
  });

  // Merge in admin-published articles tagged as ஜோதிடம்
  const [extraSpiritual, setExtraSpiritual] = useState([]);
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem('customArticles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const astro = parsed.filter(a => a.category === 'ஜோதிடம்' || a.category === 'astrology');
          setExtraSpiritual(astro.map(a => ({ title: a.title, time: `சமீபத்திய · ${a.date}`, img: a.img || '', link: a.pdf || '' })));
        } catch (e) { /* ignore */ }
      } else {
        setExtraSpiritual([]);
      }
    };
    load();
    const onChange = (e) => { if (e.key === 'customArticles') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);

  const rasi = pc.rasi || DEFAULT_RASI;
  const sidebarItems = pc.sidebarItems || [];
  const spiritualArticles = [...extraSpiritual, ...(pc.spiritualArticles || [])];

  // Modal state for inline PDF viewer
  const [pdfModal, setPdfModal] = useState(null); // { src, title, downloadName } | null

  // Click handler for "மேலும் படிக்க" — opens PDF in modal overlay (same page).
  // Falls back to external link or polite "coming soon" alert.
  const handleReadMore = async (e, item) => {
    e.preventDefault();

    // 1) PDF attached → resolve to blob URL and open in modal
    if (item.pdf && String(item.pdf).trim()) {
      try {
        const url = await resolvePdfUrl(item.pdf);
        if (url) {
          setPdfModal({
            src: url,
            title: `${item.sign} — விரிவான பலன்`,
            downloadName: `${item.sign}-rasi-palan.pdf`
          });
          return;
        }
      } catch (err) {
        console.error('PDF load failed', err);
      }
      alert('PDF இல்லை — மீண்டும் பதிவேற்றவும் (admin → Pages Editor → Astrology).');
      return;
    }

    // 2) External link
    if (item.link && String(item.link).trim()) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
      return;
    }

    // 3) Nothing configured
    alert('இந்த ராசிக்கான விரிவான பலன் கட்டுரை வெகுவிரைவில் வெளியிடப்படும்.\n\n(Admin: Pages Editor → Astrology → upload a PDF or set a link URL for this rasi.)');
  };

  // Clean up blob URLs when modal closes (avoid memory leaks)
  const closePdfModal = () => {
    if (pdfModal && pdfModal.src && pdfModal.src.startsWith('blob:')) {
      try { URL.revokeObjectURL(pdfModal.src); } catch (e) { /* ignore */ }
    }
    setPdfModal(null);
  };

  return (
    <div className="astrology-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="breadcrumb">
            <a href="/">முகப்பு</a> <span>›</span>
            <a href="/category">ஆன்மீகம்</a> <span>›</span>
            <strong>ஜோதிடம்</strong>
          </div>
          <h1 className="page-title">{pc.title}</h1>
          <p className="page-subtitle">{pc.subtitle}</p>
        </div>

        <div className="astrology-layout">
          <div className="astrology-main">

            {/* Panchangam Section */}
            <section className="panchangam-section">
              <div className="panchangam-box">
                <div className="panchangam-header">
                  <h2>{pc.panchangamHead}</h2>
                  <span className="date">{pc.panchangam?.date}</span>
                </div>
                <div className="panchangam-grid">
                  <div className="p-item">
                    <span className="label">தமிழ் வருடம்</span>
                    <span className="val">{pc.panchangam?.tamilYear}</span>
                  </div>
                  <div className="p-item">
                    <span className="label">திதி</span>
                    <span className="val">{pc.panchangam?.tithi}</span>
                  </div>
                  <div className="p-item">
                    <span className="label">நட்சத்திரம்</span>
                    <span className="val">{pc.panchangam?.nakshatra}</span>
                  </div>
                  <div className="p-item">
                    <span className="label">யோகம்</span>
                    <span className="val">{pc.panchangam?.yoga}</span>
                  </div>
                  <div className="p-item">
                    <span className="label">நல்ல நேரம்</span>
                    <span className="val">{pc.panchangam?.goodTime}</span>
                  </div>
                  <div className="p-item">
                    <span className="label">ராகு காலம்</span>
                    <span className="val">{pc.panchangam?.rahuKalam}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* INLINE AD #1 — between Panchangam and Rasi */}
            <div style={{ margin: '20px 0' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                விளம்பரம் · SPONSORED
              </div>
              <AdSlot network="sponsor" size="970x90" slotId="astro-inline-1" note="In-feed banner · 970 × 90" style={{ maxWidth: '100%' }} />
            </div>

            {/* Rasi Palan Grid — admin-editable, with optional PDF per rasi */}
            <section className="section rasi-section">
              <div className="section-head">
                <h2>{pc.rasiSectionHead}</h2>
              </div>
              <div className="rasi-grid">
                {rasi.map((r, i) => (
                  <div className="rasi-card" key={i}>
                    <div className="rasi-header">
                      <span className="rasi-icon">{r.icon}</span>
                      <h3>{r.sign}</h3>
                    </div>
                    <p>{r.desc}</p>
                    <div className="rasi-action">
                      <a href="#" onClick={(e) => handleReadMore(e, r)}>
                        {pc.readMoreLabel || 'மேலும் படிக்க ›'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* INLINE AD #2 — between Rasi and Spiritual articles */}
            <div style={{ margin: '24px 0' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                விளம்பரம் · SPONSORED
              </div>
              <AdSlot network="sponsor" size="970x90" slotId="astro-inline-2" note="In-feed banner · 970 × 90" style={{ maxWidth: '100%' }} />
            </div>

            {/* Spiritual Articles */}
            <section className="section spiritual-articles">
              <div className="section-head">
                <h2>{pc.spiritualHead}</h2>
                <a className="more" href="/category">{pc.spiritualMore}</a>
              </div>
              <div className="article-list">
                {spiritualArticles.map((article, i) => (
                  <a className="article-item" href={article.link || '#'} key={i}>
                    <div className="article-thumb">
                      {article.img ? (
                        <img src={article.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="ph">IMG</div>
                      )}
                    </div>
                    <div className="article-content">
                      <h4>{article.title}</h4>
                      <span className="meta">{article.time}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

          </div>
          {/* End astrology-main */}

          <aside className="astrology-sidebar">
            {/* Sidebar Widget — Featured News */}
            <div className="sidebar-widget">
              <div className="widget-head">
                <h3>{pc.sidebarHead}</h3>
              </div>
              <div className="widget-list">
                {sidebarItems.map((item, i) => (
                  <a key={i} href={item.link || '/article'} className="w-item">
                    <span className="w-icon">📌</span>
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="sticky-ad">
              <AdSlot network="google" size="300x600" slotId="astro-sidebar" note="Google Ad Manager · Half Page" />
            </div>

            {/* SIDEBAR AD #2 — 300x250 MPU */}
            <div className="sticky-ad" style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                விளம்பரம் · SPONSORED
              </div>
              <AdSlot network="sponsor" size="300x250" slotId="astro-sidebar-2" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
            </div>

            {/* SIDEBAR AD #3 — 300x250 MPU */}
            <div className="sticky-ad" style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: 'var(--ink-3)', fontFamily: 'var(--sans)', textTransform: 'uppercase', marginBottom: '8px' }}>
                விளம்பரம் · SPONSORED
              </div>
              <AdSlot network="sponsor" size="300x250" slotId="astro-sidebar-3" note="MPU · 300 × 250" style={{ maxWidth: '100%' }} />
            </div>
          </aside>

        </div>
        {/* End astrology-layout */}
      </div>

      {/* Inline PDF viewer modal */}
      <PdfViewer pdf={pdfModal} onClose={closePdfModal} />
    </div>
  );
}
