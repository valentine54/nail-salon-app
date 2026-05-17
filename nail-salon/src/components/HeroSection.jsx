// src/components/HeroSection.jsx

import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@200;300;400;500&display=swap');

        * {
          box-sizing: border-box;
        }

        .fn-hero {
          min-height: 95vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #000000;
          font-family: 'Jost', sans-serif;

          --soft-gold: #c4975a;
          --gold-border: rgba(196,151,90,0.25);
        }

        /* BACKGROUND GRAIN */

        .fn-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.03;

          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

          background-size: 180px;

          pointer-events: none;
        }

        /* ELEGANT LINES */

        .fn-lines {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .fn-l1 {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: drawL 2.5s ease forwards;
        }

        .fn-l2 {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: drawL 2s ease 0.5s forwards;
        }

        @keyframes drawL {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* LEFT CONTENT */

        .fn-content {
          position: relative;
          z-index: 10;

          flex: 0 0 42%;

          padding:
            6vh
            4vw
            4vh
            6vw;

          animation: fadeUp 1s ease both;
        }

        .fn-h1 {
          font-family: 'Cormorant Garamond', serif;

          font-size: clamp(3.5rem, 6vw, 6.3rem);

          line-height: 0.92;

          font-weight: 300;

          color: #ffffff;

          margin-bottom: 0.2rem;
        }

        .fn-h1 em {
          display: block;

          font-style: italic;

          color: #ffffff;

          text-shadow:
            0 0 25px rgba(196,151,90,0.18);
        }

        .fn-ornament {
          display: flex;
          align-items: center;
          gap: 0.8rem;

          margin:
            2rem 0
            1.8rem;
        }

        .fn-orn-line {
          width: 48px;
          height: 1px;

          background: var(--gold-border);
        }

        .fn-orn-center {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .fn-orn-diamond {
          width: 5px;
          height: 5px;

          background: var(--soft-gold);

          transform: rotate(45deg);
        }

        .fn-orn-diamond-sm {
          width: 3px;
          height: 3px;

          background: rgba(196,151,90,0.5);

          transform: rotate(45deg);
        }

        .fn-sub {
          max-width: 360px;

          color: rgba(255,255,255,0.78);

          font-size: 0.84rem;

          line-height: 1.9;

          letter-spacing: 0.05em;

          margin-bottom: 2.8rem;
        }

        /* BUTTONS */

        .fn-ctas {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .fn-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;

          padding:
            1rem
            2.2rem;

          border: 1px solid var(--soft-gold);

          text-decoration: none;

          color: var(--soft-gold);

          text-transform: uppercase;

          letter-spacing: 0.24em;

          font-size: 0.62rem;

          position: relative;

          overflow: hidden;

          transition: all 0.35s ease;
        }

        .fn-btn-primary::before {
          content: '';

          position: absolute;
          inset: 0;

          background: var(--soft-gold);

          transform: translateX(-102%);

          transition: transform 0.4s ease;
        }

        .fn-btn-primary span,
        .fn-btn-primary svg {
          position: relative;
          z-index: 2;
        }

        .fn-btn-primary:hover::before {
          transform: translateX(0);
        }

        .fn-btn-primary:hover {
          color: #000000;
        }

        .fn-btn-ghost {
          text-decoration: none;

          color: #ffffff;

          font-size: 0.62rem;

          text-transform: uppercase;

          letter-spacing: 0.22em;

          position: relative;
        }

        .fn-btn-ghost::after {
          content: '';

          position: absolute;

          left: 0;
          bottom: -4px;

          width: 0;
          height: 1px;

          background: var(--soft-gold);

          transition: width 0.35s ease;
        }

        .fn-btn-ghost:hover::after {
          width: 100%;
        }

        /* RIGHT SIDE */

        .fn-media {
          position: relative;
          flex: 0 0 58%;
          height: 95vh;
          z-index: 5;
        }

        .fn-media-layout {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* MAIN IMAGE */

        .fn-main-media {
          position: absolute;

          left: 2%;
          top: 12%;

          width: 48%;
          height: 74%;

          overflow: hidden;

          border-radius: 2px;

          box-shadow:
            0 40px 100px rgba(0,0,0,0.95);

          animation: floatA 10s ease-in-out infinite;
        }

        .fn-main-media::after {
          content: '';

          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to top,
              rgba(0,0,0,0.65),
              transparent 45%
            );

          z-index: 2;
        }

        .fn-main-media img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          filter:
            brightness(0.92)
            contrast(1.04);

          transition:
            transform 1.4s ease,
            filter 1.2s ease;
        }

        .fn-main-media:hover img {
          transform: scale(1.05);
          filter: brightness(1);
        }

        /* VIDEO */

        .fn-floating-video {
          position: absolute;

          left: 46%;
          top: 28%;

          width: 34%;
          height: 48%;

          z-index: 6;

          overflow: hidden;

          border-radius: 2px;

          box-shadow:
            0 30px 80px rgba(0,0,0,1);

          animation: floatB 8s ease-in-out infinite;
        }

        .fn-floating-video::before {
          content: '';

          position: absolute;

          left: -180px;
          top: 50%;

          width: 220px;
          height: 1px;

          transform: translateY(-50%);

          background:
            linear-gradient(
              to right,
              rgba(196,151,90,0),
              rgba(196,151,90,0.45),
              rgba(196,151,90,0)
            );

          filter: blur(0.4px);

          z-index: 10;
        }

        .fn-floating-video::after {
          content: '';

          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              135deg,
              rgba(196,151,90,0.12),
              transparent 30%,
              transparent 70%,
              rgba(196,151,90,0.08)
            );

          z-index: 2;

          pointer-events: none;
        }

        .fn-floating-video video {
          width: 100%;
          height: 100%;

          object-fit: cover;

          filter:
            brightness(0.9)
            contrast(1.05);

          transition:
            transform 1s ease,
            filter 1s ease;
        }

        .fn-floating-video:hover video {
          transform: scale(1.06);
          filter: brightness(1);
        }

        /* BLEND LAYER */

        .fn-media-blend {
          position: absolute;

          left: 42%;
          top: 22%;

          width: 18%;
          height: 48%;

          z-index: 5;

          pointer-events: none;

          background:
            radial-gradient(
              circle at center,
              rgba(196,151,90,0.10),
              transparent 72%
            );

          filter: blur(18px);
        }

        .fn-lux-accent {
          position: absolute;

          left: 39%;
          top: 58%;

          width: 140px;
          height: 140px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(196,151,90,0.12),
              transparent 72%
            );

          filter: blur(25px);

          z-index: 3;

          pointer-events: none;
        }

        /* SCROLL */

        .fn-scroll {
          position: absolute;

          right: 1.5vw;
          top: 50%;

          transform: translateY(-50%);

          z-index: 20;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .fn-scroll-txt {
          writing-mode: vertical-rl;

          font-size: 0.48rem;

          text-transform: uppercase;

          letter-spacing: 0.28em;

          color: var(--soft-gold);
        }

        .fn-scroll-bar {
          width: 1px;
          height: 50px;

          background: rgba(196,151,90,0.2);

          overflow: hidden;

          position: relative;
        }

        .fn-scroll-bar::after {
          content: '';

          position: absolute;
          inset: 0;

          background: var(--soft-gold);

          animation: scrollDrop 2s ease infinite;
        }

        /* STATS */

        .fn-strip {
          position: absolute;

          bottom: 0;
          left: 0;
          right: 0;

          z-index: 15;

          display: flex;
          justify-content: flex-end;
        }

        .fn-strip-inner {
          display: flex;
        }

        .fn-strip-item {
          padding:
            0.7rem
            2rem;

          border-left: 1px solid var(--gold-border);

          border-top: 1px solid var(--gold-border);

          background: rgba(0,0,0,0.95);

          text-align: center;
        }

        .fn-strip-num {
          display: block;

          font-family: 'Cormorant Garamond', serif;

          font-size: 1.4rem;

          color: var(--soft-gold);
        }

        .fn-strip-lbl {
          display: block;

          margin-top: 0.3rem;

          font-size: 0.48rem;

          text-transform: uppercase;

          letter-spacing: 0.22em;

          color: rgba(255,255,255,0.7);
        }

        /* ANIMATIONS */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatA {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatB {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        @keyframes scrollDrop {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        /* ─────────────────────────────
           MOBILE
        ───────────────────────────── */

        @media (max-width: 900px) {

          /* Stack vertically, full height auto */
          .fn-hero {
            flex-direction: column;
            align-items: stretch;
            min-height: 100svh;
          }

          /* ── Content block ── */
          .fn-content {
            width: 100%;
            flex: none;
            padding: 7rem 1.6rem 2rem;
            text-align: center;
          }

          .fn-h1 {
            font-size: clamp(3rem, 13vw, 4.5rem);
            line-height: 0.95;
          }

          .fn-ornament {
            justify-content: center;
            margin: 1.4rem 0 1.2rem;
          }

          .fn-sub {
            max-width: 100%;
            font-size: 0.82rem;
            margin-bottom: 2rem;
          }

          .fn-ctas {
            justify-content: center;
            gap: 1.2rem;
          }

          /* ── Media block ── */
          .fn-media {
            flex: none;
            width: 100%;
            /* fixed aspect so images aren't crushed */
            height: 72vw;
            min-height: 280px;
            max-height: 440px;
          }

          /* Main image: left side, taller */
          .fn-main-media {
            left: 3%;
            top: 5%;
            width: 56%;
            height: 88%;
          }

          /* Floating video: right side, offset down */
          .fn-floating-video {
            left: auto;
            right: 3%;
            top: 20%;
            width: 40%;
            height: 65%;
          }

          /* Hide decorative blends on mobile (perf + space) */
          .fn-media-blend,
          .fn-lux-accent,
          .fn-floating-video::before {
            display: none;
          }

          /* Hide scroll indicator */
          .fn-scroll {
            display: none;
          }

          /* ── Stats strip ── */
          .fn-strip {
            /* take it out of absolute flow so it doesn't overlap media */
            position: relative;
            bottom: auto;
            left: auto;
            right: auto;
            justify-content: stretch;
          }

          .fn-strip-inner {
            width: 100%;
          }

          .fn-strip-item {
            flex: 1;
            padding: 0.9rem 0.5rem;
            border-left: 1px solid var(--gold-border);
            border-top: 1px solid var(--gold-border);
          }

          /* Remove left border on first item to avoid double edge */
          .fn-strip-item:first-child {
            border-left: none;
          }

          .fn-strip-num {
            font-size: 1.3rem;
          }

          .fn-strip-lbl {
            font-size: 0.44rem;
          }
        }

        /* Extra-small phones */
        @media (max-width: 400px) {
          .fn-content {
            padding-top: 6rem;
          }

          .fn-media {
            height: 80vw;
            min-height: 240px;
          }

          .fn-btn-primary {
            padding: 0.85rem 1.5rem;
            font-size: 0.58rem;
          }
        }
      `}</style>

      <section id="hero" className="fn-hero">

        <div className="fn-grain" />

        <svg
          className="fn-lines"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            className="fn-l1"
            x1="0" y1="900" x2="700" y2="0"
            stroke="rgba(196,151,90,0.08)"
            strokeWidth="1"
          />
          <line
            className="fn-l2"
            x1="900" y1="0" x2="1440" y2="650"
            stroke="rgba(196,151,90,0.05)"
            strokeWidth="1"
          />
        </svg>

        {/* LEFT CONTENT */}
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
            Where artistry meets ritual.
            Experience considered nail care
            in a serene, luxurious atmosphere.
          </p>

          <div className="fn-ctas">
            <Link to="/booking" className="fn-btn-primary">
              <span>Book Your Appointment</span>
              <svg
                width="11" height="11"
                fill="none" stroke="currentColor"
                strokeWidth="1.8" viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round" strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>

            <a href="#gallery" className="fn-btn-ghost">
              View Our Work
            </a>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="fn-media">
          <div className="fn-media-layout">

            <div className="fn-main-media">
              <img src="/3.jpeg" alt="Luxury nails" />
            </div>

            <div className="fn-media-blend" />
            <div className="fn-lux-accent" />

            <div className="fn-floating-video">
              <video src="/6.mp4" autoPlay muted loop playsInline />
            </div>

          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="fn-scroll">
          <span className="fn-scroll-txt">Scroll</span>
          <span className="fn-scroll-bar" />
        </div>

        {/* STATS */}
        <div className="fn-strip">
          <div className="fn-strip-inner">
            {[
              ['8+', 'Years'],
              ['500+', 'Clients'],
              ['50+', 'Designs'],
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