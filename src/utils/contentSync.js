/*
  contentSync.js — Transparent localStorage ↔ shared backend sync
  ──────────────────────────────────────────────────────────────
  Why this exists:
    The site was originally built with everything in localStorage. localStorage
    is private to each browser, so admin changes in Chrome don't show in Edge,
    on phones, or for visitors. This module bridges that gap WITHOUT requiring
    every page and every admin section to be rewritten.

  How it works:
    1. On app boot, pullAllContent() fetches every synced key from the server
       and writes the values into localStorage. The site then renders from
       localStorage as it always has.
    2. We monkey-patch localStorage.setItem so that any write to a synced key
       is automatically pushed to the server.
    3. A 10-second poll keeps localStorage in sync with the server while the
       page is open — so admin changes from any browser show up everywhere
       within 10 seconds.

  Keys synced:
    customHomeContent, customPagesContent, customSiteSettings, customArticles,
    customCategories, customEPaperPage, customSearchChips, customMedia.
    (Ads are handled by the separate adsApi.js with its own dedicated endpoint.)
*/

// Match adsApi.js — same-origin on production, localhost in dev
const API_BASE = (() => {
  const explicit = import.meta.env.VITE_ADS_API;
  if (explicit !== undefined && explicit !== '') return explicit.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') return '';
  return 'http://localhost:5050';
})();
const API_TOKEN = import.meta.env.VITE_ADS_API_TOKEN || 'maraimalai-murasu-2026';
const POLL_INTERVAL = 10000;

// All localStorage keys that should be mirrored to the server. Adding a key
// here also requires adding it to ALLOWED_KEYS in server/server.js.
export const SYNCED_KEYS = [
  'customHomeContent',
  'customPagesContent',
  'customSiteSettings',
  'customArticles',
  'customCategories',
  'customEPaperPage',
  'customSearchChips',
  'customMedia',
];

const SYNCED_SET = new Set(SYNCED_KEYS);

let pollTimer = null;
let interceptorInstalled = false;
let isApplyingRemote = false; // prevent feedback loops while applying server data

// ── Helpers ───────────────────────────────────────────────────────────────

async function fetchKey(key) {
  try {
    const res = await fetch(`${API_BASE}/api/content/${key}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}

async function postKey(key, value) {
  const res = await fetch(`${API_BASE}/api/content/${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': API_TOKEN,
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function applyToLocalStorage(key, value) {
  // Wrap to prevent our setItem interceptor from re-pushing to server
  isApplyingRemote = true;
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      const json = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, json);
    }
    // Notify any subscribers (page components listening for changes)
    window.dispatchEvent(new StorageEvent('storage', { key }));
  } catch (err) {
    console.warn(`contentSync: failed to write ${key} to localStorage`, err);
  } finally {
    isApplyingRemote = false;
  }
}

// ── Pull all synced keys from server ──────────────────────────────────────

/**
 * Fetch the entire content bundle in one request and write to localStorage.
 * Returns true if successful, false if the server is unreachable.
 */
export async function pullAllContent() {
  try {
    const res = await fetch(`${API_BASE}/api/content`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bundle = await res.json();
    let changed = 0;
    for (const key of SYNCED_KEYS) {
      const value = bundle[key];
      if (value === null) {
        // Server has no value — leave localStorage alone (preserves first-run defaults)
        continue;
      }
      const existing = localStorage.getItem(key);
      const incoming = typeof value === 'string' ? value : JSON.stringify(value);
      if (existing !== incoming) {
        applyToLocalStorage(key, value);
        changed++;
      }
    }
    return { ok: true, changed };
  } catch (err) {
    console.warn('contentSync: pull failed — using local cache', err.message);
    return { ok: false, error: err.message };
  }
}

// ── Push a single key to server ───────────────────────────────────────────

/**
 * Push a single content key to the server. Falls back silently if offline.
 * Used by the localStorage.setItem interceptor and can be called directly.
 */
export async function pushKey(key, value) {
  if (!SYNCED_SET.has(key)) return { ok: false, error: 'Not a synced key' };
  // value can be a JSON string (from localStorage) or an object — normalize to object
  let parsed = value;
  if (typeof value === 'string') {
    try { parsed = JSON.parse(value); } catch { /* keep as string */ }
  }
  try {
    await postKey(key, parsed);
    return { ok: true };
  } catch (err) {
    console.warn(`contentSync: push ${key} failed`, err.message);
    return { ok: false, error: err.message };
  }
}

// ── Install the localStorage.setItem interceptor ──────────────────────────

/**
 * Monkey-patch localStorage.setItem so any write to a synced key is also
 * pushed to the server. Safe to call multiple times — installs only once.
 */
export function installSyncInterceptor() {
  if (interceptorInstalled) return;
  interceptorInstalled = true;

  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    // Run the normal localStorage write
    originalSetItem.call(this, key, value);
    // If this is a synced key AND we're not applying a remote update right
    // now, push it up to the server in the background.
    if (
      this === window.localStorage &&
      SYNCED_SET.has(key) &&
      !isApplyingRemote
    ) {
      pushKey(key, value).catch(() => { /* already logged */ });
    }
  };

  const originalRemoveItem = Storage.prototype.removeItem;
  Storage.prototype.removeItem = function (key) {
    originalRemoveItem.call(this, key);
    if (
      this === window.localStorage &&
      SYNCED_SET.has(key) &&
      !isApplyingRemote
    ) {
      // Delete from server too
      fetch(`${API_BASE}/api/content/${key}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': API_TOKEN },
      }).catch(() => { /* ignore */ });
    }
  };
}

// ── Polling for remote changes ────────────────────────────────────────────

/**
 * Start a background poll that pulls the latest content from the server
 * every 10 seconds. Used by public pages so visitor browsers automatically
 * pick up changes admins make from any other browser.
 */
export function startContentPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(pullAllContent, POLL_INTERVAL);

  const onFocus = () => pullAllContent();
  window.addEventListener('focus', onFocus);

  return () => {
    clearInterval(pollTimer);
    pollTimer = null;
    window.removeEventListener('focus', onFocus);
  };
}

/**
 * Boot the sync system:
 *   1. Pull everything from the server (so localStorage is up to date)
 *   2. Install the setItem interceptor (so future writes mirror to server)
 *   3. Start the polling loop (so changes from other browsers appear here)
 *
 * Call this once during app startup, BEFORE React mounts.
 */
export async function bootContentSync() {
  installSyncInterceptor();
  await pullAllContent();
  startContentPolling();
}

export const SYNC_API_BASE = API_BASE;
