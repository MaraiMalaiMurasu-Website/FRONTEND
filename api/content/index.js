// GET /api/content — public; returns the full content bundle in one request
import { get } from '../_lib/store.js';
import { ALLOWED_KEYS, applyCors } from '../_lib/config.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const result = {};
    for (const key of ALLOWED_KEYS) {
      result[key] = (await get(`content:${key}`)) ?? null;
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('/api/content failed:', err);
    return res.status(500).json({ error: 'Failed to read content bundle' });
  }
}
