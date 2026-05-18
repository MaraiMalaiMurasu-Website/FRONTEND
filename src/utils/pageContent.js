// Shared utility for reading admin-edited page content from localStorage
// Used by Headlines, Cinema, Sports, Beauty, Cooking, Astrology, Contact pages
import { useState, useEffect } from 'react';

// Smart merge: for each key, if saved value is empty/missing/empty-array, use default.
// This protects against old saved data that's missing newly-added fields.
function mergePageData(defaults, saved) {
  if (!saved || typeof saved !== 'object') return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(saved)) {
    const savedVal = saved[key];
    const defaultVal = defaults[key];
    // Treat empty arrays as "missing" so defaults fill in newly-added array sections
    if (Array.isArray(savedVal) && savedVal.length === 0 && Array.isArray(defaultVal) && defaultVal.length > 0) {
      result[key] = defaultVal;
      continue;
    }
    // Deep-merge plain objects (one level deep — enough for our schema)
    if (savedVal && typeof savedVal === 'object' && !Array.isArray(savedVal) && defaultVal && typeof defaultVal === 'object' && !Array.isArray(defaultVal)) {
      result[key] = { ...defaultVal, ...savedVal };
      continue;
    }
    // Otherwise saved value wins
    result[key] = savedVal;
  }
  return result;
}

export function usePageContent(pageId, defaults = {}) {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('customPagesContent');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed[pageId]) {
            setContent(mergePageData(defaults, parsed[pageId]));
            return;
          }
        }
        setContent(defaults);
      } catch (e) {
        console.error('Failed to load page content', e);
        setContent(defaults);
      }
    };
    load();

    const onChange = (e) => {
      if (e.key === 'customPagesContent') load();
    };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  return content;
}
