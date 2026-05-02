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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; }

        .fn-hero {
          min-height: 92vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          overflow: hidden;
          background: #000000;
          font-family: 'Jost', sans-serif;
          --soft-gold: #c7a56a;
        }

        /* Parallax image */
        .fn-img-wrap {
          position: absolute;
          inset: -10%;
          z-index: 0;
        }
        .fn-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
          transform-origin: center top;
        }

        /* Faint FN watermark */
        .fn-watermark {
          position: absolute;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          opacity: 0.02;
          font-family: 'Cormorant Garamond', serif;
          font-size: 28rem;
          font-weight: 600;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.05em;
          pointer-events: none;
          user-select: none;
        }

    .fn-curve {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.06);
  top: 20%;
  left: 60%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.fn-curve-2 {
  width: 800px;
  height: 800px;
  opacity: 0.3;
}

        /* Gradient overlays */
        .fn-fade-left {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(
            100deg,
            rgba(8,6,4,0.97) 0%,
            rgba(8,6,4,0.70) 40%,
            rgba(8,6,4,0.10) 75%,
            transparent 100%
          );
        }
        .fn-fade-bottom {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(
            to top,
            rgba(8,6,4,1) 0%,
            rgba(8,6,4,0.6) 18%,
            transparent 45%
          );
        }

        /* Navigation */
        .fn-nav {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 20;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 3vw;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .fn-nav-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.08em;
          text-decoration: none;
        }
        .fn-nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          margin: 0; padding: 0;
        }
        .fn-nav-links a {
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          text-decoration: none;
          transition: color 0.2s;
        }
        .fn-nav-links a:hover { color: rgba(255,255,255,0.85); }
        .fn-nav-book {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 0.5rem 1.2rem;
          text-decoration: none;
          transition: background 0.25s, color 0.25s;
        }
        .fn-nav-book:hover { background: #fff; color: #080604; }

        /* Main content */
        .fn-content {
          position: relative;
          z-index: 10;
          padding: 0 6vw 12vh 6vw;
          max-width: 900px;
          animation: fnFadeUp 1.2s cubic-bezier(.25,.46,.45,.94) both;
        }

        /* Eyebrow */
        .fn-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .fn-eyebrow-line {
          display: block;
          width: 40px; height: 1px;
          background: #fff;
        }
        .fn-eyebrow-text {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* Heading */
        .fn-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.2rem, 7vw, 6.5rem);
          font-weight: 300;
          line-height: 0.92;
          color: #f8f5f0;
          letter-spacing: -0.02em;
          margin-bottom: 0.08em;
        }
        .fn-h1 em {
          font-style: italic;
          color: #ffffff;
          display: block;
        }

        /* Ornamental divider */
        .fn-ornament {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin: 2.2rem 0 2rem;
        }
        .fn-orn-line {
          height: 1px;
          width: 60px;
          background: rgba(255,255,255,0.25);
        }
        .fn-orn-center {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .fn-orn-diamond {
          width: 5px; height: 5px;
          background: #fff;
          transform: rotate(45deg);
          opacity: 0.9;
        }
        .fn-orn-diamond-sm {
          width: 3px; height: 3px;
          background: rgba(255,255,255,0.4);
          transform: rotate(45deg);
        }

        /* Subtitle */
        .fn-sub {
          font-size: 0.88rem;
          font-weight: 300;
          color: rgba(248,245,240,0.42);
          letter-spacing: 0.07em;
          line-height: 1.85;
          max-width: 380px;
          margin-bottom: 3rem;
        }

        /* CTA row */
        .fn-ctas {
          display: flex;
          align-items: center;
          gap: 2.4rem;
          flex-wrap: wrap;
        }

        .fn-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          background: transparent;
          color: var(--soft-gold);
  border: 1px solid rgba(199,165,106,0.45);
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          padding: 1rem 2.2rem;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .fn-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--soft-gold);
          transform: translateX(-102%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .fn-btn-primary span,
        .fn-btn-primary svg {
          position: relative;
          z-index: 1;
          transition: color 0.3s;
        }
        .fn-btn-primary:hover::before { transform: translateX(0); }
        .fn-btn-primary:hover span,
        .fn-btn-primary:hover svg { color: #080604; }
        .fn-btn-primary:hover { border-color: #fff; }

        .fn-btn-ghost {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.32);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          padding-bottom: 3px;
          transition: color 0.25s, border-color 0.25s;
        }
        .fn-btn-ghost:hover {
          color: rgba(255,255,255,0.7);
          border-bottom-color: rgba(255,255,255,0.4);
        }

        /* Scroll indicator */
        .fn-scroll {
          position: absolute;
          right: 3vw; top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          animation: fnFadeIn 1s ease 1.4s forwards;
        }
        .fn-scroll-txt {
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          writing-mode: vertical-rl;
        }
        .fn-scroll-bar {
          width: 1px; height: 48px;
          background: rgba(199,165,106,0.2);
          position: relative;
          overflow: hidden;
        }
        .fn-scroll-bar::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 100%;
          background: rgba(255,255,255,0.6);
          animation: fnScrollDrop 2s ease-in-out infinite;
        }

        /* Stat strip */
        .fn-strip {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
}

        .fn-strip-inner { display: flex; }
        .fn-strip-item {
          padding: 1.2rem 2.2rem;
          border-left: 1px solid rgba(255,255,255,0.08);
          text-align: center;
        }
        .fn-strip-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: var(--soft-gold);
          display: block;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .fn-strip-lbl {
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(248,245,240,0.25);
          display: block;
          margin-top: 0.35rem;
        }

        /* Animations */
        @keyframes fnFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fnFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes fnScrollDrop {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @media (max-width: 768px) {
          .fn-nav-links { display: none; }
          .fn-content { padding: 0 1.5rem 8vh; }
          .fn-strip-item { padding: 0.9rem 1.2rem; }
          .fn-scroll { display: none; }
          .fn-watermark { font-size: 14rem; right: -20px; }
          .fn-corner-tr { top: 1.2rem; right: 1.2rem; }
        }
      `}</style>

      <section id="hero" className="fn-hero">

        {/* Parallax image */}
        <div className="fn-img-wrap">
          <img ref={parallaxRef} src={nailHero} alt="Finer Nails Spa - Nail studio" />
        </div>

        {/* Background layers */}
        <div className="fn-watermark">FN</div>
        <div className="fn-curve fn-curve-2" />

        <div className="fn-fade-left" />
        <div className="fn-fade-bottom" />



        {/* Hero content */}
        <div className="fn-content">


          <h1 className="fn-h1">
            Indulge in
            <em>Pure Luxury</em>
          </h1>

          <div className="fn-ornament">
            <span className="fn-orn-line" />
            <span className="fn-orn-center">
              <span className="fn-orn-diamond-sm" />
              <span className="fn-orn-diamond" />
              <span className="fn-orn-diamond-sm" />
            </span>
            <span className="fn-orn-line" />
          </div>

          <p className="fn-sub">
            Where artistry meets ritual. Experience considered nail care in a serene, unhurried environment.
          </p>

          <div className="fn-ctas">
            <Link to="/booking" className="fn-btn-primary">
              <span>Book Your Appointment</span>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="#gallery" className="fn-btn-ghost">View Our Work</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="fn-scroll">
          <span className="fn-scroll-txt">Scroll</span>
          <span className="fn-scroll-bar" />
        </div>

        {/* Stat strip */}
        <div className="fn-strip">
          <div className="fn-strip-inner">
            {[
              ['8+',   'Years'],
              ['500+', 'Clients'],
              ['50+',  'Designs'],
            ].map(([num, lbl]) => (
              <div key={lbl} className="fn-strip-item">
                <span className="fn-strip-num">{num}</span>
                <span className="fn-strip-lbl">{lbl}</span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}