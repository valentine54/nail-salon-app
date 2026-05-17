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
    value: 'THE PLACE PLAZA, 3rd floor - NHIF BUILDING',
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
          background: #000000; /* Pure Black Background */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 7rem 2rem 6rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* Pure Gold Horizontal Rule Line Before Find Us */
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
          background: linear-gradient(to right, transparent, #c4975a); /* Gold Gradient Line */
        }
        .loc-rule-line.right {
          background: linear-gradient(to left, transparent, #c4975a); /* Gold Gradient Line */
        }
        .loc-rule-diamond {
          width: 6px; height: 6px;
          background: #c4975a; /* Gold Diamond Element */
          transform: rotate(45deg);
        }

        /* Eyebrow - Pure White text */
        .loc-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #ffffff;
        }

        /* Main headings - Pure White text */
        .loc-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          color: #ffffff;
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
          color: #ffffff; /* Pure White text */
          letter-spacing: 0.05em;
          margin-bottom: 4rem;
        }

        /* Structural container layout wrapper */
        .loc-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          width: 100%;
          max-width: 1000px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.15);
        }

        /* Map side container */
        .loc-map-wrap {
          position: relative;
          min-height: 480px;
          overflow: hidden;
          background: #000000;
        }

        /* Map Integration Overlay Layer Completely Removed - Map displays crisp and clean */
        .loc-map-wrap iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
          filter: none !important; /* Forces removal of all grayscale/sepia/brightness filters */
        }

        .loc-map-badge {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1px;
          padding: 0.75rem 1.1rem;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.05em;
          pointer-events: none;
        }
        .loc-map-badge strong {
          display: block;
          color: #c4975a; /* Gold Accent internally targeting map badge header */
          font-weight: 500;
          margin-bottom: 0.15rem;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Details side context panel */
        .loc-details {
          background: #000000; /* Pure Black panel */
          display: flex;
          flex-direction: column;
        }

        .loc-detail-item {
          padding: 2.2rem 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
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
          background: rgba(196, 151, 90, 0.04); /* Soft luxury gold whisper hover trace */
        }

        /* Gold Icons box element */
        .loc-detail-icon {
          width: 40px;
          height: 40px;
          border: 1px solid #c4975a; /* Gold Border Box */
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c4975a; /* Pure Gold Vectors */
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* Section Category Label Blocks: Address, Hours, Parking Titles transformed to Gold */
        .loc-detail-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c4975a; /* Pure Gold Title Text */
          margin-bottom: 0.45rem;
          display: inline-block;
          padding-bottom: 0.15rem;
        }

        /* Descriptions & Values configured to Pure White */
        .loc-detail-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: #ffffff; /* Pure White text */
          line-height: 1.35;
          margin-bottom: 0.2rem;
        }
        .loc-detail-sub {
          font-size: 0.82rem;
          font-weight: 300;
          color: #ffffff; /* Pure White text */
          letter-spacing: 0.02em;
        }

        /* Header Wrap Fade Trigger */
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
            min-height: 350px;
          }
          .loc-heading {
            font-size: 2.8rem;
          }
          .loc-detail-item {
            padding: 2rem 1.8rem;
          }
        }
      `}</style>

      <section id="location" className="loc-root" ref={sectionRef}>
        {/* Gradients, Blur Orbs, and Noise Textures completely stripped out for absolute Pure Black background profile clarity */}

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

        {/* Two-column card block layout layout layout */}
        <div className="loc-body">
          {/* Map Side Section */}
          <div className="loc-map-wrap">
            <iframe
              title="Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.157833446059!2d34.767946974246835!3d-0.6798031353272494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182b2bef1450a1a3%3A0x64e62ff1ee6e1a47!2sThe%20Place%20Plaza!5e0!3m2!1sen!2ske!4v1710000000000!5m2!1sen!2ske"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="loc-map-badge">
              <strong>Finer Nails Spa</strong>
              THE PLACE PLAZA, 3rd FLOOR
            </div>
          </div>

          {/* Details Side Section */}
          <div className="loc-details">
            {details.map((d, i) => (
              <div
                key={d.label}
                className={`loc-detail-item ${inView ? 'visible' : ''}`}
                style={{ transitionDelay: inView ? `${0.15 + i * 0.1}s` : '0s' }}
              >
                {/* Vectors are pure gold */}
                <div className="loc-detail-icon">{d.icon}</div>
                <div>
                  {/* Category labels (Address, Hours, Parking) are pure gold */}
                  <p className="loc-detail-label">{d.label}</p>
                  {/* Descriptions are pure white */}
                  <p className="loc-detail-value">{d.value}</p>
                  <p className="loc-detail-sub">{d.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}