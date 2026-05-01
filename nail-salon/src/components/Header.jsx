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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .hdr-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 2.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease, height 0.4s ease;
          border-bottom: 1px solid transparent;
          font-family: 'Jost', sans-serif;
        }
        .hdr-root.scrolled {
          background: rgba(10, 8, 6, 0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom-color: rgba(196, 158, 90, 0.12);
          height: 62px;
        }

        /* ── Logo ── */
        .hdr-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hdr-logo-mark {
          width: 34px;
          height: 34px;
          border: 1px solid rgba(255,255,255,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          transition: border-color 0.3s ease;
        }
//         .hdr-logo-mark::before {
//           content: '';
//           position: absolute;
//           inset: 3px;
//           border: 1px solid rgba(255,255,255,0.18);
//         }
        .hdr-logo-mark svg {
          color: #ffffff;
        }

        .hdr-logo-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* fills the square */
}
        .hdr-logo:hover .hdr-logo-mark {
          border-color: rgba(196,158,90,0.9);
        }
        .hdr-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
          gap: 2px;
        }
        .hdr-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
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
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* ── Right side nav ── */
        .hdr-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        /* Location link */
        .hdr-nav-link {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.55);
          text-decoration: none;
          padding: 0.5rem 1rem;
          position: relative;
          transition: color 0.3s ease;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 1rem; right: 1rem;
          height: 1px;
          background: #ffffff;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .hdr-nav-link:hover {
          color: #f5f0e8;
        }
        .hdr-nav-link:hover::after {
          transform: scaleX(1);
        }

        /* Separator */
        .hdr-sep {
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,0.18);
          margin: 0 0.25rem;
        }

        /* Book button */
        .hdr-book-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          border: 1px solid rgba(255,255,255,0.45);
          color: #ffffff;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.6rem 1.4rem;
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
          position: absolute;
          inset: 0;
          background: #ffffff;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .hdr-book-btn span, .hdr-book-btn svg {
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        .hdr-book-btn:hover::before {
          transform: translateX(0);
        }
        .hdr-book-btn:hover span,
        .hdr-book-btn:hover svg {
          color: #0e0c09;
        }

        /* Mobile hamburger */
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
          background: rgba(245,240,232,0.7);
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hdr-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hdr-burger.open span:nth-child(2) { opacity: 0; }
        .hdr-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Mobile drawer */
        .hdr-drawer {
          position: fixed;
          top: 62px; left: 0; right: 0;
          background: rgba(10,8,6,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transform: translateY(-110%);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(.25,.46,.45,.94), opacity 0.3s ease;
          z-index: 99;
        }
        .hdr-drawer.open {
          transform: translateY(0);
          opacity: 1;
        }
        .hdr-drawer .hdr-nav-link {
          font-size: 0.8rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .hdr-drawer .hdr-book-btn {
          align-self: flex-start;
          margin-top: 0.5rem;
        }

        @media (max-width: 640px) {
  .hdr-root {
    padding: 0 1rem;
    height: 64px;
  }

  .hdr-root.scrolled {
    height: 58px;
  }

  /* ── Logo becomes cleaner ── */
  .hdr-logo {
    gap: 0.5rem;
  }

  .hdr-logo-mark {
    width: 30px;
    height: 30px;
  }

  .hdr-logo-text {
    gap: 1px;
  }

  .hdr-logo-name {
    font-size: 1rem;
  }

  .hdr-logo-sub {
    font-size: 0.45rem;
    letter-spacing: 0.22em;
    opacity: 0.7;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Hide desktop right actions ── */
  .hdr-right {
    display: none;
  }

  /* ── Burger slightly cleaner ── */
  .hdr-burger {
    display: flex;
    gap: 4px;
  }

  .hdr-burger span {
    width: 20px;
  }

  /* ── Drawer becomes modern panel ── */
  .hdr-drawer {
    top: 58px;
    padding: 1.5rem 1.25rem;
    gap: 1rem;
    border-radius: 0 0 18px 18px;
  }

  .hdr-drawer .hdr-nav-link {
    font-size: 0.75rem;
    padding: 0.9rem 0;
  }

  /* ── Book button becomes full width on mobile ── */
  .hdr-drawer .hdr-book-btn {
    width: 100%;
    justify-content: center;
    padding: 0.9rem 1rem;
    font-size: 0.7rem;
  }
}

    .hdr-team-icon {
  display: flex;
  align-items: center;
  justify-content: center;
   color: rgba(196,158,90,0.75);
  text-decoration: none;
  transition: all 0.25s ease;
}

.hdr-team-icon svg {
  width: 18px;
  height: 18px;
}

.hdr-team-icon:hover {
  color: #ffffff;
  transform: translateY(-1px) scale(1.05);
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
      <span className="hdr-logo-sub">THE PLACE PLAZA,3rd floor - NHIF BUILDING, KISII</span>
    </div>
  </Link>

  {/* Desktop right */}
  <div className="hdr-right">
    <Link to="/location" className="hdr-nav-link">Location</Link>
    <div className="hdr-sep" />

    <Link to="/booking" className="hdr-book-btn">
      <span>Book Appointment</span>
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
      </svg>
    </Link>

    {/* Team icon */}
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

{/* Mobile drawer (YOU WERE MISSING THIS) */}
<div className={`hdr-drawer ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
  <Link
    to="/location"
    className="hdr-nav-link">
    Location
  </Link>

  <Link
    to="/booking"
    className="hdr-book-btn"
    onClick={() => setMenuOpen(false)}
  >
    <span>Book Appointment</span>
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
    </svg>
  </Link>
</div>
    </>
  );
}