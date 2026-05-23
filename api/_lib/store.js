/*
  Storage layer for Vercel serverless functions
  ─────────────────────────────────────────────
  Uses Vercel KV (Upstash Redis under the hood) when KV env vars are present.
  Falls back to /tmp file storage when KV isn't configured (useful for local
  `vercel dev`).

  Vercel KV env vars are auto-populated when you connect a KV store in the
  Vercel dashboard:
    KV_REST_API_URL
    KV_REST_API_TOKEN
*/

import { kv } from '@vercel/kv';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const TMP_DIR = path.join(os.tmpdir(), 'maraimalai-murasu-store');

async function ensureTmpDir() {
  try {
    await fs.mkdir(TMP_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

function tmpPath(key) {
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) throw new Error('Invalid key');
  return path.join(TMP_DIR, key + '.json');
}

export async function get(key) {
  if (HAS_KV) {
    return (await kv.get(key)) ?? null;
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
  if (HAS_KV) {
    await kv.set(key, value);
    return;
  }
  await ensureTmpDir();
  await fs.writeFile(tmpPath(key), JSON.stringify(value), 'utf-8');
}

export async function del(key) {
  if (HAS_KV) {
    await kv.del(key);
    return;
  }
  try {
    await fs.unlink(tmpPath(key));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

export const usingKV = HAS_KV;
