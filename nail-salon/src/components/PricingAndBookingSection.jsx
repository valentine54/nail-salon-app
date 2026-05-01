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

// ── Generate time slots 7am–6pm in 30-min increments ──────────────────────────
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

// ── SVG Icons ─────────────────────────────────────────────────────────────────

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

// ── Small components ───────────────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────────

export default function PricingAndBookingSection() {
  const [step, setStep] = useState(1);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Step 1: which categories (multi-select)
  const [wantsMani, setWantsMani] = useState(false);
  const [wantsPedi, setWantsPedi] = useState(false);
  const [wantsSpa,  setWantsSpa]  = useState(false);

  // Step 2: chosen options per category
  const [maniOption, setManiOption] = useState('');
  const [pediOption, setPediOption] = useState('');
  const [spaOption,  setSpaOption]  = useState('');

  // Step 3: technician
  const [technician, setTechnician] = useState('');

  // Step 4: date & time
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');


  // ── Edit-from-review routing states ──
  const [editingFromReview,          setEditingFromReview]          = useState(false);
  const [servicesAtEditStart,        setServicesAtEditStart]        = useState({ mani: false, pedi: false, spa: false });
  const [returnToReviewAfterOptions, setReturnToReviewAfterOptions] = useState(false);
  const [editingTechFromReview,      setEditingTechFromReview]      = useState(false);
  const [editingOptionsFromReview,   setEditingOptionsFromReview]   = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────────

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

  const handleStep3Continue = () => { advance(); };

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

    formData.append("access_key", "381d8c6b-77f6-4c5d-9f50-3e6ebe26aad0");

    // 👇 This controls the email subject (important!)
    formData.append("subject", "New Booking ✨");

    // 👇 Send structured fields instead of one message
    formData.append("Name", clientName);
    formData.append("Phone", clientPhone);
    formData.append("Services", serviceLabel);

    formData.append("Manicure", maniLabel || "None");
    formData.append("Pedicure", pediLabel || "None");
    formData.append("Spa", spaLabel || "None");

    formData.append(
      "Technician",
      technicians.find(t => t.id === technician)?.name || "Any"
    );

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
        .bk-orb-2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%); bottom: 0; left: -80px; }
        .bk-grain {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        .bk-header { text-align: center; margin-bottom: 3.5rem; position: relative; z-index: 1; }
        .bk-eyebrow { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: #ffffff; display: block; margin-bottom: 1.2rem; }
        .bk-rule { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1.2rem; }
        .bk-rule-line { width: 48px; height: 1px; background: linear-gradient(to right, transparent, rgba(196,158,90,0.5)); }
        .bk-rule-line.r { background: linear-gradient(to left, transparent, rgba(196,158,90,0.5)); }
        .bk-rule-gem { width: 5px; height: 5px; background: #ffffff; transform: rotate(45deg); }
        .bk-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.8rem, 5vw, 4.5rem); font-weight: 300; color: #f5f0e8; line-height: 1.08; letter-spacing: -0.01em; }
        .bk-title em { font-style: italic; color: #ffffff; }
        .bk-subtitle { margin-top: 0.9rem; font-size: 0.85rem; font-weight: 300; color: rgba(245,240,232,0.4); letter-spacing: 0.05em; }

        .bk-card { background: #111009; border: 1px solid rgba(255,255,255,0.12); width: 100%; max-width: 680px; position: relative; z-index: 1; }

        /* ── Step bar ── */
        .bk-steps { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .bk-step-btn { flex: 1; padding: 1.1rem 0.5rem; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; border-right: 1px solid rgba(255,255,255,0.07); cursor: default; transition: background 0.25s ease; }
        .bk-step-btn:last-child { border-right: none; }
        .bk-step-btn.done { cursor: pointer; }
        .bk-step-btn.done:hover { background: rgba(255,255,255,0.03); }
        .bk-step-num { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 500; border: 1px solid rgba(255,255,255,0.18); color: rgba(245,240,232,0.25); transition: all 0.3s ease; }
        .bk-step-btn.active .bk-step-num { background: #ffffff; border-color: #ffffff; color: #0e0c09; font-weight: 600; }
        .bk-step-btn.done .bk-step-num { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.38); color: #ffffff; }
        .bk-step-name { font-size: 0.58rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,232,0.25); transition: color 0.3s; }
        .bk-step-btn.active .bk-step-name { color: #ffffff; }
        .bk-step-btn.done .bk-step-name { color: rgba(255,255,255,0.55); }

        .bk-body { padding: 2.5rem 2.5rem 2rem; }
        .bk-step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; font-style: italic; color: #f5f0e8; margin-bottom: 0.4rem; line-height: 1.15; }
        .bk-step-hint { font-size: 0.75rem; font-weight: 300; color: rgba(245,240,232,0.35); letter-spacing: 0.05em; margin-bottom: 2rem; }

        /* ── Step 1: category cards ── */
        .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.4rem; align-items: stretch; }
        .cat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: stretch; outline: none; transition: border-color 0.25s, background 0.25s, transform 0.15s; }
        .cat-card:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.03); transform: translateY(-1px); }
        .cat-card.cat-active { border-color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.07); }
        .cat-card-top-bar { height: 2px; background: transparent; transition: background 0.25s; flex-shrink: 0; }
        .cat-card.cat-active .cat-card-top-bar { background: linear-gradient(to right, #ffffff, #e8c98a, #ffffff); }
        .cat-card-inner { padding: 1.6rem 1rem 1.4rem; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 0.7rem; flex: 1; }
        .cat-checkbox { position: absolute; top: 0.7rem; right: 0.7rem; width: 18px; height: 18px; border: 1px solid rgba(255,255,255,0.22); border-radius: 3px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: transparent; }
        .cat-card.cat-active .cat-checkbox { background: #ffffff; border-color: #ffffff; }
        .cat-check-mark { color: #0e0c09; font-size: 0.6rem; font-weight: 700; opacity: 0; transform: scale(0.5); transition: opacity 0.2s, transform 0.2s; line-height: 1; }
        .cat-card.cat-active .cat-check-mark { opacity: 1; transform: scale(1); }
        .cat-icon-wrap { width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.32); transition: border-color 0.25s, background 0.25s, color 0.25s; }
        .cat-card.cat-active .cat-icon-wrap { border-color: rgba(196,158,90,0.5); background: rgba(255,255,255,0.1); color: #ffffff; }
        .cat-card:not(.cat-active):hover .cat-icon-wrap { color: rgba(255,255,255,0.55); border-color: rgba(255,255,255,0.28); }
        .cat-btn-label { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 400; color: rgba(245,240,232,0.45); transition: color 0.25s; }
        .cat-card.cat-active .cat-btn-label { color: #f5f0e8; }
        .cat-btn-desc { font-size: 0.62rem; font-weight: 300; color: rgba(245,240,232,0.22); letter-spacing: 0.05em; line-height: 1.5; text-align: center; transition: color 0.25s; }
        .cat-card.cat-active .cat-btn-desc { color: rgba(245,240,232,0.45); }

        /* ── Multi-hint ── */
        .multi-hint { display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-left: 2px solid #ffffff; padding: 0.65rem 1rem; margin-bottom: 1.5rem; font-size: 0.7rem; font-weight: 400; letter-spacing: 0.06em; color: rgba(196,158,90,0.85); }
        .multi-hint-icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; width: 10px; height: 10px; }
        .multi-hint-pulse { width: 8px; height: 8px; border-radius: 50%; background: #ffffff; position: relative; z-index: 1; }
        .multi-hint-pulse::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; background: rgba(255,255,255,0.32); animation: pulse-ring 1.6s ease-out infinite; }
        .multi-hint-pulse::after { content: ''; position: absolute; inset: -8px; border-radius: 50%; background: rgba(255,255,255,0.1); animation: pulse-ring 1.6s ease-out infinite 0.4s; }
        @keyframes pulse-ring { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }

        /* ── Summary pills ── */
        .cat-summary { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; min-height: 2rem; margin-bottom: 1.4rem; }
        .cat-summary-label { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(245,240,232,0.2); }
        .cat-pill { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #0e0c09; background: #ffffff; padding: 0.28rem 0.75rem; display: flex; align-items: center; gap: 0.35rem; }
        .cat-pill-x { cursor: pointer; opacity: 0.6; font-size: 0.55rem; }
        .cat-pill-x:hover { opacity: 1; }

        /* ── Options (step 2) ── */
        .opt-section { margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1); }
        .opt-section-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.1rem; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .opt-section-icon { font-size: 1rem; }
        .opt-section-title { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; }
        .opt-list { padding: 0.6rem 0.6rem; display: flex; flex-direction: column; gap: 0.4rem; }

        /* ── Radio cards ── */
        .rcard { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.015); transition: border-color 0.25s ease, background 0.25s ease; }
        .rcard:hover { border-color: rgba(255,255,255,0.22); background: rgba(196,158,90,0.03); }
        .rcard--active { border-color: rgba(196,158,90,0.5) !important; background: rgba(255,255,255,0.06) !important; }
        .rcard-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.32); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s; }
        .rcard--active .rcard-dot { border-color: #ffffff; }
        .rcard-dot-fill { width: 7px; height: 7px; border-radius: 50%; background: #ffffff; }
        .rcard-body { display: flex; flex-direction: column; gap: 1px; flex: 1; }
        .rcard-label { font-size: 0.88rem; font-weight: 400; color: rgba(245,240,232,0.8); }
        .rcard--active .rcard-label { color: #f5f0e8; }
        .rcard-desc { font-size: 0.72rem; font-weight: 300; color: rgba(245,240,232,0.3); }
        .rcard-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-weight: 300;
          font-style: italic;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .rcard--active .rcard-price { color: #ffffff; }

        /* ── Date/time ── */
        .dt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.1); margin-bottom: 1.5rem; }
        .dt-field { background: #111009; padding: 1.4rem 1.2rem; }
        .dt-field label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; display: block; margin-bottom: 0.6rem; }
        .dt-field input,
        .dt-field select {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: #f5f0e8;
          color-scheme: dark;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }
        .dt-field input::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(2) hue-rotate(5deg); cursor: pointer; }
        .dt-field select option { background: #1a1710; color: #f5f0e8; }
        .dt-field-inner { position: relative; }
        .dt-field-inner::after {
          content: '▾';
          position: absolute;
          right: 0; top: 50%;
          transform: translateY(-50%);
          color: rgba(196,158,90,0.5);
          font-size: 0.75rem;
          pointer-events: none;
        }

        /* ── Input fields (Step 5) ── */
        .input-field {
          background: #111009;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.2rem 1.3rem;
          margin-bottom: 0;
        }
        .input-field label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ffffff;
          display: block;
          margin-bottom: 0.55rem;
        }
        .input-field input[type="text"],
        .input-field input[type="tel"] {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          outline: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.92rem;
          font-weight: 300;
          color: #f5f0e8;
          padding: 0.4rem 0;
          transition: border-color 0.2s;
        }
        .input-field input[type="text"]:focus,
        .input-field input[type="tel"]:focus {
          border-bottom-color: rgba(196,158,90,0.5);
        }
        .input-field input::placeholder { color: rgba(245,240,232,0.2); }

        /* ── Upload ── */
        .upload-zone { border: 1px dashed rgba(255,255,255,0.18); padding: 1.6rem 1.5rem; text-align: center; cursor: pointer; transition: border-color 0.25s ease, background 0.25s ease; display: block; background: transparent; }
        .upload-zone:hover, .upload-zone.has-file { border-color: rgba(196,158,90,0.5); background: rgba(255,255,255,0.03); }
        .upload-icon { font-size: 1.4rem; color: rgba(255,255,255,0.38); margin-bottom: 0.5rem; }
        .upload-name { font-size: 0.82rem; color: rgba(245,240,232,0.55); font-weight: 300; }
        .upload-success { font-size: 0.7rem; color: #ffffff; margin-top: 0.4rem; letter-spacing: 0.05em; }
        .upload-label-tag { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #ffffff; display: block; margin-bottom: 0.5rem; }

        /* ── Section divider ── */
        .step5-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.75rem 0 1.5rem;
        }
        .step5-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .step5-divider-text { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.4); white-space: nowrap; }

        /* ── Summary rows ── */
        .srow { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .srow:last-of-type { border-bottom: none; }
        .srow-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 0.25rem; }
        .srow-value { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 300; color: #f5f0e8; }
        .srow-value--muted { color: rgba(245,240,232,0.3); font-style: italic; }
        .srow-edit { font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.55); background: none; border: none; cursor: pointer; transition: color 0.2s; padding: 0.3rem 0; border-bottom: 1px solid transparent; }
        .srow-edit:hover { color: #ffffff; border-bottom-color: rgba(255,255,255,0.38); }

        /* ── CTA button ── */
        .bk-cta { width: 100%; padding: 1.1rem; background: transparent; border: 1px solid rgba(255,255,255,0.38); font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: #ffffff; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; margin-top: 1.5rem; }
        .bk-cta::before { content: ''; position: absolute; inset: 0; background: #ffffff; transform: translateX(-101%); transition: transform 0.35s cubic-bezier(.25,.46,.45,.94); }
        .bk-cta span { position: relative; z-index: 1; transition: color 0.3s ease; }
        .bk-cta:hover::before { transform: translateX(0); }
        .bk-cta:hover span { color: #0e0c09; }
        .bk-cta:disabled { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.18); cursor: not-allowed; }
        .bk-cta:disabled::before { display: none; }
        .bk-cta-count { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28); border-radius: 50%; font-size: 0.62rem; font-weight: 600; color: #ffffff; margin-left: 0.4rem; transition: all 0.2s; }

        /* ── Confirm ── */
        .confirm-wrap { text-align: center; padding: 1rem 0; }
        .confirm-icon { font-size: 2.5rem; margin-bottom: 1.2rem; }
        .confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 300; font-style: italic; color: #f5f0e8; margin-bottom: 0.5rem; }
        .confirm-sub { font-size: 0.82rem; font-weight: 300; color: rgba(245,240,232,0.4); margin-bottom: 2.5rem; letter-spacing: 0.03em; }
        .confirm-table { border: 1px solid rgba(255,255,255,0.12); margin: 0 0 2rem; text-align: left; }
        .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .confirm-row:last-child { border-bottom: none; }
        .confirm-key { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(196,158,90,0.5); }
        .confirm-val { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 300; color: #f5f0e8; }
        .bk-reset { background: none; border: 1px solid rgba(255,255,255,0.18); color: rgba(245,240,232,0.35); font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.75rem 1.8rem; cursor: pointer; transition: all 0.25s ease; }
        .bk-reset:hover { border-color: rgba(255,255,255,0.4); color: rgba(245,240,232,0.7); }

        .whatsapp-float { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: #ffffff; color: #0e0c09; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 1000; transition: transform 0.3s ease; }
        .whatsapp-float:hover { transform: scale(1.1); }

        @media (max-width: 600px) {
          .bk-body { padding: 2rem 1.25rem 1.5rem; }
          .cat-grid { grid-template-columns: 1fr; }
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

            {/* ── Step indicator ── */}
            <div className="bk-steps">
              {STEP_LABELS.map((label, i) => {
                const s = i + 1;
                const isActive = step === s;
                const isDone   = step > s;
                return (
                  <button
                    key={s}
                    className={`bk-step-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    onClick={() => isDone && goToStep(s)}
                  >
                    <span className="bk-step-num">{isDone ? '✓' : s}</span>
                    <span className="bk-step-name">{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bk-body">

              {/* ── STEP 1: pick categories ── */}
              {step === 1 && (
                <>
                  <p className="bk-step-title">What would you<br />like today?</p>
                  <div className="multi-hint">
                    <div className="multi-hint-icon"><div className="multi-hint-pulse" /></div>
                    You can select multiple services and book them together in one visit
                  </div>
                  <div className="cat-grid">
                    {[
                      { flag: wantsMani, set: setWantsMani, iconKey: 'Manicure', label: 'Manicure', desc: 'Gel, acrylics, extensions & nail art' },
                      { flag: wantsPedi, set: setWantsPedi, iconKey: 'Pedicure', label: 'Pedicure', desc: 'Spa, gel & toenail extensions' },
                      { flag: wantsSpa,  set: setWantsSpa,  iconKey: 'Spa',      label: 'Spa',      desc: 'Facials, body scrubs & skin treatments' },
                    ].map(({ flag, set, iconKey, label, desc }) => (
                      <button key={label} className={`cat-card ${flag ? 'cat-active' : ''}`} onClick={() => set(f => !f)}>
                        <div className="cat-card-top-bar" />
                        <div className="cat-card-inner">
                          <div className="cat-checkbox"><span className="cat-check-mark">✓</span></div>
                          <div className="cat-icon-wrap">{CAT_ICONS[iconKey]}</div>
                          <span className="cat-btn-label">{label}</span>
                          <span className="cat-btn-desc">{desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="cat-summary">
                    {!anySelected && <span className="cat-summary-label">Nothing selected yet</span>}
                    {wantsMani && <span className="cat-pill">Manicure<span className="cat-pill-x" onClick={e => { e.stopPropagation(); setWantsMani(false); }}>✕</span></span>}
                    {wantsPedi && <span className="cat-pill">Pedicure<span className="cat-pill-x" onClick={e => { e.stopPropagation(); setWantsPedi(false); }}>✕</span></span>}
                    {wantsSpa  && <span className="cat-pill">Spa<span className="cat-pill-x" onClick={e => { e.stopPropagation(); setWantsSpa(false); }}>✕</span></span>}
                  </div>
                  <button className="bk-cta" disabled={!anySelected} onClick={handleStep1Continue}>
                    <span>
                      {!anySelected ? 'Select a service to continue'
                        : editingFromReview ? 'Save & Return to Review →'
                        : [wantsMani, wantsPedi, wantsSpa].filter(Boolean).length === 1
                          ? 'Continue to Options →'
                          : `Continue with ${[wantsMani, wantsPedi, wantsSpa].filter(Boolean).length} services →`
                      }
                      {anySelected && <span className="bk-cta-count">{[wantsMani, wantsPedi, wantsSpa].filter(Boolean).length}</span>}
                    </span>
                  </button>
                </>
              )}

              {/* ── STEP 2: options per selected category ── */}
              {step === 2 && (
                <>
                  <p className="bk-step-title">Customize your<br />selection</p>
                  <p className="bk-step-hint">
                    {(returnToReviewAfterOptions || editingOptionsFromReview)
                      ? 'Make your changes — then save & return to review'
                      : 'Choose one option per selected service'}
                  </p>

                  {wantsMani && (
                    <div className="opt-section">
                      <div className="opt-section-header">
                        <span className="opt-section-icon">💅</span>
                        <span className="opt-section-title">Manicure</span>
                      </div>
                      <div className="opt-list">
                        {MANI_OPTIONS.map(o => (
                          <RadioCard key={o.id} label={o.label} desc={o.desc} price={o.price}
                            checked={maniOption === o.id} onChange={() => setManiOption(o.id)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {wantsPedi && (
                    <div className="opt-section">
                      <div className="opt-section-header">
                        <span className="opt-section-icon">🦶</span>
                        <span className="opt-section-title">Pedicure</span>
                      </div>
                      <div className="opt-list">
                        {PEDI_OPTIONS.map(o => (
                          <RadioCard key={o.id} label={o.label} desc={o.desc} price={o.price}
                            checked={pediOption === o.id} onChange={() => setPediOption(o.id)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {wantsSpa && (
                    <div className="opt-section">
                      <div className="opt-section-header">
                        <span className="opt-section-icon">✨</span>
                        <span className="opt-section-title">Spa Treatment</span>
                      </div>
                      <div className="opt-list">
                        {SPA_OPTIONS.map(o => (
                          <RadioCard key={o.id} label={o.label} desc={o.desc} price={o.price}
                            checked={spaOption === o.id} onChange={() => setSpaOption(o.id)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="bk-cta" onClick={handleStep2Continue} disabled={!canContinueOptions()}>
                    <span>
                      {(returnToReviewAfterOptions || editingOptionsFromReview)
                        ? 'Save & Return to Review →'
                        : 'Continue to Technician →'}
                    </span>
                  </button>
                </>
              )}

              {/* ── STEP 3: technician ── */}
              {step === 3 && (
                <>
                  <p className="bk-step-title">Select Technician</p>
                  <p className="bk-step-hint">Choose your preferred artist or select any available.</p>
                  <div className="opt-list">
                    {technicians.map((t) => (
                      <RadioCard key={t.id} label={t.name} desc={t.role}
                        checked={technician === t.id} onChange={() => setTechnician(t.id)} />
                    ))}
                  </div>
                  <button className="bk-cta" onClick={handleStep3Continue} disabled={!technician}>
                    <span>Continue to Schedule →</span>
                  </button>
                </>
              )}

              {/* ── STEP 4: date & time ── */}
              {step === 4 && (
                <>
                  <p className="bk-step-title">When shall we<br />expect you?</p>
                 <p className="bk-step-hint">
  {technician && technician !== 'any'
    ? `Showing availability for ${technicians.find(t => t.id === technician)?.name}`
    : `We're open every day, 7:00 AM – 6:00 PM`}
</p>
                  <div className="dt-grid">
                    <div className="dt-field">
                      <label>Date</label>
                      <input type="date" value={selectedDate} min={today} onChange={e => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="dt-field">
  <label>Time</label>

  <div className="dt-field-inner">
    <select
      value={selectedTime}
      onChange={(e) => setSelectedTime(e.target.value)}
    >
      <option value="" disabled>
        Select a time
      </option>

      {TIME_SLOTS.map((slot) => (
        <option key={slot.value} value={slot.value}>
          {slot.label}
        </option>
      ))}
    </select>
  </div>
</div>                  </div>
                  <button className="bk-cta" onClick={handleStep4Continue} disabled={!selectedDate || !selectedTime}>
                    <span>
                      {editingTechFromReview ? 'Save & Return to Review →' : 'Continue to Details →'}
                    </span>
                  </button>
                </>
              )}

              {/* ── STEP 5: contact + inspiration uploads (one per selected category) ── */}
              {step === 5 && (
                <>
                  <p className="bk-step-title">Your <em>Details</em></p>
                  <p className="bk-step-hint">Contact info</p>

                  {/* Contact info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '0.5rem' }}>
                    <div className="input-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="input-field">
                      <label>WhatsApp / Phone</label>
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                      />
                    </div>
                  </div>




                  <button className="bk-cta" onClick={advance} disabled={!isStep5Valid()}>
                    <span>Review Booking →</span>
                  </button>
                </>
              )}

              {/* ── STEP 6: review ── */}
              {step === 6 && (
                <>
                  <p className="bk-step-title">Review your<br />booking</p>
                  <p className="bk-step-hint">Click Edit on any row to make changes</p>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <SummaryRow label="Name" value={clientName} onEdit={() => setStep(5)} />
                    <SummaryRow label="Phone" value={clientPhone} onEdit={() => setStep(5)} />
                    <SummaryRow label="Services" value={serviceLabel}
                      onEdit={() => {
                        setEditingFromReview(true);
                        setServicesAtEditStart({ mani: wantsMani, pedi: wantsPedi, spa: wantsSpa });
                        setStep(1);
                      }}
                    />
                    {maniLabel && <SummaryRow label="Manicure" value={maniLabel} onEdit={() => { setEditingOptionsFromReview(true); setStep(2); }} />}
                    {pediLabel && <SummaryRow label="Pedicure" value={pediLabel} onEdit={() => { setEditingOptionsFromReview(true); setStep(2); }} />}
                    {spaLabel  && <SummaryRow label="Spa"      value={spaLabel}  onEdit={() => { setEditingOptionsFromReview(true); setStep(2); }} />}
                    <SummaryRow label="Technician" value={technicians.find(t => t.id === technician)?.name || '—'}
                      onEdit={() => { setEditingTechFromReview(true); setStep(3); }}
                    />
                    <SummaryRow label="Date & Time"
                      value={selectedDate && selectedTime ? `${formatDate(selectedDate)} · ${selectedTime}` : '—'}
                      onEdit={() => { setEditingTechFromReview(true); setStep(4); }}
                    />

                  </div>
                  <button className="bk-cta" onClick={handleBookingSubmit}>
                    <span>Confirm & Submit Booking ✦</span>
                  </button>
                </>
              )}

            </div>
          </div>
        )}

        {/* ── STEP 7: confirmation ── */}
        {step === 7 && (
          <div className="bk-card">
            <div className="bk-body">
              <div className="confirm-wrap">
                <div className="confirm-icon">🌸</div>
                <p className="confirm-title">You're all set</p>
                <p className="confirm-sub">We'll be in touch shortly to confirm your appointment</p>
                <div className="confirm-table">
                  <div className="confirm-row"><span className="confirm-key">Name</span><span className="confirm-val">{clientName}</span></div>
                  <div className="confirm-row"><span className="confirm-key">Phone</span><span className="confirm-val">{clientPhone}</span></div>
                  <div className="confirm-row"><span className="confirm-key">Services</span><span className="confirm-val">{serviceLabel}</span></div>
                  {maniLabel && <div className="confirm-row"><span className="confirm-key">Manicure</span><span className="confirm-val">{maniLabel}</span></div>}
                  {pediLabel && <div className="confirm-row"><span className="confirm-key">Pedicure</span><span className="confirm-val">{pediLabel}</span></div>}
                  {spaLabel  && <div className="confirm-row"><span className="confirm-key">Spa</span><span className="confirm-val">{spaLabel}</span></div>}
                  {technician && <div className="confirm-row"><span className="confirm-key">Technician</span><span className="confirm-val">{technicians.find(t => t.id === technician)?.name}</span></div>}
                  <div className="confirm-row"><span className="confirm-key">Date</span><span className="confirm-val">{formatDate(selectedDate)}</span></div>
                  <div className="confirm-row"><span className="confirm-key">Time</span><span className="confirm-val">{selectedTime}</span></div>

                </div>
                <button className="bk-reset" onClick={reset}>Book Another Appointment</button>
              </div>
            </div>
          </div>
        )}

      </section>

      <a href="https://wa.me/+254745557460" className="whatsapp-float" target="_blank" rel="noreferrer">
        <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </>
  );
}