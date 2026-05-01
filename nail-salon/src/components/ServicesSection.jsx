// src/components/ServicesSection.jsx
import { useEffect, useRef, useState } from 'react';
import gel from "../assets/images/pedi-1.jpg";
import acrylic from "../assets/images/gold-foil-nail-art.jpg";
import art from "../assets/images/blush-pink-gel-nails.jpg";
import pedicure from "../assets/images/pedi-5.jpg";
import bridal from "../assets/images/gold-foil-nail-art.jpg";

const services = [
  // ── PEDICURE ──────────────────────────────────────────────
  {
    name: "Gel Polish",
    tag: null,
    category: "pedicure",
    description: "Long-lasting gel colour applied to your natural toenails for a glossy, chip-free finish that lasts 2–3 weeks.",
    price: "KES 800",
    image: pedicure,
    detail: "Gel colour · 2–3 week wear · Quick finish",
  },
  {
    name: "Pedicure Plain",
    tag: null,
    category: "pedicure",
    description: "A classic pedicure with soak, cuticle care, nail shaping, callus removal and a moisturising massage. Clean and refreshed.",
    price: "KES 1,300",
    image: pedicure,
    detail: "Soak · Shape · Callus removal · Massage",
  },
  {
    name: "Pedicure Gel",
    tag: null,
    category: "pedicure",
    description: "Our classic pedicure treatment finished with a long-lasting gel polish colour of your choice.",
    price: "KES 1,800",
    image: pedicure,
    detail: "Full pedicure · Gel finish · 2–3 week wear",
  },
  {
    name: "Spa Pedicure & Gel",
    tag: null,
    category: "pedicure",
    description: "An elevated spa pedicure with extended massage, exfoliation, hot towel treatment and a gel polish finish.",
    price: "KES 2,500",
    image: pedicure,
    detail: "Spa treatment · Extended massage · Gel finish",
  },
  {
    name: "Lemon Infused Jelly Pedi & Gel",
    tag: "Luxe",
    category: "pedicure",
    description: "A refreshing lemon-infused jelly soak pedicure that softens and brightens skin, finished with a gel polish for a radiant look.",
    price: "KES 3,000",
    image: pedicure,
    detail: "Jelly soak · Brightening · Gel finish",
  },
  {
    name: "Acrylic Overlays (Toes)",
    tag: "Most Popular",
    category: "pedicure",
    description: "We clean the toenails and restructure them using acrylic overlays. Some designs & décor are charged separately. A pedicure prior is recommended.",
    price: "KES 2,500",
    image: gel,
    detail: "Acrylic overlay · 2–3 week wear · Natural nail safe",
  },
  {
    name: "Acrylic Extensions (Toes)",
    tag: null,
    category: "pedicure",
    description: "Sculpted acrylic extensions on the toes for added length and a perfectly shaped finish. Great for special occasions.",
    price: "KES 3,000",
    image: gel,
    detail: "Sculpted extensions · Custom shape · Durable",
  },
  {
    name: "Gel X Toe Extensions",
    tag: null,
    category: "pedicure",
    description: "An improved version of stick-ons — instead of nail glue we use special gel to adhere false tips to the toes. Easy to soak off and leaves no residue.",
    price: "KES 2,500",
    image: art,
    detail: "Gel adhesion · Soak-off safe · No residue",
  },

  // ── MANICURE ──────────────────────────────────────────────
  {
    name: "Reinforced Gel Polish",
    tag: null,
    category: "manicure",
    description: "A strengthening gel polish application that adds a protective layer over your natural nails while delivering a long-lasting colour finish.",
    price: "KES 1,500",
    image: art,
    detail: "Strengthening · Gel colour · 2–3 week wear",
  },
  {
    name: "Classic Manicure",
    tag: null,
    category: "manicure",
    description: "A timeless manicure with soak, cuticle care, nail shaping and a regular polish finish. Clean, neat and polished.",
    price: "KES 700",
    image: art,
    detail: "Soak · Shape · Cuticle care · Regular polish",
  },
  {
    name: "Spa Manicure",
    tag: null,
    category: "manicure",
    description: "An elevated manicure experience with exfoliation, extended hand massage, hot towel wrap and a polish finish of your choice.",
    price: "KES 1,500",
    image: art,
    detail: "Exfoliation · Hot towel · Extended massage",
  },
  {
    name: "Overlays",
    tag: null,
    category: "manicure",
    description: "Strengthen and protect your natural nails with BIAB, Gum gel, or Acrylic overlays. No extensions — just reinforced, beautiful nails.",
    price: "KES 2,300",
    image: acrylic,
    detail: "BIAB · Gum gel · Acrylic · Natural nail",
  },
  {
    name: "Gel X Extensions",
    tag: null,
    category: "manicure",
    description: "An improved version of stick-ons — instead of nail glue we use special gel to adhere the false tips. Easy to soak off and leaves no residue.",
    price: "KES 2,500",
    image: art,
    detail: "Soak-off safe · No residue · Freehand or stencil",
  },
  {
    name: "Tips with Gumgel / Builder",
    tag: null,
    category: "manicure",
    description: "Soft gel tips adhered and built up with gumgel or builder gel for a lightweight, flexible extension with a flawless finish.",
    price: "KES 2,800",
    image: acrylic,
    detail: "Lightweight · Flexible · Natural finish",
  },
  {
    name: "Short Acrylic Extensions",
    tag: null,
    category: "manicure",
    description: "Sculpted short acrylic extensions — perfect for those who want the look and durability of acrylics with a practical, everyday length.",
    price: "KES 3,000",
    image: acrylic,
    detail: "Short length · Custom shape · Durable",
  },
  {
    name: "Medium / Long Acrylics",
    tag: null,
    category: "manicure",
    description: "Sculpted acrylic extensions at medium or long length. Shaped to your preference — almond, coffin, stiletto, or square.",
    price: "KES 4,000",
    image: acrylic,
    detail: "Medium or long · Custom shape · All occasions",
  },
  {
    name: "Xtra Long Acrylics",
    tag: null,
    category: "manicure",
    description: "Extra-long sculpted acrylics — a bold, dramatic statement set built for maximum length and impact. Ombré available.",
    price: "KES 4,500",
    image: bridal,
    detail: "Xtra long · Ombré optional · Statement set",
  },

  // ── SPA ───────────────────────────────────────────────────
  {
    name: "Hard Reset Facial",
    tag: "Signature",
    category: "spa",
    description: "Deep cleanse, vacuum extraction, 2-step exfoliation, soothing hydrating mask & LED light therapy. For a refreshed, clearer complexion.",
    price: "KES 5,000.00",
    image: bridal,
    detail: "LED therapy · Vacuum extraction · 75–90 min",
  },
  {
    name: "Balance & Glow",
    tag: null,
    category: "spa",
    description: "Deep cleanse, 2-step exfoliation, S&H mask and LED light therapy. Perfect for an even, radiant complexion.",
    price: "KES 4,500.00",
    image: bridal,
    detail: "LED therapy · S&H mask · Glow finish",
  },
  {
    name: "Acne Combat",
    tag: null,
    category: "spa",
    description: "Deep cleanse & microneedling. Targets acne, blackheads, large pores, unevenness & pigmentation for visibly clearer skin.",
    price: "KES 10,000.00",
    image: bridal,
    detail: "Microneedling · Targets acne & pigmentation",
  },
  {
    name: "Instant Glow (Gents)",
    tag: null,
    category: "spa",
    description: "Deep cleanse, derma abrasion & soothing hydrating mask. Clears dead skin & oil build-up revealing a smoother, clean face.",
    price: "KES 4,000.00",
    image: bridal,
    detail: "Derma abrasion · Oil control · Men's treatment",
  },
  {
    name: "The Scalp",
    tag: null,
    category: "spa",
    description: "Deep cleanse, dermaplaning / derma abrasion & S&H mask. Removes impurities and revitalizes the scalp.",
    price: "KES 4,500.00",
    image: bridal,
    detail: "Dermaplaning · Scalp detox · Revitalizing",
  },
  {
    name: "Body Scrub",
    tag: null,
    category: "spa",
    description: "Full body exfoliation to unclog pores, improve skin texture and reveal a radiant, smooth glow from head to toe.",
    price: "KES 6,000.00",
    image: bridal,
    detail: "Full body · Pore refinement · Radiant finish",
  },
];

const TABS = [
  { key: "manicure", label: "Manicure" },
  { key: "pedicure", label: "Pedicure" },
  { key: "spa",      label: "Spa" },
];

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function ServiceCard({ service, index }) {
  return (
    <div
      className="svc-card"
      style={{
        animationDelay: `${0.05 + index * 0.07}s`,
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
        <a href="#booking" className="svc-cta">
          <span>Book This Service</span>
        </a>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [sectionRef, inView] = useInView();
  const [activeTab, setActiveTab] = useState("manicure");
  const [animating, setAnimating] = useState(false);

  const filtered = services.filter((s) => s.category === activeTab);

  function handleTab(key) {
    if (key === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(key);
      setAnimating(false);
    }, 220);
  }

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

        /* ── Header ── */
        .svc-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 3.5rem;
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

        /* ── Notice ── */
        @keyframes noticeAppear {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        .notice-box { animation-fill-mode: forwards; }

        /* ── Tabs ── */
        .svc-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }
        .svc-tab {
          position: relative;
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.65rem 1.8rem;
          border: 1px solid rgba(196,158,90,0.2);
          background: transparent;
          color: rgba(245,240,232,0.35);
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
          overflow: hidden;
        }
        .svc-tab::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(196,158,90,0.06);
          transform: translateX(-101%);
          transition: transform 0.3s ease;
        }
        .svc-tab:hover { color: rgba(245,240,232,0.6); border-color: rgba(196,158,90,0.35); }
        .svc-tab:hover::before { transform: translateX(0); }

        .svc-tab.active {
          background: #c49e5a;
          border-color: #c49e5a;
          color: #0e0c09;
        }
        .svc-tab.active::before { display: none; }

        .svc-tab-divider {
          width: 1px;
          height: 14px;
          background: rgba(196,158,90,0.2);
        }

        /* ── Grid ── */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0; /* Changed from 1px to 0 */
          background: transparent; /* Removed the background color here */
          transition: opacity 0.22s ease;
          /* Optional: Add a top and left border to the grid if you want a full frame */
          border-top: 1px solid rgba(196,158,90,0.1);
          border-left: 1px solid rgba(196,158,90,0.1);
        }
        .svc-grid.fading { opacity: 0; }

        /* ── Card ── */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .svc-card {
          background: #111009;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: background 0.3s ease;
          opacity: 0;
          animation: cardIn 0.5s ease forwards;
          /* Add borders here to create the grid lines only where cards exist */
          border-right: 1px solid rgba(196,158,90,0.1);
          border-bottom: 1px solid rgba(196,158,90,0.1);
        }
        .svc-card:hover { background: #161210; }

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
          flex-shrink: 0;
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

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .svc-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .svc-grid { grid-template-columns: 1fr; }
          .svc-tabs { gap: 0.3rem; }
          .svc-tab { padding: 0.55rem 1.1rem; font-size: 0.6rem; }
          .svc-tab-divider { display: none; }
        }
      `}</style>

      <section id="services" className="svc-root" ref={sectionRef}>
        <div className="svc-grain" />
        <div className="svc-orb svc-orb-1" />
        <div className="svc-orb svc-orb-2" />

        <div className="svc-inner">

          {/* ── Header ── */}
          <div className="svc-header">
            <span className="svc-eyebrow">What We Offer</span>
            <div className="svc-rule">
              <span className="svc-rule-line" />
              <span className="svc-rule-gem" />
              <span className="svc-rule-line r" />
            </div>
            <h2 className="svc-title">Our <em>Services</em></h2>
            <p className="svc-subtitle">
              Each treatment is performed with precision and care, using only premium, cruelty-free products.
            </p>

            {/* Notice */}
            <div
  className="notice-box"
  style={{
    marginTop: '1.2rem',
    padding: '1rem 1.3rem',
    background: 'rgba(196,158,90,0.06)',
    border: '1px solid rgba(196,158,90,0.2)',
    borderRadius: '10px',
    maxWidth: '480px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    fontSize: '0.82rem',
    color: '#f5e8d2',
    lineHeight: 1.5,
    opacity: 0,
    transform: 'scale(0.95)',
    animation: 'noticeAppear 1.2s ease-out forwards 0.4s',
    transition: 'all 0.35s ease',
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
  <span style={{ display: 'inline-block', marginBottom: '0.5rem', fontSize: '1.1rem', animation: 'pulse 2.2s infinite ease-in-out' }}>
    ✦
  </span>
  <div style={{ fontStyle: 'italic', marginBottom: '0.6rem', lineHeight: 1.6 }}>
    <strong style={{ color: '#c49e5a', fontWeight: 500 }}>Extra charges</strong> for{' '}
    <span style={{ color: '#f5f0e8' }}>Chrome, Pearl, Ombre, Stones &amp; Charms</span>
  </div>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
    fontSize: '0.7rem',
    color: 'rgba(245,240,232,0.5)',
    fontStyle: 'italic'
  }}>
    <span style={{ fontSize: '0.6rem' }}>(PER FINGER)</span>
    <span style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '1.4rem',
      fontWeight: 300,
      color: '#c49e5a',
      marginLeft: '0.3rem'
    }}>
      50/=
    </span>
  </div>
</div>
            </div>
          {/* ── Category Tabs ── */}   {/* ← Missing closing div before this */}
          {/* ── Category Tabs ── */}
          <div className="svc-tabs">
            {TABS.map((tab, i) => (
              <>
                <button
                  key={tab.key}
                  className={`svc-tab${activeTab === tab.key ? ' active' : ''}`}
                  onClick={() => handleTab(tab.key)}
                >
                  {tab.label}
                </button>
                {i < TABS.length - 1 && <span key={`div-${i}`} className="svc-tab-divider" />}
              </>
            ))}
          </div>

          {/* ── Services Grid ── */}
          <div className={`svc-grid${animating ? ' fading' : ''}`}>
            {filtered.map((s, i) => (
              <ServiceCard
                key={`${activeTab}-${s.name}`}
                service={s}
                index={i}
                inView={inView}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}