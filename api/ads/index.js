// /api/ads — GET (public), POST/PATCH (protected)
import { get, set } from '../_lib/store.js';
import { checkAuth, getBody, DEFAULT_ADS, applyCors } from '../_lib/config.js';

// Tell Vercel to allow larger request bodies (default is ~4.5 MB on Hobby).
// Ads with base64 image data URLs can be heavy.
export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    if (req.method === 'GET') {
      const ads = (await get('ads')) || DEFAULT_ADS;
      return res.status(200).json(ads);
    }

    if (req.method === 'POST') {
      if (!checkAuth(req, res)) return;
      const body = getBody(req);
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Body must be an object', received: typeof req.body });
      }
      try {
        await set('ads', body);
      } catch (storeErr) {
        console.error('store.set("ads") failed:', storeErr);
        return res.status(500).json({ error: 'Storage write failed', detail: storeErr.message });
      }
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
      try {
        await set('ads', merged);
      } catch (storeErr) {
        console.error('store.set("ads") PATCH failed:', storeErr);
        return res.status(500).json({ error: 'Storage write failed', detail: storeErr.message });
      }
      return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('/api/ads failed:', err);
    return res.status(500).json({ error: 'Internal error', detail: err.message });
  }
}
