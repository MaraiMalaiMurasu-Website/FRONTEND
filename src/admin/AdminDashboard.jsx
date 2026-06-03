import React, { useState, useEffect } from 'react';
import { savePdfBlob, resolvePdfUrl, deletePdf } from '../utils/pdfStorage.js';
import { isoToInputDatetime } from '../utils/time.js';
import { saveAdSettings as saveAdSettingsToApi, checkApiHealth, ADS_API_BASE } from '../utils/adsApi.js';
import logoSrc from '../assets/logo.png';

// SVGs for modern SaaS feel
const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/></svg>,
  Write: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Categories: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Media: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  TrendingUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  FileText: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Ads: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
};

// Connection status badge for the Ad Manager — polls the shared Ads API
// every 15 seconds and shows whether it's reachable. Green = ads sync across
// all browsers; red = saving locally only.
function AdsApiStatus() {
  const [status, setStatus] = useState({ online: null, ts: null });
  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      const result = await checkApiHealth();
      if (mounted) setStatus(result);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const isOnline = status.online === true;
  const isChecking = status.online === null;
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const bg = isOnline ? '#ECFDF5' : isChecking ? '#F3F4F6' : '#FEF2F2';
  const border = isOnline ? '#86EFAC' : isChecking ? '#D1D5DB' : '#FCA5A5';
  const color = isOnline ? '#065F46' : isChecking ? '#374151' : '#991B1B';
  const dot = isOnline ? '#10B981' : isChecking ? '#9CA3AF' : '#EF4444';
  const label = isOnline
    ? 'Connected — ads sync to every browser & device'
    : isChecking
      ? 'Checking connection to Ads API…'
      : isLocalhost
        ? 'Local Ads API offline — start it with: cd server && npm start'
        : 'Production backend not deployed — saves stay in THIS browser only';

  return (
    <div style={{
      padding: '12px 16px',
      marginBottom: '20px',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13px',
      color,
    }}>
      <span style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: dot,
        boxShadow: isOnline ? `0 0 0 3px ${dot}33` : 'none',
        flexShrink: 0,
      }} />
      <strong style={{ fontWeight: 700 }}>{label}</strong>
      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{ADS_API_BASE}</span>
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [articleCategory, setArticleCategory] = useState('தலைப்புச் செய்திகள்');
  const [articlePdf, setArticlePdf] = useState('');
  const [activeMediaFilter, setActiveMediaFilter] = useState('All Media');

  // ---- Home Editor state ----
  const DEFAULT_HOME = {
    leadVideo: {
      kicker: 'அரசியல் முரசு',
      title: 'தமிழக முதல்வர் ஆனார் த.வெ.க தலைவர் ஜோசப் விஜய்',
      meta: 'புரட்சி அரசியலும்... புத்தம் புதிய கூட்டணி ஆட்சியும்!',
      videoId: 'PDOg5PnSXYM',
      poster: '/img/vijay.avif'
    },
    editionPdf: {
      key: '',
      title: 'மறைமலை முரசு — தமிழ் வார இதழ்',
      issueDate: '10-16 May 2026'
    },
    heroBlurb: {
      dek: 'தமிழக அரசியல் வரலாற்றில் ஒரு புதிய அத்தியாயம் எழுதப்பட்டுள்ளது. 234 தொகுதிகளில் தனித்துப் போட்டியிட்ட த.வெ.க., 108 இடங்களில் வெற்றி பெற்று தனிப்பெரும் கட்சியாக உருவெடுத்துள்ளது. காங்கிரஸ் (5 எம்.எல்.ஏ.க்கள்), விசிக, இடதுசாரிக் கட்சிகள், IUML ஆதரவுடன் மொத்தம் 120 இடங்களுடன் "கூட்டணி ஆட்சி" புதிய அத்தியாயம் தொடங்கியுள்ளது.',
      liveTag: '● LIVE',
      tags: [
        { text: 'த.வெ.க. வெற்றி', href: '/headlines' },
        { text: 'கூட்டணி ஆட்சி', href: '/article' },
        { text: 'ஜோசப் விஜய் · முதலமைச்சர்', href: '/article' },
        { text: 'புரட்சி அரசியல்', href: '/article' }
      ],
      reporting: 'டெல்லி டெஸ்க், மாநில செய்தியாளர்கள், மறைமலை முரசு குழுமம்',
      updatedAt: '',
      updatedAtTs: ''
    },
    heroSide: [
      { n: 1, img: '/img/crime-scene.avif', title: 'அம்பேத்கர் வரலாற்றை பாடப்புத்தகத்தில் சேர்க்க வேண்டும்: மதுரை நீதிமன்றம் கிளை அதிரடி உத்தரவு!', meta: 'மதுரை · 10 நிமிடங்களுக்கு முன்' },
      { n: 2, img: '/img/world-summit.avif', title: 'உற்பத்தித் துறை வளர்ச்சி: பொருளாதார முன்னேற்றம்', meta: 'பொருளாதாரம் · 22 நிமிடங்களுக்கு முன்' },
      { n: 3, img: '/img/cheating-case.avif', title: 'பொறியியல் படிப்பிற்கான விண்ணப்பப் பதிவு தொடக்கம்!', meta: 'கல்வி · 1 மணி நேரத்திற்கு முன்' },
      { n: 4, img: '/img/cheating-case.avif', title: 'செங்கல்பட்டு மாவட்டத்தில் 93.25 சதவீத மாணவமாணவிகள் தேர்ச்சி', meta: 'கல்வி · 2 மணி நேரத்திற்கு முன்' }
    ],
    liveTicker: [
      'தமிழக முதல்வர் ஆனார் த.வெ.க தலைவர் ஜோசப் விஜய்',
      'அம்பேத்கர் வரலாற்றை பாடப்புத்தகத்தில் சேர்க்க மதுரை கிளை உத்தரவு',
      'புதுச்சேரியில் மீண்டும் முதலமைச்சராகிறார் ரங்கசாமி',
      'பொறியியல் படிப்பிற்கான விண்ணப்பப் பதிவு தொடக்கம்',
      'சிங்கப்பெருமாள் கோவில்: பயன்பாட்டிற்கு வராத மேம்பாலம் - மக்கள் அவதி',
      'சீனாவின் எதிர்ப்பை மீறி தைவான் அதிபர் அமெரிக்கப் பயணம்',
      'திருச்சி உச்சி பிள்ளையார் கோயில் - ஆன்மிக முரசு சிறப்பு கட்டுரை',
      'சர்வதேச விளையாட்டு அரங்கு: இந்தியாவின் அதிரடி ஆதிக்கம்'
    ],
    electionBanner: {
      title: 'தேர்தல் 2026 முடிவுகள்',
      leftNum: '108',
      leftLabel: 'த.வெ.க. வென்ற\nதொகுதிகள்',
      rightNum: '120',
      rightLabel: 'கூட்டணியில் மொத்த\nஆதரவு இடங்கள்'
    },
    sponsorCard: {
      brand: 'சென்னை சில்க்ஸ் · Chennai Silks',
      headline: 'தீபாவளி கொண்டாட்டம் — பட்டுப் புடவைகள் மீது 40% சலுகை',
      copy: 'எல்லா முன்னணி கிளைகளிலும் · ஆன்லைன் ஆர்டர்களுக்கு ₹500 கூடுதல் தள்ளுபடி · மே 14 வரை',
      cta: 'கடைகளைக் கண்டறி →',
      thumb: 'SILK SAREE'
    },
    advertiseCta: {
      headline: 'உங்கள் பிராண்டை 14 லட்சம் வாசகர்களுக்கு கொண்டு செல்லுங்கள்',
      copy: 'Google Ads, Meta Audience Network வழியாக programmatic விளம்பரங்கள் — அல்லது நேரடி ஆதரவாளர் ஒப்பந்தங்கள். print + digital + newsletter — மூன்று தளங்களிலும் ஒரே campaign-ல்.',
      networks: ['Google AdSense', 'Google Ad Manager', 'Meta Audience Network', 'Direct Sponsorship', 'Newsletter'],
      ctaText: 'விளம்பர திட்டங்கள்',
      ctaSub: 'ads@maraimalaimurasu.com',
      ctaHref: 'mailto:ads@maraimalaimurasu.com'
    },
    // ===== 4-Card Grid Sections =====
    topStoriesGrid: [
      { cat: 'அரசியல்', img: '/img/vijay.avif', title: 'தமிழக அரசியலில் புதிய சகாப்தம்: எம்.ஜி.ஆர், ஜெயலலிதா வரிசையில் நடிகர் விஜய்!', meta: 'அரசியல் · 18 நிமிடம்', thumb: 'POLITICS' },
      { cat: 'தமிழகம்', img: '/img/crime-scene.avif', title: 'மயிலாடுதுறையில் பரபரப்பு: காங்கிரஸ் கட்சியினர் மீது திமுகவினர் தாக்குதல்!', meta: 'மயிலாடுதுறை · 36 நிமிடம்', thumb: 'CLASH' },
      { cat: 'அரசியல்', img: '/img/mamata.avif', title: 'தமிழகத்தில் புதிய ஆட்சி அமைய உடனே நடவடிக்கை எடுக்க வேண்டும்: மு.க.ஸ்டாலின்', meta: 'அரசியல் · 1 மணி நேரம்', thumb: 'DMK' },
      { cat: 'சினிமா', img: '/img/vijay.avif', title: 'ஜனநாயக அப்டேட்: தளபதி பிறந்தநாளில் திரைக்கு வருகிறதா கடைசிப் படம்?', meta: 'சினிமா · 2 மணி நேரம்', thumb: 'CINEMA' }
    ],
    electionGrid: [
      { cat: 'மாநில முரசு', img: '/img/mamata.avif', title: 'புதுச்சேரியில் என்.ஆர்.காங்கிரஸ் கூட்டணி அமோக வெற்றி: மீண்டும் முதலமைச்சராகிறார் ரங்கசாமி!', meta: 'புதுச்சேரி · 4 மணி நேரம்', thumb: 'ELECTION' },
      { cat: 'நீதிமன்றம்', img: '/img/crime-scene.avif', title: 'சிறுமி கொலை வழக்கு: குற்றவாளிக்கு தூக்கு தண்டனை புதுச்சேரி நீதிமன்றம் அதிரடி தீர்ப்பு', meta: 'புதுச்சேரி · 5 மணி நேரம்', thumb: 'COURT' },
      { cat: 'சட்டம் முரசு', img: '/img/cheating-case.avif', title: 'காலிஸ்தான் கோவிட் முறைகேடு: 12 ஊர்களில் நடவடிக்கை எடுக்க நீதிமன்றம் உத்தரவு!', meta: 'சட்டம் · 6 மணி நேரம்', thumb: 'LAW' },
      { cat: 'சர்வதேசம்', img: '/img/world-summit.avif', title: '4 ஆண்டுகளைக் கடந்து நீடிக்கும் போர்: 350 டிரோன்களைச் சுட்டு வீழ்த்திய உக்ரைன்!', meta: 'உலகம் · 7 மணி நேரம்', thumb: 'WAR' }
    ],
    cinemaGrid: [
      { cat: 'சினிமா', img: '/img/milind.avif', title: 'திரையுலகின் சாதனைத் தயாரிப்பாளர் ஆர்.பி.சௌத்ரி காலமானார்!', meta: 'திரை டெஸ்க் · 3 மணி நேரம்', thumb: 'OBITUARY' },
      { cat: 'சினிமா', img: '/img/vijay.avif', title: 'ஜனநாயகன் அப்டேட்: தளபதி பிறந்தநாளில் திரைக்கு வருகிறதா கடைசிப் படம்?', meta: 'சினிமா டெஸ்க் · 4 மணி நேரம்', thumb: 'UPDATE' },
      { cat: 'திரை விமர்சனம்', img: '/img/vijay.avif', title: 'கருப்பு சினிமா: திரையுலகின் மறைக்கப்பட்ட முகத்தை காட்டும் அதிரடி உலகம்', meta: 'சினிமா டெஸ்க் · 5 மணி நேரம்', thumb: 'REVIEW' },
      { cat: 'சினிமா', img: '/img/milind.avif', title: 'வைரல் அப்டேட்ஸ்: ஃபர்ஸ்ட் லுக், டீசர், டிரெய்லர் — ட்ரோல் கலாச்சாரம் அதிகரிப்பு', meta: 'திரை டெஸ்க் · 7 மணி நேரம்', thumb: 'TRENDING' }
    ],
    // ===== 4 Two-Column Sections =====
    twoColLeft: {
      head: 'மாநில செய்திகள்',
      lead: { img: '/img/cheating-case.avif', title: 'சிங்கப்பெருமாள் கோவில்: பயன்பாட்டிற்கு வராத ஆகாய நடை மேம்பாலம் பொதுமக்கள் அவதி', excerpt: 'பல லட்சம் செலவில் கட்டப்பட்ட ஆகாய நடை மேம்பாலம் இன்னும் பயன்பாட்டிற்கு வராததால்...', meta: 'காஞ்சிபுரம் · 12 நிமிடம்', thumb: 'INFRA' },
      rest: [
        { img: '/img/crime-scene.avif', title: 'போலீஸ் என்கவுன்டர் சுட்ட ரவுடி: பழிக்கு கொடுத்த போலீஸ்!', meta: 'திருச்செந்தூர் · 1 மணி நேரம்', thumb: 'CRIME' },
        { img: '/img/cheating-case.avif', title: 'செங்கல்பட்டு நெஞ்சாலையில் நடைமேம்பாலம்: பொதுமக்கள் கோரிக்கை!', meta: 'செங்கல்பட்டு · 2 மணி நேரம்', thumb: 'PUBLIC DEMAND' },
        { img: '/img/crime-scene.avif', title: 'நகைக்காக மூதாட்டி கொலை: இளைஞர் கைது', meta: 'குற்றம் · 3 மணி நேரம்', thumb: 'ARREST' },
        { img: '/img/mamata.avif', title: 'சிலிண்டர் விலை உயர்வு: சென்னையில் கம்யூனிஸ்ட், விசிகவினர் கண்டன ஆர்ப்பாட்டம்!', meta: 'சென்னை · 4 மணி நேரம்', thumb: 'PROTEST' }
      ]
    },
    twoColRight: {
      head: 'தேசிய & சர்வதேச செய்திகள்',
      lead: { img: '/img/world-summit.avif', title: 'சீனாவின் எதிர்ப்பை மீறி தைவான் அதிபர் அமெரிக்கப் பயணம்: கண்டனம் தெரிவித்த சீனா!', excerpt: 'தைவான் அதிபரின் அமெரிக்கப் பயணத்திற்கு சீனா கடும் கண்டனம் தெரிவித்துள்ளதுடன்...', meta: 'உலகம் · 30 நிமிடம்', thumb: 'WORLD' },
      rest: [
        { img: '/img/crime-scene.avif', title: 'சப்-இன்ஸ்பெக்டர் சுட்டுக் கொலை: துப்பாக்கி முனையில் மிரட்டல்', meta: 'தேசியம் · 1 மணி நேரம்', thumb: 'CRIME' },
        { img: '/img/world-summit.avif', title: 'கேபினட் அமைச்சரவை விரிவாக்கம்: 32 அமைச்சர்கள் பதவியேற்பு', meta: 'தேசியம் · 2 மணி நேரம்', thumb: 'POLITICS' },
        { img: '/img/cheating-case.avif', title: 'ரூ.5.13 கோடி மோசடி: நிதி நிறுவன உரிமையாளர் மனைவி கைது!', meta: 'குற்றம் · 3 மணி நேரம்', thumb: 'FRAUD' },
        { img: '/img/air-india.avif', title: 'தலை கவசம் உயிர் கவசம் - விழிப்புணர்வு பிரசாரம்', meta: 'சமூகம் · 4 மணி நேரம்', thumb: 'AWARENESS' }
      ]
    },
    sportsCol: {
      head: 'விளையாட்டு & ஆன்மீகம்',
      lead: { img: '/img/cricket.avif', title: 'சர்வதேச விளையாட்டு அரங்கு: இந்தியாவின் அதிரடி ஆதிக்கம் மற்றும் வீரர்களின் சாதனைகளும்!', excerpt: 'உலகளாவிய விளையாட்டுப் போட்டிகளில் இந்திய வீரர்களின் தொடர் வெற்றிகள் மற்றும் புதிய சாதனைகள் — க்ரிக்கெட், தடகளம், கால்பந்து.', meta: 'விளையாட்டு டெஸ்க் · 1 மணி நேரம்', thumb: 'SPORTS' },
      rest: [
        { img: '/img/cricket.avif', title: 'க்ரிக்கெட்: உலக அரங்கில் ஆதிக்கம் செலுத்தும் நீலப்படை - டெஸ்ட் சாம்பியன்ஷிப்பில் முதலிடத்துக்கு போட்டி', meta: 'விளையாட்டு டெஸ்க் · 2 மணி நேரம்', thumb: 'CRICKET' },
        { img: '/img/milind.avif', title: 'ஈட்டி எறிதலில் ஈடிணையற்ற நீரஜ் சோப்ரா — 90 மீட்டர் இலக்கை எட்டும் முயற்சி', meta: 'விளையாட்டு டெஸ்க் · 3 மணி நேரம்', thumb: 'JAVELIN' },
        { img: '/img/world-summit.avif', title: 'கால்பந்து: மெஸ்ஸி-ரொனால்டோ யுகத்திற்குப் பிந்தைய மாற்றம் — எம்பாப்பே, ஹாலண்ட் எழுச்சி', meta: 'விளையாட்டு டெஸ்க் · 5 மணி நேரம்', thumb: 'FOOTBALL' },
        { img: '/img/world-summit.avif', title: 'திருச்சி உச்சி பிள்ளையார் கோயில்: விபீஷணன் வரலாறும் வழிபாட்டுத் தலமும்', meta: 'ஆன்மீகம் · 6 மணி நேரம்', thumb: 'TEMPLE' }
      ]
    },
    lifestyleCol: {
      head: 'வாழ்வியல் & சமையல்',
      lead: { img: '/img/milind.avif', title: 'செட்டிநாடு சிக்கன் கிரேவி: காரசாரமான சுவையில் ஒரு அட்டகாசமான செய்முறை', excerpt: 'வரமிளகாய், மல்லி, சீரகம், சோம்பு, மிளகு — வறுத்து அரைத்த மசாலா முழுவதையும் கொண்ட பாரம்பரிய செட்டிநாட்டு சிக்கன் குழம்பு செய்வது எப்படி?', meta: 'சமையல் முரசு · 1 மணி நேரம்', thumb: 'CHETTINAD CHICKEN' },
      rest: [
        { img: '/img/milind.avif', title: 'அழகு முரசு: தலை குளிக்கும்போது செய்யக்கூடாத 10 தவறுகள்!', meta: 'அழகு குறிப்பு · 2 மணி நேரம்', thumb: 'HAIR CARE' },
        { img: '/img/world-summit.avif', title: 'திருக்குறள் — அதிகாரம் 6: வாழ்க்கைத் துணைநலம் (குறள் 56)', meta: 'இலக்கியம் · 3 மணி நேரம்', thumb: 'TIRUKKURAL' },
        { img: '/img/world-summit.avif', title: 'நீதியரசரின் நற்சிந்தனைகள்: நாம் தவறு செய்யும்போது நமக்கு நாமே வழக்கறிஞர்கள் ஆகிறோம்', meta: 'சிந்தனை · 4 மணி நேரம்', thumb: 'WISDOM' },
        { img: '/img/world-summit.avif', title: 'வாக்கர் வாய்ஸ்: தற்போதைய அரசியல் சூழலை அலசும் அண்ணாச்சி-அபி உரையாடல்', meta: 'வாழ்வியல் · 6 மணி நேரம்', thumb: 'CONVERSATION' }
      ]
    }
  };

  const [homeContent, setHomeContent] = useState(() => {
    const saved = localStorage.getItem('customHomeContent');
    if (saved) {
      try { return { ...DEFAULT_HOME, ...JSON.parse(saved) }; } catch (e) { return DEFAULT_HOME; }
    }
    return DEFAULT_HOME;
  });

  const [activeHomeSection, setActiveHomeSection] = useState('video');

  const updateHomeTickerItem = (index, value) => {
    setHomeContent(prev => ({
      ...prev,
      liveTicker: prev.liveTicker.map((it, i) => i === index ? value : it)
    }));
  };

  const updateHomeNested = (parentField, childField, value) => {
    setHomeContent(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [childField]: value }
    }));
  };

  const updateHomeArray = (parentField, index, value) => {
    setHomeContent(prev => ({
      ...prev,
      [parentField]: prev[parentField].map((it, i) => i === index ? value : it)
    }));
  };

  // Helper for grid card field update (topStoriesGrid, electionGrid, cinemaGrid)
  const updateGridCard = (gridName, index, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      [gridName]: prev[gridName].map((card, i) => i === index ? { ...card, [field]: value } : card)
    }));
  };

  // Hero Blurb helpers
  const updateHeroBlurb = (field, value) => {
    setHomeContent(prev => ({
      ...prev,
      heroBlurb: { ...(prev.heroBlurb || {}), [field]: value }
    }));
  };
  const updateHeroBlurbTag = (idx, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      heroBlurb: {
        ...(prev.heroBlurb || {}),
        tags: (prev.heroBlurb?.tags || []).map((t, i) => i === idx ? { ...t, [field]: value } : t)
      }
    }));
  };
  const addHeroBlurbTag = () => {
    setHomeContent(prev => ({
      ...prev,
      heroBlurb: {
        ...(prev.heroBlurb || {}),
        tags: [...(prev.heroBlurb?.tags || []), { text: 'புதிய Tag', href: '/article' }]
      }
    }));
  };
  const removeHeroBlurbTag = (idx) => {
    setHomeContent(prev => ({
      ...prev,
      heroBlurb: {
        ...(prev.heroBlurb || {}),
        tags: (prev.heroBlurb?.tags || []).filter((_, i) => i !== idx)
      }
    }));
  };

  // Helper for two-column updates (twoColLeft, twoColRight, sportsCol, lifestyleCol)
  const updateTwoColField = (colName, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      [colName]: { ...prev[colName], [field]: value }
    }));
  };
  const updateTwoColLeadField = (colName, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      [colName]: { ...prev[colName], lead: { ...prev[colName].lead, [field]: value } }
    }));
  };
  const updateTwoColRestField = (colName, idx, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      [colName]: {
        ...prev[colName],
        rest: prev[colName].rest.map((it, i) => i === idx ? { ...it, [field]: value } : it)
      }
    }));
  };

  // Reusable Two-Column Editor (1 lead card + 4 rest items)
  const TwoColEditor = ({ colName, icon, title, desc }) => {
    const col = homeContent[colName] || {};
    const handleImgUpload = (callback) => (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
      }
    };
    return (
      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>{icon} {title}</h3>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>{desc}</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Section Heading</label>
          <input type="text" value={col.head || ''} onChange={(e) => updateTwoColField(colName, 'head', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
        </div>

        {/* LEAD CARD */}
        <div style={{ padding: '16px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--accent)', fontWeight: '700' }}>⭐ Lead Card (big featured article)</h4>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
            {col.lead?.img && <img src={col.lead.img} alt="" style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Image (URL or Upload)</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" value={col.lead?.img || ''} onChange={(e) => updateTwoColLeadField(colName, 'img', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                <button type="button" onClick={() => openMediaPicker((url) => updateTwoColLeadField(colName, 'img', url))} style={{ padding: '6px 10px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>📁</button>
                <label style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                  Upload
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgUpload((r) => updateTwoColLeadField(colName, 'img', r))} />
                </label>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Title</label>
              <input type="text" value={col.lead?.title || ''} onChange={(e) => updateTwoColLeadField(colName, 'title', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Thumb Badge</label>
              <input type="text" value={col.lead?.thumb || ''} onChange={(e) => updateTwoColLeadField(colName, 'thumb', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Excerpt</label>
            <textarea rows="2" value={col.lead?.excerpt || ''} onChange={(e) => updateTwoColLeadField(colName, 'excerpt', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Meta</label>
            <input type="text" value={col.lead?.meta || ''} onChange={(e) => updateTwoColLeadField(colName, 'meta', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
          </div>
        </div>

        {/* REST CARDS */}
        <h4 style={{ margin: '12px 0 8px 0', fontSize: '14px', color: '#111827', fontWeight: '700' }}>📰 List Items (4 small cards)</h4>
        {(col.rest || []).map((it, idx) => (
          <div key={idx} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '22px', height: '22px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>{idx + 1}</div>
              <span style={{ fontSize: '12px', color: '#111827', fontWeight: '600' }}>Item #{idx + 1}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {it.img && <img src={it.img} alt="" style={{ width: '70px', height: '52px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" value={it.img || ''} onChange={(e) => updateTwoColRestField(colName, idx, 'img', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => updateTwoColRestField(colName, idx, 'img', url))} style={{ padding: '5px 8px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '5px', cursor: 'pointer', fontSize: '10px', fontWeight: '600' }}>📁</button>
                  <label style={{ padding: '5px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '10px', fontWeight: '600' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgUpload((r) => updateTwoColRestField(colName, idx, 'img', r))} />
                  </label>
                </div>
                <input type="text" value={it.title || ''} onChange={(e) => updateTwoColRestField(colName, idx, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '4px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" value={it.meta || ''} onChange={(e) => updateTwoColRestField(colName, idx, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                  <input type="text" value={it.thumb || ''} onChange={(e) => updateTwoColRestField(colName, idx, 'thumb', e.target.value)} placeholder="Thumb" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Reusable Grid Section Editor (4 cards)
  const GridSectionEditor = ({ gridName, title, icon, desc }) => {
    const cards = homeContent[gridName] || [];
    return (
      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>{icon} {title}</h3>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>{desc}</p>

        {cards.map((card, idx) => (
          <div key={idx} style={{ padding: '20px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>{idx + 1}</div>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: '600' }}>Card #{idx + 1}</h4>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {card.img && <img src={card.img} alt="" style={{ width: '140px', height: '105px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>Image (URL, Upload, or Browse Media)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={card.img || ''} onChange={(e) => updateGridCard(gridName, idx, 'img', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                    <button type="button" onClick={() => openMediaPicker((url) => updateGridCard(gridName, idx, 'img', url))} style={{ padding: '7px 12px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>📁 Browse</button>
                    <label style={{ padding: '7px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      Upload
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateGridCard(gridName, idx, 'img', reader.result);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>Category (red label)</label>
                    <input type="text" value={card.cat || ''} onChange={(e) => updateGridCard(gridName, idx, 'cat', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>Thumb Badge (optional)</label>
                    <input type="text" value={card.thumb || ''} onChange={(e) => updateGridCard(gridName, idx, 'thumb', e.target.value)} placeholder="e.g. POLITICS, UPDATE" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>Title / Headline</label>
                  <input type="text" value={card.title || ''} onChange={(e) => updateGridCard(gridName, idx, 'title', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', fontWeight: '500' }} />
                </div>

                <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>Location</label>
                    <input type="text" value={card.location || ''} onChange={(e) => updateGridCard(gridName, idx, 'location', e.target.value)} placeholder="e.g. சென்னை" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                  </div>
                  <div style={{ flex: 1.5 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>🕐 Published <span style={{ color: '#10B981', fontSize: '10px' }}>(auto Tamil time)</span></label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input type="datetime-local" value={isoToInputDatetime(card.publishedAt)} onChange={(e) => updateGridCard(gridName, idx, 'publishedAt', e.target.value ? new Date(e.target.value).toISOString() : '')} style={{ ...inputStyle, fontSize: '11px', padding: '6px 8px', flex: 1 }} />
                      <button type="button" onClick={() => updateGridCard(gridName, idx, 'publishedAt', new Date().toISOString())} style={{ padding: '6px 10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '10px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Now</button>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '10px', display: card.publishedAt ? 'none' : 'block' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>Meta (manual fallback)</label>
                  <input type="text" value={card.meta || ''} onChange={(e) => updateGridCard(gridName, idx, 'meta', e.target.value)} placeholder="e.g. மதுரை · 10 நிமிடம்" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#374151', fontSize: '12px' }}>🔗 Link URL (where the card navigates when clicked)</label>
                  <input type="text" value={card.link || ''} onChange={(e) => updateGridCard(gridName, idx, 'link', e.target.value)} placeholder="e.g. /cinema, /sports — or blank to auto-link from category" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const updateLeadVideo = (field, value) => {
    setHomeContent(prev => ({
      ...prev,
      leadVideo: { ...prev.leadVideo, [field]: value }
    }));
  };

  const updateHeroSide = (index, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      heroSide: prev.heroSide.map((card, i) => i === index ? { ...card, [field]: value } : card)
    }));
  };

  const handleSaveHomeContent = () => {
    try {
      const serialized = JSON.stringify(homeContent);
      const sizeMB = (serialized.length / 1024 / 1024).toFixed(2);
      localStorage.setItem('customHomeContent', serialized);
      notifyChange('customHomeContent');
      alert(`✅ Home page content saved! (${sizeMB} MB)\n\nRefresh homepage (Ctrl+Shift+R) to see changes.`);
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.code === 22) {
        alert('❌ STORAGE FULL!\n\nYour PDFs are too big to save in browser storage (max ~5 MB total).\n\nSolutions:\n1. Compress your PDFs (use smallpdf.com)\n2. Upload smaller PDFs (< 1 MB each)\n3. Remove some existing PDFs\n4. Or use a real backend database (we can set this up)');
      } else {
        alert('❌ Save failed: ' + err.message);
      }
      console.error('Save failed:', err);
    }
  };

  // Helper for PDF upload — uses IndexedDB for unlimited size (no 3MB limit!)
  const handlePdfUpload = async (file, callback) => {
    if (!file) return;
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    try {
      // Save to IndexedDB (supports hundreds of MB)
      const idbKey = await savePdfBlob(file);
      callback(idbKey);
      console.log(`✓ PDF saved to IndexedDB: ${idbKey} (${sizeMB} MB)`);
    } catch (err) {
      alert(`❌ Failed to save PDF: ${err.message}\n\nFile size: ${sizeMB} MB`);
      console.error('PDF upload failed:', err);
    }
  };

  // Preview helper that resolves IDB keys to blob URLs
  const handlePreviewPdf = async (pdfValue) => {
    if (!pdfValue) return;
    const url = await resolvePdfUrl(pdfValue);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('PDF not found. It may have been removed.');
    }
  };

  // ====== UNIFIED PAGES CONTENT (Headlines, Cinema, Sports, Beauty, Cooking, Astrology, Contact) ======
  const DEFAULT_PAGES = {
    headlines: {
      eyebrow: 'தலைப்புச் செய்திகள் · LIVE',
      title: 'தலைப்புச் செய்திகள்',
      subtitle: 'தினசரி தலைம, தேசம் மற்றும் தமிழகத்தில் இருந்து இறுதி நிமிடம் வரை — தேர்தெடுத்த, சரிபார்த்த செய்திகள்.',
      stats: [
        { num: '234', label: 'செய்திகள்' },
        { num: '6.4கோ', label: 'வாசகர்கள்' },
        { num: '76', label: 'எண்ணம்' },
        { num: '42', label: 'நாட்கள் முதல்' }
      ],
      newsletterMain: {
        title: 'செய்திகள்',
        subtitle: 'முக்கிய காலையும் முக்கிய செய்திகள், கருத்துகள் — நேரடியாக உங்கள் இன்பாக்ஸுக்கு.',
        placeholder: 'உங்கள் மின்னஞ்சல் முகவரி...',
        buttonText: 'சந்தாதாரர் ஆகுக'
      },
      midAdLabel: 'விளம்பரம் · SPONSORED',
      midAdSize: '970 × 160',
      midAdText: 'Brand lockup • in-feed unit',
      photoStoryHead: 'இன்றைய படக் கதை',
      photoStoryMore: 'நாளின் சிறந்த புகைப்படங்கள் — காட்சிகள் காட்சிகளாக.',
      photoStory: [
        { img: '', placeholder: 'VICTORY 1', caption: 'சேப்பாக்கம் கிரிக்கெட் மைதானத்தில் வெற்றி கொண்டாடும் தமிழ்நாடு ரஞ்சி அணி', link: '' },
        { img: '', placeholder: 'PARLIAMENT', caption: 'டெல்லி மக்களவை வளாகத்தில் காற்று மாசு குறைப்பு மசோதாவின் வாக்கெடுப்பு', link: '' },
        { img: '', placeholder: 'TEMPLE', caption: 'மதுரை மீனாட்சி அம்மன் கோயிலில் தைப்பூச திருவிழா கூட்டம்', link: '' },
        { img: '', placeholder: 'TERMINAL', caption: 'சென்னை விமான நிலையத்தில் புதிய பயணிகள் முனையம்', link: '' }
      ],
      bottomCta: {
        sponsored: 'SPONSORED',
        title: 'உங்கள் வணிகம் — மறைமலை முரசு வாசகர்களை சென்றடையுங்கள்',
        subtitle: 'தினசரி 14 லட்சம் வாசகர்கள் · 6 பதிப்புகள் · அனைத்து பகுதிகளிலும்',
        cta: 'விளம்பர திட்டங்கள் →',
        ctaHref: 'mailto:ads@maraimalaimurasu.com',
        placeholder: 'SPONSOR'
      },
      opinionItems: [
        { cat: 'கட்டுரை · கட்டுரை', title: 'சென்னை வாக்காளர் திரைக்கும் தீர்தலும் — புதிய காலம், புதிய எதிர்பார்ப்பு', meta: 'கட்டுரையாளர்: ஆசிரியர் குழு' },
        { cat: 'கட்டுரை', title: 'பாருண்ணை பீட்டோமாரை வேலையின்மை எதிர்நாடிகளை எப்படி காக்கிறது', meta: 'கட்டுரையாளர்: பேட்டர்' },
        { cat: 'கட்டுரை', title: 'OTT-வின் காலம்: தமிழ் சினிமா எங்கே நிற்கிறது?', meta: 'கட்டுரையாளர்: அருண்' }
      ],
      railNewsletter: {
        head: 'செய்தி மடல்',
        copy: 'காலையிலும் தினசரி தினசரி செய்திகள் தொகுப்பு — உங்கள் இன்பாக்ஸுக்கு.',
        placeholder: 'மின்னஞ்சல் முகவரி...',
        button: 'சேர'
      },
      sideAdLabel: 'விளம்பரம்',
      sideAdSize: '300 × 600',
      filterTabs: [
        { label: 'அனைத்தும்', value: 'all', active: true },
        { label: 'தமிழகம்', value: 'tn' },
        { label: 'தேசியம்', value: 'national' },
        { label: 'சர்வதேசம்', value: 'world' },
        { label: 'பொருளாதாரம்', value: 'business' },
        { label: 'விளையாட்டு', value: 'sports' },
        { label: 'அறிவியல்', value: 'science' },
        { label: 'கருத்துகள்', value: 'opinion' }
      ],
      featured: {
        cat: 'முதல்வரை செய்',
        img: '',
        placeholder: 'ALLIANCE PRESS MEET',
        title: 'தமிழக சட்டப்பேரவை தேர்தல் 2026: வேட்பாளர் பட்டியல் இன்று மாலை வெளியீடு',
        excerpt: 'ஒன்பது நாட்கள் நீடித்த அரசியல் கூட்டணி பேச்சுவார்த்தைகள் முடிவுக்கு வந்துள்ளன. திமுக 184 தொகுதிகளில் வேட்பாளர்களை நிறுத்தும். அதிமுக கூட்டணியில் பாஜகவுக்கு 22 தொகுதிகள் ஒதுக்கப்பட்டுள்ளதாக ஆதாரபூர்வ தகவல்கள் தெரிவிக்கின்றன.',
        meta: 'டெல்லி டெஸ்க் · 8 நிமிடம் · 5 நிமி வாசிப்பு',
        stampTime: '16:39',
        link: ''
      },
      secondary: [
        { cat: 'டெல்லி டெஸ்க்', img: '', placeholder: 'PARLIAMENT', title: 'மக்களவையில் காவல்துறை சீர்திருத்த மகாதோ நிறைவேற்றம்', meta: 'டெல்லி டெஸ்க் · 1 மணி நேரம்', link: '' },
        { cat: 'சர்வதேச டெஸ்க்', img: '', placeholder: 'FIRST SUMMIT', title: 'இந்தியா–ஜப்பான் வர்த்தக ஒப்பந்தம்: டோக்கியோ உச்சிமாநாடு', meta: 'சர்வதேச டெஸ்க் · 2 மணி நேரம்', link: '' }
      ],
      midAdLabel: 'விளம்பரம் · GOOGLE ADS · AD · GOOGLE',
      midAdSize: '728 × 90',
      midAdSub: 'GOOGLE ADSENSE · IN-FEED',
      metaAdLabel: 'விளம்பரம் · META AUDIENCE · AD · META',
      metaAdSize: '728 × 120',
      metaAdSub: 'cat-infeed-meta-4',
      stream2: [
        { cat: 'சர்வதேசம்', img: '', title: 'சீனாவின் எதிர்ப்பை மீறி தைவான் அதிபர் அமெரிக்கப் பயணம்', meta: 'உலகம் · 4 மணி நேரம்', placeholder: 'WORLD SUMMIT', link: '' },
        { cat: 'தமிழகம்', img: '', title: 'மழைக்காலத்தில் சென்னை குடிநீர் தேவை 1,200 எம்எல்டியை எட்டியது', meta: 'சென்னை · 5 மணி நேரம்', placeholder: 'WATER', link: '' }
      ],
      bottomSponsor: {
        label: 'காவேரி வங்கி',
        title: 'காலந்தோறக்கிள உதவித்தொகை — மறைமலை முரசு வாசகர்களுக்கு மட்டும் 7.85% வட்டி',
        meta: 'விளம்பர அங்கீகாரம் · EMI மாதம் ₹1,650 முதல் · பாலன்ஸ் ATM',
        placeholder: 'BANK'
      },
      trendingHead: 'இன்றைய பிரபலமானவை',
      trending: [
        { title: 'தமிழக அரசியலில் புதிய சகாப்தம்: எம்.ஜி.ஆர், ஜெயலலிதா வரிசையில் நடிகர் விஜய்!', link: '' },
        { title: 'சிங்கப்பெருமாள் கோவில்: பயன்பாட்டிற்கு வராத ஆகாய நடை மேம்பாலம் பொதுமக்கள் அவதி', link: '' },
        { title: 'அம்பேத்கர் வரலாற்றை பாடப்புத்தகத்தில் சேர்க்க மதுரை கிளை அதிரடி உத்தரவு!', link: '' },
        { title: 'மயிலாடுதுறையில் பரபரப்பு: காங்கிரஸ் கட்சியினர் மீது திமுகவினர் தாக்குதல்!', link: '' },
        { title: 'ரூபாய் மதிப்பு டாலருக்கு எதிராக 83.42 ஆக சரிவு', link: '' }
      ],
      sideAd1Label: 'விளம்பரம் · GOOGLE ADS · AD · GOOGLE',
      sideAd1Size: '300 × 250',
      sideAd1Sub: 'GOOGLE ADSENSE · SIDEBAR',
      newsletterHead: 'செய்தி மடல்',
      newsletterCopy: 'காலையிலும் பகலிலும் தினசரி செய்திகள் — உங்கள் இன்பாக்ஸுக்கு.',
      newsletterPlaceholder: 'மின்னஞ்சல் முகவரி...',
      newsletterButton: 'சேர',
      topicsHead: 'தலைப்புகள்',
      topics: ['அரசியல்', 'தமிழகம்', 'தேசியம்', 'உலகம்', 'பொருளாதாரம்', 'சினிமா', 'விளையாட்டு', 'விஜய்', 'ஸ்டாலின்'],
      sideAd2Label: 'விளம்பரம் · META AUDIENCE · AD · META',
      sideAd2Size: '300 × 600',
      sideAd2Sub: 'META · HALF-PAGE',
      sidebarSponsor: {
        label: 'AARCADU',
        sub: 'விளம்பரதாரர் · SPONSORED',
        title: 'பரம்பரை பற்றி மால் — நேரடி வாங்குகையாளர் வாரம்',
        meta: '45 உள்ள · இலவச காலண் · சாண்டிதழ் பாரிட',
        cta: 'மேலும் செய்',
        placeholder: 'FARM PRODUCE'
      },
      leaderboardLabel: 'விளம்பரம்',
      leaderboardSize: '728 × 90',
      leaderboardText: 'லீடர்போர்டு விளம்பரம்',
      sectionHead: 'நேரடி செய்திச் சுருக்கம்',
      sectionMore: 'அனைத்தும் காண்க ›',
      stream: [
        { time: '11:42', cat: 'அரசியல்', title: 'திமுக கூட்டணியில் காங்கிரசுக்கு 24 தொகுதிகள் ஒதுக்கீடு', meta: 'டெல்லி டெஸ்க்', link: '' },
        { time: '11:18', cat: 'பொருளாதாரம்', title: 'ரூபாய் மதிப்பு டாலருக்கு எதிராக 83.42 ஆக சரிவு — RBI தலையிட எதிர்பார்ப்பு', meta: 'மும்பை டெஸ்க்', link: '' },
        { time: '10:54', cat: 'விளையாட்டு', title: 'ஐபிஎல் ஏலம்: ருத்ராக்ஷ் பாட்டீலுக்கு ₹14 கோடி — சிஎஸ்கேவில் சேர்ந்தார்', meta: 'விளையாட்டு டெஸ்க்', link: '' },
        { time: '10:30', cat: 'தமிழகம்', title: 'சென்னை விமான நிலையத்தில் புதிய டெர்மினல் — பிரதமர் திறப்பு', meta: 'சென்னை டெஸ்க்', link: '' },
        { time: '10:12', cat: 'சுற்றுச்சூழல்', title: 'டெல்லி காற்று மாசு குறைப்புக்கான பேரவை அமலாக்கச் சட்டம்', meta: 'டெல்லி டெஸ்க்', link: '' },
        { time: '09:48', cat: 'சினிமா', title: 'விஜய் — \'லியோ 2\' முதல் காட்சி டிசம்பர் 24-ல் ரிலீஸ்', meta: 'சினிமா டெஸ்க்', link: '' },
        { time: '09:24', cat: 'தமிழகம்', title: 'மதுரை–திருநெல்வேலி நெடுஞ்சாலையில் கோர விபத்து — 6 பேர் பலி', meta: 'தமிழக டெஸ்க்', link: '' },
        { time: '09:02', cat: 'அரசியல்', title: 'முதல் முறை வாக்காளர்கள் 18 லட்சம் — இளைஞர் பங்கேற்பு உச்சம்', meta: 'டெல்லி டெஸ்க்', link: '' },
        { time: '08:38', cat: 'அறிவியல்', title: 'கானூரி: சுற்றுலாப் பயணிகள் எண்ணிக்கை 50% அதிகரிப்பு', meta: 'அறிவியல் டெஸ்க்', link: '' },
        { time: '08:14', cat: 'பொருளாதாரம்', title: 'சென்செக்ஸ் 412 புள்ளிகள் சரிவு — ஐடி பங்குகள் ஆதிக்கம்', meta: 'மும்பை டெஸ்க்', link: '' }
      ],
      loadMore: 'மேலும் செய்திகளை ஏற்றவும்',
      sideAdSize: '300 × 360',
      sideAdLabel: 'பக்கவாட்டு விளம்பரம்',
      mostReadHead: 'அதிகம் வாசிக்கப்பட்டவை',
      mostRead: [
        { title: 'தமிழக அரசியலில் புதிய சகாப்தம்: எம்.ஜி.ஆர், ஜெயலலிதா வரிசையில் நடிகர் விஜய்!', link: '' },
        { title: 'சிங்கப்பெருமாள் கோவில்: பயன்பாட்டிற்கு வராத ஆகாய நடை மேம்பாலம் பொதுமக்கள் அவதி', link: '' },
        { title: 'அம்பேத்கர் வரலாற்றை பாடப்புத்தகத்தில் சேர்க்க மதுரை கிளை அதிரடி உத்தரவு!', link: '' },
        { title: 'மயிலாடுதுறையில் பரபரப்பு: காங்கிரஸ் கட்சியினர் மீது திமுகவினர் தாக்குதல்!', link: '' }
      ],
      opinionHead: 'கருத்துக்களம்',
      opinion: [
        { quote: 'தமிழக மக்கள் மாற்றத்தை விரும்புகிறார்கள், அது உறுதியாக நடைபெறும்.', author: 'அரசியல் விமர்சகர்', location: 'சென்னையில்' },
        { quote: 'பொருளாதார வளர்ச்சியில் சிறு தொழில்களின் பங்கு மிகவும் முக்கியமானது.', author: 'பொருளாதார நிபுணர்', location: 'பேட்டி' }
      ],
      marketsHead: 'பங்குச்சந்தை',
      markets: [
        { name: 'சென்செக்ஸ்', value: '73,456.12', change: '▲ 245.30', dir: 'up' },
        { name: 'நிஃப்டி', value: '22,345.90', change: '▲ 85.40', dir: 'up' },
        { name: 'தங்கம் (10g)', value: '₹62,400', change: '▼ 120.00', dir: 'dn' },
        { name: 'அமெரிக்க டாலர்', value: '₹83.45', change: '▲ 0.12', dir: 'up' }
      ],
      photoStoryHead: 'இன்றைய படக் கதை',
      photoStorySub: 'நாளின் சிறந்த புகைப்படங்கள் — செய்திகள் காட்சிகளாக.',
      photoStory: [
        { img: '', caption: 'படம் 1', link: '' },
        { img: '', caption: 'படம் 2', link: '' },
        { img: '', caption: 'படம் 3', link: '' },
        { img: '', caption: 'படம் 4', link: '' }
      ],
      advertiseCta: {
        headline: 'உங்கள் வணிகம் — மறைமலை முரசு வாசகர்களை சென்றடையுங்கள்',
        copy: 'Google Ads, Meta Audience Network வழியாக programmatic விளம்பரங்கள் — அல்லது நேரடி ஆதரவாளர் ஒப்பந்தங்கள். print + digital + newsletter — மூன்று தளங்களிலும் ஒரே campaign-ல்.',
        networks: ['Google AdSense', 'Google Ad Manager', 'Meta Audience Network', 'Direct Sponsorship', 'Newsletter'],
        ctaText: 'விளம்பர திட்டங்கள்',
        ctaSub: 'ads@maraimalaimurasu.com',
        ctaHref: 'mailto:ads@maraimalaimurasu.com'
      }
    },
    cinema: {
      title: 'சினிமா',
      subtitle: 'திரையுலகின் முக்கிய புதுப்பிப்புகள், விமர்சனங்கள், பாக்ஸ் ஆபிஸ் மற்றும் பிரபலங்களை பற்றிய அலசல்.',
      badge: 'புதிய வெளியீடு',
      stats: [
        { num: '248', label: 'செய்திகள் / விமர்சனங்கள்' },
        { num: '14', label: 'வீடியோ அப்டேட்ஸ்' }
      ],
      featured: {
        cat: 'POLITICS',
        img: '',
        placeholder: 'JANANAYAGAN POLITICS',
        title: 'விஜய் "லியோ 2" முதல் காட்சி டிசம்பர் 24 — ஜூபிலி கனத்தில் பெருவிழா',
        excerpt: 'எச். வினோத் இயக்கத்தில் விஜய் நடிக்கும் கடைசி திரைப்படமான \'ஜனநாயகன்\', தளபதியின் பிறந்தநாளான ஜூன் 22-ம் தேதி வெளியாகும் என எதிர்பார்க்கப்படுகிறது.',
        meta: 'திரை டெஸ்க் · 18 நிமிடம்',
        link: ''
      },
      trendingHead: 'பிரபல சினிமா செய்திகள்',
      trending: [
        { title: 'ஜனநாயகன் – தளபதி விஜய்யின் கடைசிப்படம்', meta: 'திரை டெஸ்க்', link: '' },
        { title: 'பௌர்ணமி – கமல்ஹாசன் நடிப்பில் பிரம்மாண்ட திட்டம்', meta: 'சினிமா டெஸ்க்', link: '' },
        { title: 'Suriya – ஜான்லேராஸ்வாமி – புதிய பிரஜெக்ட் அறிவிப்பு', meta: 'திரை டெஸ்க்', link: '' },
        { title: 'All Indian – ஏ.ஆர்.ரஹ்மான் – 2 விசேஷ பாராட்டுகள்', meta: 'இசை டெஸ்க்', link: '' },
        { title: 'சர்வராஜ்காந்த நீங்கல் இற்றற்றியில் பிராடல் ஆட்டம்', meta: 'திரை டெஸ்க்', link: '' }
      ],
      newsHead: 'சினிமா செய்திகள்',
      newsMore: 'மேலும் →',
      news: [
        { cat: 'சினிமா', img: '', placeholder: 'STR 49', title: 'சிம்புவின் திட்டம் 0 — STR 49 முதலில் தோற்றுக்கொடுக்க ஆனாரா?', meta: 'திரை டெஸ்க் · 2 மணி', link: '' },
        { cat: 'OTT', img: '', placeholder: 'DISNEY HOTSTAR', title: 'Disney + Hotstar — தமிழில் சுதந்திரம் தினம் OTT அப்டேட்ஸ்', meta: 'OTT டெஸ்க் · 3 மணி', link: '' },
        { cat: 'பாலிவுட்', img: '', placeholder: 'BOLLYWOOD', title: 'கபிலதேவ் இந்தியன் 3 — திரைப்படத்தில் சிக்க கட்டப் பிரிய', meta: 'பாலிவுட் டெஸ்க் · 4 மணி', link: '' },
        { cat: 'விருதுகள்', img: '', placeholder: 'AWARDS', title: 'கர்ணட்-விரிசி தேசிய விருதுகள் — கோலிவுட் விழாவில் கூட்டம்', meta: 'நிகழ்வுகள் டெஸ்க் · 6 மணி', link: '' }
      ],
      reviewsHead: 'திரைப்பட விமர்சனங்கள்',
      reviewsMore: 'அனைத்தும் காண்க →',
      reviews: [
        { cat: 'விமர்சனம்', rating: 4, img: '', placeholder: 'MARATHAM', title: 'மரதாம்', verdict: 'அதிரடி உரிய படம், புதிய சாதனை.', meta: 'விமர்சனம் — அருண் சேகர்', link: '' },
        { cat: 'விமர்சனம்', rating: 4, img: '', placeholder: 'VENNILA', title: 'வெண்ணிலா குடிசையில்', verdict: 'மலர் காதல் கதையும், நகை சுவையும் — ஒரு இடம்.', meta: 'விமர்சனம் — வெண்ணிலா', link: '' },
        { cat: 'விமர்சனம்', rating: 5, img: '', placeholder: 'KEDI', title: 'கேடி', verdict: 'பெருந்திரை விமர்சகர் பாராட்டப்பெற்ற படம்.', meta: 'விமர்சனம் — ராமன்', link: '' }
      ],
      popularHead: 'பிரபலம் இன்று',
      popularMore: 'முழுமையாக →',
      popular: [
        { role: 'நடிகர்', name: 'ரஜினிகாந்த்', desc: "'தலைவர் 172' அறிவிப்பு", descLine2: '', img: '', placeholder: 'RAJINIKANTH', featured: false, link: '' },
        { role: 'நடிகை', name: 'நயன்தாரா', desc: 'Netflix தொடரில்', descLine2: 'இணைந்தார்', img: '', placeholder: 'NAYANTHARA', featured: false, link: '' },
        { role: 'இயக்குநர்', name: 'லோகேஷ் கனகராஜ்', desc: "'லியோ 2' விழா தயாரிப்பில்", descLine2: '', img: '', placeholder: 'LOKESH', featured: true, link: '' },
        { role: 'இசை', name: 'AR ரஹ்மான்', desc: "'வீர நாடகம்' சாதனை", descLine2: '', img: '', placeholder: 'AR RAHMAN', featured: false, link: '' },
        { role: 'நடிகர்', name: 'தனுஷ்', desc: 'செல்வராகவனுடன்', descLine2: 'இணைந்தார்', img: '', placeholder: 'DHANUSH', featured: false, link: '' },
        { role: 'நடிகை', name: 'ஐஸ்வர்யா ராஜேஷ்', desc: 'திரையரங்க பயணம்', descLine2: 'சர்வதேசம்', img: '', placeholder: 'AISHWARYA', featured: false, link: '' }
      ],
      samsungBanner: {
        enabled: true,
        brand: 'Samsung',
        title: 'Galaxy S25 / Galaxy AI+',
        subtitle: 'Limited Period Offer',
        copy: 'Own at ₹53999 (1 unit)',
        ctaText: 'Own now',
        ctaHref: '#',
        tagline: 'No.1 SELLING ANDROID SMARTPHONE',
        brandRight: 'Flipkart',
        placeholder: 'SAMSUNG GALAXY S25'
      },
      videoHead: 'வீடியோ செய்திகள்',
      videoMore: 'அனைத்து வீடியோ →',
      videos: [
        { title: 'AR ரஹ்மான் — "லியோ ஓம்" பிரம்மாண்ட இசை அமைப்பு', img: '', placeholder: 'AR RAHMAN', duration: '04:32', link: '' },
        { title: 'விஜய் — அரசியல் வருகை — மக்களின் எதிர்பார்ப்பு', img: '', placeholder: 'VIJAY POLITICS', duration: '03:18', link: '' }
      ],
      boxOfficeHead: 'பாக்ஸ் ஆபிஸ் — இந்த வாரம்',
      boxOfficeMore: 'முழு அட்டவணை →',
      boxOffice: [
        { rank: '01', title: 'மரதாம்', collection: '15ம் கோடி', meta: 'திரை வசூல் / 1ம் வாரம்' },
        { rank: '02', title: 'வெண்ணிலா குடிசையில்', collection: '12ம் கோடி', meta: 'திரை வசூல் / 1ம் வாரம்' },
        { rank: '03', title: 'கேடி', collection: '218 கோடி', meta: 'திரை வசூல் / 2ம் வாரம்' },
        { rank: '04', title: 'அஞ்சாதவை 02', collection: '484 கோடி', meta: 'திரை வசூல் / 3ம் வாரம்' },
        { rank: '05', title: 'STR 49', collection: '162 கோடி', meta: 'திரை வசூல் / 1ம் வாரம்' }
      ],
      photoHead: 'புகைப்பட தொகுப்பு',
      photoMore: 'அனைத்து புகைப்படங்கள் →',
      photos: [
        { caption: 'விஜய் சினிமா பதிப்பு', img: '', placeholder: 'GALA 1' },
        { caption: 'தளபதி பிறந்தநாள் கோலாகலம்', img: '', placeholder: 'BIRTHDAY' },
        { caption: 'விரு கோபால் தனிஞ்', img: '', placeholder: 'GALLERY' },
        { caption: 'சினிமா கூட்டம்', img: '', placeholder: 'CROWD' }
      ],
      ottHead: 'OTT வெளியீடுகள்',
      ottItems: [
        { title: 'நயன்தாரா — Netflix', meta: 'திரை டெஸ்க்', link: '' },
        { title: 'R கே ஸ்டுடியோஸ்', meta: 'திரை டெஸ்க்', link: '' },
        { title: 'விஜய் — அரசியல் வருகை', meta: 'திரை டெஸ்க்', link: '' }
      ],
      bottomCta: {
        sponsored: 'SPONSORED',
        title: 'உங்கள் திரைப்பட விளம்பரங்கள் — 14 லட்சம் சினிமா ரசிகர்கள் முன் கொண்டு செல்லுங்கள்',
        subtitle: 'திரை விளம்பர திட்டங்கள் — 6 மொழிகள், 3 பதிப்புகள், 4 நாடுகள்',
        cta: 'விளம்பர திட்டங்கள் →',
        ctaHref: 'mailto:ads@maraimalaimurasu.com'
      }
    },
    law: {
      title: 'சட்டம் முரசு',
      eyebrow: 'நீதி அறிவிப்பு',
      subtitle: 'நீதிமன்ற செய்திகள், சட்ட விளக்கங்கள், குற்றவியல் வழக்குகள் மற்றும் அனைத்து சட்ட தகவல்களின் முழுமையான தொகுப்பு.',
      stats: [
        { num: '24', label: 'சட்ட செய்திகள்' },
        { num: '8.5K', label: 'வாசகர்கள்' },
        { num: '12', label: 'நீதிமன்றம்' },
        { num: '100%', label: 'உண்மை தகவல்' }
      ],
      filterTabs: [
        { label: 'அனைத்தும்', value: 'all', active: true },
        { label: 'தேர்தல் 2026', value: 'election' },
        { label: 'சட்டப்பேரவை', value: 'assembly' },
        { label: 'மக்களவை', value: 'parliament' },
        { label: 'உள்ளாட்சி', value: 'local' },
        { label: 'கொள்கைகள்', value: 'policy' },
        { label: 'ஆய்வுகள்', value: 'analysis' },
        { label: 'கருத்துகள்', value: 'opinion' }
      ],
      midAdLabel: 'விளம்பரம் · GOOGLE ADS · AD · GOOGLE',
      midAdSize: '728 × 90',
      midAdSub: 'GOOGLE ADSENSE · IN-FEED',
      metaAdLabel: 'விளம்பரம் · META AUDIENCE · AD · META',
      metaAdSize: '728 × 120',
      metaAdSub: 'cat-infeed-meta-4',
      stream2: [
        { cat: 'உள்ளாட்சி', title: 'வாக்கு எண்ணும் மையங்கள்: 76 இடங்கள் — மே 12-ல் முடிவு', meta: 'நிர்வாக மய் · 6 மணி நேரம்', link: '', placeholder: 'COUNTING CENTER' },
        { cat: 'கருத்துகள்', title: 'தலையங்கம்: ஜனநாயகத்தின் பெருவிழா — வாக்காளர்களின் கடமை', meta: 'ஆசிரியர் · 7 மணி நேரம்', link: '', placeholder: 'EDITORIAL' }
      ],
      bottomSponsor: {
        label: 'காவேரி வங்கி',
        title: 'காலந்தோறக்கிள உதவித்தொகை — மறைமலை முரசு வாசகர்களுக்கு மட்டும் 7.85% வட்டி',
        meta: 'விளம்பர அங்கீகாரம் · EMI மாதம் ₹1,650 முதல் · பாலன்ஸ் ATM',
        placeholder: 'BANK'
      },
      trendingHead: 'இன்றைய பிரபலமானவை',
      trending: [
        { title: 'ஐபிஎல் ஏலம்: ருத்ராக்ஷ் பாட்டீலுக்கு ₹14 கோடி', link: '' },
        { title: 'சென்னை விமான நிலையத்தில் புதிய டெர்மினல்', link: '' },
        { title: 'நாயக் கட்டுப்பாட்டுத் தடுப்பு எதிராக சரிவு', link: '' },
        { title: 'ஸ்டீவ் விஜய் படத்தின் முதல் காட்சி', link: '' },
        { title: 'செட்டிநாடு கோழி தேநீர் செய்முறை', link: '' }
      ],
      sideAd1Label: 'விளம்பரம் · GOOGLE ADS · AD · GOOGLE',
      sideAd1Size: '300 × 250',
      sideAd1Sub: 'GOOGLE ADSENSE · SIDEBAR',
      newsletterHead: 'செய்தி மடல்',
      newsletterCopy: 'காலையிலும் பகலிலும் நிதிக் தலித் தினசரி செய்திகள் — உங்கள் இன்பாக்ஸுக்கு.',
      newsletterPlaceholder: 'மின்னஞ்சல் முகவரி...',
      newsletterButton: 'சேர',
      topicsHead: 'தலைப்புகள்',
      topics: ['தேர்தல் 2026', 'திமுக', 'காங்கிரஸ்', 'பாஜக', 'அதிமுக', 'விசிக', 'சட்டப்பேரவை', 'வேட்பாளர்', 'கூட்டணி'],
      sideAd2Label: 'விளம்பரம் · META AUDIENCE · AD · META',
      sideAd2Size: '300 × 600',
      sideAd2Sub: 'META · HALF-PAGE',
      sidebarSponsor: {
        label: 'AARCADU',
        sub: 'விளம்பரதாரர் · SPONSORED',
        title: 'பரம்பரை பற்றி மால் — நேரடி வாங்குகையாளர் வாரம்',
        meta: '45 உள்ள · இலவச காலண் · சாண்டிதழ் பாரிட',
        cta: 'மேலும் செய்',
        placeholder: 'FARM PRODUCE'
      },
      featured: {
        cat: 'நீதிமன்றம்',
        img: '/img/crime-scene.avif',
        title: 'சிறுமி கொலை வழக்கு: குற்றவாளிக்கு தூக்கு தண்டனை — புதுச்சேரி நீதிமன்றம் அதிரடி தீர்ப்பு',
        excerpt: 'நீதிமன்ற செய்திகள், சட்ட விளக்கங்கள், குற்றவியல் வழக்குகள் — அனைத்து சட்டம் சம்பந்தமான தகவல்களின் முழுமையான ஆதாரம்.',
        meta: 'சட்ட டெஸ்க் · 2 மணி நேரம்',
        liveTime: 'LIVE',
        liveLabel: 'LAW',
        link: ''
      },
      secondary: [
        { cat: 'நீதிமன்றம்', img: '/img/crime-scene.avif', title: 'சப்-இன்ஸ்பெக்டர் சுட்டுக் கொலை: துப்பாக்கி முனையில் மிரட்டல்', meta: 'சட்ட டெஸ்க் · 1 மணி நேரம்', link: '' },
        { cat: 'சட்டம்', img: '/img/cheating-case.avif', title: 'காலிஸ்தான் கோவிட் முறைகேடு: 12 ஊர்களில் நடவடிக்கை எடுக்க உத்தரவு', meta: 'சட்ட டெஸ்க் · 3 மணி நேரம்', link: '' }
      ],
      sectionHead: 'நேரடி சட்ட செய்திகள்',
      sectionMore: 'அனைத்தும் காண்க ›',
      stream: [
        { time: '10:30', cat: 'நீதிமன்றம்', title: 'ரூ.5.13 கோடி மோசடி: நிதி நிறுவன உரிமையாளர் மனைவி கைது!', meta: 'சட்ட டெஸ்க் · 4 மணி நேரம்', link: '' },
        { time: '10:25', cat: 'சட்டம்', title: 'நகைக்காக மூதாட்டி கொலை: இளைஞர் கைது', meta: 'சட்ட டெஸ்க் · 5 மணி நேரம்', link: '' },
        { time: '10:20', cat: 'உரிமை', title: 'தொழிலாளர் உரிமைகள்: புதிய சட்டத் திருத்தங்கள் அறிவிப்பு', meta: 'சட்ட டெஸ்க் · 8 மணி நேரம்', link: '' },
        { time: '10:15', cat: 'சட்டம்', title: 'சைபர் குற்றம்: ஆன்லைன் மோசடி குறித்து விழிப்புணர்வு பிரசாரம்', meta: 'சட்ட டெஸ்க் · 10 மணி நேரம்', link: '' },
        { time: '10:10', cat: 'நீதிமன்றம்', title: 'பெண் பாதுகாப்பு: புதிய சட்டத் திருத்தம் அறிவிப்பு', meta: 'சட்ட டெஸ்க் · 12 மணி நேரம்', link: '' },
        { time: '10:05', cat: 'சட்டம்', title: 'நில உரிமை வழக்கு: உச்சநீதிமன்றம் முக்கிய தீர்ப்பு', meta: 'சட்ட டெஸ்க் · 1 நாள்', link: '' }
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
    },
    sports: {
      title: 'விளையாட்டு',
      subtitle: 'கிரிக்கெட், கால்பந்து, தடகளம் — தமிழ்நாடு மற்றும் சர்வதேச விளையாட்டுகளின் முழுமையான அலசல்.',
      badge: 'EXCLUSIVES',
      stats: [
        { num: '3', label: 'நேரலை போட்டிகள்' },
        { num: '247', label: 'வீடியோ அப்டேட்ஸ்' }
      ],
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
        live: true, liveText: 'LIVE',
        img: '', bgImage: '', placeholder: 'STADIUM',
        score1Label: 'TN', score1: '342/6',
        score2Label: 'MUM', score2: '318/10',
        kicker: 'சிறப்பு அறிக்கை · கிரிக்கெட்',
        title: 'ரஞ்சி அரையிறுதி: தமிழ்நாடு அணி இறுதிப் போட்டிக்கு — மும்பையை 6 விக்கெட் வித்தியாசத்தில் வீழ்த்தியது',
        excerpt: 'சேப்பாக்கம் M.A. சிதம்பரம் மைதானத்தில் நடைபெற்ற அரையிறுதியில் பார்த்திவ் ஐயப்பனின் 142 ரன்கள் வெற்றியின் முதுகெலும்பாக அமைந்தது.',
        meta: 'விளையாட்டு டெஸ்க் · 18 நிமிடங்களுக்கு முன் · 4.2 லட்சம் பார்வைகள்', link: ''
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
      newsHead: 'விளையாட்டு செய்திகள்', newsMore: 'மேலும் →',
      news: [
        { cat: 'விளையாட்டு', img: '', placeholder: 'CRICKET', title: 'மாஜி பாட்டர் — மிரட்சிகர 2 + படிய அமைச்சர்', meta: 'விளையாட்டு டெஸ்க் · 4 மணி', link: '' },
        { cat: 'கால்பந்து', img: '', placeholder: 'FOOTBALL', title: 'இந்தியா — இங்கிலாந்து கடைசிக்கூத்தில் — வீழ்த்தியோ 2', meta: 'விளையாட்டு டெஸ்க் · 6 மணி', link: '' },
        { cat: 'டென்னிஸ்', img: '', placeholder: 'TENNIS', title: 'பெரசி உலகம் 2026 — ரத்திற்கு டில்வுல்லும்', meta: 'விளையாட்டு டெஸ்க் · 8 மணி', link: '' },
        { cat: 'விளையாட்டு', img: '', placeholder: 'KABADDI', title: 'தடகளம் - 100 மீட்டர் ஓட்டப்பந்தயம் இறுதி', meta: 'விளையாட்டு டெஸ்க் · 10 மணி', link: '' }
      ],
      cricketHead: 'கிரிக்கெட்', cricketMore: 'அனைத்தும் காண்க →',
      cricketFeatured: {
        title: 'தமிழ்நாடு வீரர் பாரத்வாஜ் ரம்பாயய் — ரஞ்சி அரையிறுதியில் ஒன்றரை சதம்',
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
        tagline: 'No.1 SELLING ANDROID SMARTPHONE', brandRight: 'Flipkart'
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
    },
    beauty: {
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
        { img: '', placeholder: 'CLEANSE', title: 'முக சருமத்தில் ஒளி தோன்ற "துளசி" மருத்துவ முறை', meta: 'நிபுணர் ஆலோசனை · ஞாயிறு', link: '' },
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
    },
    cooking: {
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
        { img: '', placeholder: 'IDLI', title: 'வெண்ணெய் இட்லி', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'DOSA', title: 'மலையாள தோசை', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'PONGAL', title: 'வென் பொங்கல்', meta: 'சமையல் டெஸ்க்', link: '' }
      ],
      lunchHead: '1/2 மதிய & இரவு உணவு', lunchMore: 'மேலும் →',
      lunch: [
        { img: '', placeholder: 'RICE', title: 'பாதியில் சிக்கன் பிரியாணி', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'CURRY', title: 'மட்டன் வரிசை குழம்பு', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'VEG', title: 'காய்கறி சேர்ந்த சாதம்', meta: 'சமையல் டெஸ்க்', link: '' }
      ],
      sweetsHead: 'பலகாரம் & இனிப்புகள்', sweetsMore: 'மேலும் →',
      sweets: [
        { img: '', placeholder: 'HALWA', title: 'அல்வா', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'PAYASAM', title: 'பாயசம்', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'LADDU', title: 'லட்டு', meta: 'சமையல் டெஸ்க்', link: '' },
        { img: '', placeholder: 'JALEBI', title: 'ஜிலேபி', meta: 'சமையல் டெஸ்க்', link: '' }
      ],
      healthyHead: 'ஆரோக்கிய உணவுகள்', healthyMore: 'மேலும் →',
      healthy: [
        { icon: '🥗', title: 'காய்கறி', desc: 'தினசரி காய்கறி உண்ணுதல் ஆரோக்கியம்', link: '' },
        { icon: '🥛', title: 'பால் பொருட்கள்', desc: 'பால் தயிர் — ஊட்டச்சத்து', link: '' },
        { icon: '🌾', title: 'தானியங்கள்', desc: 'பெரிய இலையும் தானியமே', link: '' }
      ],
      videoHead: 'வீடியோ சமையல் குறிப்புகள்', videoMore: 'அனைத்து வீடியோ →',
      videos: [
        { title: 'பாரம்பரிய சிக்கன் பிரியாணி', img: '', placeholder: 'BIRYANI', duration: '12:45', link: '' },
        { title: 'வென் பொங்கல்', img: '', placeholder: 'PONGAL', duration: '08:32', link: '' },
        { title: 'அல்வா — பாரம்பரிய இனிப்பு', img: '', placeholder: 'HALWA', duration: '06:18', link: '' }
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
    },
    astrology: {
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
      rasi: [
        { sign: 'மேஷம்', icon: '♈', desc: 'இன்று நீங்கள் நினைத்த காரியங்கள் வெற்றிகரமாக முடியும். பணவரவு திருப்தியாக இருக்கும். புதிய முயற்சிகளைத் தொடங்கலாம்.', pdf: '', link: '' },
        { sign: 'ரிஷபம்', icon: '♉', desc: 'பணியிடத்தில் மதிப்பு அதிகரிக்கும். குடும்பத்தில் மகிழ்ச்சி நிலவும். வியாபாரத்தில் புதிய வாடிக்கையாளர்கள் கிடைப்பார்கள்.', pdf: '', link: '' },
        { sign: 'மிதுனம்', icon: '♊', desc: 'கொஞ்சம் நிதானமாக செயல்படுவது நல்லது. பேச்சில் கவனம் தேவை. வாகனப் பயணங்களில் எச்சரிக்கை அவசியம்.', pdf: '', link: '' },
        { sign: 'கடகம்', icon: '♋', desc: 'எதிர்பாராத தனவரவு கிடைக்கும். பழைய நண்பர்களைச் சந்தித்து மகிழ்வீர்கள். உடல் ஆரோக்கியம் சீராகும்.', pdf: '', link: '' },
        { sign: 'சிம்மம்', icon: '♌', desc: 'பணியில் கூடுதல் பொறுப்புகள் வரலாம். உங்களின் உழைப்பிற்கு ஏற்ற அங்கீகாரம் கிடைக்கும். குடும்பத்தினர் ஆதரவாக இருப்பார்கள்.', pdf: '', link: '' },
        { sign: 'கன்னி', icon: '♍', desc: 'பொருளாதார நிலை உயரும். மாணவர்கள் கல்வியில் சிறந்து விளங்குவார்கள். தொலைதூரப் பயணங்கள் பயனுள்ளதாக இருக்கும்.', pdf: '', link: '' },
        { sign: 'துலாம்', icon: '♎', desc: 'எடுத்த காரியங்களில் சிறு தடங்கல்கள் வந்து நீங்கும். நண்பர்களின் உதவி கிடைக்கும். புதிய முயற்சிகளை பிற்பகலில் தொடங்கவும்.', pdf: '', link: '' },
        { sign: 'விருச்சிகம்', icon: '♏', desc: 'நினைத்த காரியங்கள் கைக்கூடும். தொழில் வளர்ச்சி திருப்தியாக இருக்கும். மனைவியின் மூலம் நல்ல செய்தி வரும்.', pdf: '', link: '' },
        { sign: 'தனுசு', icon: '♐', desc: 'மனதில் புதிய தைரியம் பிறக்கும். சவால்களைச் சமாளித்து வெற்றி பெறுவீர்கள். புதிய ஆடை ஆபரணங்கள் வாங்குவீர்கள்.', pdf: '', link: '' },
        { sign: 'மகரம்', icon: '♑', desc: 'பணியிடத்தில் பொறுமை அவசியம். மேலதிகாரிகளின் ஆலோசனைகளைக் கேட்டு நடப்பது நல்லது. வீண் விவாதங்களைத் தவிர்க்கவும்.', pdf: '', link: '' },
        { sign: 'கும்பம்', icon: '♒', desc: 'உங்கள் திறமைகளை வெளிப்படுத்த நல்ல வாய்ப்பு கிடைக்கும். வியாபாரத்தில் லாபம் அதிகரிக்கும். தெய்வ வழிபாடு நல்லது.', pdf: '', link: '' },
        { sign: 'மீனம்', icon: '♓', desc: 'எதிர்பார்த்த உதவிகள் சரியான நேரத்தில் கிடைக்கும். மனக்குழப்பங்கள் நீங்கி தெளிவு பிறக்கும். சுப நிகழ்ச்சிகள் கைகூடும்.', pdf: '', link: '' }
      ],
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
    },
    article: {
      breadcrumb: [
        { label: 'முகப்பு', link: '/' },
        { label: 'அரசியல்', link: '/category' },
        { label: 'கட்டுரை', link: '' }
      ],
      title: 'தமிழக முதல்வர் ஆனார் த.வெ.க தலைவர் ஜோசப் விஜய்',
      subtitle: 'புரட்சி அரசியலும்... புத்தம் புதிய கூட்டணி ஆட்சியும்! தமிழக மக்கள் அளித்த அமோக ஆதரவால் வரலாற்றுச் சாதனை.',
      author: 'மாநில செய்தியாளர்',
      date: '10 மே 2026, 10:30 IST',
      image: '/img/vijay.avif',
      caption: 'சென்னை தலைமைச் செயலகத்தில் நடைபெற்ற விழாவில் பதவிப்பிரமாணம்.',
      tags: ['அரசியல்', 'தமிழகம்', 'தேர்தல் 2026', 'முதலமைச்சர்'],
      content: [
        'தமிழக அரசியல் வரலாற்றில் ஒரு புதிய அத்தியாயம் எழுதப்பட்டுள்ளது. 2026 சட்டப்பேரவைத் தேர்தலில் மாபெரும் வெற்றி பெற்ற தமிழக வெற்றிக் கழகத்தின் (த.வெ.க) தலைவர் ஜோசப் விஜய் இன்று தமிழகத்தின் புதிய முதலமைச்சராகப் பதவியேற்றார்.',
        'சென்னை கிண்டியில் உள்ள ஆளுநர் மாளிகையில் நடைபெற்ற எளிய, ஆனால் பிரம்மாண்டமான விழாவில், அவருக்கு ஆளுநர் பதவிப் பிரமாணமும் ரகசியக் காப்புப் பிரமாணமும் செய்து வைத்தார்.'
      ],
      pullQuote: '"இந்த வெற்றி என் வெற்றி அல்ல, இது தமிழக மக்களின் வெற்றி. ஏழை, எளிய மக்களின் வாழ்வில் ஒளியேற்றுவதே எனது அரசின் தலையாய நோக்கமாக இருக்கும்."',
      closing: 'புதிய அமைச்சரவையில் பல இளைஞர்களுக்கும், பெண்களுக்கும் வாய்ப்பளிக்கப்பட்டுள்ளதாக தகவல்கள் தெரிவிக்கின்றன.',
      relatedHead: 'தொடர்புடைய செய்திகள்'
    },
    contact: {
      heroTitle: 'எங்களை',
      heroOutline: 'தொடர்புகொள்ளுங்கள்',
      heroDesc: 'உங்கள் கருத்துக்கள், செய்தி குறிப்புகள், விளம்பர விசாரணைகள், சந்தா உதவி — அனைத்தும் இங்கே. சென்னையின் தலைமை அலுவலகத்தில் உள்ள மறைமலை முரசு டெஸ்க் 24 மணி நேரமும் உங்களை வரவேற்கிறது.',
      stats: [
        { num: '1947', label: 'முதல் இயங்குகிறது' },
        { num: '32', label: 'பகுதிகளிலானவை' },
        { num: '24x7', label: 'செய்தி டெஸ்க்' },
        { num: '4 HR', label: 'சராசரியான பதிலளிப்பு' }
      ],
      officeAddress: '123, அண்ணா சாலை, தேனாம்பேட்டை, சென்னை — 600 018, தமிழ்நாடு',
      phoneLandline: '+91 44 2814 1414',
      phoneWhatsapp: '+91 98400 12345',
      emailGeneral: 'contact@maraimalaimurasu.com',
      emailEditor: 'editor@maraimalaimurasu.com',
      newsroomPhone: '1800 425 1234',
      newsroomEmail: 'newsdesk@maraimalaimurasu.com',
      salesPhone: '+91 98400 98400',
      salesHours: 'திங்கள் முதல் வெள்ளி · 9:30 AM - 7:00 PM',
      techPhone: '+91 44 2820 8200',
      techDesc: 'App, ePaper, Subscription'
    }
  };

  const [pagesContent, setPagesContent] = useState(() => {
    const saved = localStorage.getItem('customPagesContent');
    let parsed = {};
    if (saved) {
      try { parsed = JSON.parse(saved); } catch (e) { return DEFAULT_PAGES; }
    }
    // Deep-merge each page individually so newly-added fields (like astrology.rasi)
    // fall back to defaults when the saved data was written before those fields existed.
    const merged = {};
    Object.keys(DEFAULT_PAGES).forEach(pageId => {
      const defaultPage = DEFAULT_PAGES[pageId];
      const savedPage = parsed[pageId] || {};
      const pageMerged = { ...defaultPage };
      Object.keys(savedPage).forEach(key => {
        const savedVal = savedPage[key];
        const defaultVal = defaultPage[key];
        // Treat empty arrays as missing — keep defaults if they have items
        if (Array.isArray(savedVal) && savedVal.length === 0 && Array.isArray(defaultVal) && defaultVal.length > 0) {
          pageMerged[key] = defaultVal;
        } else if (savedVal && typeof savedVal === 'object' && !Array.isArray(savedVal) && defaultVal && typeof defaultVal === 'object' && !Array.isArray(defaultVal)) {
          // Deep-merge nested objects
          pageMerged[key] = { ...defaultVal, ...savedVal };
        } else {
          pageMerged[key] = savedVal;
        }
      });
      merged[pageId] = pageMerged;
    });
    return merged;
  });

  const [activePage, setActivePage] = useState('headlines');

  const updatePage = (pageId, field, value) => {
    setPagesContent(prev => ({
      ...prev,
      [pageId]: { ...prev[pageId], [field]: value }
    }));
  };

  const updatePageNested = (pageId, parentField, childField, value) => {
    setPagesContent(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [parentField]: { ...prev[pageId][parentField], [childField]: value }
      }
    }));
  };

  const updatePageArrayItem = (pageId, arrayField, index, field, value) => {
    setPagesContent(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [arrayField]: prev[pageId][arrayField].map((it, i) => i === index ? { ...it, [field]: value } : it)
      }
    }));
  };

  const handleSavePages = () => {
    localStorage.setItem('customPagesContent', JSON.stringify(pagesContent));
    notifyChange('customPagesContent');
    alert('All page contents saved! Refresh pages to see changes.');
  };

  // Reusable mini-component for image-or-upload field
  const ImageOrUploadField = ({ value, onChange, label = 'Image (URL or Upload)' }) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', flex: 1 }} placeholder="https://... or /img/file.jpg" />
        <label style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          Upload
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onChange(reader.result);
              reader.readAsDataURL(file);
            }
          }} />
        </label>
      </div>
      {value && <img src={value} alt="" style={{ marginTop: '8px', maxWidth: '180px', maxHeight: '120px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />}
    </div>
  );

  // Helper: extract YouTube video ID from any URL format
  const extractYoutubeId = (url) => {
    if (!url) return '';
    const patterns = [
      /[?&]v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/shorts\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
      /youtube\.com\/live\/([^?]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url; // assume already an ID
  };
  
  const [adSettings, setAdSettings] = useState(() => {
    const saved = localStorage.getItem('adSettings');
    if (saved) return JSON.parse(saved);
    return {
      googleActive: true,
      googleSlotId: '',
      metaActive: false,
      metaPlacementId: '',
      houseLocation: 'Global Site-Wide Billboard (728x250)',
      houseImageUrl: '',
      houseLink: ''
    };
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('customSiteSettings');
    if (saved) return JSON.parse(saved);
    return {
      siteTitle: 'மறைமலை முரசு — முன்களச் செய்திகள்',
      heroTitle: 'தேர்தல் 2026 களம்',
      section1Title: 'தேர்தல் கள விசாரணை',
      section2Title: 'வெள்ளித் திரை · சமையல்',
      rniNumber: 'RNI.No. TNTAM / 2023 / 88613',
      // Web3Forms — contact form email service (used by ContactPage)
      // Get a free access key at https://web3forms.com
      web3formsAccessKey: 'ea9499ec-45fd-4a85-8fe3-04eb6ba89e0f'
    };
  });

  // Helper: notify other tabs/components that settings changed
  const notifyChange = (key) => {
    window.dispatchEvent(new StorageEvent('storage', { key }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('customSiteSettings', JSON.stringify(siteSettings));
    notifyChange('customSiteSettings');
    alert('Site Settings Saved! Changes are now live on the website.');
  };
  
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('customArticles');
    if (saved) return JSON.parse(saved);
    return [
    { id: 1, title: 'தமிழக சட்டப்பேரவை தேர்தல் 2026', category: 'அரசியல்', date: '2026-05-12', status: 'Published' },
    { id: 2, title: 'சென்னை விமான நிலையத்தில் புதிய டெர்மினல்', category: 'மாநிலம்', date: '2026-05-11', status: 'Published' },
    { id: 3, title: 'ஐபிஎல் 2026: சென்னை சூப்பர் கிங்ஸ்', category: 'விளையாட்டு', date: '2026-05-10', status: 'Published' },
    { id: 4, title: 'பாரிஸ் ஒலிம்பிக்ஸ்: இந்தியாவுக்கு மேலும் பதக்கங்கள்', category: 'விளையாட்டு', date: '2026-05-09', status: 'Draft' },
  ]});

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('customCategories');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'தலைப்புச் செய்திகள்', slug: 'headlines', count: 124 },
      { id: 2, name: 'சட்டம் முரசு', slug: 'law', count: 85 },
      { id: 3, name: 'ஆன்மீகம்', slug: 'spiritual', count: 50 },
      { id: 4, name: 'ஜோதிடம்', slug: 'astrology', count: 45, parentId: 3 },
      { id: 5, name: 'சினிமா', slug: 'cinema', count: 450 },
      { id: 6, name: 'விளையாட்டு', slug: 'sports', count: 320 },
      { id: 7, name: 'மற்றவை', slug: 'more', count: 200 },
      { id: 8, name: 'அழகுகுறிப்பு', slug: 'beauty', count: 65, parentId: 7 },
      { id: 9, name: 'சமையல்', slug: 'cooking', count: 110, parentId: 7 },
    ];
  });

  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatParent, setNewCatParent] = useState('');

  const handleAddCategory = () => {
    if (!newCatName || !newCatSlug) return alert('Name and Slug are required!');
    const newCat = {
      id: Date.now(),
      name: newCatName,
      slug: newCatSlug,
      parentId: newCatParent || null,
      count: 0
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('customCategories', JSON.stringify(updated));
    notifyChange('customCategories');
    setNewCatName('');
    setNewCatSlug('');
    setNewCatParent('');
    alert('Category added successfully!');
  };

  const handleDeleteCategory = (id) => {
    if(confirm('Are you sure you want to delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      localStorage.setItem('customCategories', JSON.stringify(updated));
      notifyChange('customCategories');
    }
  };

  // Media picker modal state — callback receives the selected image URL
  const [mediaPickerCallback, setMediaPickerCallback] = useState(null);
  const openMediaPicker = (callback) => setMediaPickerCallback(() => callback);
  const closeMediaPicker = () => setMediaPickerCallback(null);

  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem('customMedia');
    if (saved) return JSON.parse(saved);
    return [
    { id: 1, url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&q=80', name: 'news-hero-1.jpg', size: '245 KB', type: 'Images' },
    { id: 2, url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=80', name: 'politics-bg.jpg', size: '512 KB', type: 'Images' },
    { id: 3, url: 'https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?w=300&q=80', name: 'sports-header.jpg', size: '320 KB', type: 'Images' },
    { id: 4, url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=300&q=80', name: 'cinema-event.jpg', size: '890 KB', type: 'Images' },
    { id: 5, url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&q=80', name: 'abstract-bg.jpg', size: '1.2 MB', type: 'Images' },
    { id: 6, url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&q=80', name: 'newspaper-stack.jpg', size: '640 KB', type: 'Images' },
  ]});

  const filteredMedia = activeMediaFilter === 'All Media' 
    ? media 
    : media.filter(m => m.type === activeMediaFilter || (!m.type && activeMediaFilter === 'Images'));

  const handlePublish = () => {
    if (!articleTitle.trim()) {
      alert('Please enter a title for the article');
      return;
    }
    const newArticle = {
      id: Date.now(),
      title: articleTitle,
      category: articleCategory || 'தலைப்புச் செய்திகள்',
      date: new Date().toISOString().split('T')[0],
      status: 'Published',
      excerpt: articleExcerpt,
      content: articleContent,
      img: featuredImage || '/img/vijay.avif'
    };
    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem('customArticles', JSON.stringify(updated));
    notifyChange('customArticles');
    alert(`Article published! Now visible on homepage and ${newArticle.category} pages.`);
    setActiveTab('dashboard');
    // Reset form
    setArticleTitle('');
    setArticleExcerpt('');
    setArticleContent('');
    setFeaturedImage('');
    setArticlePdf('');
  };

  const handleEdit = (article) => {
    setArticleTitle(article.title || '');
    setArticleExcerpt(article.excerpt || '');
    setArticleContent(article.content || '');
    setFeaturedImage(article.img || '');
    // In a full app we'd track the ID being edited to update rather than duplicate, 
    // but here we'll just populate the editor.
    setActiveTab('add');
  };

  const publishedThisWeek = articles.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && a.status === 'Published';
  }).length;

  const totalReaders = Math.max(850000, articles.length * 15200);
  const formattedReaders = totalReaders > 1000000 ? (totalReaders/1000000).toFixed(1) + 'M' : Math.floor(totalReaders/1000) + 'K';

  const statCardStyle = {
    background: '#fff',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #D1D5DB',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '8px', color: '#111827', fontWeight: '700', letterSpacing: '-0.02em' }}>Dashboard Overview</h2>
            <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '15px' }}>Welcome back, Editor. Here's what's happening with your portal today.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={statCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.FileText />
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#10B981', background: '#D1FAE5', padding: '4px 8px', borderRadius: '20px' }}>
                    <Icons.TrendingUp /> 12%
                  </span>
                </div>
                <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Total Articles</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>{articles.length}</div>
              </div>

              <div style={statCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Users />
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#10B981', background: '#D1FAE5', padding: '4px 8px', borderRadius: '20px' }}>
                    <Icons.TrendingUp /> 8%
                  </span>
                </div>
                <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Total Readers</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>{formattedReaders}</div>
              </div>

              <div style={statCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563' }}>
                    <Icons.Write />
                  </div>
                </div>
                <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Published This Week</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>{publishedThisWeek}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', margin: 0, color: '#111827', fontWeight: '700' }}>Recent Publications</h3>
              <button onClick={() => setActiveTab('add')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(200, 16, 46, 0.15)' }}>
                <Icons.Plus /> New Article
              </button>
            </div>
            
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '20px 24px', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>#{a.id}</td>
                      <td style={{ padding: '20px 24px', color: '#111827' }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{a.title}</div>
                        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{a.date}</div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ background: '#F3F4F6', color: '#4B5563', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>{a.category}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ color: a.status === 'Published' ? '#059669' : '#D97706', background: a.status === 'Published' ? '#D1FAE5' : '#FEF3C7', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.status === 'Published' ? '#059669' : '#D97706' }}></span>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <button onClick={() => handleEdit(a)} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#374151' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'add':
        return (
          <div style={{ maxWidth: '900px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Write News Article</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Create and publish new content to your portal.</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { alert('Draft Saved!'); setActiveTab('dashboard'); }} style={{ padding: '10px 24px', background: '#fff', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Save Draft</button>
                <button onClick={handlePublish} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(200, 16, 46, 0.2)' }}>Publish Article</button>
              </div>
            </div>
            
            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' }}>
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Headline (Title)</label>
                <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="Enter headline in Tamil..." style={{ ...inputStyle, fontSize: '20px', padding: '16px', fontWeight: '600' }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.boxShadow = 'none' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Category</label>
                  <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 16px center/16px' }}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Author / Desk</label>
                  <input type="text" defaultValue="ஆசிரியர் குழு" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
                </div>
              </div>

              {/* PDF Upload Section */}
              <div style={{ marginBottom: '32px', background: '#F9FAFB', padding: '32px', borderRadius: '12px', border: '2px dashed #D1D5DB', textAlign: 'center', transition: 'all 0.2s' }}>
                <div style={{ width: '48px', height: '48px', background: '#E5E7EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icons.FileText />
                </div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#111827', fontSize: '16px' }}>Upload Content (E-Paper OCR)</label>
                <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 24px 0' }}>Drag and drop a PDF/Image file here, or click to browse.</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
                  <input type="file" accept="application/pdf,image/*" id="pdf-upload" style={{ display: 'none' }} onChange={(e) => {
                    if (e.target.files.length > 0) alert(`Mock: "${e.target.files[0].name}" uploaded successfully!`);
                  }} />
                  <label htmlFor="pdf-upload" style={{ padding: '10px 24px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    Browse Files
                  </label>
                  <button type="button" onClick={() => {
                    const extractedImg = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80';
                    const newMedia = { id: Date.now(), url: extractedImg, name: 'annamalaiyar-chitra-pournami.jpg', size: '540 KB' };
                    const updatedMedia = [newMedia, ...media];
                    setMedia(updatedMedia);
                    localStorage.setItem('customMedia', JSON.stringify(updatedMedia));
                    
                    setFeaturedImage(extractedImg);
                    setArticleTitle("நினைத்தாலே முக்தி தரும் அண்ணாமலையார் திருத்தலத்தில் சித்ரா பௌர்ணமி: அலைமோதிய பக்தர் கூட்டம்!");
                    setArticleExcerpt("திருவண்ணாமலை அண்ணாமலையார் திருக்கோயிலில் சித்ரா பௌர்ணமி விழாவை முன்னிட்டு லட்சக்கணக்கான பக்தர்கள் கிரிவலம் வந்து சாமி தரிசனம் செய்தனர்.");
                    setArticleContent("திருவண்ணாமலை: நினைத்தாலே முக்தி தரும் சிறப்புடைய திருவண்ணாமலை அருள்மிகு அருணாசலேஸ்வரர் திருத்தலத்தில், இந்த ஆண்டு சித்ரா பௌர்ணமி விழா பக்திப் பெருக்குடனும், வரலாறு காணாத பக்தர்கள் கூட்டத்துடனும் மிகச் சிறப்பாக நடைபெற்றுள்ளது.\n\nலட்சக்கணக்கான பக்தர்கள் கிரிவலம்: இந்த ஆண்டின் முக்கியச் சிறப்பம்சமாக, சித்ரா பௌர்ணமி திதியானது ஏப்ரல் 30ஆம் தேதி (வியாழக்கிழமை) தொடங்கி, மே 1ஆம் தேதி வரை நீடித்தது. இதனால் தமிழகம் மட்டுமின்றி, அண்டை மாநிலங்களிலிருந்தும் லட்சக்கணக்கான பக்தர்கள் திரண்டு வந்து கிரிவலம் பாதையை ஆக்கிரமித்தனர். 14 கிலோமீட்டர் தூரமும் “அண்ணாமலையாருக்கு அரோகரா” என்ற முழக்கம் விண்ணதிர ஒலித்தது.\n\nதொடர்ந்து இரண்டு நாட்கள் பக்தர்கள் கூட்டம் இருந்ததால், மாவட்ட நிர்வாகம் மற்றும் காவல்துறை சார்பில் பலத்த பாதுகாப்பு ஏற்பாடுகள் செய்யப்பட்டிருந்தன. கிரிவலப் பாதையில் ஆங்காங்கே குடிநீர், நீர்மோர் மற்றும் அன்னதானம் வழங்கும் பணிகள் தொய்வின்றி நடைபெற்றன.");
                    alert('Text and Images successfully extracted from Media! Image added to Library.');
                  }} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 6px rgba(200, 16, 46, 0.2)' }}>
                    Auto-Extract Text ✨
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Featured Image (URL or Upload)</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <input type="text" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="e.g. https://example.com/image.jpg" style={{ ...inputStyle, flex: 1 }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.boxShadow = 'none' }} />
                  <label style={{ padding: '0 24px', background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFeaturedImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  <button type="button" onClick={() => openMediaPicker((url) => setFeaturedImage(url))} style={{ padding: '0 24px', background: '#F3F4F6', color: '#4B5563', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>📁 Browse Media</button>
                </div>
                {featuredImage && <img src={featuredImage} alt="Preview" style={{ marginTop: '16px', height: '180px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} />}
              </div>


              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Short Excerpt (Summary)</label>
                <textarea rows="3" value={articleExcerpt} onChange={(e) => setArticleExcerpt(e.target.value)} placeholder="Brief summary for the homepage..." style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.boxShadow = 'none' }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Full Content</label>
                <div style={{ border: '1px solid #D1D5DB', borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }} id="editor-container">
                  <div style={{ display: 'flex', gap: '4px', background: '#F9FAFB', padding: '12px', borderBottom: '1px solid #D1D5DB' }}>
                     {['B', 'I', 'U'].map(btn => (
                       <button key={btn} style={{ background: 'transparent', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: btn === 'B' ? 'bold' : 'normal', fontStyle: btn === 'I' ? 'italic' : 'normal', textDecoration: btn === 'U' ? 'underline' : 'none', color: '#4B5563', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{btn}</button>
                     ))}
                     <div style={{ width: '1px', background: '#D1D5DB', margin: '0 8px' }}></div>
                     {['H1', 'H2', 'Quote', 'Link', 'Image'].map(btn => (
                       <button key={btn} style={{ background: 'transparent', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4B5563', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{btn}</button>
                     ))}
                  </div>
                  <textarea rows="15" value={articleContent} onChange={(e) => setArticleContent(e.target.value)} onFocus={() => { document.getElementById('editor-container').style.borderColor = 'var(--accent)'; document.getElementById('editor-container').style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)'; }} onBlur={() => { document.getElementById('editor-container').style.borderColor = '#D1D5DB'; document.getElementById('editor-container').style.boxShadow = 'none'; }} placeholder="Write the full article content here..." style={{ width: '100%', padding: '24px', border: 'none', fontSize: '16px', fontFamily: 'var(--serif)', lineHeight: 1.8, resize: 'vertical', outline: 'none', color: '#111827' }}></textarea>
                </div>
              </div>
            </div>
          </div>
        );
      case 'home-editor':
        return (
          <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Home Page Editor</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Edit every section of the homepage — video, side cards, ticker, banners, sponsor card, ads CTA.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={async () => {
                  if (!window.confirm('Replace ALL current home page content with this week\'s PDF (10-16 May 2026) content?\n\nYour current edits will be overwritten.')) return;
                  const { applyPdfContent, PDF_HOME_CONTENT } = await import('../utils/contentMigration.js');
                  if (applyPdfContent()) {
                    setHomeContent(PDF_HOME_CONTENT);
                    alert('✓ PDF content applied!\n\nThe home page now shows the May 10-16, 2026 issue content.\nRefresh the home page (/) to see changes.');
                  } else {
                    alert('Failed to apply PDF content. Check browser console for details.');
                  }
                }} style={{ padding: '10px 18px', background: '#fff', color: 'var(--accent)', border: '2px solid var(--accent)', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>📰 Apply PDF Content (10 May 2026)</button>
                <button onClick={handleSaveHomeContent} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(200, 16, 46, 0.2)' }}>Save Home Page</button>
              </div>
            </div>

            {/* ===== WEEKLY EDITION PDF ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '2px solid var(--accent)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>📰 Weekly Edition PDF (இந்த வார இதழ்)</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>Upload this week's newspaper PDF. A red banner with "முழு இதழைப் படிக்க" button will appear at the top of the homepage. Visitors click to open the PDF in an inline viewer.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Issue Title</label>
                  <input type="text" value={homeContent.editionPdf?.title || ''} onChange={(e) => updateHomeNested('editionPdf', 'title', e.target.value)} placeholder="மறைமலை முரசு — தமிழ் வார இதழ்" style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Issue Date</label>
                  <input type="text" value={homeContent.editionPdf?.issueDate || ''} onChange={(e) => updateHomeNested('editionPdf', 'issueDate', e.target.value)} placeholder="10-16 May 2026" style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
              </div>

              <div style={{ padding: '14px 16px', background: '#FAFAF7', border: '1px solid var(--rule)', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', color: 'var(--accent)' }}>📄 PDF File</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {homeContent.editionPdf?.key ? (
                    <>
                      <span style={{ flex: 1, fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                        ✓ PDF uploaded ({homeContent.editionPdf.key.substring(0, 40)}...)
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm('Remove the current weekly edition PDF?')) return;
                          try {
                            const { deletePdf } = await import('../utils/pdfStorage.js');
                            await deletePdf(homeContent.editionPdf.key);
                          } catch (e) { /* ignore */ }
                          setHomeContent(prev => ({ ...prev, editionPdf: { key: '', title: prev.editionPdf?.title || '', issueDate: prev.editionPdf?.issueDate || '' } }));
                          // Auto-save so homepage updates immediately
                          setTimeout(() => {
                            try {
                              const saved = localStorage.getItem('customHomeContent');
                              const parsed = saved ? JSON.parse(saved) : {};
                              parsed.editionPdf = { key: '', title: homeContent.editionPdf?.title || '', issueDate: homeContent.editionPdf?.issueDate || '' };
                              localStorage.setItem('customHomeContent', JSON.stringify(parsed));
                              notifyChange('customHomeContent');
                            } catch (e) { /* ignore */ }
                          }, 100);
                        }}
                        style={{ padding: '6px 12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '12px', borderRadius: '5px', fontWeight: '700' }}
                      >
                        Remove PDF
                      </button>
                    </>
                  ) : (
                    <span style={{ flex: 1, fontSize: '12px', color: '#9CA3AF' }}>No PDF uploaded — banner is hidden on homepage</span>
                  )}
                  <label style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                    {homeContent.editionPdf?.key ? '↻ Replace PDF' : '+ Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const { savePdfBlob, deletePdf } = await import('../utils/pdfStorage.js');
                          // Delete old PDF if replacing
                          if (homeContent.editionPdf?.key) {
                            try { await deletePdf(homeContent.editionPdf.key); } catch (err) { /* ignore */ }
                          }
                          const key = await savePdfBlob(file);
                          // Update state AND auto-save to localStorage
                          setHomeContent(prev => {
                            const updated = {
                              ...prev,
                              editionPdf: { ...(prev.editionPdf || {}), key }
                            };
                            try {
                              localStorage.setItem('customHomeContent', JSON.stringify(updated));
                              notifyChange('customHomeContent');
                            } catch (err) { console.error('Auto-save failed', err); }
                            return updated;
                          });
                          alert('✓ PDF uploaded and published!\n\nFile: ' + file.name + '\n\nRefresh the home page (/) to see the banner at the top.');
                        } catch (err) {
                          alert('Failed to upload PDF: ' + err.message);
                        }
                      }}
                    />
                  </label>
                </div>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: '10px 0 0 0' }}>
                  💡 PDFs are stored in IndexedDB (large files supported, no localStorage size limit). Auto-saves on upload — no need to click "Save Home Page".
                </p>
              </div>
            </div>

            {/* ===== LEAD VIDEO ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>🎬 Hero Video Section</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The big YouTube video at the top of the homepage.</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>YouTube URL or Video ID</label>
                <input
                  type="text"
                  value={homeContent.leadVideo.videoId}
                  onChange={(e) => updateLeadVideo('videoId', extractYoutubeId(e.target.value))}
                  placeholder="Paste any YouTube URL or just the 11-character ID"
                  style={inputStyle}
                />
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>Examples: https://youtu.be/abc123, https://www.youtube.com/watch?v=abc123, or just <code>abc123</code></div>
                {homeContent.leadVideo.videoId && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>Preview:</div>
                    <iframe
                      src={`https://www.youtube.com/embed/${homeContent.leadVideo.videoId}`}
                      style={{ width: '100%', maxWidth: '480px', aspectRatio: '16/9', border: 'none', borderRadius: '6px' }}
                      title="Preview"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Kicker (Red label)</label>
                  <input type="text" value={homeContent.leadVideo.kicker} onChange={(e) => updateLeadVideo('kicker', e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Poster Image (URL, Upload, or Browse Media)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={homeContent.leadVideo.poster} onChange={(e) => updateLeadVideo('poster', e.target.value)} placeholder="Leave empty to auto-use YouTube thumbnail" style={{ ...inputStyle, flex: 1 }} />
                    <button type="button" onClick={() => openMediaPicker((url) => updateLeadVideo('poster', url))} style={{ padding: '8px 14px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>📁 Browse</button>
                    <label style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      Upload
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateLeadVideo('poster', reader.result);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                  {homeContent.leadVideo.poster && <img src={homeContent.leadVideo.poster} alt="" style={{ marginTop: '8px', maxHeight: '80px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Title (Main heading)</label>
                <input type="text" value={homeContent.leadVideo.title} onChange={(e) => updateLeadVideo('title', e.target.value)} style={{ ...inputStyle, fontSize: '18px', fontWeight: '600' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Subtitle / Meta</label>
                <input type="text" value={homeContent.leadVideo.meta} onChange={(e) => updateLeadVideo('meta', e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* ===== HERO BLURB (paragraph + tags below video) ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>📝 Hero Blurb (paragraph + tags below the video)</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>The paragraph and tags shown directly below the YouTube hero video.</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Paragraph Text (dek)</label>
                <textarea rows="4" value={homeContent.heroBlurb?.dek || ''} onChange={(e) => updateHeroBlurb('dek', e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>The lead summary paragraph with a red left border.</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>LIVE Badge Text</label>
                <input type="text" value={homeContent.heroBlurb?.liveTag || ''} onChange={(e) => updateHeroBlurb('liveTag', e.target.value)} placeholder="● LIVE" style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', maxWidth: '200px' }} />
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>The red LIVE badge (leave blank to hide).</div>
              </div>

              <div style={{ marginBottom: '20px', padding: '14px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: '700', color: '#374151', fontSize: '13px' }}>🏷 Tags (clickable links)</label>
                  <button type="button" onClick={addHeroBlurbTag} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Tag</button>
                </div>
                {(homeContent.heroBlurb?.tags || []).map((tag, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', color: '#6B7280', fontWeight: '700' }}>{idx + 1}</span>
                    <input type="text" value={tag.text} onChange={(e) => updateHeroBlurbTag(idx, 'text', e.target.value)} placeholder="Tag text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    <input type="text" value={tag.href} onChange={(e) => updateHeroBlurbTag(idx, 'href', e.target.value)} placeholder="Link URL (e.g. /article)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    <button type="button" onClick={() => removeHeroBlurbTag(idx)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: '6px 10px', borderRadius: '6px' }}>✕</button>
                  </div>
                ))}
                {(!homeContent.heroBlurb?.tags || homeContent.heroBlurb.tags.length === 0) && (
                  <div style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', padding: '8px' }}>No tags. Click "+ Add Tag" above.</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Reporting (reporter names)</label>
                  <input type="text" value={homeContent.heroBlurb?.reporting || ''} onChange={(e) => updateHeroBlurb('reporting', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} placeholder="சேது மாதவன், கோபால் ராமன்..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>🕐 Last Updated <span style={{ color: '#10B981', fontSize: '11px' }}>(auto Tamil time)</span></label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input type="datetime-local" value={isoToInputDatetime(homeContent.heroBlurb?.updatedAtTs)} onChange={(e) => updateHeroBlurb('updatedAtTs', e.target.value ? new Date(e.target.value).toISOString() : '')} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', flex: 1 }} />
                    <button type="button" onClick={() => updateHeroBlurb('updatedAtTs', new Date().toISOString())} style={{ padding: '8px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Now</button>
                  </div>
                  {homeContent.heroBlurb?.updatedAtTs && (
                    <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: '600' }}>
                      Preview: இன்று {new Date(homeContent.heroBlurb.updatedAtTs).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} IST
                    </div>
                  )}
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '600', color: '#6B7280' }}>Manual override (used if no timestamp above)</label>
                    <input type="text" value={homeContent.heroBlurb?.updatedAt || ''} onChange={(e) => updateHeroBlurb('updatedAt', e.target.value)} placeholder="e.g. இன்று 11:42 AM IST" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ===== HERO SIDE CARDS ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>📰 Hero Side Cards (4 items)</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The 4 numbered news cards beside the hero video.</p>

              {homeContent.heroSide.map((card, idx) => (
                <div key={idx} style={{ padding: '20px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{idx + 1}</div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: '600' }}>Side Card #{idx + 1}</h4>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {card.img && <img src={card.img} alt="" style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB', flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Image (URL, Upload, or Browse Media)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="text" value={card.img} onChange={(e) => updateHeroSide(idx, 'img', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', flex: 1 }} />
                          <button type="button" onClick={() => openMediaPicker((url) => updateHeroSide(idx, 'img', url))} style={{ padding: '8px 14px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>📁 Browse</button>
                          <label style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                            Upload
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => updateHeroSide(idx, 'img', reader.result);
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                        </div>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Title</label>
                        <input type="text" value={card.title} onChange={(e) => updateHeroSide(idx, 'title', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                      </div>
                      <div style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Location</label>
                          <input type="text" value={card.location || ''} onChange={(e) => updateHeroSide(idx, 'location', e.target.value)} placeholder="e.g. மதுரை" style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                        </div>
                        <div style={{ flex: 1.5 }}>
                          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>🕐 Published At <span style={{ color: '#10B981', fontSize: '11px' }}>(auto-calculates "X நிமிடம் முன்")</span></label>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input type="datetime-local" value={isoToInputDatetime(card.publishedAt)} onChange={(e) => updateHeroSide(idx, 'publishedAt', e.target.value ? new Date(e.target.value).toISOString() : '')} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', flex: 1 }} />
                            <button type="button" onClick={() => updateHeroSide(idx, 'publishedAt', new Date().toISOString())} style={{ padding: '8px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Set Now</button>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginBottom: '12px', display: card.publishedAt ? 'none' : 'block' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Meta (manual fallback when Published At is empty)</label>
                        <input type="text" value={card.meta || ''} onChange={(e) => updateHeroSide(idx, 'meta', e.target.value)} placeholder="e.g. மதுரை · 10 நிமிடம் முன்" style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>🔗 Link URL (where the card navigates when clicked)</label>
                        <input type="text" value={card.link || ''} onChange={(e) => updateHeroSide(idx, 'link', e.target.value)} placeholder="e.g. /law, /cinema, /article — or leave blank for default" style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>Leave empty to auto-link based on category. Available pages: /headlines, /law, /astrology, /cinema, /sports, /beauty, /cooking, /article, /contact</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== LIVE TICKER ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>📢 Live Ticker (உடனடி — scrolling headlines)</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The 8 scrolling news headlines under the navigation bar.</p>
              {(homeContent.liveTicker || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{idx + 1}</div>
                  <input type="text" value={item} onChange={(e) => updateHomeTickerItem(idx, e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', flex: 1 }} />
                </div>
              ))}
            </div>

            {/* ===== ELECTION BANNER ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>🗳 Election Banner (red banner with stats)</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The big red election banner — title and two stat blocks.</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Banner Title</label>
                <input type="text" value={homeContent.electionBanner?.title || ''} onChange={(e) => updateHomeNested('electionBanner', 'title', e.target.value)} style={{ ...inputStyle, fontWeight: '700' }} placeholder="e.g. தேர்தல் 2026 களம்" />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                <div style={{ flex: 1, padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h5 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#374151', fontWeight: '700' }}>Left Stat</h5>
                  <input type="text" value={homeContent.electionBanner?.leftNum || ''} onChange={(e) => updateHomeNested('electionBanner', 'leftNum', e.target.value)} placeholder="Number (e.g. 234)" style={{ ...inputStyle, marginBottom: '8px', fontSize: '14px', fontWeight: '600' }} />
                  <textarea rows="2" value={homeContent.electionBanner?.leftLabel || ''} onChange={(e) => updateHomeNested('electionBanner', 'leftLabel', e.target.value)} placeholder="Label (use newlines for multiple lines)" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                </div>
                <div style={{ flex: 1, padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
                  <h5 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#374151', fontWeight: '700' }}>Right Stat</h5>
                  <input type="text" value={homeContent.electionBanner?.rightNum || ''} onChange={(e) => updateHomeNested('electionBanner', 'rightNum', e.target.value)} placeholder="Number (e.g. 6.4கோ)" style={{ ...inputStyle, marginBottom: '8px', fontSize: '14px', fontWeight: '600' }} />
                  <textarea rows="2" value={homeContent.electionBanner?.rightLabel || ''} onChange={(e) => updateHomeNested('electionBanner', 'rightLabel', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* ===== SPONSOR CARD ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>🛍 Sponsor Card (Chennai Silks style banner)</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The sponsored ad card that appears after the two-column section.</p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Brand Name</label>
                  <input type="text" value={homeContent.sponsorCard?.brand || ''} onChange={(e) => updateHomeNested('sponsorCard', 'brand', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Thumbnail Text (fallback if no image)</label>
                  <input type="text" value={homeContent.sponsorCard?.thumb || ''} onChange={(e) => updateHomeNested('sponsorCard', 'thumb', e.target.value)} placeholder="e.g. AC MELA" style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                </div>
              </div>

              {/* ===== LOGO IMAGE UPLOAD ===== */}
              <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#FAFAF7', borderRadius: '8px', border: '1px solid var(--rule)' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: 'var(--accent)', fontSize: '12px' }}>🖼 Logo / Thumbnail Image (replaces "AC MELA" placeholder)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" value={homeContent.sponsorCard?.image || ''} onChange={(e) => updateHomeNested('sponsorCard', 'image', e.target.value)} placeholder="Image URL or upload below" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => updateHomeNested('sponsorCard', 'image', url))} style={{ padding: '7px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '5px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>📁 Browse</button>
                  <label style={{ padding: '7px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateHomeNested('sponsorCard', 'image', reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                {homeContent.sponsorCard?.image && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src={homeContent.sponsorCard.image} alt="" style={{ maxHeight: '60px', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                    <button type="button" onClick={() => updateHomeNested('sponsorCard', 'image', '')} style={{ padding: '4px 10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', fontWeight: '700' }}>Remove</button>
                  </div>
                )}
              </div>

              {/* ===== FULL BANNER IMAGE UPLOAD ===== */}
              <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#FAFAF7', borderRadius: '8px', border: '1px solid var(--rule)' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', color: 'var(--accent)', fontSize: '12px' }}>🏞 Full Banner Image (optional — replaces ENTIRE card with a single image banner)</label>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 8px 0' }}>Upload a single wide image like the Tesco Digitals creative. When set, the whole card becomes one clickable banner.</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" value={homeContent.sponsorCard?.fullImage || ''} onChange={(e) => updateHomeNested('sponsorCard', 'fullImage', e.target.value)} placeholder="Full banner image URL or upload" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => updateHomeNested('sponsorCard', 'fullImage', url))} style={{ padding: '7px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '5px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>📁 Browse</button>
                  <label style={{ padding: '7px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => updateHomeNested('sponsorCard', 'fullImage', reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                {homeContent.sponsorCard?.fullImage && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src={homeContent.sponsorCard.fullImage} alt="" style={{ maxHeight: '80px', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                    <button type="button" onClick={() => updateHomeNested('sponsorCard', 'fullImage', '')} style={{ padding: '4px 10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', fontWeight: '700' }}>Remove</button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Headline</label>
                <input type="text" value={homeContent.sponsorCard?.headline || ''} onChange={(e) => updateHomeNested('sponsorCard', 'headline', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Body Copy</label>
                <textarea rows="2" value={homeContent.sponsorCard?.copy || ''} onChange={(e) => updateHomeNested('sponsorCard', 'copy', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>CTA Button Text</label>
                  <input type="text" value={homeContent.sponsorCard?.cta || ''} onChange={(e) => updateHomeNested('sponsorCard', 'cta', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                </div>
                <div style={{ flex: 3 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>🔗 Link URL (where the card sends users)</label>
                  <input type="text" value={homeContent.sponsorCard?.href || ''} onChange={(e) => updateHomeNested('sponsorCard', 'href', e.target.value)} placeholder="https://your-sponsor.com" style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                </div>
              </div>
            </div>

            {/* ===== TOP STORIES GRID (4 cards) ===== */}
            <GridSectionEditor
              gridName="topStoriesGrid"
              icon="📊"
              title="தலைப்புச் செய்திகள் — Top Stories Grid (4 cards)"
              desc="The 4 main story cards under the hero section. Edit each card's image, category, headline, and meta."
            />

            {/* ===== ELECTION GRID (4 cards) ===== */}
            <GridSectionEditor
              gridName="electionGrid"
              icon="🗳"
              title="தேர்தல் கள விசாரணை — Election Coverage Grid (4 cards)"
              desc="The 4 election-related cards under the red election banner."
            />

            {/* ===== CINEMA GRID (4 cards) ===== */}
            <GridSectionEditor
              gridName="cinemaGrid"
              icon="🎬"
              title="வெள்ளித் திரை · சமையல் — Cinema & Lifestyle Grid (4 cards)"
              desc="The 4 cinema/lifestyle cards in the Cinema section."
            />

            {/* ===== ADVERTISE CTA ===== */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '32px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>📣 "Advertise With Us" CTA Box</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The black box near the bottom with networks list and email button.</p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Headline</label>
                <input type="text" value={homeContent.advertiseCta?.headline || ''} onChange={(e) => updateHomeNested('advertiseCta', 'headline', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Description</label>
                <textarea rows="3" value={homeContent.advertiseCta?.copy || ''} onChange={(e) => updateHomeNested('advertiseCta', 'copy', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Network Tags (5 items)</label>
                {(homeContent.advertiseCta?.networks || []).map((net, idx) => (
                  <input key={idx} type="text" value={net} onChange={(e) => updateHomeNested('advertiseCta', 'networks', homeContent.advertiseCta.networks.map((it, i) => i === idx ? e.target.value : it))} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px', marginBottom: '6px' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Button Text</label>
                  <input type="text" value={homeContent.advertiseCta?.ctaText || ''} onChange={(e) => updateHomeNested('advertiseCta', 'ctaText', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Sub-text</label>
                  <input type="text" value={homeContent.advertiseCta?.ctaSub || ''} onChange={(e) => updateHomeNested('advertiseCta', 'ctaSub', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Button Link</label>
                  <input type="text" value={homeContent.advertiseCta?.ctaHref || ''} onChange={(e) => updateHomeNested('advertiseCta', 'ctaHref', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} placeholder="mailto:... or https://..." />
                </div>
              </div>
            </div>

            {/* ===== TWO-COLUMN SECTIONS ===== */}
            <TwoColEditor
              colName="twoColLeft"
              icon="🏛"
              title="மாநில செய்திகள் — State News (Two-Col Left)"
              desc="Left column: 1 lead + 4 list items. Appears in Tamil Nadu & National section."
            />
            <TwoColEditor
              colName="twoColRight"
              icon="🌏"
              title="தேசிய & சர்வதேச — National/International (Two-Col Right)"
              desc="Right column of Tamil Nadu & National section."
            />
            <TwoColEditor
              colName="sportsCol"
              icon="🏏"
              title="விளையாட்டு & ஆன்மீகம் — Sports & Spiritual"
              desc="Bottom-left two-column section."
            />
            <TwoColEditor
              colName="lifestyleCol"
              icon="🍲"
              title="வாழ்வியல் & சமையல் — Lifestyle & Cooking"
              desc="Bottom-right two-column section."
            />

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveHomeContent} style={{ padding: '12px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 12px rgba(200, 16, 46, 0.2)' }}>💾 Save Home Page Content</button>
            </div>
          </div>
        );
      case 'pages-editor': {
        const pageList = [
          { id: 'headlines', label: 'Headlines · தலைப்பு செய்திகள்' },
          { id: 'law', label: 'Law · சட்டம் முரசு' },
          { id: 'spiritual', label: 'Spiritual hub · ஆன்மீகம்' },
          { id: 'astrology', label: 'Astrology · ஜோதிடம்' },
          { id: 'cinema', label: 'Cinema · சினிமா' },
          { id: 'sports', label: 'Sports · விளையாட்டு' },
          { id: 'more', label: 'More hub · மற்றவை' },
          { id: 'beauty', label: 'Beauty · அழகுகுறிப்பு' },
          { id: 'cooking', label: 'Cooking · சமையல்' },
          { id: 'article', label: 'Article · கட்டுரை' },
          { id: 'epaper', label: 'ePaper · இ-பேப்பர்' },
          { id: 'contact', label: 'Contact · தொடர்பு' },
          { id: 'subscription', label: 'Subscription · சந்தா' }
        ];
        const page = pagesContent[activePage] || {};

        return (
          <div style={{ maxWidth: '1100px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Pages Editor</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Edit content for every page of the website.</p>
              </div>
              <button onClick={handleSavePages} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(200, 16, 46, 0.2)' }}>💾 Save All Pages</button>
            </div>

            {/* Sub-navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
              {pageList.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  style={{
                    padding: '8px 16px',
                    background: activePage === p.id ? 'var(--accent)' : '#fff',
                    color: activePage === p.id ? '#fff' : '#4B5563',
                    border: activePage === p.id ? 'none' : '1px solid #D1D5DB',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* ===== HEADLINES PAGE ===== */}
            {activePage === 'headlines' && (() => {
              const hd = pagesContent.headlines || {};
              const upd = (field, val) => updatePage('headlines', field, val);
              const updHero = (field, val) => updatePageNested('headlines', 'featured', field, val);
              const updFeat = (field, val) => updatePageNested('headlines', 'featured', field, val);
              const updArr = (arrField, i, field, val) => setPagesContent(prev => ({
                ...prev,
                headlines: { ...prev.headlines, [arrField]: (prev.headlines[arrField] || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addArr = (arrField, newItem) => setPagesContent(prev => ({
                ...prev,
                headlines: { ...prev.headlines, [arrField]: [...(prev.headlines[arrField] || []), newItem] }
              }));
              const removeArr = (arrField, i) => setPagesContent(prev => ({
                ...prev,
                headlines: { ...prev.headlines, [arrField]: (prev.headlines[arrField] || []).filter((_, idx) => idx !== i) }
              }));
              const imgUp = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };

              return (
                <div>
                  {/* ===== TITLEBAR ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Page Header / Titlebar</h3>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Eyebrow Label</label>
                      <input type="text" value={hd.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Page Title</label>
                      <input type="text" value={hd.title || ''} onChange={(e) => upd('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Subtitle</label>
                      <textarea rows="3" value={hd.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '13px' }}>4 Stats Strip</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {(hd.stats || []).map((s, i) => (
                        <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>Stat #{i + 1}</label>
                          <input type="text" value={s.num} onChange={(e) => updArr('stats', i, 'num', e.target.value)} placeholder="Number" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', marginBottom: '6px' }} />
                          <input type="text" value={s.label} onChange={(e) => updArr('stats', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== FEATURED (big card on top) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>⭐ Featured Card (big horizontal hero)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Category Pill</label>
                        <input type="text" value={hd.featured?.cat || ''} onChange={(e) => updFeat('cat', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Image Placeholder Text</label>
                        <input type="text" value={hd.featured?.placeholder || ''} onChange={(e) => updFeat('placeholder', e.target.value)} placeholder="POLITICS LIVE" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Image (URL or upload — blank shows striped placeholder)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={hd.featured?.img || ''} onChange={(e) => updFeat('img', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1 }} />
                        <button type="button" onClick={() => openMediaPicker((url) => updFeat('img', url))} style={{ padding: '7px 12px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>📁 Browse</button>
                        <label style={{ padding: '7px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          Upload
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => updFeat('img', r))} />
                        </label>
                      </div>
                      {hd.featured?.img && <img src={hd.featured.img} alt="" style={{ marginTop: '8px', maxHeight: '90px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Headline</label>
                      <input type="text" value={hd.featured?.title || ''} onChange={(e) => updFeat('title', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Excerpt</label>
                      <textarea rows="3" value={hd.featured?.excerpt || ''} onChange={(e) => updFeat('excerpt', e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Meta / Byline</label>
                      <input type="text" value={hd.featured?.meta || ''} onChange={(e) => updFeat('meta', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>🔗 Link URL (blank for default)</label>
                      <input type="text" value={hd.featured?.link || ''} onChange={(e) => updFeat('link', e.target.value)} placeholder="/article or full URL" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                    </div>
                  </div>

                  {/* ===== FILTER TABS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🏷 Filter Tabs (sub-navigation)</h3>
                      <button type="button" onClick={() => addArr('filterTabs', { label: 'புதிய', value: 'new', active: false })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Tab</button>
                    </div>
                    {(hd.filterTabs || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={t.label} onChange={(e) => updArr('filterTabs', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6B7280', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!t.active} onChange={(e) => setPagesContent(prev => ({ ...prev, headlines: { ...prev.headlines, filterTabs: (prev.headlines.filterTabs || []).map((x, idx) => idx === i ? { ...x, active: e.target.checked } : { ...x, active: false }) } }))} />
                          Active
                        </label>
                        <button type="button" onClick={() => removeArr('filterTabs', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== SECONDARY CARDS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Secondary Cards (2 cards)</h3>
                    {(hd.secondary || []).map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>Card #{i + 1}</div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={s.cat} onChange={(e) => updArr('secondary', i, 'cat', e.target.value)} placeholder="Category" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                          <input type="text" value={s.img} onChange={(e) => updArr('secondary', i, 'img', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                          <button type="button" onClick={() => openMediaPicker((url) => updArr('secondary', i, 'img', url))} style={{ padding: '6px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>📁</button>
                          <label style={{ padding: '6px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                            Upload
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => updArr('secondary', i, 'img', r))} />
                          </label>
                        </div>
                        <input type="text" value={s.title} onChange={(e) => updArr('secondary', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={s.meta} onChange={(e) => updArr('secondary', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updArr('secondary', i, 'link', e.target.value)} placeholder="🔗 Link URL — blank for default" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== NEWSLETTER SIGNUP ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>✉️ Newsletter Signup</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 14px 0' }}>Email signup section that appears between Secondary Cards and Leaderboard Ad. Leave headline blank to hide the section.</p>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Headline (Tamil)</label>
                      <input type="text" value={hd.newsletter?.headline || ''} onChange={(e) => updatePageNested('headlines', 'newsletter', 'headline', e.target.value)} placeholder="தினசரி செய்திச் சுருக்கம் — உங்கள் மின்னஞ்சலில்" style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Subtitle / Description</label>
                      <textarea rows="2" value={hd.newsletter?.subtitle || ''} onChange={(e) => updatePageNested('headlines', 'newsletter', 'subtitle', e.target.value)} placeholder="ஒவ்வொரு காலையும் முக்கிய செய்திகள்..." style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Input Placeholder</label>
                        <input type="text" value={hd.newsletter?.placeholder || ''} onChange={(e) => updatePageNested('headlines', 'newsletter', 'placeholder', e.target.value)} placeholder="உங்கள் மின்னஞ்சல்..." style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Button Text</label>
                        <input type="text" value={hd.newsletter?.buttonText || ''} onChange={(e) => updatePageNested('headlines', 'newsletter', 'buttonText', e.target.value)} placeholder="சேர" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* ===== LEADERBOARD AD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Leaderboard Ad Placeholder</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Advertisement" label</label>
                        <input type="text" value={hd.leaderboardLabel || ''} onChange={(e) => upd('leaderboardLabel', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Size</label>
                        <input type="text" value={hd.leaderboardSize || ''} onChange={(e) => upd('leaderboardSize', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Subtext</label>
                        <input type="text" value={hd.leaderboardText || ''} onChange={(e) => upd('leaderboardText', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* ===== SECTION HEAD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🏷 Section Head (Stream divider)</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Section Title</label>
                        <input type="text" value={hd.sectionHead || ''} onChange={(e) => upd('sectionHead', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"More" text</label>
                        <input type="text" value={hd.sectionMore || ''} onChange={(e) => upd('sectionMore', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* ===== STREAM ITEMS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📋 Stream Items (live news list)</h3>
                      <button type="button" onClick={() => addArr('stream', { time: '10:00', cat: 'செய்தி', title: 'புதிய செய்தி', meta: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(hd.stream || []).map((s, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={s.time} onChange={(e) => updArr('stream', i, 'time', e.target.value)} placeholder="10:30" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '70px' }} />
                          <input type="text" value={s.cat} onChange={(e) => updArr('stream', i, 'cat', e.target.value)} placeholder="Category" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArr('stream', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <input type="text" value={s.title} onChange={(e) => updArr('stream', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', marginBottom: '4px' }} />
                        <input type="text" value={s.meta} onChange={(e) => updArr('stream', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '4px' }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updArr('stream', i, 'link', e.target.value)} placeholder="🔗 Link URL — blank for default" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Load More" button text</label>
                      <input type="text" value={hd.loadMore || ''} onChange={(e) => upd('loadMore', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                  </div>

                  {/* ===== PHOTO STORY SECTION ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📸 Photo Story Grid (இன்றைய படக் கதை)</h3>
                      <button type="button" onClick={() => addArr('photoStory', { img: '', caption: 'புதிய படம்', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Photo</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Section Heading</label>
                        <input type="text" value={hd.photoStoryHead || ''} onChange={(e) => upd('photoStoryHead', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 3 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Subtitle</label>
                        <input type="text" value={hd.photoStorySub || ''} onChange={(e) => upd('photoStorySub', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                    </div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#374151' }}>Photo Items</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {(hd.photoStory || []).map((p, i) => (
                        <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <span style={{ width: '20px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>Photo #{i + 1}</span>
                            <div style={{ flex: 1 }}></div>
                            <button type="button" onClick={() => removeArr('photoStory', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '10px', padding: '3px 7px', borderRadius: '3px', fontWeight: '700' }}>✕</button>
                          </div>
                          {p.img && <img src={p.img} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px', border: '1px solid #E5E7EB' }} />}
                          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                            <input type="text" value={p.img || ''} onChange={(e) => updArr('photoStory', i, 'img', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '10px', padding: '4px 8px', flex: 1 }} />
                            <button type="button" onClick={() => openMediaPicker((url) => updArr('photoStory', i, 'img', url))} style={{ padding: '4px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>📁</button>
                            <label style={{ padding: '4px 8px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: '600' }}>
                              Upload
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => updArr('photoStory', i, 'img', r))} />
                            </label>
                          </div>
                          <input type="text" value={p.caption || ''} onChange={(e) => updArr('photoStory', i, 'caption', e.target.value)} placeholder="Caption" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '4px' }} />
                          <input type="text" value={p.link || ''} onChange={(e) => updArr('photoStory', i, 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '10px', padding: '4px 8px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== ADVERTISE CTA SECTION ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📣 உங்கள் வணிகம் — Advertise CTA Box</h3>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Headline</label>
                      <input type="text" value={hd.advertiseCta?.headline || ''} onChange={(e) => updatePageNested('headlines', 'advertiseCta', 'headline', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Description</label>
                      <textarea rows="3" value={hd.advertiseCta?.copy || ''} onChange={(e) => updatePageNested('headlines', 'advertiseCta', 'copy', e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Network Tags</label>
                      {(hd.advertiseCta?.networks || []).map((net, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={net}
                          onChange={(e) => updatePageNested('headlines', 'advertiseCta', 'networks', (hd.advertiseCta?.networks || []).map((it, i) => i === idx ? e.target.value : it))}
                          style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '5px' }}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Button Text</label>
                        <input type="text" value={hd.advertiseCta?.ctaText || ''} onChange={(e) => updatePageNested('headlines', 'advertiseCta', 'ctaText', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Sub-text</label>
                        <input type="text" value={hd.advertiseCta?.ctaSub || ''} onChange={(e) => updatePageNested('headlines', 'advertiseCta', 'ctaSub', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Button Link</label>
                        <input type="text" value={hd.advertiseCta?.ctaHref || ''} onChange={(e) => updatePageNested('headlines', 'advertiseCta', 'ctaHref', e.target.value)} placeholder="mailto:... or https://..." style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* ===== BOTTOM CTA (உங்கள் வணிகம் — Sponsor Card) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 6px 0', color: '#111827', fontWeight: '700' }}>🤝 உங்கள் வணிகம் — Bottom Sponsor CTA</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px 0' }}>The bottom sponsor card with image on the left and CTA text on the right (appears below the photo story).</p>

                    {/* Image upload */}
                    <div style={{ marginBottom: '14px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '700', color: '#374151' }}>🖼 Sponsor Image (replaces the "SPONSOR" placeholder)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          flex: '0 0 100px',
                          height: '75px',
                          background: hd.bottomCta?.image ? `url(${hd.bottomCta.image}) center/cover no-repeat` : 'repeating-linear-gradient(45deg, #E5E7EB 0, #E5E7EB 8px, #F3F4F6 8px, #F3F4F6 16px)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: '#9CA3AF',
                          fontFamily: 'monospace'
                        }}>
                          {!hd.bottomCta?.image && 'SPONSOR'}
                        </div>
                        <div style={{ flex: 1, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <label style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            {hd.bottomCta?.image ? '↻ Replace Image' : '+ Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updatePageNested('headlines', 'bottomCta', 'image', reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => openMediaPicker((url) => updatePageNested('headlines', 'bottomCta', 'image', url))}
                            style={{ padding: '6px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', color: '#374151', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                          >
                            📁 Browse
                          </button>
                          {hd.bottomCta?.image && (
                            <button
                              type="button"
                              onClick={() => updatePageNested('headlines', 'bottomCta', 'image', '')}
                              style={{ padding: '6px 10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Sponsored Tag (small red label)</label>
                      <input type="text" value={hd.bottomCta?.sponsored || ''} onChange={(e) => updatePageNested('headlines', 'bottomCta', 'sponsored', e.target.value)} placeholder="SPONSORED" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Title (Big bold headline)</label>
                      <input type="text" value={hd.bottomCta?.title || ''} onChange={(e) => updatePageNested('headlines', 'bottomCta', 'title', e.target.value)} placeholder="உங்கள் வணிகம் — மறைமலை முரசு வாசகர்களை சென்றடையுங்கள்" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', fontWeight: '600' }} />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Subtitle (small descriptive line)</label>
                      <textarea rows="2" value={hd.bottomCta?.subtitle || ''} onChange={(e) => updatePageNested('headlines', 'bottomCta', 'subtitle', e.target.value)} placeholder="தினசரி 14 லட்சம் வாசகர்கள் · 6 பதிப்புகள் · அனைத்து பகுதிகளிலும்" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>CTA Text (red link)</label>
                        <input type="text" value={hd.bottomCta?.cta || ''} onChange={(e) => updatePageNested('headlines', 'bottomCta', 'cta', e.target.value)} placeholder="விளம்பர திட்டங்கள் →" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>CTA Link URL</label>
                        <input type="text" value={hd.bottomCta?.ctaHref || ''} onChange={(e) => updatePageNested('headlines', 'bottomCta', 'ctaHref', e.target.value)} placeholder="mailto:ads@maraimalaimurasu.com or https://..." style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '6px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Image Placeholder Text (shown only when no image is uploaded)</label>
                      <input type="text" value={hd.bottomCta?.placeholder || ''} onChange={(e) => updatePageNested('headlines', 'bottomCta', 'placeholder', e.target.value)} placeholder="SPONSOR" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                  </div>

                  {/* ===== HL-SIDEBAR ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📌 Right Sidebar</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Sidebar Ad Size</label>
                        <input type="text" value={hd.sideAdSize || ''} onChange={(e) => upd('sideAdSize', e.target.value)} placeholder="300 × 360" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Sidebar Ad Label</label>
                        <input type="text" value={hd.sideAdLabel || ''} onChange={(e) => upd('sideAdLabel', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                    </div>

                    {/* Most Read — அதிகம் வாசிக்கப்பட்டவை (sidebar block) */}
                    <div style={{ marginBottom: '14px', background: '#FEF3F2', padding: '14px', borderRadius: '8px', border: '2px solid #FCA5A5' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '700', color: '#991B1B' }}>📰 அதிகம் வாசிக்கப்பட்டவை — Section Heading</label>
                      <input type="text" value={hd.mostReadHead || ''} onChange={(e) => upd('mostReadHead', e.target.value)} placeholder="அதிகம் வாசிக்கப்பட்டவை" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                      <div style={{ padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>📌 Most Read Items (numbered 1, 2, 3…)</label>
                          <button type="button" onClick={() => addArr('mostRead', { title: 'புதிய தலைப்பு', meta: 'டெஸ்க்', link: '' })} style={{ padding: '5px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Item</button>
                        </div>
                        <p style={{ fontSize: '10px', color: '#6B7280', margin: '0 0 8px 0' }}>
                          💡 Title appears as the headline. Meta is the small text below (e.g. desk name, author). Link is optional — leave blank to disable click.
                        </p>
                        {(hd.mostRead || []).map((mr, i) => (
                          <div key={i} style={{ marginBottom: '8px', padding: '8px', background: '#F9FAFB', borderRadius: '5px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                              <span style={{ width: '22px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                              <input type="text" value={mr.title || ''} onChange={(e) => updArr('mostRead', i, 'title', e.target.value)} placeholder="Title (headline shown to readers)" style={{ ...inputStyle, fontSize: '12px', padding: '5px 9px', flex: 1 }} />
                              <button type="button" onClick={() => removeArr('mostRead', i)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input type="text" value={mr.meta || ''} onChange={(e) => updArr('mostRead', i, 'meta', e.target.value)} placeholder="Meta (e.g. டெல்லி டெஸ்க் · 2 மணி)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 9px', flex: 1 }} />
                              <input type="text" value={mr.link || ''} onChange={(e) => updArr('mostRead', i, 'link', e.target.value)} placeholder="🔗 Link URL (optional)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 9px', flex: 1 }} />
                            </div>
                          </div>
                        ))}
                        {(hd.mostRead || []).length === 0 && (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                            No items yet — click "+ Add Item" to create the first Most Read entry.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Opinion */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Opinion" heading</label>
                      <input type="text" value={hd.opinionHead || ''} onChange={(e) => upd('opinionHead', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                      <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#374151' }}>💬 Opinion Quotes</label>
                          <button type="button" onClick={() => addArr('opinion', { quote: 'புதிய கருத்து', author: 'எழுத்தாளர்', location: '' })} style={{ padding: '4px 10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                        </div>
                        {(hd.opinion || []).map((op, i) => (
                          <div key={i} style={{ marginBottom: '6px', padding: '6px', background: '#fff', borderRadius: '5px', border: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10px', fontWeight: '700', color: '#6B7280' }}>Quote #{i + 1}</span>
                              <button type="button" onClick={() => removeArr('opinion', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '10px', padding: '3px 7px', borderRadius: '3px' }}>✕</button>
                            </div>
                            <textarea rows="2" value={op.quote} onChange={(e) => updArr('opinion', i, 'quote', e.target.value)} placeholder="Quote text" style={{ ...inputStyle, fontSize: '11px', padding: '4px 8px', resize: 'vertical', marginBottom: '4px' }} />
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input type="text" value={op.author} onChange={(e) => updArr('opinion', i, 'author', e.target.value)} placeholder="Author" style={{ ...inputStyle, fontSize: '11px', padding: '3px 8px', flex: 1 }} />
                              <input type="text" value={op.location || ''} onChange={(e) => updArr('opinion', i, 'location', e.target.value)} placeholder="Location" style={{ ...inputStyle, fontSize: '11px', padding: '3px 8px', flex: 1 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Markets */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Markets" heading</label>
                      <input type="text" value={hd.marketsHead || ''} onChange={(e) => upd('marketsHead', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                      <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#374151' }}>📈 Markets Rows</label>
                          <button type="button" onClick={() => addArr('markets', { name: 'புதிய', value: '0', change: '▲ 0', dir: 'up' })} style={{ padding: '4px 10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                        </div>
                        {(hd.markets || []).map((m, i) => (
                          <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'center' }}>
                            <input type="text" value={m.name} onChange={(e) => updArr('markets', i, 'name', e.target.value)} placeholder="Name" style={{ ...inputStyle, fontSize: '11px', padding: '4px 8px', flex: 2 }} />
                            <input type="text" value={m.value} onChange={(e) => updArr('markets', i, 'value', e.target.value)} placeholder="Value" style={{ ...inputStyle, fontSize: '11px', padding: '4px 8px', flex: 2 }} />
                            <input type="text" value={m.change} onChange={(e) => updArr('markets', i, 'change', e.target.value)} placeholder="▲ 0.00" style={{ ...inputStyle, fontSize: '11px', padding: '4px 8px', flex: 2 }} />
                            <select value={m.dir} onChange={(e) => updArr('markets', i, 'dir', e.target.value)} style={{ ...inputStyle, fontSize: '11px', padding: '4px 6px', width: '60px' }}>
                              <option value="up">▲</option>
                              <option value="dn">▼</option>
                            </select>
                            <button type="button" onClick={() => removeArr('markets', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '10px', padding: '3px 7px', borderRadius: '3px' }}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ============================================================
                       NEW CATEGORY-STYLE SECTIONS (matches Law page layout)
                  ============================================================ */}

                  {/* ===== MID AD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Mid Ad — Google AdSense (after Secondary cards)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={hd.midAdLabel || ''} onChange={(e) => upd('midAdLabel', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={hd.midAdSize || ''} onChange={(e) => upd('midAdSize', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={hd.midAdSub || ''} onChange={(e) => upd('midAdSub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== META AD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Meta Audience Ad (mid)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={hd.metaAdLabel || ''} onChange={(e) => upd('metaAdLabel', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={hd.metaAdSize || ''} onChange={(e) => upd('metaAdSize', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={hd.metaAdSub || ''} onChange={(e) => upd('metaAdSub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== STREAM BATCH 2 ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📋 Stream Batch 2 (after Meta Ad)</h3>
                      <button type="button" onClick={() => addArr('stream2', { cat: 'புதிய', title: 'புதிய செய்தி', meta: '', link: '', placeholder: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(hd.stream2 || []).map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={s.cat} onChange={(e) => updArr('stream2', i, 'cat', e.target.value)} placeholder="Category" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={s.placeholder || ''} onChange={(e) => updArr('stream2', i, 'placeholder', e.target.value)} placeholder="Image placeholder" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={s.img || ''} onChange={(e) => updArr('stream2', i, 'img', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => openMediaPicker((url) => updArr('stream2', i, 'img', url))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                          <button type="button" onClick={() => removeArr('stream2', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <input type="text" value={s.title} onChange={(e) => updArr('stream2', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={s.meta} onChange={(e) => updArr('stream2', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updArr('stream2', i, 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== BOTTOM SPONSOR BANNER ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🏦 Bottom Sponsor Banner (Cauvery Bank style)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" value={hd.bottomSponsor?.label || ''} onChange={(e) => updatePageNested('headlines', 'bottomSponsor', 'label', e.target.value)} placeholder="Brand label" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                      <input type="text" value={hd.bottomSponsor?.placeholder || ''} onChange={(e) => updatePageNested('headlines', 'bottomSponsor', 'placeholder', e.target.value)} placeholder="Image placeholder" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={hd.bottomSponsor?.title || ''} onChange={(e) => updatePageNested('headlines', 'bottomSponsor', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={hd.bottomSponsor?.meta || ''} onChange={(e) => updatePageNested('headlines', 'bottomSponsor', 'meta', e.target.value)} placeholder="Meta / fine print" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                  </div>

                  {/* ===== TRENDING (sidebar) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🔥 Trending (sidebar numbered list)</h3>
                      <button type="button" onClick={() => addArr('trending', { title: 'புதிய தலைப்பு', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={hd.trendingHead || ''} onChange={(e) => upd('trendingHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px', fontWeight: '600' }} />
                    {(hd.trending || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <input type="text" value={t.title} onChange={(e) => updArr('trending', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={t.link || ''} onChange={(e) => updArr('trending', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => removeArr('trending', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== SIDE AD 1 ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Sidebar Ad 1 (300×250 Google)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={hd.sideAd1Label || ''} onChange={(e) => upd('sideAd1Label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={hd.sideAd1Size || ''} onChange={(e) => upd('sideAd1Size', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={hd.sideAd1Sub || ''} onChange={(e) => upd('sideAd1Sub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== NEWSLETTER (sidebar, flat fields) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>✉️ Newsletter (sidebar)</h3>
                    <input type="text" value={hd.newsletterHead || ''} onChange={(e) => upd('newsletterHead', e.target.value)} placeholder="Heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px', fontWeight: '600' }} />
                    <textarea rows="2" value={hd.newsletterCopy || ''} onChange={(e) => upd('newsletterCopy', e.target.value)} placeholder="Body copy" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={hd.newsletterPlaceholder || ''} onChange={(e) => upd('newsletterPlaceholder', e.target.value)} placeholder="Input placeholder" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 2 }} />
                      <input type="text" value={hd.newsletterButton || ''} onChange={(e) => upd('newsletterButton', e.target.value)} placeholder="Button text" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                    </div>
                  </div>

                  {/* ===== TOPICS CHIPS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🏷 Topics (sidebar chips)</h3>
                      <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, headlines: { ...prev.headlines, topics: [...(prev.headlines.topics || []), 'புதிய'] } }))} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={hd.topicsHead || ''} onChange={(e) => upd('topicsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px', fontWeight: '600' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px' }}>
                      {(hd.topics || []).map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: '4px' }}>
                          <input type="text" value={t} onChange={(e) => setPagesContent(prev => ({ ...prev, headlines: { ...prev.headlines, topics: (prev.headlines.topics || []).map((x, idx) => idx === i ? e.target.value : x) } }))} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                          <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, headlines: { ...prev.headlines, topics: (prev.headlines.topics || []).filter((_, idx) => idx !== i) } }))} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== SIDE AD 2 ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Sidebar Ad 2 (300×600 Meta half-page)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={hd.sideAd2Label || ''} onChange={(e) => upd('sideAd2Label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={hd.sideAd2Size || ''} onChange={(e) => upd('sideAd2Size', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={hd.sideAd2Sub || ''} onChange={(e) => upd('sideAd2Sub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== SIDEBAR SPONSOR ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🤝 Sidebar Sponsor Card (AARCADU style)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={hd.sidebarSponsor?.sub || ''} onChange={(e) => updatePageNested('headlines', 'sidebarSponsor', 'sub', e.target.value)} placeholder="Tag (SPONSORED)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={hd.sidebarSponsor?.label || ''} onChange={(e) => updatePageNested('headlines', 'sidebarSponsor', 'label', e.target.value)} placeholder="Brand (AARCADU)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={hd.sidebarSponsor?.placeholder || ''} onChange={(e) => updatePageNested('headlines', 'sidebarSponsor', 'placeholder', e.target.value)} placeholder="Image placeholder" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={hd.sidebarSponsor?.title || ''} onChange={(e) => updatePageNested('headlines', 'sidebarSponsor', 'title', e.target.value)} placeholder="Sponsor title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={hd.sidebarSponsor?.meta || ''} onChange={(e) => updatePageNested('headlines', 'sidebarSponsor', 'meta', e.target.value)} placeholder="Meta / details" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={hd.sidebarSponsor?.cta || ''} onChange={(e) => updatePageNested('headlines', 'sidebarSponsor', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                </div>
              );
            })()}

            {/* ===== CINEMA PAGE (dedicated comprehensive editor) ===== */}
            {activePage === 'cinema' && (() => {
              const cn = page;
              const updC = (field, val) => updatePage('cinema', field, val);
              const updCNested = (parent, field, val) => updatePageNested('cinema', parent, field, val);
              const updArrC = (arrField, i, field, val) => setPagesContent(prev => ({
                ...prev,
                cinema: { ...prev.cinema, [arrField]: (prev.cinema[arrField] || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addArrC = (arrField, newItem) => setPagesContent(prev => ({
                ...prev,
                cinema: { ...prev.cinema, [arrField]: [...(prev.cinema[arrField] || []), newItem] }
              }));
              const removeArrC = (arrField, i) => setPagesContent(prev => ({
                ...prev,
                cinema: { ...prev.cinema, [arrField]: (prev.cinema[arrField] || []).filter((_, idx) => idx !== i) }
              }));
              const imgUp = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };

              // Inline reusable image+upload+placeholder triple
              const ImgRow = ({ value, placeholder, onImg, onPlc }) => (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <input type="text" value={value || ''} onChange={(e) => onImg(e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                  <input type="text" value={placeholder || ''} onChange={(e) => onPlc(e.target.value)} placeholder="Placeholder text" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => onImg(url))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                  <label style={{ padding: '5px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => onImg(r))} />
                  </label>
                </div>
              );

              return (
                <div>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: '#92400E' }}>
                    🎬 <strong>Cinema page editor.</strong> All sections below render on <code>/cinema</code>. Each card supports image upload, placeholder text fallback, and custom link.
                  </div>
                  <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1E3A8A' }}>
                    📢 <strong>Ad slots are NOT edited here.</strong> Upload images for the <code>cinema-mid-ad</code> (970×90) and <code>cinema-sidebar</code> (300×600) ad boxes via{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#1E3A8A', textDecoration: 'underline', fontWeight: 700 }}>
                      Admin → Ad Manager → Per-Slot Ad Manager
                    </a>.
                  </div>

                  {/* ===== HEADER + STATS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Page Header + Stats</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Title</label>
                      <input type="text" value={cn.title || ''} onChange={(e) => updC('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Subtitle</label>
                      <textarea rows="2" value={cn.subtitle || ''} onChange={(e) => updC('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#374151' }}>2 Stats Strip</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {(cn.stats || []).map((s, i) => (
                        <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                          <input type="text" value={s.num} onChange={(e) => updArrC('stats', i, 'num', e.target.value)} placeholder="Number" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', marginBottom: '6px' }} />
                          <input type="text" value={s.label} onChange={(e) => updArrC('stats', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== FEATURED ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>⭐ Featured Card (dark hero with POLITICS pill)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" value={cn.featured?.cat || ''} onChange={(e) => updCNested('featured', 'cat', e.target.value)} placeholder="Category pill (POLITICS)" style={{ ...inputStyle, fontSize: '13px', flex: 1 }} />
                      <input type="text" value={cn.featured?.placeholder || ''} onChange={(e) => updCNested('featured', 'placeholder', e.target.value)} placeholder="Image placeholder text" style={{ ...inputStyle, fontSize: '13px', flex: 1 }} />
                    </div>
                    <ImgRow value={cn.featured?.img} placeholder={null} onImg={(v) => updCNested('featured', 'img', v)} onPlc={() => {}} />
                    <input type="text" value={cn.featured?.title || ''} onChange={(e) => updCNested('featured', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }} />
                    <textarea rows="3" value={cn.featured?.excerpt || ''} onChange={(e) => updCNested('featured', 'excerpt', e.target.value)} placeholder="Excerpt" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', marginBottom: '8px' }} />
                    <input type="text" value={cn.featured?.meta || ''} onChange={(e) => updCNested('featured', 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                    <input type="text" value={cn.featured?.link || ''} onChange={(e) => updCNested('featured', 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== TRENDING (sidebar) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>🔥 Trending (sidebar) — பிரபல சினிமா செய்திகள்</h3>
                      <button type="button" onClick={() => addArrC('trending', { title: 'புதிய', meta: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.trendingHead || ''} onChange={(e) => updC('trendingHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.trending || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <input type="text" value={t.title} onChange={(e) => updArrC('trending', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={t.meta || ''} onChange={(e) => updArrC('trending', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={t.link || ''} onChange={(e) => updArrC('trending', i, 'link', e.target.value)} placeholder="🔗" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => removeArrC('trending', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== NEWS GRID (4) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>📰 சினிமா செய்திகள் (4-card grid)</h3>
                      <button type="button" onClick={() => addArrC('news', { cat: 'சினிமா', img: '', placeholder: '', title: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.newsHead || ''} onChange={(e) => updC('newsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.news || []).map((n, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={n.cat} onChange={(e) => updArrC('news', i, 'cat', e.target.value)} placeholder="Cat" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrC('news', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={n.img} placeholder={n.placeholder} onImg={(v) => updArrC('news', i, 'img', v)} onPlc={(v) => updArrC('news', i, 'placeholder', v)} />
                        <input type="text" value={n.title} onChange={(e) => updArrC('news', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={n.meta} onChange={(e) => updArrC('news', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        <input type="text" value={n.link || ''} onChange={(e) => updArrC('news', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== REVIEWS (3) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>⭐ Movie Reviews (திரைப்பட விமர்சனங்கள்)</h3>
                      <button type="button" onClick={() => addArrC('reviews', { cat: 'விமர்சனம்', rating: 4, img: '', placeholder: '', title: '', verdict: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.reviewsHead || ''} onChange={(e) => updC('reviewsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.reviews || []).map((r, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={r.title} onChange={(e) => updArrC('reviews', i, 'title', e.target.value)} placeholder="Movie title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                          <select value={r.rating || 0} onChange={(e) => updArrC('reviews', i, 'rating', Number(e.target.value))} style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '70px' }}>
                            <option value="1">★</option>
                            <option value="2">★★</option>
                            <option value="3">★★★</option>
                            <option value="4">★★★★</option>
                            <option value="5">★★★★★</option>
                          </select>
                          <button type="button" onClick={() => removeArrC('reviews', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={r.img} placeholder={r.placeholder} onImg={(v) => updArrC('reviews', i, 'img', v)} onPlc={(v) => updArrC('reviews', i, 'placeholder', v)} />
                        <input type="text" value={r.verdict} onChange={(e) => updArrC('reviews', i, 'verdict', e.target.value)} placeholder="Verdict / short summary" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={r.meta} onChange={(e) => updArrC('reviews', i, 'meta', e.target.value)} placeholder="Reviewer name" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        <input type="text" value={r.link || ''} onChange={(e) => updArrC('reviews', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== POPULAR (6 avatars) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>👤 பிரபலம் இன்று (Circular avatars — 6 with role labels)</h3>
                      <button type="button" onClick={() => addArrC('popular', { name: '', role: '', desc: '', descLine2: '', img: '', placeholder: '', link: '', featured: false })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.popularHead || ''} onChange={(e) => updC('popularHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 12px 0' }}>
                      💡 Tip: tick <strong>★ Featured</strong> on one celebrity to highlight them with a red border and glow (only one should be featured at a time).
                    </p>
                    {(cn.popular || []).map((p, i) => (
                      <div key={i} style={{ padding: '12px', background: p.featured ? '#FEF2F2' : '#F9FAFB', borderRadius: '6px', border: p.featured ? '1px solid #FCA5A5' : '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={p.role || ''} onChange={(e) => updArrC('popular', i, 'role', e.target.value)} placeholder="Role (நடிகர் / நடிகை / இயக்குநர்)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '180px' }} />
                          <input type="text" value={p.name} onChange={(e) => updArrC('popular', i, 'name', e.target.value)} placeholder="Name" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <label style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '11px', color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap', padding: '4px 8px', background: p.featured ? '#FECACA' : '#fff', border: '1px solid ' + (p.featured ? '#EF4444' : '#E5E7EB'), borderRadius: '4px', fontWeight: '700' }}>
                            <input type="checkbox" checked={!!p.featured} onChange={(e) => updArrC('popular', i, 'featured', e.target.checked)} /> ★ Featured
                          </label>
                          <button type="button" onClick={() => removeArrC('popular', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={p.desc} onChange={(e) => updArrC('popular', i, 'desc', e.target.value)} placeholder="Description line 1 (e.g. Netflix தொடரில்)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={p.descLine2 || ''} onChange={(e) => updArrC('popular', i, 'descLine2', e.target.value)} placeholder="Description line 2 (e.g. இணைந்தார்)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        </div>
                        <ImgRow value={p.img} placeholder={p.placeholder} onImg={(v) => updArrC('popular', i, 'img', v)} onPlc={(v) => updArrC('popular', i, 'placeholder', v)} />
                        <input type="text" value={p.link || ''} onChange={(e) => updArrC('popular', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== SAMSUNG BANNER ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: '700' }}>📱 Samsung Promo Banner</h3>
                    <label style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                      <input type="checkbox" checked={cn.samsungBanner?.enabled !== false} onChange={(e) => updCNested('samsungBanner', 'enabled', e.target.checked)} /> Show this banner
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input type="text" value={cn.samsungBanner?.brand || ''} onChange={(e) => updCNested('samsungBanner', 'brand', e.target.value)} placeholder="Brand (Samsung)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.title || ''} onChange={(e) => updCNested('samsungBanner', 'title', e.target.value)} placeholder="Title (Galaxy S25...)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.subtitle || ''} onChange={(e) => updCNested('samsungBanner', 'subtitle', e.target.value)} placeholder="Subtitle (Limited Period Offer)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.copy || ''} onChange={(e) => updCNested('samsungBanner', 'copy', e.target.value)} placeholder="Copy (Own at ₹53999)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.ctaText || ''} onChange={(e) => updCNested('samsungBanner', 'ctaText', e.target.value)} placeholder="CTA Text (Own now)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.ctaHref || ''} onChange={(e) => updCNested('samsungBanner', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.tagline || ''} onChange={(e) => updCNested('samsungBanner', 'tagline', e.target.value)} placeholder="Tagline (No.1 SELLING...)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={cn.samsungBanner?.brandRight || ''} onChange={(e) => updCNested('samsungBanner', 'brandRight', e.target.value)} placeholder="Right brand (Flipkart)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                  </div>

                  {/* ===== VIDEO NEWS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>📹 Video News (வீடியோ செய்திகள்)</h3>
                      <button type="button" onClick={() => addArrC('videos', { title: '', img: '', placeholder: '', duration: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 12px 0' }}>
                      💡 Paste a <strong>YouTube URL</strong> in the Video URL field — the thumbnail will be auto-fetched from YouTube, and clicking the card on the live site plays the video in an inline modal. Image URL is optional (use it to override the auto-thumbnail).
                    </p>
                    <input type="text" value={cn.videoHead || ''} onChange={(e) => updC('videoHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.videos || []).map((v, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={v.title} onChange={(e) => updArrC('videos', i, 'title', e.target.value)} placeholder="Video title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                          <input type="text" value={v.duration || ''} onChange={(e) => updArrC('videos', i, 'duration', e.target.value)} placeholder="04:32" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '80px' }} />
                          <button type="button" onClick={() => removeArrC('videos', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <div style={{ marginBottom: '6px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' }}>▶ YouTube URL (or video ID)</label>
                          <input type="text" value={v.link || ''} onChange={(e) => updArrC('videos', i, 'link', e.target.value)} placeholder="https://www.youtube.com/watch?v=... or PDOg5PnSXYM" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                        </div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#6B7280', marginBottom: '4px' }}>🖼 Optional thumbnail override (leave blank to use YouTube's auto-thumbnail)</label>
                        <ImgRow value={v.img} placeholder={v.placeholder} onImg={(val) => updArrC('videos', i, 'img', val)} onPlc={(val) => updArrC('videos', i, 'placeholder', val)} />
                      </div>
                    ))}
                  </div>

                  {/* ===== BOX OFFICE ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>💰 Box Office Leaderboard</h3>
                      <button type="button" onClick={() => addArrC('boxOffice', { rank: '06', title: '', collection: '', meta: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.boxOfficeHead || ''} onChange={(e) => updC('boxOfficeHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.boxOffice || []).map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={b.rank} onChange={(e) => updArrC('boxOffice', i, 'rank', e.target.value)} placeholder="01" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '50px' }} />
                        <input type="text" value={b.title} onChange={(e) => updArrC('boxOffice', i, 'title', e.target.value)} placeholder="Movie title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                        <input type="text" value={b.collection} onChange={(e) => updArrC('boxOffice', i, 'collection', e.target.value)} placeholder="15ம் கோடி" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '100px' }} />
                        <input type="text" value={b.meta} onChange={(e) => updArrC('boxOffice', i, 'meta', e.target.value)} placeholder="Meta info" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <button type="button" onClick={() => removeArrC('boxOffice', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== PHOTO GALLERY ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>📸 Photo Gallery (புகைப்பட தொகுப்பு)</h3>
                      <button type="button" onClick={() => addArrC('photos', { caption: '', img: '', placeholder: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.photoHead || ''} onChange={(e) => updC('photoHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.photos || []).map((p, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={p.caption} onChange={(e) => updArrC('photos', i, 'caption', e.target.value)} placeholder="Caption" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrC('photos', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={p.img} placeholder={p.placeholder} onImg={(v) => updArrC('photos', i, 'img', v)} onPlc={(v) => updArrC('photos', i, 'placeholder', v)} />
                      </div>
                    ))}
                  </div>

                  {/* ===== OTT RELEASES (sidebar) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: '700' }}>📺 OTT Releases (sidebar)</h3>
                      <button type="button" onClick={() => addArrC('ottItems', { title: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={cn.ottHead || ''} onChange={(e) => updC('ottHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(cn.ottItems || []).map((o, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={o.title} onChange={(e) => updArrC('ottItems', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                        <input type="text" value={o.meta || ''} onChange={(e) => updArrC('ottItems', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <input type="text" value={o.link || ''} onChange={(e) => updArrC('ottItems', i, 'link', e.target.value)} placeholder="🔗" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <button type="button" onClick={() => removeArrC('ottItems', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== BOTTOM CTA ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: '700' }}>🤝 Bottom CTA (உங்கள் திரைப்பட விளம்பரங்கள்)</h3>
                    <input type="text" value={cn.bottomCta?.sponsored || ''} onChange={(e) => updCNested('bottomCta', 'sponsored', e.target.value)} placeholder="SPONSORED" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={cn.bottomCta?.title || ''} onChange={(e) => updCNested('bottomCta', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={cn.bottomCta?.subtitle || ''} onChange={(e) => updCNested('bottomCta', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={cn.bottomCta?.cta || ''} onChange={(e) => updCNested('bottomCta', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={cn.bottomCta?.ctaHref || ''} onChange={(e) => updCNested('bottomCta', 'ctaHref', e.target.value)} placeholder="CTA URL / mailto:..." style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ===== SPORTS PAGE (comprehensive editor) ===== */}
            {activePage === 'sports' && (() => {
              const sp = page;
              const updS = (field, val) => updatePage('sports', field, val);
              const updSNested = (parent, field, val) => updatePageNested('sports', parent, field, val);
              const updArrS = (arrField, i, field, val) => setPagesContent(prev => ({
                ...prev,
                sports: { ...prev.sports, [arrField]: (prev.sports[arrField] || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addArrS = (arrField, newItem) => setPagesContent(prev => ({
                ...prev,
                sports: { ...prev.sports, [arrField]: [...(prev.sports[arrField] || []), newItem] }
              }));
              const removeArrS = (arrField, i) => setPagesContent(prev => ({
                ...prev,
                sports: { ...prev.sports, [arrField]: (prev.sports[arrField] || []).filter((_, idx) => idx !== i) }
              }));
              const toggleSection = (key) => setPagesContent(prev => ({
                ...prev,
                sports: { ...prev.sports, sections: { ...(prev.sports.sections || {}), [key]: !(prev.sports.sections?.[key] !== false) } }
              }));
              const imgUp = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };
              const ImgRow = ({ value, placeholder, onImg, onPlc }) => (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <input type="text" value={value || ''} onChange={(e) => onImg(e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                  <input type="text" value={placeholder || ''} onChange={(e) => onPlc(e.target.value)} placeholder="Placeholder text" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => onImg(url))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                  <label style={{ padding: '5px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => onImg(r))} />
                  </label>
                </div>
              );

              // Section block wrapper with show/hide toggle
              const SectionBlock = ({ secKey, icon, title, children }) => {
                const isOn = sp.sections?.[secKey] !== false;
                return (
                  <div style={{ background: '#fff', padding: '20px 28px 24px', borderRadius: '16px', border: `1px solid ${isOn ? '#E5E7EB' : '#FCA5A5'}`, marginBottom: '20px', opacity: isOn ? 1 : 0.55 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOn ? '14px' : 0, paddingBottom: isOn ? '12px' : 0, borderBottom: isOn ? '1px solid #F3F4F6' : 'none' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>{icon} {title}</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isOn ? '#059669' : '#EF4444', fontWeight: '700', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={isOn} onChange={() => toggleSection(secKey)} style={{ cursor: 'pointer' }} />
                        {isOn ? 'SHOWN' : 'HIDDEN'}
                      </label>
                    </div>
                    {isOn && children}
                  </div>
                );
              };

              return (
                <div>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: '#92400E' }}>
                    ⚽ <strong>Sports page editor.</strong> Each section below can be <strong>SHOWN/HIDDEN</strong> via the toggle in its top-right corner. Hidden sections don't render on <code>/sports</code> but their content is preserved.
                  </div>
                  <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1E3A8A' }}>
                    📢 <strong>Ad slots</strong> (sports-mid-ad, sports-sidebar) are uploaded via{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#1E3A8A', textDecoration: 'underline', fontWeight: 700 }}>Admin → Ad Manager → Per-Slot Ad Manager</a>.
                  </div>

                  {/* HEADER (always visible) */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Page Header + Stats</h3>
                    <input type="text" value={sp.title || ''} onChange={(e) => updS('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700', marginBottom: '12px' }} placeholder="Title" />
                    <textarea rows="2" value={sp.subtitle || ''} onChange={(e) => updS('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical', marginBottom: '12px' }} placeholder="Subtitle" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {(sp.stats || []).map((s, i) => (
                        <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                          <input type="text" value={s.num} onChange={(e) => updArrS('stats', i, 'num', e.target.value)} placeholder="Number" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', marginBottom: '6px' }} />
                          <input type="text" value={s.label} onChange={(e) => updArrS('stats', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <SectionBlock secKey="filterTabs" icon="🏷" title="Filter Tabs (அனைத்தும், கிரிக்கெட், கால்பந்து...)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Tabs shown below page header. Check "Active" on the one that should be highlighted.</p>
                      <button type="button" onClick={() => addArrS('filterTabs', { label: 'புதிய', value: 'new', active: false })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Tab</button>
                    </div>
                    {(sp.filterTabs || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={t.label} onChange={(e) => updArrS('filterTabs', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6B7280', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!t.active} onChange={(e) => setPagesContent(prev => ({ ...prev, sports: { ...prev.sports, filterTabs: (prev.sports.filterTabs || []).map((x, idx) => idx === i ? { ...x, active: e.target.checked } : { ...x, active: false }) } }))} />
                          Active
                        </label>
                        <button type="button" onClick={() => removeArrS('filterTabs', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="featured" icon="⭐" title="Featured Hero (dramatic dark gradient with LIVE + Score box)">
                    <div style={{ background: '#FAFAF7', padding: '12px', borderRadius: '6px', border: '1px solid var(--rule)', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#374151', fontWeight: 700 }}>Top Pills (Category + LIVE)</h4>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input type="text" value={sp.featured?.cat || ''} onChange={(e) => updSNested('featured', 'cat', e.target.value)} placeholder="Category pill (கிரிக்கெட்)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!sp.featured?.live} onChange={(e) => updSNested('featured', 'live', e.target.checked)} />
                          Show LIVE indicator
                        </label>
                        <input type="text" value={sp.featured?.liveText || 'LIVE'} onChange={(e) => updSNested('featured', 'liveText', e.target.value)} placeholder="LIVE" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', width: '90px' }} />
                      </div>
                    </div>

                    <div style={{ background: '#FAFAF7', padding: '12px', borderRadius: '6px', border: '1px solid var(--rule)', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#374151', fontWeight: 700 }}>Score Box (top right — clear all fields to hide)</h4>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input type="text" value={sp.featured?.score1Label || ''} onChange={(e) => updSNested('featured', 'score1Label', e.target.value)} placeholder="Team 1 (TN)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={sp.featured?.score1 || ''} onChange={(e) => updSNested('featured', 'score1', e.target.value)} placeholder="Score 1 (342/6)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={sp.featured?.score2Label || ''} onChange={(e) => updSNested('featured', 'score2Label', e.target.value)} placeholder="Team 2 (MUM)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={sp.featured?.score2 || ''} onChange={(e) => updSNested('featured', 'score2', e.target.value)} placeholder="Score 2 (318/10)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      </div>
                    </div>

                    <div style={{ background: '#FAFAF7', padding: '12px', borderRadius: '6px', border: '1px solid var(--rule)', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#374151', fontWeight: 700 }}>🖼 Background Image (optional — adds photo behind gradient)</h4>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 8px 0' }}>Leave blank to use the dramatic green→red gradient by itself. Upload a stadium photo for a richer hero.</p>
                      <ImgRow value={sp.featured?.bgImage} placeholder={sp.featured?.placeholder} onImg={(v) => updSNested('featured', 'bgImage', v)} onPlc={(v) => updSNested('featured', 'placeholder', v)} />
                    </div>

                    <input type="text" value={sp.featured?.kicker || ''} onChange={(e) => updSNested('featured', 'kicker', e.target.value)} placeholder="Kicker (சிறப்பு அறிக்கை · கிரிக்கெட்)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={sp.featured?.title || ''} onChange={(e) => updSNested('featured', 'title', e.target.value)} placeholder="Big title" style={{ ...inputStyle, fontSize: '14px', fontWeight: 600, resize: 'vertical', marginBottom: '8px' }} />
                    <textarea rows="3" value={sp.featured?.excerpt || ''} onChange={(e) => updSNested('featured', 'excerpt', e.target.value)} placeholder="Excerpt paragraph" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={sp.featured?.meta || ''} onChange={(e) => updSNested('featured', 'meta', e.target.value)} placeholder="Meta line" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={sp.featured?.link || ''} onChange={(e) => updSNested('featured', 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                    </div>
                  </SectionBlock>

                  <SectionBlock secKey="trending" icon="🔥" title="Trending sidebar (நேரலை அப்டேட்ஸ்)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.trendingHead || ''} onChange={(e) => updS('trendingHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('trending', { title: '', meta: '', score: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.trending || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={t.title} onChange={(e) => updArrS('trending', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={t.meta || ''} onChange={(e) => updArrS('trending', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={t.score || ''} onChange={(e) => updArrS('trending', i, 'score', e.target.value)} placeholder="Score" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', width: '80px' }} />
                        <button type="button" onClick={() => removeArrS('trending', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="scoreboard" icon="🏏" title="Scoreboard (Live scores card)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.scoreboardHead || ''} onChange={(e) => updS('scoreboardHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('scoreboard', { match: '', score: '', meta: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.scoreboard || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={s.match} onChange={(e) => updArrS('scoreboard', i, 'match', e.target.value)} placeholder="Team / Match" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={s.score} onChange={(e) => updArrS('scoreboard', i, 'score', e.target.value)} placeholder="Score" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={s.meta} onChange={(e) => updArrS('scoreboard', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 2 }} />
                        <button type="button" onClick={() => removeArrS('scoreboard', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="midAd" icon="📢" title="Mid Ad (970×90)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle visibility only. Upload the actual image via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: 'var(--accent)', fontWeight: 700 }}>Ad Manager → Sports — Mid Leaderboard</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="newsGrid" icon="📰" title="News Grid (4 cards)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.newsHead || ''} onChange={(e) => updS('newsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('news', { cat: '', img: '', placeholder: '', title: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.news || []).map((n, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={n.cat} onChange={(e) => updArrS('news', i, 'cat', e.target.value)} placeholder="Cat" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrS('news', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={n.img} placeholder={n.placeholder} onImg={(v) => updArrS('news', i, 'img', v)} onPlc={(v) => updArrS('news', i, 'placeholder', v)} />
                        <input type="text" value={n.title} onChange={(e) => updArrS('news', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={n.meta} onChange={(e) => updArrS('news', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        <input type="text" value={n.link || ''} onChange={(e) => updArrS('news', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="cricket" icon="🏏" title="Cricket (Featured + Top 5 list)">
                    <input type="text" value={sp.cricketHead || ''} onChange={(e) => updS('cricketHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#374151' }}>Cricket Featured</h4>
                    <ImgRow value={sp.cricketFeatured?.img} placeholder={sp.cricketFeatured?.placeholder} onImg={(v) => updSNested('cricketFeatured', 'img', v)} onPlc={(v) => updSNested('cricketFeatured', 'placeholder', v)} />
                    <input type="text" value={sp.cricketFeatured?.title || ''} onChange={(e) => updSNested('cricketFeatured', 'title', e.target.value)} placeholder="Featured title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                    <input type="text" value={sp.cricketFeatured?.meta || ''} onChange={(e) => updSNested('cricketFeatured', 'meta', e.target.value)} placeholder="Featured meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '12px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '13px', margin: 0, color: '#374151' }}>Cricket Ranked List</h4>
                      <button type="button" onClick={() => addArrS('cricketList', { title: '', meta: '', link: '' })} style={{ padding: '4px 10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.cricketList || []).map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <input type="text" value={c.title} onChange={(e) => updArrS('cricketList', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={c.meta || ''} onChange={(e) => updArrS('cricketList', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => removeArrS('cricketList', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="samsungBanner" icon="📱" title="Samsung Promo Banner">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input type="text" value={sp.samsungBanner?.brand || ''} onChange={(e) => updSNested('samsungBanner', 'brand', e.target.value)} placeholder="Brand" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.title || ''} onChange={(e) => updSNested('samsungBanner', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.subtitle || ''} onChange={(e) => updSNested('samsungBanner', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.copy || ''} onChange={(e) => updSNested('samsungBanner', 'copy', e.target.value)} placeholder="Copy" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.ctaText || ''} onChange={(e) => updSNested('samsungBanner', 'ctaText', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.ctaHref || ''} onChange={(e) => updSNested('samsungBanner', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.tagline || ''} onChange={(e) => updSNested('samsungBanner', 'tagline', e.target.value)} placeholder="Tagline" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.samsungBanner?.brandRight || ''} onChange={(e) => updSNested('samsungBanner', 'brandRight', e.target.value)} placeholder="Right brand" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                  </SectionBlock>

                  <SectionBlock secKey="starPlayers" icon="🌟" title="Star Players (4 circular avatars)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.starPlayersHead || ''} onChange={(e) => updS('starPlayersHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('starPlayers', { name: '', desc: '', img: '', placeholder: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.starPlayers || []).map((p, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={p.name} onChange={(e) => updArrS('starPlayers', i, 'name', e.target.value)} placeholder="Name" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={p.desc} onChange={(e) => updArrS('starPlayers', i, 'desc', e.target.value)} placeholder="Role / desc" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrS('starPlayers', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={p.img} placeholder={p.placeholder} onImg={(v) => updArrS('starPlayers', i, 'img', v)} onPlc={(v) => updArrS('starPlayers', i, 'placeholder', v)} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="schedule" icon="📅" title="Match Schedule (போட்டி அட்டவணை)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.scheduleHead || ''} onChange={(e) => updS('scheduleHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('schedule', { date: '', match: '', meta: '', score: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.schedule || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={s.date} onChange={(e) => updArrS('schedule', i, 'date', e.target.value)} placeholder="Date" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '80px' }} />
                        <input type="text" value={s.match} onChange={(e) => updArrS('schedule', i, 'match', e.target.value)} placeholder="Match" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                        <input type="text" value={s.meta} onChange={(e) => updArrS('schedule', i, 'meta', e.target.value)} placeholder="Venue / chan" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <input type="text" value={s.score} onChange={(e) => updArrS('schedule', i, 'score', e.target.value)} placeholder="Time" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '90px' }} />
                        <button type="button" onClick={() => removeArrS('schedule', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="videos" icon="📹" title="Video Highlights (YouTube URLs auto-load thumbnails)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.videoHead || ''} onChange={(e) => updS('videoHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('videos', { title: '', img: '', placeholder: '', duration: '', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.videos || []).map((v, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <input type="text" value={v.title} onChange={(e) => updArrS('videos', i, 'title', e.target.value)} placeholder="Video title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                          <input type="text" value={v.duration || ''} onChange={(e) => updArrS('videos', i, 'duration', e.target.value)} placeholder="04:32" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '80px' }} />
                          <button type="button" onClick={() => removeArrS('videos', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>▶ YouTube URL</label>
                        <input type="text" value={v.link || ''} onChange={(e) => updArrS('videos', i, 'link', e.target.value)} placeholder="https://youtube.com/watch?v=..." style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <ImgRow value={v.img} placeholder={v.placeholder} onImg={(val) => updArrS('videos', i, 'img', val)} onPlc={(val) => updArrS('videos', i, 'placeholder', val)} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="stats" icon="📊" title="Statistics Table">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.statsHead || ''} onChange={(e) => updS('statsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('statsItems', { num: '06', label: '', value: '', meta: '', change: '+0' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.statsItems || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={s.num} onChange={(e) => updArrS('statsItems', i, 'num', e.target.value)} placeholder="01" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '50px' }} />
                        <input type="text" value={s.label} onChange={(e) => updArrS('statsItems', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                        <input type="text" value={s.value} onChange={(e) => updArrS('statsItems', i, 'value', e.target.value)} placeholder="247" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '80px' }} />
                        <input type="text" value={s.meta} onChange={(e) => updArrS('statsItems', i, 'meta', e.target.value)} placeholder="Period" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <input type="text" value={s.change} onChange={(e) => updArrS('statsItems', i, 'change', e.target.value)} placeholder="+10" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '60px' }} />
                        <button type="button" onClick={() => removeArrS('statsItems', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="photos" icon="📸" title="Sports Photos">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={sp.photosHead || ''} onChange={(e) => updS('photosHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrS('photos', { caption: '', img: '', placeholder: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(sp.photos || []).map((p, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={p.caption} onChange={(e) => updArrS('photos', i, 'caption', e.target.value)} placeholder="Caption" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrS('photos', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={p.img} placeholder={p.placeholder} onImg={(v) => updArrS('photos', i, 'img', v)} onPlc={(v) => updArrS('photos', i, 'placeholder', v)} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="sidebarAd" icon="📢" title="Sidebar Ad (300×600)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle visibility only. Upload image via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: 'var(--accent)', fontWeight: 700 }}>Ad Manager → Sports — Sidebar Half-Page</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="bottomCta" icon="🤝" title="Bottom CTA">
                    <input type="text" value={sp.bottomCta?.sponsored || ''} onChange={(e) => updSNested('bottomCta', 'sponsored', e.target.value)} placeholder="SPONSORED" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={sp.bottomCta?.title || ''} onChange={(e) => updSNested('bottomCta', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={sp.bottomCta?.subtitle || ''} onChange={(e) => updSNested('bottomCta', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={sp.bottomCta?.cta || ''} onChange={(e) => updSNested('bottomCta', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={sp.bottomCta?.ctaHref || ''} onChange={(e) => updSNested('bottomCta', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </SectionBlock>
                </div>
              );
            })()}

            {/* ===== BEAUTY PAGE (comprehensive editor with section toggles) ===== */}
            {activePage === 'beauty' && (() => {
              const by = page;
              const updB = (field, val) => updatePage('beauty', field, val);
              const updBNested = (parent, field, val) => updatePageNested('beauty', parent, field, val);
              const updArrB = (arrField, i, field, val) => setPagesContent(prev => ({
                ...prev,
                beauty: { ...prev.beauty, [arrField]: (prev.beauty[arrField] || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addArrB = (arrField, newItem) => setPagesContent(prev => ({
                ...prev,
                beauty: { ...prev.beauty, [arrField]: [...(prev.beauty[arrField] || []), newItem] }
              }));
              const removeArrB = (arrField, i) => setPagesContent(prev => ({
                ...prev,
                beauty: { ...prev.beauty, [arrField]: (prev.beauty[arrField] || []).filter((_, idx) => idx !== i) }
              }));
              const toggleBSection = (key) => setPagesContent(prev => ({
                ...prev,
                beauty: { ...prev.beauty, sections: { ...(prev.beauty.sections || {}), [key]: !(prev.beauty.sections?.[key] !== false) } }
              }));
              const imgUp = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };
              const ImgRow = ({ value, placeholder, onImg, onPlc }) => (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <input type="text" value={value || ''} onChange={(e) => onImg(e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                  <input type="text" value={placeholder || ''} onChange={(e) => onPlc(e.target.value)} placeholder="Placeholder" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => onImg(url))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                  <label style={{ padding: '5px 10px', background: '#F472B6', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => onImg(r))} />
                  </label>
                </div>
              );
              const SectionBlock = ({ secKey, icon, title, children }) => {
                const isOn = by.sections?.[secKey] !== false;
                return (
                  <div style={{ background: '#fff', padding: '20px 28px 24px', borderRadius: '16px', border: `1px solid ${isOn ? '#FBCFE8' : '#FCA5A5'}`, marginBottom: '20px', opacity: isOn ? 1 : 0.55 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOn ? '14px' : 0, paddingBottom: isOn ? '12px' : 0, borderBottom: isOn ? '1px solid #FDF2F8' : 'none' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>{icon} {title}</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isOn ? '#059669' : '#EF4444', fontWeight: '700', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isOn} onChange={() => toggleBSection(secKey)} />
                        {isOn ? 'SHOWN' : 'HIDDEN'}
                      </label>
                    </div>
                    {isOn && children}
                  </div>
                );
              };

              return (
                <div>
                  <div style={{ background: '#FCE7F3', border: '1px solid #F9A8D4', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: '#9D174D' }}>
                    🌸 <strong>Beauty page editor.</strong> Each section can be SHOWN/HIDDEN via the toggle. Hidden sections preserve content.
                  </div>
                  <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1E3A8A' }}>
                    📢 <strong>Ad slots</strong> (beauty-mid-ad, beauty-sidebar-1, beauty-sidebar-2, beauty-meta-ad) uploaded via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#1E3A8A', textDecoration: 'underline', fontWeight: 700 }}>Ad Manager → Per-Slot Ad Manager</a>.
                  </div>

                  {/* HEADER (always shown) */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #FBCFE8', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🌸 Page Header</h3>
                    <input type="text" value={by.title || ''} onChange={(e) => updB('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700', marginBottom: '12px' }} placeholder="Title" />
                    <textarea rows="2" value={by.subtitle || ''} onChange={(e) => updB('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Subtitle" />
                  </div>

                  <SectionBlock secKey="featured" icon="⭐" title="Featured Hero (pink split layout)">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" value={by.featured?.cat || ''} onChange={(e) => updBNested('featured', 'cat', e.target.value)} placeholder="Category pill" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={by.featured?.kicker || ''} onChange={(e) => updBNested('featured', 'kicker', e.target.value)} placeholder="Kicker" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <ImgRow value={by.featured?.bgImage} placeholder={by.featured?.placeholder} onImg={(v) => updBNested('featured', 'bgImage', v)} onPlc={(v) => updBNested('featured', 'placeholder', v)} />
                    <textarea rows="2" value={by.featured?.title || ''} onChange={(e) => updBNested('featured', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '14px', fontWeight: 600, resize: 'vertical', marginBottom: '8px' }} />
                    <textarea rows="3" value={by.featured?.excerpt || ''} onChange={(e) => updBNested('featured', 'excerpt', e.target.value)} placeholder="Excerpt" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={by.featured?.meta || ''} onChange={(e) => updBNested('featured', 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={by.featured?.link || ''} onChange={(e) => updBNested('featured', 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                    </div>
                  </SectionBlock>

                  <SectionBlock secKey="trending" icon="🔥" title="Trending Sidebar (5 items)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={by.trendingHead || ''} onChange={(e) => updB('trendingHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrB('trending', { title: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(by.trending || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={t.title} onChange={(e) => updArrB('trending', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={t.meta || ''} onChange={(e) => updArrB('trending', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={t.link || ''} onChange={(e) => updArrB('trending', i, 'link', e.target.value)} placeholder="🔗" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => removeArrB('trending', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="midAd" icon="📢" title="Mid Ad (970×90 Google)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle only. Upload via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#F472B6', fontWeight: 700 }}>Ad Manager → Beauty — Mid Leaderboard</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="newsGrid" icon="🌿" title="News Grid (8-card with icons)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={by.newsHead || ''} onChange={(e) => updB('newsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrB('news', { cat: '', icon: '🌸', img: '', placeholder: '', title: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(by.news || []).map((n, i) => (
                      <div key={i} style={{ padding: '10px', background: '#FDF2F8', borderRadius: '6px', border: '1px solid #FBCFE8', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={n.cat} onChange={(e) => updArrB('news', i, 'cat', e.target.value)} placeholder="Cat" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={n.icon || ''} onChange={(e) => updArrB('news', i, 'icon', e.target.value)} placeholder="🌸 emoji" style={{ ...inputStyle, fontSize: '13px', padding: '5px 8px', width: '70px', textAlign: 'center' }} />
                          <button type="button" onClick={() => removeArrB('news', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <ImgRow value={n.img} placeholder={n.placeholder} onImg={(v) => updArrB('news', i, 'img', v)} onPlc={(v) => updArrB('news', i, 'placeholder', v)} />
                        <input type="text" value={n.title} onChange={(e) => updArrB('news', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={n.meta} onChange={(e) => updArrB('news', i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        <input type="text" value={n.link || ''} onChange={(e) => updArrB('news', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="sidebarAd1" icon="📢" title="Sidebar Ad 1 (300×250 Google)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle only. Upload via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#F472B6', fontWeight: 700 }}>Ad Manager → Beauty — Sidebar 1</a>.</p>
                  </SectionBlock>

                  {[
                    { key: 'skincare', icon: '🌸', title: 'Skincare (3 cards)', arrName: 'skincare', headField: 'skincareHead', moreField: 'skincareMore' },
                    { key: 'haircare', icon: '🌷', title: 'Hair Care (3 cards)', arrName: 'haircare', headField: 'haircareHead', moreField: 'haircareMore' },
                    { key: 'makeup', icon: '💄', title: 'Makeup & Fashion (4 cards)', arrName: 'makeup', headField: 'makeupHead', moreField: 'makeupMore' }
                  ].map(({ key, icon, title, arrName, headField, moreField }) => (
                    <SectionBlock key={key} secKey={key} icon={icon} title={title}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input type="text" value={by[headField] || ''} onChange={(e) => updB(headField, e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 2 }} />
                        <input type="text" value={by[moreField] || ''} onChange={(e) => updB(moreField, e.target.value)} placeholder="More link text" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                        <button type="button" onClick={() => addArrB(arrName, { title: '', img: '', placeholder: '', meta: '', link: '' })} style={{ padding: '6px 12px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                      </div>
                      {(by[arrName] || []).map((s, i) => (
                        <div key={i} style={{ padding: '10px', background: '#FDF2F8', borderRadius: '6px', border: '1px solid #FBCFE8', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                            <button type="button" onClick={() => removeArrB(arrName, i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                          </div>
                          <ImgRow value={s.img} placeholder={s.placeholder} onImg={(v) => updArrB(arrName, i, 'img', v)} onPlc={(v) => updArrB(arrName, i, 'placeholder', v)} />
                          <input type="text" value={s.title} onChange={(e) => updArrB(arrName, i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                          <input type="text" value={s.meta} onChange={(e) => updArrB(arrName, i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                          <input type="text" value={s.link || ''} onChange={(e) => updArrB(arrName, i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                        </div>
                      ))}
                    </SectionBlock>
                  ))}

                  <SectionBlock secKey="sidebarAd2" icon="📢" title="Sidebar Ad 2 (300×600 Google)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle only. Upload via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#F472B6', fontWeight: 700 }}>Ad Manager → Beauty — Sidebar 2</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="metaAd" icon="📢" title="Meta Audience Ad (728×120)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle only. Upload via Ad Manager → Beauty — Meta Strip.</p>
                  </SectionBlock>

                  <SectionBlock secKey="naturalTips" icon="🌱" title="Natural Tips (6-card numbered grid)">
                    <input type="text" value={by.naturalTipsHead || ''} onChange={(e) => updB('naturalTipsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={by.naturalTipsSub || ''} onChange={(e) => updB('naturalTipsSub', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                      <button type="button" onClick={() => addArrB('naturalTips', { num: '07', title: '', desc: '' })} style={{ padding: '6px 12px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(by.naturalTips || []).map((t, i) => (
                      <div key={i} style={{ padding: '10px', background: '#FDF2F8', borderRadius: '6px', border: '1px solid #FBCFE8', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                          <input type="text" value={t.num} onChange={(e) => updArrB('naturalTips', i, 'num', e.target.value)} placeholder="01" style={{ ...inputStyle, fontSize: '14px', padding: '5px 8px', width: '60px', textAlign: 'center', fontWeight: 700 }} />
                          <input type="text" value={t.title} onChange={(e) => updArrB('naturalTips', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrB('naturalTips', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <textarea rows="2" value={t.desc} onChange={(e) => updArrB('naturalTips', i, 'desc', e.target.value)} placeholder="Description" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical' }} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="videos" icon="📹" title="Video Tips (YouTube)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={by.videoHead || ''} onChange={(e) => updB('videoHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrB('videos', { title: '', img: '', placeholder: '', duration: '', link: '' })} style={{ padding: '6px 12px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(by.videos || []).map((v, i) => (
                      <div key={i} style={{ padding: '12px', background: '#FDF2F8', borderRadius: '6px', border: '1px solid #FBCFE8', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <input type="text" value={v.title} onChange={(e) => updArrB('videos', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                          <input type="text" value={v.duration || ''} onChange={(e) => updArrB('videos', i, 'duration', e.target.value)} placeholder="04:32" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '80px' }} />
                          <button type="button" onClick={() => removeArrB('videos', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#F472B6', marginBottom: '4px' }}>▶ YouTube URL</label>
                        <input type="text" value={v.link || ''} onChange={(e) => updArrB('videos', i, 'link', e.target.value)} placeholder="https://youtube.com/..." style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <ImgRow value={v.img} placeholder={v.placeholder} onImg={(val) => updArrB('videos', i, 'img', val)} onPlc={(val) => updArrB('videos', i, 'placeholder', val)} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="beforeAfter" icon="✨" title="Before & After (Transformation cards)">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <input type="text" value={by.beforeAfterHead || ''} onChange={(e) => updB('beforeAfterHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1, marginRight: '8px' }} />
                      <button type="button" onClick={() => addArrB('beforeAfter', { title: '', beforeImg: '', afterImg: '', placeholder: '' })} style={{ padding: '6px 12px', background: '#F472B6', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(by.beforeAfter || []).map((b, i) => (
                      <div key={i} style={{ padding: '10px', background: '#FDF2F8', borderRadius: '6px', border: '1px solid #FBCFE8', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input type="text" value={b.title} onChange={(e) => updArrB('beforeAfter', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrB('beforeAfter', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280' }}>BEFORE image</label>
                        <ImgRow value={b.beforeImg} placeholder={b.placeholder} onImg={(v) => updArrB('beforeAfter', i, 'beforeImg', v)} onPlc={(v) => updArrB('beforeAfter', i, 'placeholder', v)} />
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#F472B6' }}>AFTER image</label>
                        <ImgRow value={b.afterImg} placeholder={b.placeholder} onImg={(v) => updArrB('beforeAfter', i, 'afterImg', v)} onPlc={(v) => updArrB('beforeAfter', i, 'placeholder', v)} />
                      </div>
                    ))}
                  </SectionBlock>

                  <SectionBlock secKey="womensWellness" icon="💗" title="Women's Wellness Banner (full-width split)">
                    <input type="text" value={by.womensWellnessHead || ''} onChange={(e) => updB('womensWellnessHead', e.target.value)} placeholder="Section header (kicker)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <ImgRow value={by.womensWellness?.img} placeholder={by.womensWellness?.placeholder} onImg={(v) => updBNested('womensWellness', 'img', v)} onPlc={(v) => updBNested('womensWellness', 'placeholder', v)} />
                    <textarea rows="2" value={by.womensWellness?.title || ''} onChange={(e) => updBNested('womensWellness', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '14px', fontWeight: 600, resize: 'vertical', marginBottom: '8px' }} />
                    <textarea rows="2" value={by.womensWellness?.copy || ''} onChange={(e) => updBNested('womensWellness', 'copy', e.target.value)} placeholder="Copy" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={by.womensWellness?.ctaText || ''} onChange={(e) => updBNested('womensWellness', 'ctaText', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={by.womensWellness?.ctaHref || ''} onChange={(e) => updBNested('womensWellness', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </SectionBlock>

                  <SectionBlock secKey="bottomCta" icon="🤝" title="Bottom CTA">
                    <input type="text" value={by.bottomCta?.sponsored || ''} onChange={(e) => updBNested('bottomCta', 'sponsored', e.target.value)} placeholder="SPONSORED" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={by.bottomCta?.title || ''} onChange={(e) => updBNested('bottomCta', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={by.bottomCta?.subtitle || ''} onChange={(e) => updBNested('bottomCta', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={by.bottomCta?.cta || ''} onChange={(e) => updBNested('bottomCta', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={by.bottomCta?.ctaHref || ''} onChange={(e) => updBNested('bottomCta', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </SectionBlock>
                </div>
              );
            })()}

            {/* ===== COOKING PAGE (comprehensive editor with section toggles) ===== */}
            {activePage === 'cooking' && (() => {
              const ck = page;
              const updK = (field, val) => updatePage('cooking', field, val);
              const updKNested = (parent, field, val) => updatePageNested('cooking', parent, field, val);
              const updArrK = (arrField, i, field, val) => setPagesContent(prev => ({
                ...prev,
                cooking: { ...prev.cooking, [arrField]: (prev.cooking[arrField] || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addArrK = (arrField, newItem) => setPagesContent(prev => ({
                ...prev,
                cooking: { ...prev.cooking, [arrField]: [...(prev.cooking[arrField] || []), newItem] }
              }));
              const removeArrK = (arrField, i) => setPagesContent(prev => ({
                ...prev,
                cooking: { ...prev.cooking, [arrField]: (prev.cooking[arrField] || []).filter((_, idx) => idx !== i) }
              }));
              const toggleKSection = (key) => setPagesContent(prev => ({
                ...prev,
                cooking: { ...prev.cooking, sections: { ...(prev.cooking.sections || {}), [key]: !(prev.cooking.sections?.[key] !== false) } }
              }));
              const imgUp = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };
              const ImgRow = ({ value, placeholder, onImg, onPlc }) => (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <input type="text" value={value || ''} onChange={(e) => onImg(e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                  <input type="text" value={placeholder || ''} onChange={(e) => onPlc(e.target.value)} placeholder="Placeholder" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                  <button type="button" onClick={() => openMediaPicker((url) => onImg(url))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                  <label style={{ padding: '5px 10px', background: '#F97316', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => onImg(r))} />
                  </label>
                </div>
              );
              const SectionBlock = ({ secKey, icon, title, children }) => {
                const isOn = ck.sections?.[secKey] !== false;
                return (
                  <div style={{ background: '#fff', padding: '20px 28px 24px', borderRadius: '16px', border: `1px solid ${isOn ? '#FED7AA' : '#FCA5A5'}`, marginBottom: '20px', opacity: isOn ? 1 : 0.55 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOn ? '14px' : 0, paddingBottom: isOn ? '12px' : 0, borderBottom: isOn ? '1px solid #FFF8F0' : 'none' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>{icon} {title}</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isOn ? '#059669' : '#EF4444', fontWeight: '700', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isOn} onChange={() => toggleKSection(secKey)} />
                        {isOn ? 'SHOWN' : 'HIDDEN'}
                      </label>
                    </div>
                    {isOn && children}
                  </div>
                );
              };
              const ArrayCardEditor = ({ arrName, fields, addTemplate }) => (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <button type="button" onClick={() => addArrK(arrName, addTemplate)} style={{ padding: '6px 12px', background: '#F97316', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                  </div>
                  {(ck[arrName] || []).map((item, i) => (
                    <div key={i} style={{ padding: '10px', background: '#FFF8F0', borderRadius: '6px', border: '1px solid #FED7AA', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                        <button type="button" onClick={() => removeArrK(arrName, i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                      {item.img !== undefined && <ImgRow value={item.img} placeholder={item.placeholder} onImg={(v) => updArrK(arrName, i, 'img', v)} onPlc={(v) => updArrK(arrName, i, 'placeholder', v)} />}
                      {fields.map(f => (
                        f.type === 'textarea' ? (
                          <textarea key={f.key} rows={f.rows || 2} value={item[f.key] || ''} onChange={(e) => updArrK(arrName, i, f.key, e.target.value)} placeholder={f.placeholder} style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '6px' }} />
                        ) : (
                          <input key={f.key} type="text" value={item[f.key] || ''} onChange={(e) => updArrK(arrName, i, f.key, e.target.value)} placeholder={f.placeholder} style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        )
                      ))}
                    </div>
                  ))}
                </>
              );

              return (
                <div>
                  <div style={{ background: '#FED7AA', border: '1px solid #FB923C', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: '#7C2D12' }}>
                    🍳 <strong>Cooking page editor.</strong> Each section can be SHOWN/HIDDEN via toggle. Orange theme throughout.
                  </div>
                  <div style={{ background: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1E3A8A' }}>
                    📢 <strong>Ad slots</strong> (cooking-mid-ad, cooking-sidebar-1, cooking-sidebar-2, cooking-meta-ad) uploaded via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#1E3A8A', textDecoration: 'underline', fontWeight: 700 }}>Ad Manager → Per-Slot Ad Manager</a>.
                  </div>

                  {/* HEADER */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #FED7AA', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🍳 Page Header</h3>
                    <input type="text" value={ck.title || ''} onChange={(e) => updK('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700', marginBottom: '12px' }} placeholder="Title" />
                    <textarea rows="2" value={ck.subtitle || ''} onChange={(e) => updK('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Subtitle" />
                  </div>

                  <SectionBlock secKey="filterTabs" icon="🏷" title="Filter Tabs (click to scroll to section)">
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 10px 0' }}>
                      💡 The <strong>Target</strong> field tells the tab which section to scroll to when clicked. Valid values: <code>top</code>, <code>sec-traditional</code>, <code>sec-breakfast</code>, <code>sec-lunch</code>, <code>sec-recipes</code>, <code>sec-sweets</code>, <code>sec-healthy</code>, <code>sec-videos</code>, <code>sec-gallery</code>.
                    </p>
                    <ArrayCardEditor
                      arrName="filterTabs"
                      addTemplate={{ label: 'புதிய', value: 'new', target: 'top', active: false }}
                      fields={[
                        { key: 'label', placeholder: 'Label (shown on tab)' },
                        { key: 'value', placeholder: 'Value (internal id)' },
                        { key: 'target', placeholder: 'Target section id (sec-breakfast)' }
                      ]}
                    />
                  </SectionBlock>

                  <SectionBlock secKey="featured" icon="⭐" title="Featured (orange gradient hero)">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" value={ck.featured?.cat || ''} onChange={(e) => updKNested('featured', 'cat', e.target.value)} placeholder="Category pill" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={ck.featured?.kicker || ''} onChange={(e) => updKNested('featured', 'kicker', e.target.value)} placeholder="Kicker" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <ImgRow value={ck.featured?.bgImage} placeholder={ck.featured?.placeholder} onImg={(v) => updKNested('featured', 'bgImage', v)} onPlc={(v) => updKNested('featured', 'placeholder', v)} />
                    <textarea rows="2" value={ck.featured?.title || ''} onChange={(e) => updKNested('featured', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '14px', fontWeight: 600, resize: 'vertical', marginBottom: '8px' }} />
                    <textarea rows="3" value={ck.featured?.excerpt || ''} onChange={(e) => updKNested('featured', 'excerpt', e.target.value)} placeholder="Excerpt" style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={ck.featured?.meta || ''} onChange={(e) => updKNested('featured', 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={ck.featured?.link || ''} onChange={(e) => updKNested('featured', 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                    </div>
                  </SectionBlock>

                  <SectionBlock secKey="trending" icon="🔥" title="Trending Sidebar (5 items)">
                    <input type="text" value={ck.trendingHead || ''} onChange={(e) => updK('trendingHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <ArrayCardEditor arrName="trending" addTemplate={{ title: '', meta: '', link: '' }} fields={[{ key: 'title', placeholder: 'Title' }, { key: 'meta', placeholder: 'Meta' }, { key: 'link', placeholder: '🔗 Link' }]} />
                  </SectionBlock>

                  <SectionBlock secKey="midAd" icon="📢" title="Mid Ad (970×90)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle only. Upload via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#F97316', fontWeight: 700 }}>Ad Manager → Cooking — Mid Leaderboard</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="recipesGrid" icon="🍲" title="Recipes Grid (8 cards with emoji icons)">
                    <input type="text" value={ck.recipesHead || ''} onChange={(e) => updK('recipesHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <ArrayCardEditor arrName="recipes" addTemplate={{ cat: '', icon: '🍳', img: '', placeholder: '', title: '', meta: '', link: '' }} fields={[{ key: 'cat', placeholder: 'Cat' }, { key: 'icon', placeholder: '🍳 emoji' }, { key: 'title', placeholder: 'Title' }, { key: 'meta', placeholder: 'Meta' }, { key: 'link', placeholder: '🔗 Link' }]} />
                  </SectionBlock>

                  <SectionBlock secKey="sidebarAd1" icon="📢" title="Sidebar Ad 1 (300×250)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Upload via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#F97316', fontWeight: 700 }}>Ad Manager → Cooking — Sidebar 1</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="traditional" icon="🏺" title="Traditional Cooking (featured + 2 cards)">
                    <input type="text" value={ck.traditionalHead || ''} onChange={(e) => updK('traditionalHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#374151' }}>Featured</h4>
                    <ImgRow value={ck.traditionalFeatured?.img} placeholder={ck.traditionalFeatured?.placeholder} onImg={(v) => updKNested('traditionalFeatured', 'img', v)} onPlc={(v) => updKNested('traditionalFeatured', 'placeholder', v)} />
                    <input type="text" value={ck.traditionalFeatured?.title || ''} onChange={(e) => updKNested('traditionalFeatured', 'title', e.target.value)} placeholder="Featured title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                    <input type="text" value={ck.traditionalFeatured?.meta || ''} onChange={(e) => updKNested('traditionalFeatured', 'meta', e.target.value)} placeholder="Featured meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '13px', margin: '12px 0 8px 0', color: '#374151' }}>Side List</h4>
                    <ArrayCardEditor arrName="traditionalList" addTemplate={{ title: '', img: '', placeholder: '', meta: '', link: '' }} fields={[{ key: 'title', placeholder: 'Title' }, { key: 'meta', placeholder: 'Meta' }, { key: 'link', placeholder: '🔗 Link' }]} />
                  </SectionBlock>

                  {[
                    { key: 'breakfast', icon: '🌅', title: 'Breakfast (3 cards)', arrName: 'breakfast', headField: 'breakfastHead', moreField: 'breakfastMore' },
                    { key: 'lunch', icon: '🍚', title: 'Lunch & Dinner (3 cards)', arrName: 'lunch', headField: 'lunchHead', moreField: 'lunchMore' },
                    { key: 'sweets', icon: '🍮', title: 'Sweets & Snacks (4 cards)', arrName: 'sweets', headField: 'sweetsHead', moreField: 'sweetsMore' }
                  ].map(({ key, icon, title, arrName, headField, moreField }) => (
                    <SectionBlock key={key} secKey={key} icon={icon} title={title}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input type="text" value={ck[headField] || ''} onChange={(e) => updK(headField, e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 2 }} />
                        <input type="text" value={ck[moreField] || ''} onChange={(e) => updK(moreField, e.target.value)} placeholder="More text" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                      </div>
                      <ArrayCardEditor arrName={arrName} addTemplate={{ title: '', img: '', placeholder: '', meta: '', link: '' }} fields={[{ key: 'title', placeholder: 'Title' }, { key: 'meta', placeholder: 'Meta' }, { key: 'link', placeholder: '🔗 Link' }]} />
                    </SectionBlock>
                  ))}

                  <SectionBlock secKey="sidebarAd2" icon="📢" title="Sidebar Ad 2 (300×600)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Upload via <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('ads'); }} style={{ color: '#F97316', fontWeight: 700 }}>Ad Manager → Cooking — Sidebar 2</a>.</p>
                  </SectionBlock>

                  <SectionBlock secKey="metaAd" icon="📢" title="Meta Audience Ad (728×120)">
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Toggle only. Upload via Ad Manager → Cooking — Meta Strip.</p>
                  </SectionBlock>

                  <SectionBlock secKey="healthy" icon="🥗" title="Healthy Foods (3 icon cards)">
                    <input type="text" value={ck.healthyHead || ''} onChange={(e) => updK('healthyHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <ArrayCardEditor arrName="healthy" addTemplate={{ icon: '🥗', title: '', desc: '', link: '' }} fields={[{ key: 'icon', placeholder: '🥗 emoji' }, { key: 'title', placeholder: 'Title' }, { key: 'desc', placeholder: 'Description' }]} />
                  </SectionBlock>

                  <SectionBlock secKey="videos" icon="📹" title="Video Recipes (YouTube)">
                    <input type="text" value={ck.videoHead || ''} onChange={(e) => updK('videoHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 10px 0' }}>💡 Paste a YouTube URL — thumbnail auto-loads, video plays inline on click.</p>
                    <ArrayCardEditor arrName="videos" addTemplate={{ title: '', img: '', placeholder: '', duration: '', link: '' }} fields={[{ key: 'title', placeholder: 'Title' }, { key: 'duration', placeholder: 'Duration (12:45)' }, { key: 'link', placeholder: '▶ YouTube URL' }]} />
                  </SectionBlock>

                  <SectionBlock secKey="stepByStep" icon="📖" title="Step-by-Step Recipe (with image)">
                    <input type="text" value={ck.stepByStepHead || ''} onChange={(e) => updK('stepByStepHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={ck.stepByStepRecipe || ''} onChange={(e) => updK('stepByStepRecipe', e.target.value)} placeholder="Recipe name (shown in left card)" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px', fontWeight: 700 }} />
                    <ImgRow value={ck.stepByStepImage} placeholder={ck.stepByStepPlaceholder} onImg={(v) => updK('stepByStepImage', v)} onPlc={(v) => updK('stepByStepPlaceholder', v)} />
                    <h4 style={{ fontSize: '13px', margin: '12px 0 8px 0', color: '#374151' }}>Steps</h4>
                    <ArrayCardEditor arrName="stepByStep" addTemplate={{ num: '07', title: '', desc: '' }} fields={[{ key: 'num', placeholder: '01' }, { key: 'title', placeholder: 'Step title' }, { key: 'desc', placeholder: 'Step description', type: 'textarea', rows: 2 }]} />
                  </SectionBlock>

                  <SectionBlock secKey="gallery" icon="📸" title="Food Gallery (4 cards)">
                    <input type="text" value={ck.galleryHead || ''} onChange={(e) => updK('galleryHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    <ArrayCardEditor arrName="gallery" addTemplate={{ img: '', placeholder: '', caption: '' }} fields={[{ key: 'caption', placeholder: 'Caption' }]} />
                  </SectionBlock>

                  <SectionBlock secKey="bottomCta" icon="🤝" title="Bottom CTA">
                    <input type="text" value={ck.bottomCta?.sponsored || ''} onChange={(e) => updKNested('bottomCta', 'sponsored', e.target.value)} placeholder="SPONSORED" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={ck.bottomCta?.title || ''} onChange={(e) => updKNested('bottomCta', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={ck.bottomCta?.subtitle || ''} onChange={(e) => updKNested('bottomCta', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={ck.bottomCta?.cta || ''} onChange={(e) => updKNested('bottomCta', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={ck.bottomCta?.ctaHref || ''} onChange={(e) => updKNested('bottomCta', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </SectionBlock>
                </div>
              );
            })()}

            {/* ===== GENERIC FALLBACK (none currently — all category pages have dedicated editors) ===== */}
            {false && (
              <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>📰 {pageList.find(p => p.id === activePage)?.label}</h3>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>The grid below the featured article is auto-populated from articles you publish in this category.</p>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Page Title (top heading)</label>
                    <input type="text" value={page.title || ''} onChange={(e) => updatePage(activePage, 'title', e.target.value)} style={{ ...inputStyle, fontWeight: '600' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Featured Badge Text</label>
                    <input type="text" value={page.badge || ''} onChange={(e) => updatePage(activePage, 'badge', e.target.value)} placeholder="e.g. EXCLUSIVES, புதிய வெளியீடு" style={inputStyle} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#111827', fontWeight: '700' }}>⭐ Featured Article (Hero card)</h4>
                  <div style={{ padding: '20px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Category Label (kicker)</label>
                        <input type="text" value={page.featured?.cat || ''} onChange={(e) => updatePageNested(activePage, 'featured', 'cat', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Byline / Meta</label>
                        <input type="text" value={page.featured?.meta || ''} onChange={(e) => updatePageNested(activePage, 'featured', 'meta', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                      </div>
                    </div>
                    <ImageOrUploadField value={page.featured?.img || ''} onChange={(v) => updatePageNested(activePage, 'featured', 'img', v)} label="Featured Image" />
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Headline</label>
                      <input type="text" value={page.featured?.title || ''} onChange={(e) => updatePageNested(activePage, 'featured', 'title', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Excerpt / Description</label>
                      <textarea rows="3" value={page.featured?.excerpt || ''} onChange={(e) => updatePageNested(activePage, 'featured', 'excerpt', e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== LAW PAGE (comprehensive editor) ===== */}
            {activePage === 'law' && (() => {
              const lawData = pagesContent.law || {};
              const upd = (field, val) => updatePage('law', field, val);
              const updFeat = (field, val) => updatePageNested('law', 'featured', field, val);
              const updStat = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, stats: (prev.law.stats || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const updSec = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, secondary: (prev.law.secondary || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const updStream = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, stream: (prev.law.stream || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addStream = () => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, stream: [...(prev.law.stream || []), { time: '10:00', cat: 'சட்டம்', title: 'புதிய செய்தி', meta: 'சட்ட டெஸ்க்' }] }
              }));
              const removeStream = (i) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, stream: (prev.law.stream || []).filter((_, idx) => idx !== i) }
              }));
              const updOp = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, opinion: (prev.law.opinion || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const updMostRead = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, mostRead: (prev.law.mostRead || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
              }));
              const addMostRead = () => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, mostRead: [...(prev.law.mostRead || []), { title: 'புதிய தலைப்பு', link: '' }] }
              }));
              const removeMostRead = (i) => setPagesContent(prev => ({
                ...prev,
                law: { ...prev.law, mostRead: (prev.law.mostRead || []).filter((_, idx) => idx !== i) }
              }));
              const imgUploadHandler = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };

              return (
                <div>
                  {/* ===== TITLEBAR SECTION ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Page Header / Titlebar</h3>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Eyebrow Label</label>
                      <input type="text" value={lawData.eyebrow || ''} onChange={(e) => upd('eyebrow', e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Page Title (h1)</label>
                      <input type="text" value={lawData.title || ''} onChange={(e) => upd('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Subtitle Description</label>
                      <textarea rows="3" value={lawData.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ marginTop: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '13px' }}>4 Stats Strip</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {(lawData.stats || []).map((s, i) => (
                          <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>Stat #{i + 1}</label>
                            <input type="text" value={s.num} onChange={(e) => updStat(i, 'num', e.target.value)} placeholder="Number" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', marginBottom: '6px' }} />
                            <input type="text" value={s.label} onChange={(e) => updStat(i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ===== HERO SECTION ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>⭐ Featured Hero Card</h3>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Category Pill</label>
                        <input type="text" value={lawData.featured?.cat || ''} onChange={(e) => updFeat('cat', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>LIVE Time Text</label>
                        <input type="text" value={lawData.featured?.liveTime || ''} onChange={(e) => updFeat('liveTime', e.target.value)} placeholder="LIVE or 09:45" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>LIVE Label</label>
                        <input type="text" value={lawData.featured?.liveLabel || ''} onChange={(e) => updFeat('liveLabel', e.target.value)} placeholder="LAW or IST" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Featured Image</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={lawData.featured?.img || ''} onChange={(e) => updFeat('img', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1 }} />
                        <button type="button" onClick={() => openMediaPicker((url) => updFeat('img', url))} style={{ padding: '7px 12px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>📁 Browse</button>
                        <label style={{ padding: '7px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          Upload
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUploadHandler((r) => updFeat('img', r))} />
                        </label>
                      </div>
                      {lawData.featured?.img && <img src={lawData.featured.img} alt="" style={{ marginTop: '8px', maxHeight: '100px', borderRadius: '6px', border: '1px solid #E5E7EB' }} />}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Headline</label>
                      <input type="text" value={lawData.featured?.title || ''} onChange={(e) => updFeat('title', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Excerpt</label>
                      <textarea rows="2" value={lawData.featured?.excerpt || ''} onChange={(e) => updFeat('excerpt', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Meta / Byline</label>
                      <input type="text" value={lawData.featured?.meta || ''} onChange={(e) => updFeat('meta', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>🔗 Link URL (where image/title click navigates)</label>
                      <input type="text" value={lawData.featured?.link || ''} onChange={(e) => updFeat('link', e.target.value)} placeholder="e.g. /article, /law/case-123 or full URL — blank uses default" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                    </div>
                  </div>

                  {/* ===== SECONDARY CARDS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Secondary Cards (2 cards below hero)</h3>
                    {(lawData.secondary || []).map((s, i) => (
                      <div key={i} style={{ padding: '14px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>Secondary Card #{i + 1}</div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input type="text" value={s.cat} onChange={(e) => updSec(i, 'cat', e.target.value)} placeholder="Category" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                          <input type="text" value={s.img} onChange={(e) => updSec(i, 'img', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                          <button type="button" onClick={() => openMediaPicker((url) => updSec(i, 'img', url))} style={{ padding: '6px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>📁</button>
                          <label style={{ padding: '6px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                            Upload
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUploadHandler((r) => updSec(i, 'img', r))} />
                          </label>
                        </div>
                        <input type="text" value={s.title} onChange={(e) => updSec(i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={s.meta} onChange={(e) => updSec(i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updSec(i, 'link', e.target.value)} placeholder="🔗 Link URL (e.g. /article — blank for default)" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== SECTION HEAD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🏷 Section Head (Stream divider)</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Section Title</label>
                        <input type="text" value={lawData.sectionHead || ''} onChange={(e) => upd('sectionHead', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"More" link text</label>
                        <input type="text" value={lawData.sectionMore || ''} onChange={(e) => upd('sectionMore', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* ===== STREAM ITEMS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📋 Stream Items (live news list)</h3>
                      <button type="button" onClick={addStream} style={{ padding: '6px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ Add Item</button>
                    </div>
                    {(lawData.stream || []).map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ width: '24px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={s.time} onChange={(e) => updStream(i, 'time', e.target.value)} placeholder="10:30" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '80px' }} />
                          <input type="text" value={s.cat} onChange={(e) => updStream(i, 'cat', e.target.value)} placeholder="Category" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeStream(i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '12px', padding: '4px 10px', borderRadius: '5px', fontWeight: '700' }}>✕</button>
                        </div>
                        <input type="text" value={s.title} onChange={(e) => updStream(i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', marginBottom: '4px' }} />
                        <input type="text" value={s.meta} onChange={(e) => updStream(i, 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '4px' }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updStream(i, 'link', e.target.value)} placeholder="🔗 Link URL — blank for default" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Load More" button text</label>
                      <input type="text" value={lawData.loadMore || ''} onChange={(e) => upd('loadMore', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                  </div>

                  {/* ===== SIDEBAR ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📌 Right Sidebar</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Sidebar Ad Label</label>
                      <input type="text" value={lawData.sidebarAdLabel || ''} onChange={(e) => upd('sidebarAdLabel', e.target.value)} placeholder="300 × 360" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Most Read" heading</label>
                      <input type="text" value={lawData.mostReadHead || ''} onChange={(e) => upd('mostReadHead', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                    <div style={{ marginBottom: '14px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>📌 Most Read Items</label>
                        <button type="button" onClick={addMostRead} style={{ padding: '5px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                      </div>
                      {(lawData.mostRead || []).map((mr, i) => (
                        <div key={i} style={{ marginBottom: '8px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <span style={{ width: '18px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                            <input type="text" value={mr.title} onChange={(e) => updMostRead(i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                            <button type="button" onClick={() => removeMostRead(i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                          </div>
                          <input type="text" value={mr.link || ''} onChange={(e) => updMostRead(i, 'link', e.target.value)} placeholder="🔗 Link URL — blank for default" style={{ ...inputStyle, fontSize: '10px', padding: '4px 8px', width: '100%' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Opinion" heading</label>
                      <input type="text" value={lawData.opinionHead || ''} onChange={(e) => upd('opinionHead', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#374151' }}>Opinion Quotes</label>
                      {(lawData.opinion || []).map((op, i) => (
                        <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', marginBottom: '6px' }}>Quote #{i + 1}</div>
                          <textarea rows="2" value={op.quote} onChange={(e) => updOp(i, 'quote', e.target.value)} placeholder="Quote text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', resize: 'vertical', marginBottom: '6px' }} />
                          <input type="text" value={op.author} onChange={(e) => updOp(i, 'author', e.target.value)} placeholder="Author" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== FILTER TABS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🏷 Filter Tabs (sub-navigation)</h3>
                      <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, filterTabs: [...(prev.law.filterTabs || []), { label: 'புதிய', value: 'new', active: false }] } }))} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Tab</button>
                    </div>
                    {(lawData.filterTabs || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={t.label} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, filterTabs: (prev.law.filterTabs || []).map((x, idx) => idx === i ? { ...x, label: e.target.value } : x) } }))} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6B7280', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!t.active} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, filterTabs: (prev.law.filterTabs || []).map((x, idx) => idx === i ? { ...x, active: e.target.checked } : { ...x, active: false }) } }))} />
                          Active
                        </label>
                        <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, filterTabs: (prev.law.filterTabs || []).filter((_, idx) => idx !== i) } }))} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== MID AD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Mid Ad — Google AdSense (after Secondary cards)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={lawData.midAdLabel || ''} onChange={(e) => upd('midAdLabel', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={lawData.midAdSize || ''} onChange={(e) => upd('midAdSize', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={lawData.midAdSub || ''} onChange={(e) => upd('midAdSub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== META AD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Meta Audience Ad (mid)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={lawData.metaAdLabel || ''} onChange={(e) => upd('metaAdLabel', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={lawData.metaAdSize || ''} onChange={(e) => upd('metaAdSize', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={lawData.metaAdSub || ''} onChange={(e) => upd('metaAdSub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== STREAM BATCH 2 ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📋 Stream Batch 2 (after Meta Ad)</h3>
                      <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: [...(prev.law.stream2 || []), { cat: 'புதிய', title: 'புதிய செய்தி', meta: '', link: '', placeholder: '' }] } }))} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(lawData.stream2 || []).map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={s.cat} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, cat: e.target.value } : x) } }))} placeholder="Category" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={s.placeholder || ''} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, placeholder: e.target.value } : x) } }))} placeholder="Image placeholder text" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={s.img || ''} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, img: e.target.value } : x) } }))} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => openMediaPicker((url) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, img: url } : x) } })))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                          <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).filter((_, idx) => idx !== i) } }))} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        <input type="text" value={s.title} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) } }))} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <input type="text" value={s.meta} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, meta: e.target.value } : x) } }))} placeholder="Meta" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '6px' }} />
                        <input type="text" value={s.link || ''} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, stream2: (prev.law.stream2 || []).map((x, idx) => idx === i ? { ...x, link: e.target.value } : x) } }))} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* ===== BOTTOM SPONSOR BANNER ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🏦 Bottom Sponsor Banner (Cauvery Bank style)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" value={lawData.bottomSponsor?.label || ''} onChange={(e) => updatePageNested('law', 'bottomSponsor', 'label', e.target.value)} placeholder="Brand label (e.g. காவேரி வங்கி)" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                      <input type="text" value={lawData.bottomSponsor?.placeholder || ''} onChange={(e) => updatePageNested('law', 'bottomSponsor', 'placeholder', e.target.value)} placeholder="Image placeholder text" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={lawData.bottomSponsor?.title || ''} onChange={(e) => updatePageNested('law', 'bottomSponsor', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={lawData.bottomSponsor?.meta || ''} onChange={(e) => updatePageNested('law', 'bottomSponsor', 'meta', e.target.value)} placeholder="Meta / fine print" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                  </div>

                  {/* ===== TRENDING (sidebar) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🔥 Trending (sidebar numbered list)</h3>
                      <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, trending: [...(prev.law.trending || []), { title: 'புதிய தலைப்பு', link: '' }] } }))} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={lawData.trendingHead || ''} onChange={(e) => upd('trendingHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px', fontWeight: '600' }} />
                    {(lawData.trending || []).map((t, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <input type="text" value={t.title} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, trending: (prev.law.trending || []).map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) } }))} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={t.link || ''} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, trending: (prev.law.trending || []).map((x, idx) => idx === i ? { ...x, link: e.target.value } : x) } }))} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, trending: (prev.law.trending || []).filter((_, idx) => idx !== i) } }))} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== SIDE AD 1 ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Sidebar Ad 1 (300×250 Google)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={lawData.sideAd1Label || ''} onChange={(e) => upd('sideAd1Label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={lawData.sideAd1Size || ''} onChange={(e) => upd('sideAd1Size', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={lawData.sideAd1Sub || ''} onChange={(e) => upd('sideAd1Sub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== NEWSLETTER ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>✉️ Newsletter (sidebar)</h3>
                    <input type="text" value={lawData.newsletterHead || ''} onChange={(e) => upd('newsletterHead', e.target.value)} placeholder="Heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px', fontWeight: '600' }} />
                    <textarea rows="2" value={lawData.newsletterCopy || ''} onChange={(e) => upd('newsletterCopy', e.target.value)} placeholder="Body copy" style={{ ...inputStyle, fontSize: '12px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={lawData.newsletterPlaceholder || ''} onChange={(e) => upd('newsletterPlaceholder', e.target.value)} placeholder="Input placeholder" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 2 }} />
                      <input type="text" value={lawData.newsletterButton || ''} onChange={(e) => upd('newsletterButton', e.target.value)} placeholder="Button text" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                    </div>
                  </div>

                  {/* ===== TOPICS CHIPS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🏷 Topics (sidebar chips)</h3>
                      <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, topics: [...(prev.law.topics || []), 'புதிய'] } }))} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={lawData.topicsHead || ''} onChange={(e) => upd('topicsHead', e.target.value)} placeholder="Section header" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px', fontWeight: '600' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '6px' }}>
                      {(lawData.topics || []).map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: '4px' }}>
                          <input type="text" value={t} onChange={(e) => setPagesContent(prev => ({ ...prev, law: { ...prev.law, topics: (prev.law.topics || []).map((x, idx) => idx === i ? e.target.value : x) } }))} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                          <button type="button" onClick={() => setPagesContent(prev => ({ ...prev, law: { ...prev.law, topics: (prev.law.topics || []).filter((_, idx) => idx !== i) } }))} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== SIDE AD 2 ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📢 Sidebar Ad 2 (300×600 Meta half-page)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={lawData.sideAd2Label || ''} onChange={(e) => upd('sideAd2Label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={lawData.sideAd2Size || ''} onChange={(e) => upd('sideAd2Size', e.target.value)} placeholder="Size" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={lawData.sideAd2Sub || ''} onChange={(e) => upd('sideAd2Sub', e.target.value)} placeholder="Subtext / Slot ID" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* ===== SIDEBAR SPONSOR ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🤝 Sidebar Sponsor Card (AARCADU style)</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={lawData.sidebarSponsor?.sub || ''} onChange={(e) => updatePageNested('law', 'sidebarSponsor', 'sub', e.target.value)} placeholder="Tag (SPONSORED)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                      <input type="text" value={lawData.sidebarSponsor?.label || ''} onChange={(e) => updatePageNested('law', 'sidebarSponsor', 'label', e.target.value)} placeholder="Brand (AARCADU)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                    </div>
                    <input type="text" value={lawData.sidebarSponsor?.placeholder || ''} onChange={(e) => updatePageNested('law', 'sidebarSponsor', 'placeholder', e.target.value)} placeholder="Image placeholder (FARM PRODUCE)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={lawData.sidebarSponsor?.title || ''} onChange={(e) => updatePageNested('law', 'sidebarSponsor', 'title', e.target.value)} placeholder="Sponsor title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={lawData.sidebarSponsor?.meta || ''} onChange={(e) => updatePageNested('law', 'sidebarSponsor', 'meta', e.target.value)} placeholder="Meta / details" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={lawData.sidebarSponsor?.cta || ''} onChange={(e) => updatePageNested('law', 'sidebarSponsor', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>
                </div>
              );
            })()}

            {/* ===== ASTROLOGY PAGE ===== */}
            {activePage === 'astrology' && (() => {
              const astro = page;
              const updA = (field, val) => updatePage('astrology', field, val);
              const updRasi = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, rasi: (prev.astrology.rasi || []).map((r, idx) => idx === i ? { ...r, [field]: val } : r) }
              }));
              const updSb = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, sidebarItems: (prev.astrology.sidebarItems || []).map((r, idx) => idx === i ? { ...r, [field]: val } : r) }
              }));
              const addSb = () => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, sidebarItems: [...(prev.astrology.sidebarItems || []), { title: 'புதிய தலைப்பு', link: '' }] }
              }));
              const removeSb = (i) => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, sidebarItems: (prev.astrology.sidebarItems || []).filter((_, idx) => idx !== i) }
              }));
              const updSp = (i, field, val) => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, spiritualArticles: (prev.astrology.spiritualArticles || []).map((r, idx) => idx === i ? { ...r, [field]: val } : r) }
              }));
              const addSp = () => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, spiritualArticles: [...(prev.astrology.spiritualArticles || []), { title: 'புதிய செய்தி', time: 'சமீபத்திய', img: '', link: '' }] }
              }));
              const removeSp = (i) => setPagesContent(prev => ({
                ...prev,
                astrology: { ...prev.astrology, spiritualArticles: (prev.astrology.spiritualArticles || []).filter((_, idx) => idx !== i) }
              }));
              const imgUploadHandler = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };
              const handlePdfUpload = async (rasiIdx, file) => {
                if (!file) return;
                try {
                  const { savePdfBlob } = await import('../utils/pdfStorage.js');
                  const key = await savePdfBlob(file);
                  // Update state AND auto-persist to localStorage so the
                  // frontend immediately picks up the new PDF without
                  // requiring a "Save All Pages" click.
                  setPagesContent(prev => {
                    const updated = {
                      ...prev,
                      astrology: {
                        ...prev.astrology,
                        rasi: (prev.astrology.rasi || []).map((r, idx) => idx === rasiIdx ? { ...r, pdf: key } : r)
                      }
                    };
                    try {
                      localStorage.setItem('customPagesContent', JSON.stringify(updated));
                      notifyChange('customPagesContent');
                    } catch (e) {
                      console.error('Failed to auto-save page content', e);
                    }
                    return updated;
                  });
                  const rasiName = (pagesContent.astrology?.rasi?.[rasiIdx]?.sign) || `Rasi #${rasiIdx + 1}`;
                  alert('✓ PDF saved and published!\n\nRasi: ' + rasiName + '\nFile: ' + file.name + '\n\nRefresh the /astrology page — clicking "மேலும் படிக்க" on this rasi will now open this PDF.');
                } catch (err) {
                  alert('Failed to save PDF: ' + err.message);
                }
              };
              const removePdfForRasi = async (rasiIdx, currentKey) => {
                if (!currentKey) return;
                try {
                  const { deletePdf } = await import('../utils/pdfStorage.js');
                  await deletePdf(currentKey);
                } catch (err) { /* ignore */ }
                setPagesContent(prev => {
                  const updated = {
                    ...prev,
                    astrology: {
                      ...prev.astrology,
                      rasi: (prev.astrology.rasi || []).map((r, idx) => idx === rasiIdx ? { ...r, pdf: '' } : r)
                    }
                  };
                  try {
                    localStorage.setItem('customPagesContent', JSON.stringify(updated));
                    notifyChange('customPagesContent');
                  } catch (e) { /* ignore */ }
                  return updated;
                });
              };

              return (
                <div>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>
                    🕉 Edit ALL content shown on the <code>/astrology</code> page — title, panchangam, all 12 rasis (with PDF upload for "மேலும் படிக்க"), sidebar featured news, and spiritual articles.
                  </div>

                  {/* ===== TITLE + SUBTITLE ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Page Header</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Page Title</label>
                      <input type="text" value={astro.title || ''} onChange={(e) => updA('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Subtitle</label>
                      <input type="text" value={astro.subtitle || ''} onChange={(e) => updA('subtitle', e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  {/* ===== PANCHANGAM ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📜 Panchangam (Today's Almanac)</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Section Title</label>
                      <input type="text" value={astro.panchangamHead || ''} onChange={(e) => updA('panchangamHead', e.target.value)} style={{ ...inputStyle, fontSize: '13px' }} placeholder="இன்றைய பஞ்சாங்கம்" />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Date (top right)</label>
                      <input type="text" value={astro.panchangam?.date || ''} onChange={(e) => updatePageNested('astrology', 'panchangam', 'date', e.target.value)} style={{ ...inputStyle, fontSize: '13px' }} placeholder="e.g. 12 மே 2026, செவ்வாய்க்கிழமை" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {[
                        ['tamilYear', 'தமிழ் வருடம்'],
                        ['tithi', 'திதி'],
                        ['nakshatra', 'நட்சத்திரம்'],
                        ['yoga', 'யோகம்'],
                        ['goodTime', 'நல்ல நேரம்'],
                        ['rahuKalam', 'ராகு காலம்']
                      ].map(([key, label]) => (
                        <div key={key}>
                          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>{label}</label>
                          <input type="text" value={astro.panchangam?.[key] || ''} onChange={(e) => updatePageNested('astrology', 'panchangam', key, e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== 12 RASI CARDS WITH PDF UPLOAD ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 8px 0', color: '#111827', fontWeight: '700' }}>♈ 12 ராசிகள் (Zodiac Cards)</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px 0' }}>Edit each rasi's daily prediction. Upload a PDF — clicking <strong>"மேலும் படிக்க"</strong> will open it in a new tab. Alternatively set a custom URL as fallback.</p>
                    <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#F9FAFB', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>"Read More" link label:</label>
                      <input type="text" value={astro.readMoreLabel || ''} onChange={(e) => updA('readMoreLabel', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} placeholder="மேலும் படிக்க ›" />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Section Header</label>
                      <input type="text" value={astro.rasiSectionHead || ''} onChange={(e) => updA('rasiSectionHead', e.target.value)} style={{ ...inputStyle, fontSize: '13px' }} placeholder="இன்றைய ராசிபலன்" />
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {(astro.rasi || []).map((r, i) => (
                        <div key={i} style={{ padding: '14px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>{i + 1}</span>
                            <input type="text" value={r.icon || ''} onChange={(e) => updRasi(i, 'icon', e.target.value)} placeholder="♈" style={{ ...inputStyle, fontSize: '16px', padding: '5px 8px', width: '60px', textAlign: 'center', fontWeight: '700' }} />
                            <input type="text" value={r.sign || ''} onChange={(e) => updRasi(i, 'sign', e.target.value)} placeholder="ராசி பெயர்" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', flex: 1, fontWeight: '600' }} />
                          </div>
                          <textarea rows="2" value={r.desc || ''} onChange={(e) => updRasi(i, 'desc', e.target.value)} placeholder="இன்றைய பலன்..." style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', marginBottom: '8px', resize: 'vertical', lineHeight: 1.5 }} />
                          <div style={{ padding: '8px 10px', background: '#fff', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '6px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>📄 PDF for "மேலும் படிக்க" (opens in new tab)</label>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              {r.pdf ? (
                                <>
                                  <span style={{ flex: 1, fontSize: '11px', color: '#059669', fontWeight: '600' }}>✓ PDF attached ({r.pdf.substring(0, 30)}...)</span>
                                  <button type="button" onClick={() => removePdfForRasi(i, r.pdf)} style={{ padding: '4px 9px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', fontWeight: '600' }}>Remove</button>
                                </>
                              ) : (
                                <span style={{ flex: 1, fontSize: '11px', color: '#9CA3AF' }}>No PDF — link below or default fallback used</span>
                              )}
                              <label style={{ padding: '4px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                                {r.pdf ? 'Replace' : '+ Upload PDF'}
                                <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files[0]) handlePdfUpload(i, e.target.files[0]); }} />
                              </label>
                            </div>
                          </div>
                          <input type="text" value={r.link || ''} onChange={(e) => updRasi(i, 'link', e.target.value)} placeholder="🔗 Fallback URL (if no PDF — e.g. /article or full URL)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== SIDEBAR FEATURED NEWS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📌 Sidebar Featured News</h3>
                      <button type="button" onClick={addSb} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={astro.sidebarHead || ''} onChange={(e) => updA('sidebarHead', e.target.value)} placeholder="சிறப்பு செய்திகள்" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px', fontWeight: '600' }} />
                    {(astro.sidebarItems || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={s.title} onChange={(e) => updSb(i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updSb(i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => removeSb(i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== SPIRITUAL ARTICLES ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📰 ஆன்மீக செய்திகள் (Spiritual Articles)</h3>
                      <button type="button" onClick={addSp} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <input type="text" value={astro.spiritualHead || ''} onChange={(e) => updA('spiritualHead', e.target.value)} placeholder="ஆன்மீக செய்திகள்" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 2, fontWeight: '600' }} />
                      <input type="text" value={astro.spiritualMore || ''} onChange={(e) => updA('spiritualMore', e.target.value)} placeholder="மேலும் →" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 1 }} />
                    </div>
                    {(astro.spiritualArticles || []).map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={s.img || ''} onChange={(e) => updSp(i, 'img', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                          <button type="button" onClick={() => openMediaPicker((url) => updSp(i, 'img', url))} style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>📁</button>
                          <label style={{ padding: '5px 8px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                            Upload
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUploadHandler((r) => updSp(i, 'img', r))} />
                          </label>
                          <button type="button" onClick={() => removeSp(i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                        {s.img && <img src={s.img} alt="" style={{ maxHeight: '60px', borderRadius: '4px', border: '1px solid #E5E7EB', marginBottom: '6px' }} />}
                        <input type="text" value={s.title} onChange={(e) => updSp(i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '6px' }} />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" value={s.time || ''} onChange={(e) => updSp(i, 'time', e.target.value)} placeholder="Time" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={s.link || ''} onChange={(e) => updSp(i, 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ===== ARTICLE PAGE ===== */}
            {/* ===== EPAPER PAGE EDITOR ===== */}
            {activePage === 'epaper' && (() => {
              const epaper = JSON.parse(localStorage.getItem('customEPaperPage') || 'null') || {
                title: 'செய்தித்தாள்கள்',
                subtitle: 'செய்தித்தாள்களில் உள்ள அனைத்து செய்திகள் இங்கு பதிவேற்றிக் கொள்ளலாம்',
                heroBgImage: '',
                sections: { hero: true, subtitleBar: true, papersGrid: true, aboutFooter: true },
                papers: [
                  { title: 'பிப்ரவரி 4வது வார செய்திகள்', desc: 'பிப்ரவரி 4வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
                  { title: 'ஏப்ரல் 2வது வார செய்திகள்', desc: 'ஏப்ரல் 2வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
                  { title: 'ஏப்ரல் 3வது வார செய்திகள்', desc: 'ஏப்ரல் 3வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
                  { title: 'ஏப்ரல் 4வது வார செய்திகள்', desc: 'ஏப்ரல் 4வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' },
                  { title: 'மே 1வது வார செய்திகள்', desc: 'மே 1வது வார செய்திகள் பதிவேற்ற கீழே உள்ள பொத்தானை அழுத்தவும்', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' }
                ],
                aboutText: ''
              };

              // Persist + reload helper
              const save = (updated) => {
                localStorage.setItem('customEPaperPage', JSON.stringify(updated));
                notifyChange('customEPaperPage');
                window.location.reload();
              };
              const updField = (field, val) => save({ ...epaper, [field]: val });
              const updPaper = (i, field, val) => save({ ...epaper, papers: (epaper.papers || []).map((p, idx) => idx === i ? { ...p, [field]: val } : p) });
              const toggleSec = (key) => save({ ...epaper, sections: { ...(epaper.sections || {}), [key]: !(epaper.sections?.[key] !== false) } });
              const addPaper = () => save({ ...epaper, papers: [...(epaper.papers || []), { title: 'புதிய வார செய்திகள்', desc: '', thumb: '', pdfKey: '', ctaText: 'செய்திகள்' }] });
              const removePaper = async (i) => {
                if (!window.confirm('Remove this newspaper edition?')) return;
                const target = epaper.papers[i];
                if (target?.pdfKey) {
                  try { const { deletePdf } = await import('../utils/pdfStorage.js'); await deletePdf(target.pdfKey); } catch (e) {}
                }
                save({ ...epaper, papers: (epaper.papers || []).filter((_, idx) => idx !== i) });
              };
              const uploadPaperPdf = async (i, file) => {
                if (!file) return;
                try {
                  const { savePdfBlob, deletePdf } = await import('../utils/pdfStorage.js');
                  const old = epaper.papers[i]?.pdfKey;
                  if (old) { try { await deletePdf(old); } catch (e) {} }
                  const key = await savePdfBlob(file);
                  alert('✓ PDF uploaded! Refresh /epaper to see it.');
                  save({ ...epaper, papers: (epaper.papers || []).map((p, idx) => idx === i ? { ...p, pdfKey: key } : p) });
                } catch (err) {
                  alert('Failed to upload PDF: ' + err.message);
                }
              };
              const removePaperPdf = async (i) => {
                const old = epaper.papers[i]?.pdfKey;
                if (!old) return;
                if (!window.confirm('Remove the uploaded PDF for this edition?')) return;
                try { const { deletePdf } = await import('../utils/pdfStorage.js'); await deletePdf(old); } catch (e) {}
                save({ ...epaper, papers: (epaper.papers || []).map((p, idx) => idx === i ? { ...p, pdfKey: '' } : p) });
              };
              const imgUp = (cb) => (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => cb(reader.result);
                  reader.readAsDataURL(file);
                }
              };

              // SectionBlock wrapper with SHOWN/HIDDEN toggle
              const SectionBlock = ({ secKey, icon, title, children }) => {
                const isOn = epaper.sections?.[secKey] !== false;
                return (
                  <div style={{ background: '#fff', padding: '20px 28px 24px', borderRadius: '16px', border: `1px solid ${isOn ? '#E5E7EB' : '#FCA5A5'}`, marginBottom: '20px', opacity: isOn ? 1 : 0.55 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOn ? '14px' : 0, paddingBottom: isOn ? '12px' : 0, borderBottom: isOn ? '1px solid #F3F4F6' : 'none' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>{icon} {title}</h3>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isOn ? '#059669' : '#EF4444', fontWeight: '700', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isOn} onChange={() => toggleSec(secKey)} />
                        {isOn ? 'SHOWN' : 'HIDDEN'}
                      </label>
                    </div>
                    {isOn && children}
                  </div>
                );
              };

              return (
                <div>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>
                    📰 <strong>ePaper page editor</strong> — Manages content for <code>/epaper</code> (linked from "இ-பேப்பர்" in the top header and footer). Each section below can be <strong>SHOWN/HIDDEN</strong> via the toggle.
                  </div>

                  {/* SECTION 1: HERO BANNER */}
                  <SectionBlock secKey="hero" icon="🎨" title="Hero Banner (top of /epaper)">
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Page Title (big white text on dark banner)</label>
                      <input type="text" defaultValue={epaper.title || ''} onBlur={(e) => updField('title', e.target.value)} style={{ ...inputStyle, fontSize: '17px', fontWeight: '700' }} placeholder="செய்தித்தாள்கள்" />
                    </div>
                    <div style={{ padding: '12px', background: '#FAFAF7', borderRadius: '6px', border: '1px solid var(--rule)' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>🖼 Hero Background Image (optional — defaults to newspaper pattern if blank)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                        <input type="text" defaultValue={epaper.heroBgImage || ''} onBlur={(e) => updField('heroBgImage', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 1 }} />
                        <button type="button" onClick={() => openMediaPicker((url) => updField('heroBgImage', url))} style={{ padding: '7px 10px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '5px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>📁 Browse</button>
                        <label style={{ padding: '7px 12px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                          Upload
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => updField('heroBgImage', r))} />
                        </label>
                      </div>
                      {epaper.heroBgImage && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <img src={epaper.heroBgImage} alt="" style={{ maxHeight: '60px', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                          <button type="button" onClick={() => updField('heroBgImage', '')} style={{ padding: '4px 10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', fontWeight: '700' }}>Remove</button>
                        </div>
                      )}
                    </div>
                  </SectionBlock>

                  {/* SECTION 2: SUBTITLE BAR */}
                  <SectionBlock secKey="subtitleBar" icon="📝" title="Subtitle Bar (Tamil descriptor below hero)">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Subtitle text</label>
                    <textarea rows="2" defaultValue={epaper.subtitle || ''} onBlur={(e) => updField('subtitle', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} placeholder="..." />
                  </SectionBlock>

                  {/* SECTION 3: PAPERS GRID */}
                  <SectionBlock secKey="papersGrid" icon="📰" title={`Newspaper Editions Grid (${(epaper.papers || []).length} cards)`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '10px 14px', background: 'var(--accent)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>Upload up to 8-9 weekly newspaper PDFs</span>
                      <button type="button" onClick={addPaper} style={{ padding: '7px 14px', background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>+ Add Edition</button>
                    </div>

                    {(epaper.papers || []).map((p, i) => (
                      <div key={i} style={{ padding: '16px', background: p.pdfKey ? '#F0FDF4' : '#F9FAFB', borderRadius: '8px', border: `1px solid ${p.pdfKey ? '#86EFAC' : '#E5E7EB'}`, marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>{i + 1}</span>
                            <strong style={{ fontSize: '13px', color: '#111827' }}>{p.title || 'Untitled Edition'}</strong>
                            {p.pdfKey && <span style={{ fontSize: '10px', padding: '2px 8px', background: '#059669', color: '#fff', borderRadius: '3px', fontWeight: 700 }}>✓ PDF UPLOADED</span>}
                          </div>
                          <button type="button" onClick={() => removePaper(i)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '5px 10px', borderRadius: '4px', fontWeight: '700' }}>✕ Remove Edition</button>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '600', color: '#374151' }}>Edition Title</label>
                          <input type="text" defaultValue={p.title || ''} onBlur={(e) => updPaper(i, 'title', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', fontWeight: 600 }} placeholder="மே 2வது வார செய்திகள்" />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '600', color: '#374151' }}>Description (shown below title on card)</label>
                          <textarea rows="2" defaultValue={p.desc || ''} onBlur={(e) => updPaper(i, 'desc', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', resize: 'vertical' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <input type="text" defaultValue={p.ctaText || ''} onBlur={(e) => updPaper(i, 'ctaText', e.target.value)} placeholder="CTA button text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                          <input type="text" defaultValue={p.thumb || ''} onBlur={(e) => updPaper(i, 'thumb', e.target.value)} placeholder="Cover image URL (optional)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                          <label style={{ padding: '6px 12px', background: '#F3F4F6', border: '1px solid #D1D5DB', color: '#374151', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                            Cover Upload
                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={imgUp((r) => updPaper(i, 'thumb', r))} />
                          </label>
                        </div>

                        {/* PDF Upload */}
                        <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', border: '2px dashed var(--accent)' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>📄 Weekly Newspaper PDF File</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {p.pdfKey ? (
                              <>
                                <span style={{ flex: 1, fontSize: '12px', color: '#059669', fontWeight: '600' }}>✓ PDF uploaded — visitors can click "செய்திகள்" to open it</span>
                                <button type="button" onClick={() => removePaperPdf(i)} style={{ padding: '6px 12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', fontWeight: '700' }}>Remove PDF</button>
                              </>
                            ) : (
                              <span style={{ flex: 1, fontSize: '12px', color: '#9CA3AF' }}>No PDF — visitors see "Coming soon" alert when clicking</span>
                            )}
                            <label style={{ padding: '10px 18px', background: 'var(--accent)', color: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                              {p.pdfKey ? '↻ Replace PDF' : '+ Upload PDF'}
                              <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files[0]) uploadPaperPdf(i, e.target.files[0]); }} />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={addPaper} style={{ width: '100%', padding: '14px', background: '#fff', color: 'var(--accent)', border: '2px dashed var(--accent)', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }}>+ Add another Weekly Edition</button>
                  </SectionBlock>

                  {/* SECTION 4: ABOUT FOOTER */}
                  <SectionBlock secKey="aboutFooter" icon="📝" title="About Footer Strip (red banner at bottom)">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>About paragraph (shown on red strip at bottom of /epaper)</label>
                    <textarea rows="6" defaultValue={epaper.aboutText || ''} onBlur={(e) => updField('aboutText', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} placeholder="About paragraph..." />
                  </SectionBlock>
                </div>
              );
            })()}

            {activePage === 'article' && (() => {
              const art = page;
              const updA = (field, val) => updatePage('article', field, val);
              const updArrA = (arrField, i, field, val) => {
                setPagesContent(prev => ({
                  ...prev,
                  article: { ...prev.article, [arrField]: (prev.article[arrField] || []).map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
                }));
              };
              const updArrAItem = (arrField, i, val) => {
                setPagesContent(prev => ({
                  ...prev,
                  article: { ...prev.article, [arrField]: (prev.article[arrField] || []).map((s, idx) => idx === i ? val : s) }
                }));
              };
              const addArrA = (arrField, newItem) => {
                setPagesContent(prev => ({
                  ...prev,
                  article: { ...prev.article, [arrField]: [...(prev.article[arrField] || []), newItem] }
                }));
              };
              const removeArrA = (arrField, i) => {
                setPagesContent(prev => ({
                  ...prev,
                  article: { ...prev.article, [arrField]: (prev.article[arrField] || []).filter((_, idx) => idx !== i) }
                }));
              };

              return (
                <div>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>
                    📄 This editor controls the default Article Detail page (visible at <code>/article</code>). Customize headline, body, image, tags and related content.
                  </div>

                  {/* ===== BREADCRUMB ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🧭 Breadcrumb Trail</h3>
                      <button type="button" onClick={() => addArrA('breadcrumb', { label: 'புதிய', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add</button>
                    </div>
                    {(art.breadcrumb || []).map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={b.label} onChange={(e) => updArrA('breadcrumb', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <input type="text" value={b.link || ''} onChange={(e) => updArrA('breadcrumb', i, 'link', e.target.value)} placeholder="Link URL (blank = no link)" style={{ ...inputStyle, fontSize: '11px', padding: '6px 10px', flex: 2 }} />
                        <button type="button" onClick={() => removeArrA('breadcrumb', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== HEADER (Title, Subtitle, Author, Date) ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>📰 Article Header</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Title (H1)</label>
                      <input type="text" value={art.title || ''} onChange={(e) => updA('title', e.target.value)} style={{ ...inputStyle, fontSize: '14px', fontWeight: '600' }} />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Subtitle / Deck</label>
                      <textarea rows="2" value={art.subtitle || ''} onChange={(e) => updA('subtitle', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Author</label>
                        <input type="text" value={art.author || ''} onChange={(e) => updA('author', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Date / Time</label>
                        <input type="text" value={art.date || ''} onChange={(e) => updA('date', e.target.value)} placeholder="10 மே 2026, 10:30 IST" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* ===== FEATURED IMAGE ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🖼 Featured Image</h3>
                    <ImageOrUploadField value={art.image || ''} onChange={(v) => updA('image', v)} label="Image URL or Upload" />
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Caption (below image)</label>
                      <input type="text" value={art.caption || ''} onChange={(e) => updA('caption', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                    </div>
                  </div>

                  {/* ===== BODY PARAGRAPHS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>📝 Body Paragraphs</h3>
                      <button type="button" onClick={() => addArrA('content', 'புதிய பத்தி...')} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Paragraph</button>
                    </div>
                    {(art.content || []).map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)', paddingTop: '8px' }}>{i + 1}</span>
                        <textarea rows="4" value={p} onChange={(e) => updArrAItem('content', i, e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', flex: 1, lineHeight: 1.6 }} />
                        <button type="button" onClick={() => removeArrA('content', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* ===== PULL QUOTE + CLOSING ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>💬 Pull Quote & Closing</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Pull Quote (highlighted in red panel)</label>
                      <textarea rows="2" value={art.pullQuote || ''} onChange={(e) => updA('pullQuote', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Closing Paragraph (after quote)</label>
                      <textarea rows="3" value={art.closing || ''} onChange={(e) => updA('closing', e.target.value)} style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />
                    </div>
                  </div>

                  {/* ===== TAGS ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, color: '#111827', fontWeight: '700' }}>🏷 Tags</h3>
                      <button type="button" onClick={() => addArrA('tags', 'புதிய tag')} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>+ Add Tag</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                      {(art.tags || []).map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: '4px' }}>
                          <input type="text" value={t} onChange={(e) => updArrAItem('tags', i, e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                          <button type="button" onClick={() => removeArrA('tags', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ===== RELATED HEADER ===== */}
                  <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: '#111827', fontWeight: '700' }}>🔗 Related Section</h3>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Related section header</label>
                    <input type="text" value={art.relatedHead || ''} onChange={(e) => updA('relatedHead', e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px' }} />
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: '8px 0 0 0' }}>Note: Related cards are pulled automatically from your top stories.</p>
                  </div>
                </div>
              );
            })()}

            {/* ===== SPIRITUAL HUB PAGE ===== */}
            {activePage === 'spiritual' && (() => {
              const sp = pagesContent.spiritual || {};
              const upd = (field, val) => updatePage('spiritual', field, val);
              const updNested = (sub, field, val) => updatePageNested('spiritual', sub, field, val);
              const updArr = (key, idx, field, val) => {
                const arr = [...(sp[key] || [])];
                arr[idx] = { ...arr[idx], [field]: val };
                upd(key, arr);
              };
              const addArr = (key, blank) => upd(key, [...(sp[key] || []), blank]);
              const removeArr = (key, idx) => upd(key, (sp[key] || []).filter((_, i) => i !== idx));

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Header */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '2px solid #9D174D' }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#9D174D', fontWeight: 800 }}>🕉 ஆன்மீகம் Hub — Page Header</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Title</label>
                      <input type="text" value={sp.title || ''} onChange={(e) => upd('title', e.target.value)} placeholder="ஆன்மீகம்" style={{ ...inputStyle, fontSize: '16px', fontWeight: 700 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Subtitle</label>
                      <textarea rows="2" value={sp.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} placeholder="கோயில் செய்திகள், திருவிழாக்கள்..." style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                    </div>
                  </div>

                  {/* Featured */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: 700 }}>⭐ Featured Article</h3>
                    <input type="text" value={sp.featured?.kicker || ''} onChange={(e) => updNested('featured', 'kicker', e.target.value)} placeholder="Kicker (சிறப்பு கட்டுரை)" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={sp.featured?.title || ''} onChange={(e) => updNested('featured', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '14px', padding: '8px 10px', marginBottom: '8px', fontWeight: 600 }} />
                    <textarea rows="3" value={sp.featured?.excerpt || ''} onChange={(e) => updNested('featured', 'excerpt', e.target.value)} placeholder="Excerpt..." style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px', marginBottom: '8px', resize: 'vertical' }} />
                    <input type="text" value={sp.featured?.meta || ''} onChange={(e) => updNested('featured', 'meta', e.target.value)} placeholder="Meta (Desk · 2 hr ago)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={sp.featured?.img || ''} onChange={(e) => updNested('featured', 'img', e.target.value)} placeholder="🖼 Image URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={sp.featured?.link || ''} onChange={(e) => updNested('featured', 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* Category tiles */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>🎯 Category Tiles</h3>
                      <button type="button" onClick={() => addArr('categories', { name: '', desc: '', href: '/article', icon: '✨', color: '#9D174D' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add Tile</button>
                    </div>
                    <input type="text" value={sp.categoriesHead || ''} onChange={(e) => upd('categoriesHead', e.target.value)} placeholder="Section heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(sp.categories || []).map((c, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={c.icon || ''} onChange={(e) => updArr('categories', i, 'icon', e.target.value)} placeholder="🌟" style={{ ...inputStyle, fontSize: '14px', padding: '5px 8px', width: '50px', textAlign: 'center' }} />
                          <input type="text" value={c.name || ''} onChange={(e) => updArr('categories', i, 'name', e.target.value)} placeholder="Tile name" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <input type="color" value={c.color || '#9D174D'} onChange={(e) => updArr('categories', i, 'color', e.target.value)} style={{ width: '32px', height: '28px', border: '1px solid #D1D5DB', borderRadius: '4px', padding: 0, cursor: 'pointer' }} />
                          <button type="button" onClick={() => removeArr('categories', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                        </div>
                        <input type="text" value={c.desc || ''} onChange={(e) => updArr('categories', i, 'desc', e.target.value)} placeholder="Description" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '4px' }} />
                        <input type="text" value={c.href || ''} onChange={(e) => updArr('categories', i, 'href', e.target.value)} placeholder="🔗 Link path (/astrology)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* Mini panchangam */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 12px 0', fontWeight: 700 }}>✱ Mini Panchangam</h3>
                    <input type="text" value={sp.panchangamHead || ''} onChange={(e) => upd('panchangamHead', e.target.value)} placeholder="Section heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={sp.panchangamCtaText || ''} onChange={(e) => upd('panchangamCtaText', e.target.value)} placeholder="CTA text (முழு பஞ்சாங்கம் காண →)" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '10px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input type="text" value={sp.panchangam?.date || ''} onChange={(e) => updNested('panchangam', 'date', e.target.value)} placeholder="Date" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.panchangam?.tamilYear || ''} onChange={(e) => updNested('panchangam', 'tamilYear', e.target.value)} placeholder="Tamil year" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.panchangam?.tithi || ''} onChange={(e) => updNested('panchangam', 'tithi', e.target.value)} placeholder="Tithi" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.panchangam?.nakshatra || ''} onChange={(e) => updNested('panchangam', 'nakshatra', e.target.value)} placeholder="Nakshatra" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.panchangam?.goodTime || ''} onChange={(e) => updNested('panchangam', 'goodTime', e.target.value)} placeholder="Good time" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      <input type="text" value={sp.panchangam?.rahuKalam || ''} onChange={(e) => updNested('panchangam', 'rahuKalam', e.target.value)} placeholder="Rahu kalam" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                    </div>
                  </div>

                  {/* Articles */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>📰 Spiritual Articles</h3>
                      <button type="button" onClick={() => addArr('articles', { title: '', time: '', cat: 'ஆன்மீகம்', img: '', placeholder: 'NEWS', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={sp.articlesHead || ''} onChange={(e) => upd('articlesHead', e.target.value)} placeholder="Section heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(sp.articles || []).map((a, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={a.title || ''} onChange={(e) => updArr('articles', i, 'title', e.target.value)} placeholder="Article title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                          <input type="text" value={a.cat || ''} onChange={(e) => updArr('articles', i, 'cat', e.target.value)} placeholder="Cat" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArr('articles', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" value={a.time || ''} onChange={(e) => updArr('articles', i, 'time', e.target.value)} placeholder="Time" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={a.link || ''} onChange={(e) => updArr('articles', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>📌 Sidebar Featured Links</h3>
                      <button type="button" onClick={() => addArr('sidebarItems', { title: '', link: '/article' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={sp.sidebarHead || ''} onChange={(e) => upd('sidebarHead', e.target.value)} placeholder="Sidebar heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(sp.sidebarItems || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={s.title || ''} onChange={(e) => updArr('sidebarItems', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updArr('sidebarItems', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <button type="button" onClick={() => removeArr('sidebarItems', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 12px 0', fontWeight: 700 }}>🤝 Bottom Sponsor CTA</h3>
                    <input type="text" value={sp.bottomCta?.title || ''} onChange={(e) => updNested('bottomCta', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={sp.bottomCta?.subtitle || ''} onChange={(e) => updNested('bottomCta', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" value={sp.bottomCta?.cta || ''} onChange={(e) => updNested('bottomCta', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={sp.bottomCta?.ctaHref || ''} onChange={(e) => updNested('bottomCta', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ===== MORE HUB PAGE ===== */}
            {activePage === 'more' && (() => {
              const mo = pagesContent.more || {};
              const upd = (field, val) => updatePage('more', field, val);
              const updNested = (sub, field, val) => updatePageNested('more', sub, field, val);
              const updArr = (key, idx, field, val) => {
                const arr = [...(mo[key] || [])];
                arr[idx] = { ...arr[idx], [field]: val };
                upd(key, arr);
              };
              const addArr = (key, blank) => upd(key, [...(mo[key] || []), blank]);
              const removeArr = (key, idx) => upd(key, (mo[key] || []).filter((_, i) => i !== idx));

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Header */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '2px solid #DB2777' }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#DB2777', fontWeight: 800 }}>🌸 மற்றவை Hub — Page Header</h3>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Title</label>
                      <input type="text" value={mo.title || ''} onChange={(e) => upd('title', e.target.value)} placeholder="மற்றவை" style={{ ...inputStyle, fontSize: '16px', fontWeight: 700 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Subtitle</label>
                      <textarea rows="2" value={mo.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} placeholder="அழகு, சமையல், வாழ்க்கை முறை..." style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                    </div>
                  </div>

                  {/* Featured */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: 700 }}>⭐ Featured Article</h3>
                    <input type="text" value={mo.featured?.kicker || ''} onChange={(e) => updNested('featured', 'kicker', e.target.value)} placeholder="Kicker (வாழ்வியல் சிறப்பு)" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', marginBottom: '8px' }} />
                    <input type="text" value={mo.featured?.title || ''} onChange={(e) => updNested('featured', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '14px', padding: '8px 10px', marginBottom: '8px', fontWeight: 600 }} />
                    <textarea rows="3" value={mo.featured?.excerpt || ''} onChange={(e) => updNested('featured', 'excerpt', e.target.value)} placeholder="Excerpt..." style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px', marginBottom: '8px', resize: 'vertical' }} />
                    <input type="text" value={mo.featured?.meta || ''} onChange={(e) => updNested('featured', 'meta', e.target.value)} placeholder="Meta" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={mo.featured?.img || ''} onChange={(e) => updNested('featured', 'img', e.target.value)} placeholder="🖼 Image URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                    <input type="text" value={mo.featured?.link || ''} onChange={(e) => updNested('featured', 'link', e.target.value)} placeholder="🔗 Link URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                  </div>

                  {/* Category tiles */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>🎯 Category Tiles</h3>
                      <button type="button" onClick={() => addArr('categories', { name: '', desc: '', href: '/article', icon: '🌸', color: '#DB2777' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add Tile</button>
                    </div>
                    <input type="text" value={mo.categoriesHead || ''} onChange={(e) => upd('categoriesHead', e.target.value)} placeholder="Section heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(mo.categories || []).map((c, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={c.icon || ''} onChange={(e) => updArr('categories', i, 'icon', e.target.value)} placeholder="🌸" style={{ ...inputStyle, fontSize: '14px', padding: '5px 8px', width: '50px', textAlign: 'center' }} />
                          <input type="text" value={c.name || ''} onChange={(e) => updArr('categories', i, 'name', e.target.value)} placeholder="Tile name" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 1 }} />
                          <input type="color" value={c.color || '#DB2777'} onChange={(e) => updArr('categories', i, 'color', e.target.value)} style={{ width: '32px', height: '28px', border: '1px solid #D1D5DB', borderRadius: '4px', padding: 0, cursor: 'pointer' }} />
                          <button type="button" onClick={() => removeArr('categories', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                        </div>
                        <input type="text" value={c.desc || ''} onChange={(e) => updArr('categories', i, 'desc', e.target.value)} placeholder="Description" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', marginBottom: '4px' }} />
                        <input type="text" value={c.href || ''} onChange={(e) => updArr('categories', i, 'href', e.target.value)} placeholder="🔗 Link path (/beauty)" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px' }} />
                      </div>
                    ))}
                  </div>

                  {/* Articles */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>📰 Lifestyle Articles</h3>
                      <button type="button" onClick={() => addArr('articles', { title: '', time: '', cat: 'அழகு', img: '', placeholder: 'NEWS', link: '' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={mo.articlesHead || ''} onChange={(e) => upd('articlesHead', e.target.value)} placeholder="Section heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(mo.articles || []).map((a, i) => (
                      <div key={i} style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ width: '22px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{i + 1}</span>
                          <input type="text" value={a.title || ''} onChange={(e) => updArr('articles', i, 'title', e.target.value)} placeholder="Article title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                          <input type="text" value={a.cat || ''} onChange={(e) => updArr('articles', i, 'cat', e.target.value)} placeholder="Cat" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <button type="button" onClick={() => removeArr('articles', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input type="text" value={a.time || ''} onChange={(e) => updArr('articles', i, 'time', e.target.value)} placeholder="Time" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                          <input type="text" value={a.link || ''} onChange={(e) => updArr('articles', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>📌 Sidebar Featured Links</h3>
                      <button type="button" onClick={() => addArr('sidebarItems', { title: '', link: '/article' })} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
                    </div>
                    <input type="text" value={mo.sidebarHead || ''} onChange={(e) => upd('sidebarHead', e.target.value)} placeholder="Sidebar heading" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '10px' }} />
                    {(mo.sidebarItems || []).map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                        <input type="text" value={s.title || ''} onChange={(e) => updArr('sidebarItems', i, 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '12px', padding: '5px 8px', flex: 2 }} />
                        <input type="text" value={s.link || ''} onChange={(e) => updArr('sidebarItems', i, 'link', e.target.value)} placeholder="🔗 Link" style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1 }} />
                        <button type="button" onClick={() => removeArr('sidebarItems', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 12px 0', fontWeight: 700 }}>🤝 Bottom Sponsor CTA</h3>
                    <input type="text" value={mo.bottomCta?.title || ''} onChange={(e) => updNested('bottomCta', 'title', e.target.value)} placeholder="Title" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', marginBottom: '8px' }} />
                    <textarea rows="2" value={mo.bottomCta?.subtitle || ''} onChange={(e) => updNested('bottomCta', 'subtitle', e.target.value)} placeholder="Subtitle" style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', resize: 'vertical', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" value={mo.bottomCta?.cta || ''} onChange={(e) => updNested('bottomCta', 'cta', e.target.value)} placeholder="CTA text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                      <input type="text" value={mo.bottomCta?.ctaHref || ''} onChange={(e) => updNested('bottomCta', 'ctaHref', e.target.value)} placeholder="CTA URL" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ===== CONTACT PAGE ===== */}
            {activePage === 'contact' && (
              <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 24px 0', color: '#111827', fontWeight: '700' }}>📞 Contact Page</h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Hero — small heading (first line)</label>
                  <input type="text" value={page.heroTitle || ''} onChange={(e) => updatePage('contact', 'heroTitle', e.target.value)} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Hero — big outlined word (second line)</label>
                  <input type="text" value={page.heroOutline || ''} onChange={(e) => updatePage('contact', 'heroOutline', e.target.value)} style={{ ...inputStyle, fontWeight: '700' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Hero — description text</label>
                  <textarea rows="3" value={page.heroDesc || ''} onChange={(e) => updatePage('contact', 'heroDesc', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#111827', fontWeight: '700' }}>📊 Hero Stats (4 numbers)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {(page.stats || []).map((s, i) => (
                      <div key={i} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                        <input type="text" value={s.num} onChange={(e) => updatePageArrayItem('contact', 'stats', i, 'num', e.target.value)} placeholder="Number" style={{ ...inputStyle, marginBottom: '6px', fontSize: '13px', padding: '6px 10px' }} />
                        <input type="text" value={s.label} onChange={(e) => updatePageArrayItem('contact', 'stats', i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#111827', fontWeight: '700' }}>📇 Contact Information</h4>
                  {[
                    ['officeAddress', 'Office Address (textarea)', 'textarea'],
                    ['phoneLandline', 'Landline Phone', 'input'],
                    ['phoneWhatsapp', 'WhatsApp Number', 'input'],
                    ['emailGeneral', 'General Email', 'input'],
                    ['emailEditor', 'Editor Email', 'input'],
                    ['newsroomPhone', 'Newsroom Tip Phone', 'input'],
                    ['newsroomEmail', 'Newsroom Email', 'input'],
                    ['salesPhone', 'Advertising Sales Phone', 'input'],
                    ['salesHours', 'Advertising Hours', 'input'],
                    ['techPhone', 'Tech Support Phone', 'input'],
                    ['techDesc', 'Tech Support Description', 'input'],
                  ].map(([key, label, type]) => (
                    <div key={key} style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>{label}</label>
                      {type === 'textarea'
                        ? <textarea rows="2" value={page[key] || ''} onChange={(e) => updatePage('contact', key, e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                        : <input type="text" value={page[key] || ''} onChange={(e) => updatePage('contact', key, e.target.value)} style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} />
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== SUBSCRIPTION PAGE ===== */}
            {activePage === 'subscription' && (() => {
              const sub = pagesContent.subscription || {};
              const upd = (field, val) => updatePage('subscription', field, val);
              const updArr = (key, idx, val) => {
                const arr = [...(sub[key] || [])];
                arr[idx] = val;
                upd(key, arr);
              };
              const addArr = (key, blank) => upd(key, [...(sub[key] || []), blank]);
              const removeArr = (key, idx) => upd(key, (sub[key] || []).filter((_, i) => i !== idx));

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Hero / Top Banner */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '2px solid var(--accent)' }}>
                    <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: 'var(--accent)', fontWeight: 800 }}>🎯 Hero Banner — Top Section</h3>

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Kicker (italic line above title)</label>
                    <input type="text" value={sub.kicker || ''} onChange={(e) => upd('kicker', e.target.value)} placeholder="வாரந்தோறும்... வாசல் தோறும்..." style={{ ...inputStyle, fontSize: '14px', marginBottom: '12px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Main Title</label>
                    <input type="text" value={sub.title || ''} onChange={(e) => upd('title', e.target.value)} placeholder="மறைமலை முரசு!" style={{ ...inputStyle, fontSize: '16px', fontWeight: 700, marginBottom: '12px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Subtitle (shown in pill)</label>
                    <input type="text" value={sub.subtitle || ''} onChange={(e) => upd('subtitle', e.target.value)} placeholder="தமிழ் வார இதழ்" style={{ ...inputStyle, fontSize: '13px' }} />
                  </div>

                  {/* Pricing Cards */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: 700 }}>💰 Pricing — Two Cards</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div style={{ padding: '14px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '8px' }}>📰 Single Issue</div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>Label</label>
                        <input type="text" value={sub.singlePriceLabel || ''} onChange={(e) => upd('singlePriceLabel', e.target.value)} placeholder="தனி மலர் விலை" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>Price</label>
                        <input type="text" value={sub.singlePrice || ''} onChange={(e) => upd('singlePrice', e.target.value)} placeholder="ரூ. 5/-" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', fontWeight: 700 }} />
                      </div>

                      <div style={{ padding: '14px', background: '#FEF2F2', borderRadius: '8px', border: '2px solid var(--accent)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>⭐ Yearly Subscription (Featured)</div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>Label</label>
                        <input type="text" value={sub.yearlyLabel || ''} onChange={(e) => upd('yearlyLabel', e.target.value)} placeholder="ஆண்டு சந்தா" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', marginBottom: '8px' }} />
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>Price</label>
                        <input type="text" value={sub.yearlyPrice || ''} onChange={(e) => upd('yearlyPrice', e.target.value)} placeholder="ரூ. 260/-" style={{ ...inputStyle, fontSize: '13px', padding: '6px 10px', fontWeight: 700, marginBottom: '8px' }} />
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>Note (italic below price)</label>
                        <input type="text" value={sub.yearlyNote || ''} onChange={(e) => upd('yearlyNote', e.target.value)} placeholder="மட்டுமே!" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px' }} />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Description */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: 700 }}>📬 Delivery Highlight Box</h3>

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Headline (red text)</label>
                    <input type="text" value={sub.deliveryHeadline || ''} onChange={(e) => upd('deliveryHeadline', e.target.value)} placeholder="தபால் மூலம் உங்கள் இல்லம் தேடி வருகிறது!" style={{ ...inputStyle, fontSize: '14px', fontWeight: 700, marginBottom: '12px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Description Paragraph</label>
                    <textarea rows="5" value={sub.deliveryDesc || ''} onChange={(e) => upd('deliveryDesc', e.target.value)} placeholder="துல்லியமான செய்திகள், நேர்மையான..." style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} />
                  </div>

                  {/* Benefits */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '17px', margin: 0, fontWeight: 700 }}>✅ Benefits / Features</h3>
                      <button type="button" onClick={() => addArr('benefits', 'புதிய சிறப்பு அம்சம்')} style={{ padding: '6px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>+ Add Benefit</button>
                    </div>
                    {(sub.benefits || []).map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                        <span style={{ width: '24px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" value={b || ''} onChange={(e) => updArr('benefits', i, e.target.value)} placeholder="Benefit text" style={{ ...inputStyle, fontSize: '12px', padding: '6px 10px', flex: 1 }} />
                        <button type="button" onClick={() => removeArr('benefits', i)} style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '4px 9px', borderRadius: '4px', fontWeight: 700 }}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* GPay Section */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '2px dashed var(--accent)' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', color: 'var(--accent)', fontWeight: 700 }}>📱 GPay / UPI Payment Number</h3>

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Label (above number)</label>
                    <input type="text" value={sub.gpayLabel || ''} onChange={(e) => upd('gpayLabel', e.target.value)} placeholder="சந்தா செலுத்த வேண்டிய GPay எண்" style={{ ...inputStyle, fontSize: '13px', marginBottom: '12px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>GPay Number (large display)</label>
                    <input type="text" value={sub.gpayNumber || ''} onChange={(e) => upd('gpayNumber', e.target.value)} placeholder="72000 73980" style={{ ...inputStyle, fontSize: '20px', fontWeight: 700, padding: '12px', letterSpacing: '0.05em' }} />
                  </div>

                  {/* Address */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: 700 }}>📍 Office Address Card</h3>

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Card Heading</label>
                    <input type="text" value={sub.addressLabel || ''} onChange={(e) => upd('addressLabel', e.target.value)} placeholder="தொடர்பு மற்றும் இதழ் முகவரி" style={{ ...inputStyle, fontSize: '13px', marginBottom: '12px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Centre Name (bold first line)</label>
                    <input type="text" value={sub.addressName || ''} onChange={(e) => upd('addressName', e.target.value)} placeholder="மறைமலை நகர் இ-சேவை மையம்," style={{ ...inputStyle, fontSize: '13px', marginBottom: '8px', fontWeight: 600 }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Address Line 1</label>
                    <input type="text" value={sub.addressLine1 || ''} onChange={(e) => upd('addressLine1', e.target.value)} placeholder="எண்: 112, எல்.ஐ.சி (LIG), NH-1," style={{ ...inputStyle, fontSize: '13px', marginBottom: '8px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Address Line 2</label>
                    <input type="text" value={sub.addressLine2 || ''} onChange={(e) => upd('addressLine2', e.target.value)} placeholder="டாக்டர் அம்பேத்கர் தெரு," style={{ ...inputStyle, fontSize: '13px', marginBottom: '8px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Address Line 3</label>
                    <input type="text" value={sub.addressLine3 || ''} onChange={(e) => upd('addressLine3', e.target.value)} placeholder="மறைமலை நகர்," style={{ ...inputStyle, fontSize: '13px', marginBottom: '8px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Address Line 4 (Pincode — shown in red)</label>
                    <input type="text" value={sub.addressLine4 || ''} onChange={(e) => upd('addressLine4', e.target.value)} placeholder="செங்கல்பட்டு மாவட்டம் - 603209." style={{ ...inputStyle, fontSize: '13px', fontWeight: 700 }} />
                  </div>

                  {/* Phone Card */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', fontWeight: 700 }}>📞 Phone Card</h3>

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Card Heading</label>
                    <input type="text" value={sub.phoneLabel || ''} onChange={(e) => upd('phoneLabel', e.target.value)} placeholder="அலைபேசி எண்" style={{ ...inputStyle, fontSize: '13px', marginBottom: '12px' }} />

                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Phone Number (clickable on mobile)</label>
                    <input type="text" value={sub.phoneNumber || ''} onChange={(e) => upd('phoneNumber', e.target.value)} placeholder="94441 12294" style={{ ...inputStyle, fontSize: '18px', fontWeight: 700, padding: '10px 12px', letterSpacing: '0.03em' }} />
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSavePages} style={{ padding: '12px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 12px rgba(200, 16, 46, 0.2)' }}>💾 Save All Page Content</button>
            </div>
          </div>
        );
      }
      case 'categories':
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '32px', color: '#111827', fontWeight: '700', letterSpacing: '-0.02em' }}>Categories Management</h2>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ flex: '1', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '24px', marginTop: 0, color: '#111827', fontWeight: '700' }}>Add New Category</h3>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Category Name</label>
                  <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. தொழில்நுட்பம்" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Slug</label>
                  <input type="text" value={newCatSlug} onChange={e => setNewCatSlug(e.target.value)} placeholder="e.g. technology" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>URL-friendly version of the name.</div>
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Parent Category (Optional)</label>
                  <select value={newCatParent} onChange={e => setNewCatParent(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E") no-repeat right 16px center/16px' }}>
                    <option value="">None (Top Level Category)</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>Select a parent if this is a subcategory to appear in the Navbar dropdown.</div>
                </div>
                <button onClick={handleAddCategory} style={{ padding: '12px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', width: '100%', fontSize: '15px', boxShadow: '0 4px 6px rgba(200, 16, 46, 0.2)' }}>Add Category</button>
              </div>

              <div style={{ flex: '2', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>
                      <th style={{ padding: '20px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                      <th style={{ padding: '20px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slug</th>
                      <th style={{ padding: '20px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Count</th>
                      <th style={{ padding: '20px 24px', fontWeight: '600', color: '#6B7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '20px 24px', fontWeight: '600', color: '#111827' }}>{c.name}</td>
                        <td style={{ padding: '20px 24px', color: '#6B7280', fontSize: '14px' }}>{c.slug}</td>
                        <td style={{ padding: '20px 24px', color: '#6B7280', fontSize: '14px' }}>
                          <span style={{ background: '#F3F4F6', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>{c.count} items</span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteCategory(c.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '14px', fontWeight: '600', padding: '8px 12px', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'media':
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Media Library</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Manage your images, videos, and uploaded documents.</p>
              </div>
              <div style={{ display: 'flex' }}>
                <input type="file" id="media-library-upload" style={{ display: 'none' }} accept="image/*,video/*,.pdf" onChange={(e) => {
                  if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      let fType = 'Documents';
                      if (file.type.includes('image')) fType = 'Images';
                      if (file.type.includes('video')) fType = 'Videos';
                      const newMedia = { id: Date.now(), url: reader.result, name: file.name, size: (file.size / 1024).toFixed(0) + ' KB', type: fType };
                      const updatedMedia = [newMedia, ...media];
                      setMedia(updatedMedia);
                      localStorage.setItem('customMedia', JSON.stringify(updatedMedia));
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
                <label htmlFor="media-library-upload" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px rgba(200, 16, 46, 0.2)' }}>
                  <Icons.Plus /> Upload File
                </label>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                {['All Media', 'Images', 'Videos', 'Documents'].map((filter) => {
                  const isActive = activeMediaFilter === filter;
                  return (
                    <button key={filter} onClick={() => setActiveMediaFilter(filter)} style={{ padding: '8px 16px', background: isActive ? '#111827' : '#F3F4F6', color: isActive ? '#fff' : '#4B5563', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>{filter}</button>
                  )
                })}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {filteredMedia.map(m => (
                <div key={m.id} style={{ position: 'relative', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.querySelector('.overlay').style.opacity = '1'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.querySelector('.overlay').style.opacity = '0'; }}>
                  <div style={{ height: '180px', width: '100%', background: `url(${m.url}) center/cover no-repeat`, position: 'relative' }}>
                    {/* Hover Overlay */}
                    <div className="overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 24, 39, 0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <button title="Copy Link" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={() => alert('Link copied to clipboard!')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                      <button title="Delete" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                    <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{m.size}</span>
                      <span>JPG</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div style={{ maxWidth: '800px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Site Settings</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Configure your portal's global identity and preferences.</p>
              </div>
              <button style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px rgba(200, 16, 46, 0.2)' }}>Save Changes</button>
            </div>

            <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 24px 0', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', color: '#111827' }}>General Information</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Site Title</label>
                <input type="text" defaultValue="மறைமலை முரசு" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Tagline</label>
                <input type="text" defaultValue="உண்மையின் உரைவிடம்" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
              </div>

              <div style={{ marginBottom: '24px', padding: '16px', background: '#FEF3F2', border: '2px solid #FCA5A5', borderRadius: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#991B1B', fontSize: '14px' }}>📋 RNI Number (top utility bar)</label>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6B7280' }}>Registrar of Newspapers for India registration number — shown in the small black bar at the very top of the website.</p>
                <input
                  type="text"
                  value={siteSettings.rniNumber || ''}
                  onChange={e => {
                    const next = { ...siteSettings, rniNumber: e.target.value };
                    setSiteSettings(next);
                    try {
                      localStorage.setItem('customSiteSettings', JSON.stringify(next));
                      notifyChange('customSiteSettings');
                    } catch (err) { /* ignore */ }
                  }}
                  placeholder="RNI.No. TNTAM / 2023 / 88613"
                  style={{ ...inputStyle, fontFamily: 'monospace', fontWeight: 600 }}
                />
                <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#9CA3AF' }}>Tip: leave blank to hide the RNI number entirely.</p>
              </div>

              {/* Web3Forms settings for the contact form */}
              <div style={{ marginBottom: '24px', padding: '16px', background: '#ECFDF5', border: '2px solid #6EE7B7', borderRadius: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#065F46', fontSize: '14px' }}>📧 Web3Forms — Contact Form Backend</label>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569' }}>
                  When a visitor submits the contact form on <strong>/contact</strong>, Web3Forms forwards the message to your registered inbox — no backend required.
                  Get a free access key (250 submissions/month) at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: 600 }}>web3forms.com</a>.
                </p>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>Access Key</label>
                  <input
                    type="text"
                    value={siteSettings.web3formsAccessKey || ''}
                    onChange={e => {
                      const next = { ...siteSettings, web3formsAccessKey: e.target.value };
                      setSiteSettings(next);
                      try { localStorage.setItem('customSiteSettings', JSON.stringify(next)); notifyChange('customSiteSettings'); } catch (err) {}
                    }}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '13px', padding: '8px 10px', letterSpacing: '0.02em' }}
                  />
                </div>
                <p style={{ margin: '12px 0 0 0', fontSize: '11px', color: '#64748B' }}>
                  💡 The form sends these fields to your inbox: <code>name</code>, <code>email</code>, <code>phone</code>, <code>enquiry_type</code>, <code>message</code>, plus metadata (<code>site_name</code>, <code>submitted_at</code>, <code>source</code>). Configure the recipient email at web3forms.com → My Forms.
                </p>
              </div>

              <h3 style={{ fontSize: '18px', margin: '40px 0 24px 0', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', color: '#111827' }}>Social Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '120px', fontWeight: '600', color: '#4B5563', fontSize: '14px' }}>Facebook</div>
                  <input type="text" placeholder="https://facebook.com/..." style={{ ...inputStyle, flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '120px', fontWeight: '600', color: '#4B5563', fontSize: '14px' }}>Twitter (X)</div>
                  <input type="text" placeholder="https://twitter.com/..." style={{ ...inputStyle, flex: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '120px', fontWeight: '600', color: '#4B5563', fontSize: '14px' }}>YouTube</div>
                  <input type="text" placeholder="https://youtube.com/..." style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>

              {/* ===== SEARCH OVERLAY CHIPS ===== */}
              {(() => {
                const NAVBAR_PAGES = [
                  { label: 'முகப்பு', href: '/' },
                  { label: 'தலைப்புச் செய்திகள்', href: '/headlines' },
                  { label: 'சட்டம் முரசு', href: '/law' },
                  { label: 'ஜோதிடம்', href: '/astrology' },
                  { label: 'சினிமா', href: '/cinema' },
                  { label: 'விளையாட்டு', href: '/sports' },
                  { label: 'அழகுக் குறிப்பு', href: '/beauty' },
                  { label: 'சமையல்', href: '/cooking' },
                  { label: 'இ-பேப்பர்', href: '/epaper' },
                  { label: 'தொடர்பு', href: '/contact' },
                  { label: 'கட்டுரை', href: '/article' }
                ];
                const chips = JSON.parse(localStorage.getItem('customSearchChips') || 'null') || [
                  { label: 'தலைப்புச் செய்திகள்', href: '/headlines' },
                  { label: 'சட்டம் முரசு', href: '/law' },
                  { label: 'ஜோதிடம்', href: '/astrology' },
                  { label: 'சினிமா', href: '/cinema' },
                  { label: 'விளையாட்டு', href: '/sports' },
                  { label: 'அழகுக் குறிப்பு', href: '/beauty' },
                  { label: 'சமையல்', href: '/cooking' },
                  { label: 'இ-பேப்பர்', href: '/epaper' },
                  { label: 'தொடர்பு', href: '/contact' }
                ];
                const saveChips = (next) => {
                  localStorage.setItem('customSearchChips', JSON.stringify(next));
                  notifyChange('customSearchChips');
                  window.location.reload();
                };
                const updChip = (i, field, val) => saveChips(chips.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
                const addChip = () => saveChips([...chips, { label: 'புதிய', href: '/' }]);
                const removeChip = (i) => saveChips(chips.filter((_, idx) => idx !== i));
                const moveChip = (i, dir) => {
                  const next = [...chips];
                  const target = i + dir;
                  if (target < 0 || target >= next.length) return;
                  [next[i], next[target]] = [next[target], next[i]];
                  saveChips(next);
                };
                const resetToNavbar = () => {
                  if (window.confirm('Reset search chips to default navbar pages?')) {
                    saveChips(NAVBAR_PAGES.filter(p => p.href !== '/' && p.href !== '/article'));
                  }
                };

                return (
                  <>
                    <h3 style={{ fontSize: '18px', margin: '40px 0 8px 0', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', color: '#111827' }}>🔍 Search Overlay Chips</h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px 0' }}>
                      These are the <strong>"பிரபல தேடல்கள்"</strong> quick-link pills shown in the search overlay (click search icon in header). Clicking a chip navigates the visitor to that page.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '14px' }}>
                      <button type="button" onClick={resetToNavbar} style={{ padding: '7px 14px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '5px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>↻ Reset to Navbar Pages</button>
                      <button type="button" onClick={addChip} style={{ padding: '7px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>+ Add Chip</button>
                    </div>

                    {chips.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', padding: '10px', background: '#FAFAF7', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</span>
                        <input type="text" defaultValue={c.label || ''} onBlur={(e) => updChip(i, 'label', e.target.value)} placeholder="Label" style={{ ...inputStyle, fontSize: '13px', padding: '7px 10px', flex: 2 }} />
                        <select defaultValue={c.href || ''} onChange={(e) => updChip(i, 'href', e.target.value)} style={{ ...inputStyle, fontSize: '12px', padding: '7px 10px', flex: 2, cursor: 'pointer' }}>
                          <option value="">— Pick a page —</option>
                          {NAVBAR_PAGES.map(p => (
                            <option key={p.href} value={p.href}>{p.label} ({p.href})</option>
                          ))}
                          {!NAVBAR_PAGES.find(p => p.href === c.href) && c.href && (
                            <option value={c.href}>Custom: {c.href}</option>
                          )}
                        </select>
                        <input type="text" defaultValue={c.href || ''} onBlur={(e) => updChip(i, 'href', e.target.value)} placeholder="/custom-url" style={{ ...inputStyle, fontSize: '11px', padding: '6px 8px', width: '130px' }} title="Or type a custom URL directly" />
                        <button type="button" onClick={() => moveChip(i, -1)} disabled={i === 0} style={{ background: '#fff', border: '1px solid #D1D5DB', color: i === 0 ? '#D1D5DB' : '#374151', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: '14px', padding: '5px 9px', borderRadius: '4px' }}>↑</button>
                        <button type="button" onClick={() => moveChip(i, 1)} disabled={i === chips.length - 1} style={{ background: '#fff', border: '1px solid #D1D5DB', color: i === chips.length - 1 ? '#D1D5DB' : '#374151', cursor: i === chips.length - 1 ? 'not-allowed' : 'pointer', fontSize: '14px', padding: '5px 9px', borderRadius: '4px' }}>↓</button>
                        <button type="button" onClick={() => removeChip(i)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', fontSize: '11px', padding: '5px 9px', borderRadius: '4px', fontWeight: '700' }}>✕</button>
                      </div>
                    ))}

                    {/* Live preview */}
                    <div style={{ marginTop: '20px', padding: '16px', background: '#1A1614', borderRadius: '10px' }}>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Live preview (how it appears in search overlay)</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {chips.map((c, i) => (
                          <span key={i} style={{ display: 'inline-block', padding: '7px 14px', border: '1px solid #4B5563', borderRadius: '20px', color: '#fff', fontSize: '13px', background: 'transparent' }}>
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>
          </div>
        );
      case 'ads':
        return (
          <div style={{ maxWidth: '800px', animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Ad Manager</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Configure your own House Advertisements. Changes sync to every browser via the shared Ads API.</p>
              </div>
              <button
                style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px rgba(200, 16, 46, 0.2)' }}
                onClick={async () => {
                  const result = await saveAdSettingsToApi(adSettings);
                  if (result.ok) {
                    alert('✅ Ad Settings Saved!\n\nPushed to the shared Ads API — every browser and device will see the changes within 10 seconds.');
                  } else {
                    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
                    if (isLocalhost) {
                      alert('⚠️ Saved locally only.\n\nThe Ads API server is not reachable on http://localhost:5050.\n\nStart the dev server in a new terminal:\ncd server\nnpm start\n\nThen click Save Ad Settings again.');
                    } else {
                      alert('⚠️ Saved to this browser only.\n\nThe production Ads API backend is not deployed yet, so changes will not sync to other visitors of ' + window.location.hostname + '.\n\nTo make ads visible to everyone, the backend must be deployed on Hostinger (Node.js App) or Vercel.\n\nSee VERCEL-DEPLOY.md or GO-LIVE.md in the project root for step-by-step deployment instructions.');
                    }
                  }
                }}
              >
                Save Ad Settings
              </button>
            </div>

            {/* Connection status badge — shows whether the shared Ads API is reachable */}
            <AdsApiStatus />


            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              


              {/* House Ads Card */}
              <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderTop: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M3 3h18v18H3zM12 8v8m-4-4h8"/></svg> Custom House Ads (My Ads)
                  </h3>
                  <span style={{ fontSize: '12px', background: '#FEF2F2', color: '#EF4444', padding: '4px 12px', borderRadius: '12px', fontWeight: '600' }}>Highest Priority</span>
                </div>
                
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Ad Placement Location</label>
                      <select value={adSettings.houseLocation} onChange={e => setAdSettings({...adSettings, houseLocation: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option>Global Site-Wide Billboard (728x250)</option>
                        <option>Homepage Leaderboard (728x90)</option>
                        <option>Wide Billboard (970x250)</option>
                        <option>Sidebar Sticky Ad (300x600)</option>
                        <option>Sidebar Small (300x360)</option>
                        <option>In-Article Rectangle (300x250)</option>
                        <option>Header Right Square (250x250)</option>
                        <option>Mobile Anchor (320x100)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Ad Image URL</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={adSettings.houseImageUrl} onChange={e => setAdSettings({...adSettings, houseImageUrl: e.target.value})} placeholder="https://example.com/banner.jpg" style={{ ...inputStyle, flex: 1 }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
                        <label style={{ padding: '0 16px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#4B5563', display: 'flex', alignItems: 'center' }}>
                          Browse
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setAdSettings({...adSettings, houseImageUrl: reader.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Target Destination Link</label>
                      <input type="text" value={adSettings.houseLink} onChange={e => setAdSettings({...adSettings, houseLink: e.target.value})} placeholder="https://your-sponsor.com" style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)' }} onBlur={e => { e.currentTarget.style.borderColor = '#D1D5DB' }} />
                    </div>
                  </div>
                  
                  {/* Live Preview Box */}
                  <div style={{ width: '250px', background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                    <div style={{ width: '100%', height: '80px', background: adSettings.houseImageUrl ? `url(${adSettings.houseImageUrl}) center/cover no-repeat` : '#E5E7EB', borderRadius: '4px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '12px', fontWeight: '600', boxShadow: adSettings.houseImageUrl ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>
                      {!adSettings.houseImageUrl && '728 x 90'}
                    </div>
                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>Live Ad Preview</span>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px', margin: 0 }}>{adSettings.houseImageUrl ? 'Preview updated.' : 'Upload an image to see how it will appear on the site.'}</p>
                  </div>
                </div>
              </div>

              {/* ============== PER-SLOT AD MANAGER ============== */}
              <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '2px solid var(--accent)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginTop: '32px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', margin: '0 0 6px 0', color: '#111827', fontWeight: '700' }}>📐 Per-Slot Ad Manager (every ad box on every page)</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                    Upload a unique image for <strong>each</strong> ad placement. These override Google/Meta ads on that specific slot only.
                    Auto-saves on upload — refresh the live site to see changes.
                  </p>
                </div>

                {(() => {
                  // All known ad slots in the site
                  const SLOTS = [
                    { id: 'header-right-sq',         size: '250x250', label: 'Header Right Square',                page: 'Every page (header)' },
                    { id: 'home-leaderboard-1',      size: '970x350', label: 'Home — Top Stories Billboard (Tall)', page: 'Homepage' },
                    { id: 'home-billboard-samsung',  size: '970x350', label: 'Home — Sponsor Billboard (Tall)',   page: 'Homepage' },
                    { id: 'home-bottom-billboard',   size: '970x350', label: 'Home — Bottom Billboard (after State + National)', page: 'Homepage' },
                    { id: 'home-infeed-meta',        size: '728x120', label: 'Home — Meta In-Feed Strip',          page: 'Homepage' },
                    { id: 'home-hero-sidebar-1',     size: '300x250', label: 'Home — Hero Sidebar (Rectangle)',    page: 'Homepage' },
                    { id: 'headlines-leaderboard',   size: '970x350', label: 'Headlines — Leaderboard (Tall Billboard)', page: '/headlines' },
                    { id: 'headlines-mid-ad',        size: '970x350', label: 'Headlines — Mid Article (Tall Billboard)', page: '/headlines' },
                    { id: 'headlines-inline-2',      size: '970x350', label: 'Headlines — Inline 2 (Tall Billboard)',    page: '/headlines' },
                    { id: 'headlines-inline-3',      size: '970x350', label: 'Headlines — Inline 3 (Tall Billboard)',    page: '/headlines' },
                    { id: 'headlines-sidebar-1',     size: '300x600', label: 'Headlines — Sidebar Top (Half Page)', page: '/headlines' },
                    { id: 'headlines-sidebar-2',     size: '300x250', label: 'Headlines — Sidebar Mid (Rectangle)', page: '/headlines' },
                    { id: 'headlines-sidebar-3',     size: '300x250', label: 'Headlines — Sidebar Bottom (Rect.)', page: '/headlines' },
                    { id: 'headlines-sidebar-4',     size: '300x600', label: 'Headlines — Sidebar #4 (Half Page Tall)', page: '/headlines' },
                    { id: 'headlines-sidebar-5',     size: '300x600', label: 'Headlines — Sidebar #5 (Half Page Tall)', page: '/headlines' },
                    { id: 'headlines-sidebar-6',     size: '300x250', label: 'Headlines — Sidebar #6 Bottom Anchor (Rect.)', page: '/headlines' },
                    { id: 'headlines-photo-story-side', size: '300x900', label: 'Headlines — Photo Story Right (Tall Skyscraper)', page: '/headlines' },
                    { id: 'astro-sidebar',           size: '300x600', label: 'Astrology — Sidebar Half-Page',      page: '/astrology' },
                    { id: 'astro-sidebar-2',         size: '300x250', label: 'Astrology — Sidebar Mid (Rectangle)', page: '/astrology' },
                    { id: 'astro-sidebar-3',         size: '300x250', label: 'Astrology — Sidebar Bottom (Rect.)', page: '/astrology' },
                    { id: 'astro-inline-1',          size: '970x350', label: 'Astrology — Inline 1 (Tall Billboard, after Panchangam)', page: '/astrology' },
                    { id: 'astro-inline-2',          size: '970x350', label: 'Astrology — Inline 2 (Tall Billboard, after Rasi)', page: '/astrology' },
                    { id: 'law-mid-ad',              size: '970x250', label: 'Law — Mid-Article Billboard',        page: '/law' },
                    { id: 'law-sidebar-1',           size: '300x600', label: 'Law — Sidebar Top (Half Page)',      page: '/law' },
                    { id: 'law-sidebar-2',           size: '300x250', label: 'Law — Sidebar Mid (Rectangle)',      page: '/law' },
                    { id: 'law-sidebar-3',           size: '300x600', label: 'Law — Sidebar Bottom (Half Page)',   page: '/law' },
                    { id: 'law-sidebar-4',           size: '300x250', label: 'Law — Sidebar #4 (compact, next to Live News)', page: '/law' },
                    { id: 'cinema-mid-ad',           size: '970x90',  label: 'Cinema — Mid Leaderboard',           page: '/cinema' },
                    { id: 'cinema-sidebar',          size: '300x600', label: 'Cinema — Sidebar Top (Half Page)',   page: '/cinema' },
                    { id: 'cinema-sidebar-2',        size: '300x250', label: 'Cinema — Sidebar Mid (Rectangle)',   page: '/cinema' },
                    { id: 'cinema-sidebar-3',        size: '300x600', label: 'Cinema — Sidebar Bottom (Half Page)',page: '/cinema' },
                    { id: 'cinema-inline-1',         size: '970x90',  label: 'Cinema — Inline 1 (after Popular)',  page: '/cinema' },
                    { id: 'cinema-inline-2',         size: '970x90',  label: 'Cinema — Inline 2 (after Box Office)', page: '/cinema' },
                    { id: 'cinema-sidebar-4',        size: '300x600', label: 'Cinema — Sidebar #4 (next to Video News)', page: '/cinema' },
                    { id: 'cinema-sidebar-5',        size: '300x250', label: 'Cinema — Sidebar #5 (next to Box Office)', page: '/cinema' },
                    { id: 'cinema-sidebar-6',        size: '300x600', label: 'Cinema — Sidebar #6 (next to Photo Gallery)', page: '/cinema' },
                    { id: 'sports-mid-ad',           size: '970x90',  label: 'Sports — Mid Leaderboard',           page: '/sports' },
                    { id: 'sports-inline-2',         size: '970x90',  label: 'Sports — Inline 2 (after Star Players)', page: '/sports' },
                    { id: 'sports-inline-3',         size: '970x90',  label: 'Sports — Inline 3 (after Photos)',   page: '/sports' },
                    { id: 'sports-sidebar',          size: '300x600', label: 'Sports — Sidebar Half-Page',         page: '/sports' },
                    { id: 'sports-sidebar-2',        size: '300x250', label: 'Sports — Sidebar Mid (Rectangle)',   page: '/sports' },
                    { id: 'sports-sidebar-3',        size: '300x250', label: 'Sports — Sidebar Bottom (Rectangle)', page: '/sports' },
                    { id: 'beauty-mid-ad',           size: '970x90',  label: 'Beauty — Mid Leaderboard',           page: '/beauty' },
                    { id: 'beauty-sidebar-1',        size: '300x250', label: 'Beauty — Sidebar Top (Rectangle)',   page: '/beauty' },
                    { id: 'beauty-sidebar-2',        size: '300x600', label: 'Beauty — Sidebar Mid (Half Page)',   page: '/beauty' },
                    { id: 'beauty-sidebar-3',        size: '300x250', label: 'Beauty — Sidebar Bottom (Rectangle)',page: '/beauty' },
                    { id: 'beauty-meta-ad',          size: '728x120', label: 'Beauty — Meta Audience Strip',       page: '/beauty' },
                    { id: 'beauty-inline-1',         size: '970x90',  label: 'Beauty — Inline 1 (after Skincare)', page: '/beauty' },
                    { id: 'beauty-inline-2',         size: '970x90',  label: 'Beauty — Inline 2 (after Natural Tips)', page: '/beauty' },
                    { id: 'cooking-mid-ad',          size: '970x90',  label: 'Cooking — Mid Leaderboard',          page: '/cooking' },
                    { id: 'cooking-sidebar-1',       size: '300x250', label: 'Cooking — Sidebar Rectangle',        page: '/cooking' },
                    { id: 'cooking-sidebar-2',       size: '300x600', label: 'Cooking — Sidebar Half-Page',        page: '/cooking' },
                    { id: 'cooking-meta-ad',         size: '728x120', label: 'Cooking — Meta Audience Strip',      page: '/cooking' },
                    { id: 'category-mid-ad',         size: '970x250', label: 'Category — Mid Billboard',           page: '/category' },
                    { id: 'contact-leader-1',        size: '970x90',  label: 'Contact — Top Leaderboard',          page: '/contact' },
                    { id: 'contact-rail-1',          size: '300x250', label: 'Contact — Sidebar Rectangle',        page: '/contact' }
                  ];

                  const houseAds = adSettings.houseAds || {};
                  const updateSlot = (slotId, field, value) => {
                    const updated = {
                      ...adSettings,
                      houseAds: {
                        ...houseAds,
                        [slotId]: { ...(houseAds[slotId] || {}), [field]: value }
                      }
                    };
                    setAdSettings(updated);
                    // Push to shared backend so every browser/device sees the
                    // change. saveAdSettingsToApi also writes the local cache
                    // and fires storage events for in-page React updates.
                    saveAdSettingsToApi(updated).then(result => {
                      if (!result.ok) {
                        console.warn('Slot update saved locally only — backend unreachable');
                      }
                    });
                  };
                  const removeSlot = (slotId) => {
                    const newHouseAds = { ...houseAds };
                    delete newHouseAds[slotId];
                    const updated = { ...adSettings, houseAds: newHouseAds };
                    setAdSettings(updated);
                    saveAdSettingsToApi(updated).then(result => {
                      if (!result.ok) {
                        console.warn('Slot removal saved locally only — backend unreachable');
                      }
                    });
                  };

                  return (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {SLOTS.map(slot => {
                        const config = houseAds[slot.id] || {};
                        const hasImage = !!config.image;
                        const hasVideo = !!config.video;
                        const hasContent = hasImage || hasVideo;
                        const fit = config.fit === 'contain' ? 'contain'
                                   : config.fit === 'natural' ? 'natural'
                                   : 'cover';
                        const bg = config.bg || '#000000';
                        return (
                          <div key={slot.id} style={{ padding: '14px', background: hasContent ? '#F0FDF4' : '#F9FAFB', borderRadius: '8px', border: `1px solid ${hasContent ? '#86EFAC' : '#E5E7EB'}` }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                              {/* Preview — shows image or video icon */}
                              <div style={{
                                flex: '0 0 100px',
                                height: '60px',
                                background: hasImage
                                  ? `${bg} url(${config.image}) center/${fit} no-repeat`
                                  : hasVideo
                                    ? '#111'
                                    : 'repeating-linear-gradient(45deg, #E5E7EB 0, #E5E7EB 8px, #F3F4F6 8px, #F3F4F6 16px)',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                color: hasVideo ? '#fff' : '#9CA3AF',
                                fontFamily: 'monospace',
                                position: 'relative'
                              }}>
                                {hasVideo && !hasImage && (
                                  <span style={{ fontSize: '22px' }}>▶</span>
                                )}
                                {!hasContent && slot.size}
                              </div>

                              {/* Slot info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>{slot.label}</span>
                                  <span style={{ fontSize: '10px', padding: '2px 6px', background: '#E0E7FF', color: '#3730A3', borderRadius: '3px', fontFamily: 'monospace', fontWeight: '600' }}>{slot.size}</span>
                                  <span style={{ fontSize: '11px', color: '#6B7280' }}>{slot.page}</span>
                                  {hasImage && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#059669', color: '#fff', borderRadius: '3px', fontWeight: '700' }}>✓ IMAGE</span>}
                                  {hasVideo && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#7C3AED', color: '#fff', borderRadius: '3px', fontWeight: '700' }}>▶ VIDEO</span>}
                                </div>

                                {/* Row 1 — link URL + image upload + media picker */}
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                                  <input
                                    type="text"
                                    placeholder="Target link URL (https://...)"
                                    value={config.link || ''}
                                    onChange={(e) => updateSlot(slot.id, 'link', e.target.value)}
                                    style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1, minWidth: '200px' }}
                                  />
                                  <label style={{ padding: '5px 10px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                    {hasImage ? '↻ Replace Image' : '+ Upload Image'}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{ display: 'none' }}
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          updateSlot(slot.id, 'image', reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                      }}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => openMediaPicker((url) => updateSlot(slot.id, 'image', url))}
                                    style={{ padding: '5px 8px', background: '#F3F4F6', border: '1px solid #D1D5DB', color: '#374151', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                                    title="Pick from media library"
                                  >
                                    📁
                                  </button>
                                </div>

                                {/* Row 2 — video URL + fit dropdown + bg color + remove */}
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <input
                                    type="text"
                                    placeholder="▶ Video URL — YouTube / Vimeo / .mp4 (optional)"
                                    value={config.video || ''}
                                    onChange={(e) => updateSlot(slot.id, 'video', e.target.value)}
                                    style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', flex: 1, minWidth: '200px' }}
                                  />
                                  <select
                                    value={fit}
                                    onChange={(e) => updateSlot(slot.id, 'fit', e.target.value)}
                                    style={{ ...inputStyle, fontSize: '11px', padding: '5px 8px', width: '130px' }}
                                    title="Cover crops to fill • Contain letterboxes • Natural resizes the slot to match the image (full image, no bars)"
                                  >
                                    <option value="cover">Fit: Cover</option>
                                    <option value="contain">Fit: Contain</option>
                                    <option value="natural">Fit: Natural ★</option>
                                  </select>
                                  <input
                                    type="color"
                                    value={bg}
                                    onChange={(e) => updateSlot(slot.id, 'bg', e.target.value)}
                                    style={{ width: '34px', height: '28px', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                                    title="Background colour (used when Fit=Contain or for video letterbox)"
                                  />
                                  {hasContent && (
                                    <button
                                      type="button"
                                      onClick={() => removeSlot(slot.id)}
                                      style={{ padding: '5px 8px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ fontSize: '12px', color: '#374151', margin: '8px 0 0 0', padding: '14px', background: '#FAFAF7', borderRadius: '6px', lineHeight: 1.6 }}>
                        💡 <strong>How any-size content fills the slot:</strong>
                        <ul style={{ margin: '6px 0 6px 18px', padding: 0 }}>
                          <li><strong>Fit: Cover</strong> — crops the image to fill the entire box. No bars, but edges of tall/portrait images may be cropped off.</li>
                          <li><strong>Fit: Contain</strong> — shows the entire image with letterbox bars on the empty sides (use the colour picker to match your brand).</li>
                          <li><strong>Fit: Natural ★</strong> — <em>recommended for posters &amp; flyers!</em> The slot itself resizes to match the image's aspect ratio. <strong>No cropping AND no bars</strong> — the full poster shows in its original shape (portrait posters become tall slots, landscape posters become wide slots).</li>
                          <li><strong>Video URL</strong> — paste a YouTube / Vimeo / .mp4 URL. Plays muted + looped + autoplay. Use direct .mp4 files for cleanest results.</li>
                          <li><strong>Both filled?</strong> Video takes priority over image (so you can keep an image as a fallback poster).</li>
                          <li><strong>Background colour</strong> — used to letterbox <em>Contain</em>-mode images and for video bars (defaults to black).</li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        );
      case 'settings':
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#111827', margin: '0 0 8px 0', fontWeight: '700', letterSpacing: '-0.02em' }}>Site Settings</h2>
                <p style={{ color: '#6B7280', margin: 0, fontSize: '15px' }}>Dynamically update website titles as content changes week by week.</p>
              </div>
              <button onClick={handleSaveSettings} style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(200, 16, 46, 0.2)' }}>Save Settings</button>
            </div>

            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Global Site Title (Browser Tab)</label>
                <input type="text" value={siteSettings.siteTitle} onChange={e => setSiteSettings({...siteSettings, siteTitle: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Homepage Hero Title</label>
                <input type="text" value={siteSettings.heroTitle} onChange={e => setSiteSettings({...siteSettings, heroTitle: e.target.value})} style={inputStyle} />
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>Example: "தேர்தல் 2026 களம்" or "ஒலிம்பிக் சிறப்பு மலர்"</div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Homepage Section 1 Title</label>
                <input type="text" value={siteSettings.section1Title} onChange={e => setSiteSettings({...siteSettings, section1Title: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Homepage Section 2 Title</label>
                <input type="text" value={siteSettings.section2Title} onChange={e => setSiteSettings({...siteSettings, section2Title: e.target.value})} style={inputStyle} />
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: <Icons.Dashboard />, label: 'Dashboard' },
    { id: 'add', icon: <Icons.Write />, label: 'Write News' },
    { id: 'home-editor', icon: <Icons.Media />, label: 'Home Editor' },
    { id: 'pages-editor', icon: <Icons.FileText />, label: 'Pages Editor' },
    { id: 'categories', icon: <Icons.Categories />, label: 'Categories' },
    { id: 'media', icon: <Icons.Media />, label: 'Media Library' },
    { id: 'ads', icon: <Icons.Ads />, label: 'Ad Manager' },
    { id: 'settings', icon: <Icons.Settings />, label: 'Site Settings' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* SaaS Sidebar (White) — collapses to slide-out drawer on mobile */}
      <div className="admin-sidebar" style={{ width: '260px', background: '#fff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #E5E7EB', zIndex: 10 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'column' }}>
          <img src={logoSrc} alt="மறைமலை முரசு" style={{ maxWidth: '200px', width: '100%', height: 'auto', display: 'block' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--accent)', borderRadius: '20px', color: '#fff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></span>
            Admin Panel
          </div>
        </div>
        
        <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '12px' }}>Main Menu</div>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                  background: isActive ? '#FEF2F2' : 'transparent', 
                  color: isActive ? 'var(--accent)' : '#4B5563', 
                  border: 'none', borderRadius: '10px', cursor: 'pointer', 
                  fontSize: '15px', fontWeight: isActive ? '600' : '500', 
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }} 
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#111827'; } }} 
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5563'; } }}
              >
                <div style={{ color: isActive ? 'var(--accent)' : '#6B7280', display: 'flex' }}>{item.icon}</div>
                {item.label}
              </button>
            )
          })}
        </nav>
        
        <div style={{ padding: '24px 16px', borderTop: '1px solid #E5E7EB' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', fontWeight: '500', borderRadius: '10px', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#111827'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5563'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Back to Live Site
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F9FAFB' }}>

        {/* Top Header */}
        <header style={{ height: '72px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 5, gap: '12px' }}>
          {/* Mobile hamburger toggle — hidden on desktop via CSS */}
          <button
            type="button"
            className="admin-mobile-toggle"
            aria-label="Toggle sidebar"
            onClick={() => {
              const isOpen = document.body.classList.toggle('admin-sidebar-open');
              if (isOpen) {
                // Close drawer when user taps the dark overlay
                const onOverlayClick = (e) => {
                  if (e.target === document.body || !document.querySelector('.admin-sidebar')?.contains(e.target)) {
                    document.body.classList.remove('admin-sidebar-open');
                    document.removeEventListener('click', onOverlayClick, true);
                  }
                };
                setTimeout(() => document.addEventListener('click', onOverlayClick, true), 0);
              }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '0 1 320px', minWidth: 0 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F3F4F6', padding: '10px 16px', borderRadius: '8px', flex: 1, minWidth: 0 }}>
               <span style={{ color: '#9CA3AF', display: 'flex' }}><Icons.Search /></span>
               <input type="text" placeholder="Search articles, media..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '100%', color: '#111827', minWidth: 0 }} />
             </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', position: 'relative' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}>
                <Icons.Bell />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid #fff' }}></span>
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: '-80px', marginTop: '16px', width: '320px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', zIndex: 50, overflow: 'hidden', animation: 'fadeIn 0.2s ease-in-out' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#111827', fontWeight: '600' }}>Notifications</h3>
                    <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Mark all read</span>
                  </div>
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {articles.slice(0, 3).map((article, i) => (
                      <div key={i} style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                        <div>
                          <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500', marginBottom: '4px' }}>New Article Published</div>
                          <div style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.4' }}>"{article.title}" was published to {article.category}.</div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>{article.date}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '16px', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                      <div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500', marginBottom: '4px' }}>System Update</div>
                        <div style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.4' }}>Ad Manager updated. Google AdSense & Meta slots configured successfully.</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>Just now</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '13px', color: '#6B7280', fontWeight: '500', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>
                    View All Activity
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: '1px', height: '32px', background: '#E5E7EB' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Chief Editor</div>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Admin</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent) 0%, #990B22 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 6px rgba(200,16,46,0.2)' }}>CE</div>
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <main style={{ padding: '40px 48px', overflowY: 'auto', flex: 1 }}>
          {renderContent()}
        </main>
      </div>

      {/* ===== MEDIA PICKER MODAL ===== */}
      {mediaPickerCallback && (
        <div onClick={closeMediaPicker} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', maxWidth: '1000px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#111827', fontWeight: '700' }}>📁 Choose Image from Media Library</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6B7280' }}>{media.length} images available. Click any to select.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <label style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  + Upload New
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newMedia = { id: Date.now(), url: reader.result, name: file.name, size: (file.size/1024).toFixed(0) + ' KB', type: 'Images' };
                        const updated = [newMedia, ...media];
                        setMedia(updated);
                        localStorage.setItem('customMedia', JSON.stringify(updated));
                        // Auto-select the new image
                        mediaPickerCallback(reader.result);
                        closeMediaPicker();
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
                <button onClick={closeMediaPicker} style={{ padding: '8px 14px', background: '#fff', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Close</button>
              </div>
            </div>
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
              {media.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
                  <p>No media uploaded yet. Click "+ Upload New" above.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
                  {media.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { mediaPickerCallback(m.url); closeMediaPicker(); }}
                      style={{ background: '#fff', border: '2px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: 0, transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ width: '100%', aspectRatio: '4/3', background: `url(${m.url}) center/cover no-repeat`, backgroundColor: '#F3F4F6' }} />
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                        <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>{m.size}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
