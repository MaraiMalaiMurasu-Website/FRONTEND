import { useState, useEffect } from 'react';
import { UtilityBar, Masthead, PrimaryNav, SubNav, Ticker, SearchOverlay, Footer } from './components/Chrome.jsx';
import HomePage from './pages/HomePage.jsx';
import AstrologyPage from './pages/AstrologyPage.jsx';
import SpiritualPage from './pages/SpiritualPage.jsx';
import MorePage from './pages/MorePage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import HeadlinesPage from './pages/HeadlinesPage.jsx';
import CinemaPage from './pages/CinemaPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import SportsPage from './pages/SportsPage.jsx';
import BeautyPage from './pages/BeautyPage.jsx';
import CookingPage from './pages/CookingPage.jsx';
import LawPage from './pages/LawPage.jsx';
import EPaperPage from './pages/EPaperPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { runHomeContentMigration } from './utils/contentMigration.js';
import { startAdSettingsPolling } from './utils/adsApi.js';
import { installSyncInterceptor, pullAllContent, startContentPolling } from './utils/contentSync.js';

// 1. Install the localStorage→server sync interceptor IMMEDIATELY (before
//    any page code touches localStorage). Future setItem calls from anywhere
//    in the app (admin or otherwise) will now mirror to the shared backend.
installSyncInterceptor();

// 2. Pull all content from server into localStorage so the site renders the
//    same data on every browser. This is async but fire-and-forget — the
//    poll loop will catch up if the first attempt fails.
pullAllContent().then(() => {
  // Re-run the content migration AFTER pulling so the latest PDF version
  // marker on the server wins over any locally cached one.
  runHomeContentMigration();
});

// 3. Start polling loops for both ad settings and content. Every browser
//    automatically picks up admin changes within ~10 seconds, falls back
//    silently to local cache if the backend goes down.
startAdSettingsPolling();
startContentPolling();

const TWEAK_DEFAULTS = {
  accent: "#C8102E",
  font: "serif",
  density: "comfortable",
};

export default function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Early return for pure admin layouts (bypasses main header/footer)
  if (currentPath.startsWith('/admin')) {
    return <AdminApp />;
  }

  // Handle simple navigation
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Auto-scroll to top whenever the route changes (navbar click, programmatic nav)
  useEffect(() => {
    // Use instant scroll on route change to feel like a fresh page load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath]);

  // Intercept all internal <a href="/..."> clicks so they update state + scroll to top
  // without a full page reload (single-page-app style navigation).
  useEffect(() => {
    const onLinkClick = (e) => {
      // Only handle plain left-clicks, no modifiers
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      if (href.startsWith('//')) return;        // protocol-relative external
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      e.preventDefault();
      window.history.pushState({}, '', href);
      setCurrentPath(href.split('?')[0].split('#')[0]);
    };
    document.addEventListener('click', onLinkClick);
    return () => document.removeEventListener('click', onLinkClick);
  }, []);

  const getActiveTab = () => {
    if (currentPath === '/') return 'home';
    if (currentPath === '/headlines') return 'headlines';
    if (currentPath === '/astrology' || currentPath === '/spiritual') return 'spiritual';
    if (currentPath === '/cinema') return 'cinema';
    if (currentPath === '/sports') return 'sports';
    if (currentPath === '/law' || currentPath === '/category' || currentPath === '/article') return 'law';
    if (currentPath === '/beauty' || currentPath === '/cooking' || currentPath === '/more') return 'more';
    return '';
  };

  const setTweak = (key, val) => setTweaks(prev => ({ ...prev, [key]: val }));

  // Apply tweaks as CSS vars / data attrs
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.body.dataset.font = tweaks.font;
    document.body.dataset.density = tweaks.density;
  }, [tweaks.accent, tweaks.font, tweaks.density]);

  return (
    <>
      <UtilityBar />
      <Masthead />
      <PrimaryNav active={getActiveTab()} onSearch={() => setSearchOpen(true)} />
      {/* SubNav: only renders when on a dropdown parent page (/spiritual, /more)
          or one of its children (/astrology, /beauty, /cooking) */}
      <SubNav currentPath={currentPath} />
      <Ticker />


      {currentPath === '/contact' ? (
        <ContactPage />
      ) : (
        <div className="app-body-grid">
          <main className="app-main">
            {currentPath === '/astrology' ? <AstrologyPage /> :
             /* ஆன்மீகம் (Spiritual) dropdown parent — dedicated spiritual hub page */
             currentPath === '/spiritual' ? <SpiritualPage /> :
             currentPath === '/cinema' ? <CinemaPage /> :
             currentPath === '/sports' ? <SportsPage /> :
             currentPath === '/beauty' ? <BeautyPage /> :
             currentPath === '/cooking' ? <CookingPage /> :
             /* மற்றவை (More) dropdown parent — dedicated lifestyle hub page */
             currentPath === '/more' ? <MorePage /> :
             currentPath === '/law' ? <LawPage /> :
             currentPath === '/epaper' ? <EPaperPage /> :
             currentPath === '/subscription' ? <SubscriptionPage /> :
             currentPath === '/article' ? <ArticlePage /> :
             currentPath === '/category' ? <CategoryPage title="சட்டம் முரசு" /> :
             currentPath === '/headlines' ? <HeadlinesPage /> :
             <HomePage />}
          </main>
        </div>
      )}

      <Footer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
