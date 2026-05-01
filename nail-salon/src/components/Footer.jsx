import { Link } from 'react-router-dom';
import logo from "../assets/images/finer-logo.png";

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

        .ft-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .ft-band {
          border-bottom: 1px solid rgba(196,158,90,0.1);
          padding: 4.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          max-width: 1240px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

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

        .ft-body {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 4rem;
          max-width: 1240px;
          margin: 0 auto;
          padding: 5rem 2rem 4rem;
          position: relative;
          z-index: 1;
          border-bottom: 1px solid rgba(196,158,90,0.08);
        }

        .ft-logo {
          display: flex; align-items: center; gap: 0.75rem;
          text-decoration: none; margin-bottom: 1.2rem;
        }

        .ft-logo-mark { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; }
        .ft-logo-mark img { width: 100%; height: 100%; object-fit: contain; }

        .ft-logo-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 400; color: #f5f0e8; }
        .ft-logo-name em { font-style: italic; color: #c49e5a; }

        .ft-logo-sub {
          font-size: 0.52rem; font-weight: 500; letter-spacing: 0.25em;
          text-transform: uppercase; color: rgba(196,158,90,0.45);
          display: block; margin-top: 2px;
        }

        .ft-tagline {
          font-size: 0.82rem; font-weight: 300;
          color: rgba(245,240,232,0.35); line-height: 1.75;
          max-width: 220px; margin-bottom: 2.2rem;
        }

        .ft-socials { display: flex; gap: 1rem; margin-top: 1rem; }

        .ft-soc {
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(196,158,90,0.6); transition: color 0.3s ease;
        }

        .ft-soc:hover { color: #c49e5a; }

        .ft-col-title {
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em;
          text-transform: uppercase; color: #c49e5a;
          display: block; margin-bottom: 1.2rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(196,158,90,0.1);
        }

        .ft-col a {
          display: block; font-size: 0.8rem; font-weight: 300;
          color: rgba(245,240,232,0.4); text-decoration: none;
          margin-bottom: 0.9rem; transition: color 0.22s ease;
        }

        .ft-col a:hover { color: rgba(245,240,232,0.75); }

        .ft-contact-list { display: flex; flex-direction: column; gap: 0.9rem; }

        .ft-contact-row {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.85rem; color: rgba(245,240,232,0.4);
          text-decoration: none; transition: color 0.25s ease;
        }

        .ft-contact-row:hover { color: rgba(245,240,232,0.75); }

        .ft-bottom {
          max-width: 1240px; margin: 0 auto;
          padding: 1.4rem 2rem;
          display: flex; align-items: center;
          justify-content: space-between;
          position: relative; z-index: 1;
        }

        .ft-copy { font-size: 0.68rem; font-weight: 300; color: rgba(245,240,232,0.2); }

        @media (max-width: 900px) {
          .ft-body { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 580px) {
          .ft-body { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer id="contact" className="ft-root">
        <div className="ft-grain" />

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

        <div className="ft-body">
          {/* Column 1: Logo & Socials */}
          <div className="ft-logo-wrap">
            <a href="#hero" className="ft-logo">
              <div className="ft-logo-mark">
                <img src={logo} alt="Finer Nails Spa Logo" />
              </div>
              <div>
                <span className="ft-logo-name"><em>Finer</em> Nails Spa</span>
                <span className="ft-logo-sub">THE PLACE PLAZA, 3rd floor, KISII</span>
              </div>
            </a>
            <p className="ft-tagline">
              Where artistry meets ritual. Considered nail care for those who appreciate the difference.
            </p>

            <div className="ft-socials">
              <a href="https://www.instagram.com/_finer.ke?igsh=MWN3aXc1azBsZ2p5NA==" target="_blank" rel="noreferrer" className="ft-soc">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@finernailskisii?_r=1&_t=ZS-95rUO3gUV5I" target="_blank" rel="noreferrer" className="ft-soc">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="ft-col">
            <span className="ft-col-title">Navigate</span>
            {[['Home', '#hero'], ['Gallery', '#gallery'], ['About', '#about'], ['Services', '#services'], ['Book', '#pricing'], ['Location', '#location']].map(([l, h]) => (
              <a key={l} href={h}>{l}</a>
            ))}
          </div>

          {/* Column 3: Contact Details */}
          <div className="ft-col">
            <span className="ft-col-title">Contact</span>
            <div className="ft-contact-list">
              {/* WhatsApp / Call Link */}
              <a href="https://wa.me/254745557460" target="_blank" rel="noreferrer" className="ft-contact-row">
                <span className="ft-soc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3"/>
                  </svg>
                </span>
                0745 557 460
              </a>

              <a href="mailto:finernails045@gmail.com" className="ft-contact-row">
                <span className="ft-soc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                finernails045@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-copy">© {year} Finer Nails Spa.</span>
          <span className="ft-copy" style={{ opacity: 0.5 }}>Crafted for elegance ✦</span>
        </div>
      </footer>
    </>
  );
}