import { useEffect, useRef, useState } from 'react';

/* Key Macro toggle config — labels/colors only, no data */
const KEY_METRICS = ['Repo Rate','CPI Inflation','WPI Inflation','Forex Reserves','USD/INR','M3 Money Supply','FPI Net Equity'];
const KEY_CFG = {
  'Repo Rate':       { color:'#e05060' },
  'CPI Inflation':   { color:'#e05060' },
  'WPI Inflation':   { color:'#d4a820' },
  'Forex Reserves':  { color:'#26c99a' },
  'USD/INR':         { color:'#f0a040' },
  'M3 Money Supply': { color:'#4a90d9' },
  'FPI Net Equity':  { color:'#8b5cf6' },
};

/* Macro Overlay toggle config — labels/colors only, no data */
const OVL_ORDER = ['Repo Rate','USD/INR','NSE MCap','FPI Net'];
const OVL_CFG = {
  'Repo Rate': { color:'#e05060' },
  'USD/INR':   { color:'#f0a040' },
  'NSE MCap':  { color:'#4a90d9' },
  'FPI Net':   { color:'#8b5cf6' },
};

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
  type:'category',data,
  axisLine:{lineStyle:{color:c.axis}},axisTick:{show:false},
  axisLabel:{...ALB(c),interval:iv??'auto'},
});
const YAX  = (c,fmt) => ({
  type:'value',
  axisLabel:{...ALB(c),formatter:fmt},
  splitLine:SPL(c),axisLine:{show:false},
});
const TT = c => ({
  trigger:'axis',backgroundColor:c.bg,borderColor:c.grid,
  textStyle:{color:c.text2,fontSize:11},
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

export default function MacroIndicatorsPage({ isActive }) {
  const [period,    setPeriod]    = useState('All');
  const [fromYear,  setFromYear]  = useState('2014');
  const [toYear,    setToYear]    = useState('2026');
  const [keyMetric, setKeyMetric] = useState('Repo Rate');
  const [ovlActive, setOvlActive] = useState(new Set(['Repo Rate','NSE MCap']));

  const rRepo     = useRef(null);
  const rForex    = useRef(null);
  const rUsdinr   = useRef(null);
  const rInfl     = useRef(null);
  const rMcap     = useRef(null);
  const rPmi      = useRef(null);
  const rTrade    = useRef(null);
  const rKeyMacro = useRef(null);
  const rOverlay  = useRef(null);

  function toggleOvl(k) {
    setOvlActive(prev => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }

  /* RBI Repo Rate */
  useChart(rRepo, () => null);

  /* Forex Reserves */
  useChart(rForex, () => null);

  /* USD/INR */
  useChart(rUsdinr, () => null);

  /* CPI & WPI Inflation */
  useChart(rInfl, () => null);

  /* Market Cap / GDP Ratio */
  useChart(rMcap, () => null);

  /* Manufacturing PMI */
  useChart(rPmi, () => null);

  /* Trade Balance */
  useChart(rTrade, () => null);

  /* Key Macro Indicators — single-metric toggle */
  useChart(rKeyMacro, () => null);

  /* Macro Overlay Chart — dual-axis multi-toggle */
  useChart(rOverlay, () => null);

  return (
    <div
      id="page-macro"
      style={{display:isActive?'flex':'none',flexDirection:'column',height:'100%',overflow:'hidden'}}
    >
      <div
        className="mac-scroll"
        style={{flex:'1 1 0',minHeight:0,height:0,overflowY:'scroll',
                display:'flex',flexDirection:'column',gap:14,padding:'18px 20px 40px'}}
      >
        {/* Header */}
        <div>
          <div className="mac-title">Macro Indicators</div>
          <div className="mac-sub">Repo rate, forex reserves, USD/INR, inflation — macro context for market analysis</div>
        </div>

        {/* Filters */}
        <div className="mac-filters">
          <div className="mac-btn-group">
            {['1Y','3Y','5Y','All'].map(p => (
              <button key={p} className={`mac-btn${period===p?' on':''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="mac-range">
            <span className="mac-lbl">From</span>
            <select className="mac-sel" value={fromYear} onChange={e => setFromYear(e.target.value)}>
              {['2014','2015','2016','2017','2018','2019','2020'].map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="mac-lbl">To</span>
            <select className="mac-sel" value={toYear} onChange={e => setToYear(e.target.value)}>
              {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* 7 KPI cards */}
        <div className="mac-kpis">
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">REPO RATE</div>
            <div className="mac-kpi-num">—</div>
            <div className="mac-kpi-note">RBI benchmark rate</div>
          </div>
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">FOREX RESERVES</div>
            <div className="mac-kpi-num">—</div>
            <div className="mac-kpi-note">Feb 26</div>
          </div>
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">USD / INR</div>
            <div className="mac-kpi-num">—</div>
            <div className="mac-kpi-note">Exchange rate</div>
          </div>
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">MFG PMI</div>
            <div className="mac-kpi-num">—</div>
            <div className="mac-kpi-note">Expansion</div>
          </div>
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">TRADE BALANCE</div>
            <div className="mac-kpi-num mac-kpi-neg">—</div>
            <div className="mac-kpi-note">USD Billion</div>
          </div>
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">MCAP/GDP</div>
            <div className="mac-kpi-num">—</div>
            <div className="mac-kpi-note">Buffett Indicator</div>
          </div>
          <div className="mac-kpi">
            <div className="mac-kpi-lbl">RATE CYCLE PEAK</div>
            <div className="mac-kpi-num">—</div>
            <div className="mac-kpi-note">Nov 14 → Jan 15</div>
          </div>
        </div>

        {/* RBI Repo Rate — full width */}
        <div className="mac-card">
          <div className="mac-card-hd">
            <span className="mac-card-title">RBI Repo Rate</span>
            <span className="mac-badge-rate">Rate cycle</span>
          </div>
          <div className="mac-card-sub">% · benchmark rate across the selected range</div>
          <div ref={rRepo} style={{height:260}} />
        </div>

        {/* Forex Reserves | USD/INR side by side */}
        <div className="mac-row2">
          <div className="mac-card">
            <div className="mac-card-hd"><span className="mac-card-title">Forex Reserves</span></div>
            <div className="mac-card-sub">USD Billion · reserve accumulation over time</div>
            <div ref={rForex} style={{height:260}} />
          </div>
          <div className="mac-card">
            <div className="mac-card-hd"><span className="mac-card-title">USD / INR Exchange Rate</span></div>
            <div className="mac-card-sub">₹ per USD · rupee depreciation trend</div>
            <div ref={rUsdinr} style={{height:260}} />
          </div>
        </div>

        {/* CPI & WPI Inflation — full width */}
        <div className="mac-card">
          <div className="mac-card-hd"><span className="mac-card-title">Inflation: CPI &amp; WPI</span></div>
          <div className="mac-card-sub">Year-on-Year rate (%) · key driver of RBI rate decisions</div>
          <div ref={rInfl} style={{height:260}} />
        </div>

        {/* Market Cap / GDP — full width */}
        <div className="mac-card">
          <div className="mac-card-hd">
            <span className="mac-card-title">Market Cap / GDP Ratio</span>
            <span className="mac-badge-val">Valuation</span>
          </div>
          <div className="mac-card-sub">Buffett Indicator — above 100% = potentially overvalued</div>
          <div ref={rMcap} style={{height:260}} />
        </div>

        {/* Manufacturing PMI | Trade Balance side by side */}
        <div className="mac-row2">
          <div className="mac-card">
            <div className="mac-card-hd"><span className="mac-card-title">Manufacturing PMI</span></div>
            <div className="mac-card-sub">Above 50 = expansion</div>
            <div ref={rPmi} style={{height:260}} />
          </div>
          <div className="mac-card">
            <div className="mac-card-hd"><span className="mac-card-title">Trade Balance</span></div>
            <div className="mac-card-sub">USD Billion</div>
            <div ref={rTrade} style={{height:260}} />
          </div>
        </div>

        {/* Key Macro Indicators toggle — full width */}
        <div className="mac-card">
          <div className="mac-card-hd">
            <span className="mac-card-title">Key Macro Indicators (Structured Data)</span>
            <span className="mac-badge-db">macro_indicators</span>
          </div>
          <div className="mac-card-sub">Clean time series from macro_indicators table — toggle between metrics</div>
          <div className="mac-toggle-row">
            {KEY_METRICS.map(k => (
              <button
                key={k}
                className={`mac-toggle-btn${keyMetric===k?' on':''}`}
                style={keyMetric===k
                  ? {background:KEY_CFG[k].color,borderColor:KEY_CFG[k].color,color:'#fff'}
                  : {borderColor:'rgba(255,255,255,.2)',color:'var(--tx3,#888)',background:'transparent'}}
                onClick={() => setKeyMetric(k)}
              >{k}</button>
            ))}
          </div>
          <div ref={rKeyMacro} style={{height:260}} />
        </div>

        {/* Macro Overlay Chart — full width */}
        <div className="mac-card">
          <div className="mac-card-hd">
            <span className="mac-card-title">Macro Overlay Chart</span>
            <span className="mac-badge-link">Macro-Market Link</span>
          </div>
          <div className="mac-card-sub">Compare repo rate, market cap, FPI flows, USD/INR</div>
          <div className="mac-toggle-row">
            {OVL_ORDER.map(k => (
              <button
                key={k}
                className={`mac-toggle-btn${ovlActive.has(k)?' on':''}`}
                style={ovlActive.has(k)
                  ? {background:OVL_CFG[k].color,borderColor:OVL_CFG[k].color,color:'#fff'}
                  : {borderColor:'rgba(255,255,255,.2)',color:'var(--tx3,#888)',background:'transparent'}}
                onClick={() => toggleOvl(k)}
              >{k}</button>
            ))}
          </div>
          <div ref={rOverlay} style={{height:280}} />
        </div>

      </div>

      <style>{`
        .mac-scroll::-webkit-scrollbar{width:6px}
        .mac-scroll::-webkit-scrollbar-track{background:transparent}
        .mac-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.35);border-radius:3px}

        .mac-title{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.3px}
        .mac-sub{font-size:12px;color:var(--tx3,#888);margin-top:3px}

        .mac-filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
          padding:8px 0;border-bottom:1px solid var(--bdr,rgba(255,255,255,.06))}
        .mac-btn-group{display:flex;gap:4px}
        .mac-btn{padding:3px 11px;border-radius:4px;font-size:11px;font-weight:500;cursor:pointer;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:transparent;color:var(--tx2,#ccc);transition:all .15s}
        .mac-btn.on{background:var(--green,#2d8a4e);border-color:var(--green,#2d8a4e);color:#fff}
        .mac-btn:hover:not(.on){background:var(--sf2,rgba(255,255,255,.06))}
        .mac-range{display:flex;align-items:center;gap:6px}
        .mac-lbl{font-size:11px;color:var(--tx3,#888)}
        .mac-sel{padding:3px 7px;border-radius:4px;font-size:11px;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:var(--sf,#1c1c1c);color:var(--tx2,#ccc);cursor:pointer}

        .mac-kpis{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
        .mac-kpi{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:14px 16px}
        .mac-kpi-lbl{font-size:10px;font-weight:600;color:var(--tx3,#888);
          letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;line-height:1.3}
        .mac-kpi-num{font-size:26px;font-weight:700;color:var(--tx2,#e0e0e0);
          letter-spacing:-.5px;line-height:1}
        .mac-kpi-neg{color:#e05060}
        .mac-kpi-note{font-size:10px;color:var(--tx3,#888);margin-top:5px;line-height:1.4}

        .mac-card{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px}
        .mac-card-hd{display:flex;align-items:center;gap:10px;margin-bottom:4px}
        .mac-card-title{font-size:13px;font-weight:600;color:var(--tx2,#e0e0e0)}
        .mac-card-sub{font-size:11px;color:var(--tx3,#888);margin-bottom:14px}

        .mac-badge-rate{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:600;
          background:rgba(74,144,217,.15);color:#7ab8f5;border:1px solid rgba(74,144,217,.3)}
        .mac-badge-val{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:600;
          background:rgba(139,92,246,.15);color:#a78bfa;border:1px solid rgba(139,92,246,.3)}
        .mac-badge-db{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:600;
          background:rgba(38,201,154,.12);color:#26c99a;border:1px solid rgba(38,201,154,.3)}
        .mac-badge-link{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:600;
          background:rgba(240,160,64,.15);color:#f0a040;border:1px solid rgba(240,160,64,.3)}

        .mac-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}

        .mac-toggle-row{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
        .mac-toggle-btn{padding:3px 10px;border-radius:4px;font-size:11px;font-weight:600;
          cursor:pointer;border:1.5px solid;transition:all .15s}
      `}</style>
    </div>
  );
}
