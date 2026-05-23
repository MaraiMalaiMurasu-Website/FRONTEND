// GET /api/ads/health — public uptime check
import { usingRedis } from '../_lib/store.js';

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    storage: usingRedis ? 'vercel-redis' : 'tmp-fallback',
  });
}
