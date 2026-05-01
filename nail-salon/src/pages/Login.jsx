import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate(data.role === 'Admin' ? '/admin' : '/dashboard', { replace: true });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080604', fontFamily: "'Jost', sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: '2.5rem', background: '#111009', border: '1px solid rgba(196,158,90,0.15)', borderRadius: 8 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#f5f0e8', marginBottom: '0.3rem', fontWeight: 300 }}>Team <em style={{ color: '#c49e5a' }}>Login</em></h2>
        <p style={{ color: 'rgba(245,240,232,0.35)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>Finer Nails & Spa</p>
        {error && <div style={{ background: 'rgba(220,85,85,0.08)', border: '1px solid rgba(220,85,85,0.2)', color: '#e05555', padding: '0.6rem', fontSize: '0.7rem', marginBottom: '1rem', borderRadius: 4 }}>{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: '0.7rem', marginBottom: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,158,90,0.15)', color: '#f5f0e8', fontSize: '0.85rem', outline: 'none', borderRadius: 4, fontFamily: "'Jost', sans-serif" }} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '0.7rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,158,90,0.15)', color: '#f5f0e8', fontSize: '0.85rem', outline: 'none', borderRadius: 4, fontFamily: "'Jost', sans-serif" }} required />
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '0.8rem', background: loading ? 'rgba(196,158,90,0.2)' : '#c49e5a', border: 'none', color: '#080604', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', borderRadius: 4, fontFamily: "'Jost', sans-serif" }}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}