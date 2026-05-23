// /api/ads — GET (public), POST/PATCH (protected)
import { get, set } from '../_lib/store.js';
import { checkAuth, getBody, DEFAULT_ADS } from '../_lib/config.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const ads = (await get('ads')) || DEFAULT_ADS;
      return res.status(200).json(ads);
    }

    if (req.method === 'POST') {
      if (!checkAuth(req, res)) return;
      const body = getBody(req);
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Body must be an object' });
      }
      await set('ads', body);
      return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
    }

    if (req.method === 'PATCH') {
      if (!checkAuth(req, res)) return;
      const patch = getBody(req);
      if (!patch || typeof patch !== 'object') {
        return res.status(400).json({ error: 'Body must be an object' });
      }
      const current = (await get('ads')) || DEFAULT_ADS;
      const merged = { ...current, ...patch };
      if (patch.houseAds && current.houseAds) {
        merged.houseAds = { ...current.houseAds };
        for (const [slotId, config] of Object.entries(patch.houseAds)) {
          if (config === null) delete merged.houseAds[slotId];
          else merged.houseAds[slotId] = { ...(current.houseAds[slotId] || {}), ...config };
        }
      }
      await set('ads', merged);
      return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/ads failed:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
