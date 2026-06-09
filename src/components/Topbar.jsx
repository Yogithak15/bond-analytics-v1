import React, { useState, useRef, useEffect } from 'react';
import { authClient } from '../lib/auth-client';

export default function Topbar({ session, onNavigate }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const userName  = session?.user?.name  || session?.name  || 'User';
  const userEmail = session?.user?.email || session?.email || '';
  const initials  = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <header className="topbar">
      <div className="topbar-logo" style={{ display: 'none' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(145deg,#6fae6d,#3d7a5a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 4px 14px rgba(111,174,109,.35)' }}>B</div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.2px' }}>BondBulls</span>
      </div>

      <div className="tb-acts">
        {/* User dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '5px 10px', borderRadius: 8, transition: 'background 0.15s', background: open ? 'var(--sf2)' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--sf2)'}
            onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2557a7, #1a4285)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{userName}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{userEmail}</div>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          {/* Dropdown menu */}
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: 'var(--sf)', border: '1px solid var(--bdr2)',
              borderRadius: 10, boxShadow: 'var(--shlg)',
              minWidth: 200, overflow: 'hidden', zIndex: 1000,
            }}>
              {/* User info header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bdr)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{userName}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 1 }}>{userEmail}</div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px' }}>
                {/* <MenuItem
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  }
                  label="Manage Users"
                  onClick={() => { setOpen(false); onNavigate?.('users'); }}
                /> */}
                {/* <div style={{ height: 1, background: 'var(--bdr)', margin: '4px 0' }} /> */}
                <MenuItem
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  }
                  label="Sign Out"
                  danger
                  onClick={handleLogout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
        background: hover ? 'var(--sf2)' : 'transparent',
        color: danger ? (hover ? '#e07070' : '#c07070') : 'var(--tx2)',
        fontSize: 13, transition: 'background 0.15s, color 0.15s',
      }}
    >
      {icon}
      {label}
    </div>
  );
}
