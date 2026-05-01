// src/components/UserMenu.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function UserMenu() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'rgba(196,158,90,0.08)',
          border: '1px solid rgba(196,158,90,0.2)',
          color: '#c49e5a',
          padding: '0.4rem 0.9rem',
          cursor: 'pointer',
          fontSize: '0.72rem',
          fontFamily: 'Jost, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'rgba(196,158,90,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem',
          fontFamily: "'Cormorant Garamond', serif"
        }}>
          {user.email?.[0].toUpperCase() || '?'}
        </span>
        <span>Account</span>
         <span style={{ fontSize: '0.55rem' }}>▼</span>
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: '#111009',
          border: '1px solid rgba(196,158,90,0.2)',
          minWidth: '200px',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>


          <button
            onClick={handleLogout}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'rgba(220,85,85,0.7)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'Jost, sans-serif',
              textAlign: 'left',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(196,158,90,0.08)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}