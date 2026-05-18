// time.js — Maraimalai Murasu time/date helpers
// Tamil-locale relative time ("X நிமிடம் முன்") and date formatting

const TAMIL_DAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const TAMIL_MONTHS = [
  "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
  "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
];

/**
 * Convert a timestamp (ISO string, Date, or epoch ms) to Tamil relative time.
 * Examples:
 *   <30s     → "சில நொடிகள் முன்" (a few seconds ago)
 *   <1min    → "இப்போது"          (just now)
 *   1-59min  → "X நிமிடங்களுக்கு முன்"
 *   1hr     → "1 மணி நேரத்திற்கு முன்"
 *   2-23hr   → "X மணி நேரத்திற்கு முன்"
 *   1day     → "நேற்று"
 *   2-6day   → "X நாள் முன்"
 *   1week    → "ஒரு வாரம் முன்"
 *   2-3 wk   → "X வாரங்கள் முன்"
 *   ≥1 month → formatted date "12 மே 2026"
 */
export function timeAgoTamil(timestamp) {
  if (!timestamp) return '';
  const then = (timestamp instanceof Date) ? timestamp : new Date(timestamp);
  if (isNaN(then.getTime())) return '';

  const now = new Date();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 30) return 'சில நொடிகள் முன்';
  if (diffMin < 1) return 'இப்போது';
  if (diffMin < 60) return `${diffMin} நிமிடங்களுக்கு முன்`;
  if (diffHr < 24) return `${diffHr} மணி நேரத்திற்கு முன்`;
  if (diffDay === 1) return 'நேற்று';
  if (diffDay < 7) return `${diffDay} நாள் முன்`;
  if (diffWeek === 1) return 'ஒரு வாரம் முன்';
  if (diffWeek < 4) return `${diffWeek} வாரங்கள் முன்`;
  return formatTamilDate(then);
}

/**
 * Format a Date as Tamil long date: "12 மே 2026"
 */
export function formatTamilDate(d) {
  const date = (d instanceof Date) ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  return `${date.getDate()} ${TAMIL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format Date as full Tamil date with day name: "திங்கள், 12 மே 2026"
 */
export function formatTamilFullDate(d) {
  const date = (d instanceof Date) ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  return `${TAMIL_DAYS[date.getDay()]}, ${date.getDate()} ${TAMIL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format Date as time "HH:MM AM/PM IST" in Tamil format
 */
export function formatTamilTime(d) {
  const date = (d instanceof Date) ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const am = h < 12;
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${am ? 'AM' : 'PM'} IST`;
}

/**
 * Build a meta string: "{location} · {relativeTime}" or just "{relativeTime}" if no location.
 * Used by news cards.
 */
export function buildMeta(location, timestamp) {
  const time = timeAgoTamil(timestamp);
  if (location && time) return `${location} · ${time}`;
  return location || time || '';
}

/**
 * Convert an ISO datetime-local input value to ISO timestamp.
 * Useful for admin form input → state storage.
 */
export function inputDatetimeToISO(value) {
  if (!value) return '';
  // Already ISO?
  if (value.endsWith('Z') || value.includes('+')) return value;
  // datetime-local format: "2026-05-15T14:30"
  return new Date(value).toISOString();
}

/**
 * Convert ISO timestamp to datetime-local input value: "2026-05-15T14:30"
 */
export function isoToInputDatetime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
