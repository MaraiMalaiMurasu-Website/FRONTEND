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

// ── CORS ──────────────────────────────────────────────────────────────────
// Allow the Hostinger frontend + Vercel preview deployments to call the API.
// Set CORS_ORIGIN env var to a comma-separated list to override.
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'https://maraimalaimurasu.com,https://www.maraimalaimurasu.com,https://maraimalai-murasu.vercel.app,http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export function applyCors(req, res) {
  const origin = req.headers.origin || '';
  // Echo back the origin if it's in our allow-list, otherwise use wildcard for safety on GETs
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Short-circuit preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true; // caller should return immediately
  }
  return false;
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
