// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import logo from "../assets/images/finer-logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .ft-root {
          background: #000000;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-family: 'Jost', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ft-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .ft-body {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 4rem;
          max-width: 1240px;
          margin: 0 auto;
          padding: 5rem 2rem 4rem;
          position: relative;
          z-index: 1;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .ft-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 1.2rem;
        }

        .ft-logo-mark {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ft-logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .ft-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .ft-logo-name em {
          font-style: italic;
          color: #ffffff;
          margin-right: 3px;
        }

        .ft-logo-sub {
          font-size: 0.52rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          display: block;
          margin-top: 2px;
        }

        .ft-tagline {
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          line-height: 1.8;
          max-width: 240px;
          margin-bottom: 2rem;
        }

        .ft-socials {
          display: flex;
          gap: 1.1rem;
          margin-top: 1rem;
        }

        .ft-soc {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c4975a;
          transition: all 0.3s ease;
        }

        .ft-soc:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Short Underline Design Concept Change */
        .ft-col-title {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ffffff;
          display: inline-block; /* Forces width to fit text only */
          margin-bottom: 1.2rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.25); /* Elegant short underline */
        }

        /* Forces structural column items to split correctly below inline-block title element */
        .ft-col-content-wrapper {
          display: flex;
          flex-direction: column;
          margin-top: 0.3rem;
        }

        .ft-col a {
          display: block;
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          margin-bottom: 0.95rem;
          transition: color 0.25s ease;
        }

        .ft-col a:hover {
          color: #ffffff;
        }

        .ft-contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          margin-top: 0.3rem;
        }

        /* Adjacent Side-by-Side Flex Layout */
        .ft-contact-row {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.25s ease;
          width: max-content;
        }

        .ft-contact-row:hover {
          color: #ffffff;
        }

        /* Gold styling contextually targetting the integrated adjacent icon */
        .ft-contact-row svg {
          color: #c4975a;
          flex-shrink: 0;
          transition: color 0.25s ease;
        }

        .ft-contact-row:hover svg {
          color: #ffffff;
        }

        .ft-bottom {
          max-width: 1240px;
          margin: 0 auto;
          padding: 1.4rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .ft-copy {
          font-size: 0.68rem;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.04em;
        }

        @media (max-width: 900px) {
          .ft-body {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 580px) {
          .ft-body {
            grid-template-columns: 1fr;
          }

          .ft-bottom {
            flex-direction: column;
            gap: 0.7rem;
            text-align: center;
          }
        }
      `}</style>

      <footer id="contact" className="ft-root">
        <div className="ft-grain" />

        <div className="ft-body">

          {/* Logo + Tagline */}
          <div className="ft-logo-wrap">
            <a href="#hero" className="ft-logo">
              <div className="ft-logo-mark">
                <img src={logo} alt="Finer Nails Spa Logo" />
              </div>

              <div>
                <span className="ft-logo-name">
                  <em>Finer</em> Nails Spa
                </span>

                <span className="ft-logo-sub">
                  THE PLACE PLAZA, 3rd FLOOR, KISII
                </span>
              </div>
            </a>

            <p className="ft-tagline">
              Where artistry meets ritual. Considered nail care for those who appreciate refined beauty.
            </p>

            <div className="ft-socials">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/_finer.ke?igsh=MWN3aXc1azBsZ2p5NA=="
                target="_blank"
                rel="noreferrer"
                className="ft-soc"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@finernailskisii?_r=1&_t=ZS-95rUO3gUV5I"
                target="_blank"
                rel="noreferrer"
                className="ft-soc"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="ft-soc"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0 1 14.1 6h2.4v3h-2c-.7 0-.9.3-.9.9V12H17l-.5 3h-2.3v7A10 10 0 0 0 22 12z"/>
                </svg>
              </a>

            </div>
          </div>

          {/* Navigation */}
          <div className="ft-col">
            <span className="ft-col-title">Navigate</span>

            <div className="ft-col-content-wrapper">
              {[
                ['Home', '#hero'],
                ['Gallery', '#gallery'],
                ['About', '#about'],
                ['Services', '#services'],
                ['Book', '#pricing'],
                ['Location', '#location'],
              ].map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="ft-col">
            <span className="ft-col-title">Contact</span>

            <div className="ft-contact-list">

              {/* Phone Line Item */}
              <a
                href="https://wa.me/254745557460"
                target="_blank"
                rel="noreferrer"
                className="ft-contact-row"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3"/>
                </svg>
                <span>0745 557 460</span>
              </a>

              {/* Email Line Item */}
              <a
                href="mailto:finernails045@gmail.com"
                className="ft-contact-row"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>finernails045@gmail.com</span>
              </a>

            </div>
          </div>

        </div>


      </footer>
    </>
  );
}