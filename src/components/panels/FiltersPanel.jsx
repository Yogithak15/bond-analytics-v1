import React from 'react';

export default function FiltersPanel() {
  return (
    <div className="slide-panel" id="panel-filters" style={{width:'320px'}}>
      <div className="panel-head">
        <div className="panel-title">Filters</div>
      </div>
      <div className="panel-body" style={{padding:0}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--bdr)'}}>
          <div style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--tx3)',marginBottom:'10px'}}>Status</div>
          <div className="status-seg" style={{display:'flex',gap:'4px'}}>
            <div className="seg-opt on" id="st-all-mob" onClick={() => { window.setStatus('all',this); document.getElementById('st-all')?.click(); }}>All</div>
            <div className="seg-opt" id="st-active-mob" onClick={() => { window.setStatus('active',this); document.getElementById('st-active')?.click(); }}>Active</div>
            <div className="seg-opt" id="st-inactive-mob" onClick={() => { window.setStatus('inactive',this); document.getElementById('st-inactive')?.click(); }}>Inactive</div>
          </div>
        </div>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--bdr)'}}>
          <div style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--tx3)',marginBottom:'10px'}}>Source</div>
          <div id="mob-src-filters" style={{display:'flex',flexDirection:'column',gap:'2px'}}>
            <div className="src-row on" onClick={() => { window.setSrc('all',this); document.getElementById('src-all')?.classList.add('on'); }}><span className="src-label">All Sources</span><span className="src-count" id="mob-src-count-all">&#x2014;</span></div>
          </div>
        </div>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--bdr)'}}>
          <div style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--tx3)',marginBottom:'10px'}}>Frequency</div>
          <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
            <div className="src-row on" onClick={() => { window.setFreq('all',this); document.getElementById('freq-all')?.click(); }}><span className="src-label">All</span><span className="src-count" id="mob-freq-count-all">&#x2014;</span></div>
            <div className="src-row" onClick={() => { window.setFreq('daily',this); document.getElementById('freq-daily')?.click(); }}><span className="src-label">Daily</span><span className="src-count" id="mob-freq-count-daily">&#x2014;</span></div>
            <div className="src-row" onClick={() => { window.setFreq('weekly',this); document.getElementById('freq-weekly')?.click(); }}><span className="src-label">Weekly</span><span className="src-count" id="mob-freq-count-weekly">&#x2014;</span></div>
            <div className="src-row" onClick={() => { window.setFreq('monthly',this); document.getElementById('freq-monthly')?.click(); }}><span className="src-label">Monthly</span><span className="src-count" id="mob-freq-count-monthly">&#x2014;</span></div>
          </div>
        </div>
        <div style={{padding:'14px 16px'}}>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => window.closePanel('filters')}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}
