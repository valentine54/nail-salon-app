import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TODAY = new Date().toISOString().split('T')[0];
const p = n => String(n).padStart(2, '0');
const dateStr = offset => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().split('T')[0]; };

// ── DUMMY DATA ────────────────────────────────────────────────────
const DUMMY_APPTS = [
  { id:'a1', client_name:'Natalie Owuor',  service_type:'Medium Acrylics',       date:TODAY,      start_time:'09:00',end_time:'10:30',status:'booked',     client_phone:'+254700111222',notes:'Coffin shape. Allergic to acetone.' },
  { id:'a2', client_name:'Diana Chebet',   service_type:'Spa Pedicure & Gel',    date:TODAY,      start_time:'11:00',end_time:'12:30',status:'booked',     client_phone:'+254700555666',notes:'Returning client. Warm foot soak.' },
  { id:'a3', client_name:'Lunch Break',    service_type:'',                      date:TODAY,      start_time:'12:30',end_time:'13:30',status:'lunch',      client_phone:'',notes:'' },
  { id:'a4', client_name:'Zara Kimani',    service_type:'Hard Reset Facial',     date:TODAY,      start_time:'14:00',end_time:'15:30',status:'booked',     client_phone:'+254711000111',notes:'First facial.' },
  { id:'a5', client_name:'Cleo Achieng',   service_type:'Overlays + Nail Art',   date:TODAY,      start_time:'15:30',end_time:'17:00',status:'booked',     client_phone:'+254711666777',notes:'Floral design inspo.' },
  { id:'a6', client_name:'Aisha Muthoni',  service_type:'Balance & Glow Facial', date:dateStr(1), start_time:'10:00',end_time:'11:30',status:'booked',     client_phone:'+254722111222',notes:'' },
  { id:'a7', client_name:'Karen Waweru',   service_type:'Short Acrylics',       date:dateStr(1), start_time:'12:00',end_time:'13:00',status:'booked',     client_phone:'+254722333444',notes:'' },
  { id:'a8', client_name:'Priya Mehta',    service_type:'Classic Manicure',      date:TODAY,      start_time:'10:00',end_time:'10:45',status:'completed',  client_phone:'+254711222333',notes:'Cancelled - rescheduled.' },
];

const STATUS_CFG = {
  booked:      { label:'Booked',      color:'#c49e5a', bg:'rgba(196,158,90,0.13)'  },
  completed:   { label:'Done',        color:'#8ab88a', bg:'rgba(138,184,138,0.12)' },
  cancelled:   { label:'Cancelled',   color:'#d46060', bg:'rgba(212,96,96,0.1)'    },
  break:       { label:'Break',       color:'#a09060', bg:'rgba(160,144,96,0.1)'   },
  lunch:       { label:'Lunch',       color:'#c07030', bg:'rgba(192,112,48,0.1)'   },
  unavailable: { label:'Unavailable', color:'#606060', bg:'rgba(96,96,96,0.1)'     },
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const PX_PER_MIN = 720 / (12 * 60);

const parseMin = t => { if(!t) return 0; const [h,m]=t.split(':').map(Number); return h*60+m; };
const fmtTime = t => { if(!t) return ''; const [h,m]=t.split(':').map(Number); return `${h%12||12}:${p(m)} ${h<12?'am':'pm'}`; };
const fmtDate = d => {
  if(!d) return ''; if(d===TODAY) return 'Today';
  if(d===dateStr(1)) return 'Tomorrow';
  return new Date(d+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
};
const initials = n => n?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'??';

export default function TechDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  // ── USE DUMMY DATA ──
  const [appts, setAppts] = useState(DUMMY_APPTS);

  const [viewDate, setViewDate] = useState(TODAY);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showEditAppt, setShowEditAppt] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newSlot, setNewSlot] = useState({ client_name:'', service_type:'', date:TODAY, start_time:'', end_time:'', status:'booked' });
  const [toast, setToast] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [clock, setClock] = useState(new Date());
  const menuRef = useRef(null);
  const toastRef = useRef(null);

  if (!user.id) { navigate('/login'); return null; }

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 30000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const notify = (msg) => {
    clearTimeout(toastRef.current);
    setToast(msg);
    toastRef.current = setTimeout(() => setToast(null), 2500);
  };

  const shiftDate = d => {
    const nd = new Date(viewDate + 'T00:00:00');
    nd.setDate(nd.getDate() + d);
    setViewDate(nd.toISOString().split('T')[0]);
  };

  const dayAppts = appts.filter(a => a.date === viewDate).sort((a,b) => (a.start_time||'').localeCompare(b.start_time||''));

  const stats = {
    today: appts.filter(a => a.date===TODAY && !['break','lunch','unavailable'].includes(a.status)).length,
    completed: appts.filter(a => a.date===TODAY && a.status==='completed').length,
    upcoming: appts.filter(a => a.date>TODAY).length,
  };

  const nextAppt = dayAppts.find(a => a.status==='booked' && (a.start_time||'') > new Date().toTimeString().slice(0,5));

  // ── UPDATE STATUS ──
  const updateStatus = (id, status) => {
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedAppt?.id === id) setSelectedAppt(p => ({...p, status}));
    notify(`Status → ${STATUS_CFG[status]?.label}`);
  };

  // ── SAVE EDIT ──
  const saveEdit = () => {
    setAppts(prev => prev.map(a => a.id === editForm.id ? { ...a, ...editForm } : a));
    if (selectedAppt?.id === editForm.id) setSelectedAppt(p => ({...p, ...editForm}));
    setShowEditAppt(false);
    notify('Appointment updated ✦');
  };

  // ── ADD NEW SLOT (Break, Lunch, Unavailable) ──
  const addSlot = () => {
    if (!newSlot.start_time || !newSlot.end_time) return;
    const slot = {
      id: `s${Date.now()}`,
      client_name: newSlot.status === 'break' ? 'Break' : newSlot.status === 'lunch' ? 'Lunch' : 'Unavailable',
      service_type: '',
      date: newSlot.date,
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      status: newSlot.status,
      client_phone: '',
      notes: ''
    };
    setAppts(prev => [...prev, slot]);
    setShowAddSlot(false);
    setNewSlot({ client_name:'', service_type:'', date:TODAY, start_time:'', end_time:'', status:'break' });
    notify('Time slot added ✦');
  };

  // ── DELETE APPOINTMENT ──
  const deleteAppt = (id) => {
    setAppts(prev => prev.filter(a => a.id !== id));
    setSelectedAppt(null);
    notify('Appointment removed');
  };

  const sendWhatsApp = (appt) => {
    const phone = appt.client_phone || '';
    const msg = `Hi ${appt.client_name}, this is ${user.first_name} from Finer Nails Spa. Looking forward to your ${appt.service_type} on ${fmtDate(appt.date)} at ${(appt.start_time||'').slice(0,5)}! ✨`;
    window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#080604;--bg2:#0c0a07;--bg3:#111009;--bd:rgba(196,158,90,0.12);--gold:#c49e5a;--gdim:rgba(196,158,90,0.42);--text:#f5f0e8;--tdim:rgba(245,240,232,0.38);--tghost:rgba(245,240,232,0.16);--red:#d46060;--serif:'Cormorant Garamond',serif;--sans:'Jost',sans-serif}
        .td{min-height:100vh;background:var(--bg);color:var(--text);font-family:var(--sans);display:flex;flex-direction:column}
        .td-top{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;background:var(--bg2);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100}
        .td-logo{font-family:var(--serif);font-size:1.1rem;font-weight:300}.td-logo em{font-style:italic;color:var(--gold)}
        .td-tr{display:flex;align-items:center;gap:0.75rem}
        .td-clock{font-family:var(--serif);font-size:1.1rem;font-weight:300;color:var(--gdim)}
        .td-me{font-size:0.75rem;color:var(--tdim)}.td-me strong{color:var(--text)}
        .td-ubtn{display:flex;align-items:center;gap:0.5rem;cursor:pointer;padding:0.2rem 0.4rem;border:1px solid transparent;transition:all 0.2s;position:relative}
        .td-ubtn:hover,.td-ubtn.open{background:rgba(196,158,90,0.08);border-color:rgba(196,158,90,0.22)}
        .td-av{width:32px;height:32px;border-radius:50%;background:rgba(196,158,90,0.12);border:1.5px solid rgba(196,158,90,0.4);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:0.8rem;color:var(--gold)}
        .td-caret{font-size:0.45rem;color:var(--gdim)}.td-ubtn.open .td-caret{transform:rotate(180deg)}
        .td-udrop{position:absolute;top:calc(100% + 8px);right:0;min-width:160px;background:#1a1610;border:1px solid rgba(196,158,90,0.22);z-index:500;animation:dropIn 0.18s ease}
        @keyframes dropIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
        .td-udrop-btn{width:100%;padding:0.7rem 1rem;background:transparent;border:none;font-family:var(--sans);font-size:0.62rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;text-align:left;cursor:pointer;color:rgba(212,96,96,0.7)}
        .td-udrop-btn:hover{background:rgba(212,96,96,0.07);color:var(--red)}
        .td-body{display:flex;flex:1;overflow:hidden}
        .td-side{width:250px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--bd);display:flex;flex-direction:column;padding:1rem;gap:0.8rem;position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto}
        .td-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px}
        .td-stat{background:rgba(196,158,90,0.04);border:1px solid rgba(196,158,90,0.08);padding:0.5rem;text-align:center;border-radius:4px}
        .td-stat-lbl{font-size:0.42rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(196,158,90,0.4);margin-bottom:2px}
        .td-stat-val{font-family:var(--serif);font-size:1.1rem;font-weight:300;color:var(--gold)}
        .td-next{background:rgba(196,158,90,0.05);border-left:3px solid var(--gold);padding:0.5rem 0.7rem;border-radius:0 4px 4px 0}
        .td-next-lbl{font-size:0.38rem;color:var(--gold);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:2px}
        .td-next-name{font-weight:600;font-size:0.7rem}
        .td-next-svc{font-size:0.55rem;color:var(--tdim)}
        .td-next-time{font-family:var(--serif);color:var(--gold);font-size:0.62rem;margin-top:2px}
        .td-qlist{flex:1;overflow:auto}
        .td-qlbl{font-size:0.4rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(196,158,90,0.3);margin-bottom:5px}
        .td-qi{display:flex;align-items:center;gap:5px;padding:0.3rem 0.35rem;cursor:pointer;border-left:2px solid transparent;margin-bottom:1px;transition:all 0.1s;border-radius:2px}
        .td-qi:hover{background:rgba(196,158,90,0.03)}.td-qi.sel{background:rgba(196,158,90,0.05);border-left-color:var(--gold)}
        .td-qi-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .td-qi-time{font-family:var(--serif);font-size:0.58rem;color:var(--gdim);min-width:38px}
        .td-qi-svc{font-size:0.58rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .td-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .td-bar{display:flex;align-items:center;gap:0.6rem;padding:0.6rem 1.2rem;border-bottom:1px solid var(--bd);flex-shrink:0;flex-wrap:wrap}
        .td-arr{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:rgba(196,158,90,0.05);border:1px solid rgba(196,158,90,0.15);color:var(--gold);cursor:pointer;font-size:0.7rem}
        .td-arr:hover{background:rgba(196,158,90,0.12)}
        .td-dlbl{font-family:var(--serif);font-size:1rem;font-weight:300}
        .td-today-btn{height:26px;padding:0 0.5rem;background:transparent;border:1px solid rgba(196,158,90,0.15);font-family:var(--sans);font-size:0.48rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(196,158,90,0.5);cursor:pointer}
        .td-today-btn:hover{border-color:rgba(196,158,90,0.4);color:var(--gold)}
        .td-add-btn{margin-left:auto;padding:0.35rem 0.7rem;background:transparent;border:1px solid rgba(196,158,90,0.3);font-family:var(--sans);font-size:0.5rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);cursor:pointer;border-radius:2px}
        .td-add-btn:hover{background:rgba(196,158,90,0.08)}
        .td-tl-wrap{flex:1;overflow:auto;padding:0.8rem 1.2rem}
        .td-tl-row{position:relative;min-height:720px;padding-left:40px}
        .td-tl-hr{position:absolute;left:0;font-size:0.46rem;color:rgba(245,240,232,0.12);width:34px;text-align:right;padding-right:5px;transform:translateY(-50%)}
        .td-tl-line{position:absolute;left:40px;right:0;height:1px;background:rgba(196,158,90,0.03)}
        .td-now{position:absolute;left:40px;right:0;height:2px;background:rgba(212,96,96,0.45);z-index:5;pointer-events:none}
        .td-now::before{content:'';position:absolute;left:-4px;top:-3px;width:8px;height:8px;border-radius:50%;background:rgba(212,96,96,0.7)}
        .td-blk{position:absolute;left:46px;right:10px;border-radius:3px;padding:4px 7px;cursor:pointer;overflow:hidden;transition:filter 0.12s;border-left:3px solid}
        .td-blk:hover{filter:brightness(1.18);z-index:10!important}
        .td-blk-client{font-size:0.58rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .td-blk-svc{font-size:0.5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0.5;margin-top:1px}
        .td-blk-time{font-size:0.45rem;opacity:0.35;margin-top:2px}
        .td-empty{display:flex;align-items:center;justify-content:center;height:100%;color:rgba(245,240,232,0.08);font-size:1.2rem}
        .td-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200;display:flex;justify-content:flex-end}
        .td-panel{width:400px;height:100vh;background:var(--bg3);border-left:1px solid var(--bd);overflow:auto;animation:slideIn 0.2s ease;padding:1.5rem}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .td-pclient{font-family:var(--serif);font-size:1.5rem;font-weight:300;margin-bottom:0.2rem}
        .td-psvc{font-size:0.65rem;color:var(--tdim);margin-bottom:1rem}
        .td-prow{display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid rgba(196,158,90,0.04);font-size:0.68rem}
        .td-plbl{color:rgba(196,158,90,0.4);text-transform:uppercase;font-size:0.5rem;letter-spacing:0.1em}
        .td-sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:1rem}
        .td-sbtn{padding:0.4rem;background:transparent;border:1px solid rgba(196,158,90,0.1);font-family:var(--sans);font-size:0.48rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(245,240,232,0.3);cursor:pointer;text-align:center;transition:all 0.12s;border-radius:2px}
        .td-sbtn:hover{border-color:rgba(196,158,90,0.3);color:rgba(245,240,232,0.6)}
        .td-sbtn.sel{border-color:var(--sc);background:var(--sb);color:var(--sc)}
        .td-btn{width:100%;padding:0.6rem;background:transparent;border:1px solid rgba(196,158,90,0.15);font-family:var(--sans);font-size:0.55rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(196,158,90,0.5);cursor:pointer;margin-top:0.4rem;transition:all 0.12s;border-radius:2px}
        .td-btn:hover{border-color:rgba(196,158,90,0.35);color:var(--gold);background:rgba(196,158,90,0.04)}
        .td-btn.wa{background:#25D366;border-color:#25D366;color:white}.td-btn.wa:hover{background:#20bd5a}
        .td-btn.danger{border-color:rgba(212,96,96,0.2);color:rgba(212,96,96,0.5)}.td-btn.danger:hover{border-color:rgba(212,96,96,0.4);color:var(--red);background:rgba(212,96,96,0.04)}
        .td-btn.gold{background:var(--gold);border-color:var(--gold);color:var(--bg)}.td-btn.gold:hover{background:#d4ae6a}
        .td-modal{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:300;display:flex;align-items:center;justify-content:center}
        .td-mbox{background:var(--bg3);border:1px solid rgba(196,158,90,0.2);padding:1.2rem;width:380px;border-radius:4px;max-height:90vh;overflow:auto}
        .td-mtitle{font-family:var(--serif);font-size:1.1rem;margin-bottom:0.8rem}
        .td-field{margin-bottom:0.5rem}
        .td-field label{font-size:0.45rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(196,158,90,0.45);display:block;margin-bottom:2px}
        .td-field input,.td-field select{width:100%;padding:0.45rem;background:rgba(255,255,255,0.03);border:1px solid rgba(196,158,90,0.12);color:var(--text);font-family:var(--sans);font-size:0.72rem;outline:none;border-radius:2px}
        .td-field select{color-scheme:dark}.td-field select option{background:var(--bg3)}
        .td-frow{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem}
        .td-mactions{display:flex;gap:6px;margin-top:0.8rem}
        .td-save{flex:1;padding:0.55rem;background:var(--gold);border:none;font-family:var(--sans);font-size:0.55rem;font-weight:700;text-transform:uppercase;color:var(--bg);cursor:pointer;border-radius:2px}
        .td-cancel{flex:1;padding:0.55rem;background:transparent;border:1px solid rgba(196,158,90,0.15);font-family:var(--sans);font-size:0.55rem;text-transform:uppercase;color:rgba(245,240,232,0.35);cursor:pointer;border-radius:2px}
        .td-toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:500;background:#1a1610;border:1px solid rgba(196,158,90,0.25);border-left:3px solid var(--gold);padding:0.7rem 1rem;font-size:0.68rem;animation:tIn 0.2s ease}
        @keyframes tIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){.td-side{display:none}}
      `}</style>

      <div className="td">
        {/* TOPBAR */}
        <div className="td-top">
          <div className="td-logo">Finer Nails <em>&</em> Spa</div>
          <div className="td-tr">
            <div className="td-clock">{clock.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
            <div className="td-me"><strong>{user.first_name}</strong> · {user.role}</div>
            <div className="td-ubtn" style={{position:'relative'}} ref={menuRef}>
              <div className={`td-ubtn ${showUserMenu?'open':''}`} onClick={()=>setShowUserMenu(v=>!v)}>
                <div className="td-av">{initials(user.first_name)}</div><span className="td-caret">▾</span>
              </div>
              {showUserMenu&&<div className="td-udrop"><button className="td-udrop-btn" onClick={handleLogout}>Sign Out</button></div>}
            </div>
          </div>
        </div>

        <div className="td-body">
          {/* SIDEBAR */}
          <div className="td-side">
            <div className="td-stats">
              {[{l:'Today',v:stats.today},{l:'Done',v:stats.completed},{l:'Upcoming',v:stats.upcoming}].map(s=>(<div key={s.l} className="td-stat"><div className="td-stat-lbl">{s.l}</div><div className="td-stat-val">{s.v}</div></div>))}
            </div>
            {nextAppt&&(<div className="td-next"><div className="td-next-lbl">Next Up</div><div className="td-next-name">{nextAppt.client_name}</div><div className="td-next-svc">{nextAppt.service_type}</div><div className="td-next-time">{(nextAppt.start_time||'').slice(0,5)}</div></div>)}
            <div className="td-qlist">
              <div className="td-qlbl">{fmtDate(viewDate)} · {dayAppts.length} appts</div>
              {dayAppts.map(a=>(<div key={a.id} className={`td-qi ${selectedAppt?.id===a.id?'sel':''}`} onClick={()=>setSelectedAppt(a)}><div className="td-qi-dot" style={{background:STATUS_CFG[a.status]?.color||'#c49e5a'}}/><div className="td-qi-time">{(a.start_time||'').slice(0,5)}</div><div className="td-qi-svc">{a.service_type?.split(' - ')[0]||a.service_type||a.client_name}</div></div>))}
            </div>
            <button className="td-btn danger" onClick={handleLogout}>Sign Out</button>
          </div>

          {/* MAIN */}
          <div className="td-main">
            <div className="td-bar">
              <button className="td-arr" onClick={()=>shiftDate(-1)}>←</button>
              <div className="td-dlbl">{fmtDate(viewDate)}</div>
              <button className="td-arr" onClick={()=>shiftDate(1)}>→</button>
              {viewDate!==TODAY&&<button className="td-today-btn" onClick={()=>setViewDate(TODAY)}>Today</button>}
              <button className="td-add-btn" onClick={()=>{setNewSlot({client_name:'',service_type:'',date:viewDate,start_time:'',end_time:'',status:'break'});setShowAddSlot(true);}}>+ Add Block</button>
            </div>
            <div className="td-tl-wrap">
              {dayAppts.length===0?<div className="td-empty">🌸 No appointments</div>:(
                <div className="td-tl-row">
                  {HOURS.map(h=>{const top=(h-8)*60*PX_PER_MIN;return(<div key={h}><div className="td-tl-hr" style={{top}}>{h<12?`${h}am`:h===12?'12pm':`${h-12}pm`}</div><div className="td-tl-line" style={{top}}/></div>);})}
                  {viewDate===TODAY&&<div className="td-now" style={{top:(new Date().getHours()*60+new Date().getMinutes()-8*60)*PX_PER_MIN}}/>}
                  {dayAppts.map(a=>{const sm=parseMin(a.start_time)-8*60;const em=parseMin(a.end_time)-8*60;const ht=Math.max((em-sm)*PX_PER_MIN,24);const cfg=STATUS_CFG[a.status]||STATUS_CFG.booked;const isBlk=['break','lunch','unavailable'].includes(a.status);return(<div key={a.id} className="td-blk" style={{top:sm*PX_PER_MIN,height:ht,background:isBlk?cfg.bg:`${cfg.color}10`,borderLeftColor:cfg.color}} onClick={()=>setSelectedAppt(a)}><div className="td-blk-client" style={{color:cfg.color}}>{a.client_name}</div>{ht>30&&!isBlk&&<div className="td-blk-svc">{a.service_type}</div>}{ht>45&&<div className="td-blk-time">{fmtTime(a.start_time)} – {fmtTime(a.end_time)}</div>}</div>);})}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DETAIL PANEL */}
        {selectedAppt&&(()=>{const cfg=STATUS_CFG[selectedAppt.status]||STATUS_CFG.booked;const dur=parseMin(selectedAppt.end_time)-parseMin(selectedAppt.start_time);const isBlk=['break','lunch','unavailable'].includes(selectedAppt.status);return(<div className="td-overlay" onClick={()=>setSelectedAppt(null)}><div className="td-panel" onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}><div><div className="td-pclient">{selectedAppt.client_name}</div><div className="td-psvc">{selectedAppt.service_type}</div></div><button onClick={()=>setSelectedAppt(null)} style={{background:'none',border:'1px solid rgba(196,158,90,0.15)',color:'rgba(245,240,232,0.3)',width:26,height:26,cursor:'pointer',fontSize:'0.7rem',borderRadius:2}}>✕</button></div>{[{l:'Date',v:fmtDate(selectedAppt.date)},{l:'Time',v:`${fmtTime(selectedAppt.start_time)} – ${fmtTime(selectedAppt.end_time)}`},{l:'Duration',v:`${dur} min`},{l:'Phone',v:selectedAppt.client_phone||'—'}].map(({l,v})=>(<div key={l} className="td-prow"><span className="td-plbl">{l}</span><span>{v}</span></div>))}{!isBlk&&<div className="td-sgrid">{Object.entries(STATUS_CFG).filter(([k])=>!['break','lunch','unavailable'].includes(k)).map(([k,c])=>(<button key={k} className={`td-sbtn ${selectedAppt.status===k?'sel':''}`} style={{'--sc':c.color,'--sb':c.bg}} onClick={()=>updateStatus(selectedAppt.id,k)}>{c.label}</button>))}</div>}{(selectedAppt.client_phone)&&<button className="td-btn wa" onClick={()=>sendWhatsApp(selectedAppt)}>💬 WhatsApp</button>}<button className="td-btn" onClick={()=>{setEditForm({...selectedAppt});setShowEditAppt(true);}}>✎ Edit</button><button className="td-btn danger" onClick={()=>deleteAppt(selectedAppt.id)}>🗑 Delete</button></div></div>);})()}

        {/* EDIT MODAL */}
        {showEditAppt&&(<div className="td-modal" onClick={()=>setShowEditAppt(false)}><div className="td-mbox" onClick={e=>e.stopPropagation()}><div className="td-mtitle">Edit Appointment</div><div className="td-field"><label>Client</label><input value={editForm.client_name||''} onChange={e=>setEditForm(f=>({...f,client_name:e.target.value}))}/></div><div className="td-field"><label>Service</label><input value={editForm.service_type||''} onChange={e=>setEditForm(f=>({...f,service_type:e.target.value}))}/></div><div className="td-field"><label>Date</label><input type="date" value={editForm.date||''} onChange={e=>setEditForm(f=>({...f,date:e.target.value}))}/></div><div className="td-frow"><div className="td-field"><label>Start</label><input type="time" value={editForm.start_time||''} onChange={e=>setEditForm(f=>({...f,start_time:e.target.value}))}/></div><div className="td-field"><label>End</label><input type="time" value={editForm.end_time||''} onChange={e=>setEditForm(f=>({...f,end_time:e.target.value}))}/></div></div><div className="td-field"><label>Status</label><select value={editForm.status||'booked'} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))}>{Object.entries(STATUS_CFG).map(([k,v])=>(<option key={k} value={k}>{v.label}</option>))}</select></div><div className="td-field"><label>Phone</label><input value={editForm.client_phone||''} onChange={e=>setEditForm(f=>({...f,client_phone:e.target.value}))}/></div><div className="td-mactions"><button className="td-cancel" onClick={()=>setShowEditAppt(false)}>Cancel</button><button className="td-save" onClick={saveEdit}>Save</button></div></div></div>)}

        {/* ADD SLOT MODAL */}
        {showAddSlot&&(<div className="td-modal" onClick={()=>setShowAddSlot(false)}><div className="td-mbox" onClick={e=>e.stopPropagation()}><div className="td-mtitle">Add Time Block</div><div className="td-field"><label>Type</label><select value={newSlot.status} onChange={e=>setNewSlot(f=>({...f,status:e.target.value}))}><option value="break">Break</option><option value="lunch">Lunch</option><option value="unavailable">Unavailable</option></select></div><div className="td-field"><label>Date</label><input type="date" value={newSlot.date} onChange={e=>setNewSlot(f=>({...f,date:e.target.value}))}/></div><div className="td-frow"><div className="td-field"><label>Start</label><input type="time" value={newSlot.start_time} onChange={e=>setNewSlot(f=>({...f,start_time:e.target.value}))}/></div><div className="td-field"><label>End</label><input type="time" value={newSlot.end_time} onChange={e=>setNewSlot(f=>({...f,end_time:e.target.value}))}/></div></div><div className="td-mactions"><button className="td-cancel" onClick={()=>setShowAddSlot(false)}>Cancel</button><button className="td-save" onClick={addSlot}>Add</button></div></div></div>)}

        {toast&&<div className="td-toast">{toast}</div>}
      </div>
    </>
  );
}