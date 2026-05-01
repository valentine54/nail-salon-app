// src/pages/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the full URL hash
        const hash = window.location.hash;
        console.log('Auth callback - hash:', hash);

        if (!hash || hash === '#') {
          // No hash, redirect to login
          navigate('/login');
          return;
        }

        // Parse the hash parameters
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Auth callback - type:', type);
        console.log('Auth callback - has access token:', !!accessToken);

        if (!accessToken || !refreshToken) {
          setError('Invalid authentication link. Missing tokens.');
          setProcessing(false);
          return;
        }

        // Set the session
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (data?.user) {
          console.log('User authenticated:', data.user.email);

          // Clear the hash from the URL
          window.history.replaceState(null, '', '/auth-callback');

          // Check user role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          console.log('User role:', profile?.role);

          // Handle different auth types
          if (type === 'recovery') {
            // Password recovery - redirect to set password
            console.log('Recovery flow - redirecting to set-password');
            navigate('/set-password', { replace: true });
          } else if (type === 'invite') {
            // Invite - redirect to set password
            console.log('Invite flow - redirecting to set-password');
            navigate('/set-password', { replace: true });
          } else if (type === 'magiclink') {
            // Magic link - redirect based on role
            console.log('Magic link flow');
            if (profile?.role === 'Admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          } else {
            // Default - redirect based on role
            if (profile?.role === 'Admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed. The link may have expired or already been used.');
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
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
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#f5f0e8',
            marginBottom: '1rem'
          }}>
            Authentication Error
          </h2>
          <p style={{ color: '#e05555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#c49e5a',
              border: 'none',
              color: '#080604',
              cursor: 'pointer',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.8rem'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080604',
      fontFamily: 'Jost, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(196,158,90,0.2)',
          borderTopColor: '#c49e5a',
          borderRadius: '50%',
          margin: '0 auto 1.5rem',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#f5f0e8', fontSize: '0.9rem' }}>
          Verifying your identity...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}