/*
  Storage layer for Vercel serverless functions
  ─────────────────────────────────────────────
  Uses Vercel Redis (node-redis client over TCP) when REDIS_URL is set in env.
  Falls back to /tmp file storage for local development when no Redis URL is
  available.

  The Vercel Redis env var REDIS_URL looks like:
    rediss://default:<token>@<host>:6379

  Connection caching: serverless functions stay warm for a few minutes between
  invocations on Vercel. We cache the connected client at module scope so the
  TCP handshake only happens on cold starts, not every request.
*/

import { createClient } from 'redis';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL || '';
const HAS_REDIS = !!REDIS_URL;
const TMP_DIR = path.join(os.tmpdir(), 'maraimalai-murasu-store');

// ─── Connection caching ───────────────────────────────────────────────────
let cachedClient = null;
let connectingPromise = null;

async function getClient() {
  if (!HAS_REDIS) return null;

  // Reuse a healthy open client between warm invocations
  if (cachedClient && cachedClient.isOpen) return cachedClient;

  // If a connection is already in-flight, wait for it
  if (connectingPromise) return connectingPromise;

  cachedClient = createClient({
    url: REDIS_URL,
    socket: {
      // 5 second connect timeout — serverless functions can't wait forever
      connectTimeout: 5000,
      // Reconnect after up to 3 attempts with exponential backoff
      reconnectStrategy: (retries) => {
        if (retries > 3) return new Error('Redis: too many retries');
        return Math.min(retries * 200, 1000);
      },
    },
  });

  cachedClient.on('error', (err) => {
    console.error('Redis client error:', err.message);
  });

  connectingPromise = cachedClient
    .connect()
    .then(() => cachedClient)
    .catch((err) => {
      console.error('Redis connect failed:', err.message);
      cachedClient = null;
      connectingPromise = null;
      throw err;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
}

// ─── /tmp fallback for local dev ──────────────────────────────────────────
async function ensureTmpDir() {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

function tmpPath(key) {
  if (!/^[a-zA-Z0-9_:-]+$/.test(key)) throw new Error('Invalid key');
  // Replace colons (used in our key namespacing like "content:foo") with
  // dashes so they're safe as filenames on all OSes.
  return path.join(TMP_DIR, key.replace(/:/g, '__') + '.json');
}

// ─── Public API ───────────────────────────────────────────────────────────

export async function get(key) {
  if (HAS_REDIS) {
    try {
      const client = await getClient();
      const raw = await client.get(key);
      if (raw === null || raw === undefined) return null;
      try { return JSON.parse(raw); }
      catch { return raw; } // fallback if it wasn't JSON
    } catch (err) {
      console.error('store.get failed, falling back to null:', err.message);
      return null;
    }
  }
  try {
    await ensureTmpDir();
    const raw = await fs.readFile(tmpPath(key), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export async function set(key, value) {
  if (HAS_REDIS) {
    const client = await getClient();
    await client.set(key, JSON.stringify(value));
    return;
  }
  await ensureTmpDir();
  await fs.writeFile(tmpPath(key), JSON.stringify(value), 'utf-8');
}

export async function del(key) {
  if (HAS_REDIS) {
    const client = await getClient();
    await client.del(key);
    return;
  }
  try {
    await fs.unlink(tmpPath(key));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

export const usingRedis = HAS_REDIS;
// Backwards-compatible alias used by /api/ads/health
export const usingKV = HAS_REDIS;
