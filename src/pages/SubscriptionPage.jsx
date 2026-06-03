import React from 'react';
import { usePageContent } from '../utils/pageContent.js';
import { useT } from '../utils/i18n.js';

// ─── SVG icons ───────────────────────────────────────────────────────────
const SVG_PHONE = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const SVG_LOCATION = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const SVG_PAY = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
    <line x1="2" y1="10" x2="22" y2="10"></line>
  </svg>
);
const SVG_MAIL = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const SVG_CHECK = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function SubscriptionPage() {
  const t = useT();
  const pc = usePageContent('subscription', {
    kicker: 'வாரந்தோறும்... வாசல் தோறும்...',
    title: 'மறைமலை முரசு!',
    subtitle: 'தமிழ் வார இதழ்',
    singlePriceLabel: 'தனி மலர் விலை',
    singlePrice: 'ரூ. 5/-',
    yearlyLabel: 'ஆண்டு சந்தா',
    yearlyPrice: 'ரூ. 260/-',
    yearlyNote: 'மட்டுமே!',
    deliveryHeadline: 'தபால் மூலம் உங்கள் இல்லம் தேடி வருகிறது!',
    deliveryDesc: 'துல்லியமான செய்திகள், நேர்மையான அரசியல் அலசல்கள் மற்றும் பயனுள்ள நற்கருத்துகளுடன் ஒவ்வொரு ஞாயிறும் தபால் மூலம் உங்கள் இல்லம் தேடி வருகிறது \'மறைமலை முரசு\'. இன்றே ஆண்டு சந்தாதாரராகி, தடையற்ற செய்திச் சேவையைப் பெற்றிடுங்கள்!',
    benefits: [
      'ஒவ்வொரு ஞாயிறும் தபால் மூலம் வரும்',
      'துல்லியமான செய்திகள் மற்றும் அரசியல் அலசல்கள்',
      'பயனுள்ள நற்கருத்துகள் மற்றும் சிறப்புக் கட்டுரைகள்',
      '52 இதழ்கள் ஆண்டுக்கு — தடையற்ற சேவை'
    ],
    gpayLabel: 'சந்தா செலுத்த வேண்டிய GPay எண்',
    gpayNumber: '72000 73980',
    addressLabel: 'தொடர்பு மற்றும் இதழ் முகவரி',
    addressName: 'மறைமலை நகர் இ-சேவை மையம்,',
    addressLine1: 'எண்: 112, எல்.ஐ.சி (LIG), NH-1,',
    addressLine2: 'டாக்டர் அம்பேத்கர் தெரு,',
    addressLine3: 'மறைமலை நகர்,',
    addressLine4: 'செங்கல்பட்டு மாவட்டம் - 603209.',
    phoneLabel: 'அலைபேசி எண்',
    phoneNumber: '94441 12294'
  });

  return (
    <div className="subscription-page" style={{ background: 'var(--bg)', minHeight: '100vh', padding: '32px 16px' }}>
      <div className="subscription-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <div className="sub-breadcrumb" style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '24px' }}>
          <a href="/" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>{t('breadcrumbHome')}</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{t('subscription')}</span>
        </div>

        {/* ── Hero Banner ─────────────────────────────────────── */}
        <div className="sub-hero" style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #8B0000 100%)',
          color: '#fff',
          padding: '48px 32px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(200, 16, 46, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative ornament */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '180px',
            height: '180px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: '18px',
              fontStyle: 'italic',
              marginBottom: '12px',
              opacity: 0.95,
              fontWeight: 500
            }}>
              {pc.kicker}
            </div>
            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 64px)',
              margin: '0 0 8px 0',
              fontFamily: 'var(--serif, serif)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              textShadow: '0 2px 12px rgba(0,0,0,0.2)'
            }}>
              {pc.title}
            </h1>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 20px',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)'
            }}>
              ({pc.subtitle})
            </div>
          </div>
        </div>

        {/* ── Pricing Cards ───────────────────────────────────── */}
        <div className="sub-pricing-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Single Issue Card */}
          <div style={{
            background: '#fff',
            border: '2px solid var(--rule)',
            borderRadius: '14px',
            padding: '28px 24px',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <div style={{
              fontSize: '14px',
              color: 'var(--ink-3)',
              marginBottom: '8px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {pc.singlePriceLabel}
            </div>
            <div style={{
              fontSize: '44px',
              fontWeight: 800,
              color: 'var(--ink)',
              fontFamily: 'var(--serif, serif)',
              lineHeight: 1
            }}>
              {pc.singlePrice}
            </div>
          </div>

          {/* Yearly Subscription Card — featured */}
          <div style={{
            background: '#fff',
            border: '2px solid var(--accent)',
            borderRadius: '14px',
            padding: '28px 24px',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 8px 20px rgba(200, 16, 46, 0.12)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--accent)',
              color: '#fff',
              padding: '4px 16px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}>
              {t('subBestChoice')}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--ink-3)',
              marginBottom: '8px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '8px'
            }}>
              {pc.yearlyLabel}
            </div>
            <div style={{
              fontSize: '52px',
              fontWeight: 800,
              color: 'var(--accent)',
              fontFamily: 'var(--serif, serif)',
              lineHeight: 1
            }}>
              {pc.yearlyPrice}
            </div>
            <div style={{
              fontSize: '15px',
              color: 'var(--ink-3)',
              marginTop: '6px',
              fontStyle: 'italic'
            }}>
              {pc.yearlyNote}
            </div>
          </div>
        </div>

        {/* ── Delivery Description ─────────────────────────────── */}
        <div className="sub-delivery-box" style={{
          background: '#FFF8E7',
          border: '1px solid #F4D77F',
          borderLeft: '4px solid var(--accent)',
          padding: '24px 28px',
          borderRadius: '12px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '22px',
            color: 'var(--accent)',
            margin: '0 0 12px 0',
            fontWeight: 700,
            fontFamily: 'var(--serif, serif)'
          }}>
            {pc.deliveryHeadline}
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: 'var(--ink)',
            margin: 0
          }}>
            {pc.deliveryDesc}
          </p>
        </div>

        {/* ── Benefits Grid ────────────────────────────────────── */}
        <div className="sub-benefits-box" style={{
          background: '#fff',
          border: '1px solid var(--rule)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '18px',
            margin: '0 0 20px 0',
            color: 'var(--ink)',
            fontWeight: 700,
            borderBottom: '2px solid var(--accent)',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>
            {t('subFeatures')}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {pc.benefits.map((benefit, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                background: '#FAFAFA',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {SVG_CHECK}
                </div>
                <span style={{
                  fontSize: '15px',
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                  paddingTop: '3px'
                }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── GPay Number — Highlighted ────────────────────────── */}
        <div className="sub-gpay-box" style={{
          background: 'linear-gradient(135deg, #FFF 0%, #FFF8F8 100%)',
          border: '2px dashed var(--accent)',
          borderRadius: '14px',
          padding: '32px',
          textAlign: 'center',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent)',
            marginBottom: '14px',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            {SVG_PAY} {pc.gpayLabel}
          </div>
          <div style={{
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 800,
            color: 'var(--ink)',
            fontFamily: 'var(--mono, monospace)',
            letterSpacing: '0.05em',
            background: '#fff',
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: '10px',
            border: '1px solid var(--rule)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            📱 {pc.gpayNumber}
          </div>
          <div style={{
            marginTop: '14px',
            fontSize: '13px',
            color: 'var(--ink-3)',
            fontStyle: 'italic'
          }}>
            {t('subUpiNote')}
          </div>
        </div>

        {/* ── Contact Information ──────────────────────────────── */}
        <div className="sub-contact-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Address Card */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '24px',
            borderTop: '4px solid var(--accent)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--accent)',
              marginBottom: '16px',
              fontWeight: 700,
              fontSize: '16px'
            }}>
              {SVG_LOCATION} {pc.addressLabel}
            </div>
            <div style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'var(--ink)'
            }}>
              <strong style={{ display: 'block', marginBottom: '6px', fontSize: '16px' }}>
                {pc.addressName}
              </strong>
              {pc.addressLine1}<br />
              {pc.addressLine2}<br />
              {pc.addressLine3}<br />
              <strong style={{ color: 'var(--accent)' }}>{pc.addressLine4}</strong>
            </div>
          </div>

          {/* Phone Card */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--rule)',
            borderRadius: '12px',
            padding: '24px',
            borderTop: '4px solid var(--accent)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--accent)',
              marginBottom: '16px',
              fontWeight: 700,
              fontSize: '16px'
            }}>
              {SVG_PHONE} {pc.phoneLabel}
            </div>
            <a
              href={`tel:+91${pc.phoneNumber.replace(/\s/g, '')}`}
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--ink)',
                fontFamily: 'var(--mono, monospace)',
                letterSpacing: '0.04em',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              📞 {pc.phoneNumber}
            </a>
            <div style={{
              marginTop: '12px',
              fontSize: '13px',
              color: 'var(--ink-3)'
            }}>
              {t('subWorkingHours')}
            </div>
          </div>
        </div>

        {/* ── Call to Action ──────────────────────────────────── */}
        <div className="sub-cta-panel" style={{
          background: 'var(--ink)',
          color: '#fff',
          padding: '36px 24px',
          borderRadius: '14px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '24px',
            margin: '0 0 10px 0',
            fontWeight: 700,
            fontFamily: 'var(--serif, serif)'
          }}>
            {t('subCtaTitle')}
          </h3>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.85)',
            margin: '0 0 20px 0',
            lineHeight: 1.6
          }}>
            {t('subCtaDesc')}
          </p>
          <a
            href={`tel:+91${pc.phoneNumber.replace(/\s/g, '')}`}
            style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: '#fff',
              padding: '14px 36px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '16px',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 14px rgba(200, 16, 46, 0.4)'
            }}
          >
            {t('subCallNow')}
          </a>
        </div>

      </div>
    </div>
  );
}
