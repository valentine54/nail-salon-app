import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Dummy Data ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];
const p = n => String(n).padStart(2, '0');
const dateStr = offset => {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const DUMMY_TECHS = [
  { id: 't1', name: 'Amara Wanjiku', role: 'Senior Nail Tech',   email: 'amara@finernails.co.ke',  color: '#c49e5a', active: true  },
  { id: 't2', name: 'Leila Hassan',  role: 'Acrylic Specialist', email: 'leila@finernails.co.ke',  color: '#7eb8c8', active: true  },
  { id: 't3', name: 'Brenda Otieno', role: 'Gel & Extensions',   email: 'brenda@finernails.co.ke', color: '#c87890', active: true  },
  { id: 't4', name: 'Joy Kamau',     role: 'Spa & Facial',       email: 'joy@finernails.co.ke',    color: '#78b878', active: false },
];

const DUMMY_APPTS = [
  { id:'a1',  tech_id:'t1', client:'Natalie Owuor',   service:'Medium Acrylics + Gel X',       date:TODAY,      start:'09:00',end:'10:30',status:'booked',     phone:'+254700111222',notes:'Prefers coffin shape. Allergic to acetone.' },
  { id:'a2',  tech_id:'t2', client:'Sarah Mwangi',    service:'Reinforced Gel Polish',          date:TODAY,      start:'09:30',end:'10:15',status:'completed',  phone:'+254700333444',notes:'' },
  { id:'a3',  tech_id:'t1', client:'Diana Chebet',    service:'Spa Pedicure & Gel',             date:TODAY,      start:'11:00',end:'12:30',status:'booked',     phone:'+254700555666',notes:'Returning client. Prefers warm foot soak.' },
  { id:'a4',  tech_id:'t3', client:'Grace Njeri',     service:'Lemon Jelly Pedi & Gel',         date:TODAY,      start:'10:00',end:'11:00',status:'booked',     phone:'+254700777888',notes:'' },
  { id:'a5',  tech_id:'t1', client:'Lunch',           service:'',                               date:TODAY,      start:'12:30',end:'13:30',status:'lunch',      phone:'',             notes:'' },
  { id:'a6',  tech_id:'t2', client:'Monica Adhiambo', service:'Xtra Long Acrylics',             date:TODAY,      start:'11:00',end:'13:00',status:'booked',     phone:'+254700999000',notes:'Bring inspo ref from her last visit.' },
  { id:'a7',  tech_id:'t3', client:'Break',           service:'',                               date:TODAY,      start:'12:00',end:'12:30',status:'break',      phone:'',             notes:'' },
  { id:'a8',  tech_id:'t1', client:'Zara Kimani',     service:'Hard Reset Facial',              date:TODAY,      start:'14:00',end:'15:30',status:'booked',     phone:'+254711000111',notes:'First-time facial client.' },
  { id:'a9',  tech_id:'t2', client:'Priya Mehta',     service:'Classic Manicure',               date:TODAY,      start:'14:00',end:'14:45',status:'cancelled',  phone:'+254711222333',notes:'Cancelled – rescheduling next week.' },
  { id:'a10', tech_id:'t3', client:'Faith Wambui',    service:'Gel X Extensions',               date:TODAY,      start:'13:00',end:'14:30',status:'booked',     phone:'+254711444555',notes:'' },
  { id:'a11', tech_id:'t1', client:'Cleo Achieng',    service:'Overlays + Nail Art',            date:TODAY,      start:'15:30',end:'17:00',status:'booked',     phone:'+254711666777',notes:'Has inspo image – floral design.' },
  { id:'a12', tech_id:'t2', client:'Unavailable',     service:'',                               date:TODAY,      start:'16:00',end:'18:00',status:'unavailable',phone:'',             notes:'Personal appointment.' },
  { id:'b1',  tech_id:'t1', client:'Aisha Muthoni',   service:'Balance & Glow Facial',          date:dateStr(1), start:'10:00',end:'11:30',status:'booked',     phone:'+254722111222',notes:'' },
  { id:'b2',  tech_id:'t2', client:'Karen Waweru',    service:'Short Acrylic Extensions',       date:dateStr(1), start:'09:00',end:'10:30',status:'booked',     phone:'+254722333444',notes:'' },
  { id:'b3',  tech_id:'t3', client:'Ivy Ouma',        service:'Spa Manicure',                   date:dateStr(1), start:'11:00',end:'12:00',status:'booked',     phone:'+254722555666',notes:'' },
];

const STATUS_CFG = {
  booked:      { label:'Booked',      color:'#c49e5a', bg:'rgba(196,158,90,0.13)'  },
  completed:   { label:'Completed',   color:'#8ab88a', bg:'rgba(138,184,138,0.12)' },
  cancelled:   { label:'Cancelled',   color:'#d46060', bg:'rgba(212,96,96,0.1)'    },
  break:       { label:'Break',       color:'#a09060', bg:'rgba(160,144,96,0.1)'   },
  lunch:       { label:'Lunch',       color:'#c07030', bg:'rgba(192,112,48,0.1)'   },
  unavailable: { label:'Unavailable', color:'#606060', bg:'rgba(96,96,96,0.1)'     },
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const PX_PER_MIN = 720 / (12 * 60);

function parseMin(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${p(m)} ${h < 12 ? 'am' : 'pm'}`;
}
function fmtDate(d) {
  if (!d) return '';
  if (d === TODAY) return 'Today';
  if (d === dateStr(1)) return 'Tomorrow';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
}
function initials(name) {
  return name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [techs, setTechs] = useState(DUMMY_TECHS);
  const [appts, setAppts] = useState(DUMMY_APPTS);
  const [viewDate, setViewDate] = useState(TODAY);
  const [view, setView] = useState('timeline');
  const [filterTech, setFilterTech] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showAddTech, setShowAddTech] = useState(false);
  const [showEditAppt, setShowEditAppt] = useState(false);
  const [showEditPwd, setShowEditPwd] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [inviteForm, setInviteForm] = useState({ name:'', email:'', role:'' });
  const [inviteSent, setInviteSent] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [toast, setToast] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [clock, setClock] = useState(new Date());
  const menuRef = useRef(null);
  const toastRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const notify = (msg, type = 'ok') => {
    clearTimeout(toastRef.current);
    setToast({ msg, type });
    toastRef.current = setTimeout(() => setToast(null), 2800);
  };

  const shiftDate = d => {
    const nd = new Date(viewDate + 'T00:00:00');
    nd.setDate(nd.getDate() + d);
    setViewDate(nd.toISOString().split('T')[0]);
  };

  const dayAppts = appts
    .filter(a => a.date === viewDate && (filterTech === 'all' || a.tech_id === filterTech))
    .sort((a, b) => a.start.localeCompare(b.start));

  const updateStatus = (id, status) => {
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedAppt?.id === id) setSelectedAppt(p => ({ ...p, status }));
    notify(`Status → ${STATUS_CFG[status]?.label}`);
  };

  const saveEdit = () => {
    setAppts(prev => prev.map(a => a.id === editForm.id ? { ...a, ...editForm } : a));
    if (selectedAppt?.id === editForm.id) setSelectedAppt(p => ({ ...p, ...editForm }));
    setShowEditAppt(false);
    notify('Appointment updated ✦');
  };

  const doInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return;
    setTechs(prev => [...prev, {
      id: `t${Date.now()}`, name: inviteForm.name,
      role: inviteForm.role || 'Nail Technician',
      email: inviteForm.email,
      color: ['#c49e5a','#7eb8c8','#c87890','#78b878','#b090d0'][prev.length % 5],
      active: false,
    }]);
    setInviteSent(true);
    notify(`Invite sent to ${inviteForm.email}`);
  };

  const stats = {
    today:     appts.filter(a => a.date === TODAY && !['break','lunch','unavailable'].includes(a.status)).length,
    booked:    appts.filter(a => a.date === TODAY && a.status === 'booked').length,
    completed: appts.filter(a => a.date === TODAY && a.status === 'completed').length,
    upcoming:  appts.filter(a => a.date > TODAY   && !['break','lunch','unavailable'].includes(a.status)).length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        :root {
          --bg:#080604; --bg2:#0c0a07; --bg3:#111009;
          --bd:rgba(196,158,90,0.12); --bd2:rgba(196,158,90,0.22);
          --gold:#c49e5a; --gdim:rgba(196,158,90,0.42);
          --text:#f5f0e8; --tdim:rgba(245,240,232,0.38); --tghost:rgba(245,240,232,0.16);
          --red:#d46060;
          --serif:'Cormorant Garamond',serif; --sans:'Jost',sans-serif;
        }

        .adm{min-height:100vh;background:var(--bg);color:var(--text);font-family:var(--sans);display:flex;flex-direction:column}

        /* TOPBAR */
        .adm-top{height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:var(--bg2);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100}
        .adm-logo{font-family:var(--serif);font-size:1.2rem;font-weight:300}
        .adm-logo em{font-style:italic;color:var(--gold)}
        .adm-logo .sub{font-size:0.68rem;color:var(--tdim);font-family:var(--sans);font-weight:300;margin-left:0.4rem}
        .adm-tr{display:flex;align-items:center;gap:0.9rem}
        .adm-clock{font-family:var(--serif);font-size:1.2rem;font-weight:300;color:var(--gdim)}
        .adm-live{display:flex;align-items:center;gap:0.35rem;font-size:0.56rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(110,200,122,0.8)}
        .adm-live-dot{width:6px;height:6px;border-radius:50%;background:#6ec87a;animation:pulse-g 2s ease-in-out infinite}
        @keyframes pulse-g{0%,100%{opacity:1}50%{opacity:0.3}}
        .adm-badge{font-size:0.52rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);background:rgba(196,158,90,0.1);border:1px solid rgba(196,158,90,0.25);padding:0.24rem 0.7rem}

        /* User menu */
        .adm-umenu{position:relative}
        .adm-ubtn{display:flex;align-items:center;gap:0.6rem;cursor:pointer;padding:0.28rem 0.55rem;border:1px solid transparent;transition:all 0.2s}
        .adm-ubtn:hover,.adm-ubtn.open{background:rgba(196,158,90,0.08);border-color:var(--bd2)}
        .adm-av{width:34px;height:34px;border-radius:50%;background:rgba(196,158,90,0.12);border:1.5px solid rgba(196,158,90,0.4);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:0.85rem;color:var(--gold);flex-shrink:0}
        .adm-uname{font-size:0.77rem;font-weight:500}
        .adm-caret{font-size:0.5rem;color:var(--gdim);transition:transform 0.2s}
        .adm-ubtn.open .adm-caret{transform:rotate(180deg)}
        .adm-udrop{position:absolute;top:calc(100% + 8px);right:0;min-width:200px;background:#1a1610;border:1px solid var(--bd2);z-index:500;box-shadow:0 12px 40px rgba(0,0,0,0.6);animation:dropIn 0.18s cubic-bezier(.22,1,.36,1)}
        @keyframes dropIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
        .adm-udrop-head{padding:0.85rem 1rem;border-bottom:1px solid var(--bd)}
        .adm-udrop-name{font-family:var(--serif);font-size:1rem;font-weight:300}
        .adm-udrop-email{font-size:0.64rem;color:var(--tdim);margin-top:0.1rem}
        .adm-udrop-role{display:inline-block;margin-top:0.3rem;font-size:0.5rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);background:rgba(196,158,90,0.1);border:1px solid rgba(196,158,90,0.25);padding:0.15rem 0.5rem}
        .adm-udrop-btn{width:100%;padding:0.8rem 1rem;background:transparent;border:none;font-family:var(--sans);font-size:0.68rem;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;text-align:left;cursor:pointer;transition:all 0.16s;display:flex;align-items:center;gap:0.5rem;color:rgba(212,96,96,0.75)}
        .adm-udrop-btn:hover{background:rgba(212,96,96,0.07);color:var(--red)}

        /* BODY */
        .adm-body{display:flex;flex:1;overflow:hidden}

        /* SIDEBAR */
        .adm-side{width:238px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:sticky;top:58px;height:calc(100vh - 58px);overflow-y:auto}
        .adm-sec-lbl{font-size:0.51rem;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(196,158,90,0.32);padding:1rem 1.4rem 0.42rem}
        .adm-nav-btn{display:flex;align-items:center;gap:0.75rem;padding:0.7rem 1.4rem;background:none;border:none;border-left:2px solid transparent;cursor:pointer;font-family:var(--sans);font-size:0.75rem;font-weight:400;color:var(--tdim);text-align:left;width:100%;transition:all 0.16s}
        .adm-nav-btn:hover{color:rgba(245,240,232,0.7);background:rgba(196,158,90,0.04)}
        .adm-nav-btn.act{color:var(--text);background:rgba(196,158,90,0.08);border-left-color:var(--gold)}
        .adm-nav-ico{font-size:0.9rem;width:16px;text-align:center;opacity:0.65}
        .adm-tf-list{display:flex;flex-direction:column;gap:2px;padding:0.3rem 0.75rem}
        .adm-tf-btn{display:flex;align-items:center;gap:0.6rem;padding:0.48rem 0.6rem;border:none;background:transparent;cursor:pointer;font-family:var(--sans);font-size:0.71rem;color:var(--tdim);text-align:left;width:100%;transition:all 0.14s;border-radius:2px}
        .adm-tf-btn:hover{background:rgba(196,158,90,0.06);color:rgba(245,240,232,0.7)}
        .adm-tf-btn.act{background:rgba(196,158,90,0.08);color:var(--text)}
        .adm-tf-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .adm-side-foot{padding:1.1rem 1.2rem;margin-top:auto}
        .adm-invite-btn{width:100%;padding:0.7rem 1rem;background:transparent;border:1px solid rgba(196,158,90,0.32);font-family:var(--sans);font-size:0.58rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);cursor:pointer;transition:all 0.2s}
        .adm-invite-btn:hover{background:rgba(196,158,90,0.1);border-color:var(--gold)}

        /* MAIN */
        .adm-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}

        /* Stats */
        .adm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(196,158,90,0.08);border-bottom:1px solid rgba(196,158,90,0.08);flex-shrink:0}
        .adm-stat{background:var(--bg2);padding:0.95rem 1.4rem}
        .adm-stat-lbl{font-size:0.51rem;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:rgba(196,158,90,0.4);margin-bottom:0.25rem}
        .adm-stat-val{font-family:var(--serif);font-size:1.85rem;font-weight:300;line-height:1}
        .adm-stat-sub{font-size:0.58rem;color:var(--tghost);margin-top:0.16rem}

        /* Toolbar */
        .adm-bar{display:flex;align-items:center;gap:0.9rem;padding:0.8rem 1.8rem;border-bottom:1px solid var(--bd);background:var(--bg2);flex-shrink:0;flex-wrap:wrap}
        .adm-dnav{display:flex;align-items:center;gap:0.45rem}
        .adm-arr{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:rgba(196,158,90,0.07);border:1px solid rgba(196,158,90,0.18);color:var(--gold);cursor:pointer;font-size:0.82rem;transition:all 0.16s}
        .adm-arr:hover{background:rgba(196,158,90,0.16);border-color:rgba(196,158,90,0.5)}
        .adm-dlbl{font-family:var(--serif);font-size:1.18rem;font-weight:300;min-width:150px}
        .adm-today-btn{height:30px;padding:0 0.75rem;background:transparent;border:1px solid rgba(196,158,90,0.2);font-family:var(--sans);font-size:0.54rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(196,158,90,0.6);cursor:pointer;transition:all 0.16s}
        .adm-today-btn:hover{border-color:rgba(196,158,90,0.5);color:var(--gold)}
        .adm-vtabs{display:flex;gap:1px;background:rgba(196,158,90,0.1);margin-left:auto}
        .adm-vtab{padding:0.44rem 0.95rem;background:var(--bg3);border:none;cursor:pointer;font-family:var(--sans);font-size:0.58rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,240,232,0.3);transition:all 0.16s}
        .adm-vtab:hover{color:rgba(245,240,232,0.65)}
        .adm-vtab.act{background:var(--gold);color:var(--bg)}

        /* TIMELINE */
        .adm-tl-wrap{flex:1;overflow:auto;padding:1.4rem 1.8rem}
        .adm-tl-head{display:flex;padding-bottom:0.7rem;border-bottom:1px solid var(--bd)}
        .adm-tl-gutter{width:50px;flex-shrink:0}
        .adm-tl-tcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:0.28rem;padding:0 4px}
        .adm-tl-tname{font-family:var(--serif);font-size:0.9rem;font-weight:400}
        .adm-tl-tcnt{font-size:0.54rem;color:var(--tghost)}
        .adm-tl-body{display:flex}
        .adm-tl-times{width:50px;flex-shrink:0;position:relative;height:720px}
        .adm-tl-hlbl{position:absolute;font-size:0.54rem;color:rgba(245,240,232,0.2);right:8px;transform:translateY(-50%)}
        .adm-tl-cols{display:flex;flex:1;border-left:1px solid rgba(196,158,90,0.06)}
        .adm-tl-col{flex:1;position:relative;height:720px;border-right:1px solid rgba(196,158,90,0.05)}
        .adm-tl-hline{position:absolute;left:0;right:0;height:1px;background:rgba(196,158,90,0.05)}
        .adm-now{position:absolute;left:0;right:0;height:2px;background:rgba(212,96,96,0.55);z-index:5;pointer-events:none}
        .adm-now::before{content:'';position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:rgba(212,96,96,0.8)}
        .adm-blk{position:absolute;left:4px;right:4px;border-radius:2px;padding:5px 8px;cursor:pointer;overflow:hidden;transition:filter 0.14s}
        .adm-blk:hover{filter:brightness(1.22);z-index:10!important}
        .adm-blk-client{font-size:0.61rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .adm-blk-svc{font-size:0.54rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0.58;margin-top:2px}
        .adm-blk-time{font-size:0.5rem;opacity:0.42;margin-top:2px}

        /* Tech avatar */
        .av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--serif);flex-shrink:0;border:1.5px solid}

        /* LIST */
        .adm-list-wrap{flex:1;overflow-y:auto;padding:1.4rem 1.8rem}
        .adm-table{border:1px solid var(--bd)}
        .adm-thead{display:grid;grid-template-columns:2fr 1.4fr 2fr 1fr 0.7fr 1.1fr;padding:0.6rem 1.2rem;background:rgba(196,158,90,0.05);border-bottom:1px solid var(--bd);gap:0.5rem}
        .adm-th{font-size:0.5rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(196,158,90,0.45)}
        .adm-row{display:grid;grid-template-columns:2fr 1.4fr 2fr 1fr 0.7fr 1.1fr;padding:0.85rem 1.2rem;border-bottom:1px solid rgba(196,158,90,0.05);gap:0.5rem;align-items:center;cursor:pointer;transition:background 0.14s}
        .adm-row:last-child{border-bottom:none}
        .adm-row:hover{background:rgba(196,158,90,0.04)}
        .adm-ci{display:flex;align-items:center;gap:0.55rem}
        .adm-cin{width:26px;height:26px;border-radius:50%;background:rgba(196,158,90,0.1);border:1px solid rgba(196,158,90,0.2);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:0.7rem;color:var(--gold);flex-shrink:0}
        .adm-cn{font-size:0.83rem;font-weight:400}
        .adm-ct{font-size:0.77rem;color:rgba(245,240,232,0.58)}
        .adm-ctime{font-family:var(--serif);font-size:0.88rem;font-weight:300;color:rgba(245,240,232,0.65)}
        .pill{display:inline-flex;align-items:center;gap:0.28rem;font-size:0.54rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:0.18rem 0.52rem;white-space:nowrap}
        .adm-empty{padding:4rem;text-align:center;color:var(--tghost);font-size:0.82rem}

        /* TECHS */
        .adm-techs-wrap{flex:1;overflow-y:auto;padding:1.4rem 1.8rem}
        .adm-techs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:1px;background:rgba(196,158,90,0.08)}
        .adm-tc{background:var(--bg3);padding:1.45rem;display:flex;flex-direction:column;gap:0.95rem}
        .adm-tc-top{display:flex;align-items:center;gap:0.82rem}
        .adm-tc-name{font-family:var(--serif);font-size:1.18rem;font-weight:400}
        .adm-tc-role{font-size:0.64rem;color:var(--tdim);margin-top:0.08rem}
        .adm-tc-email{font-size:0.66rem;color:rgba(196,158,90,0.52)}
        .adm-pending{font-size:0.5rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(180,160,100,0.7);background:rgba(180,160,100,0.08);border:1px solid rgba(180,160,100,0.2);padding:0.16rem 0.5rem;width:fit-content}
        .adm-tc-stats{display:flex;gap:1.1rem}
        .adm-tcs-val{font-family:var(--serif);font-size:1.45rem;font-weight:300}
        .adm-tcs-lbl{font-size:0.55rem;color:var(--tghost)}
        .adm-tc-actions{display:flex;gap:0.38rem;flex-wrap:wrap}
        .adm-tb{padding:0.42rem 0.78rem;background:transparent;border:1px solid rgba(196,158,90,0.15);font-family:var(--sans);font-size:0.56rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(196,158,90,0.6);cursor:pointer;transition:all 0.16s}
        .adm-tb:hover{background:rgba(196,158,90,0.08);border-color:rgba(196,158,90,0.4);color:var(--gold)}
        .adm-tb.danger{border-color:rgba(212,96,96,0.2);color:rgba(212,96,96,0.6)}
        .adm-tb.danger:hover{background:rgba(212,96,96,0.07);border-color:rgba(212,96,96,0.45);color:var(--red)}

        /* PANEL */
        .adm-overlay{position:fixed;inset:0;background:rgba(4,3,2,0.65);z-index:200;display:flex;justify-content:flex-end}
        .adm-panel{width:470px;max-width:100vw;height:100vh;background:var(--bg3);border-left:1px solid rgba(196,158,90,0.15);overflow-y:auto;animation:panelIn 0.24s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column}
        @keyframes panelIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .adm-ptop{padding:1.5rem 1.75rem 1.1rem;border-bottom:1px solid var(--bd);flex-shrink:0;display:flex;justify-content:space-between;align-items:flex-start}
        .adm-pclient{font-family:var(--serif);font-size:1.7rem;font-weight:300}
        .adm-pid{font-size:0.53rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(196,158,90,0.4);margin-bottom:0.22rem}
        .adm-xbtn{background:none;border:1px solid rgba(196,158,90,0.14);color:var(--tdim);width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.78rem;transition:all 0.16s;flex-shrink:0}
        .adm-xbtn:hover{border-color:rgba(196,158,90,0.4);color:var(--text)}
        .adm-pbody{padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:1.2rem;flex:1}
        .adm-igrid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(196,158,90,0.08)}
        .adm-icell{background:var(--bg3);padding:0.78rem 0.88rem}
        .adm-ilbl{font-size:0.51rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(196,158,90,0.42);margin-bottom:0.26rem}
        .adm-ival{font-family:var(--serif);font-size:0.93rem;font-weight:300}
        .adm-slbl{font-size:0.52rem;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:rgba(196,158,90,0.45);margin-bottom:0.52rem}
        .adm-sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.32rem}
        .adm-sopt{padding:0.5rem 0.2rem;background:transparent;border:1px solid rgba(196,158,90,0.1);font-family:var(--sans);font-size:0.52rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(245,240,232,0.3);cursor:pointer;text-align:center;transition:all 0.15s}
        .adm-sopt:hover{border-color:rgba(196,158,90,0.3);color:rgba(245,240,232,0.65);background:rgba(196,158,90,0.05)}
        .adm-sopt.sel{border-color:var(--sc);background:var(--sb);color:var(--sc)}
        .adm-pbtn{width:100%;padding:0.75rem;background:transparent;border:1px solid rgba(196,158,90,0.2);font-family:var(--sans);font-size:0.58rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(196,158,90,0.7);cursor:pointer;transition:all 0.16s}
        .adm-pbtn:hover{background:rgba(196,158,90,0.08);border-color:rgba(196,158,90,0.45);color:var(--gold)}
        .adm-pbtn.danger{border-color:rgba(212,96,96,0.2);color:rgba(212,96,96,0.6)}
        .adm-pbtn.danger:hover{background:rgba(212,96,96,0.07);border-color:rgba(212,96,96,0.5);color:var(--red)}
        .adm-note-view{padding:0.72rem;background:rgba(196,158,90,0.04);border:1px solid rgba(196,158,90,0.1);font-size:0.76rem;color:rgba(245,240,232,0.52);line-height:1.65;font-style:italic}

        /* MODAL */
        .adm-modal{position:fixed;inset:0;background:rgba(4,3,2,0.82);z-index:400;display:flex;align-items:center;justify-content:center;padding:1rem}
        .adm-mbox{background:var(--bg3);border:1px solid rgba(196,158,90,0.2);width:100%;max-width:450px;max-height:90vh;overflow-y:auto}
        .adm-mhead{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.55rem;border-bottom:1px solid var(--bd)}
        .adm-mtitle{font-family:var(--serif);font-size:1.3rem;font-weight:300;font-style:italic}
        .adm-mbody{padding:1.55rem;display:flex;flex-direction:column;gap:0.85rem}
        .adm-field{display:flex;flex-direction:column;gap:0.32rem}
        .adm-field label{font-size:0.54rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(196,158,90,0.5)}
        .adm-field input,.adm-field select,.adm-field textarea{background:rgba(255,255,255,0.03);border:1px solid rgba(196,158,90,0.14);color:var(--text);font-family:var(--sans);font-size:0.83rem;padding:0.65rem 0.82rem;outline:none;transition:border-color 0.16s;width:100%}
        .adm-field input:focus,.adm-field select:focus,.adm-field textarea:focus{border-color:rgba(196,158,90,0.45)}
        .adm-field input::placeholder{color:rgba(245,240,232,0.2)}
        .adm-field select{cursor:pointer;color-scheme:dark}
        .adm-field select option{background:var(--bg3)}
        .adm-frow{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem}
        .adm-mactions{display:flex;gap:0.6rem;padding:0 1.55rem 1.55rem}
        .adm-save{flex:1;padding:0.83rem;background:var(--gold);border:none;font-family:var(--sans);font-size:0.63rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--bg);cursor:pointer;transition:background 0.18s}
        .adm-save:hover{background:#d4ae6a}
        .adm-save:disabled{background:rgba(196,158,90,0.22);cursor:not-allowed}
        .adm-cancel{padding:0.83rem 1.25rem;background:transparent;border:1px solid rgba(196,158,90,0.18);font-family:var(--sans);font-size:0.63rem;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(245,240,232,0.32);cursor:pointer;transition:all 0.16s}
        .adm-cancel:hover{border-color:rgba(196,158,90,0.4);color:rgba(245,240,232,0.7)}
        .adm-invite-ok{text-align:center;padding:2rem 1.55rem;display:flex;flex-direction:column;align-items:center;gap:0.65rem}

        /* TOAST */
        .adm-toast{position:fixed;bottom:2rem;right:2rem;z-index:600;background:#1a1610;border:1px solid rgba(196,158,90,0.28);border-left:3px solid var(--gold);padding:0.82rem 1.25rem;display:flex;align-items:center;gap:0.62rem;animation:tIn 0.26s cubic-bezier(.22,1,.36,1);min-width:220px}
        .adm-toast.err{border-left-color:var(--red)}
        @keyframes tIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .adm-toast-msg{font-size:0.74rem}

        /* Info banner */
        .adm-info-banner{font-size:0.7rem;color:var(--tdim);line-height:1.6;padding:0.68rem;background:rgba(196,158,90,0.05);border:1px solid rgba(196,158,90,0.12);border-left:2px solid var(--gold)}

        @media(max-width:900px){
          .adm-side{display:none}
          .adm-stats{grid-template-columns:repeat(2,1fr)}
          .adm-panel{width:100%}
          .adm-thead,.adm-row{grid-template-columns:2fr 1fr 1.1fr}
        }
      `}</style>

      <div className="adm">

        {/* ── TOPBAR ── */}
        <div className="adm-top">
          <div className="adm-logo">
            Finer Nails <em>&</em> Spa
            <span className="sub">/ Admin</span>
          </div>
          <div className="adm-tr">
            <div className="adm-clock">{clock.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
            <div className="adm-live"><div className="adm-live-dot"/>Live</div>
            <div className="adm-badge">Admin</div>

            <div className="adm-umenu" ref={menuRef}>
              <div
                className={`adm-ubtn ${showUserMenu?'open':''}`}
                onClick={() => setShowUserMenu(v => !v)}
              >
                <div className="adm-av">AD</div>
                <span className="adm-uname">Admin</span>
                <span className="adm-caret">▾</span>
              </div>
              {showUserMenu && (
                <div className="adm-udrop">
                  <div className="adm-udrop-head">
                    <div className="adm-udrop-name">Salon Admin</div>
                    <div className="adm-udrop-email">admin@finernails.co.ke</div>
                    <div className="adm-udrop-role">Administrator</div>
                  </div>
                  <button className="adm-udrop-btn" onClick={() => navigate('/login')}>
                    <span>⎋</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="adm-body">

          {/* ── SIDEBAR ── */}
          <div className="adm-side">
            <div className="adm-sec-lbl">Views</div>
            {[{k:'timeline',i:'▤',l:'Timeline'},{k:'list',i:'☰',l:'Booking List'},{k:'techs',i:'◈',l:'Manage Techs'}].map(({k,i,l}) => (
              <button key={k} className={`adm-nav-btn ${view===k?'act':''}`} onClick={() => setView(k)}>
                <span className="adm-nav-ico">{i}</span>{l}
              </button>
            ))}

            <div className="adm-sec-lbl" style={{marginTop:'0.5rem'}}>Filter by Tech</div>
            <div className="adm-tf-list">
              <button className={`adm-tf-btn ${filterTech==='all'?'act':''}`} onClick={() => setFilterTech('all')}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'rgba(196,158,90,0.5)',flexShrink:0}}/>
                All Technicians
              </button>
              {techs.filter(t=>t.active).map(t => (
                <button key={t.id} className={`adm-tf-btn ${filterTech===t.id?'act':''}`} onClick={() => setFilterTech(t.id)}>
                  <div className="adm-tf-dot" style={{background:t.color}}/>
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="adm-side-foot">
              <button className="adm-invite-btn" onClick={() => {setShowAddTech(true);setInviteSent(false);setInviteForm({name:'',email:'',role:''});}}>
                + Invite Technician
              </button>
            </div>
          </div>

          {/* ── MAIN ── */}
          <div className="adm-main">

            {/* Stats */}
            <div className="adm-stats">
              {[
                {lbl:"Today's Appts", val:stats.today,     sub:`${stats.booked} still booked`},
                {lbl:'Completed',      val:stats.completed, sub:'done today'},
                {lbl:'Active Techs',   val:techs.filter(t=>t.active).length, sub:'on the floor'},
                {lbl:'Upcoming',       val:stats.upcoming,  sub:'from tomorrow'},
              ].map(({lbl,val,sub}) => (
                <div key={lbl} className="adm-stat">
                  <div className="adm-stat-lbl">{lbl}</div>
                  <div className="adm-stat-val">{val}</div>
                  <div className="adm-stat-sub">{sub}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="adm-bar">
              <div className="adm-dnav">
                <button className="adm-arr" onClick={() => shiftDate(-1)}>‹</button>
                <div className="adm-dlbl">
                  {fmtDate(viewDate)}
                  {viewDate !== TODAY && (
                    <span style={{fontSize:'0.8rem',color:'rgba(245,240,232,0.28)',marginLeft:'0.5rem'}}>
                      {new Date(viewDate+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                    </span>
                  )}
                </div>
                <button className="adm-arr" onClick={() => shiftDate(1)}>›</button>
              </div>
              {viewDate !== TODAY && (
                <button className="adm-today-btn" onClick={() => setViewDate(TODAY)}>Today</button>
              )}
              <span style={{fontSize:'0.58rem',color:'rgba(245,240,232,0.22)'}}>
                {dayAppts.filter(a=>!['break','lunch','unavailable'].includes(a.status)).length} appts
              </span>
              <div className="adm-vtabs">
                {[['timeline','Timeline'],['list','List'],['techs','Techs']].map(([k,l]) => (
                  <button key={k} className={`adm-vtab ${view===k?'act':''}`} onClick={() => setView(k)}>{l}</button>
                ))}
              </div>
            </div>

            {/* ── TIMELINE ── */}
            {view === 'timeline' && (() => {
              const vt = techs.filter(t => t.active && (filterTech==='all' || filterTech===t.id));
              const nowMin = new Date().getHours()*60+new Date().getMinutes()-8*60;
              const showNow = viewDate===TODAY && nowMin>=0 && nowMin<=720;
              return (
                <div className="adm-tl-wrap">
                  {vt.length === 0 ? (
                    <div className="adm-empty">No technicians to display.</div>
                  ) : (
                    <div style={{minWidth:540}}>
                      {/* Header */}
                      <div className="adm-tl-head">
                        <div className="adm-tl-gutter"/>
                        {vt.map(t => (
                          <div key={t.id} className="adm-tl-tcol">
                            <div className="av" style={{width:32,height:32,fontSize:'0.78rem',background:`${t.color}18`,borderColor:`${t.color}55`,color:t.color}}>
                              {initials(t.name)}
                            </div>
                            <div className="adm-tl-tname">{t.name.split(' ')[0]}</div>
                            <div className="adm-tl-tcnt">
                              {dayAppts.filter(a=>a.tech_id===t.id&&!['break','lunch','unavailable'].includes(a.status)).length} appts
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Body */}
                      <div className="adm-tl-body">
                        <div className="adm-tl-times">
                          {HOURS.map(h => (
                            <div key={h} className="adm-tl-hlbl" style={{top:(h-8)*60*PX_PER_MIN}}>
                              {h<12?`${h}am`:h===12?'12pm':`${h-12}pm`}
                            </div>
                          ))}
                        </div>
                        <div className="adm-tl-cols">
                          {vt.map(t => (
                            <div key={t.id} className="adm-tl-col">
                              {HOURS.map(h => (
                                <div key={h} className="adm-tl-hline" style={{top:(h-8)*60*PX_PER_MIN}}/>
                              ))}
                              {showNow && <div className="adm-now" style={{top:nowMin*PX_PER_MIN}}/>}
                              {dayAppts.filter(a=>a.tech_id===t.id).map(appt => {
                                const sm = parseMin(appt.start)-8*60;
                                const em = parseMin(appt.end)-8*60;
                                const ht = Math.max((em-sm)*PX_PER_MIN, 28);
                                const cfg = STATUS_CFG[appt.status]||STATUS_CFG.booked;
                                const isBlk = ['break','lunch','unavailable'].includes(appt.status);
                                return (
                                  <div key={appt.id} className="adm-blk"
                                    style={{
                                      top:sm*PX_PER_MIN, height:ht,
                                      background: isBlk ? cfg.bg : `${t.color}16`,
                                      borderLeft:`3px solid ${isBlk?cfg.color:t.color}`,
                                      zIndex:2,
                                    }}
                                    onClick={() => setSelectedAppt(appt)}
                                  >
                                    <div className="adm-blk-client" style={{color:isBlk?cfg.color:t.color}}>
                                      {appt.client}
                                    </div>
                                    {ht > 40 && !isBlk && <div className="adm-blk-svc">{appt.service}</div>}
                                    {ht > 56 && <div className="adm-blk-time">{fmtTime(appt.start)} – {fmtTime(appt.end)}</div>}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── LIST ── */}
            {view === 'list' && (
              <div className="adm-list-wrap">
                <div className="adm-table">
                  <div className="adm-thead">
                    <span className="adm-th">Client</span>
                    <span className="adm-th">Technician</span>
                    <span className="adm-th">Service</span>
                    <span className="adm-th">Time</span>
                    <span className="adm-th">Dur.</span>
                    <span className="adm-th">Status</span>
                  </div>
                  {dayAppts.length === 0 && <div className="adm-empty">No appointments for this day.</div>}
                  {dayAppts.map(appt => {
                    const tech = techs.find(t=>t.id===appt.tech_id);
                    const dur = parseMin(appt.end)-parseMin(appt.start);
                    const cfg = STATUS_CFG[appt.status]||STATUS_CFG.booked;
                    const isBlk = ['break','lunch','unavailable'].includes(appt.status);
                    return (
                      <div key={appt.id} className="adm-row" onClick={() => setSelectedAppt(appt)}>
                        <div className="adm-ci">
                          {!isBlk && <div className="adm-cin">{initials(appt.client)}</div>}
                          <span className="adm-cn" style={isBlk?{color:cfg.color,fontStyle:'italic'}:{}}>{appt.client}</span>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
                          {tech && (
                            <div className="av" style={{width:22,height:22,fontSize:'0.53rem',background:`${tech.color}18`,borderColor:`${tech.color}55`,color:tech.color}}>
                              {initials(tech.name)}
                            </div>
                          )}
                          <span className="adm-ct">{tech?.name.split(' ')[0]||'—'}</span>
                        </div>
                        <div className="adm-ct" style={{fontSize:'0.76rem'}}>{appt.service||'—'}</div>
                        <div className="adm-ctime">{fmtTime(appt.start)}</div>
                        <div className="adm-ct">{dur}m</div>
                        <div><span className="pill" style={{color:cfg.color,background:cfg.bg}}>{cfg.label}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TECHS ── */}
            {view === 'techs' && (
              <div className="adm-techs-wrap">
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.4rem'}}>
                  <div>
                    <div style={{fontFamily:'var(--serif)',fontSize:'1.5rem',fontWeight:300}}>Technician Management</div>
                    <div style={{fontSize:'0.66rem',color:'var(--tghost)',marginTop:'0.18rem'}}>
                      {techs.filter(t=>t.active).length} active · {techs.filter(t=>!t.active).length} pending
                    </div>
                  </div>
                  <button className="adm-invite-btn" style={{width:'auto',padding:'0.6rem 1.2rem'}}
                    onClick={() => {setShowAddTech(true);setInviteSent(false);setInviteForm({name:'',email:'',role:''});}}>
                    + Invite Technician
                  </button>
                </div>
                <div className="adm-techs-grid">
                  {techs.map(t => {
                    const tc = appts.filter(a=>a.tech_id===t.id&&a.date===TODAY&&!['break','lunch','unavailable'].includes(a.status)).length;
                    const uc = appts.filter(a=>a.tech_id===t.id&&a.date>TODAY).length;
                    const dc = appts.filter(a=>a.tech_id===t.id&&a.status==='completed').length;
                    return (
                      <div key={t.id} className="adm-tc">
                        <div className="adm-tc-top">
                          <div className="av" style={{width:44,height:44,fontSize:'0.95rem',background:`${t.color}18`,borderColor:`${t.color}55`,color:t.color}}>
                            {initials(t.name)}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div className="adm-tc-name">{t.name}</div>
                            <div className="adm-tc-role">{t.role}</div>
                            <div className="adm-tc-email">{t.email}</div>
                          </div>
                          {!t.active && <span className="adm-pending">Pending</span>}
                        </div>
                        <div className="adm-tc-stats">
                          {[{v:tc,l:'Today'},{v:uc,l:'Upcoming'},{v:dc,l:'Done'}].map(({v,l}) => (
                            <div key={l}>
                              <div className="adm-tcs-val">{v}</div>
                              <div className="adm-tcs-lbl">{l}</div>
                            </div>
                          ))}
                        </div>
                        <div className="adm-tc-actions">
                          <button className="adm-tb" onClick={() => {setFilterTech(t.id);setView('timeline');}}>Schedule</button>
                          <button className="adm-tb" onClick={() => {setShowEditPwd(t.id);setNewPwd('');}}>Reset Pwd</button>
                          {!t.active && <button className="adm-tb" onClick={() => notify('Invite resent')}>Resend</button>}
                          <button className="adm-tb danger" onClick={() => {setTechs(prev=>prev.filter(x=>x.id!==t.id));notify('Technician removed');}}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        {selectedAppt && (() => {
          const tech = techs.find(t=>t.id===selectedAppt.tech_id);
          const cfg = STATUS_CFG[selectedAppt.status]||STATUS_CFG.booked;
          const dur = parseMin(selectedAppt.end)-parseMin(selectedAppt.start);
          const isBlk = ['break','lunch','unavailable'].includes(selectedAppt.status);
          return (
            <div className="adm-overlay" onClick={() => setSelectedAppt(null)}>
              <div className="adm-panel" onClick={e=>e.stopPropagation()}>
                <div className="adm-ptop">
                  <div style={{flex:1,minWidth:0}}>
                    <div className="adm-pid">{selectedAppt.id} · {tech?.name||'—'}</div>
                    <div className="adm-pclient">{selectedAppt.client}</div>
                    <div style={{marginTop:'0.45rem'}}>
                      <span className="pill" style={{color:cfg.color,background:cfg.bg}}>{cfg.label}</span>
                    </div>
                  </div>
                  <button className="adm-xbtn" onClick={() => setSelectedAppt(null)}>✕</button>
                </div>

                <div className="adm-pbody">
                  <div className="adm-igrid">
                    {[
                      {l:'Service',    v:selectedAppt.service||'—'},
                      {l:'Technician', v:tech?.name||'—'},
                      {l:'Date',       v:fmtDate(selectedAppt.date)},
                      {l:'Time',       v:`${fmtTime(selectedAppt.start)} – ${fmtTime(selectedAppt.end)}`},
                      {l:'Duration',   v:`${dur} min`},
                      {l:'Phone',      v:selectedAppt.phone||'—'},
                    ].map(({l,v}) => (
                      <div key={l} className="adm-icell">
                        <div className="adm-ilbl">{l}</div>
                        <div className="adm-ival" style={{fontSize:l==='Service'?'0.8rem':'0.93rem'}}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {selectedAppt.notes && (
                    <div>
                      <div className="adm-slbl">Client Notes</div>
                      <div className="adm-note-view">{selectedAppt.notes}</div>
                    </div>
                  )}

                  {!isBlk && (
                    <div>
                      <div className="adm-slbl">Update Status</div>
                      <div className="adm-sgrid">
                        {Object.entries(STATUS_CFG).map(([key,c]) => (
                          <button key={key}
                            className={`adm-sopt ${selectedAppt.status===key?'sel':''}`}
                            style={{'--sc':c.color,'--sb':c.bg}}
                            onClick={() => updateStatus(selectedAppt.id,key)}
                          >{c.label}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{display:'flex',flexDirection:'column',gap:'0.38rem'}}>
                    <button className="adm-pbtn" onClick={() => {setEditForm({...selectedAppt});setShowEditAppt(true);}}>
                      ✎ Edit Appointment
                    </button>
                    {selectedAppt.phone && (
                      <>
                        <a href={`https://wa.me/${selectedAppt.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{display:'block'}}>
                          <button className="adm-pbtn" style={{width:'100%'}}>💬 WhatsApp {selectedAppt.client.split(' ')[0]}</button>
                        </a>
                        <a href={`tel:${selectedAppt.phone}`} style={{display:'block'}}>
                          <button className="adm-pbtn" style={{width:'100%'}}>📞 Call {selectedAppt.client.split(' ')[0]}</button>
                        </a>
                      </>
                    )}
                    {!['cancelled','completed'].includes(selectedAppt.status) && !isBlk && (
                      <button className="adm-pbtn danger" onClick={() => updateStatus(selectedAppt.id,'cancelled')}>
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── EDIT APPOINTMENT ── */}
        {showEditAppt && (
          <div className="adm-modal" onClick={() => setShowEditAppt(false)}>
            <div className="adm-mbox" onClick={e=>e.stopPropagation()}>
              <div className="adm-mhead">
                <div className="adm-mtitle">Edit Appointment</div>
                <button className="adm-xbtn" onClick={() => setShowEditAppt(false)}>✕</button>
              </div>
              <div className="adm-mbody">
                <div className="adm-field"><label>Client Name</label><input value={editForm.client||''} onChange={e=>setEditForm(f=>({...f,client:e.target.value}))}/></div>
                <div className="adm-field"><label>Service</label><input value={editForm.service||''} onChange={e=>setEditForm(f=>({...f,service:e.target.value}))}/></div>
                <div className="adm-field"><label>Date</label><input type="date" value={editForm.date||''} onChange={e=>setEditForm(f=>({...f,date:e.target.value}))}/></div>
                <div className="adm-frow">
                  <div className="adm-field"><label>Start</label><input type="time" value={editForm.start||''} onChange={e=>setEditForm(f=>({...f,start:e.target.value}))}/></div>
                  <div className="adm-field"><label>End</label><input type="time" value={editForm.end||''} onChange={e=>setEditForm(f=>({...f,end:e.target.value}))}/></div>
                </div>
                <div className="adm-field">
                  <label>Status</label>
                  <select value={editForm.status||'booked'} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))}>
                    {Object.entries(STATUS_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label>Assign Technician</label>
                  <select value={editForm.tech_id||''} onChange={e=>setEditForm(f=>({...f,tech_id:e.target.value}))}>
                    {techs.filter(t=>t.active).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="adm-field"><label>Notes</label><textarea rows={3} value={editForm.notes||''} onChange={e=>setEditForm(f=>({...f,notes:e.target.value}))} placeholder="Allergies, preferences, reminders…"/></div>
              </div>
              <div className="adm-mactions">
                <button className="adm-cancel" onClick={() => setShowEditAppt(false)}>Cancel</button>
                <button className="adm-save" onClick={saveEdit}>Save Changes →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── INVITE TECHNICIAN ── */}
        {showAddTech && (
          <div className="adm-modal" onClick={() => setShowAddTech(false)}>
            <div className="adm-mbox" onClick={e=>e.stopPropagation()}>
              <div className="adm-mhead">
                <div className="adm-mtitle">{inviteSent?'Invite Sent':'Invite Technician'}</div>
                <button className="adm-xbtn" onClick={() => setShowAddTech(false)}>✕</button>
              </div>
              {inviteSent ? (
                <div className="adm-invite-ok">
                  <div style={{fontSize:'1.8rem',color:'var(--gold)'}}>✦</div>
                  <div style={{fontFamily:'var(--serif)',fontSize:'1.2rem',fontWeight:300}}>Invite sent to {inviteForm.email}</div>
                  <div style={{fontSize:'0.7rem',color:'var(--tdim)',textAlign:'center',lineHeight:1.65}}>
                    They'll receive an email with a set-password link. Their profile activates once confirmed.
                  </div>
                  <button className="adm-save" style={{marginTop:'1rem',padding:'0.72rem 2rem',width:'auto'}}
                    onClick={() => {setInviteSent(false);setInviteForm({name:'',email:'',role:''});}}>
                    Invite Another
                  </button>
                </div>
              ) : (
                <>
                  <div className="adm-mbody">
                    <div className="adm-info-banner">
                      The technician receives an email invite. They click the link and set their own password — no manual setup needed.
                    </div>
                    <div className="adm-field"><label>Full Name</label><input placeholder="e.g. Amara Wanjiku" value={inviteForm.name} onChange={e=>setInviteForm(f=>({...f,name:e.target.value}))}/></div>
                    <div className="adm-field"><label>Email Address</label><input type="email" placeholder="tech@finernails.co.ke" value={inviteForm.email} onChange={e=>setInviteForm(f=>({...f,email:e.target.value}))}/></div>
                    <div className="adm-field"><label>Specialisation (optional)</label><input placeholder="e.g. Gel & Acrylic Expert" value={inviteForm.role} onChange={e=>setInviteForm(f=>({...f,role:e.target.value}))}/></div>
                  </div>
                  <div className="adm-mactions">
                    <button className="adm-cancel" onClick={() => setShowAddTech(false)}>Cancel</button>
                    <button className="adm-save" disabled={!inviteForm.name||!inviteForm.email} onClick={doInvite}>Send Invite →</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── RESET PASSWORD ── */}
        {showEditPwd && (
          <div className="adm-modal" onClick={() => setShowEditPwd(null)}>
            <div className="adm-mbox" onClick={e=>e.stopPropagation()}>
              <div className="adm-mhead">
                <div className="adm-mtitle">Reset Password</div>
                <button className="adm-xbtn" onClick={() => setShowEditPwd(null)}>✕</button>
              </div>
              <div className="adm-mbody">
                <div style={{fontSize:'0.7rem',color:'var(--tdim)',lineHeight:1.6}}>
                  Setting a new password for <strong style={{color:'var(--text)'}}>{techs.find(t=>t.id===showEditPwd)?.name}</strong>.
                </div>
                <div className="adm-field">
                  <label>New Password</label>
                  <input type="password" placeholder="Minimum 8 characters" value={newPwd} onChange={e=>setNewPwd(e.target.value)}/>
                </div>
              </div>
              <div className="adm-mactions">
                <button className="adm-cancel" onClick={() => setShowEditPwd(null)}>Cancel</button>
                <button className="adm-save" disabled={newPwd.length<8} onClick={() => {setShowEditPwd(null);setNewPwd('');notify('Password updated ✦');}}>
                  Update Password →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOAST ── */}
        {toast && (
          <div className={`adm-toast ${toast.type==='err'?'err':''}`}>
            <span style={{color:toast.type==='err'?'var(--red)':'var(--gold)',fontSize:'0.88rem',flexShrink:0}}>
              {toast.type==='err'?'✕':'✦'}
            </span>
            <span className="adm-toast-msg">{toast.msg}</span>
          </div>
        )}
      </div>
    </>
  );
}