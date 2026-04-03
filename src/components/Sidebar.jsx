import React from 'react';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sb-logo">B</div>
      <div className="sb-nav">
        <div className="sb-item" id="sni-dash" data-tip="Dashboard" onClick={() => window.navigate('dash')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
        </div>
        <div className="sb-item on" id="sni-catalog" data-tip="Dataset Catalog" onClick={() => window.navigate('catalog')}>
          <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
        </div>
        <div className="sb-item" id="sni-ref" data-tip="Reference Data" onClick={() => window.navigate('ref')}>
          <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        </div>
      </div>
    </nav>
  );
}
