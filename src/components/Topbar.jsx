import React from 'react';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-logo" style={{display:'none'}}>
        <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(145deg,#6fae6d,#3d7a5a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0,boxShadow:'0 4px 14px rgba(111,174,109,.35)'}}>B</div>
        <span style={{fontSize:13,fontWeight:700,color:'var(--tx)',letterSpacing:'-.2px'}}>BondBulls</span>
      </div>
      <div className="tb-acts">
        {/* theme toggle pill */}
        <div className="theme-pill">
          <div className="topt on" id="topt-light" onClick={() => window.setTheme('light')} title="Light">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </div>
          <div className="topt" id="topt-dark" onClick={() => window.setTheme('dark')} title="Dark">
            <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          </div>
        </div>
        {/* compare */}
        <div className="tb-btn" id="btn-compare" onClick={() => window.togglePanel('compare')} title="Compare">
          <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
        </div>
        {/* watchlist */}
        <div className="tb-btn" id="btn-watchlist" onClick={() => window.togglePanel('watchlist')} title="Watchlist">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        {/* notifications */}
        <div className="tb-btn" title="Notifications">
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span className="tb-dot"></span>
        </div>
        {/* profile */}
        <div className="tb-profile">
          <div className="tb-pav">AK</div>
          <div>
            <div className="tb-pname">Arjun Kumar</div>
            <div className="tb-pemail"><a href="/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="32534058475c72505d5c5650475e5e411c5b5c">[email&#160;protected]</a></div>
          </div>
        </div>
      </div>
    </header>
  );
}
