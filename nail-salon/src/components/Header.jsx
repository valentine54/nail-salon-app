// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/finer-logo.png"
import { useAuth } from './context/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Gallery',  href: '/#gallery'  },
    { label: 'About',    href: '/#about'    },
    { label: 'Contact',  href: '/location'  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        /* ── Root bar ── */
        .hdr-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 3rem;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          transition: background 0.5s ease, border-color 0.5s ease,
                      backdrop-filter 0.5s ease, height 0.4s ease;
          border-bottom: 1px solid transparent;
          font-family: 'Jost', sans-serif;
        }
        .hdr-root.scrolled {
          background: rgba(8, 6, 4, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: rgba(255, 255, 255, 0.07);
          height: 64px;
        }

        /* ── Logo ── */
        .hdr-logo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hdr-logo-mark {
          width: 36px;
          height: 36px;
//           border: 1px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .hdr-logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hdr-logo:hover .hdr-logo-mark {
          border-color: rgba(255,255,255,0.7);
        }
        .hdr-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
          gap: 3px;
        }
        .hdr-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #f5f0e8;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .hdr-logo-name em {
          font-style: italic;
          color: #ffffff;
        }
        .hdr-logo-sub {
          font-size: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          white-space: nowrap;
        }

        /* ── Centre nav links ── */
        .hdr-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
          justify-content: center;
        }
        .hdr-nav a {
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          text-decoration: none;
          padding: 0.45rem 0.9rem;
          position: relative;
          transition: color 0.25s ease;
        }
        .hdr-nav a::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0.9rem; right: 0.9rem;
          height: 1px;
          background: #ffffff;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(.25,.46,.45,.94);
        }
        .hdr-nav a:hover {
          color: rgba(255,255,255,0.9);
        }
        .hdr-nav a:hover::after {
          transform: scaleX(1);
        }

        /* ── Right side ── */
        .hdr-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        /* Book Now button */
        .hdr-book-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          border: 1px solid rgba(255,255,255,0.4);
          color: #ffffff;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.6rem 1.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          background: transparent;
          cursor: pointer;
        }
        .hdr-book-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: #ffffff;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .hdr-book-btn span,
        .hdr-book-btn svg {
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        .hdr-book-btn:hover::before { transform: translateX(0); }
        .hdr-book-btn:hover span,
        .hdr-book-btn:hover svg    { color: #080604; }

        /* Team / profile icon */
        .hdr-team-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.25s ease, transform 0.25s ease;
          padding: 0.25rem;
        }
        .hdr-team-icon svg { width: 18px; height: 18px; }
        .hdr-team-icon:hover {
          color: rgba(255,255,255,0.85);
          transform: translateY(-1px);
        }

        /* Thin separator */
        .hdr-sep {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.12);
        }

        /* ── Mobile burger ── */
        .hdr-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hdr-burger span {
          display: block;
          width: 22px;
          height: 1px;
          background: rgba(245,240,232,0.65);
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hdr-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hdr-burger.open span:nth-child(2) { opacity: 0; }
        .hdr-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .hdr-drawer {
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: rgba(8,6,4,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 1.5rem 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          transform: translateY(-110%);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(.25,.46,.45,.94), opacity 0.3s ease;
          z-index: 99;
        }
        .hdr-drawer.open {
          transform: translateY(0);
          opacity: 1;
        }
        .hdr-drawer-link {
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
        }
        .hdr-drawer-link:hover { color: rgba(255,255,255,0.85); }
        .hdr-drawer-book {
          margin-top: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border: 1px solid rgba(255,255,255,0.35);
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.9rem 1rem;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          background: transparent;
          transition: border-color 0.3s;
        }
        .hdr-drawer-book::before {
          content: '';
          position: absolute; inset: 0;
          background: #fff;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .hdr-drawer-book span,
        .hdr-drawer-book svg { position: relative; z-index: 1; transition: color 0.3s; }
        .hdr-drawer-book:hover::before { transform: translateX(0); }
        .hdr-drawer-book:hover span,
        .hdr-drawer-book:hover svg { color: #080604; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hdr-nav { display: none; }
          .hdr-right { display: none; }
          .hdr-burger { display: flex; }
          .hdr-root { padding: 0 1.25rem; }
        }

        @media (max-width: 640px) {
          .hdr-root { height: 64px; }
          .hdr-logo-mark { width: 30px; height: 30px; }
          .hdr-logo-name { font-size: 1rem; }
          .hdr-logo-sub { display: none; }
        }
      `}</style>

      <header className={`hdr-root ${scrolled ? 'scrolled' : ''}`}>

        {/* Logo */}
        <Link to="/" className="hdr-logo">
          <div className="hdr-logo-mark">
            <img src={logo} alt="Finer Nails Spa Logo" />
          </div>
          <div className="hdr-logo-text">
            <span className="hdr-logo-name"><em>Finer</em> Nails Spa</span>
            <span className="hdr-logo-sub">The Place Plaza · 3rd Floor · Kisii</span>
          </div>
        </Link>

        {/* Centre nav */}
        <ul className="hdr-nav">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="hdr-right">
          <Link to="/booking" className="hdr-book-btn">
            <span>Book Now</span>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </Link>

          <span className="hdr-sep" />

          <Link to="/login" className="hdr-team-icon" title="Team Access">
            <svg fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 10-16 0"/>
            </svg>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className={`hdr-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </header>

      {/* Mobile drawer */}
      <div className={`hdr-drawer ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="hdr-drawer-link"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}

        <Link
          to="/booking"
          className="hdr-drawer-book"
          onClick={() => setMenuOpen(false)}
        >
          <span>Book Now</span>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
          </svg>
        </Link>
      </div>
    </>
  );
}