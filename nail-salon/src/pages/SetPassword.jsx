// src/pages/SetPassword.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
      } else {
        // If no session, redirect to login
        // But first check if there's a hash that was already handled
        const hasHash = window.location.hash.includes('access_token');
        if (!hasHash) {
          navigate('/login');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);

      // Get user role and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setTimeout(() => {
          if (profile?.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080604',
      fontFamily: 'Jost, sans-serif'
    }}>
      <div style={{
        background: '#111009',
        border: '1px solid rgba(196,158,90,0.2)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px'
      }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#f5f0e8', marginBottom: '0.5rem' }}>Password Set!</h2>
            {userEmail && (
              <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem' }}>
                {userEmail}
              </p>
            )}
            <p style={{ color: 'rgba(245,240,232,0.4)', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.8rem',
              fontWeight: 300,
              color: '#f5f0e8',
              marginBottom: '0.5rem'
            }}>
              Set Your Password
            </h2>

            {userEmail && (
              <p style={{
                color: 'rgba(245,240,232,0.5)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                padding: '0.75rem',
                background: 'rgba(196,158,90,0.05)',
                border: '1px solid rgba(196,158,90,0.1)',
                borderLeft: '2px solid #c49e5a'
              }}>
                Setting password for: <strong style={{ color: '#c49e5a' }}>{userEmail}</strong>
              </p>
            )}

            {error && (
              <div style={{
                background: 'rgba(220,85,85,0.1)',
                border: '1px solid rgba(220,85,85,0.2)',
                color: '#e05555',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.8rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSetPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(196,158,90,0.6)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(196,158,90,0.2)',
                    color: '#f5f0e8',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(196,158,90,0.6)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(196,158,90,0.2)',
                    color: '#f5f0e8',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: '#c49e5a',
                  border: 'none',
                  color: '#080604',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  fontSize: '0.85rem'
                }}
              >
                {loading ? 'Setting Password...' : 'Create Password →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}