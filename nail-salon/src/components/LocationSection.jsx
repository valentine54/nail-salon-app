// src/components/LocationSection.jsx
import { useEffect, useRef, useState } from 'react';

const details = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    label: 'Address',
    value: 'THE PLACE PLAZA,3rd floor - NHIF BUILDING',
    sub: 'CBD, Kisii County, KE',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: 'Hours',
    value: 'Mon – Sat  9:00 AM – 7:00 PM',
    sub: 'Sunday  10:00 AM – 5:00 PM',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    label: 'Parking',
    value: 'Free on-site parking',
    sub: 'Directly in front of the studio',
  },
//   {
//     icon: (
//       <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
//       </svg>
//     ),
//     label: 'Mobile Service',
//     value: 'We come to you',
//     sub: 'Within 20 km · +KES 2,000 travel fee',
//   },
];

function useInView(threshold = 0.15) {
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

export default function LocationSection() {
  const [sectionRef, inView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .loc-root {
          min-height: 100vh;
          background: #0e0c09;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 7rem 2rem 6rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* Ambient glow orbs */
        .loc-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }
        .loc-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(196,158,90,0.13) 0%, transparent 70%);
          top: -120px; right: -100px;
        }
        .loc-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          bottom: -80px; left: -60px;
        }

        /* Grain texture overlay */
        .loc-grain {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px;
          pointer-events: none;
        }

        /* Thin horizontal rule ornament */
        .loc-rule {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .loc-rule-line {
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.55));
        }
        .loc-rule-line.right {
          background: linear-gradient(to left, transparent, rgba(255,255,255,0.55));
        }
        .loc-rule-diamond {
          width: 6px; height: 6px;
          background: #ffffff;
          transform: rotate(45deg);
        }

        /* Eyebrow */
        .loc-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #ffffff;
        }

        /* Main heading */
        .loc-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          color: #f5f0e8;
          line-height: 1.05;
          letter-spacing: -0.01em;
          margin-bottom: 0.4rem;
        }
        .loc-heading em {
          font-style: italic;
          color: #ffffff;
        }

        .loc-tagline {
          font-size: 0.9rem;
          font-weight: 300;
          color: rgba(245,240,232,0.45);
          letter-spacing: 0.05em;
          margin-bottom: 4rem;
        }

        /* Two-column layout */
        .loc-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
          width: 100%;
          max-width: 1000px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 2px;
        }

        /* Map side */
        .loc-map-wrap {
          position: relative;
          min-height: 480px;
          overflow: hidden;
          background: #1a1610;
        }
        .loc-map-wrap iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
          filter: grayscale(1) contrast(1.1) brightness(0.55) sepia(0.25);
          transition: filter 0.6s ease;
        }
        .loc-map-wrap:hover iframe {
          filter: grayscale(0.7) contrast(1.05) brightness(0.65) sepia(0.15);
        }
        .loc-map-badge {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          background: rgba(14,12,9,0.88);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 2px;
          padding: 0.75rem 1.1rem;
          color: #f5f0e8;
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.05em;
          pointer-events: none;
        }
        .loc-map-badge strong {
          display: block;
          color: #ffffff;
          font-weight: 500;
          margin-bottom: 0.15rem;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Details side */
        .loc-details {
          background: #111009;
          display: flex;
          flex-direction: column;
        }

        .loc-detail-item {
          padding: 2rem 2.2rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          transition: background 0.3s ease;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.55s ease, transform 0.55s ease, background 0.3s ease;
        }
        .loc-detail-item.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .loc-detail-item:last-child {
          border-bottom: none;
        }
        .loc-detail-item:hover {
          background: rgba(255,255,255,0.03);
        }

        .loc-detail-icon {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .loc-detail-label {
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }
        .loc-detail-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #f5f0e8;
          line-height: 1.35;
          margin-bottom: 0.2rem;
        }
        .loc-detail-sub {
          font-size: 0.8rem;
          font-weight: 300;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.02em;
        }

        /* CTA strip below */
        .loc-cta-strip {
          width: 100%;
          max-width: 1000px;
          margin-top: 3px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.6rem 2.2rem;
          gap: 2rem;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s;
        }
        .loc-cta-strip.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .loc-cta-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-style: italic;
          font-weight: 300;
          color: rgba(245,240,232,0.7);
          letter-spacing: 0.02em;
        }
        .loc-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: transparent;
          border: 1px solid rgba(196,158,90,0.5);
          color: #ffffff;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.75rem 1.8rem;
          border-radius: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          white-space: nowrap;
        }
        .loc-cta-btn:hover {
          background: #ffffff;
          color: #0e0c09;
          border-color: #ffffff;
        }
        .loc-cta-btn svg {
          transition: transform 0.3s ease;
        }
        .loc-cta-btn:hover svg {
          transform: translateX(3px);
        }

        /* Fade-in animation trigger */
        .loc-header-wrap {
          text-align: center;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .loc-header-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .loc-body {
            grid-template-columns: 1fr;
          }
          .loc-map-wrap {
            min-height: 300px;
          }
          .loc-cta-strip {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.2rem;
          }
          .loc-heading {
            font-size: 2.8rem;
          }
        }
      `}</style>

      <section id="location" className="loc-root" ref={sectionRef}>
        <div className="loc-grain" />
        <div className="loc-orb loc-orb-1" />
        <div className="loc-orb loc-orb-2" />

        {/* Header */}
        <div className={`loc-header-wrap ${inView ? 'visible' : ''}`}>
          <div className="loc-rule" style={{ justifyContent: 'center' }}>
            <div className="loc-rule-line" />
            <div className="loc-rule-diamond" />
            <div className="loc-rule-line right" />
          </div>
          <p className="loc-eyebrow" style={{ marginBottom: '1rem' }}>Find Us</p>
          <h2 className="loc-heading">
            Come <em>Experience</em><br />the Studio
          </h2>
          <p className="loc-tagline">Kisii's destination for considered nail artistry</p>
        </div>

        {/* Two-column card */}
        <div className="loc-body">
          {/* Map */}
          <div className="loc-map-wrap">
            <iframe
  title="Studio Location"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5395397581747!2d34.779545900000016!3d-0.6773214999999899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182b3dc63ebfdb69%3A0xdf29bc0f3141dc42!2sThe%20Place%20Complex!5e0!3m2!1sen!2ske!4v1772856885867!5m2!1sen!2ske"
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  allowFullScreen
/>
            <div className="loc-map-badge">
              <strong>Finer Nails</strong>
              THE PLACE PLAZA,3rd floor - NHIF BUILDING
            </div>
          </div>

          {/* Detail cards */}
          <div className="loc-details">
            {details.map((d, i) => (
              <div
                key={d.label}
                className={`loc-detail-item ${inView ? 'visible' : ''}`}
                style={{ transitionDelay: inView ? `${0.15 + i * 0.1}s` : '0s' }}
              >
                <div className="loc-detail-icon">{d.icon}</div>
                <div>
                  <p className="loc-detail-label">{d.label}</p>
                  <p className="loc-detail-value">{d.value}</p>
                  <p className="loc-detail-sub">{d.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
{/*         <div className={`loc-cta-strip ${inView ? 'visible' : ''}`}> */}
{/*           <p className="loc-cta-text"> */}
{/*             Can't make it in? We bring the studio to you. */}
{/*           </p> */}
{/*           <a href="#booking" className="loc-cta-btn"> */}
{/*             Book a Mobile Visit */}
{/*             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"> */}
{/*               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /> */}
{/*             </svg> */}
{/*           </a> */}
{/*         </div> */}
      </section>
    </>
  );
}