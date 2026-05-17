// src/components/PricingAndBookingSection.jsx
import { useEffect, useState } from 'react';

// ── Service options ────────────────────────────────────────────────────────────

const MANI_OPTIONS = [
  { id: 'reinforced-gel',   label: 'Reinforced Gel Polish',      desc: 'Strengthening gel colour over natural nails',    price: 'KES 1,500' },
  { id: 'classic-mani',     label: 'Classic Manicure',           desc: 'Soak, shape, cuticle care & regular polish',     price: 'KES 700'   },
  { id: 'spa-mani',         label: 'Spa Manicure',               desc: 'Exfoliation, hot towel & extended massage',      price: 'KES 1,500' },
  { id: 'overlays',         label: 'Overlays',                   desc: 'BIAB, Gum gel or Acrylic over natural nail',     price: 'KES 2,300' },
  { id: 'gel-x',            label: 'Gel X Extensions',           desc: 'Soft gel tips — soak-off safe, no residue',      price: 'KES 2,500' },
  { id: 'tips-gumgel',      label: 'Tips with Gumgel / Builder', desc: 'Lightweight flexible gel-tip extensions',        price: 'KES 2,800' },
  { id: 'short-acrylic',    label: 'Short Acrylic Extensions',   desc: 'Practical everyday sculpted acrylics',           price: 'KES 3,000' },
  { id: 'medium-acrylic',   label: 'Medium / Long Acrylics',     desc: 'Coffin, almond, stiletto or square',             price: 'KES 4,000' },
  { id: 'xtra-acrylic',     label: 'Xtra Long Acrylics',         desc: 'Bold statement set — ombré optional',            price: 'KES 4,500' },
];

const PEDI_OPTIONS = [
  { id: 'gel-polish',        label: 'Gel Polish',                     desc: 'Long-lasting colour on natural toenails',   price: 'KES 800'   },
  { id: 'pedi-plain',        label: 'Pedicure Plain',                 desc: 'Soak, shape, callus removal & massage',     price: 'KES 1,300' },
  { id: 'pedi-gel',          label: 'Pedicure Gel',                   desc: 'Classic pedicure with gel finish',          price: 'KES 1,800' },
  { id: 'spa-pedi',          label: 'Spa Pedicure & Gel',             desc: 'Extended spa pedicure with gel colour',     price: 'KES 2,500' },
  { id: 'jelly-pedi',        label: 'Lemon Infused Jelly Pedi & Gel', desc: 'Brightening jelly soak + gel finish',       price: 'KES 3,000' },
  { id: 'acrylic-overlay',   label: 'Acrylic Overlays (Toes)',        desc: 'Restructure toenails with acrylic',         price: 'KES 2,500' },
  { id: 'acrylic-ext-toes',  label: 'Acrylic Extensions (Toes)',      desc: 'Sculpted toe extensions for length',        price: 'KES 3,000' },
  { id: 'gel-x-toes',        label: 'Gel X Toe Extensions',           desc: 'Gel-adhered false tips on toes',            price: 'KES 2,500' },
];

const SPA_OPTIONS = [
  { id: 'hard-reset',   label: 'Hard Reset Facial',    desc: 'Deep cleanse, vacuum extraction, LED therapy',       price: 'KES 5,000' },
  { id: 'balance-glow', label: 'Balance & Glow',       desc: '2-step exfoliation, S&H mask, LED therapy',          price: 'KES 4,500' },
  { id: 'acne-combat',  label: 'Acne Combat',          desc: 'Microneedling for acne, pores & pigmentation',       price: 'KES 10,000'},
  { id: 'instant-glow', label: 'Instant Glow (Gents)', desc: 'Derma abrasion & hydrating mask for men',            price: 'KES 4,000' },
  { id: 'scalp',        label: 'The Scalp',            desc: 'Dermaplaning & S&H mask — scalp detox',              price: 'KES 4,500' },
  { id: 'body-scrub',   label: 'Body Scrub',           desc: 'Full body exfoliation for radiant skin',             price: 'KES 6,000' },
];

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 7; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 0) break;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const val = `${hh}:${mm}`;
      const ampm = h < 12 ? 'AM' : h === 12 ? 'PM' : 'PM';
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const label = `${displayH}:${mm} ${ampm}`;
      slots.push({ value: val, label });
    }
  }
  return slots;
})();

const STEP_LABELS = ['Service', 'Options', 'Technician', 'Schedule', 'Details', 'Review'];

const CAT_ICONS = {
  Manicure: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 21v-4M7 3c0 0-3 2-3 6s2 5 2 5h12s2-1 2-5-3-6-3-6"/>
      <path d="M9 3c0 0 1 1 3 1s3-1 3-1"/>
      <path d="M9 14c0 0 .5 2 3 2s3-2 3-2"/>
    </svg>
  ),
  Pedicure: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17c0 0 2-1 5-1s5 2 8 2 4-1 4-1"/>
      <path d="M4 17v-2a8 8 0 0 1 16 0v2"/>
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Spa: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0c0-5-5-9-5-9z"/>
      <path d="M12 11c0 0 2-2 4-2"/>
      <path d="M12 11c0 0-2-2-4-2"/>
      <path d="M9 21h6M12 17v4"/>
    </svg>
  ),
};

function RadioCard({ label, desc, price, checked, onChange }) {
  return (
    <label className={`rcard ${checked ? 'rcard--active' : ''}`} style={{ cursor: 'pointer' }}>
      <input type="radio" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span className="rcard-dot">
        {checked && <span className="rcard-dot-fill" />}
      </span>
      <span className="rcard-body">
        <span className="rcard-label">{label}</span>
        {desc && <span className="rcard-desc">{desc}</span>}
      </span>
      {price && (
        <span className="rcard-price">{price}</span>
      )}
    </label>
  );
}

function SummaryRow({ label, value, onEdit, muted }) {
  return (
    <div className="srow">
      <div>
        <p className="srow-label">{label}</p>
        <p className={`srow-value ${muted ? 'srow-value--muted' : ''}`}>{value}</p>
      </div>
      <button className="srow-edit" onClick={onEdit}>Edit</button>
    </div>
  );
}

export default function PricingAndBookingSection() {
  const [step, setStep] = useState(1);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const [wantsMani, setWantsMani] = useState(false);
  const [wantsPedi, setWantsPedi] = useState(false);
  const [wantsSpa,  setWantsSpa]  = useState(false);

  const [maniOption, setManiOption] = useState('');
  const [pediOption, setPediOption] = useState('');
  const [spaOption,  setSpaOption]  = useState('');

  const [technician, setTechnician] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [editingFromReview,          setEditingFromReview]          = useState(false);
  const [servicesAtEditStart,        setServicesAtEditStart]        = useState({ mani: false, pedi: false, spa: false });
  const [returnToReviewAfterOptions, setReturnToReviewAfterOptions] = useState(false);
  const [editingTechFromReview,      setEditingTechFromReview]      = useState(false);
  const [editingOptionsFromReview,   setEditingOptionsFromReview]   = useState(false);

  const anySelected = wantsMani || wantsPedi || wantsSpa;

  const isStep5Valid = () => {
    const phoneRegex = /^(\+254|0)?7\d{8}$/;
    return clientName.trim().length > 2 && phoneRegex.test(clientPhone.replace(/\s/g, ''));
  };

  const canContinueOptions = () => {
    if (wantsMani && !maniOption) return false;
    if (wantsPedi && !pediOption) return false;
    if (wantsSpa  && !spaOption)  return false;
    return true;
  };

  const reset = () => {
    setStep(1);
    setClientName(''); setClientPhone('');
    setWantsMani(false); setWantsPedi(false); setWantsSpa(false);
    setManiOption('');   setPediOption('');   setSpaOption('');
    setTechnician('');
    setSelectedDate(''); setSelectedTime('');
    setEditingFromReview(false);
    setServicesAtEditStart({ mani: false, pedi: false, spa: false });
    setReturnToReviewAfterOptions(false);
    setEditingTechFromReview(false);
    setEditingOptionsFromReview(false);
  };

  const goToStep = (s) => { if (s < step) setStep(s); };
  const advance  = ()  => step < 7 && setStep(s => s + 1);

  const today = new Date().toISOString().split('T')[0];

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const serviceLabel = [
    wantsMani && 'Manicure',
    wantsPedi && 'Pedicure',
    wantsSpa  && 'Spa',
  ].filter(Boolean).join(' + ') || '—';

  const maniLabel = MANI_OPTIONS.find(o => o.id === maniOption)?.label || '';
  const pediLabel = PEDI_OPTIONS.find(o => o.id === pediOption)?.label || '';
  const spaLabel  = SPA_OPTIONS.find(o  => o.id === spaOption)?.label  || '';

  const handleStep1Continue = () => {
    if (!wantsMani) setManiOption('');
    if (!wantsPedi) setPediOption('');
    if (!wantsSpa)  setSpaOption('');

    if (editingFromReview) {
      setEditingFromReview(false);
      const addedMani = wantsMani && !servicesAtEditStart.mani;
      const addedPedi = wantsPedi && !servicesAtEditStart.pedi;
      const addedSpa  = wantsSpa  && !servicesAtEditStart.spa;
      if (addedMani || addedPedi || addedSpa) {
        setReturnToReviewAfterOptions(true);
        setStep(2);
      } else {
        setStep(6);
      }
    } else {
      advance();
    }
  };

  const handleStep2Continue = () => {
    if (returnToReviewAfterOptions || editingOptionsFromReview) {
      setReturnToReviewAfterOptions(false);
      setEditingOptionsFromReview(false);
      setStep(6);
    } else {
      advance();
    }
  };
const handleStep3Continue = () => {
  if (editingTechFromReview) {
    setEditingTechFromReview(false);
    setStep(6);
  } else {
    advance();
  }
};

  const handleStep4Continue = () => {
    if (editingTechFromReview) {
      setEditingTechFromReview(false);
      setStep(6);
    } else {
      advance();
    }
  };

  const [technicians] = useState([
    { id: 't1', name: 'Ava',  role: 'Nail Tech',      initials: 'A' },
    { id: 't2', name: 'Maya', role: 'Nail Tech',      initials: 'M' },
    { id: 't3', name: 'Zoe',  role: 'Nail Tech',      initials: 'Z' },
    { id: 't4', name: 'Lina', role: 'Lead Nail Tech', initials: 'L' },
    { id: 'any', name: 'Any available technician', role: 'Best match', initials: '✨' }
  ]);

  const sendBookingEmail = async () => {
    try {
      const formData = new FormData();
      formData.append("access_key", "ee9dd06b-7b8a-4d90-bd43-9edee5122acc");
      formData.append("subject", "New Booking ✨");
      formData.append("Name", clientName);
      formData.append("Phone", clientPhone);
      formData.append("Services", serviceLabel);
      formData.append("Manicure", maniLabel || "None");
      formData.append("Pedicure", pediLabel || "None");
      formData.append("Spa", spaLabel || "None");
      formData.append("Technician", technicians.find(t => t.id === technician)?.name || "Any");
      formData.append("Date", formatDate(selectedDate));
      formData.append("Time", selectedTime);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleBookingSubmit = async () => {
    if (!clientName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }
    try {
      await sendBookingEmail();
      setStep(7);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .bk-root {
          min-height: 100vh;
          background: #000000; /* Pure Black Background */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 8rem 1.5rem 6rem;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }

        /* Removals: Gradients, Noise Overlays, Orbs deleted completely for clean presentation */

        .bk-header { text-align: center; margin-bottom: 3.5rem; position: relative; z-index: 1; }

        .bk-eyebrow {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #ffffff;
          display: block;
          margin-bottom: 1.2rem;
        }

        /* Gold Line Rule Before Find Us Style Block */
        .bk-rule { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1.2rem; }
        .bk-rule-line { width: 48px; height: 1px; background: linear-gradient(to right, transparent, #c4975a); }
        .bk-rule-line.r { background: linear-gradient(to left, transparent, #c4975a); }
        .bk-rule-gem { width: 5px; height: 5px; background: #c4975a; transform: rotate(45deg); }

        .bk-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 300; color: #ffffff; line-height: 1.08; letter-spacing: -0.01em; }
        .bk-title em { font-style: italic; color: #ffffff; }
        .bk-subtitle { margin-top: 0.9rem; font-size: 0.85rem; font-weight: 300; color: #ffffff; letter-spacing: 0.05em; }

        .bk-card { background: #000000; border: 1px solid rgba(255,255,255,0.15); width: 100%; max-width: 680px; position: relative; z-index: 1; }

        /* ── Step bar ── */
        .bk-steps { display: flex; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .bk-step-btn { flex: 1; padding: 1.1rem 0.5rem; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; border-right: 1px solid rgba(255,255,255,0.1); cursor: default; }
        .bk-step-btn:last-child { border-right: none; }
        .bk-step-btn.done { cursor: pointer; }
        .bk-step-btn.done:hover { background: rgba(255,255,255,0.05); }

        .bk-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.3);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .bk-step-btn.active .bk-step-num { background: #ffffff; border-color: #ffffff; color: #000000; font-weight: 600; }
        .bk-step-btn.done .bk-step-num { background: #c4975a; border-color: #c4975a; color: #000000; }

        .bk-step-name { font-size: 0.58rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        .bk-step-btn.active .bk-step-name { color: #ffffff; }
        .bk-step-btn.done .bk-step-name { color: #c4975a; }

        .bk-body { padding: 2.5rem 2.5rem 2rem; }
        .bk-step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; font-style: italic; color: #ffffff; margin-bottom: 0.4rem; line-height: 1.15; }
        .bk-step-hint { font-size: 0.75rem; font-weight: 300; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 2rem; }

        /* ── Step 1: category cards ── */
        .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.4rem; align-items: stretch; }
        .cat-card { background: transparent; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: stretch; outline: none; transition: border-color 0.25s, background 0.25s; }
        .cat-card:hover { border-color: #c4975a; background: rgba(196,158,90,0.03); }
        .cat-card.cat-active { border-color: #c4975a; background: rgba(196,158,90,0.08); }
        .cat-card-top-bar { height: 2px; background: transparent; flex-shrink: 0; }
        .cat-card.cat-active .cat-card-top-bar { background: #c4975a; }
        .cat-card-inner { padding: 1.6rem 1rem 1.4rem; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 0.7rem; flex: 1; }

        .cat-checkbox { position: absolute; top: 0.7rem; right: 0.7rem; width: 18px; height: 18px; border: 1px solid rgba(255,255,255,0.4); border-radius: 1px; display: flex; align-items: center; justify-content: center; background: transparent; }
        .cat-card.cat-active .cat-checkbox { background: #c4975a; border-color: #c4975a; }
        .cat-check-mark { color: #000000; font-size: 0.6rem; font-weight: 700; opacity: 0; line-height: 1; }
        .cat-card.cat-active .cat-check-mark { opacity: 1; }

        /* Gold Icons Requirement Context */
        .cat-icon-wrap { width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; background: transparent; color: #ffffff; transition: all 0.25s; }
        .cat-card.cat-active .cat-icon-wrap { border-color: #c4975a; color: #c4975a; }
        .cat-card:hover .cat-icon-wrap { color: #c4975a; border-color: #c4975a; }

        .cat-btn-label { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 400; color: #ffffff; }
        .cat-btn-desc { font-size: 0.62rem; font-weight: 300; color: #ffffff; opacity: 0.6; letter-spacing: 0.05em; line-height: 1.5; text-align: center; }

        /* ── Multi-hint ── */
        .multi-hint { display: flex; align-items: center; gap: 0.6rem; background: transparent; border: 1px solid #c4975a; border-left: 3px solid #c4975a; padding: 0.65rem 1rem; margin-bottom: 1.5rem; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.06em; color: #c4975a; }
        .multi-hint-icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 10px; height: 10px; }
        .multi-hint-pulse { width: 6px; height: 6px; border-radius: 50%; background: #c4975a; }

        /* ── Summary pills ── */
        .cat-summary { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; min-height: 2rem; margin-bottom: 1.4rem; }
        .cat-summary-label { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #ffffff; opacity: 0.4; }
        .cat-pill { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #000000; background: #ffffff; padding: 0.28rem 0.75rem; display: flex; align-items: center; gap: 0.35rem; border-radius: 1px; }
        .cat-pill-x { cursor: pointer; opacity: 0.6; font-size: 0.55rem; }
        .cat-pill-x:hover { opacity: 1; }

        /* ── Options (step 2) ── */
        .opt-section { margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.15); background: #000000; }
        .opt-section-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.1rem; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.15); }
        .opt-section-icon { color: #c4975a; display: flex; align-items: center; }

        /* Titles configured to Gold (Address, Hours, Parking / Mani, Pedi, Spa blocks) */
        .opt-section-title { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #c4975a; }
        .opt-list { padding: 0.6rem 0.6rem; display: flex; flex-direction: column; gap: 0.4rem; }

        /* ── Radio cards ── */
        .rcard { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border: 1px solid rgba(255,255,255,0.12); background: transparent; transition: all 0.25s ease; }
        .rcard:hover { border-color: #c4975a; background: rgba(196,158,90,0.03); }
        .rcard--active { border-color: #c4975a !important; background: rgba(196,158,90,0.06) !important; }
        .rcard-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .rcard--active .rcard-dot { border-color: #c4975a; }
        .rcard-dot-fill { width: 8px; height: 8px; border-radius: 50%; background: #c4975a; }
        .rcard-body { display: flex; flex-direction: column; gap: 1px; flex: 1; }
        .rcard-label { font-size: 0.88rem; font-weight: 400; color: #ffffff; }
        .rcard-desc { font-size: 0.72rem; font-weight: 300; color: #ffffff; opacity: 0.5; }

        /* Price values style definition */
        .rcard-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: #ffffff;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .rcard--active .rcard-price { color: #c4975a; font-weight: 600; }

        /* ── Date/time ── */
        .dt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.15); margin-bottom: 1.5rem; }
        .dt-field { background: #000000; padding: 1.4rem 1.2rem; }

        /* Titles changed to Gold */
        .dt-field label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #c4975a; display: block; margin-bottom: 0.6rem; }

        .dt-field input,
        .dt-field select {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #ffffff;
          color-scheme: dark;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }
        .dt-field input::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
        .dt-field select option { background: #000000; color: #ffffff; }
        .dt-field-inner { position: relative; }
        .dt-field-inner::after {
          content: '▾';
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          color: #c4975a;
          font-size: 0.85rem;
          pointer-events: none;
        }

        /* ── Input fields (Step 5) ── */
        .input-field {
          background: #000000;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 1.2rem 1.3rem;
          margin-bottom: 1.2rem;
        }

        /* Input section titles to Gold */
        .input-field label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c4975a;
          display: block;
          margin-bottom: 0.55rem;
        }
        .input-field input[type="text"],
        .input-field input[type="tel"] {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          outline: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.92rem;
          font-weight: 300;
          color: #ffffff;
          padding: 0.4rem 0;
        }
        .input-field input[type="text"]:focus,
        .input-field input[type="tel"]:focus {
          border-bottom-color: #c4975a;
        }
        .input-field input::placeholder { color: rgba(255,255,255,0.3); }

        /* ── Upload ── */
        .upload-zone { border: 1px dashed rgba(255,255,255,0.3); padding: 1.6rem 1.5rem; text-align: center; cursor: pointer; display: block; background: transparent; }
        .upload-zone:hover { border-color: #c4975a; background: rgba(196,158,90,0.02); }
        .upload-icon { font-size: 1.4rem; color: #c4975a; margin-bottom: 0.5rem; }
        .upload-name { font-size: 0.82rem; color: #ffffff; font-weight: 300; }
        .upload-success { font-size: 0.7rem; color: #ffffff; margin-top: 0.4rem; letter-spacing: 0.05em; }

        /* Upload block text label to Gold */
        .upload-label-tag { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #c4975a; display: block; margin-bottom: 0.5rem; }

        /* ── Section divider ── */
        .step5-divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.75rem 0 1.5rem; }
        .step5-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.15); }
        .step5-divider-text { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #c4975a; white-space: nowrap; }

        /* ── Summary rows ── */
        .srow { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .srow:last-of-type { border-bottom: none; }

        /* Review item header titles to Gold */
        .srow-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #c4975a; margin-bottom: 0.25rem; }
        .srow-value { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 400; color: #ffffff; }
        .srow-value--muted { color: rgba(245,240,232,0.4); font-style: italic; }
        .srow-edit { font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #ffffff; background: none; border: none; cursor: pointer; padding: 0.3rem 0; border-bottom: 1px solid transparent; }
        .srow-edit:hover { color: #c4975a; border-bottom-color: #c4975a; }

        /* ── CTA button ── */
        .bk-cta { width: 100%; padding: 1.1rem; background: transparent; border: 1px solid #c4975a; font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; cursor: pointer; transition: all 0.3s cubic-bezier(.25,.46,.45,.94); margin-top: 1.5rem; }
        .bk-cta:hover { background: #c4975a; color: #000000; }
        .bk-cta:disabled { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.3); cursor: not-allowed; background: transparent; }
        .bk-cta:disabled:hover { color: rgba(255,255,255,0.3); background: transparent; }
        .bk-cta-count { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; font-size: 0.62rem; font-weight: 600; color: #ffffff; margin-left: 0.4rem; }

        /* ── Confirm ── */
        .confirm-wrap { text-align: center; padding: 1rem 0; }
        .confirm-icon { color: #c4975a; font-size: 2.5rem; margin-bottom: 1.2rem; }
        .confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; font-style: italic; color: #ffffff; margin-bottom: 0.5rem; }
        .confirm-sub { font-size: 0.82rem; font-weight: 300; color: #ffffff; opacity: 0.7; margin-bottom: 2.5rem; letter-spacing: 0.03em; }
        .confirm-table { border: 1px solid rgba(255,255,255,0.15); margin: 0 0 2rem; text-align: left; background: #000000; }

        .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .confirm-row:last-child { border-bottom: none; }

        /* Confirmation key headers to Gold */
        .confirm-key { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #c4975a; }
        .confirm-val { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 400; color: #ffffff; }

        .bk-reset { background: transparent; border: 1px solid #c4975a; color: #ffffff; font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.75rem 1.8rem; cursor: pointer; transition: all 0.25s ease; }
        .bk-reset:hover { background: #c4975a; color: #000000; }

        .whatsapp-float { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: #c4975a; color: #000000; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 1000; transition: transform 0.3s ease; }
        .whatsapp-float:hover { transform: scale(1.1); }

        @media (max-width: 600px) {
          .bk-body { padding: 2rem 1.25rem 1.5rem; }
          .cat-grid { grid-template-columns: 1fr; }
          .dt-grid { grid-template-columns: 1fr; }
          .bk-step-name { display: none; }
        }
      `}</style>

      <section id="pricing" className="bk-root">
        {/* Orbs and backgrounds deleted */}

        <div className="bk-header">
          <div className="bk-rule">
            <div className="bk-rule-line" />
            <div className="bk-rule-gem" />
            <div className="bk-rule-line r" />
          </div>
          <span className="bk-eyebrow">Reservations</span>
          <h2 className="bk-title">
            Select <em>Your</em> Ritual
          </h2>
          <p className="bk-subtitle">Premium curation. Tailored finish.</p>
        </div>

        <div className="bk-card">
          {step <= 6 && (
            <div className="bk-steps">
              {STEP_LABELS.map((label, idx) => {
                const sNum = idx + 1;
                const isActive = step === sNum;
                const isDone = step > sNum;
                return (
                  <button
                    key={label}
                    className={`bk-step-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    onClick={() => isDone && goToStep(sNum)}
                    disabled={!isDone}
                  >
                    <span className="bk-step-num">{sNum}</span>
                    <span className="bk-step-name">{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="bk-body">
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h3 className="bk-step-title">What are we creating?</h3>
                <p className="bk-step-hint">Select one or multiple services to configure your appointment slot.</p>

                <div className="cat-grid">
                  <div className={`cat-card ${wantsMani ? 'cat-active' : ''}`} onClick={() => setWantsMani(!wantsMani)}>
                    <div className="cat-card-top-bar" />
                    <div className="cat-card-inner">
                      <div className="cat-checkbox">
                        <span className="cat-check-mark">✓</span>
                      </div>
                      <div className="cat-icon-wrap">{CAT_ICONS.Manicure}</div>
                      <span className="cat-btn-label">Manicure</span>
                      <span className="cat-btn-desc">Considered nail extensions & structural overlay care.</span>
                    </div>
                  </div>

                  <div className={`cat-card ${wantsPedi ? 'cat-active' : ''}`} onClick={() => setWantsPedi(!wantsPedi)}>
                    <div className="cat-card-top-bar" />
                    <div className="cat-card-inner">
                      <div className="cat-checkbox">
                        <span className="cat-check-mark">✓</span>
                      </div>
                      <div className="cat-icon-wrap">{CAT_ICONS.Pedicure}</div>
                      <span className="cat-btn-label">Pedicure</span>
                      <span className="cat-btn-desc">Foot restoration treatments & clean gel finishes.</span>
                    </div>
                  </div>

                  <div className={`cat-card ${wantsSpa ? 'cat-active' : ''}`} onClick={() => setWantsSpa(!wantsSpa)}>
                    <div className="cat-card-top-bar" />
                    <div className="cat-card-inner">
                      <div className="cat-checkbox">
                        <span className="cat-check-mark">✓</span>
                      </div>
                      <div className="cat-icon-wrap">{CAT_ICONS.Spa}</div>
                      <span className="cat-btn-label">Spa & Skin</span>
                      <span className="cat-btn-desc">Advanced facials, microneedling & total wellness resets.</span>
                    </div>
                  </div>
                </div>

                <div className="multi-hint">
                  <div className="multi-hint-icon"><div className="multi-hint-pulse" /></div>
                  <span>Multi-selection enabled: You can pick multiple options for a unified session booking.</span>
                </div>

                <button className="bk-cta" disabled={!anySelected} onClick={handleStep1Continue}>
                  <span>Continue</span>
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h3 className="bk-step-title">Refine your selections</h3>
                <p className="bk-step-hint">Choose your explicit treatment package from our design tiers.</p>

                {wantsMani && (
                  <div className="opt-section">
                    <div className="opt-section-header">
                      <span className="opt-section-icon">{CAT_ICONS.Manicure}</span>
                      <span className="opt-section-title">Manicure Options</span>
                    </div>
                    <div className="opt-list">
                      {MANI_OPTIONS.map(o => (
                        <RadioCard
                          key={o.id}
                          label={o.label}
                          desc={o.desc}
                          price={o.price}
                          checked={maniOption === o.id}
                          onChange={() => setManiOption(o.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {wantsPedi && (
                  <div className="opt-section">
                    <div className="opt-section-header">
                      <span className="opt-section-icon">{CAT_ICONS.Pedicure}</span>
                      <span className="opt-section-title">Pedicure Options</span>
                    </div>
                    <div className="opt-list">
                      {PEDI_OPTIONS.map(o => (
                        <RadioCard
                          key={o.id}
                          label={o.label}
                          desc={o.desc}
                          price={o.price}
                          checked={pediOption === o.id}
                          onChange={() => setPediOption(o.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {wantsSpa && (
                  <div className="opt-section">
                    <div className="opt-section-header">
                      <span className="opt-section-icon">{CAT_ICONS.Spa}</span>
                      <span className="opt-section-title">Spa & Facial Options</span>
                    </div>
                    <div className="opt-list">
                      {SPA_OPTIONS.map(o => (
                        <RadioCard
                          key={o.id}
                          label={o.label}
                          desc={o.desc}
                          price={o.price}
                          checked={spaOption === o.id}
                          onChange={() => setSpaOption(o.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button className="bk-cta" disabled={!canContinueOptions()} onClick={handleStep2Continue}>
                  <span>Next Step</span>
                </button>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h3 className="bk-step-title">Select Artist</h3>
                <p className="bk-step-hint">Choose your preferred nail technician or aesthetician.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {technicians.map(t => (
                    <RadioCard
                      key={t.id}
                      label={t.name}
                      desc={t.role}
                      checked={technician === t.id}
                      onChange={() => setTechnician(t.id)}
                    />
                  ))}
                </div>

                <button className="bk-cta" disabled={!technician} onClick={handleStep3Continue}>
                  <span>Next Step</span>
                </button>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <h3 className="bk-step-title">Secure Date & Time</h3>
                <p className="bk-step-hint">Select from our real-time calendar availability window matrix.</p>

                <div className="dt-grid">
                  <div className="dt-field">
                    <label>Select Date</label>
                    <input type="date" min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="dt-field">
                    <label>Select Time Window</label>
                    <div className="dt-field-inner">
                      <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                        <option value="">Choose Time Slot...</option>
                        {TIME_SLOTS.map(t => (
                          <option key={t.value} value={t.label}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button className="bk-cta" disabled={!selectedDate || !selectedTime} onClick={handleStep4Continue}>
                  <span>Next Step</span>
                </button>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <h3 className="bk-step-title">Your Details</h3>
                <p className="bk-step-hint">Provide contact parameters to automatically process this line request.</p>

                <div className="input-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="e.g. Jane Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>

                <div className="input-field">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="e.g. 0745 557 460" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                </div>

                <div className="step5-divider">
                  <div className="step5-divider-line" />
                  <span className="step5-divider-text">Reference Imagery</span>
                  <div className="step5-divider-line" />
                </div>

                <div className="upload-label-tag">Inspiration Upload (Optional)</div>
                <label className="upload-zone">
                  <div className="upload-icon">✦</div>
                  <div className="upload-name">Tap to share reference photos/nail ideas via WhatsApp later</div>
                </label>

                <button className="bk-cta" disabled={!isStep5Valid()} onClick={advance}>
                  <span>Review Booking</span>
                </button>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div>
                <h3 className="bk-step-title">Review Manifest</h3>
                <p className="bk-step-hint">Verify details prior to initializing secure booking transmission logs.</p>

                <div style={{ marginTop: '1rem' }}>
                  <SummaryRow
                    label="Service Tiers"
                    value={serviceLabel}
                    onEdit={() => {
                      setServicesAtEditStart({
  mani: wantsMani,
  pedi: wantsPedi,
  spa: wantsSpa
});
                      setEditingFromReview(true);
                      setStep(1);
                    }}
                  />

                  {(wantsMani || wantsPedi || wantsSpa) && (
                    <SummaryRow
                      label="Configured Details"
                      value={[maniLabel, pediLabel, spaLabel].filter(Boolean).join(', ')}
                      onEdit={() => {
                        setEditingOptionsFromReview(true);
                        setStep(2);
                      }}
                    />
                  )}

                  <SummaryRow
                    label="Assigned Tech"
                    value={technicians.find(t => t.id === technician)?.name || '—'}
                    onEdit={() => {
                      setEditingTechFromReview(true);
                      setStep(3);
                    }}
                  />

                  <SummaryRow label="Date Block" value={formatDate(selectedDate)} onEdit={() => setStep(4)} />
                  <SummaryRow label="Time Window" value={selectedTime} onEdit={() => setStep(4)} />
                  <SummaryRow label="Client Ledger" value={`${clientName} (${clientPhone})`} onEdit={() => setStep(5)} />
                </div>

                <button className="bk-cta" onClick={handleBookingSubmit}>
                  <span>Transmit Confirmation</span>
                </button>
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div className="confirm-wrap">
                <div className="confirm-icon">✦</div>
                <h3 className="confirm-title">Request Staged</h3>
                <p className="confirm-sub">Your application log data has been submitted successfully.</p>

                <div className="confirm-table">
                  <div className="confirm-row">
                    <span className="confirm-key">Client Target</span>
                    <span className="confirm-val">{clientName}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-key">Service Combo</span>
                    <span className="confirm-val">{serviceLabel}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-key">Schedule window</span>
                    <span className="confirm-val">{selectedTime} · {formatDate(selectedDate)}</span>
                  </div>
                </div>

                <button className="bk-reset" onClick={reset}>
                  <span>Book Another Ritual</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}