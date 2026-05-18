import React from 'react';
import { AdSlot } from '../components/Ads.jsx';
import { usePageContent } from '../utils/pageContent.js';

const SVG_LOCATION = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const SVG_PHONE = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const SVG_MAIL = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const SVG_NEWS = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const SVG_ADS = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const SVG_TECH = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

export default function ContactPage() {
  const pc = usePageContent('contact', {
    heroTitle: 'எங்களை',
    heroOutline: 'தொடர்புகொள்ளுங்கள்',
    heroDesc: 'உங்கள் கருத்துக்கள், செய்தி குறிப்புகள், விளம்பர விசாரணைகள், சந்தா உதவி — அனைத்தும் இங்கே. சென்னையின் தலைமை அலுவலகத்தில் உள்ள மறைமலை முரசு டெஸ்க் 24 மணி நேரமும் உங்களை வரவேற்கிறது.',
    stats: [
      { num: '1947', label: 'முதல் இயங்குகிறது' },
      { num: '32', label: 'பகுதிகளிலானவை' },
      { num: '24x7', label: 'செய்தி டெஸ்க்' },
      { num: '4 HR', label: 'சராசரியான பதிலளிப்பு' }
    ],
    officeAddress: '123, அண்ணா சாலை, தேனாம்பேட்டை, சென்னை — 600 018, தமிழ்நாடு',
    phoneLandline: '+91 44 2814 1414',
    phoneWhatsapp: '+91 98400 12345',
    emailGeneral: 'contact@maraimalaimurasu.com',
    emailEditor: 'editor@maraimalaimurasu.com',
    newsroomPhone: '1800 425 1234',
    newsroomEmail: 'newsdesk@maraimalaimurasu.com',
    salesPhone: '+91 98400 98400',
    salesHours: 'திங்கள் முதல் வெள்ளி · 9:30 AM - 7:00 PM',
    techPhone: '+91 44 2820 8200',
    techDesc: 'App, ePaper, Subscription'
  });
  return (
    <div className="contact-page">
      {/* 1. Dark Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #111 0%, #1A1614 100%)', color: '#fff', padding: '60px 0 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'radial-gradient(circle at top right, rgba(200, 16, 46, 0.25), transparent 60%)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '24px' }}>
            முகப்பு &nbsp;›&nbsp; மற்றவை &nbsp;›&nbsp; தொடர்பு
          </div>

          <div style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--accent)' }}></div>
            தொடர்பு · CONTACT
            <div style={{ width: '80px', height: '1px', background: 'var(--accent)' }}></div>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', marginBottom: '4px' }}>{pc.heroTitle}</span>
            <span style={{ 
              fontSize: 'clamp(36px, 7vw, 84px)', 
              color: 'transparent', 
              WebkitTextStroke: '2px var(--accent)',
              display: 'block'
            }}>
              {pc.heroOutline}
            </span>
          </h1>

          <p style={{ fontSize: '16px', lineHeight: 1.6, maxWidth: '500px', opacity: 0.8, marginBottom: '48px' }}>
            {pc.heroDesc}
          </p>

          <div className="contact-hero-stats">
            {(pc.stats || []).map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{s.num}</div>
                <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Contact Info Grid */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--accent)', paddingBottom: '12px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--serif)' }}>தொடர்பு தகவல்கள் <span style={{ fontSize: '10px', fontFamily: 'var(--sans)', color: 'var(--ink-3)', letterSpacing: '0.1em', marginLeft: '12px', textTransform: 'uppercase' }}>· How to reach us</span></h2>
            <a href="#form" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>அலுவலக முகவரி →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '48px' }}>
            {/* Card 1 */}
            <div className="contact-info-card" style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }}></div>
              <div style={{ width: '48px', height: '48px', background: '#fdf6f6', borderRadius: '50%', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {SVG_LOCATION}
              </div>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '4px' }}>அலுவலக முகவரி</h3>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '20px' }}>Office Address</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{pc.officeAddress}</p>
            </div>
            
            {/* Card 2 */}
            <div className="contact-info-card" style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }}></div>
              <div style={{ width: '48px', height: '48px', background: '#fdf6f6', borderRadius: '50%', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {SVG_PHONE}
              </div>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '4px' }}>தொலைபேசி எண்</h3>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '20px' }}>Phone & WhatsApp</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '8px' }}>நிலையம் <strong style={{ color: 'var(--accent)' }}>{pc.phoneLandline}</strong></p>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6 }}>WhatsApp <strong style={{ color: 'var(--accent)' }}>{pc.phoneWhatsapp}</strong></p>
            </div>

            {/* Card 3 */}
            <div className="contact-info-card" style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }}></div>
              <div style={{ width: '48px', height: '48px', background: '#fdf6f6', borderRadius: '50%', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {SVG_MAIL}
              </div>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '4px' }}>மின்னஞ்சல் முகவரி</h3>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '20px' }}>General Email</div>
              <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.6, marginBottom: '8px' }}>{pc.emailGeneral}</p>
              <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.6 }}>{pc.emailEditor}</p>
            </div>

            {/* Card 4 */}
            <div className="contact-info-card" style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }}></div>
              <div style={{ width: '48px', height: '48px', background: '#fdf6f6', borderRadius: '50%', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {SVG_NEWS}
              </div>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '4px' }}>செய்தி அனுப்பும் தொடர்பு</h3>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '20px' }}>Newsroom Tip Line</div>
              <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.6, marginBottom: '8px', fontWeight: 700 }}>{pc.newsroomPhone} <span style={{ color: 'var(--ink-2)', fontWeight: 400 }}>(இலவசம்)</span></p>
              <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.6, marginBottom: '8px' }}>{pc.newsroomEmail}</p>
              <p style={{ fontSize: '12px', color: 'var(--ink-3)' }}>24x7 செய்தி டெஸ்க்</p>
            </div>

            {/* Card 5 */}
            <div className="contact-info-card" style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }}></div>
              <div style={{ width: '48px', height: '48px', background: '#fdf6f6', borderRadius: '50%', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {SVG_ADS}
              </div>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '4px' }}>விளம்பர தொடர்பு</h3>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '20px' }}>Advertising & Sales</div>
              <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.6, marginBottom: '8px' }}>ads@maraimalaimurasu.com</p>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '8px' }}>நேரடி <strong style={{ color: 'var(--accent)' }}>{pc.salesPhone}</strong></p>
              <p style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{pc.salesHours}</p>
            </div>

            {/* Card 6 */}
            <div className="contact-info-card" style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)' }}></div>
              <div style={{ width: '48px', height: '48px', background: '#fdf6f6', borderRadius: '50%', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                {SVG_TECH}
              </div>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '4px' }}>தொழில்நுட்ப உதவி</h3>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: '20px' }}>Tech Support</div>
              <p style={{ fontSize: '14px', color: 'var(--accent)', lineHeight: 1.6, marginBottom: '8px' }}>support@maraimalaimurasu.com</p>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '8px' }}>சந்தாதாரர் <strong style={{ color: 'var(--accent)' }}>+91 44 2820 8200</strong></p>
              <p style={{ fontSize: '12px', color: 'var(--ink-3)' }}>App, ePaper, Subscription</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '48px 0' }}>
            <AdSlot network="google" size="970x90" slotId="contact-leader-1" note="Google Ad Manager · Top-Of-Fold" />
          </div>

        </div>
      </section>

      {/* 3. Form Section */}
      <section className="section" id="form" style={{ background: '#f9f9f9', paddingTop: '48px', paddingBottom: '64px' }}>
        <div className="container">
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--accent)', paddingBottom: '12px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--serif)' }}>எங்களுக்கு எழுதுங்கள் <span style={{ fontSize: '10px', fontFamily: 'var(--sans)', color: 'var(--ink-3)', letterSpacing: '0.1em', marginLeft: '12px', textTransform: 'uppercase' }}>· Get in touch</span></h2>
            <a href="#form" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>தொடர்பு கொள்கைகள் →</a>
          </div>

          <div className="contact-form-grid">
            
            {/* Left Block: Form + Dark Info */}
            <div className="contact-inner-grid">
              
              {/* Dark Box */}
              <div style={{ background: '#111', color: '#fff', padding: '32px' }}>
                <div style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '16px' }}>பதிவளிப்பு உத்தரவாதம்</div>
                <h3 style={{ fontSize: '24px', fontFamily: 'var(--serif)', lineHeight: 1.3, marginBottom: '16px' }}>உங்கள் சந்தேகம் / செய்தியை எங்களிடம் பகிர்ந்து கொள்ளுங்கள்.</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.8, marginBottom: '32px' }}>நாங்கள் ஒரே நாளுக்குள் (சாதாரணமாக 4 மணி நேரத்திற்குள்) பதிலளிப்போம். அவசரமான செய்தி டிப் இருந்தால், கீழே உள்ள ஹாட்லைனை அழைக்கவும்.</p>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ color: 'var(--accent)', marginTop: '4px' }}>{SVG_PHONE}</div>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>செய்தி டெஸ்க்</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>1800 425 1234</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ color: 'var(--accent)', marginTop: '4px' }}>{SVG_MAIL}</div>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>தலைமையகம்</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, wordBreak: 'break-all' }}>editor@maraimalaimurasu.com</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--accent)', marginTop: '4px' }}>{SVG_TECH}</div>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>பதிவளிப்பு SLA</div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>திங்-வெள் · 4 மணி நேரம்</div>
                  </div>
                </div>
              </div>

              {/* Form Box */}
              <div style={{ padding: '32px' }}>
                <form className="contact-form-fields">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>பெயர் <span style={{color: 'var(--accent)'}}>*</span></label>
                    <input type="text" placeholder="உதா: ராமசாமி வேலன்" style={{ width: '100%', padding: '12px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px', fontFamily: 'var(--sans)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>மின்னஞ்சல் <span style={{color: 'var(--accent)'}}>*</span></label>
                    <input type="email" placeholder="ramu@example.com" style={{ width: '100%', padding: '12px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px', fontFamily: 'var(--sans)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>தொலைபேசி எண்</label>
                    <input type="tel" placeholder="+91 98400 12345" style={{ width: '100%', padding: '12px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px', fontFamily: 'var(--sans)' }} />
                    <div style={{ fontSize: '10px', color: 'var(--ink-3)', marginTop: '4px' }}>விருப்பத்திற்குரியது</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>பொருள் <span style={{color: 'var(--accent)'}}>*</span></label>
                    <select style={{ width: '100%', padding: '12px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px', fontFamily: 'var(--sans)', background: '#fff' }}>
                      <option>எடிட்டோரியல் / செய்தி டிப்</option>
                      <option>விளம்பரம்</option>
                      <option>சந்தா உதவி</option>
                      <option>பிற</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>செய்தி <span style={{color: 'var(--accent)'}}>*</span></label>
                    <textarea placeholder="உங்கள் செய்தியை விரிவாக எழுதுங்கள் — குறைந்தது 10 எழுத்துகள்." style={{ width: '100%', padding: '12px', border: '1px solid var(--rule)', borderRadius: '4px', fontSize: '14px', fontFamily: 'var(--sans)', height: '120px', resize: 'vertical' }}></textarea>
                    <div style={{ fontSize: '10px', color: 'var(--ink-3)', marginTop: '4px', textAlign: 'right' }}>0 / 1000 எழுத்துகள்</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <input type="checkbox" id="terms" style={{ marginTop: '4px' }} />
                    <label htmlFor="terms" style={{ fontSize: '12px', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                      நான் <a href="/privacy" style={{ color: 'var(--accent)' }}>தனியுரிமை கொள்கை</a>யையும் தொடர்பு கொள்கையையும் ஏற்றுகொள்கிறேன். எனது தகவல் செய்தி டெஸ்க்/சந்தா குழு மட்டுமே பயன்படுத்தப்படும்.
                    </label>
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--rule)', paddingTop: '24px', marginTop: '8px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>🔒 SSL<br/>குறியாக்கப்பட்ட்து</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>⚡️ பதிலளிக்க<br/>மணி நேரமில்லை</div>
                    </div>
                    <button type="button" style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '2px' }}>
                      செய்தியை அனுப்பு
                      <span>→</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              
              {/* Quick Links */}
              <div style={{ background: '#fff', border: '1px solid var(--rule)', marginBottom: '32px' }}>
                <div style={{ background: '#111', color: '#fff', padding: '12px 16px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>
                  விரைவு தொடர்புகள்
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid var(--rule)', textDecoration: 'none', color: 'var(--ink)' }}>
                    <div style={{ color: 'var(--accent)' }}>{SVG_NEWS}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>செய்தி அனுப்பு</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>newsdesk@maraimalai...</div>
                    </div>
                    <div style={{ color: 'var(--rule)' }}>→</div>
                  </a>

                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid var(--rule)', textDecoration: 'none', color: 'var(--ink)' }}>
                    <div style={{ color: 'var(--accent)' }}>{SVG_ADS}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>விளம்பரம்</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>ads@maraimalai... தொடர்புக...</div>
                    </div>
                    <div style={{ color: 'var(--rule)' }}>→</div>
                  </a>

                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid var(--rule)', textDecoration: 'none', color: 'var(--ink)' }}>
                    <div style={{ color: 'var(--accent)' }}>{SVG_LOCATION}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>தலைமையகம்</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>editor@maraimalai...</div>
                    </div>
                    <div style={{ color: 'var(--rule)' }}>→</div>
                  </a>

                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid var(--rule)', textDecoration: 'none', color: 'var(--ink)' }}>
                    <div style={{ color: 'var(--accent)' }}>{SVG_TECH}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>சந்தா உதவி</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>support@maraimalai...</div>
                    </div>
                    <div style={{ color: 'var(--rule)' }}>→</div>
                  </a>

                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', textDecoration: 'none', color: 'var(--ink)' }}>
                    <div style={{ color: 'var(--accent)' }}>{SVG_MAIL}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>Corrections</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-3)' }}>corrections@maraimalai...</div>
                    </div>
                    <div style={{ color: 'var(--rule)' }}>→</div>
                  </a>

                </div>
              </div>

              {/* Sidebar Ad */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                <AdSlot network="google" size="300x250" slotId="contact-rail-1" note="Google AdSense · Sidebar" />
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
