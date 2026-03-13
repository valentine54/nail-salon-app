// src/components/ServicesSection.jsx
import { useEffect, useRef, useState } from 'react';
import gel from "../assets/images/elegant-french-mani.jpg";
import acrylic from "../assets/images/gold-foil-nail-art.jpg";
import art from "../assets/images/blush-pink-gel-nails.jpg";
import pedicure from "../assets/images/elegant-french-mani.jpg";
import bridal from "../assets/images/gold-foil-nail-art.jpg";

const services = [
  {
    name: "Acrylic toes",
    tag: "Most Popular",
    description: "We clean the toe nails and restructure them using acrylic.Some Designs & Decors  are changed separately.For best results we recommend a pedicure prior",
    price: "KES 2,500.00",
    image: gel,
    detail: "2–3 week wear · No drying time · Natural nail safe",
  },
  {
    name: "Acrylic Extensions",
    tag: null,
    description: "Sculpted extensions for length and structure. Built with premium liquid-and-powder, then shaped to your preference - almond, coffin, stiletto, or square.",
    price: "KES 4,000.00",
    image: acrylic,
    detail: "Custom shape · Full set or infill · Nail art compatible",
  },
  {
    name: "Gel X extensions",
    tag: null,
    description: "An improved version of stickons,instead of nail glue we use special gel to adhere the false tips on the nails.Easy to soak off and leaves no residue",
    price: "KES 2,500.00",
    image: art,
    detail: "Add-on or standalone · Freehand or stencil · Custom briefs welcome",
  },
  {
    name: "Pedicure",
    tag: null,
    description: "Moroccan whitening wrap available. Lemon infused Jelly soak for KES 1000 extra.",
    price: "KES 1,200",
    image: pedicure,
    detail: "60–90 min · Callus removal · Moroccan wrap optional",
  },
  {
    name: "Acrylics",
    tag: null,
    description: " ",
    price: "KES 3,000.00",
    image: bridal,
    detail: "Trial included · Group rates · On-location available",
  },
  {
    name: "Long Acrylics Ombre",
    tag: null,
    description: " ",
    price: "KES 4,500.00",
    image: bridal,
    detail: "Trial included · Group rates · On-location available",
  },
];

function useInView(threshold = 0.12) {
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

function ServiceCard({ service, index, inView }) {
  return (
    <div
      className="svc-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${0.1 + index * 0.1}s, transform 0.6s ease ${0.1 + index * 0.1}s`,
      }}
    >
      {/* Image */}
      <div className="svc-img-wrap">
        <img src={service.image} alt={service.name} className="svc-img" />
        <div className="svc-img-overlay" />
        {service.tag && <span className="svc-tag">{service.tag}</span>}
        <div className="svc-price-badge">{service.price}</div>
      </div>

      {/* Content */}
      <div className="svc-content">
        <div className="svc-name-row">
          <h3 className="svc-name">{service.name}</h3>
          <span className="svc-arrow">→</span>
        </div>
        <p className="svc-desc">{service.description}</p>
        <p className="svc-detail">{service.detail}</p>
        <a href="#pricing" className="svc-cta">
          <span>Book This Service</span>
        </a>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [sectionRef, inView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .svc-root {
          background: #0e0c09;
          padding: 7rem 0 6rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* Ambient orb */
        .svc-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .svc-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(196,158,90,0.08) 0%, transparent 70%); top: -100px; left: -150px; }
        .svc-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(196,158,90,0.06) 0%, transparent 70%); bottom: 0; right: -100px; }

        .svc-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .svc-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .svc-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 4.5rem;
        }
        .svc-eyebrow {
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: #c49e5a; margin-bottom: 1.1rem;
        }
        .svc-rule { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.1rem; }
        .svc-rule-line { width: 44px; height: 1px; background: linear-gradient(to right, transparent, rgba(196,158,90,0.5)); }
        .svc-rule-line.r { background: linear-gradient(to left, transparent, rgba(196,158,90,0.5)); }
        .svc-rule-gem { width: 5px; height: 5px; background: #c49e5a; transform: rotate(45deg); }
        .svc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4.5vw, 4rem);
          font-weight: 300; color: #f5f0e8; line-height: 1.08;
        }
        .svc-title em { font-style: italic; color: #c49e5a; }
        .svc-subtitle {
          margin-top: 0.9rem; font-size: 0.83rem; font-weight: 300;
          color: rgba(245,240,232,0.35); letter-spacing: 0.05em; max-width: 380px;
        }

        /* Grid — first 3 in a row, last 2 centered */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(196,158,90,0.1);
          margin-bottom: 1px;
        }
        .svc-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          max-width: calc(66.66% + 1px);
          margin: 0 auto;
          gap: 1px;
          background: rgba(196,158,90,0.1);
        }

        /* Card */
        .svc-card {
          background: #111009;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: background 0.3s ease;
        }
        .svc-card:hover { background: #161210; }

        /* Image */
        .svc-img-wrap {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }
        .svc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s cubic-bezier(.25,.46,.45,.94), filter 0.5s ease;
          filter: brightness(0.75) saturate(0.85);
        }
        .svc-card:hover .svc-img {
          transform: scale(1.07);
          filter: brightness(0.65) saturate(0.7);
        }
        .svc-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,8,6,0.7) 0%, transparent 55%);
        }
        .svc-tag {
          position: absolute; top: 1rem; left: 1rem;
          font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: #0e0c09;
          background: #c49e5a; padding: 0.3rem 0.75rem;
        }
        .svc-price-badge {
          position: absolute; bottom: 1rem; right: 1rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 300; font-style: italic;
          color: rgba(245,240,232,0.9);
        }

        /* Content */
        .svc-content {
          padding: 1.6rem 1.8rem 2rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          border-top: 1px solid rgba(196,158,90,0.08);
        }
        .svc-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.7rem;
        }
        .svc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 400;
          color: #f5f0e8; letter-spacing: 0.01em;
        }
        .svc-arrow {
          font-size: 0.85rem; color: rgba(196,158,90,0.3);
          transition: color 0.25s ease, transform 0.3s ease;
        }
        .svc-card:hover .svc-arrow {
          color: #c49e5a;
          transform: translateX(4px);
        }
        .svc-desc {
          font-size: 0.83rem; font-weight: 300;
          color: rgba(245,240,232,0.45); line-height: 1.75;
          margin-bottom: 0.9rem; flex: 1;
        }
        .svc-detail {
          font-size: 0.63rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(196,158,90,0.5);
          padding-top: 0.85rem;
          border-top: 1px solid rgba(196,158,90,0.1);
          margin-bottom: 1.2rem;
          line-height: 1.8;
        }
        .svc-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid rgba(196,158,90,0.25);
          color: rgba(196,158,90,0.7);
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 0.6rem 1.2rem;
          text-decoration: none;
          align-self: flex-start;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .svc-cta::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(196,158,90,0.08);
          transform: translateX(-101%);
          transition: transform 0.3s ease;
        }
        .svc-cta span { position: relative; z-index: 1; }
        .svc-cta:hover { border-color: rgba(196,158,90,0.6); }
        .svc-cta:hover::before { transform: translateX(0); }

        @media (max-width: 900px) {
          .svc-grid { grid-template-columns: 1fr 1fr; }
          .svc-grid-2 { grid-template-columns: 1fr; max-width: 100%; }
        }
        @media (max-width: 600px) {
          .svc-grid { grid-template-columns: 1fr; }
          .svc-grid-2 { grid-template-columns: 1fr; max-width: 100%; }
        }
        @keyframes noticeAppear {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

/* Optional: make sure the animation only runs once on load */
.notice-box {
  animation-fill-mode: forwards;
}
      `}</style>

      <section id="services" className="svc-root" ref={sectionRef}>
        <div className="svc-grain" />
        <div className="svc-orb svc-orb-1" />
        <div className="svc-orb svc-orb-2" />

        <div className="svc-inner">
          <div className="svc-header">
  <span className="svc-eyebrow">What We Offer</span>

  <div className="svc-rule">
    <span className="svc-rule-line" />
    <span className="svc-rule-gem" />
    <span className="svc-rule-line r" />
  </div>

  <h2 className="svc-title">
    Our <em>Services</em>
  </h2>

  <p className="svc-subtitle">
    Each treatment is performed with precision and care, using only premium, cruelty-free products.
  </p>

  {/* Enhanced, noticeable notice with motion */}
  <div
    className="notice-box"
    style={{
      marginTop: '1.2rem',
      padding: '0.9rem 1.3rem',
      background: 'rgba(196,158,90,0.07)',
      border: '1px solid rgba(196,158,90,0.25)',
      borderRadius: '10px',
      maxWidth: '420px',
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center',
      fontSize: '0.82rem',
      fontStyle: 'italic',
      color: '#f5e8d2',
      lineHeight: 1.5,
      opacity: 0,
      transform: 'scale(0.95)',
      animation: 'noticeAppear 1.2s ease-out forwards 0.4s',
      transition: 'all 0.35s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.02)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,158,90,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <span style={{
      display: 'inline-block',
      marginRight: '0.5rem',
      fontSize: '1.1rem',
      animation: 'pulse 2.2s infinite ease-in-out'
    }}>
      ✦
    </span>
    <strong style={{ color: '#c49e5a', fontWeight: 500 }}>
      Note:
    </strong>{' '}
    Extra décor is charged separately.
  </div>
</div>


          {/* First 3 */}
          <div className="svc-grid">
            {services.slice(0, 3).map((s, i) => (
              <ServiceCard key={s.name} service={s} index={i} inView={inView} />
            ))}
          </div>

          {/* Last 2, centered */}
          <div className="svc-grid-2">
            {services.slice(3).map((s, i) => (
              <ServiceCard key={s.name} service={s} index={i + 3} inView={inView} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}