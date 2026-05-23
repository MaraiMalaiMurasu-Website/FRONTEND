/*
  Shared config + auth for all API routes
*/

export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'maraimalai-murasu-2026';

// Allow-list of content keys the API will accept. Must match SYNCED_KEYS
// in src/utils/contentSync.js on the frontend.
export const ALLOWED_KEYS = new Set([
  'customHomeContent',
  'customPagesContent',
  'customSiteSettings',
  'customArticles',
  'customCategories',
  'customEPaperPage',
  'customSearchChips',
  'customMedia',
]);

export const DEFAULT_ADS = {
  houseAds: {},
  houseImageUrl: '',
  houseLink: '',
  houseLocation: '',
  googleActive: true,
  googleClientId: '',
  metaActive: true,
  metaPlacementId: '',
};

export function checkAuth(req, res) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Invalid or missing admin token' });
    return false;
  }
  return true;
}

// Vercel serverless functions get the body already parsed, but in some
// scenarios (curl with no Content-Type) the body comes through as a string.
// Normalise both.
export function getBody(req) {
  if (!req.body) return null;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return req.body;
}
