/*
  VideoPlayer — inline modal that plays YouTube videos (or any video iframe URL).
  Usage:
    const [video, setVideo] = useState(null); // { url, title }
    <VideoPlayer video={video} onClose={() => setVideo(null)} />

  Pass `video.url` as a YouTube URL, YouTube video ID, or any embeddable URL.
  We auto-detect YouTube and convert to /embed/ form with autoplay.
*/
import { useEffect } from 'react';

// Extract YouTube video ID from various URL formats
export function getYouTubeId(url) {
  if (!url) return null;
  // Already just an ID (11 chars, no slashes)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  // Try matching common URL shapes
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Return a poster thumbnail URL for a YouTube video
export function getYouTubeThumb(idOrUrl, quality = 'hqdefault') {
  const id = getYouTubeId(idOrUrl);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

// Build an embed URL with autoplay for the player iframe
function getEmbedUrl(url) {
  if (!url) return '';
  const id = getYouTubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  return url; // assume already an embed URL
}

export default function VideoPlayer({ video, onClose }) {
  useEffect(() => {
    if (!video) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [video, onClose]);

  if (!video) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  const embedUrl = getEmbedUrl(video.url);

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        animation: 'video-fade 0.15s ease-out'
      }}
    >
      <style>{`
        @keyframes video-fade { from { opacity:0 } to { opacity:1 } }
      `}</style>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F2ECE0' }}>
          <span style={{ fontSize: '22px' }}>▶</span>
          <h3 style={{ flex: 1, margin: 0, fontFamily: 'var(--serif), Georgia, serif', fontSize: '17px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {video.title || 'Video'}
          </h3>
          <button onClick={onClose} style={{ padding: '8px 16px', background: '#C8102E', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            ✕ Close
          </button>
        </div>
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title || 'Video player'}
              style={{ width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontFamily: 'monospace' }}>
              No video URL set
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
