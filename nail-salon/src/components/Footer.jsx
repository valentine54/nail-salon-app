// src/components/Footer.jsx
// Replaces ContactSection — update your App.jsx import accordingly:
//   import Footer from './components/Footer';
//   Remove: import ContactSection from './components/ContactSection';
//   Remove: <ContactSection /> from JSX
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .ft-root {
          background: #080604;
          border-top: 1px solid rgba(196,158,90,0.1);
          font-family: 'Jost', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Grain */
        .ft-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* ── TOP CTA BAND ── */
        .ft-band {
          border-bottom: 1px solid rgba(196,158,90,0.1);
          padding: 3.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          max-width: 1240px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }
        .ft-band-left {}
        .ft-band-label {
          font-size: 0.62rem; font-weight: 500; letter-spacing: 0.28em;
          text-transform: uppercase; color: #c49e5a; display: block; margin-bottom: 0.6rem;
        }
        .ft-band-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 300; color: #f5f0e8; line-height: 1.1;
        }
        .ft-band-title em { font-style: italic; color: #c49e5a; }
        .ft-band-btn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: transparent; border: 1px solid rgba(196,158,90,0.5);
          color: #c49e5a; font-family: 'Jost', sans-serif;
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.22em;
          text-transform: uppercase; padding: 0.9rem 2rem;
          text-decoration: none; cursor: pointer;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease; flex-shrink: 0;
        }
        .ft-band-btn::before {
          content: ''; position: absolute; inset: 0;
          background: #c49e5a; transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .ft-band-btn span, .ft-band-btn svg { position: relative; z-index: 1; transition: color 0.3s; }
        .ft-band-btn:hover::before { transform: translateX(0); }
        .ft-band-btn:hover span, .ft-band-btn:hover svg { color: #0a0806; }

        /* ── MAIN FOOTER BODY ── */
        .ft-body {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 3rem;
          max-width: 1240px; margin: 0 auto;
          padding: 4rem 2rem 3.5rem;
          position: relative; z-index: 1;
          border-bottom: 1px solid rgba(196,158,90,0.08);
        }

        /* Logo col */
        .ft-logo-wrap {}
        .ft-logo {
          display: flex; align-items: center; gap: 0.75rem;
          text-decoration: none; margin-bottom: 1.2rem;
        }
        .ft-logo-mark {
          width: 32px; height: 32px;
          border: 1px solid rgba(196,158,90,0.4);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; position: relative;
        }
        .ft-logo-mark::before {
          content: ''; position: absolute; inset: 3px;
          border: 1px solid rgba(196,158,90,0.15);
        }
        .ft-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 400; color: #f5f0e8;
        }
        .ft-logo-name em { font-style: italic; color: #c49e5a; }
        .ft-logo-sub {
          font-size: 0.52rem; font-weight: 500; letter-spacing: 0.25em;
          text-transform: uppercase; color: rgba(196,158,90,0.45);
          display: block; margin-top: 2px;
        }
        .ft-tagline {
          font-size: 0.82rem; font-weight: 300;
          color: rgba(245,240,232,0.35); line-height: 1.75;
          max-width: 220px; margin-bottom: 1.8rem;
        }

        /* Social links */
        .ft-socials { display: flex; gap: 0.5rem; }
        .ft-soc {
          width: 32px; height: 32px;
          border: 1px solid rgba(196,158,90,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 600;
          color: rgba(245,240,232,0.35); text-decoration: none;
          transition: all 0.25s ease;
        }
        .ft-soc:hover { border-color: #c49e5a; color: #c49e5a; }

        /* Nav columns */
        .ft-col {}
        .ft-col-title {
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em;
          text-transform: uppercase; color: #c49e5a;
          display: block; margin-bottom: 1.2rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(196,158,90,0.1);
        }
        .ft-col a, .ft-col p {
          display: block; font-size: 0.8rem; font-weight: 300;
          color: rgba(245,240,232,0.4); text-decoration: none;
          margin-bottom: 0.65rem; line-height: 1.6;
          transition: color 0.22s ease;
        }
        .ft-col a:hover { color: rgba(245,240,232,0.75); }

        /* Contact col specifics */
        .ft-contact-item {
          display: flex; align-items: flex-start; gap: 0.65rem;
          margin-bottom: 0.85rem;
        }
        .ft-contact-icon { font-size: 0.75rem; margin-top: 0.15rem; flex-shrink: 0; }
        .ft-contact-text {
          font-size: 0.8rem; font-weight: 300;
          color: rgba(245,240,232,0.4); line-height: 1.5;
        }
        .ft-contact-text a {
          color: rgba(245,240,232,0.4) !important;
          text-decoration: none; transition: color 0.22s;
          display: inline !important; margin: 0 !important;
        }
        .ft-contact-text a:hover { color: #c49e5a !important; }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          max-width: 1240px; margin: 0 auto;
          padding: 1.4rem 2rem;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
          position: relative; z-index: 1;
        }
        .ft-copy {
          font-size: 0.68rem; font-weight: 300;
          color: rgba(245,240,232,0.2); letter-spacing: 0.05em;
        }
        .ft-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem; font-style: italic; font-weight: 300;
          color: rgba(196,158,90,0.3); letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .ft-body { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .ft-band { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 580px) {
          .ft-body { grid-template-columns: 1fr; }
          .ft-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer id="contact" className="ft-root">
        <div className="ft-grain" />

        {/* CTA band */}
        <div className="ft-band">
          <div className="ft-band-left">
            <span className="ft-band-label">Ready to indulge?</span>
            <p className="ft-band-title">Your next visit<br />starts <em>right here</em></p>
          </div>
          <Link to="/booking" className="ft-band-btn">
            <span>Book an Appointment</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>


        {/* Main body */}
        <div className="ft-body">
          {/* Brand / Logo column */}
          <div className="ft-logo-wrap">
            <a href="#hero" className="ft-logo">
              <div className="ft-logo-mark">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c49e5a" strokeWidth="1.2">
                  <path d="M12 2C9 7 4 8 4 13a8 8 0 0 0 16 0c0-5-5-6-8-11Z" />
                </svg>
              </div>
              <div>
                <span className="ft-logo-name"><em>Finer</em> Nails Spa</span>
                <span className="ft-logo-sub">The PLACE Complex, Kisii </span>
              </div>
            </a>
            <p className="ft-tagline">
              Where artistry meets ritual. Considered nail care for those who appreciate the difference.
            </p>
            <div className="ft-socials">
              {/* Instagram, Facebook, TikTok links unchanged */}
              {/* ... your social icons here ... */}
            </div>
          </div>

          {/* Services column */}
          <div className="ft-col">
            <span className="ft-col-title">Services</span>
            {['Gel Nails', 'Acrylic Extensions', 'Nail Art', 'Spa Pedicure', 'Bridal Package'].map(s => (
              <a key={s} href="#services">{s}</a>
            ))}
          </div>

          {/* Navigate column */}
          <div className="ft-col">
            <span className="ft-col-title">Navigate</span>
            {[['Home', '#hero'], ['Gallery', '#gallery'], ['About', '#about'], ['Services', '#services'], ['Book', '#pricing'], ['Location', '#location']].map(([l, h]) => (
              <a key={l} href={h}>{l}</a>
            ))}
          </div>

          {/* Contact */}
<div className="ft-col">
  <span className="ft-col-title">Contact</span>

  <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem"  // same spacing as other .ft-col links
  }}>
    {/* Phone */}
    <a
      href="tel:+254123456789"
      style={{
        fontSize: "1.0rem",
        fontWeight: 300,
        color: "rgba(245,240,232,0.4)",
        lineHeight: 1.6,
        textDecoration: "none",
        transition: "color 0.22s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = "rgba(245,240,232,0.75)"}
      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(245,240,232,0.4)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span className="ft-soc" style={{
          width: "32px",
          height: "32px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </span>
        +254 123 456 789
      </div>
    </a>

    {/* Email */}
    <a
      href="mailto:hello@finernailsspa.com"
      style={{
        fontSize: "1.09rem",
        fontWeight: 300,
        color: "rgba(245,240,232,0.4)",
        lineHeight: 1.6,
        textDecoration: "none",
        transition: "color 0.22s ease"
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = "rgba(245,240,232,0.75)"}
      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(245,240,232,0.4)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span className="ft-soc" style={{
          width: "32px",
          height: "32px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </span>
        hello@finernailsspa.com
      </div>
    </a>
  </div>
</div>
        </div>

        {/* Bottom bar (uncomment when ready) */}
        {/* <div className="ft-bottom">
          <span className="ft-copy">© {year} Finer Nails Spa. All rights reserved.</span>
          <span className="ft-mark">Crafted with care in Eldoret ✦</span>
        </div> */}
      </footer>
    </>
  );
}