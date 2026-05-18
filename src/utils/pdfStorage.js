// Large PDF storage using IndexedDB (supports much larger files than localStorage)
// Used by admin (save PDFs) and website (open PDFs)

const DB_NAME = 'murasu-pdf-storage';
const DB_VERSION = 1;
const STORE_NAME = 'pdfs';

function openDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported in this browser'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Save a File or Blob to IndexedDB, returns a key string like "idb:abc123"
export async function savePdfBlob(file) {
  if (!file) throw new Error('No file provided');
  const db = await openDb();
  const key = 'pdf-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(file, key);
    tx.oncomplete = () => resolve('idb:' + key);
    tx.onerror = () => reject(tx.error);
  });
}

// Convert any pdf value (URL, data:base64, or idb:key) to a usable URL
// Returns a Promise<string> with a URL ready to open in a new tab
export async function resolvePdfUrl(pdfValue) {
  if (!pdfValue) return null;
  // Already a regular URL or base64 data URL
  if (pdfValue.startsWith('http') || pdfValue.startsWith('/') || pdfValue.startsWith('data:')) {
    return pdfValue;
  }
  // IndexedDB key
  if (pdfValue.startsWith('idb:')) {
    const key = pdfValue.substring(4);
    try {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => {
          if (req.result) {
            // Create temporary blob URL
            resolve(URL.createObjectURL(req.result));
          } else {
            resolve(null);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Failed to read PDF from IndexedDB:', e);
      return null;
    }
  }
  return pdfValue;
}

// Delete a PDF from IndexedDB
export async function deletePdf(pdfValue) {
  if (!pdfValue || !pdfValue.startsWith('idb:')) return;
  const key = pdfValue.substring(4);
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('Failed to delete PDF:', e);
  }
}

// Get storage estimate (browser quota usage)
export async function getStorageEstimate() {
  if (!navigator.storage || !navigator.storage.estimate) return null;
  const estimate = await navigator.storage.estimate();
  return {
    usedMB: (estimate.usage / 1024 / 1024).toFixed(2),
    quotaMB: (estimate.quota / 1024 / 1024).toFixed(2),
    percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(1)
  };
}

// Click handler helper for website cards.
// Returns true if PDF opened, false if not found (caller can show fallback UI).
export async function openPdfInNewTab(pdfValue) {
  const url = await resolvePdfUrl(pdfValue);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }
  return false;
}
