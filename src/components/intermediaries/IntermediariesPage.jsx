import { useEffect, useRef, useState } from 'react';

/* ── Series config for custom toggle (labels/colors only, no data) ── */
const SERIES_ORDER = ['AIF','FPI','PM','RA','MF'];
const SERIES_CFG = {
  AIF: { label:'AIF', color:'#8b5cf6' },
  FPI: { label:'FPI', color:'#4a90d9' },
  PM:  { label:'PM',  color:'#26c99a' },
  RA:  { label:'RA',  color:'#f0a040' },
  MF:  { label:'MF',  color:'#e05060' },
};

/* ── Bottom snapshot ── */
const SNAP = [
  { n:'—',  label:'Alternative Investment Funds', color:'#8b5cf6' },
  { n:'—',  label:'Foreign Portfolio Investors',  color:'#4a90d9' },
  { n:'—',  label:'Portfolio Managers',           color:'#26c99a' },
  { n:'—',  label:'Research Analysts',            color:'#f0a040' },
  { n:'—',  label:'Mutual Funds',                 color:'#e05060' },
  { n:'—',  label:'InvITs',                       color:'#f0a040' },
  { n:'—',  label:'REITs',                        color:'#26c99a' },
];

/* ── Chart helpers ── */
const isDk = () => document.documentElement.getAttribute('data-theme') === 'dark';
function cc() {
  const d = isDk();
  return {
    text:  d ? '#a8a8a8' : '#9a9d92',
    text2: d ? '#f0f0f0' : '#1a1c18',
    grid:  d ? 'rgba(255,255,255,.13)' : 'rgba(26,28,24,.15)',
    axis:  d ? 'rgba(255,255,255,.10)' : 'rgba(26,28,24,.10)',
    bg:    d ? '#08111f' : '#f7f8f3',
  };
}
const GRID = (l,r,t,b) => ({top:t,right:r,bottom:b,left:l,containLabel:false});
const ALB  = c => ({color:c.text,fontSize:10});
const SPL  = c => ({lineStyle:{color:c.grid,type:'dashed'}});
const XAX  = (data,c,iv) => ({
  type:'category', data,
  axisLine:{lineStyle:{color:c.axis}}, axisTick:{show:false},
  axisLabel:{...ALB(c), interval:iv??'auto'},
});
const YAX  = (c,fmt) => ({
  type:'value',
  axisLabel:{...ALB(c), formatter:fmt},
  splitLine:SPL(c), axisLine:{show:false},
});
const TT = c => ({
  trigger:'axis', backgroundColor:c.bg, borderColor:c.grid,
  textStyle:{color:c.text2, fontSize:11},
  axisPointer:{lineStyle:{color:c.grid}},
});

function useChart(ref, build) {
  useEffect(() => {
    if (!ref.current || !window.echarts) return;
    if (ref.current.offsetParent === null) return;
    const inst = window.echarts.getInstanceByDom(ref.current) ||
                 window.echarts.init(ref.current, null, {renderer:'canvas'});
    const opt = build();
    if (!opt) return;
    inst.setOption(opt, true);
    inst.resize();
    const ro = new ResizeObserver(() => inst.resize());
    ro.observe(ref.current);
    return () => ro.disconnect();
  });
}

export default function IntermediariesPage({ isActive }) {
  const [period,      setPeriod]      = useState('All');
  const [fromYear,    setFromYear]    = useState('2014');
  const [toYear,      setToYear]      = useState('2026');
  const [activeSeries, setActiveSeries] = useState(new Set(['PM','RA']));

  const rAif      = useRef(null);
  const rFpi      = useRef(null);
  const rCustom   = useRef(null);
  const rDemat    = useRef(null);
  const rClear    = useRef(null);
  const rDepShare = useRef(null);

  function toggleSeries(key) {
    setActiveSeries(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  /* AIF Explosive Growth */
  useChart(rAif, () => null);

  /* FPI Registered Count */
  useChart(rFpi, () => null);

  /* Custom Toggle Multi-line */
  useChart(rCustom, () => null);

  /* Demat Account Growth — Stacked Area */
  useChart(rDemat, () => null);

  /* Clearing House Funds Pay-in — Stacked Bar */
  useChart(rClear, () => null);

  /* Depository Market Share — Stacked Area % */
  useChart(rDepShare, () => null);

  return (
    <div
      id="page-im"
      style={{display:isActive?'flex':'none',flexDirection:'column',height:'100%',overflow:'hidden'}}
    >
      <div
        className="im-scroll"
        style={{flex:'1 1 0',minHeight:0,height:0,overflowY:'scroll',
                display:'flex',flexDirection:'column',gap:14,padding:'18px 20px 40px'}}
      >
        {/* Header */}
        <div>
          <div className="im-title">Market Intermediaries</div>
          <div className="im-sub">SEBI-registered entities driving India's capital markets ecosystem</div>
        </div>

        {/* Filters */}
        <div className="im-filters">
          <div className="im-btn-group">
            {['1Y','3Y','5Y','All'].map(p => (
              <button key={p} className={`im-btn${period===p?' on':''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="im-range">
            <span className="im-lbl">From</span>
            <select className="im-sel" value={fromYear} onChange={e => setFromYear(e.target.value)}>
              {['2014','2015','2016','2017','2018','2019','2020'].map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="im-lbl">To</span>
            <select className="im-sel" value={toYear} onChange={e => setToYear(e.target.value)}>
              {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* 6 KPI cards */}
        <div className="im-kpis">
          <div className="im-kpi">
            <div className="im-kpi-lbl">ALT. INVESTMENT FUNDS</div>
            <div className="im-kpi-num">—</div>
            <div className="im-kpi-note">15× growth since 2015</div>
          </div>
          <div className="im-kpi">
            <div className="im-kpi-lbl">FOREIGN PORTFOLIO INV.</div>
            <div className="im-kpi-num">—</div>
            <div className="im-kpi-note">Registered with SEBI</div>
          </div>
          <div className="im-kpi">
            <div className="im-kpi-lbl">PORTFOLIO MANAGERS</div>
            <div className="im-kpi-num">—</div>
            <div className="im-kpi-note">Wealth managers</div>
          </div>
          <div className="im-kpi">
            <div className="im-kpi-lbl">RESEARCH ANALYSTS</div>
            <div className="im-kpi-num">—</div>
            <div className="im-kpi-note">5.7× since 2016</div>
          </div>
          <div className="im-kpi">
            <div className="im-kpi-lbl">MUTUAL FUNDS</div>
            <div className="im-kpi-num">—</div>
            <div className="im-kpi-note">Including inactive</div>
          </div>
          <div className="im-kpi">
            <div className="im-kpi-lbl">INVITS</div>
            <div className="im-kpi-num">—</div>
            <div className="im-kpi-note">Infrastructure trusts</div>
          </div>
        </div>

        {/* AIF chart — full width */}
        <div className="im-card">
          <div className="im-card-hd">
            <span className="im-card-title">Alternative Investment Funds — Explosive Growth</span>
            <span className="im-badge-growth">15× growth</span>
          </div>
          <div className="im-card-sub">Registered AIFs · 101 (2015) → 1,526 (2026) · 15× in 11 years</div>
          <div ref={rAif} style={{height:260}} />
        </div>

        {/* FPI | Custom Toggle — side by side */}
        <div className="im-row2">
          <div className="im-card">
            <div className="im-card-hd">
              <span className="im-card-title">Foreign Portfolio Investors (FPI)</span>
            </div>
            <div className="im-card-sub">Registered entities count · steady growth with re-registration in 2014</div>
            <div ref={rFpi} style={{height:280}} />
          </div>
          <div className="im-card">
            <div className="im-card-hd">
              <span className="im-card-title">Intermediary Trends — Custom</span>
            </div>
            <div className="im-card-sub">Toggle entities below to compare growth</div>
            <div className="im-toggle-row">
              {SERIES_ORDER.map(k => (
                <button
                  key={k}
                  className={`im-toggle-btn${activeSeries.has(k) ? ' on' : ''}`}
                  style={activeSeries.has(k)
                    ? { background: SERIES_CFG[k].color, borderColor: SERIES_CFG[k].color, color:'#fff' }
                    : { borderColor:'rgba(255,255,255,.2)', color:'var(--tx3,#888)', background:'transparent' }}
                  onClick={() => toggleSeries(k)}
                >{k}</button>
              ))}
            </div>
            <div ref={rCustom} style={{height:244}} />
          </div>
        </div>

        {/* Demat Account Growth — full width */}
        <div className="im-card">
          <div className="im-card-hd">
            <span className="im-card-title">Demat Account Growth — CDSL vs NSDL</span>
          </div>
          <div className="im-card-sub">Total demat accounts by depository · stacked</div>
          <div ref={rDemat} style={{height:280}} />
        </div>

        {/* Clearing House — full width */}
        <div className="im-card">
          <div className="im-card-hd">
            <span className="im-card-title">Clearing House Funds Pay-in</span>
          </div>
          <div className="im-card-sub">Annual funds pay-in (₹ crore) by clearing corporation</div>
          <div ref={rClear} style={{height:280}} />
        </div>

        {/* Depository Market Share — full width */}
        <div className="im-card">
          <div className="im-card-hd">
            <span className="im-card-title">Depository Market Share</span>
          </div>
          <div className="im-card-sub">CDSL overtook NSDL in ~2020</div>
          <div ref={rDepShare} style={{height:280}} />
        </div>

        {/* Current Registered Entities Snapshot */}
        <div className="im-snap-wrap">
          <div className="im-snap-title">Current Registered Entities Snapshot</div>
          <div className="im-snap-grid">
            {SNAP.map(s => (
              <div key={s.label} className="im-snap-card">
                <div className="im-snap-num" style={{color:s.color}}>{s.n}</div>
                <div className="im-snap-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        .im-scroll::-webkit-scrollbar{width:6px}
        .im-scroll::-webkit-scrollbar-track{background:transparent}
        .im-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.35);border-radius:3px}

        .im-title{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.3px}
        .im-sub{font-size:12px;color:var(--tx3,#888);margin-top:3px}

        .im-filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
          padding:8px 0;border-bottom:1px solid var(--bdr,rgba(255,255,255,.06))}
        .im-btn-group{display:flex;gap:4px}
        .im-btn{padding:3px 11px;border-radius:4px;font-size:11px;font-weight:500;cursor:pointer;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:transparent;color:var(--tx2,#ccc);transition:all .15s}
        .im-btn.on{background:var(--green,#2d8a4e);border-color:var(--green,#2d8a4e);color:#fff}
        .im-btn:hover:not(.on){background:var(--sf2,rgba(255,255,255,.06))}
        .im-range{display:flex;align-items:center;gap:6px}
        .im-lbl{font-size:11px;color:var(--tx3,#888)}
        .im-sel{padding:3px 7px;border-radius:4px;font-size:11px;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:var(--sf,#1c1c1c);color:var(--tx2,#ccc);cursor:pointer}

        .im-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
        .im-kpi{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:14px 16px}
        .im-kpi-lbl{font-size:10px;font-weight:600;color:var(--tx3,#888);
          letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;line-height:1.3}
        .im-kpi-num{font-size:28px;font-weight:700;color:var(--tx2,#e0e0e0);
          letter-spacing:-.5px;line-height:1}
        .im-kpi-note{font-size:10px;color:var(--tx3,#888);margin-top:5px;line-height:1.4}

        .im-card{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px}
        .im-card-hd{display:flex;align-items:center;gap:10px;margin-bottom:4px}
        .im-card-title{font-size:13px;font-weight:600;color:var(--tx2,#e0e0e0)}
        .im-card-sub{font-size:11px;color:var(--tx3,#888);margin-bottom:14px}
        .im-badge-growth{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:600;
          background:rgba(45,138,78,.2);color:#2d8a4e;border:1px solid rgba(45,138,78,.4)}

        .im-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}

        .im-toggle-row{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
        .im-toggle-btn{padding:3px 10px;border-radius:4px;font-size:11px;font-weight:600;
          cursor:pointer;border:1.5px solid;transition:all .15s}

        .im-snap-wrap{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px}
        .im-snap-title{font-size:13px;font-weight:600;color:var(--tx2,#e0e0e0);margin-bottom:14px}
        .im-snap-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
        .im-snap-card{text-align:center;padding:14px 8px;
          background:var(--sf2,rgba(255,255,255,.04));border-radius:6px}
        .im-snap-num{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1;margin-bottom:6px}
        .im-snap-lbl{font-size:10px;color:var(--tx3,#888);line-height:1.35}
      `}</style>
    </div>
  );
}
