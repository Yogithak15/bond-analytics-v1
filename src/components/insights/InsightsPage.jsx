import { useEffect, useRef, useState } from 'react';

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

export default function InsightsPage({ isActive }) {
  const [period,   setPeriod]   = useState('All');
  const [fromYear, setFromYear] = useState('2014');
  const [toYear,   setToYear]   = useState('2026');

  const rBal     = useRef(null);
  const rNseMcap = useRef(null);
  const rDemat   = useRef(null);
  const rMfAum   = useRef(null);
  const rFpi     = useRef(null);
  const rYield   = useRef(null);
  const rHh      = useRef(null);
  const rSdlBar  = useRef(null);

  useChart(rBal,     () => null);
  useChart(rNseMcap, () => null);
  useChart(rDemat,   () => null);
  useChart(rMfAum,   () => null);
  useChart(rFpi,     () => null);
  useChart(rYield,   () => null);
  useChart(rHh,      () => null);
  useChart(rSdlBar,  () => null);

  return (
    <div
      id="page-insights"
      style={{display:isActive?'flex':'none',flexDirection:'column',height:'100%',overflow:'hidden'}}
    >
      <div
        className="ins-scroll"
        style={{flex:'1 1 0',minHeight:0,height:0,overflowY:'scroll',
                display:'flex',flexDirection:'column',gap:14,padding:'18px 20px 40px'}}
      >
        {/* ── Header ── */}
        <div className="ins-header-wrap">
          <div className="ins-header-left">
            <div className="ins-label">INSTITUTIONAL ECONOMIC INTELLIGENCE BRIEFING</div>
            <div className="ins-title">India Capital Markets Command Center</div>
            <div className="ins-sub">Real-time synthesis of equity, debt, FPI, derivatives and macro intelligence</div>
          </div>
          <div className="ins-mode-box">
            <div className="ins-mode-lbl">CURRENT MARKET MODE</div>
            <div className="ins-mode-val">Defensive</div>
            <div className="ins-mode-note">Risk-off · FPI selling · Elevated Vol</div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="ins-filters">
          <div className="ins-btn-group">
            {['1Y','3Y','5Y','All'].map(p => (
              <button key={p} className={`ins-btn${period===p?' on':''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="ins-range">
            <span className="ins-lbl">From</span>
            <select className="ins-sel" value={fromYear} onChange={e => setFromYear(e.target.value)}>
              {['2014','2015','2016','2017','2018','2019','2020'].map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="ins-lbl">To</span>
            <select className="ins-sel" value={toYear} onChange={e => setToYear(e.target.value)}>
              {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* ── 6 KPI cards ── */}
        <div className="ins-kpis">
          {[
            { lbl: 'NSE MARKET CAP',    note: 'Equity market cap'         },
            { lbl: 'DEMAT ACCOUNTS',    note: 'Active demat holders'      },
            { lbl: 'MUTUAL FUND AUM',   note: 'AMFI total AUM'            },
            { lbl: 'DEBT MARKET STOCK', note: 'Outstanding debt securities'},
            { lbl: 'LATEST FPI NET',    note: 'Latest month net flow'     },
            { lbl: '10Y G-SEC YIELD',   note: 'Zero coupon / slope'       },
          ].map(k => (
            <div key={k.lbl} className="ins-kpi">
              <div className="ins-kpi-lbl">{k.lbl}</div>
              <div className="ins-kpi-num">—</div>
              <div className="ins-kpi-note">{k.note}</div>
            </div>
          ))}
        </div>

        {/* ── Intelligence Cards — no data ── */}
        <div className="ins-card" style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--tx3)', fontSize: 13 }}>
          No intelligence briefings available
        </div>

        {/* ── Capital Market Balance Sheet — full width ── */}
        <div className="ins-card">
          <div className="ins-card-hd">
            <span className="ins-card-title">Capital Market Balance Sheet</span>
            <span className="ins-badge ins-badge-blue">Annual</span>
            <span className="ins-badge ins-badge-grn">₹3.1L Cr Capital Formation 2026</span>
          </div>
          <div className="ins-card-sub">₹ Lakh Crore · equity + debt + MF + PMS aggregated stock</div>
          <div ref={rBal} style={{height:260}} />
        </div>

        {/* ── NSE MCap | MF AUM  side-by-side ── */}
        <div className="ins-row2">
          <div className="ins-card">
            <div className="ins-card-hd"><span className="ins-card-title">NSE Market Capitalisation</span></div>
            <div className="ins-card-sub">₹ Lakh Crore · Nov 2014 → Mar 2026</div>
            <div ref={rNseMcap} style={{height:240}} />
          </div>
          <div className="ins-card">
            <div className="ins-card-hd"><span className="ins-card-title">Mutual Fund AUM</span></div>
            <div className="ins-card-sub">₹ Lakh Crore · AMFI data</div>
            <div ref={rMfAum} style={{height:240}} />
          </div>
        </div>

        {/* ── Demat | FPI Net  side-by-side ── */}
        <div className="ins-row2">
          <div className="ins-card">
            <div className="ins-card-hd"><span className="ins-card-title">Demat Account Growth</span></div>
            <div className="ins-card-sub">Crore accounts · CDSL + NSDL combined</div>
            <div ref={rDemat} style={{height:240}} />
          </div>
          <div className="ins-card">
            <div className="ins-card-hd"><span className="ins-card-title">FPI Net Equity Flows</span></div>
            <div className="ins-card-sub">₹ Crore · recent 24 months</div>
            <div ref={rFpi} style={{height:240}} />
          </div>
        </div>

        {/* ── Yield Curve — full width ── */}
        <div className="ins-card">
          <div className="ins-card-hd">
            <span className="ins-card-title">G-Sec Yield Curve</span>
            <span className="ins-badge ins-badge-pur">Current vs 1M vs 1Y Ago</span>
          </div>
          <div className="ins-card-sub">% yield across tenors · slope = 10Y minus 3M spread</div>
          <div ref={rYield} style={{height:260}} />
        </div>

        {/* ── Household Financial Flywheel — full width ── */}
        <div className="ins-card">
          <div className="ins-card-hd">
            <span className="ins-card-title">Household Financial Flywheel</span>
            <span className="ins-badge ins-badge-grn">Structural Demand</span>
          </div>
          <div className="ins-card-sub">₹ Crore/month · SIP + insurance + provident fund flows</div>
          <div ref={rHh} style={{height:260}} />
        </div>

        {/* ── SDL State Borrowing Chart — full width ── */}
        <div className="ins-card">
          <div className="ins-card-hd">
            <span className="ins-card-title">SDL State Borrowing</span>
            <span className="ins-badge ins-badge-amber">₹ L Crore outstanding</span>
          </div>
          <div className="ins-card-sub">State Development Loans outstanding — top 15 states</div>
          <div ref={rSdlBar} style={{height:240}} />
        </div>

        {/* ── State Borrowing Watchlist Table ── */}
        <div className="ins-card">
          <div className="ins-card-hd">
            <span className="ins-card-title">State Borrowing Watchlist</span>
            <span className="ins-badge ins-badge-blue">SDL Monitor</span>
          </div>
          <div className="ins-card-sub">Top 15 states by outstanding SDL — ratings, coupon, maturity, status</div>
          <div className="ins-tbl-wrap">
            <table className="ins-tbl">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Amount (₹L Cr)</th>
                  <th>Rating</th>
                  <th>Coupon</th>
                  <th>Maturity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--tx3)', padding: '24px 0', fontSize: '12px' }}>No data available</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        .ins-scroll::-webkit-scrollbar{width:6px}
        .ins-scroll::-webkit-scrollbar-track{background:transparent}
        .ins-scroll::-webkit-scrollbar-thumb{background:rgba(128,128,128,.35);border-radius:3px}

        /* Header */
        .ins-header-wrap{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
        .ins-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
          color:var(--tx3,#888);margin-bottom:4px}
        .ins-title{font-size:22px;font-weight:700;color:var(--tx2,#e0e0e0);letter-spacing:-.3px}
        .ins-sub{font-size:12px;color:var(--tx3,#888);margin-top:3px}
        .ins-mode-box{flex-shrink:0;background:rgba(224,80,96,.10);border:1px solid rgba(224,80,96,.30);
          border-radius:8px;padding:10px 16px;text-align:right}
        .ins-mode-lbl{font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;
          color:rgba(224,80,96,.8);margin-bottom:3px}
        .ins-mode-val{font-size:18px;font-weight:700;color:#e05060;line-height:1}
        .ins-mode-note{font-size:10px;color:rgba(224,80,96,.65);margin-top:3px}

        /* Filters */
        .ins-filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;
          padding:8px 0;border-bottom:1px solid var(--bdr,rgba(255,255,255,.06))}
        .ins-btn-group{display:flex;gap:4px}
        .ins-btn{padding:3px 11px;border-radius:4px;font-size:11px;font-weight:500;cursor:pointer;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:transparent;color:var(--tx2,#ccc);transition:all .15s}
        .ins-btn.on{background:var(--green,#2d8a4e);border-color:var(--green,#2d8a4e);color:#fff}
        .ins-btn:hover:not(.on){background:var(--sf2,rgba(255,255,255,.06))}
        .ins-range{display:flex;align-items:center;gap:6px}
        .ins-lbl{font-size:11px;color:var(--tx3,#888)}
        .ins-sel{padding:3px 7px;border-radius:4px;font-size:11px;
          border:1px solid var(--bdr2,rgba(255,255,255,.12));
          background:var(--sf,#1c1c1c);color:var(--tx2,#ccc);cursor:pointer}

        /* KPI cards */
        .ins-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
        .ins-kpi{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:14px 16px}
        .ins-kpi-lbl{font-size:10px;font-weight:600;color:var(--tx3,#888);
          letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;line-height:1.3}
        .ins-kpi-num{font-size:24px;font-weight:700;color:var(--tx2,#e0e0e0);
          letter-spacing:-.5px;line-height:1}
        .ins-kpi-unit{font-size:13px;font-weight:500;margin-left:2px;color:var(--tx3,#888)}
        .ins-kpi-grn{color:#26c99a}
        .ins-kpi-red{color:#e05060}
        .ins-kpi-note{font-size:10px;color:var(--tx3,#888);margin-top:5px;line-height:1.4}

        /* Intelligence cards */
        .ins-intel-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .ins-intel-card{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:8px}
        .ins-intel-cat{display:inline-flex;align-items:center;padding:2px 10px;border-radius:20px;
          font-size:10px;font-weight:700;letter-spacing:.8px;border:1px solid;width:fit-content}
        .ins-intel-title{font-size:13px;font-weight:700;color:var(--tx2,#e0e0e0);line-height:1.3}
        .ins-intel-body{font-size:11px;color:var(--tx3,#888);line-height:1.6}
        .ins-intel-focus{font-size:11px;color:var(--tx2,#e0e0e0);line-height:1.5;
          border-top:1px solid var(--bdr,rgba(255,255,255,.06));padding-top:8px}
        .ins-intel-focus-lbl{font-weight:700;color:var(--green,#2d8a4e)}

        /* Cards */
        .ins-card{background:var(--sf,#1c1c1c);border:1px solid var(--bdr,rgba(255,255,255,.06));
          border-radius:8px;padding:16px}
        .ins-card-hd{display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap}
        .ins-card-title{font-size:13px;font-weight:600;color:var(--tx2,#e0e0e0)}
        .ins-card-sub{font-size:11px;color:var(--tx3,#888);margin-bottom:14px}
        .ins-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}

        /* Badges */
        .ins-badge{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:600}
        .ins-badge-blue{background:rgba(74,144,217,.15);color:#7ab8f5;border:1px solid rgba(74,144,217,.3)}
        .ins-badge-grn{background:rgba(38,201,154,.12);color:#26c99a;border:1px solid rgba(38,201,154,.3)}
        .ins-badge-pur{background:rgba(139,92,246,.15);color:#a78bfa;border:1px solid rgba(139,92,246,.3)}
        .ins-badge-amber{background:rgba(240,160,64,.15);color:#f0a040;border:1px solid rgba(240,160,64,.3)}

        /* Table */
        .ins-tbl-wrap{overflow-x:auto}
        .ins-tbl{width:100%;border-collapse:collapse;font-size:12px}
        .ins-tbl th{padding:8px 12px;text-align:left;font-size:10px;font-weight:600;
          letter-spacing:.4px;text-transform:uppercase;color:var(--tx3,#888);
          border-bottom:1px solid var(--bdr,rgba(255,255,255,.06))}
        .ins-tbl td{padding:9px 12px;border-bottom:1px solid var(--bdr,rgba(255,255,255,.04));
          color:var(--tx2,#e0e0e0)}
        .ins-tbl tr:last-child td{border-bottom:none}
        .ins-tbl tr:hover td{background:var(--sf2,rgba(255,255,255,.03))}
        .ins-tbl-num{text-align:right;font-variant-numeric:tabular-nums}

        /* Ratings */
        .ins-rating{padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700}
        .ins-rating-aap{background:rgba(38,201,154,.15);color:#26c99a}
        .ins-rating-aa{background:rgba(74,144,217,.15);color:#7ab8f5}
        .ins-rating-ap{background:rgba(240,160,64,.15);color:#f0a040}
        .ins-rating-a{background:rgba(224,80,96,.15);color:#e05060}

        /* Status */
        .ins-status{padding:1px 7px;border-radius:3px;font-size:10px;font-weight:600}
        .ins-status-active{background:rgba(38,201,154,.15);color:#26c99a}
        .ins-status-watch{background:rgba(240,160,64,.15);color:#f0a040}
        .ins-status-caution{background:rgba(224,80,96,.15);color:#e05060}
      `}</style>
    </div>
  );
}
