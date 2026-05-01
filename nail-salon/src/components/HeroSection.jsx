// src/components/HeroSection.jsx
import { useEffect, useRef } from 'react';
import nailHero from '../assets/images/landingPage.jpg';
import { Link } from "react-router-dom";

export default function HeroSection() {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const y = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${y * 0.38}px) scale(1.08)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .hero-root {
          min-height: 85vh;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          overflow: hidden;
          background: #0a0806;
          font-family: 'Jost', sans-serif;
        }

        /* Parallax image */
        .hero-img-wrap {
          position: absolute;
          inset: -10%;
          z-index: 0;
        }
        .hero-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
          transform-origin: center top;
        }

        /* Layered overlays for depth */
        .hero-overlay-base {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            to right,
            rgba(8,6,4,0.82) 0%,
            rgba(8,6,4,0.55) 45%,
            rgba(8,6,4,0.15) 100%
          );
        }
        .hero-overlay-bottom {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            to top,
            rgba(8,6,4,0.95) 0%,
            rgba(8,6,4,0.4) 30%,
            transparent 60%
          );
        }
        .hero-overlay-grain {
          position: absolute; inset: 0; z-index: 3;
          opacity: 0.04; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* Content */
        .hero-content {
          position: relative;
          z-index: 10;
          padding: 0 5vw 15vh;
          max-width: 820px;
          animation: heroFadeUp 1.2s cubic-bezier(.25,.46,.45,.94) both;
        }

        /* Eyebrow line */
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.8rem;
        }
        .hero-eyebrow-line {
          width: 36px; height: 1px;
          background: linear-gradient(to right, transparent, #ffffff);
        }
        .hero-eyebrow-text {
          font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: #ffffff;
        }

        /* Main heading */
        .hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 7.5vw, 7rem);
          font-weight: 300;
          line-height: 0.95;
          color: #f5f0e8;
          margin-bottom: 0.12em;
          letter-spacing: -0.01em;
        }
        .hero-h1 em {
          font-style: italic;
          color: #ffffff;
          display: block;
        }

        /* Divider */
        .hero-divider {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin: 2rem 0;
        }
        .hero-div-line { flex: 1; max-width: 80px; height: 1px; background: rgba(255,255,255,0.32); }
        .hero-div-gem { width: 4px; height: 4px; background: #ffffff; transform: rotate(45deg); }

        /* Sub */
        .hero-sub {
          font-size: clamp(0.85rem, 1.4vw, 1rem);
          font-weight: 300;
          color: rgba(245,240,232,0.5);
          letter-spacing: 0.06em;
          line-height: 1.75;
          max-width: 400px;
          margin-bottom: 3rem;
        }

        /* CTA row */
        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.45);
          color: #ffffff;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.9rem 2rem;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.35s ease;
        }
        .hero-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: #ffffff;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .hero-btn-primary span, .hero-btn-primary svg {
          position: relative; z-index: 1;
          transition: color 0.3s ease;
        }
        .hero-btn-primary:hover::before { transform: translateX(0); }
        .hero-btn-primary:hover span, .hero-btn-primary:hover svg { color: #0a0806; }

        .hero-btn-ghost {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.4);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.25s ease, border-color 0.25s ease;
          padding-bottom: 2px;
        }
        .hero-btn-ghost:hover {
          color: rgba(245,240,232,0.75);
          border-bottom-color: rgba(245,240,232,0.25);
        }

        /* Bottom info strip */
        .hero-strip {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 10;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: flex-end;
        }
        .hero-strip-inner {
          display: flex;
          padding: 0 5vw;
        }
        .hero-strip-item {
          padding: 1.1rem 2rem;
          border-left: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }
        .hero-strip-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 300;
          color: #ffffff;
          display: block;
          line-height: 1;
        }
        .hero-strip-lbl {
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.3);
          display: block;
          margin-top: 0.3rem;
        }

        /* Scroll cue */
        .hero-scroll {
          position: absolute;
          right: 3vw; top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          opacity: 0;
          animation: heroFadeIn 1s ease 1.4s forwards;
        }
        .hero-scroll-text {
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(196,158,90,0.5);
          writing-mode: vertical-rl;
        }
        .hero-scroll-line {
          width: 1px; height: 50px;
          background: linear-gradient(to bottom, rgba(196,158,90,0.5), transparent);
          animation: scrollPulse 2s ease infinite;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scrollPulse {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          51% { transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }

        @media (max-width: 640px) {
          .hero-content { padding: 0 1.5rem 8vh; }
          .hero-strip-item { padding: 0.9rem 1.2rem; }
          .hero-scroll { display: none; }
        }
      `}</style>

      <section id="hero" className="hero-root">
        <div className="hero-img-wrap">
          <img ref={parallaxRef} src={nailHero} alt="Finer Nails Spa - Nail studio" />
        </div>

        <div className="hero-overlay-base" />
        <div className="hero-overlay-bottom" />
        <div className="hero-overlay-grain" />

        {/* Main content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Finer Nails Spa · Kisii</span>
          </div>

          <h1 className="hero-h1">
            Indulge in
            <em>Pure Luxury</em>
          </h1>

          <div className="hero-divider">
            <span className="hero-div-line" />
            <span className="hero-div-gem" />
          </div>

          <p className="hero-sub">
            Where artistry meets ritual. Experience considered nail care in a serene, unhurried environment.
          </p>

          <div className="hero-ctas">
            <Link to="/booking" className="gal-cta">
  <span>Book Your Appointment</span>
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
</Link>
            <a href="#gallery" className="hero-btn-ghost">View Our Work</a>
          </div>
        </div>

        {/* Right scroll indicator */}
        <div className="hero-scroll">
          <span className="hero-scroll-text">Scroll</span>
          <span className="hero-scroll-line" />
        </div>

        {/* Bottom stat strip */}
        <div className="hero-strip">
          <div className="hero-strip-inner">
            {[
              ['8+', 'Years'],
              ['500+', 'Clients'],
              ['50+', 'Designs'],
            ].map(([num, lbl]) => (
              <div key={lbl} className="hero-strip-item">
                <span className="hero-strip-num">{num}</span>
                <span className="hero-strip-lbl">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}