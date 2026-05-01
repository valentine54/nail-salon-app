// src/pages/AdminDashboard.jsx
// Full admin dashboard: view all techs, schedules, add/remove techs, manage bookings
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  booked:        { label: 'Booked',       color: '#c49e5a', bg: 'rgba(196,158,90,0.12)',   dot: '#c49e5a'  },
  completed:          { label: 'Completed',         color: '#a0b4a0', bg: 'rgba(160,180,160,0.1)',   dot: '#a0b4a0'  },
  cancelled:     { label: 'Cancelled',    color: '#e05555', bg: 'rgba(220,85,85,0.1)',     dot: '#e05555'  },
  break:         { label: 'Break',        color: '#b0a070', bg: 'rgba(176,160,112,0.1)',   dot: '#b0a070'  },
  lunch:         { label: 'Lunch',        color: '#c88040', bg: 'rgba(200,128,64,0.1)',    dot: '#c88040'  },
  unavailable:   { label: 'Unavailable',  color: '#707070', bg: 'rgba(112,112,112,0.1)',   dot: '#707070'  },
};

const TECH_COLORS = ['#c49e5a', '#7eb8c8', '#c87890', '#78b878', '#b090d0', '#d09060'];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am–8pm

function pad(n) { return String(n).padStart(2, '0'); }
function fmtHour(h) { return h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`; }

function todayStr() { return new Date().toISOString().split('T')[0]; }

function parseTime(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h < 12 ? 'am' : 'pm';
  return `${h % 12 || 12}:${pad(m)}${ampm}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.booked;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      fontSize: size === 'sm' ? '0.6rem' : '0.68rem',
      fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
      color: cfg.color, background: cfg.bg,
      padding: size === 'sm' ? '0.2rem 0.6rem' : '0.3rem 0.8rem',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function TechAvatar({ tech, size = 36 }) {
  const initials = tech.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `${tech.color}20`, border: `1.5px solid ${tech.color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Cormorant Garamond', serif", fontSize: size * 0.33,
      fontWeight: 400, color: tech.color, letterSpacing: '0.03em',
    }}>{initials}</div>
  );
}


// Timeline cell: position appointment block on a time grid
function TimelineBlock({ appt, techColor, onClick }) {
  const startMin = parseTime(appt.start) - 8 * 60; // offset from 8am
  const endMin   = parseTime(appt.end)   - 8 * 60;
  const totalMin = 12 * 60; // 8am-8pm = 720min
  const top    = `${(startMin / totalMin) * 100}%`;
  const height = `${Math.max(((endMin - startMin) / totalMin) * 100, 3)}%`;
  const cfg    = STATUS_CONFIG[appt.status] || STATUS_CONFIG.booked;

  return (
    <div onClick={onClick} style={{
      position: 'absolute', left: 4, right: 4,
      top, height,
      background: `${techColor}18`,
      borderLeft: `3px solid ${techColor}`,
      borderRadius: 2,
      padding: '4px 6px',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'all 0.18s',
      zIndex: 2,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = `${techColor}30`; e.currentTarget.style.zIndex = 10; }}
    onMouseLeave={e => { e.currentTarget.style.background = `${techColor}18`; e.currentTarget.style.zIndex = 2; }}
    >
      <div style={{ fontSize: '0.6rem', fontWeight: 600, color: techColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {appt.client}
      </div>
      <div style={{ fontSize: '0.55rem', color: 'rgba(245,240,232,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {fmtTime(appt.start)} – {fmtTime(appt.end)}
      </div>
      <div style={{ marginTop: 2 }}><StatusBadge status={appt.status} /></div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [techs,        setTechs]        = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewDate,     setViewDate]     = useState(todayStr());
  const [view,         setView]         = useState('timeline'); // 'timeline' | 'list' | 'techs'
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showAddTech,  setShowAddTech]  = useState(false);
  const [showEditAppt, setShowEditAppt] = useState(false);
  const [filterTech,   setFilterTech]   = useState('all');
  const [inviteForm,   setInviteForm]   = useState({ name: '', email: '', role: '', tempPassword: '' });
  const [inviteSent,   setInviteSent]   = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  // Add this function in AdminDashboard
const [showResetPassword, setShowResetPassword] = useState(false);
const [resetPasswordForm, setResetPasswordForm] = useState({ userId: '', name: '', newPassword: '' });

const handleResetPassword = (tech) => {
   setResetPasswordForm({
    userId: tech.id,
    name: tech.name,
    newPassword: ''
  });
  setShowResetPassword(true);
};

const confirmResetPassword = async () => {
  setInviteLoading(true);
  try {
    const { error } = await supabase.functions.invoke('update-tech-password', {
      body: {
        userId: resetPasswordForm.userId,
        newPassword: resetPasswordForm.newPassword,
      }
    });

    if (error) throw error;

    showNotif(`Password reset for ${resetPasswordForm.name}`);
    setShowResetPassword(false);
  } catch (e) {
    showNotif(e.message || 'Failed to reset password', 'error');
  } finally {
    setInviteLoading(false);
  }
};

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const dayAppts = appointments.filter(a => {
    const matchDate = a.date === viewDate;
    const matchTech = filterTech === 'all' || a.tech_id === filterTech;
    return matchDate && matchTech;
  });

  const stats = {
  totalToday: appointments.filter(a => a.date === todayStr()).length,
  //confirmed: appointments.filter(a => a.date === todayStr() && a.status === 'confirmed').length,
 // inProgress: appointments.filter(a => a.date === todayStr() && a.status === 'in-progress').length,
  upcoming: appointments.filter(a => a.date > todayStr()).length,
};

  // ── Invite tech ──────────────────────────────────────────────────────────────
  // In AdminDashboard.jsx - update your handleInvite function
const handleCreateTech = async () => {
  if (!inviteForm.name || !inviteForm.email || !inviteForm.tempPassword) return;
  setInviteLoading(true);

  try {
    const { data, error } = await supabase.functions.invoke('create-tech', {
      body: {
        email: inviteForm.email,
        password: inviteForm.tempPassword,
        name: inviteForm.name,
        role: inviteForm.role || 'Nail Technician',
      }
    });

    if (error) throw error;

    setInviteSent(true);
    showNotif(`Account created for ${inviteForm.name}`);

    // Refresh the techs list
    fetchAllData();

  } catch (e) {
    console.error(e);
    showNotif(e.message || 'Failed to create account', 'error');
  } finally {
    setInviteLoading(false);
  }
};

  const handleRemoveTech = (id) => {
    setTechs(prev => prev.filter(t => t.id !== id));
    showNotif('Technician removed');
  };

  // ── Update appointment status ─────────────────────────────────────────────
  const updateStatus = async (id, status) => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);

  if (error) {
    showNotif('Failed to update status', 'error');
    return;
  }

  setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  if (selectedAppt?.id === id) setSelectedAppt(prev => ({ ...prev, status }));
  showNotif(`Status updated to ${STATUS_CONFIG[status]?.label}`);
};

  const formatDateLabel = (d) => {
    const date = new Date(d + 'T00:00:00');
    const isToday = d === todayStr();
    const isTmrw  = d === new Date(Date.now() + 86400000).toISOString().split('T')[0];
    if (isToday) return 'Today';
    if (isTmrw)  return 'Tomorrow';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

 const fetchAllData = async () => {
  setLoading(true);
  try {
    // Fetch technicians from profiles
    const { data: techsData, error: techsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_technician', true)
      .order('name');

    if (techsError) throw techsError;

    // Format technicians with colors
    const formattedTechs = techsData.map((t, index) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      role: t.role || 'Nail Technician',
      color: TECH_COLORS[index % TECH_COLORS.length],
      active: true,
    }));
    setTechs(formattedTechs);

    // Fetch appointments for the selected date range (last 7 days to next 14 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);

    const { data: apptsData, error: apptsError } = await supabase
      .from('appointments')
      .select(`
        id,
        client_name,
        service_type,
        date,
        start_time,
        end_time,
        status,
        notes,
        has_inspo,
        phone,
        client_history,
        technician_id
      `)
      .gte('date', weekAgo.toISOString().split('T')[0])
      .lte('date', twoWeeks.toISOString().split('T')[0])
      .order('date')
      .order('start_time');

    if (apptsError) throw apptsError;

    // Transform appointments to match component expectations
    const formattedAppts = apptsData.map(a => ({
      id: a.id,
      tech_id: a.technician_id,
      client: a.client_name,
      service: a.service_type,
      date: a.date,
      start: a.start_time,
      end: a.end_time,
      status: a.status,
      inspo: a.has_inspo,
      phone: a.phone || '',
      notes: a.notes || '',
      client_history: a.client_history,
    }));
    setAppointments(formattedAppts);

  } catch (err) {
    console.error('Error fetching data:', err);
    showNotif('Failed to load data', 'error');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (user && isAdmin) {
    fetchAllData();
  }
}, [user, isAdmin, viewDate]);

useEffect(() => {
  if (!user || !isAdmin) return;

  // Subscribe to changes on appointments table
  const appointmentsChannel = supabase
    .channel('admin-appointments-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'appointments',
    }, () => {
      fetchAllData(); // Refresh data when changes occur
    })
    .subscribe();

  // Subscribe to changes on profiles table
  const profilesChannel = supabase
    .channel('admin-profiles-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'profiles',
    }, () => {
      fetchAllData(); // Refresh data when technicians change
    })
    .subscribe();

  return () => {
    supabase.removeChannel(appointmentsChannel);
    supabase.removeChannel(profilesChannel);
  };
}, [user, isAdmin]);


useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(data?.role === 'Admin');
        setChecking(false);
      };
      checkAdmin();
    } else if (!authLoading) {
      setChecking(false);
    }
  }, [user, authLoading]);

  // Redirect if not logged in
  if (authLoading || checking) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0806', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="td-spinner" style={{ width: 30, height: 30 }} />
      </div>
    );
  }



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0806; color: #f5f0e8; font-family: 'Jost', sans-serif; }

        .adm { display: flex; flex-direction: column; min-height: 100vh; background: #0a0806; }

        /* ── Topbar ── */
        .adm-top { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 60px; border-bottom: 1px solid rgba(196,158,90,0.12); background: #0e0c09; position: sticky; top: 0; z-index: 100; }
        .adm-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 300; color: #f5f0e8; }
        .adm-logo em { font-style: italic; color: #c49e5a; }
        .adm-top-right { display: flex; align-items: center; gap: 1rem; }
        .adm-badge { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; background: rgba(196,158,90,0.12); border: 1px solid rgba(196,158,90,0.25); color: #c49e5a; padding: 0.3rem 0.75rem; }
        .adm-live { display: flex; align-items: center; gap: 0.4rem; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(110,200,122,0.85); }
        .adm-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #6ec87a; animation: blink 1.8s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0.3;} }

        /* ── Layout ── */
        .adm-body { display: flex; flex: 1; }
        .adm-side { width: 230px; flex-shrink: 0; border-right: 1px solid rgba(196,158,90,0.1); background: #0e0c09; display: flex; flex-direction: column; padding: 1.5rem 0; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; }
        .adm-side-section { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(196,158,90,0.35); padding: 1rem 1.4rem 0.5rem; }
        .adm-nav { display: flex; flex-direction: column; }
        .adm-nav-btn { display: flex; align-items: center; gap: 0.8rem; padding: 0.7rem 1.4rem; background: none; border: none; border-left: 2px solid transparent; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 400; color: rgba(245,240,232,0.38); text-align: left; width: 100%; transition: all 0.2s; }
        .adm-nav-btn:hover { color: rgba(245,240,232,0.7); background: rgba(196,158,90,0.04); }
        .adm-nav-btn.adm-active { color: #f5f0e8; background: rgba(196,158,90,0.08); border-left-color: #c49e5a; }
        .adm-nav-icon { font-size: 1rem; width: 20px; text-align: center; }

        /* Tech filter list */
        .adm-tech-filter { display: flex; flex-direction: column; gap: 2px; padding: 0.3rem 0.8rem; }
        .adm-tf-btn { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.6rem; border: none; background: transparent; cursor: pointer; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 400; color: rgba(245,240,232,0.4); text-align: left; width: 100%; transition: all 0.18s; }
        .adm-tf-btn:hover { background: rgba(196,158,90,0.06); color: rgba(245,240,232,0.7); }
        .adm-tf-btn.adm-tf-active { background: rgba(196,158,90,0.08); color: #f5f0e8; }

        /* ── Main area ── */
        .adm-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .adm-toolbar { display: flex; align-items: center; gap: 1rem; padding: 1.2rem 2rem; border-bottom: 1px solid rgba(196,158,90,0.09); flex-wrap: wrap; background: #0e0c09; }
        .adm-date-nav { display: flex; align-items: center; gap: 0.5rem; }
        .adm-date-btn { background: rgba(196,158,90,0.08); border: 1px solid rgba(196,158,90,0.2); color: rgba(196,158,90,0.8); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
        .adm-date-btn:hover { background: rgba(196,158,90,0.16); border-color: rgba(196,158,90,0.5); }
        .adm-date-label { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 300; color: #f5f0e8; min-width: 140px; text-align: center; }
        .adm-view-tabs { display: flex; gap: 1px; background: rgba(196,158,90,0.1); margin-left: auto; }
        .adm-view-tab { padding: 0.5rem 1.1rem; background: #111009; border: none; cursor: pointer; font-family: 'Jost', sans-serif; font-size: 0.62rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,240,232,0.35); transition: all 0.2s; }
        .adm-view-tab:hover { color: rgba(245,240,232,0.6); background: rgba(196,158,90,0.06); }
        .adm-view-tab.adm-active { background: #c49e5a; color: #0e0c09; }
        .adm-btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.2rem; background: transparent; border: 1px solid rgba(196,158,90,0.4); font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #c49e5a; cursor: pointer; transition: all 0.25s; }
        .adm-btn-primary:hover { background: rgba(196,158,90,0.1); border-color: #c49e5a; }

        /* ── Stats row ── */
        .adm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(196,158,90,0.1); border-bottom: 1px solid rgba(196,158,90,0.1); }
        .adm-stat { background: #0e0c09; padding: 1.2rem 1.6rem; }
        .adm-stat-label { font-size: 0.56rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(196,158,90,0.45); margin-bottom: 0.35rem; }
        .adm-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: #f5f0e8; line-height: 1; }
        .adm-stat-sub { font-size: 0.65rem; color: rgba(245,240,232,0.22); margin-top: 0.2rem; }

        /* ── Timeline view ── */
        .adm-timeline { flex: 1; overflow: auto; padding: 1.5rem 2rem; }
        .adm-tl-grid { display: grid; min-width: 700px; }
        .adm-tl-header { display: flex; border-bottom: 1px solid rgba(196,158,90,0.1); padding-bottom: 0.75rem; margin-bottom: 0; }
        .adm-tl-time-col { width: 56px; flex-shrink: 0; }
        .adm-tl-tech-col { flex: 1; text-align: center; padding: 0 4px; }
        .adm-tl-tech-name { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 400; color: #f5f0e8; }
        .adm-tl-tech-count { font-size: 0.58rem; color: rgba(245,240,232,0.3); margin-top: 0.15rem; }
        .adm-tl-body { display: flex; position: relative; }
        .adm-tl-times { width: 56px; flex-shrink: 0; position: relative; }
        .adm-tl-hour-label { position: absolute; font-size: 0.58rem; color: rgba(245,240,232,0.25); line-height: 1; transform: translateY(-50%); right: 8px; }
        .adm-tl-cols { display: flex; flex: 1; border-left: 1px solid rgba(196,158,90,0.08); }
        .adm-tl-col { flex: 1; position: relative; border-right: 1px solid rgba(196,158,90,0.06); }
        .adm-tl-hour-line { position: absolute; left: 0; right: 0; height: 1px; background: rgba(196,158,90,0.07); }
        .adm-tl-now-line { position: absolute; left: 0; right: 0; height: 2px; background: rgba(220,85,85,0.6); z-index: 5; }
        .adm-tl-now-line::before { content: ''; position: absolute; left: -5px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: rgba(220,85,85,0.8); }

        /* ── List view ── */
        .adm-list { flex: 1; overflow-y: auto; padding: 1.5rem 2rem; }
        .adm-list-table { border: 1px solid rgba(196,158,90,0.1); overflow: hidden; }
        .adm-list-head { display: grid; grid-template-columns: 2fr 1.5fr 2fr 1fr 1fr 1.2fr; padding: 0.7rem 1.2rem; background: rgba(196,158,90,0.05); border-bottom: 1px solid rgba(196,158,90,0.1); gap: 0.5rem; }
        .adm-th { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(196,158,90,0.45); }
        .adm-list-row { display: grid; grid-template-columns: 2fr 1.5fr 2fr 1fr 1fr 1.2fr; padding: 1rem 1.2rem; border-bottom: 1px solid rgba(196,158,90,0.07); align-items: center; gap: 0.5rem; cursor: pointer; transition: background 0.18s; }
        .adm-list-row:last-child { border-bottom: none; }
        .adm-list-row:hover { background: rgba(196,158,90,0.04); }
        .adm-cell-client { display: flex; align-items: center; gap: 0.65rem; }
        .adm-client-init { width: 30px; height: 30px; border-radius: 50%; background: rgba(196,158,90,0.1); border: 1px solid rgba(196,158,90,0.2); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 0.75rem; color: #c49e5a; flex-shrink: 0; }
        .adm-client-name { font-size: 0.88rem; font-weight: 400; color: #f5f0e8; }
        .adm-client-id { font-size: 0.6rem; color: rgba(245,240,232,0.25); }
        .adm-cell-text { font-size: 0.8rem; color: rgba(245,240,232,0.65); }
        .adm-cell-time { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 300; color: rgba(245,240,232,0.7); }
        .adm-inspo-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #c49e5a; margin-left: 4px; vertical-align: middle; }
        .adm-empty { padding: 4rem; text-align: center; color: rgba(245,240,232,0.2); font-size: 0.85rem; font-weight: 300; letter-spacing: 0.05em; }

        /* ── Techs management view ── */
        .adm-techs { flex: 1; overflow-y: auto; padding: 1.5rem 2rem; }
        .adm-techs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1px; background: rgba(196,158,90,0.1); }
        .adm-tech-card { background: #111009; padding: 1.6rem; display: flex; flex-direction: column; gap: 1rem; }
        .adm-tech-card-top { display: flex; align-items: center; gap: 0.9rem; }
        .adm-tech-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 400; color: #f5f0e8; }
        .adm-tech-role { font-size: 0.68rem; color: rgba(245,240,232,0.35); margin-top: 0.1rem; letter-spacing: 0.05em; }
        .adm-tech-email { font-size: 0.7rem; color: rgba(196,158,90,0.6); }
        .adm-tech-pending { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(180,160,100,0.7); background: rgba(180,160,100,0.08); border: 1px solid rgba(180,160,100,0.2); padding: 0.2rem 0.6rem; width: fit-content; }
        .adm-tech-actions { display: flex; gap: 0.5rem; margin-top: auto; }
        .adm-tech-btn { flex: 1; padding: 0.5rem; background: transparent; border: 1px solid rgba(196,158,90,0.15); font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(196,158,90,0.6); cursor: pointer; transition: all 0.2s; }
        .adm-tech-btn:hover { background: rgba(196,158,90,0.08); border-color: rgba(196,158,90,0.4); color: #c49e5a; }
        .adm-tech-btn--danger { border-color: rgba(220,85,85,0.2); color: rgba(220,85,85,0.6); }
        .adm-tech-btn--danger:hover { background: rgba(220,85,85,0.07); border-color: rgba(220,85,85,0.5); color: rgba(220,85,85,0.9); }
        .adm-tech-stats { display: flex; gap: 1rem; }
        .adm-tech-stat { display: flex; flex-direction: column; gap: 0.1rem; }
        .adm-tech-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 300; color: #f5f0e8; }
        .adm-tech-stat-label { font-size: 0.58rem; color: rgba(245,240,232,0.25); letter-spacing: 0.08em; }

        /* ── Panels (right slide-over) ── */
        .adm-overlay { position: fixed; inset: 0; background: rgba(8,6,4,0.7); z-index: 200; display: flex; align-items: stretch; justify-content: flex-end; }
        .adm-panel { width: 460px; background: #111009; border-left: 1px solid rgba(196,158,90,0.15); display: flex; flex-direction: column; overflow-y: auto; animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .adm-panel-top { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.8rem; border-bottom: 1px solid rgba(196,158,90,0.1); }
        .adm-panel-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; font-style: italic; color: #f5f0e8; }
        .adm-panel-close { background: none; border: none; color: rgba(245,240,232,0.35); font-size: 1.1rem; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
        .adm-panel-close:hover { color: #f5f0e8; }
        .adm-panel-body { padding: 1.8rem; display: flex; flex-direction: column; gap: 1.4rem; flex: 1; }
        .adm-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(196,158,90,0.1); }
        .adm-info-cell { background: #111009; padding: 0.85rem 1rem; }
        .adm-info-label { font-size: 0.56rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(196,158,90,0.45); margin-bottom: 0.35rem; }
        .adm-info-val { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 300; color: #f5f0e8; }
        .adm-section-title { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(196,158,90,0.5); margin-bottom: 0.6rem; }
        .adm-status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; }
        .adm-status-opt { padding: 0.55rem 0.4rem; background: transparent; border: 1px solid rgba(196,158,90,0.12); font-family: 'Jost', sans-serif; font-size: 0.58rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(245,240,232,0.4); cursor: pointer; transition: all 0.2s; text-align: center; }
        .adm-status-opt:hover { border-color: rgba(196,158,90,0.35); color: rgba(245,240,232,0.7); background: rgba(196,158,90,0.05); }
        .adm-status-opt.adm-status-current { border-color: rgba(196,158,90,0.6); background: rgba(196,158,90,0.1); color: #c49e5a; }
        .adm-notes { width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(196,158,90,0.15); color: #f5f0e8; font-family: 'Jost', sans-serif; font-size: 0.8rem; padding: 0.75rem; resize: vertical; outline: none; min-height: 80px; transition: border-color 0.2s; }
        .adm-notes:focus { border-color: rgba(196,158,90,0.4); }

        /* ── Add tech modal ── */
        .adm-modal { position: fixed; inset: 0; background: rgba(8,6,4,0.8); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .adm-modal-box { background: #111009; border: 1px solid rgba(196,158,90,0.2); width: 100%; max-width: 480px; }
        .adm-modal-head { padding: 1.5rem 1.8rem; border-bottom: 1px solid rgba(196,158,90,0.1); display: flex; align-items: center; justify-content: space-between; }
        .adm-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 300; font-style: italic; color: #f5f0e8; }
        .adm-modal-body { padding: 1.8rem; display: flex; flex-direction: column; gap: 1.2rem; }
        .adm-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .adm-field label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(196,158,90,0.55); }
        .adm-field input { background: rgba(255,255,255,0.03); border: 1px solid rgba(196,158,90,0.15); color: #f5f0e8; font-family: 'Jost', sans-serif; font-size: 0.85rem; padding: 0.75rem 0.9rem; outline: none; transition: border-color 0.2s; width: 100%; }
        .adm-field input:focus { border-color: rgba(196,158,90,0.45); }
        .adm-field input::placeholder { color: rgba(245,240,232,0.2); }
        .adm-modal-actions { display: flex; gap: 0.75rem; padding: 0 1.8rem 1.8rem; }
        .adm-btn-send { flex: 1; padding: 0.9rem; background: #c49e5a; border: none; font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #0a0806; cursor: pointer; transition: background 0.2s; }
        .adm-btn-send:hover { background: #d4ae6a; }
        .adm-btn-send:disabled { background: rgba(196,158,90,0.3); cursor: not-allowed; }
        .adm-btn-cancel { padding: 0.9rem 1.5rem; background: transparent; border: 1px solid rgba(196,158,90,0.2); font-family: 'Jost', sans-serif; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(245,240,232,0.4); cursor: pointer; transition: all 0.2s; }
        .adm-btn-cancel:hover { border-color: rgba(196,158,90,0.4); color: rgba(245,240,232,0.7); }
        .adm-invite-success { text-align: center; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
        .adm-invite-icon { font-size: 2rem; }
        .adm-invite-msg { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 300; color: #f5f0e8; }
        .adm-invite-sub { font-size: 0.75rem; color: rgba(245,240,232,0.35); }

        /* ── Notification toast ── */
        .adm-toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; background: #1a1612; border: 1px solid rgba(196,158,90,0.3); border-left: 3px solid #c49e5a; padding: 0.9rem 1.4rem; display: flex; align-items: center; gap: 0.7rem; animation: toastIn 0.3s ease; min-width: 260px; }
        .adm-toast.error { border-left-color: #e05555; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .adm-toast-msg { font-size: 0.78rem; color: #f5f0e8; }

        @media (max-width: 900px) {
          .adm-side { display: none; }
          .adm-stats { grid-template-columns: repeat(2, 1fr); }
          .adm-list-head, .adm-list-row { grid-template-columns: 2fr 1.5fr 1fr 1.2fr; }
          .adm-list-head *:nth-child(3), .adm-list-row *:nth-child(3) { display: none; }
          .adm-panel { width: 100%; }
        }
      `}</style>

      <div className="adm">

       <div className="adm-top">
  <div className="adm-logo">Finer Nails <em>&</em> Spa <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', fontFamily: 'Jost', fontWeight: 300 }}>/ Admin</span></div>
  <div className="adm-top-right">
    <div className="adm-live"><div className="adm-live-dot" />Live</div>
    <div className="adm-badge">Admin</div>
    <div style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>
      {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
    </div>
    <UserMenu />
  </div>
</div>

        <div className="adm-body">

          {/* ── Sidebar ── */}
          <div className="adm-side">
            <div className="adm-nav">
              <div className="adm-side-section">Dashboard</div>
              {[
                { key: 'timeline', icon: '▤', label: 'Timeline View' },
                { key: 'list',     icon: '☰', label: 'Booking List'  },
                { key: 'techs',    icon: '◈', label: 'Manage Techs'  },
              ].map(({ key, icon, label }) => (
                <button key={key} className={`adm-nav-btn ${view === key ? 'adm-active' : ''}`} onClick={() => setView(key)}>
                  <span className="adm-nav-icon">{icon}</span>{label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div className="adm-side-section">Filter by Tech</div>
              <div className="adm-tech-filter">
  <button className={`adm-tf-btn ${filterTech === 'all' ? 'adm-tf-active' : ''}`} onClick={() => setFilterTech('all')}>
    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(196,158,90,0.12)', border: '1px solid rgba(196,158,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#c49e5a', flexShrink: 0 }}>✦</span>
    All Technicians
  </button>
  {techs.map(t => (
    <button key={t.id} className={`adm-tf-btn ${filterTech === t.id ? 'adm-tf-active' : ''}`} onClick={() => setFilterTech(t.id)}>
      <TechAvatar tech={t} size={20} />
      {t.name}
    </button>
  ))}
</div>
            </div>

            <div style={{ marginTop: 'auto', padding: '1.4rem' }}>
              <button className="adm-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setShowAddTech(true); setInviteSent(false); setInviteForm({ name: '', email: '', role: '', tempPassword: '' }); }}>
  + Add Technician
</button>
            </div>
          </div>

          {/* ── Main ── */}
          <div className="adm-main">

            {/* Stats */}
            <div className="adm-stats">
              {[
                { label: "Today's Appts",  val: stats.totalToday,  sub: 'across all technicians'    },
               // { label: 'Confirmed',       val: stats.confirmed,   sub: 'ready to go'               },
               // { label: 'In Progress',     val: stats.inProgress,  sub: 'currently being served'    },
                { label: 'Upcoming',        val: stats.upcoming,    sub: 'from tomorrow onward'       },
              ].map(({ label, val, sub }) => (
                <div key={label} className="adm-stat">
                  <div className="adm-stat-label">{label}</div>
                  <div className="adm-stat-val">{val}</div>
                  <div className="adm-stat-sub">{sub}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="adm-toolbar">
              <div className="adm-date-nav">
                <button className="adm-date-btn" onClick={() => { const d = new Date(viewDate); d.setDate(d.getDate()-1); setViewDate(d.toISOString().split('T')[0]); }}>‹</button>
                <div className="adm-date-label">{formatDateLabel(viewDate)}, {new Date(viewDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</div>
                <button className="adm-date-btn" onClick={() => { const d = new Date(viewDate); d.setDate(d.getDate()+1); setViewDate(d.toISOString().split('T')[0]); }}>›</button>
              </div>
              <button className="adm-date-btn" style={{ padding: '0 0.75rem', width: 'auto', fontSize: '0.6rem', letterSpacing: '0.12em' }} onClick={() => setViewDate(todayStr())}>Today</button>
              <div className="adm-view-tabs" style={{ marginLeft: 'auto' }}>
                {[['timeline','Timeline'],['list','List'],['techs','Techs']].map(([k,l]) => (
                  <button key={k} className={`adm-view-tab ${view === k ? 'adm-active' : ''}`} onClick={() => setView(k)}>{l}</button>
                ))}
              </div>
            </div>

            {/* ── TIMELINE VIEW ── */}
            {view === 'timeline' && (
              <div className="adm-timeline">
                {(() => {
                  const visibleTechs = techs.filter(t => t.active && (filterTech === 'all' || filterTech === t.id));
                  const gridCols     = `56px ${visibleTechs.map(() => '1fr').join(' ')}`;
                  const tlHeight     = 720; // 12hr × 60px/hr
                  const pxPerMin     = tlHeight / (12 * 60);
                  const nowMin       = new Date().getHours() * 60 + new Date().getMinutes() - 8 * 60;
                  const showNow      = viewDate === todayStr() && nowMin >= 0 && nowMin <= 12 * 60;

                  return (
                    <div style={{ minWidth: 600 }}>
                      {/* Header row */}
                      <div style={{ display: 'grid', gridTemplateColumns: gridCols, paddingBottom: '0.75rem', borderBottom: '1px solid rgba(196,158,90,0.1)', marginBottom: 0 }}>
                        <div />
                        {visibleTechs.map(t => (
                          <div key={t.id} style={{ textAlign: 'center', padding: '0 4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                              <TechAvatar tech={t} size={32} />
                              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: '#f5f0e8' }}>{t.name}</div>
                              <div style={{ fontSize: '0.58rem', color: 'rgba(245,240,232,0.3)' }}>
                                {dayAppts.filter(a => a.tech_id === t.id).length} appt{dayAppts.filter(a => a.tech_id === t.id).length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Grid body */}
                      <div style={{ display: 'grid', gridTemplateColumns: gridCols, position: 'relative' }}>
                        {/* Time labels */}
                        <div style={{ position: 'relative', height: tlHeight }}>
                          {HOURS.map(h => (
                            <div key={h} style={{ position: 'absolute', top: (h - 8) * 60 * pxPerMin, right: 8, fontSize: '0.58rem', color: 'rgba(245,240,232,0.22)', transform: 'translateY(-50%)' }}>
                              {fmtHour(h)}
                            </div>
                          ))}
                        </div>

                        {/* Tech columns */}
                        {visibleTechs.map(t => (
                          <div key={t.id} style={{ position: 'relative', height: tlHeight, borderLeft: '1px solid rgba(196,158,90,0.08)' }}>
                            {/* Hour lines */}
                            {HOURS.map(h => (
                              <div key={h} style={{ position: 'absolute', top: (h - 8) * 60 * pxPerMin, left: 0, right: 0, height: 1, background: 'rgba(196,158,90,0.06)' }} />
                            ))}
                            {/* Now line */}
                            {showNow && <div style={{ position: 'absolute', top: nowMin * pxPerMin, left: 0, right: 0, height: 2, background: 'rgba(220,85,85,0.55)', zIndex: 5, pointerEvents: 'none' }}>
                              <div style={{ position: 'absolute', left: -4, top: -4, width: 10, height: 10, borderRadius: '50%', background: 'rgba(220,85,85,0.8)' }} />
                            </div>}
                            {/* Appointment blocks */}
                            {dayAppts.filter(a => a.tech_id === t.id).map(appt => {
                              const sm = parseTime(appt.start) - 8 * 60;
                              const em = parseTime(appt.end)   - 8 * 60;
                              const h  = Math.max((em - sm) * pxPerMin, 36);
                              const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.booked;
                              return (
                                <div key={appt.id}
                                  onClick={() => setSelectedAppt(appt)}
                                  style={{ position: 'absolute', left: 4, right: 4, top: sm * pxPerMin, height: h, background: `${t.color}14`, borderLeft: `3px solid ${t.color}`, padding: '4px 6px', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.15s', zIndex: 2, borderRadius: 2 }}
                                  onMouseEnter={e => { e.currentTarget.style.background = `${t.color}26`; e.currentTarget.style.zIndex = '10'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = `${t.color}14`; e.currentTarget.style.zIndex = '2'; }}
                                >
                                  <div style={{ fontSize: '0.62rem', fontWeight: 600, color: t.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.client}</div>
                                  {h > 45 && <div style={{ fontSize: '0.55rem', color: 'rgba(245,240,232,0.4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.service}</div>}
                                  {h > 60 && <div style={{ marginTop: 3 }}><StatusBadge status={appt.status} /></div>}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── LIST VIEW ── */}
            {view === 'list' && (
              <div className="adm-list">
                <div className="adm-list-table">
                  <div className="adm-list-head">
                    <span className="adm-th">Client</span>
                    <span className="adm-th">Technician</span>
                    <span className="adm-th">Service</span>
                    <span className="adm-th">Time</span>
                    <span className="adm-th">Duration</span>
                    <span className="adm-th">Status</span>
                  </div>
                  {dayAppts.length === 0 && <div className="adm-empty">No appointments for this day</div>}
                  {dayAppts.sort((a,b) => a.start.localeCompare(b.start)).map(appt => {
                    const tech = techs.find(t => t.id === appt.tech_id);
                    const dur  = parseTime(appt.end) - parseTime(appt.start);
                    return (
                      <div key={appt.id} className="adm-list-row" onClick={() => setSelectedAppt(appt)}>
                        <div className="adm-cell-client">
                          <div className="adm-client-init">{appt.client.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                          <div>
                            <div className="adm-client-name">{appt.client}{appt.inspo && <span className="adm-inspo-dot" title="Has inspo images" />}</div>
                            <div className="adm-client-id">{appt.id}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {tech && <TechAvatar tech={tech} size={26} />}
                          <span className="adm-cell-text">{tech?.name}</span>
                        </div>
                        <div className="adm-cell-text" style={{ fontSize: '0.78rem' }}>{appt.service}</div>
                        <div className="adm-cell-time">{fmtTime(appt.start)} – {fmtTime(appt.end)}</div>
                        <div className="adm-cell-text">{dur}m</div>
                        <div><StatusBadge status={appt.status} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TECHS VIEW ── */}
            {view === 'techs' && (
              <div className="adm-techs">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 300, color: '#f5f0e8' }}>Technician Management</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.3)', marginTop: '0.25rem' }}>{techs.filter(t=>t.active).length} active · {techs.filter(t=>!t.active).length} pending</div>
                  </div>
                  <button className="adm-btn-primary" onClick={() => { setShowAddTech(true); setInviteSent(false); setInviteForm({ name:'',email:'',role:'' }); }}>
                    + Add Technician
                  </button>
                </div>
                <div className="adm-techs-grid">
                  {techs.map(t => {
                    const tAppts = appointments.filter(a => a.tech_id === t.id && a.date === todayStr());
                    return (
                      <div key={t.id} className="adm-tech-card">
                        <div className="adm-tech-card-top">
                          <TechAvatar tech={t} size={44} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="adm-tech-name">{t.name}</div>
                            <div className="adm-tech-role">{t.role}</div>
                            <div className="adm-tech-email">{t.email}</div>
                          </div>
                          {!t.active && <div className="adm-tech-pending">Pending</div>}
                        </div>
                        <div className="adm-tech-stats">
                          <div className="adm-tech-stat"><div className="adm-tech-stat-val">{tAppts.length}</div><div className="adm-tech-stat-label">Today</div></div>
                          <div className="adm-tech-stat"><div className="adm-tech-stat-val">{appointments.filter(a=>a.tech_id===t.id&&a.date>todayStr()).length}</div><div className="adm-tech-stat-label">Upcoming</div></div>
                          <div className="adm-tech-stat"><div className="adm-tech-stat-val">{appointments.filter(a=>a.tech_id===t.id&&a.status==='completed').length}</div><div className="adm-tech-stat-label">Done</div></div>
                        </div>
                        <div className="adm-tech-actions">
  <button
    className="adm-tech-btn"
    onClick={() => { setFilterTech(t.id); setView('timeline'); }}
  >
    View Schedule
  </button>
  <button
    className="adm-tech-btn"
    onClick={() => handleResetPassword(t)}
  >
    Reset Password
  </button>
  <button
    className="adm-tech-btn adm-tech-btn--danger"
    onClick={() => handleRemoveTech(t.id)}
  >
    Remove
  </button>
</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Appointment Detail Panel ── */}
        {selectedAppt && (
          <div className="adm-overlay" onClick={() => setSelectedAppt(null)}>
            <div className="adm-panel" onClick={e => e.stopPropagation()}>
              <div className="adm-panel-top">
                <div>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,158,90,0.5)', marginBottom: '0.3rem' }}>{selectedAppt.id}</div>
                  <div className="adm-panel-title">{selectedAppt.client}</div>
                </div>
                <button className="adm-panel-close" onClick={() => setSelectedAppt(null)}>✕</button>
              </div>
              <div className="adm-panel-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={selectedAppt.status} size="md" />
                  {selectedAppt.inspo && <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c49e5a' }}>✦ Has inspo images</span>}
                </div>

                <div className="adm-info-grid">
                  {[
                    { l: 'Service',     v: selectedAppt.service },
                    { l: 'Technician',  v: techs.find(t=>t.id===selectedAppt.tech_id)?.name },
                    { l: 'Date',        v: new Date(selectedAppt.date+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'}) },
                    { l: 'Time',        v: `${fmtTime(selectedAppt.start)} – ${fmtTime(selectedAppt.end)}` },
                    { l: 'Duration',    v: `${parseTime(selectedAppt.end)-parseTime(selectedAppt.start)} min` },
                    { l: 'Phone',       v: selectedAppt.phone || '—' },
                  ].map(({ l, v }) => (
                    <div key={l} className="adm-info-cell">
                      <div className="adm-info-label">{l}</div>
                      <div className="adm-info-val" style={{ fontSize: l==='Date'?'0.82rem':'1rem' }}>{v}</div>
                    </div>
                  ))}
                </div>

                {selectedAppt.notes && (
                  <div>
                    <div className="adm-section-title">Client Notes</div>
                    <div style={{ padding: '0.75rem', background: 'rgba(196,158,90,0.05)', border: '1px solid rgba(196,158,90,0.1)', fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)', lineHeight: 1.6 }}>{selectedAppt.notes}</div>
                  </div>
                )}

                <div>
                  <div className="adm-section-title">Update Status</div>
                  <div className="adm-status-grid">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button key={key} className={`adm-status-opt ${selectedAppt.status === key ? 'adm-status-current' : ''}`} onClick={() => updateStatus(selectedAppt.id, key)}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="adm-section-title">Internal Notes</div>
                  <textarea className="adm-notes" placeholder="Add internal notes…" defaultValue={selectedAppt.notes} />
                </div>

                <button style={{ padding: '0.9rem', background: 'rgba(220,85,85,0.08)', border: '1px solid rgba(220,85,85,0.25)', fontFamily: "'Jost',sans-serif", fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(220,85,85,0.75)', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }} onClick={() => { updateStatus(selectedAppt.id, 'cancelled'); setSelectedAppt(null); }}>
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        )}

       {/* ── Add Tech Modal ── */}
{showAddTech && (
  <div className="adm-modal" onClick={() => setShowAddTech(false)}>
    <div className="adm-modal-box" onClick={e => e.stopPropagation()}>
      <div className="adm-modal-head">
        <div className="adm-modal-title">{inviteSent ? 'Account Created!' : 'Add Technician'}</div>
        <button className="adm-panel-close" onClick={() => setShowAddTech(false)}>✕</button>
      </div>

      {inviteSent ? (
        <div className="adm-invite-success" style={{ padding: '2rem 1.8rem' }}>
          <div className="adm-invite-icon">✅</div>
          <div className="adm-invite-msg">Account created for {inviteForm.name}</div>
          <div className="adm-invite-sub" style={{
            background: 'rgba(196,158,90,0.08)',
            border: '1px solid rgba(196,158,90,0.2)',
            padding: '1rem',
            marginTop: '1rem',
            borderRadius: '4px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#f5f0e8', marginBottom: '0.5rem' }}>
              <strong>Login Details:</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.6)', lineHeight: 1.8 }}>
              📧 Email: <strong style={{ color: '#c49e5a' }}>{inviteForm.email}</strong><br />
              🔑 Password: <strong style={{ color: '#c49e5a' }}>{inviteForm.tempPassword}</strong>
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'rgba(245,240,232,0.3)',
              marginTop: '0.75rem',
              fontStyle: 'italic'
            }}>
              Save these credentials - the password won't be shown again.
            </div>
          </div>
          <button
            className="adm-btn-send"
            style={{ marginTop: '1rem', padding: '0.75rem 2rem', width: 'auto' }}
            onClick={() => {
              setInviteSent(false);
              setInviteForm({ name:'', email:'', role:'', tempPassword:'' });
            }}
          >
            Add Another
          </button>
        </div>
      ) : (
        <>
          <div className="adm-modal-body">
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(245,240,232,0.35)',
              lineHeight: 1.6,
              padding: '0.75rem',
              background: 'rgba(196,158,90,0.05)',
              border: '1px solid rgba(196,158,90,0.12)',
              borderLeft: '2px solid #c49e5a',
              marginBottom: '0.5rem'
            }}>
              Create an account for your technician. They can log in immediately with the credentials you provide.
            </div>

            <div className="adm-field">
              <label>Full Name</label>
              <input
                placeholder="e.g. Amara Wanjiku"
                value={inviteForm.name}
                onChange={e => setInviteForm(f => ({...f, name: e.target.value}))}
              />
            </div>

            <div className="adm-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="technician@example.com"
                value={inviteForm.email}
                onChange={e => setInviteForm(f => ({...f, email: e.target.value}))}
              />
            </div>

            <div className="adm-field">
              <label>Password</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Set a password or generate one"
                  value={inviteForm.tempPassword || ''}
                  onChange={e => setInviteForm(f => ({...f, tempPassword: e.target.value}))}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    // Generate a random password
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
                    let password = '';
                    for (let i = 0; i < 10; i++) {
                      password += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    setInviteForm(f => ({...f, tempPassword: password}));
                  }}
                  style={{
                    padding: '0.7rem 1rem',
                    background: 'rgba(196,158,90,0.1)',
                    border: '1px solid rgba(196,158,90,0.3)',
                    color: '#c49e5a',
                    cursor: 'pointer',
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="adm-field">
              <label>Role (optional)</label>
              <input
                placeholder="e.g. Acrylic & Extensions Expert"
                value={inviteForm.role}
                onChange={e => setInviteForm(f => ({...f, role: e.target.value}))}
              />
            </div>
          </div>

          <div className="adm-modal-actions">
            <button className="adm-btn-cancel" onClick={() => setShowAddTech(false)}>
              Cancel
            </button>
            <button
              className="adm-btn-send"
              disabled={!inviteForm.name || !inviteForm.email || !inviteForm.tempPassword || inviteLoading}
              onClick={handleCreateTech}
            >
              {inviteLoading ? 'Creating...' : 'Create Account →'}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

{/* ── Reset Password Modal ── */}
{showResetPassword && (
  <div className="adm-modal" onClick={() => setShowResetPassword(false)}>
    <div className="adm-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
      <div className="adm-modal-head">
        <div className="adm-modal-title">Reset Password</div>
        <button className="adm-panel-close" onClick={() => setShowResetPassword(false)}>✕</button>
      </div>
      <div className="adm-modal-body">
        <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.6)', marginBottom: '1rem' }}>
          New password for <strong style={{ color: '#c49e5a' }}>{resetPasswordForm.name}</strong>:
        </p>

        <div className="adm-field">
          <label>New Password</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={resetPasswordForm.newPassword}
              onChange={e => setResetPasswordForm(f => ({...f, newPassword: e.target.value}))}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => {
                const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
                let password = '';
                for (let i = 0; i < 10; i++) {
                  password += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                setResetPasswordForm(f => ({...f, newPassword: password}));
              }}
              style={{
                padding: '0.7rem 1rem',
                background: 'rgba(196,158,90,0.1)',
                border: '1px solid rgba(196,158,90,0.3)',
                color: '#c49e5a',
                cursor: 'pointer',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap'
              }}
            >
              Generate
            </button>
          </div>
        </div>

        <div style={{
          padding: '0.75rem',
          background: 'rgba(196,158,90,0.05)',
          border: '1px solid rgba(196,158,90,0.1)',
          borderLeft: '2px solid #c49e5a',
          fontSize: '0.7rem',
          color: 'rgba(245,240,232,0.4)',
          marginTop: '0.5rem'
        }}>
          The technician will need to use this new password on their next login.
        </div>
      </div>
      <div className="adm-modal-actions">
        <button className="adm-btn-cancel" onClick={() => setShowResetPassword(false)}>Cancel</button>
        <button className="adm-btn-send" onClick={confirmResetPassword}>
          Reset Password →
        </button>
      </div>
    </div>
  </div>
)}


        {/* ── Toast ── */}
        {notification && (
          <div className={`adm-toast ${notification.type === 'error' ? 'error' : ''}`}>
            <span style={{ color: notification.type === 'error' ? '#e05555' : '#c49e5a', fontSize: '0.9rem' }}>
              {notification.type === 'error' ? '✕' : '✦'}
            </span>
            <span className="adm-toast-msg">{notification.msg}</span>
          </div>
        )}

      </div>
    </>
  );
}