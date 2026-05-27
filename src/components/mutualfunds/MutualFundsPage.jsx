import { useEffect, useRef, useState } from 'react';
import { analyticsAggregate } from '../../api/bond_api';

/* Chart helpers */
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

function fmtP(p) {
  if (!p) return '';
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [y, m] = p.split('-');
  return `${M[+m - 1]} ${y.slice(2)}`;
}
function fmtCr(v) {
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)}L Cr`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}K Cr`;
  return `₹${Math.round(v).toLocaleString()} Cr`;
}

export default function MutualFundsPage({ isActive }) {
  const [period,   setPeriod]   = useState('All');
  const [fromYear, setFromYear] = useState('2014');
  const [toYear,   setToYear]   = useState('2026');

  const [aumTrendData,  setAumTrendData]  = useState({ months: [], values: [] });
  const [grossMobData,  setGrossMobData]  = useState({ months: [], pub: [], pvt: [] });
  const [latestTable,   setLatestTable]   = useState([]);
  const [loadCount, setLoadCount] = useState(0);
  const TOTAL_LOADS = 3;
  const loading = loadCount < TOTAL_LOADS;

  const [mfKpi, setMfKpi] = useState({
    aum:      { value: '—', note: '—' },
    grossMob: { value: '—', note: 'Total inflows into MFs' },
    netFlow:  { value: '—', note: 'Latest month net flows' },
  });

  useEffect(() => {
    const toList = r => Array.isArray(r) ? r : (r?.data || r?.items || []);
    const agg = dimension_id => analyticsAggregate({
      source_id: 22, date_attribute_type_id: 3,
      metric_id: 109, dimension_type_id: 43, dimension_id,
      granularity: 'month', aggregation: 'sum', limit: 500,
    }).catch(() => []);

    Promise.all([agg(33960), agg(33953), agg(33959)]).then(([aumRaw, grossRaw, netRaw]) => {
      const last = raw => {
        const l = toList(raw);
        return l.length ? l[l.length - 1] : null;
      };
      const val = r => r ? +(r.value ?? r.metric_value ?? 0) : 0;

      // Full AUM series for trend chart (crore → L Cr)
      const aumList = toList(aumRaw);
      setAumTrendData({
        months: aumList.map(r => fmtP(r.period)),
        values: aumList.map(r => +((+(r.value ?? r.metric_value ?? 0)) / 1e5).toFixed(2)),
      });

      const aumR   = last(aumRaw);
      const grossR = last(grossRaw);
      const netR   = last(netRaw);

      setMfKpi({
        aum:      { value: fmtCr(val(aumR)),   note: aumR   ? `as of ${fmtP(aumR.period)}`   : '—' },
        grossMob: { value: fmtCr(val(grossR)), note: grossR ? `as of ${fmtP(grossR.period)}` : 'Total inflows into MFs' },
        netFlow:  { value: fmtCr(val(netR)),   note: netR   ? `as of ${fmtP(netR.period)}`   : 'Latest month net flows' },
      });
      setLoadCount(c => c + 1);
    }).catch(() => setLoadCount(c => c + 1));
  }, []);

  useEffect(() => {
    const toList = r => Array.isArray(r) ? r : (r?.data || r?.items || []);
    const agg = dimension_id => analyticsAggregate({
      source_id: 22, date_attribute_type_id: 3,
      metric_id: 109, dimension_type_id: 43, dimension_id,
      granularity: 'month', aggregation: 'sum', limit: 500,
    }).catch(() => []);

    Promise.all([agg(33952), agg(33951)]).then(([pubRaw, pvtRaw]) => {
      const pubList = toList(pubRaw);
      const pvtList = toList(pvtRaw);
      const base = pubList.length >= pvtList.length ? pubList : pvtList;
      const pubMap = {}, pvtMap = {};
      pubList.forEach(r => { pubMap[r.period] = +(r.value ?? r.metric_value ?? 0); });
      pvtList.forEach(r => { pvtMap[r.period] = +(r.value ?? r.metric_value ?? 0); });
      setGrossMobData({
        months: base.map(r => fmtP(r.period)),
        pub:    base.map(r => pubMap[r.period] ?? 0),
        pvt:    base.map(r => pvtMap[r.period] ?? 0),
      });
      setLoadCount(c => c + 1);
    }).catch(() => setLoadCount(c => c + 1));
  }, []);

  useEffect(() => {
    const toList = r => Array.isArray(r) ? r : (r?.data || r?.items || []);
    const DIMS = [
      { label: 'Assets at End of Period',             id: 33960 },
      { label: 'Gross Mobilisation - Public Sector',  id: 33952 },
      { label: 'Gross Mobilisation - Private Sector', id: 33951 },
      { label: 'Gross Mobilisation - Total',          id: 33953 },
      { label: 'Net Inflow/Outflow - Public Sector',  id: 33958 },
      { label: 'Net Inflow/Outflow - Private Sector', id: 33957 },
      { label: 'Net Inflow/Outflow - Total',          id: 33959 },
      { label: 'Redemption/Repurchase - Public Sector',  id: 33955 },
      { label: 'Redemption/Repurchase - Private Sector', id: 33954 },
      { label: 'Redemption/Repurchase - Total',          id: 33956 },
    ];
    const agg = dimension_id => analyticsAggregate({
      source_id: 22, date_attribute_type_id: 3,
      metric_id: 109, dimension_type_id: 43, dimension_id,
      granularity: 'month', aggregation: 'sum', limit: 500,
    }).catch(() => []);

    Promise.all(DIMS.map(d => agg(d.id))).then(results => {
      const rows = DIMS.map((d, i) => {
        const list = toList(results[i]);
        const last = list.length ? list[list.length - 1] : null;
        const v = last ? +(last.value ?? last.metric_value ?? 0) : null;
        const display = v != null
          ? v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : '—';
        return [d.label, display];
      });
      setLatestTable(rows);
      setLoadCount(c => c + 1);
    }).catch(() => setLoadCount(c => c + 1));
  }, []);

  const rSip      = useRef(null);
  const rEquity   = useRef(null);
  const rHybrid   = useRef(null);
  const rIndex    = useRef(null);
  const rEtfEx    = useRef(null);
  const rGold     = useRef(null);
  const rAumTrend  = useRef(null);
  const rDonut     = useRef(null);
  const rTop10     = useRef(null);
  const rAumComp   = useRef(null);
  const rLegacy    = useRef(null);
  const rGrossMob  = useRef(null);
  const rNetInflow = useRef(null);

  useChart(rSip,    () => null);
  useChart(rEquity, () => null);
  useChart(rHybrid, () => null);
  useChart(rIndex,  () => null);
  useChart(rEtfEx,  () => null);
  useChart(rGold,   () => null);

  useChart(rAumTrend, () => {
    const c = cc();
    const { months, values } = aumTrendData;
    const iv = Math.floor(months.length / 10) || 1;
    return {
      backgroundColor: 'transparent',
      grid: GRID(52, 20, 30, 14),
      tooltip: { ...TT(c), formatter: p => `${p[0].axisValue}<br/>${p[0].marker}AUM ₹${p[0].value}L Cr` },
      xAxis: XAX(months, c, iv),
      yAxis: { ...YAX(c, v => '₹' + v + 'L'), min: 0 },
      series: [{
        type: 'line', data: values, smooth: true,
        lineStyle: { color: '#4a90d9', width: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(74,144,217,.3)' }, { offset: 1, color: 'rgba(74,144,217,.02)' }] } },
        symbol: 'none',
      }],
    };
  });

  useChart(rDonut, () => null);

  useChart(rTop10, () => null);

  useChart(rAumComp, () => null);

  useChart(rLegacy, () => null);

  useChart(rGrossMob, () => {
    const c = cc();
    const { months, pub, pvt } = grossMobData;
    const iv = Math.floor(months.length / 10) || 1;
    const fmtV = v => v >= 1e5 ? (v/1e5).toFixed(1)+'L' : v >= 1e3 ? Math.round(v/1000)+'K' : String(Math.round(v));
    return {
      backgroundColor: 'transparent',
      grid: GRID(62, 20, 38, 14),
      tooltip: { ...TT(c), trigger: 'axis',
        formatter: p => `${p[0].axisValue}<br/>` + p.map(s => `${s.marker}${s.seriesName}: <b>₹${fmtV(+s.value)} Cr</b>`).join('<br/>') },
      legend: { bottom: 4, textStyle: { color: c.text, fontSize: 10 }, itemWidth: 12, itemHeight: 8 },
      xAxis: XAX(months, c, iv),
      yAxis: { ...YAX(c, v => '₹' + fmtV(v)), min: 0 },
      series: [
        { name: 'Public Sector',  type: 'bar', data: pub, stack: 'gm',
          barMaxWidth: 8, itemStyle: { color: '#2d8a4e' } },
        { name: 'Private Sector', type: 'bar', data: pvt, stack: 'gm',
          barMaxWidth: 8, itemStyle: { color: '#4a90d9' } },
      ],
    };
  });

  useChart(rNetInflow, () => null);

  const CHARTS = [
    { ref:rSip,    title:'SIP contribution',  src:'Industry.sip_monthly' },
    { ref:rEquity, title:'Equity funds',       src:'Growth/Equity Oriented Schemes' },
    { ref:rHybrid, title:'Hybrid funds',       src:'Hybrid Schemes' },
    { ref:rIndex,  title:'Index funds',        src:'Index Funds' },
    { ref:rEtfEx,  title:'ETFs ex-gold',       src:'Other ETFs' },
    { ref:rGold,   title:'Gold ETF',           src:'GOLD ETF' },
  ];

  return (
    <div
      id="page-mf"
      style={{display:isActive?'flex':'none',flexDirection:'column',height:'100%',overflow:'hidden'}}
    >
      <div
        className="mf-scroll"
        style={{flex:'1 1 0',minHeight:0,height:0,overflowY:'scroll',
                display:'flex',flexDirection:'column',gap:14,padding:'18px 20px 40px'}}
      >
        {/* Header */}
        <div>
          <div className="mf-title">Mutual Funds</div>
          <div className="mf-sub">AUM trends, gross mobilisation, and net flows in India's mutual fund industry</div>
        </div>

        {/* Filters */}
        <div className="mf-filters">
          <div className="mf-btn-group">
            {['1Y','3Y','5Y','All'].map(p => (
              <button key={p} className={`mf-btn${period===p?' on':''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="mf-range">
            <span className="mf-lbl">From</span>
            <select className="mf-sel" value={fromYear} onChange={e => setFromYear(e.target.value)}>
              {['2014','2015','2016','2017','2018','2019','2020'].map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="mf-lbl">To</span>
            <select className="mf-sel" value={toYear} onChange={e => setToYear(e.target.value)}>
              {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* KPI Cards — 6 columns */}
        <div className="mf-kpis">
          <div className="mf-kpi">
            <div className="mf-kpi-lbl">LATEST MF AUM</div>
            <div className="mf-kpi-val">{mfKpi.aum.value}</div>
            <div className="mf-kpi-note">{mfKpi.aum.note}</div>
          </div>
          <div className="mf-kpi">
            <div className="mf-kpi-lbl">LATEST GROSS MOBILISATION</div>
            <div className="mf-kpi-val">{mfKpi.grossMob.value}</div>
            <div className="mf-kpi-note">{mfKpi.grossMob.note}</div>
          </div>
          <div className="mf-kpi">
            <div className="mf-kpi-lbl">NET INFLOW / OUTFLOW</div>
            <div className="mf-kpi-val">{mfKpi.netFlow.value}</div>
            <div className="mf-kpi-note">{mfKpi.netFlow.note}</div>
          </div>
          <div className="mf-kpi">
            <div className="mf-kpi-lbl"># SCHEME TYPES</div>
            <div className="mf-kpi-num">—</div>
            <div className="mf-kpi-note">Active scheme categories</div>
          </div>
          <div className="mf-kpi">
            <div className="mf-kpi-lbl">EQUITY SCHEME AUM</div>
            <div className="mf-kpi-val">—</div>
            <div className="mf-kpi-note">Equity-type schemes</div>
          </div>
          <div className="mf-kpi">
            <div className="mf-kpi-lbl">DEBT SCHEME AUM</div>
            <div className="mf-kpi-val">—</div>
            <div className="mf-kpi-note">Debt-type schemes</div>
          </div>
        </div>

        {/* Monthly Fund Flows — 3×2 grid */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">Monthly Fund Flows Show the Category Cycles</span>
              <span className="mf-badge">AMFI</span>
            </div>
            <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="mf-card-sub">AMFI monthly category flows from CY20 onward · each panel is scaled independently</div>

          <div className="mf-3x2">
            {CHARTS.map(ch => (
              <div key={ch.title} className="mf-mini">
                <div className="mf-mini-hd">
                  <div>
                    <div className="mf-mini-title">{ch.title}</div>
                    <div className="mf-mini-src">{ch.src}</div>
                  </div>
                  <div className="mf-mini-val">—</div>
                </div>
                {loading ? <div className="chart-loader" style={{height: 185}} /> : <div ref={ch.ref} style={{height:185}} />}
              </div>
            ))}
          </div>

          <div className="mf-footnote">
            SIP contribution uses reviewed AMFI SIP facts from the mutual-funds warehouse. Category flows use AMFI monthly
            industry categories; equity sums subcategories under Growth/Equity Oriented Schemes because the recent aggregate
            row is not reliable for flow analytics.
          </div>
        </div>

        {/* AUM Trend — full width */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">Mutual Fund AUM Trend</span>
              <span className="mf-badge">AMFI</span>
            </div>
            <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="mf-card-sub">Industry AUM (₹ Lakh Crore) · Apr 2015 to Jan 2026</div>
          {loading ? <div className="chart-loader" style={{height: 220}} /> : <div ref={rAumTrend} style={{height:220}} />}
        </div>

        {/* Donut + Top 10 side by side */}
        <div className="mf-row-side">
          <div className="mf-card">
            <div className="mf-card-hd">
              <div className="mf-card-hd-l">
                <span className="mf-card-title">AUM by Scheme Category</span>
                <span className="mf-badge">AMFI</span>
              </div>
              <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="mf-card-sub">Distribution of AUM across scheme categories (₹ L Cr)</div>
            {loading ? <div className="chart-loader" style={{height: 280}} /> : <div ref={rDonut} style={{height:280}} />}
          </div>

          <div className="mf-card">
            <div className="mf-card-hd">
              <div className="mf-card-hd-l">
                <span className="mf-card-title">Top 10 Scheme Types by AUM</span>
                <span className="mf-badge">AMFI</span>
              </div>
              <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="mf-card-sub">AUM by scheme type (₹ Lakh Crore)</div>
            {loading ? <div className="chart-loader" style={{height: 280}} /> : <div ref={rTop10} style={{height:280}} />}
          </div>
        </div>

        {/* MF AUM Composition */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">MF AUM Composition</span>
              <span className="mf-badge">AMFI</span>
            </div>
            <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="mf-card-sub">₹ Lakh Crore — equity vs debt vs hybrid</div>
          {loading ? <div className="chart-loader" style={{height: 240}} /> : <div ref={rAumComp} style={{height:240}} />}
        </div>

        {/* Legacy MF Summary Archive */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">Legacy MF Summary Archive</span>
              <span className="mf-badge">SEBI</span>
            </div>
            <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="mf-card-sub">Older SEBI summary table coverage · retained separately because categories are source-era shaped</div>
          {loading ? <div className="chart-loader" style={{height: 220}} /> : <div ref={rLegacy} style={{height:220}} />}
        </div>

        {/* Gross Mobilisation */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">Gross Mobilisation — Public vs Private Sector</span>
              <span className="mf-badge">AMFI</span>
            </div>
            <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="mf-card-sub">₹ Thousand Crore · gross inflows by sector</div>
          {loading ? <div className="chart-loader" style={{height: 240}} /> : <div ref={rGrossMob} style={{height:240}} />}
        </div>

        {/* Net Inflows by Scheme Type */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">Net Inflows by Scheme Type</span>
              <span className="mf-badge">AMFI</span>
            </div>
            <svg className="mf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="mf-card-sub">₹ Crore · latest period breakdown</div>
          {loading ? <div className="chart-loader" style={{height: 340}} /> : <div ref={rNetInflow} style={{height:340}} />}
        </div>

        {/* Latest Month — All Metrics */}
        <div className="mf-card">
          <div className="mf-card-hd">
            <div className="mf-card-hd-l">
              <span className="mf-card-title">Latest Month — All Metrics</span>
              <span className="mf-badge">AMFI</span>
            </div>
          </div>
          <div className="mf-card-sub">Breakdown of all available MF data for latest period</div>
          <div className="mf-table-wrap">
            <table className="mf-table">
              <thead>
                <tr><th>Metric</th><th className="mf-tr">Value (₹ Cr)</th></tr>
              </thead>
              <tbody>
                {latestTable.length ? latestTable.map(([m, v]) => (<tr key={m}><td>{m}</td><td className="mf-tr">{v}</td></tr>)) : <tr><td colSpan={2} style={{textAlign:'center',color:'var(--tx3)',padding:'20px'}}>No data available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        .mf-scroll::-webkit-scrollbar{width:6px}
        .mf-scroll::-webkit-scrollbar-track{background:transparent}
        .mf-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.35);border-radius:3px}

        .mf-title{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.3px}
        .mf-sub{font-size:12px;color:var(--tx3,#888);margin-top:3px}

        .mf-filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
          padding:8px 0;border-bottom:1px solid var(--bdr,rgba(255,255,255,.06))}
        .mf-btn-group{display:flex;gap:4px}
        .mf-btn{padding:3px 11px;border-radius:4px;font-size:11px;font-weight:500;cursor:pointer;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:transparent;color:var(--tx2,#ccc);transition:all .15s}
        .mf-btn.on{background:var(--green,#2d8a4e);border-color:var(--green,#2d8a4e);color:#fff}
        .mf-btn:hover:not(.on){background:var(--sf2,rgba(255,255,255,.06))}
        .mf-range{display:flex;align-items:center;gap:6px}
        .mf-lbl{font-size:11px;color:var(--tx3,#888)}
        .mf-sel{padding:3px 7px;border-radius:4px;font-size:11px;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:var(--sf,#1c1c1c);color:var(--tx2,#ccc);cursor:pointer}

        .mf-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
        .mf-kpi{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:14px 16px}
        .mf-kpi-lbl{font-size:10px;font-weight:600;color:var(--tx3,#888);
          letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;line-height:1.3}
        .mf-kpi-val{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.4px;line-height:1.1}
        .mf-kpi-num{font-size:34px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.5px;line-height:1}
        .mf-kpi-note{font-size:10px;color:var(--tx3,#888);margin-top:5px;line-height:1.4}

        .mf-card{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px}
        .mf-card-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
        .mf-card-hd-l{display:flex;align-items:center;gap:8px}
        .mf-card-title{font-size:13px;font-weight:600;color:var(--tx2,#e0e0e0)}
        .mf-card-sub{font-size:11px;color:var(--tx3,#888);margin-bottom:14px}
        .mf-badge{padding:2px 7px;border-radius:3px;font-size:10px;font-weight:600;letter-spacing:.4px;
          background:rgba(14,116,144,.2);color:#22d3ee;border:1px solid rgba(14,116,144,.35)}
        .mf-icon{width:14px;height:14px;color:var(--tx3,#888);opacity:.6;cursor:pointer;flex-shrink:0}
        .mf-icon:hover{opacity:1}

        .mf-3x2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        .mf-mini{background:var(--sf2,rgba(255,255,255,.025));border:1px solid var(--bdr,rgba(255,255,255,.05));
          border-radius:6px;padding:12px 12px 6px}
        .mf-mini-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
        .mf-mini-title{font-size:12px;font-weight:600;color:var(--tx2,#ddd)}
        .mf-mini-src{font-size:10px;color:#22c99a;margin-top:2px}
        .mf-mini-val{font-size:11px;font-weight:600;color:var(--tx2,#ddd);white-space:nowrap;margin-top:1px}
        .mf-mini-val.neg{color:#e05060}

        .mf-footnote{font-size:10px;color:var(--tx4,#666);margin-top:12px;line-height:1.6;
          border-top:1px solid var(--bdr,rgba(255,255,255,.05));padding-top:10px}

        .mf-row-side{display:grid;grid-template-columns:2fr 3fr;gap:14px}

        .mf-table-wrap{overflow-x:auto;margin-top:8px}
        .mf-table{width:100%;border-collapse:collapse;font-size:12px}
        .mf-table th{padding:8px 12px;border-bottom:1px solid var(--bdr2,rgba(255,255,255,.12));
          color:var(--tx3,#888);font-weight:600;font-size:11px;text-align:left}
        .mf-table td{padding:10px 12px;border-bottom:1px solid var(--bdr,rgba(255,255,255,.05));
          color:var(--tx2,#ddd)}
        .mf-table tr:last-child td{border-bottom:none}
        .mf-table tr:hover td{background:var(--sf2,rgba(255,255,255,.03))}
        .mf-tr{text-align:right;font-variant-numeric:tabular-nums;font-family:monospace}
      `}</style>
    </div>
  );
}
