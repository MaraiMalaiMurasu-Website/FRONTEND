/*
  PdfViewer — inline modal/lightbox for displaying PDFs on the current page.
  Usage:
    const [pdf, setPdf] = useState(null); // { src, title }
    ...
    <PdfViewer pdf={pdf} onClose={() => setPdf(null)} />

  Pass `pdf.src` as either a blob URL, data URL, or http(s) URL.
  The viewer fades in over the page with a backdrop, shows a header
  bar with title + Open-in-new-tab + Download + Close, and renders
  the PDF in an iframe sized to the viewport.
*/
import { useEffect } from 'react';

export default function PdfViewer({ pdf, onClose }) {
  // Close on ESC key
  useEffect(() => {
    if (!pdf) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    // Lock page scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [pdf, onClose]);

  if (!pdf) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="pdf-viewer-overlay"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'pdf-fade-in 0.15s ease-out'
      }}
    >
      <style>{`
        @keyframes pdf-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pdf-viewer-frame {
          width: 100%;
          max-width: 1100px;
          height: 100%;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }
        .pdf-viewer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #1A1614;
          color: #F2ECE0;
          border-bottom: 2px solid #C8102E;
        }
        .pdf-viewer-title {
          flex: 1;
          font-family: var(--serif), Georgia, serif;
          font-size: 15px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pdf-viewer-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #F2ECE0;
          padding: 6px 12px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: background 0.15s;
        }
        .pdf-viewer-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .pdf-viewer-close {
          background: #C8102E;
          border-color: #C8102E;
          padding: 6px 14px;
          font-size: 14px;
          font-weight: 700;
        }
        .pdf-viewer-close:hover {
          background: #a30d24;
        }
        .pdf-viewer-body {
          flex: 1;
          background: #525659;
          overflow: hidden;
        }
        .pdf-viewer-body iframe {
          width: 100%;
          height: 100%;
          border: 0;
          background: #525659;
        }
        @media (max-width: 720px) {
          .pdf-viewer-overlay { padding: 0 !important; }
          .pdf-viewer-frame { max-height: 100vh; border-radius: 0; }
          .pdf-viewer-title { font-size: 13px; }
          .pdf-viewer-btn { padding: 5px 9px; font-size: 11px; }
        }
      `}</style>

      <div className="pdf-viewer-frame" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-viewer-header">
          <span style={{ fontSize: '20px', lineHeight: 1 }}>📄</span>
          <div className="pdf-viewer-title">{pdf.title || 'PDF Document'}</div>

          <a className="pdf-viewer-btn" href={pdf.src} target="_blank" rel="noopener noreferrer" title="Open in new tab">
            ↗ Open
          </a>
          <a className="pdf-viewer-btn" href={pdf.src} download={pdf.downloadName || 'document.pdf'} title="Download">
            ⬇ Download
          </a>
          <button className="pdf-viewer-btn pdf-viewer-close" onClick={onClose} aria-label="Close">
            ✕ Close
          </button>
        </div>

        <div className="pdf-viewer-body">
          <iframe
            src={pdf.src}
            title={pdf.title || 'PDF Document'}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
