// /api/content/:key — GET (public), POST/DELETE (protected)
import { get, set, del } from '../_lib/store.js';
import { checkAuth, getBody, ALLOWED_KEYS, applyCors } from '../_lib/config.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const { key } = req.query;
  if (!ALLOWED_KEYS.has(key)) {
    return res.status(400).json({ error: `Unknown key: ${key}` });
  }
  const storeKey = `content:${key}`;

  try {
    if (req.method === 'GET') {
      const value = (await get(storeKey)) ?? null;
      return res.status(200).json({ key, value });
    }

    if (req.method === 'POST') {
      if (!checkAuth(req, res)) return;
      const body = getBody(req);
      const value = body && Object.prototype.hasOwnProperty.call(body, 'value')
        ? body.value
        : body;
      await set(storeKey, value);
      return res.status(200).json({ ok: true, key, savedAt: new Date().toISOString() });
    }

    if (req.method === 'DELETE') {
      if (!checkAuth(req, res)) return;
      await del(storeKey);
      return res.status(200).json({ ok: true, key });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`/api/content/${key} failed:`, err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
