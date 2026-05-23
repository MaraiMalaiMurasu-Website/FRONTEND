/*
  adsApi.js — Shared ads client
  ─────────────────────────────
  Talks to the Node.js backend at VITE_ADS_API (defaults to http://localhost:5050).
  Falls back gracefully to localStorage if the API is unreachable, so the site
  keeps working offline / during deployment.

  How it fits together:
    • Frontend pages call `getAdSettings()` → returns ad config (from API; cached in localStorage)
    • Admin panel calls `saveAdSettings(next)` → POSTs to API; also caches locally
    • `subscribeAdSettings(cb)` → live-updates when ads change anywhere

  Sync model:
    1. On boot, fetch from API and update localStorage cache
    2. AdSlot components read from localStorage cache (fast, synchronous)
    3. After admin saves, all browsers poll every 10s OR receive a manual reload
*/

const API_BASE = (import.meta.env.VITE_ADS_API || 'http://localhost:5050').replace(/\/$/, '');
const API_TOKEN = import.meta.env.VITE_ADS_API_TOKEN || 'maraimalai-murasu-2026';
const STORAGE_KEY = 'adSettings';
const POLL_INTERVAL = 10000; // 10 seconds — how often public pages check for ad updates

let pollTimer = null;
let lastFetchedJson = null;

// ── Helpers ───────────────────────────────────────────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Notify same-page React components listening for changes
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    window.dispatchEvent(new CustomEvent('adSettingsChanged'));
  } catch (err) {
    console.warn('adsApi: cache write failed', err);
  }
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Fetch the latest ad settings from the server.
 * Updates localStorage cache. Returns the data or null on failure.
 */
export async function fetchAdSettings() {
  try {
    const res = await fetch(`${API_BASE}/api/ads`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const json = JSON.stringify(data);
    // Only update cache + notify when content actually changed
    if (json !== lastFetchedJson) {
      lastFetchedJson = json;
      writeCache(data);
    }
    return data;
  } catch (err) {
    console.warn('adsApi: fetch failed, using cached copy', err.message);
    return readCache();
  }
}

/**
 * Save the full ad settings object to the server.
 * Falls back to localStorage-only save if the API is unreachable.
 * Returns { ok: true, source: 'api' | 'local' } or { ok: false, error }.
 */
export async function saveAdSettings(next) {
  // Always update local cache immediately so the admin UI is responsive.
  writeCache(next);

  try {
    const res = await fetch(`${API_BASE}/api/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': API_TOKEN,
      },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const data = await res.json();
    lastFetchedJson = JSON.stringify(next);
    return { ok: true, source: 'api', savedAt: data.savedAt };
  } catch (err) {
    console.warn('adsApi: save to server failed, kept locally only', err.message);
    return { ok: false, source: 'local', error: err.message };
  }
}

/**
 * Patch (merge) ad settings — useful for updating a single slot without
 * resending the whole object.
 *   patchAdSettings({ houseAds: { 'header-right-sq': { image: 'data:...', fit: 'cover' } } })
 * To DELETE a slot, set its value to null:
 *   patchAdSettings({ houseAds: { 'header-right-sq': null } })
 */
export async function patchAdSettings(patch) {
  try {
    const res = await fetch(`${API_BASE}/api/ads`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': API_TOKEN,
      },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    // Re-fetch to update local cache with merged result
    await fetchAdSettings();
    return { ok: true, source: 'api' };
  } catch (err) {
    console.warn('adsApi: patch failed', err.message);
    return { ok: false, error: err.message };
  }
}

/**
 * Start polling the server for ad updates. Public pages should call this
 * once on app boot so they automatically pick up changes within ~10s of an
 * admin saving from any browser/device.
 */
export function startAdSettingsPolling() {
  if (pollTimer) return; // already polling
  fetchAdSettings(); // immediate fetch
  pollTimer = setInterval(fetchAdSettings, POLL_INTERVAL);

  // Also re-fetch when the tab regains focus — covers the "user came back" case
  const onFocus = () => fetchAdSettings();
  window.addEventListener('focus', onFocus);

  // Return a cleanup function in case you ever need to stop polling
  return () => {
    clearInterval(pollTimer);
    pollTimer = null;
    window.removeEventListener('focus', onFocus);
  };
}

/**
 * Check whether the backend is reachable. Useful for the admin to show a
 * "Connected" / "Offline" badge.
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/ads/health`, { cache: 'no-store' });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: !!data.ok, ts: data.ts };
  } catch {
    return { online: false };
  }
}

// Expose the base URL so the admin can show it in the UI
export const ADS_API_BASE = API_BASE;
