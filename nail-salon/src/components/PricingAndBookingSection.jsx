// src/components/PricingAndBookingSection.jsx
import { useState } from 'react';

const MANI_OPTIONS = [
  { id: 'acrylic-ext', label: 'Acrylic Extensions', desc: 'Sculpted length & strength' },
  { id: 'gel', label: 'Gel Polish', desc: 'High-gloss, chip-free finish' },
  { id: 'gel-x', label: 'Gel-X Extensions', desc: 'Soft gel over full-cover tips' },
  { id: 'long-acrylic', label: 'Long Acrylic', desc: 'Drama-length sculpted set' },
  { id: 'ombre', label: 'Ombré & Acrylics', desc: 'Blended gradient artistry' },
];

const PEDI_TOES = [
  { id: 'acrylic-toes', label: 'Acrylic Toes', desc: 'Sculpted toe extensions' },
  { id: 'gel-toes', label: 'Gel Toes', desc: 'Polished gel on natural toes' },
];

const PEDI_WRAPS = [
  { id: 'moroccan', label: 'Moroccan Whitening Wrap', desc: 'Brightening botanical treatment' },
  { id: 'moroccan-lemon', label: 'Moroccan + Lemon Jelly Soak', desc: 'Whitening wrap & citrus infusion' },
];

const STEP_LABELS = ['Service', 'Options', 'Schedule', 'Inspiration', 'Technician', 'Review'];

const TECHNICIANS = [
  { id: 'any', name: 'No Preference', role: 'Any available technician', initials: '✦' },
  { id: 'amara', name: 'Amara W.', role: 'Lead Technician · Nail Art Specialist', initials: 'AW' },
  { id: 'brenda', name: 'Brenda K.', role: 'Acrylic & Extensions Expert', initials: 'BK' },
  { id: 'cynthia', name: 'Cynthia O.', role: 'Gel & Pedicure Specialist', initials: 'CO' },
];

function RadioCard({ label, desc, checked, onChange }) {
  return (
    <label className={`rcard ${checked ? 'rcard--active' : ''}`} style={{ cursor: 'pointer' }}>
      <input type="radio" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span className="rcard-dot" />
      <span className="rcard-body">
        <span className="rcard-label">{label}</span>
        {desc && <span className="rcard-desc">{desc}</span>}
      </span>
    </label>
  );
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="srow">
      <div>
        <p className="srow-label">{label}</p>
        <p className="srow-value">{value}</p>
      </div>
      <button className="srow-edit" onClick={onEdit}>Edit</button>
    </div>
  );
}

export default function PricingAndBookingSection() {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [maniOption, setManiOption] = useState('');
  const [pediToes, setPediToes] = useState('');
  const [pediWrap, setPediWrap] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [maniInspo, setManiInspo] = useState(null);
  const [pediInspo, setPediInspo] = useState(null);
  const [technician, setTechnician] = useState('');

  const reset = () => {
    setStep(1); setServiceType(''); setManiOption('');
    setPediToes(''); setPediWrap(''); setSelectedDate('');
    setSelectedTime(''); setManiInspo(null); setPediInspo(null); setTechnician('');
  };

  const handleServiceType = (type) => {
    setServiceType(type); setManiOption(''); setPediToes('');
    setPediWrap(''); setSelectedDate(''); setSelectedTime('');
    setManiInspo(null); setPediInspo(null); setStep(2);
  };

  const canContinue = () => {
    if (serviceType === 'manicure') return !!maniOption;
    if (serviceType === 'pedicure') return !!pediToes || !!pediWrap;
    if (serviceType === 'both') return !!maniOption && (!!pediToes || !!pediWrap);
    return false;
  };

  const advance = () => step < 7 && setStep(s => s + 1);

  const goToStep = (s) => { if (s < step) setStep(s); };

  const serviceLabel = serviceType === 'both' ? 'Mani + Pedi'
    : serviceType ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1) : '—';

  const pediSummary = [pediToes, pediWrap]
    .filter(Boolean)
    .map(id => [...PEDI_TOES, ...PEDI_WRAPS].find(o => o.id === id)?.label)
    .join(', ');

  const maniLabel = MANI_OPTIONS.find(o => o.id === maniOption)?.label || '';

  const today = new Date().toISOString().split('T')[0];

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .bk-root {
          min-height: 100vh;
          background: #0e0c09;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 8rem 1.5rem 6rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }
        .bk-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .bk-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(196,158,90,0.11) 0%, transparent 70%); top: -80px; right: -100px; }
        .bk-orb-2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(196,158,90,0.07) 0%, transparent 70%); bottom: 0; left: -80px; }
        .bk-grain {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .bk-header { text-align: center; margin-bottom: 3.5rem; position: relative; z-index: 1; }
        .bk-eyebrow { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: #c49e5a; display: block; margin-bottom: 1.2rem; }
        .bk-rule { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1.2rem; }
        .bk-rule-line { width: 48px; height: 1px; background: linear-gradient(to right, transparent, rgba(196,158,90,0.5)); }
        .bk-rule-line.r { background: linear-gradient(to left, transparent, rgba(196,158,90,0.5)); }
        .bk-rule-gem { width: 5px; height: 5px; background: #c49e5a; transform: rotate(45deg); }
        .bk-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 300; color: #f5f0e8; line-height: 1.08; letter-spacing: -0.01em; }
        .bk-title em { font-style: italic; color: #c49e5a; }
        .bk-subtitle { margin-top: 0.9rem; font-size: 0.85rem; font-weight: 300; color: rgba(245,240,232,0.4); letter-spacing: 0.05em; }

        .bk-card { background: #111009; border: 1px solid rgba(196,158,90,0.14); width: 100%; max-width: 680px; position: relative; z-index: 1; }

        .bk-steps { display: flex; border-bottom: 1px solid rgba(196,158,90,0.1); }
        .bk-step-btn { flex: 1; padding: 1.1rem 0.5rem; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; border-right: 1px solid rgba(196,158,90,0.08); cursor: default; transition: background 0.25s ease; }
        .bk-step-btn:last-child { border-right: none; }
        .bk-step-btn.done { cursor: pointer; }
        .bk-step-btn.done:hover { background: rgba(196,158,90,0.04); }
        .bk-step-num { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 500; border: 1px solid rgba(196,158,90,0.2); color: rgba(245,240,232,0.25); transition: all 0.3s ease; }
        .bk-step-btn.active .bk-step-num { background: #c49e5a; border-color: #c49e5a; color: #0e0c09; font-weight: 600; }
        .bk-step-btn.done .bk-step-num { background: rgba(196,158,90,0.12); border-color: rgba(196,158,90,0.4); color: #c49e5a; }
        .bk-step-name { font-size: 0.58rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,232,0.25); transition: color 0.3s; }
        .bk-step-btn.active .bk-step-name { color: #c49e5a; }
        .bk-step-btn.done .bk-step-name { color: rgba(196,158,90,0.6); }

        .bk-body { padding: 2.5rem 2.5rem 2rem; }
        .bk-step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; font-style: italic; color: #f5f0e8; margin-bottom: 0.4rem; line-height: 1.15; }
        .bk-step-hint { font-size: 0.75rem; font-weight: 300; color: rgba(245,240,232,0.35); letter-spacing: 0.05em; margin-bottom: 2rem; }

        .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(196,158,90,0.1); }
        .svc-btn { background: #111009; padding: 2rem 1rem; text-align: center; border: none; cursor: pointer; transition: background 0.25s ease; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .svc-btn:hover, .svc-btn.active { background: rgba(196,158,90,0.07); }
        .svc-btn.active .svc-btn-icon, .svc-btn:hover .svc-btn-icon { color: #c49e5a; }
        .svc-btn.active .svc-btn-label { color: #f5f0e8; }
        .svc-btn.active .svc-btn-bar { background: #c49e5a; }
        .svc-btn-icon { font-size: 1.6rem; transition: color 0.2s; color: rgba(245,240,232,0.3); }
        .svc-btn-label { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 400; color: rgba(245,240,232,0.5); transition: color 0.2s; }
        .svc-btn-bar { width: 20px; height: 1px; background: transparent; transition: background 0.2s; }

        .opt-label { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #c49e5a; margin-bottom: 0.75rem; display: block; padding-bottom: 0.6rem; border-bottom: 1px solid rgba(196,158,90,0.12); }
        .opt-group { margin-bottom: 1.8rem; }

        .rcard { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.1rem; margin-bottom: 0.5rem; border: 1px solid rgba(196,158,90,0.1); background: rgba(255,255,255,0.015); transition: border-color 0.25s ease, background 0.25s ease; }
        .rcard:hover { border-color: rgba(196,158,90,0.25); background: rgba(196,158,90,0.03); }
        .rcard--active { border-color: rgba(196,158,90,0.5) !important; background: rgba(196,158,90,0.06) !important; }
        .rcard-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(196,158,90,0.35); flex-shrink: 0; position: relative; transition: border-color 0.2s; }
        .rcard--active .rcard-dot { border-color: #c49e5a; }
        .rcard--active .rcard-dot::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 7px; height: 7px; border-radius: 50%; background: #c49e5a; }
        .rcard-body { display: flex; flex-direction: column; gap: 1px; }
        .rcard-label { font-size: 0.88rem; font-weight: 400; color: rgba(245,240,232,0.8); }
        .rcard--active .rcard-label { color: #f5f0e8; }
        .rcard-desc { font-size: 0.72rem; font-weight: 300; color: rgba(245,240,232,0.3); }

        .dt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(196,158,90,0.1); margin-bottom: 1.5rem; }
        .dt-field { background: #111009; padding: 1.4rem 1.2rem; }
        .dt-field label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #c49e5a; display: block; margin-bottom: 0.6rem; }
        .dt-field input { width: 100%; background: transparent; border: none; outline: none; font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 300; color: #f5f0e8; color-scheme: dark; }
        .dt-field input::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(2) hue-rotate(5deg); cursor: pointer; }

        .upload-zone { border: 1px dashed rgba(196,158,90,0.2); padding: 2rem 1.5rem; text-align: center; margin-bottom: 1rem; cursor: pointer; transition: border-color 0.25s ease, background 0.25s ease; display: block; background: transparent; }
        .upload-zone:hover, .upload-zone.has-file { border-color: rgba(196,158,90,0.5); background: rgba(196,158,90,0.04); }
        .upload-icon { font-size: 1.4rem; color: rgba(196,158,90,0.4); margin-bottom: 0.5rem; }
        .upload-name { font-size: 0.82rem; color: rgba(245,240,232,0.55); font-weight: 300; }
        .upload-hint { font-size: 0.68rem; color: rgba(245,240,232,0.25); margin-top: 0.25rem; letter-spacing: 0.05em; }
        .upload-success { font-size: 0.7rem; color: #c49e5a; margin-top: 0.4rem; letter-spacing: 0.05em; }

        .srow { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(196,158,90,0.08); }
        .srow:last-of-type { border-bottom: none; }
        .srow-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(196,158,90,0.6); margin-bottom: 0.25rem; }
        .srow-value { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 300; color: #f5f0e8; }
        .srow-edit { font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(196,158,90,0.6); background: none; border: none; cursor: pointer; transition: color 0.2s; padding: 0.3rem 0; border-bottom: 1px solid transparent; }
        .srow-edit:hover { color: #c49e5a; border-bottom-color: rgba(196,158,90,0.4); }

        .bk-cta { width: 100%; padding: 1.1rem; background: transparent; border: 1px solid rgba(196,158,90,0.4); font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: #c49e5a; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; margin-top: 1.5rem; }
        .bk-cta::before { content: ''; position: absolute; inset: 0; background: #c49e5a; transform: translateX(-101%); transition: transform 0.35s cubic-bezier(.25,.46,.45,.94); }
        .bk-cta span { position: relative; z-index: 1; transition: color 0.3s ease; }
        .bk-cta:hover::before { transform: translateX(0); }
        .bk-cta:hover span { color: #0e0c09; }
        .bk-cta:disabled { border-color: rgba(196,158,90,0.1); color: rgba(196,158,90,0.2); cursor: not-allowed; }
        .bk-cta:disabled::before { display: none; }

        .confirm-wrap { text-align: center; padding: 1rem 0; }
        .confirm-icon { font-size: 2.5rem; margin-bottom: 1.2rem; }
        .confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; font-style: italic; color: #f5f0e8; margin-bottom: 0.5rem; }
        .confirm-sub { font-size: 0.82rem; font-weight: 300; color: rgba(245,240,232,0.4); margin-bottom: 2.5rem; letter-spacing: 0.03em; }
        .confirm-table { border: 1px solid rgba(196,158,90,0.14); margin: 0 0 2rem; text-align: left; }
        .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(196,158,90,0.08); }
        .confirm-row:last-child { border-bottom: none; }
        .confirm-key { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(196,158,90,0.5); }
        .confirm-val { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 300; color: #f5f0e8; }
        .bk-reset { background: none; border: 1px solid rgba(196,158,90,0.2); color: rgba(245,240,232,0.35); font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.75rem 1.8rem; cursor: pointer; transition: all 0.25s ease; }
        .bk-reset:hover { border-color: rgba(196,158,90,0.45); color: rgba(245,240,232,0.7); }


        /* Technician cards */
        .tech-card { transition: all 0.25s ease; }
        .tech-card:hover { background: rgba(196,158,90,0.04) !important; }

        @media (max-width: 600px) {
          .bk-body { padding: 2rem 1.25rem 1.5rem; }
          .svc-grid { grid-template-columns: 1fr; }
          .dt-grid { grid-template-columns: 1fr; }
          .bk-step-name { display: none; }
        }
      `}</style>

      <section id="pricing" className="bk-root">
        <div className="bk-grain" />
        <div className="bk-orb bk-orb-1" />
        <div className="bk-orb bk-orb-2" />

        <div className="bk-header">
          <span className="bk-eyebrow">Reserve Your Visit</span>
          <div className="bk-rule">
            <div className="bk-rule-line" />
            <div className="bk-rule-gem" />
            <div className="bk-rule-line r" />
          </div>
          <h2 className="bk-title">Book Your <em>Luxury</em><br />Experience</h2>
          <p className="bk-subtitle">A few simple steps to your next flawless set</p>
        </div>

        {step < 7 && (
          <div className="bk-card">
            <div className="bk-steps">
              {STEP_LABELS.map((label, i) => {
                const s = i + 1;
                const isActive = step === s;
                const isDone = step > s;
                return (
                  <button key={s} className={`bk-step-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`} onClick={() => isDone && goToStep(s)}>
                    <span className="bk-step-num">{isDone ? '✓' : s}</span>
                    <span className="bk-step-name">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bk-body">

              {step === 1 && (
                <>
                  <p className="bk-step-title">What would you<br />like today?</p>
                  <p className="bk-step-hint">Select a service to begin</p>
                  <div className="svc-grid">
                    {[
                      { type: 'manicure', icon: '💅', label: 'Manicure' },
                      { type: 'pedicure', icon: '🦶', label: 'Pedicure' },
                      { type: 'both', icon: '✨', label: 'Mani + Pedi' },
                    ].map(({ type, icon, label }) => (
                      <button key={type} className={`svc-btn ${serviceType === type ? 'active' : ''}`} onClick={() => handleServiceType(type)}>
                        <span className="svc-btn-icon">{icon}</span>
                        <span className="svc-btn-label">{label}</span>
                        <span className="svc-btn-bar" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="bk-step-title">Customize your<br />{serviceType === 'both' ? 'services' : serviceType}</p>
                  <p className="bk-step-hint">
                    {serviceType === 'both' ? 'Select one manicure style and at least one pedicure option'
                      : serviceType === 'manicure' ? 'Choose your preferred manicure style'
                      : 'Choose at least one pedicure option'}
                  </p>
                  {(serviceType === 'manicure' || serviceType === 'both') && (
                    <div className="opt-group">
                      <span className="opt-label">Manicure Style</span>
                      {MANI_OPTIONS.map(o => (
                        <RadioCard key={o.id} label={o.label} desc={o.desc} checked={maniOption === o.id} onChange={() => setManiOption(o.id)} />
                      ))}
                    </div>
                  )}
                  {(serviceType === 'pedicure' || serviceType === 'both') && (
                    <>
                      <div className="opt-group">
                        <span className="opt-label">Toes</span>
                        {PEDI_TOES.map(o => (
                          <RadioCard key={o.id} label={o.label} desc={o.desc} checked={pediToes === o.id} onChange={() => setPediToes(o.id)} />
                        ))}
                      </div>
                      <div className="opt-group">
                        <span className="opt-label">Treatment</span>
                        {PEDI_WRAPS.map(o => (
                          <RadioCard key={o.id} label={o.label} desc={o.desc} checked={pediWrap === o.id} onChange={() => setPediWrap(o.id)} />
                        ))}
                      </div>
                    </>
                  )}
                  <button className="bk-cta" onClick={advance} disabled={!canContinue()}>
                    <span>Continue to Schedule →</span>
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <p className="bk-step-title">When shall we<br />expect you?</p>
                  <p className="bk-step-hint">Choose a date and preferred arrival time</p>
                  <div className="dt-grid">
                    <div className="dt-field">
                      <label>Date</label>
                      <input type="date" value={selectedDate} min={today} onChange={e => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="dt-field">
                      <label>Time</label>
                      <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
                    </div>
                  </div>
                  <button className="bk-cta" onClick={advance} disabled={!selectedDate || !selectedTime}>
                    <span>Continue to Inspiration →</span>
                  </button>
                </>
              )}

              {step === 4 && (
                <>
                  <p className="bk-step-title">Share your<br />inspiration</p>
                  <p className="bk-step-hint">Upload reference images - entirely optional</p>
                  {(serviceType === 'manicure' || serviceType === 'both') && (
                    <>
                      <input type="file" accept="image/*" id="mani-inspo" style={{ display: 'none' }} onChange={e => setManiInspo(e.target.files[0] || null)} />
                      <label htmlFor="mani-inspo" className={`upload-zone ${maniInspo ? 'has-file' : ''}`}>
                        <div className="upload-icon">{maniInspo ? '✓' : '+'}</div>
                        <p className="upload-name">{maniInspo ? maniInspo.name : 'Mani Inspiration'}</p>
                        <p className="upload-hint">{maniInspo ? 'Tap to replace' : 'Tap to upload image'}</p>
                        {maniInspo && <p className="upload-success">Image selected</p>}
                      </label>
                    </>
                  )}
                  {(serviceType === 'pedicure' || serviceType === 'both') && (
                    <>
                      <input type="file" accept="image/*" id="pedi-inspo" style={{ display: 'none' }} onChange={e => setPediInspo(e.target.files[0] || null)} />
                      <label htmlFor="pedi-inspo" className={`upload-zone ${pediInspo ? 'has-file' : ''}`}>
                        <div className="upload-icon">{pediInspo ? '✓' : '+'}</div>
                        <p className="upload-name">{pediInspo ? pediInspo.name : 'Pedi Inspiration'}</p>
                        <p className="upload-hint">{pediInspo ? 'Tap to replace' : 'Tap to upload image'}</p>
                        {pediInspo && <p className="upload-success">Image selected</p>}
                      </label>
                    </>
                  )}
                  <button className="bk-cta" onClick={advance}>
                    <span>Choose Your Technician →</span>
                  </button>
                </>
              )}


              {step === 5 && (
                <>
                  <p className="bk-step-title">Who would you<br />like to serve you?</p>
                  <p className="bk-step-hint">Choose your preferred technician - or leave it to us</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(196,158,90,0.1)', marginBottom: '1.5rem' }}>
                    {TECHNICIANS.map(tech => (
                      <button
                        key={tech.id}
                        onClick={() => { setTechnician(tech.id); }}
                        style={{
                          background: technician === tech.id ? 'rgba(196,158,90,0.07)' : '#111009',
                          border: 'none',
                          borderLeft: technician === tech.id ? '2px solid #c49e5a' : '2px solid transparent',
                          padding: '1.2rem 1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.2rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.25s ease',
                          width: '100%',
                        }}
                      >
                        {/* Avatar */}
                        <span style={{
                          width: '42px', height: '42px', flexShrink: 0,
                          border: technician === tech.id ? '1px solid rgba(196,158,90,0.7)' : '1px solid rgba(196,158,90,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: tech.id === 'any' ? 'inherit' : "'Cormorant Garamond', serif",
                          fontSize: tech.id === 'any' ? '1rem' : '0.9rem',
                          fontWeight: 300,
                          color: technician === tech.id ? '#c49e5a' : 'rgba(196,158,90,0.4)',
                          transition: 'all 0.25s ease',
                          borderRadius: '50%',
                        }}>
                          {tech.initials}
                        </span>
                        {/* Info */}
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '1.1rem', fontWeight: 400,
                            color: technician === tech.id ? '#f5f0e8' : 'rgba(245,240,232,0.55)',
                            transition: 'color 0.25s ease',
                          }}>
                            {tech.name}
                          </span>
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 400,
                            letterSpacing: '0.08em',
                            color: technician === tech.id ? 'rgba(196,158,90,0.7)' : 'rgba(245,240,232,0.25)',
                            transition: 'color 0.25s ease',
                          }}>
                            {tech.role}
                          </span>
                        </span>
                        {/* Checkmark */}
                        {technician === tech.id && (
                          <span style={{ marginLeft: 'auto', color: '#c49e5a', fontSize: '0.8rem', flexShrink: 0 }}>✦</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <button className="bk-cta" onClick={advance} disabled={!technician}>
                    <span>Review & Confirm →</span>
                  </button>
                </>
              )}

              {step === 6 && (
                <>
                  <p className="bk-step-title">Review your<br />booking</p>
                  <p className="bk-step-hint">Click any completed step above to make changes</p>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <SummaryRow label="Service" value={serviceLabel} onEdit={() => setStep(1)} />
                    {maniLabel && <SummaryRow label="Manicure" value={maniLabel} onEdit={() => setStep(2)} />}
                    {pediSummary && <SummaryRow label="Pedicure" value={pediSummary} onEdit={() => setStep(2)} />}
                    <SummaryRow label="Date & Time" value={`${formatDate(selectedDate)} · ${selectedTime}`} onEdit={() => setStep(3)} />
                    {technician && <SummaryRow label="Technician" value={TECHNICIANS.find(t => t.id === technician)?.name || ''} onEdit={() => setStep(5)} />}
                    {(maniInspo || pediInspo) && (
                      <SummaryRow
                        label="Inspiration"
                        value={[maniInspo && `Mani: ${maniInspo.name}`, pediInspo && `Pedi: ${pediInspo.name}`].filter(Boolean).join(' · ')}
                        onEdit={() => setStep(4)}
                      />
                    )}
                  </div>
                  <button className="bk-cta" onClick={advance}>
                    <span>Confirm & Submit Booking ✦</span>
                  </button>
                </>
              )}

            </div>
          </div>
        )}

        {step === 7 && (
          <div className="bk-card">
            <div className="bk-body">
              <div className="confirm-wrap">
                <div className="confirm-icon">🌸</div>
                <p className="confirm-title">You're all set</p>
                <p className="confirm-sub">We'll be in touch shortly to confirm your appointment</p>
                <div className="confirm-table">
                  <div className="confirm-row"><span className="confirm-key">Service</span><span className="confirm-val">{serviceLabel}</span></div>
                  {maniLabel && <div className="confirm-row"><span className="confirm-key">Manicure</span><span className="confirm-val">{maniLabel}</span></div>}
                  {pediSummary && <div className="confirm-row"><span className="confirm-key">Pedicure</span><span className="confirm-val">{pediSummary}</span></div>}
                  <div className="confirm-row"><span className="confirm-key">Date</span><span className="confirm-val">{formatDate(selectedDate)}</span></div>
                  <div className="confirm-row"><span className="confirm-key">Time</span><span className="confirm-val">{selectedTime}</span></div>
                  {technician && <div className="confirm-row"><span className="confirm-key">Technician</span><span className="confirm-val">{TECHNICIANS.find(t => t.id === technician)?.name}</span></div>}
                </div>
                <button className="bk-reset" onClick={reset}>Book Another Appointment</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}