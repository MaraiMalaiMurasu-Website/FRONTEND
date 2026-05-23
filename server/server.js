/*
  Maraimalai Murasu — Shared Content & Ads Backend
  ────────────────────────────────────────────────
  A Node.js + Express server giving the React app a single shared source of
  truth for ads + all editable site content. Every browser/device reads from
  this server instead of localStorage, so admin changes appear everywhere.
*/

import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT         = process.env.PORT || 5050;
const ADMIN_TOKEN  = process.env.ADMIN_TOKEN || 'maraimalai-murasu-2026';
const DATA_DIR     = path.join(__dirname, 'data');
const ADS_FILE     = path.join(DATA_DIR, 'ads.json');
const CONTENT_DIR  = path.join(DATA_DIR, 'content');
const MAX_BODY     = '100mb';

const ALLOWED_KEYS = new Set([
  'customHomeContent',
  'customPagesContent',
  'customSiteSettings',
  'customArticles',
  'customCategories',
  'customEPaperPage',
  'customSearchChips',
  'customMedia',
]);

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || true;
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: MAX_BODY }));

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(CONTENT_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

function contentFilePath(key) {
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) return null;
  return path.join(CONTENT_DIR, key + '.json');
}

async function readContent(key) {
  const filePath = contentFilePath(key);
  if (!filePath) return null;
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

async function writeContent(key, value) {
  const filePath = contentFilePath(key);
  if (!filePath) throw new Error('Invalid key');
  await ensureDataDir();
  const tmp = filePath + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(value), 'utf-8');
  await fs.rename(tmp, filePath);
}

async function readAds() {
  try {
    const raw = await fs.readFile(ADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {
        houseAds: {},
        houseImageUrl: '',
        houseLink: '',
        houseLocation: '',
        googleActive: true,
        googleClientId: '',
        metaActive: true,
        metaPlacementId: '',
      };
    }
    throw err;
  }
}

async function writeAds(data) {
  await ensureDataDir();
  const tmp = ADS_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmp, ADS_FILE);
}

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid or missing admin token' });
  }
  next();
}

app.get('/api/ads/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get('/api/ads', async (req, res) => {
  try { res.json(await readAds()); }
  catch (err) {
    console.error('GET /api/ads failed:', err);
    res.status(500).json({ error: 'Failed to read ads' });
  }
});

app.post('/api/ads', requireAuth, async (req, res) => {
  try {
    const next = req.body;
    if (!next || typeof next !== 'object') {
      return res.status(400).json({ error: 'Body must be an object' });
    }
    await writeAds(next);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('POST /api/ads failed:', err);
    res.status(500).json({ error: 'Failed to save ads' });
  }
});

app.patch('/api/ads', requireAuth, async (req, res) => {
  try {
    const patch = req.body;
    if (!patch || typeof patch !== 'object') {
      return res.status(400).json({ error: 'Body must be an object' });
    }
    const current = await readAds();
    const merged = { ...current, ...patch };
    if (patch.houseAds && current.houseAds) {
      merged.houseAds = { ...current.houseAds };
      for (const [slotId, config] of Object.entries(patch.houseAds)) {
        if (config === null) delete merged.houseAds[slotId];
        else merged.houseAds[slotId] = { ...(current.houseAds[slotId] || {}), ...config };
      }
    }
    await writeAds(merged);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('PATCH /api/ads failed:', err);
    res.status(500).json({ error: 'Failed to patch ads' });
  }
});

app.get('/api/content', async (req, res) => {
  try {
    const result = {};
    for (const key of ALLOWED_KEYS) {
      result[key] = await readContent(key);
    }
    res.json(result);
  } catch (err) {
    console.error('GET /api/content failed:', err);
    res.status(500).json({ error: 'Failed to read content bundle' });
  }
});

app.get('/api/content/:key', async (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_KEYS.has(key)) return res.status(400).json({ error: 'Unknown key: ' + key });
  try {
    const value = await readContent(key);
    res.json({ key, value });
  } catch (err) {
    console.error('GET /api/content/' + key + ' failed:', err);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

app.post('/api/content/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_KEYS.has(key)) return res.status(400).json({ error: 'Unknown key: ' + key });
  try {
    const value = req.body && Object.prototype.hasOwnProperty.call(req.body, 'value')
      ? req.body.value
      : req.body;
    await writeContent(key, value);
    res.json({ ok: true, key, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('POST /api/content/' + key + ' failed:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.delete('/api/content/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  if (!ALLOWED_KEYS.has(key)) return res.status(400).json({ error: 'Unknown key: ' + key });
  try {
    const filePath = contentFilePath(key);
    if (filePath) {
      try { await fs.unlink(filePath); }
      catch (e) { if (e.code !== 'ENOENT') throw e; }
    }
    res.json({ ok: true, key });
  } catch (err) {
    console.error('DELETE /api/content/' + key + ' failed:', err);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log('\n🟢 Maraimalai Murasu API on http://localhost:' + PORT);
  console.log('   Data dir: ' + DATA_DIR);
  console.log('   Token: ' + (ADMIN_TOKEN === 'maraimalai-murasu-2026' ? '(default — CHANGE IN PROD)' : '(custom)'));
  console.log('   CORS: ' + (corsOrigin === true ? '(all)' : corsOrigin) + '\n');
});
