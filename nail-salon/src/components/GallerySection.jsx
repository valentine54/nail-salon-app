// src/components/GallerySection.jsx
import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from "react-router-dom";
import 'swiper/css';

import nail1 from "/2.jpeg";
import nail2 from "/3.jpeg";
import nail3 from "/4.jpeg";
import pedi1 from "/5.jpeg";
import pedi2 from "../assets/images/gold-foil-nail-art.jpg";
import pedi3 from "../assets/images/blush-pink-gel-nails.jpg";
import pedi4 from "../assets/images/pedi-1.jpg";
import pedi5 from "../assets/images/pedi-2.jpg";
import pedi6 from "../assets/images/pedi-3.jpg";
import pedi7 from "../assets/images/pedi-4.jpg";
import pedi8 from "../assets/images/pedi-5.jpg";
import pedi9 from "../assets/images/pedi-6.jpg";

const nails = [
  { src: nail1, alt: "Elegant French manicure", label: "French Manicure" },
  { src: nail2, alt: "Gold foil nail art", label: "Gold Foil Art" },
  { src: nail3, alt: "Blush pink gel nails", label: "Blush Gel Set" },
];

const pedicures = [
  { src: pedi1, alt: "Luxury spa pedicure", label: "Spa Pedicure" },
  { src: pedi2, alt: "Glossy gel pedicure", label: "Gel Finish" },
  { src: pedi4, alt: "Moroccan wrap pedicure", label: "Moroccan Wrap" },
  { src: pedi5, alt: "Citrus jelly pedicure", label: "Citrus Jelly Soak" },
  { src: pedi6, alt: "Gel toes", label: "Gel Toes" },
  { src: pedi7, alt: "Acrylic toes", label: "Acrylic Toes" },
  { src: pedi8, alt: "Spa ritual pedicure", label: "Spa Ritual" },
  { src: pedi9, alt: "Pedicure finish", label: "Polished Finish" },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function GallerySlider({ items, reverse = false }) {
  const timeoutRef = useRef(null);

  const handleInteraction = (swiper) => {
    swiper.autoplay.pause();
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!swiper.destroyed) swiper.autoplay.resume();
    }, 8000);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const tripled = [...items, ...items, ...items];

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={2}
      slidesPerView={1.3}
      breakpoints={{
        640: { slidesPerView: 2.2 },
        900: { slidesPerView: 3.2 },
        1200: { slidesPerView: 4 },
      }}
      speed={7000}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        reverseDirection: reverse,
      }}
      loop={true}
      grabCursor={true}
      allowTouchMove={true}
      onTouchStart={handleInteraction}
      style={{ overflow: 'hidden' }}
    >
      {tripled.map((item, i) => (
        <SwiperSlide key={i}>
          <div className="gal-slide">
            <img src={item.src} alt={item.alt} className="gal-slide-img" />
            <div className="gal-slide-overlay">
              <span className="gal-slide-label">{item.label}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function GallerySection() {
  const [sectionRef, inView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .gal-root {
          background: #000000;
          padding: 7rem 0 6rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* ── MOBILE: reduce top padding ── */
        @media (max-width: 900px) {
          .gal-root {
            padding-top: 2.5rem;
            padding-bottom: 4rem;
          }
        }

        .gal-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .gal-fade-left {
          position: absolute; top: 0; left: 0; bottom: 0; width: 120px; z-index: 5; pointer-events: none;
          background: linear-gradient(to right, #000000, transparent);
        }
        .gal-fade-right {
          position: absolute; top: 0; right: 0; bottom: 0; width: 120px; z-index: 5; pointer-events: none;
          background: linear-gradient(to left, #000000, transparent);
        }

        /* Header */
        .gal-header {
          text-align: center;
          padding: 0 2rem;
          margin-bottom: 4rem;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .gal-header.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 900px) {
          .gal-header {
            margin-bottom: 2.5rem;
          }
        }

        .gal-eyebrow {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #ffffff;
          display: block;
          margin-bottom: 1.1rem;
        }
        .gal-rule { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1.1rem; }
        .gal-rule-line {
          width: 52px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,151,90,0.65));
        }
        .gal-rule-line.r {
          background: linear-gradient(to left, transparent, rgba(196,151,90,0.65));
        }
        .gal-rule-gem {
          width: 5px; height: 5px;
          background: #c4975a;
          transform: rotate(45deg);
          box-shadow: 0 0 12px rgba(196,151,90,0.45);
        }
        .gal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4.5vw, 4rem);
          font-weight: 300; color: #ffffff; line-height: 1.08;
        }
        .gal-title em { font-style: italic; color: #ffffff; }
        .gal-sub {
          margin-top: 0.9rem;
          font-size: 0.83rem; font-weight: 300;
          color: rgba(255,255,255,0.58);
          letter-spacing: 0.05em;
        }

        /* Row labels */
        .gal-row-wrap { position: relative; margin-bottom: 2px; }
        .gal-row-label {
          position: relative; z-index: 2;
          padding: 0 2rem; margin-bottom: 0.8rem;
          display: flex; align-items: center; gap: 0.75rem;
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .gal-row-label.visible { opacity: 1; transform: translateX(0); }
        .gal-row-label-line { width: 32px; height: 1px; background: rgba(196,151,90,0.45); }
        .gal-row-label-text {
          font-size: 0.62rem; font-weight: 600;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #c4975a;
        }

        /* Slide */
        .gal-slide {
          position: relative; overflow: hidden;
          aspect-ratio: 3/4; background: #000000;
        }
        .gal-slide-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.7s cubic-bezier(.25,.46,.45,.94), filter 0.5s ease;
          filter: brightness(0.9) saturate(1.03);
        }
        .gal-slide:hover .gal-slide-img {
          transform: scale(1.06);
          filter: brightness(0.72) contrast(1.05);
        }
        .gal-slide-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%);
          display: flex; align-items: flex-end;
          padding: 1.1rem;
          opacity: 0; transition: opacity 0.4s ease;
        }
        .gal-slide:hover .gal-slide-overlay { opacity: 1; }
        .gal-slide-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-style: italic; font-weight: 300;
          color: rgba(255,255,255,0.92); letter-spacing: 0.03em;
        }

        /* CTA */
        .gal-cta-wrap {
          display: flex; justify-content: center;
          margin-top: 3.5rem; padding: 0 2rem;
          position: relative; z-index: 2;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }
        .gal-cta-wrap.visible { opacity: 1; transform: translateY(0); }
        .gal-cta {
          display: inline-flex; align-items: center; gap: 0.55rem;
          border: 1px solid #c4975a;
          color: #ffffff;
          font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 0.95rem 2rem; text-decoration: none;
          transition: all 0.3s ease;
          position: relative; overflow: hidden;
          white-space: nowrap; background: #000000; cursor: pointer;
        }
        .gal-cta::before {
          content: ''; position: absolute; inset: 0;
          background: #c4975a; transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(.25,.46,.45,.94);
        }
        .gal-cta span, .gal-cta svg {
          position: relative; z-index: 1; transition: color 0.3s ease;
        }
        .gal-cta:hover::before { transform: translateX(0); }
        .gal-cta:hover span, .gal-cta:hover svg { color: #000000; }
      `}</style>

      <section id="gallery" className="gal-root" ref={sectionRef}>
        <div className="gal-grain" />
        <div className="gal-fade-left" />
        <div className="gal-fade-right" />

        {/* Header */}
        <div className={`gal-header ${inView ? 'visible' : ''}`}>
          <span className="gal-eyebrow">The Work</span>
          <div className="gal-rule">
            <span className="gal-rule-line" />
            <span className="gal-rule-gem" />
            <span className="gal-rule-line r" />
          </div>
          <h2 className="gal-title">Our <em>Creations</em></h2>
          <p className="gal-sub">Every set is a considered composition - drag to explore</p>
        </div>

        {/* Manicure row */}
        <div className="gal-row-wrap">
          <div className={`gal-row-label ${inView ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <span className="gal-row-label-line" />
            <span className="gal-row-label-text">Manicures</span>
          </div>
          <GallerySlider items={nails} reverse={false} />
        </div>

        {/* Pedicure row */}
        <div className="gal-row-wrap" style={{ marginTop: '2px' }}>
          <div className={`gal-row-label ${inView ? 'visible' : ''}`} style={{ transitionDelay: '0.35s' }}>
            <span className="gal-row-label-line" />
            <span className="gal-row-label-text">Pedicures</span>
          </div>
          <GallerySlider items={pedicures} reverse={true} />
        </div>

        {/* CTA */}
        <div className={`gal-cta-wrap ${inView ? 'visible' : ''}`}>
          <Link to="/booking" className="gal-cta">
            <span>Book Your Appointment</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}