import { useState, useEffect } from 'react';
import { AdSlot, SponsorCard, InFeedAd } from '../components/Ads.jsx';
import PdfViewer from '../components/PdfViewer.jsx';
import {
  LEAD_VIDEO, HERO_SIDE, TOP_STORIES, ELECTION_GRID,
  CINEMA, TWO_COL_LEFT, TWO_COL_RIGHT, SPORTS, LIFESTYLE, LIVE_TICKER_ITEMS,
} from '../data/homeData.js';
import { getCardHref, handleCardClick } from '../utils/cardLink.js';
import { buildMeta, timeAgoTamil } from '../utils/time.js';
import { resolvePdfUrl } from '../utils/pdfStorage.js';

// ---------- HeroVideo ----------
function HeroVideo({ video, blurb }) {
  const [playing, setPlaying] = useState(false);
  const v = video || LEAD_VIDEO;
  const b = blurb || {};
  const thumb = v.poster || `https://i.ytimg.com/vi/${v.videoId}/maxresdefault.jpg`;
  return (
    <div className="hero-video-wrap">
    <div className="hero-video hero-video-yt">
      {playing ? (
        <div className="yt-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={v.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <button className="yt-poster" onClick={() => setPlaying(true)} aria-label="Play video">
          <img src={thumb} alt="" />
          <span className="yt-play-btn" aria-hidden="true">
            <svg viewBox="0 0 68 48">
              <path className="yt-play-bg" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/>
              <path d="M 45,24 27,14 27,34" fill="#fff"/>
            </svg>
          </span>
        </button>
      )}
      <div className="caption">
        <div className="kicker">{v.kicker}</div>
        <h2>{v.title}</h2>
        <div className="meta">{v.meta}</div>
      </div>
    </div>
      <div className="hero-video-blurb">
        {b.dek && <p className="dek">{b.dek}</p>}
        {(b.liveTag || (b.tags && b.tags.length > 0)) && (
          <div className="hero-video-tags">
            {b.liveTag && <span className="tag tag-live">{b.liveTag}</span>}
            {(b.tags || []).map((t, i) => (
              <a className="tag" href={t.href || '/article'} key={i}>{t.text}</a>
            ))}
          </div>
        )}
        {(() => {
          // Auto-compute updated time from timestamp; fall back to manual `updatedAt` text
          const displayUpdatedAt = b.updatedAtTs ? timeAgoTamil(b.updatedAtTs) : b.updatedAt;
          return (b.reporting || displayUpdatedAt) ? (
            <div className="hero-video-byline">
              {b.reporting && <span><strong>Reporting:</strong> {b.reporting}</span>}
              {b.reporting && displayUpdatedAt && <span className="dot">·</span>}
              {displayUpdatedAt && <span>புதுப்பித்தது: <time>{displayUpdatedAt}</time></span>}
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

// ---------- SideCard ----------
function SideCard({ item }) {
  // Auto-compute meta from publishedAt + location, fallback to manual meta
  const displayMeta = item.publishedAt
    ? buildMeta(item.location, item.publishedAt)
    : item.meta;
  return (
    <a className="hero-side-card" href={getCardHref(item)} onClick={(e) => handleCardClick(e, item)}>
      <div className="thumb">
        <span className="num">{String(item.n).padStart(2, "0")}</span>
        {item.img
          ? <img src={item.img} alt="" loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
          : <div className="ph">IMG</div>}
      </div>
      <div>
        <h3>{item.title}</h3>
        <div className="meta">{displayMeta}</div>
      </div>
    </a>
  );
}

// ---------- Card ----------
function Card({ data, withVideo }) {
  // Auto-compute meta from publishedAt + location, fallback to manual meta
  const displayMeta = data.publishedAt
    ? buildMeta(data.location || data.cat, data.publishedAt)
    : data.meta;
  return (
    <a className="card" href={getCardHref(data)} onClick={(e) => handleCardClick(e, data)}>
      <div className="thumb">
        <span className="cat-pill">{data.cat}</span>
        {data.img
          ? <img src={data.img} alt="" loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
          : <div className="ph">{data.thumb}</div>}
        {withVideo && (
          <span className="video-mark">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
        )}
      </div>
      <h3>{data.title}</h3>
      <div className="meta"><span>{displayMeta}</span></div>
    </a>
  );
}

// ---------- ColBlock ----------
function ColBlock({ data }) {
  return (
    <div className="col-block">
      <div className="col-head">
        <h3>{data.head}</h3>
        <a className="more" href="/category">அனைத்தும் →</a>
      </div>
      <div className="col-list">
        <a className="item lead" href={getCardHref(data.lead)} onClick={(e) => handleCardClick(e, data.lead)}>
          <div className="thumb">
            {data.lead.img
              ? <img src={data.lead.img} alt="" loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
              : <div className="ph">{data.lead.thumb}</div>}
          </div>
          <h4>{data.lead.title}</h4>
          <p className="excerpt">{data.lead.excerpt}</p>
          <div className="meta">{data.lead.meta}</div>
        </a>
        {data.rest.map((it, i) => (
          <a className="item" href={getCardHref(it)} onClick={(e) => handleCardClick(e, it)} key={i}>
            <div>
              <h4>{it.title}</h4>
              <div className="meta">{it.meta}</div>
            </div>
            <div className="thumb">
              {it.img
                ? <img src={it.img} alt="" loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                : <div className="ph">{it.thumb}</div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------- LiveTicker ----------
export function LiveTicker() {
  const [items, setItems] = useState(LIVE_TICKER_ITEMS);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('customHomeContent');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.liveTicker && Array.isArray(parsed.liveTicker) && parsed.liveTicker.length > 0) {
            setItems(parsed.liveTicker);
            return;
          }
        }
        setItems(LIVE_TICKER_ITEMS);
      } catch (e) {
        setItems(LIVE_TICKER_ITEMS);
      }
    };
    load();
    const onChange = (e) => { if (e.key === 'customHomeContent') load(); };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);
  return (
    <div className="live-ticker" role="region" aria-label="Live headlines">
      <div className="live-ticker-inner">
        <div className="live-ticker-label">
          <span className="live-dot"></span>
          <span className="live-text">நேரலை</span>
        </div>
        <div className="live-ticker-track">
          <div className="live-ticker-marquee">
            {[...items, ...items].map((it, i) => (
              <a className="live-ticker-item" href="/article" key={i}>
                <span className="live-ticker-time">{`${10 + (i % 8)}:${String((i * 7) % 60).padStart(2, "0")}`}</span>
                <span>{it}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="live-ticker-source">மறைமலை முரசு · LIVE</div>
      </div>
    </div>
  );
}

// ---------- ElectionBanner ----------
export function ElectionBanner({ title = 'தேர்தல் 2026 களம்', leftNum = '234', leftLabel = 'தொகுதிகள்\nவாக்கெடுப்பு பகுதிகள்', rightNum = '6.4கோ', rightLabel = 'வாக்காளர்கள்\nபதிவு செய்தவர்கள்' }) {
  const parts = title.split('2026');
  const renderLines = (text) => text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
  ));
  return (
    <section className="election-banner" data-screen-label="Election">
      <div className="election-inner">
        <div className="left-stat">
          <span className="stat-num">{leftNum}</span>
          {renderLines(leftLabel)}
        </div>
        <h2>
          {parts.length === 2 ? (
            <><span>{parts[0]}</span><span className="year">2026</span><span>{parts[1]}</span></>
          ) : (
            <span>{title}</span>
          )}
        </h2>
        <div className="right-stat">
          <span className="stat-num">{rightNum}</span>
          {renderLines(rightLabel)}
        </div>
      </div>
    </section>
  );
}

// ---------- HomePage ----------
export default function HomePage() {
  const [customTopStories, setCustomTopStories] = useState(TOP_STORIES);
  const [customCinema, setCustomCinema] = useState(CINEMA);
  const [customSports, setCustomSports] = useState(SPORTS);
  const [customLifestyle, setCustomLifestyle] = useState(LIFESTYLE);
  const [leadVideo, setLeadVideo] = useState(LEAD_VIDEO);
  const [heroBlurb, setHeroBlurb] = useState({
    dek: 'இன்று மாலை 6:00 மணிக்கு திராவிட முன்னேற்றக் கழகம், அதிமுக, பாஜக, தமிழக வெற்றிக் கழகம் ஆகியோரின் வேட்பாளர் பட்டியல் ஒரே நாளில் வெளியிடப்பட உள்ளது. சேலம், மதுரை, கோவை மாவட்டங்களின் முக்கிய தொகுதிகளில் கடும் போட்டி எதிர்பார்க்கப்படுகிறது.',
    liveTag: '● LIVE',
    tags: [
      { text: 'தேர்தல் 2026', href: '/headlines' },
      { text: 'வேட்பாளர் பட்டியல்', href: '/article' },
      { text: 'DMK · AIADMK · BJP · TVK', href: '/article' }
    ],
    reporting: 'சேது மாதவன், கோபால் ராமன், பிரியா சுந்தர்',
    updatedAt: 'இன்று 11:42 AM IST'
  });
  const [heroSideItems, setHeroSideItems] = useState(HERO_SIDE);
  const [tickerItems, setTickerItems] = useState(LIVE_TICKER_ITEMS);
  const [electionBanner, setElectionBanner] = useState({
    title: 'தேர்தல் 2026 களம்',
    leftNum: '234',
    leftLabel: 'தொகுதிகள்\nவாக்கெடுப்பு பகுதிகள்',
    rightNum: '6.4கோ',
    rightLabel: 'வாக்காளர்கள்\nபதிவு செய்தவர்கள்'
  });
  const [sponsorCard, setSponsorCard] = useState({
    brand: 'சென்னை சில்க்ஸ் · Chennai Silks',
    headline: 'தீபாவளி கொண்டாட்டம் — பட்டுப் புடவைகள் மீது 40% சலுகை',
    copy: 'எல்லா முன்னணி கிளைகளிலும் · ஆன்லைன் ஆர்டர்களுக்கு ₹500 கூடுதல் தள்ளுபடி · மே 14 வரை',
    cta: 'கடைகளைக் கண்டறி →',
    thumb: 'SILK SAREE'
  });
  const [advertiseCta, setAdvertiseCta] = useState({
    headline: 'உங்கள் பிராண்டை 14 லட்சம் வாசகர்களுக்கு கொண்டு செல்லுங்கள்',
    copy: 'Google Ads, Meta Audience Network வழியாக programmatic விளம்பரங்கள் — அல்லது நேரடி ஆதரவாளர் ஒப்பந்தங்கள். print + digital + newsletter — மூன்று தளங்களிலும் ஒரே campaign-ல்.',
    networks: ['Google AdSense', 'Google Ad Manager', 'Meta Audience Network', 'Direct Sponsorship', 'Newsletter'],
    ctaText: 'விளம்பர திட்டங்கள்',
    ctaSub: 'ads@maraimalaimurasu.com',
    ctaHref: 'mailto:ads@maraimalaimurasu.com'
  });
  // Weekly newspaper PDF (uploaded via admin → Home Editor)
  const [editionPdf, setEditionPdf] = useState({ key: '', title: '', issueDate: '' });
  const [pdfModal, setPdfModal] = useState(null);
  const [topStoriesGrid, setTopStoriesGrid] = useState(TOP_STORIES);
  const [electionGridArr, setElectionGridArr] = useState(ELECTION_GRID);
  const [cinemaGridArr, setCinemaGridArr] = useState(CINEMA);
  const [twoColLeft, setTwoColLeft] = useState(TWO_COL_LEFT);
  const [twoColRight, setTwoColRight] = useState(TWO_COL_RIGHT);
  const [sportsColData, setSportsColData] = useState(SPORTS);
  const [lifestyleColData, setLifestyleColData] = useState(LIFESTYLE);
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'மறைமலை முரசு — முன்களச் செய்திகள்',
    heroTitle: 'தேர்தல் 2026 களம்',
    section1Title: 'தேர்தல் கள விசாரணை',
    section1Cat: 'சட்டம் முரசு',
    section2Title: 'வெள்ளித் திரை · சமையல்',
    section2Cat: 'சினிமா',
    section3Title: 'விளையாட்டு',
    section3Cat: 'விளையாட்டு',
    section4Title: 'மற்றவை',
    section4Cat: 'அழகுகுறிப்பு'
  });

  useEffect(() => {
    // 1. Load site settings + listen for changes from admin
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('customSiteSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSiteSettings(prev => ({ ...prev, ...parsedSettings }));
        document.title = parsedSettings.siteTitle || 'மறைமலை முரசு — முன்களச் செய்திகள்';
      } else {
        document.title = 'மறைமலை முரசு — முன்களச் செய்திகள்';
      }
    };

    // 1b. Load home content (hero video + side cards + ticker + banners) from admin
    const loadHomeContent = () => {
      const saved = localStorage.getItem('customHomeContent');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.leadVideo) setLeadVideo(parsed.leadVideo);
          if (parsed.heroBlurb) setHeroBlurb(prev => ({ ...prev, ...parsed.heroBlurb }));
          if (parsed.heroSide && Array.isArray(parsed.heroSide)) setHeroSideItems(parsed.heroSide);
          if (parsed.liveTicker && Array.isArray(parsed.liveTicker)) setTickerItems(parsed.liveTicker);
          if (parsed.electionBanner) setElectionBanner(prev => ({ ...prev, ...parsed.electionBanner }));
          if (parsed.sponsorCard) setSponsorCard(prev => ({ ...prev, ...parsed.sponsorCard }));
          if (parsed.advertiseCta) setAdvertiseCta(prev => ({ ...prev, ...parsed.advertiseCta }));
          if (parsed.editionPdf) setEditionPdf(prev => ({ ...prev, ...parsed.editionPdf }));
          if (parsed.topStoriesGrid && Array.isArray(parsed.topStoriesGrid)) setTopStoriesGrid(parsed.topStoriesGrid);
          if (parsed.electionGrid && Array.isArray(parsed.electionGrid)) setElectionGridArr(parsed.electionGrid);
          if (parsed.cinemaGrid && Array.isArray(parsed.cinemaGrid)) setCinemaGridArr(parsed.cinemaGrid);
          if (parsed.twoColLeft) setTwoColLeft(parsed.twoColLeft);
          if (parsed.twoColRight) setTwoColRight(parsed.twoColRight);
          if (parsed.sportsCol) setSportsColData(parsed.sportsCol);
          if (parsed.lifestyleCol) setLifestyleColData(parsed.lifestyleCol);
        } catch (e) {
          console.error('Failed to parse customHomeContent', e);
        }
      }
    };

    // 2. Load articles filtered by admin-selected categories per section
    const loadArticles = () => {
      const saved = localStorage.getItem('customArticles');
      const settingsRaw = localStorage.getItem('customSiteSettings');
      const homeRaw = localStorage.getItem('customHomeContent');
      const settings = settingsRaw ? JSON.parse(settingsRaw) : {};
      const home = homeRaw ? JSON.parse(homeRaw) : {};

      // Use admin's edited grids as base; fall back to static data
      const baseTop = (home.topStoriesGrid && home.topStoriesGrid.length) ? home.topStoriesGrid : TOP_STORIES;
      const baseCinema = (home.cinemaGrid && home.cinemaGrid.length) ? home.cinemaGrid : CINEMA;

      if (!saved) {
        setCustomTopStories(baseTop.slice(0, 8));
        setCustomCinema(baseCinema.slice(0, 4));
        return;
      }
      const parsed = JSON.parse(saved);

      const formatCard = a => ({
        cat: a.category || "தலைப்புச் செய்திகள்",
        img: a.img || "/img/vijay.avif",
        title: a.title,
        meta: `சமீபத்திய · ${a.date}`,
        thumb: "NEWS",
        pdf: a.pdf || ''
      });
      const formatList = a => ({
        img: a.img || "/img/vijay.avif",
        title: a.title,
        meta: `சமீபத்திய · ${a.date}`,
        pdf: a.pdf || ''
      });

      // Section 1 (Top Stories) — uses admin section1Cat, fallback to top headlines
      const cat1 = settings.section1Cat || 'தலைப்புச் செய்திகள்';
      const cat2 = settings.section2Cat || 'சினிமா';
      const cat3 = settings.section3Cat || 'விளையாட்டு';
      const cat4 = settings.section4Cat || 'அழகுகுறிப்பு';

      const headlines = parsed.filter(a => a.category === cat1 || !a.category).map(formatCard);
      const cinema = parsed.filter(a => a.category === cat2).map(formatCard);
      const sportsList = parsed.filter(a => a.category === cat3).map(formatList);
      const lifestyleList = parsed.filter(a => a.category === cat4 || a.category === 'சமையல்').map(formatList);

      setCustomTopStories([...headlines, ...baseTop].slice(0, 8));
      setCustomCinema([...cinema, ...baseCinema].slice(0, 4));

      if (sportsList.length > 0) {
        setCustomSports({ ...SPORTS, list: [...sportsList, ...SPORTS.list].slice(0, 4) });
      }
      if (lifestyleList.length > 0) {
        setCustomLifestyle({ ...LIFESTYLE, list: [...lifestyleList, ...LIFESTYLE.list].slice(0, 4) });
      }
    };

    loadSettings();
    loadHomeContent();
    loadArticles();

    // 3. Listen for admin updates — auto-refresh content when admin saves
    const onStorageChange = (e) => {
      if (e.key === 'customSiteSettings' || e.key === 'customArticles' || e.key === 'customHomeContent') {
        loadSettings();
        loadHomeContent();
        loadArticles();
      }
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  // Open the uploaded weekly newspaper PDF in the inline viewer modal
  const openEditionPdf = async () => {
    if (!editionPdf.key) return;
    try {
      const url = await resolvePdfUrl(editionPdf.key);
      if (url) {
        setPdfModal({
          src: url,
          title: editionPdf.title || 'மறைமலை முரசு — இந்த வார இதழ்',
          downloadName: `maraimalai-murasu-${editionPdf.issueDate || 'edition'}.pdf`
        });
      } else {
        alert('PDF கிடைக்கவில்லை — admin → Home Editor-ல் மீண்டும் பதிவேற்றவும்.');
      }
    } catch (err) {
      console.error('Failed to load edition PDF', err);
      alert('PDF திறப்பதில் பிழை: ' + err.message);
    }
  };
  const closePdfModal = () => {
    if (pdfModal && pdfModal.src && pdfModal.src.startsWith('blob:')) {
      try { URL.revokeObjectURL(pdfModal.src); } catch (e) { /* ignore */ }
    }
    setPdfModal(null);
  };

  return (
    <>
      {/* Weekly Edition PDF banner — only shown if admin uploaded a PDF */}
      {editionPdf.key && (
        <section style={{ padding: '16px 0', background: 'linear-gradient(135deg, #1A1614 0%, #2a2421 100%)', borderBottom: '3px solid var(--accent)' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#F2ECE0' }}>
              <span style={{ fontSize: '32px', lineHeight: 1 }}>📰</span>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  இந்த வார இதழ் · WEEKLY EDITION
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700 }}>
                  {editionPdf.title || 'மறைமலை முரசு — தமிழ் வார இதழ்'}
                  {editionPdf.issueDate && <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: '10px', fontSize: '14px' }}>· {editionPdf.issueDate}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={openEditionPdf}
              style={{ padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
            >
              <span>முழு இதழைப் படிக்க</span>
              <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        </section>
      )}

      <section data-screen-label="01 Hero">
        <div className="container">
          <div className="hero-grid">
            <HeroVideo video={leadVideo} blurb={heroBlurb} />
            <div className="hero-side">
              {heroSideItems.map((s, i) => <SideCard key={i} item={s} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="02 Top Stories">
        <div className="container">
          <div className="section-head">
            <h2>தலைப்புச் செய்திகள்</h2>
            <a className="more" href="/category">முழு செய்திகள் →</a>
          </div>
          <div className="card-grid">
            {customTopStories.map((s, i) => <Card key={i} data={s} withVideo={i === 1} />)}
          </div>
          <AdSlot network="google" size="728x90" slotId="home-leaderboard-1" note="Google Ad Manager · Leaderboard" style={{marginTop: 32, maxWidth: '100%'}} />
        </div>
      </section>

      <ElectionBanner
        title={electionBanner.title || siteSettings.heroTitle}
        leftNum={electionBanner.leftNum}
        leftLabel={electionBanner.leftLabel}
        rightNum={electionBanner.rightNum}
        rightLabel={electionBanner.rightLabel}
      />

      <section className="section" data-screen-label="03 Election Coverage">
        <div className="container">
          <div className="section-head">
            <h2>{siteSettings.section1Title}</h2>
            <a className="more" href="/category">அனைத்து செய்திகள் →</a>
          </div>
          <div className="card-grid">
            {electionGridArr.map((s, i) => <Card key={i} data={s} />)}
          </div>
          <InFeedAd network="meta" slotId="home-infeed-meta" />
        </div>
      </section>

      <section className="section" data-screen-label="04 Cinema & Lifestyle">
        <div className="container">
          <div className="section-head">
            <h2>{siteSettings.section2Title}</h2>
            <a className="more" href="/category">மேலும் →</a>
          </div>
          <div className="card-grid">
            {customCinema.map((s, i) => <Card key={i} data={s} withVideo={i < 2} />)}
          </div>
          <AdSlot network="sponsor" size="728x250" slotId="home-billboard-samsung" style={{marginTop: 32, maxWidth: '100%'}} />
        </div>
      </section>

      <section className="section" data-screen-label="05 Tamil Nadu & National">
        <div className="container">
          <div className="two-col">
            <ColBlock data={twoColLeft} />
            <ColBlock data={twoColRight} />
          </div>
          <SponsorCard
            brand={sponsorCard.brand}
            headline={sponsorCard.headline}
            copy={sponsorCard.copy}
            cta={sponsorCard.cta}
            thumb={sponsorCard.thumb}
            image={sponsorCard.image}
            fullImage={sponsorCard.fullImage}
            href={sponsorCard.href}
            style={{marginTop: 36}}
          />
          <div className="advertise-cta">
            {advertiseCta.image && (
              <a href={advertiseCta.ctaHref || '#'} style={{ display: 'block', flex: '0 0 220px', marginRight: 24 }}>
                <img src={advertiseCta.image} alt={advertiseCta.headline} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, objectFit: 'cover' }} />
              </a>
            )}
            <div>
              <h3>{advertiseCta.headline}</h3>
              <p>{advertiseCta.copy}</p>
              <div className="networks">
                {(advertiseCta.networks || []).map((net, i) => (
                  <span key={i}>{net}</span>
                ))}
              </div>
            </div>
            <a className="btn" href={advertiseCta.ctaHref}>{advertiseCta.ctaText}<small>{advertiseCta.ctaSub}</small></a>
          </div>
        </div>
      </section>

      <section className="section" data-screen-label="06 Sports & Lifestyle">
        <div className="container">
          <div className="two-col">
            <ColBlock data={{ ...sportsColData, head: siteSettings.section3Title || sportsColData.head }} />
            <ColBlock data={{ ...lifestyleColData, head: siteSettings.section4Title || lifestyleColData.head }} />
          </div>
        </div>
      </section>

      {/* Inline PDF viewer modal for the weekly edition */}
      <PdfViewer pdf={pdfModal} onClose={closePdfModal} />
    </>
  );
}
