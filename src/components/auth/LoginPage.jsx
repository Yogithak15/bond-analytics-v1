import { useState } from 'react';
import { authClient } from '../../lib/auth-client';

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 14px',
  background: '#040c1c',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#f0f4ff',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
};

function PasswordInput({ value, onChange, placeholder = '••••••••' }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        style={{ ...inputStyle, padding: '10px 42px 10px 14px' }}
        onFocus={e => e.target.style.borderColor = '#2557a7'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#3a5070', display: 'flex', alignItems: 'center' }}
      >
        {show ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#e07070', marginBottom: 20 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode]         = useState('signin'); // 'signin' | 'signup'
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data, error: authError } = await authClient.signIn.email({ email, password, callbackURL: '/' });
      if (authError) setError(authError.message || 'Invalid credentials');
      else if (data) onLogin();
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { data, error: authError } = await authClient.signUp.email({ name, email, password, callbackURL: '/' });
      if (authError) setError(authError.message || 'Sign up failed');
      else if (data) onLogin();
    } catch {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSignIn = mode === 'signin';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", background: '#040c1c' }}>

      {/* Left panel — branding */}
      <div style={{
        flex: '0 0 46%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 52px',
        background: 'linear-gradient(145deg, #040c1c 0%, #071528 60%, #0a1f3a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,87,167,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #2557a7, #1a4285)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 7 22 7 22 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#f0f4ff', letterSpacing: '-0.2px' }}>BondBulls</span>
        </div>

        {/* Center text */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2557a7', marginBottom: 16 }}>India Debt Markets</div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: '#f0f4ff', lineHeight: 1.2, letterSpacing: '-0.6px', margin: '0 0 20px' }}>
            Bond Analytics<br />
            <span style={{ color: '#a8c0e0', fontWeight: 400 }}>Intelligence Platform</span>
          </h1>
          <p style={{ fontSize: 15, color: '#6080a8', lineHeight: 1.7, maxWidth: 340, margin: 0 }}>
            Comprehensive insights across G-Secs, SDLs, Corporate Bonds, FPI flows and more — all in one place.
          </p>
        </div>

        <div style={{ fontSize: 12, color: '#3a5070', position: 'relative' }}>© 2026 BondBulls Analytics · Powered by RBI &amp; SEBI data</div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#08111f' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Tab toggle */}
          <div style={{ display: 'flex', background: '#040c1c', borderRadius: 10, padding: 4, marginBottom: 32, border: '1px solid rgba(255,255,255,0.08)' }}>
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: '8px', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m ? 'linear-gradient(135deg, #2557a7, #1a4285)' : 'transparent',
                  color: mode === m ? '#fff' : '#6080a8',
                  boxShadow: mode === m ? '0 2px 8px rgba(37,87,167,0.3)' : 'none',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
              {isSignIn ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ fontSize: 14, color: '#6080a8', margin: 0 }}>
              {isSignIn ? 'Enter your credentials to access the platform' : 'Sign up to get access to the platform'}
            </p>
          </div>

          <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>
            {/* Name — sign up only */}
            {!isSignIn && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a8c0e0', marginBottom: 7 }}>Full Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2557a7'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a8c0e0', marginBottom: 7 }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2557a7'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#a8c0e0', marginBottom: 7 }}>Password</label>
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder={isSignIn ? '••••••••' : 'Min 8 characters'} />
            </div>

            {success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#6fcf97', marginBottom: 20 }}>
                {success}
              </div>
            )}

            <ErrorBanner msg={error} />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px',
                background: loading ? 'rgba(37,87,167,0.4)' : 'linear-gradient(135deg, #2557a7, #1a4285)',
                color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.01em',
                boxShadow: loading ? 'none' : '0 2px 12px rgba(37,87,167,0.35)',
                transition: 'opacity 0.2s, box-shadow 0.2s',
              }}
            >
              {loading ? (isSignIn ? 'Signing in…' : 'Creating account…') : (isSignIn ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#3a5070', marginTop: 32 }}>
            Secure access · Session expires after inactivity
          </p>
        </div>
      </div>
    </div>
  );
}
