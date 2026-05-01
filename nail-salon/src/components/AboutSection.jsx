// src/components/AboutSection.jsx
import { useEffect, useRef, useState } from 'react';

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

const pillars = [
  {
    num: '01',
    title: 'Premium Products',
    body: 'Every treatment uses cruelty-free, non-toxic formulas sourced from leading nail care brands. Your health is never a compromise.',
  },
  {
    num: '02',
    title: 'Trained Artistry',
    body: 'Our technicians hold international certifications and undergo continuous training, because mastery is a practice, not a destination.',
  },
  {
    num: '03',
    title: 'Ritual, Not Routine',
    body: 'We design every visit to feel like an unhurried escape. From the first greeting to the finishing coat, every detail is intentional.',
  },
];

export default function AboutSection() {
  const [sectionRef, inView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .abt-root {
          background: #0a0806;
          padding: 8rem 0 7rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* Orbs */
        .abt-orb {
          position: absolute; border-radius: 50%;
          filter: blur(110px); pointer-events: none;
        }
        .abt-orb-1 { width: 550px; height: 550px; background: radial-gradient(circle, rgba(196,158,90,0.09) 0%, transparent 70%); top: -100px; right: -120px; }
        .abt-orb-2 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(196,158,90,0.06) 0%, transparent 70%); bottom: -60px; left: -60px; }

        /* Grain */
        .abt-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .abt-inner {
          max-width: 1240px; margin: 0 auto; padding: 0 2rem;
          position: relative; z-index: 1;
        }

        /* Two-column layout */
        .abt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: start;
        }

        /* ── LEFT COLUMN ── */
        .abt-left {
          opacity: 0; transform: translateX(-24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .abt-left.visible { opacity: 1; transform: translateX(0); }

        .abt-eyebrow {
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: #c49e5a;
          display: block; margin-bottom: 1.1rem;
        }
        .abt-rule {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.2rem;
        }
        .abt-rule-line { width: 44px; height: 1px; background: linear-gradient(to right, transparent, rgba(196,158,90,0.5)); }
        .abt-rule-gem { width: 5px; height: 5px; background: #c49e5a; transform: rotate(45deg); }

        .abt-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 4.5vw, 4.2rem);
          font-weight: 300; color: #f5f0e8;
          line-height: 1.05; letter-spacing: -0.01em;
          margin-bottom: 2rem;
        }
        .abt-title em { font-style: italic; color: #c49e5a; display: block; }

        .abt-body {
          font-size: 0.9rem; font-weight: 300;
          color: rgba(245,240,232,0.5);
          line-height: 1.9; margin-bottom: 1.1rem;
          letter-spacing: 0.02em;
        }
        .abt-body strong {
          font-weight: 500; color: rgba(245,240,232,0.75);
        }

        /* Stats row */
        .abt-stats {
          display: flex; gap: 0; margin-top: 2.8rem;
          border: 1px solid rgba(196,158,90,0.12);
        }
        .abt-stat {
          flex: 1; padding: 1.4rem 1.2rem; text-align: center;
          border-right: 1px solid rgba(196,158,90,0.12);
        }
        .abt-stat:last-child { border-right: none; }
        .abt-stat-num {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300;
          color: #c49e5a; line-height: 1;
        }
        .abt-stat-lbl {
          display: block; margin-top: 0.35rem;
          font-size: 0.58rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(245,240,232,0.3);
        }

        /* Signature */
        .abt-sig {
          margin-top: 2.2rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .abt-sig-avatar {
          width: 44px; height: 44px;
          border: 1px solid rgba(196,158,90,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 400; font-style: italic;
          color: #c49e5a; flex-shrink: 0;
        }
        .abt-sig-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 400; font-style: italic;
          color: rgba(245,240,232,0.65);
        }
        .abt-sig-role {
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(196,158,90,0.45);
          display: block; margin-top: 0.2rem;
        }

        /* ── RIGHT COLUMN ── */
        .abt-right {
          display: flex; flex-direction: column; gap: 1px;
          background: rgba(196,158,90,0.1);
        }

        .abt-pillar {
          background: #111009;
          padding: 2rem 2rem 2rem 2rem;
          display: flex; gap: 1.5rem;
          align-items: flex-start;
          opacity: 0; transform: translateX(20px);
          transition: opacity 0.6s ease, transform 0.6s ease, background 0.25s ease;
        }
        .abt-pillar.visible { opacity: 1; transform: translateX(0); }
        .abt-pillar:hover { background: #161410; }

        .abt-pillar-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem; font-weight: 300;
          color: rgba(196,158,90,0.35);
          flex-shrink: 0; padding-top: 0.2rem;
          letter-spacing: 0.08em;
        }
        .abt-pillar-content {}
        .abt-pillar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 400;
          color: #f5f0e8; margin-bottom: 0.55rem;
          letter-spacing: 0.01em;
        }
        .abt-pillar-body {
          font-size: 0.82rem; font-weight: 300;
          color: rgba(245,240,232,0.42);
          line-height: 1.8; letter-spacing: 0.02em;
        }

        /* Decorative quote block */
        .abt-quote {
          background: transparent;
          border: 1px solid rgba(196,158,90,0.14);
          padding: 2rem;
          margin-top: 1px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s;
        }
        .abt-quote.visible { opacity: 1; transform: translateY(0); }
        .abt-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem; font-weight: 300;
          color: rgba(196,158,90,0.2); line-height: 0.5;
          display: block; margin-bottom: 1rem;
        }
        .abt-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; font-weight: 300; font-style: italic;
          color: rgba(245,240,232,0.55); line-height: 1.65;
          letter-spacing: 0.01em;
        }
        .abt-quote-attr {
          display: block; margin-top: 1rem;
          font-size: 0.6rem; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(196,158,90,0.4);
        }

        @media (max-width: 900px) {
          .abt-grid { grid-template-columns: 1fr; gap: 4rem; }
        }
        @media (max-width: 600px) {
          .abt-root { padding: 6rem 0 5rem; }
          .abt-stats { flex-direction: column; }
          .abt-stat { border-right: none; border-bottom: 1px solid rgba(196,158,90,0.12); }
          .abt-stat:last-child { border-bottom: none; }
        }
      `}</style>

      <section id="about" className="abt-root" ref={sectionRef}>
        <div className="abt-grain" />
        <div className="abt-orb abt-orb-1" />
        <div className="abt-orb abt-orb-2" />

        <div className="abt-inner">
          <div className="abt-grid">

            {/* LEFT */}
            <div className={`abt-left ${inView ? 'visible' : ''}`}>
              <span className="abt-eyebrow">Our Story</span>
              <div className="abt-rule">
                <span className="abt-rule-line" />
                <span className="abt-rule-gem" />
              </div>

              <h2 className="abt-title">
                Built on Care,
                <em>Defined by Detail</em>
              </h2>

              <p className="abt-body">
                Finer Nails Spa was founded with a single conviction: that a nail appointment should feel like a genuine ritual, not an errand. We built our studio in Kisii to be a place where <strong>craft and calm coexist</strong> - where every client leaves feeling more considered than when they arrived.
              </p>
              <p className="abt-body">
                Since opening, we've served over 500 clients across manicures, pedicures, nail art, and bridal packages. Our team is small by design - <strong>chosen for their precision, trained for excellence</strong>, and passionate about the work they produce.
              </p>
              <p className="abt-body">
                We source only premium, cruelty-free products, sterilise all tools to clinical standards, and take the time to understand what you want before we ever pick up a brush.
              </p>

              <div className="abt-stats">
                {[
//                     ['8+', 'Years'], ['500+', 'Clients'], ['50+', 'Designs'],
                    ['100%', 'Cruelty-Free']].map(([n, l]) => (
                  <div key={l} className="abt-stat">
                    <span className="abt-stat-num">{n}</span>
                    <span className="abt-stat-lbl">{l}</span>
                  </div>
                ))}
              </div>

              <div className="abt-sig">
                <div className="abt-sig-avatar">J</div>
                <div>
                  <span className="abt-sig-name">Jane Doe</span>
                  <span className="abt-sig-role">Founder & Lead Technician</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="abt-right">
                {pillars.map((p, i) => (
                  <div
                    key={p.num}
                    className={`abt-pillar ${inView ? 'visible' : ''}`}
                    style={{ transitionDelay: inView ? `${0.15 + i * 0.12}s` : '0s' }}
                  >
                    <span className="abt-pillar-num">{p.num}</span>
                    <div className="abt-pillar-content">
                      <p className="abt-pillar-title">{p.title}</p>
                      <p className="abt-pillar-body">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`abt-quote ${inView ? 'visible' : ''}`}>
                <span className="abt-quote-mark">"</span>
                <p className="abt-quote-text">
{/*                   We don't just do nails. */}
                   We create a moment of stillness in a busy day and send you out feeling like yourself, only more so.
                </p>
                <span className="abt-quote-attr">- Jane Doe, TECH LEAD</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}