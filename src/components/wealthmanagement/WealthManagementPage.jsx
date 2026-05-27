import { useEffect, useRef, useState } from 'react';
import { analyticsAggregate } from '../../api/bond_api';


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
    const opt = build(); if (!opt) return; inst.setOption(opt, true);
    inst.resize();
    const ro = new ResizeObserver(() => inst.resize());
    ro.observe(ref.current);
    return () => ro.disconnect();
  });
}

const LK = svg => (
  <svg className="wm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function WealthManagementPage({ isActive }) {
  const [period,   setPeriod]   = useState('All');
  const [fromYear, setFromYear] = useState('2014');
  const [toYear,   setToYear]   = useState('2026');

  const [wmKpi, setWmKpi] = useState({
    totalAum: { value: '—', note: '— · including EPFO/PF' },
    discrAum: { value: '—', note: '— · non-EPFO managed accounts' },
    clients:  { value: '—', note: '— · active PM clients' },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toList = r => Array.isArray(r) ? r : (r?.data || r?.items || []);
    const last = raw => { const l = toList(raw); return l.length ? l[l.length - 1] : null; };
    const val  = r => r ? +(r.value ?? r.metric_value ?? 0) : 0;
    const fmtP = p => {
      if (!p) return '—';
      const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const [y, m] = p.split('-');
      return `${M[+m - 1]} ${y.slice(2)}`;
    };

    const aggAum = dim => analyticsAggregate({
      source_id: 23, date_attribute_type_id: 3,
      metric_id: 112, dimension_type_id: 44, dimension_id: dim,
      granularity: 'month', aggregation: 'sum', limit: 500,
    }).catch(() => []);

    const aggCli = analyticsAggregate({
      source_id: 23, date_attribute_type_id: 3,
      metric_id: 111, dimension_type_id: 44, dimension_id: 33961,
      granularity: 'month', aggregation: 'sum', limit: 500,
    }).catch(() => []);

    Promise.all([aggAum(33965), aggAum(33961), aggCli]).then(([totalRaw, discrRaw, cliRaw]) => {
      const totalR = last(totalRaw);
      const discrR = last(discrRaw);
      const cliR   = last(cliRaw);

      const fmtAum = v => `₹${(v / 1e5).toFixed(2)} L Cr`;
      const fmtCli = v => Math.round(v).toLocaleString('en-IN');

      setWmKpi({
        totalAum: {
          value: totalR ? fmtAum(val(totalR)) : '—',
          note:  `Period ${fmtP(totalR?.period)} · including EPFO/PF`,
        },
        discrAum: {
          value: discrR ? fmtAum(val(discrR)) : '—',
          note:  `Period ${fmtP(discrR?.period)} · non-EPFO managed accounts`,
        },
        clients: {
          value: cliR ? fmtCli(val(cliR)) : '—',
          note:  `Period ${fmtP(cliR?.period)} · active PM clients`,
        },
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const rPmTrend  = useRef(null);
  const rPmsSumm  = useRef(null);
  const rSvcMix   = useRef(null);
  const rCliTrend = useRef(null);
  const rAssetCls = useRef(null);
  const rVcSect   = useRef(null);
  const rCustAuc  = useRef(null);

  useChart(rPmTrend,  () => null);
  useChart(rPmsSumm,  () => null);
  useChart(rSvcMix,   () => null);
  useChart(rCliTrend, () => null);

  useChart(rAssetCls, () => null);
  useChart(rVcSect,   () => null);
  useChart(rCustAuc,  () => null);

  return (
    <div
      id="page-wm"
      style={{display:isActive?'flex':'none',flexDirection:'column',height:'100%',overflow:'hidden'}}
    >
      <div
        className="wm-scroll"
        style={{flex:'1 1 0',minHeight:0,height:0,overflowY:'scroll',
                display:'flex',flexDirection:'column',gap:14,padding:'18px 20px 40px'}}
      >
        {/* Header */}
        <div>
          <div className="wm-title">Wealth Management — Portfolio Managers</div>
          <div className="wm-sub">SEBI-registered portfolio managers: AUM, client count, and asset class breakdown</div>
        </div>

        {/* Filters */}
        <div className="wm-filters">
          <div className="wm-btn-group">
            {['1Y','3Y','5Y','All'].map(p => (
              <button key={p} className={`wm-btn${period===p?' on':''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="wm-range">
            <span className="wm-lbl">From</span>
            <select className="wm-sel" value={fromYear} onChange={e => setFromYear(e.target.value)}>
              {['2014','2015','2016','2017','2018','2019','2020'].map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="wm-lbl">To</span>
            <select className="wm-sel" value={toYear} onChange={e => setToYear(e.target.value)}>
              {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* KPI Cards — 3 columns */}
        <div className="wm-kpis">
          <div className="wm-kpi">
            <div className="wm-kpi-lbl">TOTAL PM AUM (GRAND TOTAL)</div>
            <div className="wm-kpi-val">{wmKpi.totalAum.value}</div>
            <div className="wm-kpi-note">{wmKpi.totalAum.note}</div>
          </div>
          <div className="wm-kpi">
            <div className="wm-kpi-lbl">DISCRETIONARY AUM</div>
            <div className="wm-kpi-val">{wmKpi.discrAum.value}</div>
            <div className="wm-kpi-note">{wmKpi.discrAum.note}</div>
          </div>
          <div className="wm-kpi">
            <div className="wm-kpi-lbl">NUMBER OF CLIENTS</div>
            <div className="wm-kpi-num">{wmKpi.clients.value}</div>
            <div className="wm-kpi-note">{wmKpi.clients.note}</div>
          </div>
        </div>

        {/* Portfolio Manager AUM Trend */}
        <div className="wm-card">
          <div className="wm-card-hd">
            <div className="wm-card-hd-l">
              <span className="wm-card-title">Portfolio Manager AUM Trend</span>
              <span className="wm-badge wm-badge-pm">PM/AUM</span>
            </div>
            {LK()}
          </div>
          <div className="wm-card-sub">₹ Lakh Crore · discretionary vs grand total (inc. EPFO/PF)</div>
          {loading ? <div className="chart-loader" style={{height: 260}} /> : <div ref={rPmTrend} style={{height:260}} />}
        </div>

        {/* PMS Summary Cross-Check | PMS Service Mix */}
        <div className="wm-row2">
          <div className="wm-card">
            <div className="wm-card-hd">
              <div className="wm-card-hd-l">
                <span className="wm-card-title">PMS Summary Cross-Check</span>
              </div>
            </div>
            <div className="wm-card-sub">Curated portfolio_manager_summary table · total AUM and client count</div>
            {loading ? <div className="chart-loader" style={{height: 260}} /> : <div ref={rPmsSumm} style={{height:260}} />}
          </div>
          <div className="wm-card">
            <div className="wm-card-hd">
              <div className="wm-card-hd-l">
                <span className="wm-card-title">PMS Service Mix</span>
              </div>
            </div>
            <div className="wm-card-sub">Latest summary period Jan 26</div>
            {loading ? <div className="chart-loader" style={{height: 260}} /> : <div ref={rSvcMix} style={{height:260}} />}
          </div>
        </div>

        {/* Client Count Trend | AUM by Asset Class */}
        <div className="wm-row2">
          <div className="wm-card">
            <div className="wm-card-hd">
              <div className="wm-card-hd-l">
                <span className="wm-card-title">Client Count Trend</span>
              </div>
              {LK()}
            </div>
            <div className="wm-card-sub">Number of PM clients over time</div>
            {loading ? <div className="chart-loader" style={{height: 300}} /> : <div ref={rCliTrend} style={{height:300}} />}
          </div>
          <div className="wm-card">
            <div className="wm-card-hd">
              <div className="wm-card-hd-l">
                <span className="wm-card-title">AUM by Asset Class (Latest)</span>
              </div>
            </div>
            <div className="wm-card-sub">₹ Lakh Crore · portfolio composition</div>
            {loading ? <div className="chart-loader" style={{height: 300}} /> : <div ref={rAssetCls} style={{height:300}} />}
          </div>
        </div>

        {/* Foreign VC — Sectoral Allocation */}
        <div className="wm-card">
          <div className="wm-card-hd">
            <div className="wm-card-hd-l">
              <span className="wm-card-title">Foreign VC — Sectoral Allocation</span>
            </div>
          </div>
          <div className="wm-card-sub">Latest month investment breakdown</div>
          {loading ? <div className="chart-loader" style={{height: 240}} /> : <div ref={rVcSect} style={{height:240}} />}
        </div>

        {/* Custodian AUC — FPI vs FDI */}
        <div className="wm-card">
          <div className="wm-card-hd">
            <div className="wm-card-hd-l">
              <span className="wm-card-title">Custodian AUC — FPI vs FDI</span>
            </div>
          </div>
          <div className="wm-card-sub">₹ Lakh Crore</div>
          {loading ? <div className="chart-loader" style={{height: 260}} /> : <div ref={rCustAuc} style={{height:260}} />}
        </div>

      </div>

      <style>{`
        .wm-scroll::-webkit-scrollbar{width:6px}
        .wm-scroll::-webkit-scrollbar-track{background:transparent}
        .wm-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.35);border-radius:3px}

        .wm-title{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.3px}
        .wm-sub{font-size:12px;color:var(--tx3,#888);margin-top:3px}

        .wm-filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
          padding:8px 0;border-bottom:1px solid var(--bdr,rgba(255,255,255,.06))}
        .wm-btn-group{display:flex;gap:4px}
        .wm-btn{padding:3px 11px;border-radius:4px;font-size:11px;font-weight:500;cursor:pointer;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:transparent;color:var(--tx2,#ccc);transition:all .15s}
        .wm-btn.on{background:var(--green,#2d8a4e);border-color:var(--green,#2d8a4e);color:#fff}
        .wm-btn:hover:not(.on){background:var(--sf2,rgba(255,255,255,.06))}
        .wm-range{display:flex;align-items:center;gap:6px}
        .wm-lbl{font-size:11px;color:var(--tx3,#888)}
        .wm-sel{padding:3px 7px;border-radius:4px;font-size:11px;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:var(--sf,#1c1c1c);color:var(--tx2,#ccc);cursor:pointer}

        .wm-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .wm-kpi{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:14px 16px}
        .wm-kpi-lbl{font-size:10px;font-weight:600;color:var(--tx3,#888);
          letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;line-height:1.3}
        .wm-kpi-val{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.4px;line-height:1.1}
        .wm-kpi-num{font-size:30px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.5px;line-height:1}
        .wm-kpi-note{font-size:10px;color:var(--tx3,#888);margin-top:5px;line-height:1.4}

        .wm-card{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px}
        .wm-card-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
        .wm-card-hd-l{display:flex;align-items:center;gap:8px}
        .wm-card-title{font-size:13px;font-weight:600;color:var(--tx2,#e0e0e0)}
        .wm-card-sub{font-size:11px;color:var(--tx3,#888);margin-bottom:14px}
        .wm-badge{padding:2px 7px;border-radius:3px;font-size:10px;font-weight:600;letter-spacing:.4px;
          background:rgba(14,116,144,.2);color:#22d3ee;border:1px solid rgba(14,116,144,.35)}
        .wm-badge-pm{background:rgba(74,144,217,.15);color:#7ab8f5;border-color:rgba(74,144,217,.3)}
        .wm-icon{width:14px;height:14px;color:var(--tx3,#888);opacity:.6;cursor:pointer;flex-shrink:0}
        .wm-icon:hover{opacity:1}

        .wm-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      `}</style>
    </div>
  );
}
