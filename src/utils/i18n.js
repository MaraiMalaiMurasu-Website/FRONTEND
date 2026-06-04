/*
  i18n.js — Lightweight Tamil/English translation system
  ─────────────────────────────────────────────────────
  Persists the user's language choice in localStorage.
  Auto-re-renders any component using useLanguage() when language changes.

  Usage:
    import { useLanguage, useT } from '../utils/i18n.js';

    function MyComponent() {
      const t = useT();
      return <h1>{t('home')}</h1>;
    }

    function LanguageToggle() {
      const { lang, setLang } = useLanguage();
      return <button onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}>...</button>;
    }
*/

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'siteLanguage';
const DEFAULT_LANG = 'ta';

// ── Translation dictionary ────────────────────────────────────────────────
// Each key has Tamil + English. Add new keys here as the site grows.
export const translations = {
  // ── Utility bar (top) ──
  ePaper:           { ta: 'இ-பேப்பர்',          en: 'e-Paper' },
  podcast:          { ta: 'போட்காஸ்ட்',        en: 'Podcast' },
  subscription:     { ta: 'சந்தா',              en: 'Subscribe' },
  liveConnection:   { ta: 'நேரலை இணைப்பு',     en: 'Live Connection' },
  contactUs:        { ta: 'தொடர்பு கொள்ள',     en: 'Contact Us' },
  toggleLang_taLabel: { ta: 'ஆங்கிலம் / EN',   en: 'தமிழ் / TA' },

  // ── Masthead ──
  founded2023:      { ta: '❖ நிறுவப்பட்டது 2023 ❖', en: '❖ Founded 2023 ❖' },
  cityChennai:      { ta: 'சென்னை',             en: 'Chennai' },
  weatherHumidity:  { ta: 'ஈரப்பதம்',           en: 'Humidity' },
  weatherWind:      { ta: 'தென்மேற்கு பருவக்காற்று', en: 'South-West Monsoon Wind' },

  // ── Primary nav ──
  navHome:          { ta: 'முகப்பு',            en: 'Home' },
  navHeadlines:     { ta: 'தலைப்புச் செய்திகள்', en: 'Headlines' },
  navLaw:           { ta: 'சட்டம் முரசு',       en: 'Law' },
  navSpiritual:     { ta: 'ஆன்மீகம்',           en: 'Spiritual' },
  navAstrology:     { ta: 'ஜோதிடம்',            en: 'Astrology' },
  navCinema:        { ta: 'சினிமா',              en: 'Cinema' },
  navSports:        { ta: 'விளையாட்டு',          en: 'Sports' },
  navMore:          { ta: 'மற்றவை',              en: 'More' },
  navBeauty:        { ta: 'அழகுகுறிப்பு',        en: 'Beauty' },
  navCooking:       { ta: 'சமையல்',              en: 'Cooking' },
  navContact:       { ta: 'தொடர்பு',             en: 'Contact' },
  navSearch:        { ta: 'தேடுங்கள்...',        en: 'Search...' },

  // ── Common UI ──
  readMore:         { ta: 'மேலும் படிக்க',       en: 'Read More' },
  more:             { ta: 'மேலும் →',            en: 'More →' },
  loading:          { ta: 'ஏற்றுகிறது...',       en: 'Loading...' },
  back:             { ta: 'திரும்பு',            en: 'Back' },
  submit:           { ta: 'சமர்ப்பி',            en: 'Submit' },
  send:             { ta: 'அனுப்பு',             en: 'Send' },
  loadingArticles:  { ta: 'செய்திகள் ஏற்றப்படுகின்றன...', en: 'Loading articles...' },

  // ── Subscription page ──
  subSinglePriceLabel: { ta: 'தனி மலர் விலை',   en: 'Single Issue Price' },
  subYearlyLabel:      { ta: 'ஆண்டு சந்தா',     en: 'Yearly Subscription' },
  subBestChoice:       { ta: '★ சிறந்த தேர்வு', en: '★ Best Choice' },
  subFeatures:         { ta: 'சிறப்பு அம்சங்கள்', en: 'Special Features' },
  subUpiNote:          { ta: 'GPay / PhonePe / Paytm — அனைத்து UPI செயலிகளிலும் பணம் செலுத்தலாம்', en: 'GPay / PhonePe / Paytm — Pay via any UPI app' },
  subWorkingHours:     { ta: 'திங்கள் – சனி · காலை 9:00 – மாலை 6:00', en: 'Mon–Sat · 9:00 AM – 6:00 PM' },
  subCtaTitle:         { ta: 'இன்றே ஆண்டு சந்தாதாரராகுங்கள்!', en: 'Become an Annual Subscriber Today!' },
  subCtaDesc:          { ta: 'வாரந்தோறும் மறைமலை முரசை உங்கள் இல்லத்தில் பெறுங்கள் — ஆண்டுக்கு வெறும் ரூ. 260/- மட்டுமே', en: 'Get Maraimalai Murasu delivered to your home every week — just ₹260/- per year' },
  subCallNow:          { ta: '📞 இப்போதே அழைக்கவும்', en: '📞 Call Now' },
  breadcrumbHome:      { ta: 'முகப்பு',          en: 'Home' },

  // ── Footer ──
  footerAboutUs:    { ta: 'எங்களைப் பற்றி',     en: 'About Us' },
  footerNewsroom:   { ta: 'செய்தி அறை',         en: 'Newsroom' },
  footerAds:        { ta: 'விளம்பரம்',           en: 'Advertising' },
  footerCareers:    { ta: 'வேலை வாய்ப்புகள்',   en: 'Careers' },
  footerPrivacy:    { ta: 'தனியுரிமைக் கொள்கை', en: 'Privacy Policy' },
  footerTerms:      { ta: 'பயன்பாட்டு விதிமுறைகள்', en: 'Terms of Use' },
  footerCopyright:  { ta: '© 2026 மறைமலை முரசு. அனைத்து உரிமைகளும் உரித்தாக்கப்பட்டவை.', en: '© 2026 Maraimalai Murasu. All rights reserved.' },

  // ── Tamil months/days ──
  monthNames_ta:    { ta: ['ஜனவரி','பிப்ரவரி','மார்ச்','ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்'],
                      en: ['January','February','March','April','May','June','July','August','September','October','November','December'] },
  dayNames_ta:      { ta: ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி'],
                      en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] },
};

// ── Read current language from localStorage ───────────────────────────────
export function getCurrentLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ta') return saved;
  } catch {}
  return DEFAULT_LANG;
}

// ── Set language, persist, broadcast change ───────────────────────────────
export function setLang(lang) {
  if (lang !== 'en' && lang !== 'ta') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    // Notify same-tab listeners (storage event only fires across tabs)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  } catch {}
}

// ── Translate a single key in the current language ────────────────────────
export function t(key, lang = null) {
  const useLang = lang || getCurrentLang();
  const entry = translations[key];
  if (!entry) return key; // fallback: return the key itself
  return entry[useLang] ?? entry.ta ?? key;
}

// ── Translate a bilingual field — admin can store { ta: '…', en: '…' } ────
//    or just a plain string (which is treated as Tamil).
//    Usage: bi(content.title) where title is either string or { ta, en }
export function bi(value, lang = null) {
  const useLang = lang || getCurrentLang();
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && (value.ta || value.en)) {
    return value[useLang] || value.ta || value.en || '';
  }
  return String(value);
}

// ── React hook: returns { lang, setLang } and re-renders on change ────────
export function useLanguage() {
  const [lang, setLangState] = useState(getCurrentLang());

  useEffect(() => {
    const onChange = (e) => {
      if (e && e.detail && e.detail.lang) setLangState(e.detail.lang);
      else setLangState(getCurrentLang());
    };
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setLangState(getCurrentLang());
    };
    window.addEventListener('languageChanged', onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('languageChanged', onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = lang === 'ta' ? 'en' : 'ta';
    setLang(next);
  }, [lang]);

  return { lang, setLang, toggle };
}

// ── React hook: translation function bound to current language ────────────
export function useT() {
  const { lang } = useLanguage();
  return useCallback((key) => t(key, lang), [lang]);
}

// ── React hook: bilingual field reader bound to current language ──────────
export function useBi() {
  const { lang } = useLanguage();
  return useCallback((value) => bi(value, lang), [lang]);
}
