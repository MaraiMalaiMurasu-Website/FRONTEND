// Shared helper: derive page URL from card category
// Used by HomePage, CategoryPage, Cinema/Sports/Beauty/Cooking pages

const DEFAULT_CAT_URL = {
  'தலைப்புச் செய்திகள்': '/headlines',
  'சட்டம் முரசு': '/law',
  'ஆன்மீகம்': '/astrology',
  'ஜோதிடம்': '/astrology',
  'சினிமா': '/cinema',
  'விளையாட்டு': '/sports',
  'அழகுகுறிப்பு': '/beauty',
  'சமையல்': '/cooking',
  'மற்றவை': '/category',
  'அரசியல்': '/headlines',
  'மாநிலம்': '/headlines',
  'தேசியம்': '/headlines',
  'சர்வதேசம்': '/headlines',
  'பொருளாதாரம்': '/headlines',
  'கல்வி': '/headlines',
  'மதுரை': '/headlines',
  'நீதிமன்றம்': '/law',
  'மாநில முரசு': '/law',
  'பாக்ஸ் ஆபிஸ்': '/cinema',
  'கிசுகிசு': '/cinema',
  'கிரிக்கெட்': '/sports',
  'கால்பந்து': '/sports',
  'டென்னிஸ்': '/sports',
  'ஒலிம்பிக்ஸ்': '/sports',
  'செஸ்': '/sports',
  'சரும பராமரிப்பு': '/beauty',
  'கூந்தல் பராமரிப்பு': '/beauty',
  'ஆரோக்கியம்': '/beauty',
  'இனிப்பு வகைகள்': '/cooking',
  'சைவ உணவுகள்': '/cooking',
  'பாரம்பரியம்': '/cooking',
  'சமையல் குறிப்பு': '/cooking',
  'முக்கிய செய்தி': '/headlines'
};

export function getCategoryUrl(catName) {
  if (!catName) return '/article';
  try {
    const saved = localStorage.getItem('customCategories');
    if (saved) {
      const cats = JSON.parse(saved);
      const match = cats.find(c => c.name === catName);
      if (match) return '/' + match.slug;
    }
  } catch (e) {}
  return DEFAULT_CAT_URL[catName] || '/article';
}

export function getCardHref(item) {
  if (item?.link && String(item.link).trim()) return String(item.link).trim();
  if (item?.cat) return getCategoryUrl(item.cat);
  return '/article';
}

export function handleCardClick(e, item) {
  const href = getCardHref(item);
  if (href && href.startsWith('/')) {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  }
}
