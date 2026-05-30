// GET /api/ads/health — public uptime check
import { usingRedis } from '../_lib/store.js';
import { applyCors } from '../_lib/config.js';

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    storage: usingRedis ? 'vercel-redis' : 'tmp-fallback',
    usingKV: usingRedis,
  });
}
