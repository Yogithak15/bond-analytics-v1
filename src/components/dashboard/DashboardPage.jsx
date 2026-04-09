import React, { useState, useEffect } from 'react';
import { getMarketComposition, analyticsAggregate, getGsecMaturityProfile, getStateOutstandingShare, getNcdPublicIssuesTrend, getPrivatePlacementTrend, getCorpBondTradingTrend, getCorpBondOutstandingByIssuer } from '../../api/bond_api';

// Format crores → "52.9L" / "5.3K"
const fmtL = (cr) => {
  if (!cr && cr !== 0) return '—';
  if (cr >= 100000) return (cr / 100000).toFixed(1) + 'L';
  if (cr >= 1000)   return (cr / 1000).toFixed(1) + 'K';
  return String(Math.round(cr));
};

export default function DashboardPage() {
  const [mktComp, setMktComp] = useState(null);

  // Fetch market composition on mount
  useEffect(() => {
    getMarketComposition('2025-26')
      .then(setMktComp)
      .catch(err => console.error('Market composition:', err));
  }, []);

  // Derived segment values
  const segments  = mktComp?.segments || [];
  const gsec      = segments.find(s => s.instrument === 'G-Secs')    || {};
  const sdl       = segments.find(s => s.instrument === 'SDLs')       || {};
  const corp      = segments.find(s => s.instrument === 'Corp Bonds') || {};
  const grandTotal = mktComp?.grand_total_cr ?? null;

  // ── NCD IPO + Private Placements ────────────────────────────────────────────
  const [ncdData, setNcdData] = useState([]);
  const [ppData,  setPpData]  = useState([]);

  useEffect(() => {
    analyticsAggregate({ source_id: 1, date_attribute_type_id: 2, granularity: 'financial_year', metric_id: 2, limit: 100 })
      .then(rows => setNcdData(rows || []))
      .catch(err => console.error('NCD IPO fetch:', err));
    analyticsAggregate({ source_id: 2, date_attribute_type_id: 3, granularity: 'financial_year', metric_id: 4, limit: 100 })
      .then(rows => setPpData(rows || []))
      .catch(err => console.error('Private Placement fetch:', err));
  }, []);

  // Draw NCD vs PP chart once both datasets are loaded
  useEffect(() => {
    if (!ncdData.length || !ppData.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-ov-ncd-pp');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      // Build period-keyed maps and find last 8 common periods
      const ncdMap = Object.fromEntries(ncdData.map(r => [r.period, r.value]));
      const ppMap  = Object.fromEntries(ppData.map(r => [r.period, r.value]));

      // All NCD periods sorted
      const allPeriods = ncdData.map(r => r.period).sort();
      const periods    = allPeriods;

      const ncdVals = periods.map(p => Math.round(ncdMap[p] ?? 0));
      const ppVals  = periods.map(p => +(((ppMap[p] ?? 0) / 1000).toFixed(1)));  // ₹K Cr

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels: periods,
          datasets: [
            {
              label: 'NCD IPO (₹ Cr)',
              data: ncdVals,
              backgroundColor: 'rgba(0,68,123,.75)',
              borderColor: 'transparent',
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: 'y',
            },
            {
              label: 'Pvt. Placement (₹K Cr)',
              data: ppVals,
              type: 'line',
              borderColor: '#2d8a4e',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: '#2d8a4e',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) =>
                  ctx.datasetIndex === 0
                    ? ` NCD IPO: ₹${ctx.parsed.y.toLocaleString('en-IN')} Cr`
                    : ` Pvt. Placement: ₹${ctx.parsed.y}K Cr`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
              title: { display: true, text: '₹ Cr (NCD)', color: '#00447b', font: { size: 9 } },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'K',
              },
              border: { display: false },
              title: { display: true, text: '₹K Cr (PP)', color: '#2d8a4e', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 500);
    return () => clearTimeout(t);
  }, [ncdData, ppData]);

  // ── Corp Bonds Outstanding + Trades ─────────────────────────────────────────
  const [corpOsData,    setCorpOsData]    = useState([]);
  const [corpTradeData, setCorpTradeData] = useState([]);

  useEffect(() => {
    analyticsAggregate({ source_id: 4, dimension_type_id: 4, metric_id: 21, date_attribute_type_id: 3, granularity: 'quarter', limit: 100 })
      .then(rows => setCorpOsData(rows || []))
      .catch(err => console.error('Corp OS fetch:', err));
    analyticsAggregate({ source_id: 3, dimension_type_id: 3, metric_id: 6, date_attribute_type_id: 3, granularity: 'quarter', limit: 100 })
      .then(rows => setCorpTradeData(rows || []))
      .catch(err => console.error('Corp Trades fetch:', err));
  }, []);

  useEffect(() => {
    if (!corpOsData.length || !corpTradeData.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-ov-corp-os');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const osMap    = Object.fromEntries(corpOsData.map(r => [r.period, r.value]));
      const tradeMap = Object.fromEntries(corpTradeData.map(r => [r.period, r.value]));

      // Union of all periods from both datasets, starting from 2020-Q2 (when OS data begins)
      const allPeriods = new Set([
        ...corpOsData.map(r => r.period),
        ...corpTradeData.map(r => r.period),
      ]);
      const periods = [...allPeriods].filter(p => p >= '2020-Q2').sort();

      // null for missing OS periods (2025+) so bar disappears; null for missing trade periods
      const osVals    = periods.map(p => osMap[p]    != null ? +((osMap[p]    / 100000).toFixed(2)) : null);
      const tradeVals = periods.map(p => tradeMap[p] != null ? +(( tradeMap[p] / 1000).toFixed(1))  : null);

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels: periods,
          datasets: [
            {
              label: 'Corp Bonds Outstanding (₹L Cr)',
              data: osVals,
              backgroundColor: 'rgba(0,68,123,.75)',
              borderColor: 'transparent',
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: 'y',
            },
            {
              label: 'Trade Amount (₹K Cr)',
              data: tradeVals,
              type: 'line',
              borderColor: '#2d8a4e',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: '#2d8a4e',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.35,
              spanGaps: true,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) =>
                  ctx.datasetIndex === 0
                    ? ` Outstanding: ₹${ctx.parsed.y}L Cr`
                    : ` Trades: ₹${ctx.parsed.y}K Cr`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 9 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'L',
              },
              border: { display: false },
              title: { display: true, text: '₹L Cr (Outstanding)', color: '#00447b', font: { size: 9 } },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'K',
              },
              border: { display: false },
              title: { display: true, text: '₹K Cr (Trades)', color: '#2d8a4e', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 500);
    return () => clearTimeout(t);
  }, [corpOsData, corpTradeData]);

  // ── SDL Outstanding Yearly Trend ─────────────────────────────────────────────
  const [sdlTrendData, setSdlTrendData] = useState([]);

  useEffect(() => {
    analyticsAggregate({
      source_id: 7,
      date_attribute_type_id: 5,
      dimension_type_id: 11,
      metric_id: 29,
      granularity: 'financial_year',
      limit: 100,
    })
      .then(rows => setSdlTrendData(rows || []))
      .catch(err => console.error('SDL trend fetch:', err));
  }, []);

  useEffect(() => {
    if (!sdlTrendData.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-sdl-trend');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const sorted = [...sdlTrendData].sort((a, b) => a.period > b.period ? 1 : -1);
      const labels = sorted.map(r => r.period);
      const vals   = sorted.map(r => Math.round(r.value));

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: '₹ Cr',
            data: vals,
            backgroundColor: 'rgba(0,68,123,.75)',
            borderColor: 'transparent',
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => ` Outstanding: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')} Cr`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 100000 ? (v / 100000).toFixed(0) + 'L' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
              title: { display: true, text: '₹ Cr', color: '#00447b', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [sdlTrendData]);

  // ── NCD Public Issues Yearly Trend ───────────────────────────────────────────
  const [ncdTrendData, setNcdTrendData] = useState(null);

  useEffect(() => {
    getNcdPublicIssuesTrend()
      .then(setNcdTrendData)
      .catch(err => console.error('NCD trend fetch:', err));
  }, []);

  useEffect(() => {
    if (!ncdTrendData?.data?.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-ncd');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const rows   = ncdTrendData.data;
      const labels = rows.map(r => r.period);
      const amounts = rows.map(r => Math.round(r.amount_cr));
      const counts  = rows.map(r => r.issue_count);

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Amount (₹ Cr)',
              data: amounts,
              backgroundColor: 'rgba(0,68,123,.75)',
              borderColor: 'transparent',
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: 'y',
            },
            {
              label: 'Issue Count',
              data: counts,
              type: 'line',
              borderColor: '#2d8a4e',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: '#2d8a4e',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) =>
                  ctx.datasetIndex === 0
                    ? ` Amount: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')} Cr`
                    : ` Issues: ${ctx.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
              title: { display: true, text: '₹ Cr', color: '#00447b', font: { size: 9 } },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
              },
              border: { display: false },
              title: { display: true, text: 'Issue Count', color: '#2d8a4e', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [ncdTrendData]);

  // ── Private Placement Yearly Trend ───────────────────────────────────────────
  const [ppTrendData, setPpTrendData] = useState(null);

  useEffect(() => {
    getPrivatePlacementTrend()
      .then(setPpTrendData)
      .catch(err => console.error('PP trend fetch:', err));
  }, []);

  useEffect(() => {
    if (!ppTrendData?.data?.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-pp');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const rows    = ppTrendData.data;
      const labels  = rows.map(r => r.period);
      const amounts = rows.map(r => Math.round(r.amount_cr));
      const counts  = rows.map(r => r.issue_count);

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Amount (₹ Cr)',
              data: amounts,
              backgroundColor: 'rgba(0,68,123,.75)',
              borderColor: 'transparent',
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: 'y',
            },
            {
              label: 'Issue Count',
              data: counts,
              type: 'line',
              borderColor: '#2d8a4e',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: '#2d8a4e',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) =>
                  ctx.datasetIndex === 0
                    ? ` Amount: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')} Cr`
                    : ` Issues: ${ctx.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 100000 ? (v / 100000).toFixed(0) + 'L' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
              title: { display: true, text: '₹ Cr', color: '#00447b', font: { size: 9 } },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
              title: { display: true, text: 'Issue Count', color: '#2d8a4e', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [ppTrendData]);

  // ── Corp Bond Trading Volume ─────────────────────────────────────────────────
  const [tradingTrend, setTradingTrend] = useState(null);

  useEffect(() => {
    getCorpBondTradingTrend()
      .then(setTradingTrend)
      .catch(err => console.error('Corp bond trading trend fetch:', err));
  }, []);

  useEffect(() => {
    if (!tradingTrend?.data?.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-trade');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const rows    = tradingTrend.data;
      const labels  = rows.map(r => r.period);
      const amounts = rows.map(r => +(r.amount_cr / 100000).toFixed(2)); // ₹L Cr
      const counts  = rows.map(r => r.trade_count);

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Volume (₹L Cr)',
              data: amounts,
              backgroundColor: 'rgba(0,68,123,.75)',
              borderColor: 'transparent',
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: 'y',
            },
            {
              label: 'Trade Count',
              data: counts,
              type: 'line',
              borderColor: '#2d8a4e',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: '#2d8a4e',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) =>
                  ctx.datasetIndex === 0
                    ? ` Volume: ₹${ctx.parsed.y}L Cr`
                    : ` Trades: ${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'L',
              },
              border: { display: false },
              title: { display: true, text: '₹ L Cr', color: '#00447b', font: { size: 9 } },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
              title: { display: true, text: 'Trade Count', color: '#2d8a4e', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [tradingTrend]);

  // ── Corp Bond Outstanding by Issuer ──────────────────────────────────────────
  const [issuerData, setIssuerData] = useState(null);

  useEffect(() => {
    getCorpBondOutstandingByIssuer()
      .then(setIssuerData)
      .catch(err => console.error('Issuer outstanding fetch:', err));
  }, []);

  useEffect(() => {
    if (!issuerData?.breakdown?.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-issuer');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const breakdown = [...issuerData.breakdown].sort((a, b) => b.value_cr - a.value_cr);
      const labels    = breakdown.map(d => d.dimension_name);
      const values    = breakdown.map(d => +(d.value_cr / 100000).toFixed(2)); // ₹L Cr
      const shares    = breakdown.map(d => d.share_percent);

      const colors = [
        'rgba(0,68,123,.90)',
        'rgba(0,68,123,.78)',
        'rgba(0,68,123,.66)',
        'rgba(0,68,123,.56)',
        'rgba(0,68,123,.46)',
        'rgba(0,68,123,.38)',
        'rgba(0,68,123,.30)',
        'rgba(0,68,123,.24)',
      ];

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: '₹L Cr',
            data: values,
            backgroundColor: colors.slice(0, breakdown.length),
            borderColor: 'transparent',
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => {
                  const i = ctx.dataIndex;
                  return [
                    ` ₹${ctx.parsed.x}L Cr`,
                    ` Share: ${shares[i]}%`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'L',
              },
              border: { display: false },
              title: { display: true, text: '₹ L Cr', color: '#9a9d92', font: { size: 9 } },
            },
            y: {
              grid: { display: false },
              ticks: { color: tc, font: { size: 10 } },
              border: { display: false },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [issuerData]);

  // ── SDL State Outstanding (Top 10 chart + detailed table) ────────────────────
  const [sdlStateRows, setSdlStateRows] = useState([]);

  useEffect(() => {
    const SDL_NAME_MAP = {
      'JAMMU AND KASHMIR UT': 'Jammu & Kashmir',
      'JAMMU AND KASHMIR':    'Jammu & Kashmir',
      'JAMMU & KASHMIR':      'Jammu & Kashmir',
      'HIMACHAL':             'Himachal Pradesh',
      'HIMACHAL PRADESH':     'Himachal Pradesh',
      'NCT OF DELHI':         'Delhi',
      'DELHI':                'Delhi',
      'TAMILNADU':            'Tamil Nadu',
      'TAMIL NADU':           'Tamil Nadu',
      'ODISHA':               'Odisha',
      'ORISSA':               'Odisha',
    };
    const normStateName = (s) => {
      if (!s) return s;
      const up = s.trim().toUpperCase();
      return SDL_NAME_MAP[up] || s.trim().split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };

    getStateOutstandingShare()
      .then(raw => {
        const arr = Array.isArray(raw) ? raw : (raw.data || raw.states || []);
        const merged = {};
        arr.forEach(row => {
          const name = normStateName(row.state);
          if (merged[name]) {
            merged[name].total_outstanding += row.total_outstanding;
            merged[name].share_percent    += row.share_percent;
          } else {
            merged[name] = { ...row, state: name };
          }
        });
        const sorted = Object.values(merged).sort((a, b) => b.total_outstanding - a.total_outstanding);
        setSdlStateRows(sorted);
      })
      .catch(err => console.error('SDL state rows fetch:', err));
  }, []);

  useEffect(() => {
    if (!sdlStateRows.length) return;
    const C = window['Chart'];
    if (!C) return;

    const drawSdlChart = (canvasId) => {
      const el = document.getElementById(canvasId);
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const top10  = sdlStateRows.slice(0, 10);
      const labels = top10.map(d => d.state.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' '));
      const values = top10.map(d => +(d.total_outstanding / 1000).toFixed(1)); // ₹K Cr
      const shares = top10.map(d => +d.share_percent.toFixed(2));

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: '₹K Cr',
              data: values,
              backgroundColor: values.map((_, i) => `rgba(0,68,123,${(0.55 + i * 0.04).toFixed(2)})`),
              borderColor: 'transparent',
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: 'y',
            },
            {
              label: 'Share %',
              data: shares,
              type: 'line',
              borderColor: '#2d8a4e',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: '#2d8a4e',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) =>
                  ctx.datasetIndex === 0
                    ? ` ₹${ctx.parsed.y}K Cr`
                    : ` Share: ${ctx.parsed.y}%`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'K',
              },
              border: { display: false },
              title: { display: true, text: '₹K Cr', color: '#00447b', font: { size: 9 } },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + '%',
              },
              border: { display: false },
              title: { display: true, text: 'Share %', color: '#2d8a4e', font: { size: 9 } },
            },
          },
        },
      });
    };

    const draw = () => {
      drawSdlChart('c-sdl-states');
      drawSdlChart('c-ov-sdl-states');
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [sdlStateRows]);

  // ── G-Sec Maturity Profile ───────────────────────────────────────────────────
  const [gsecMaturity, setGsecMaturity] = useState(null);

  useEffect(() => {
    getGsecMaturityProfile()
      .then(setGsecMaturity)
      .catch(err => console.error('G-Sec maturity fetch:', err));
  }, []);

  useEffect(() => {
    if (!gsecMaturity?.buckets?.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-gsec-maturity');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const buckets = gsecMaturity.buckets;
      const labels  = buckets.map(b => b.label);
      const values  = buckets.map(b => +(b.value_cr / 100000).toFixed(2)); // ₹L Cr
      const counts  = buckets.map(b => b.bond_count);

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: '₹L Cr',
            data: values,
            backgroundColor: [
              'rgba(0,68,123,.55)',
              'rgba(0,68,123,.65)',
              'rgba(0,68,123,.80)',
              'rgba(0,68,123,.70)',
              'rgba(0,68,123,.90)',
            ],
            borderColor: 'transparent',
            borderRadius: 5,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => {
                  const cr = buckets[ctx.dataIndex].value_cr;
                  const cnt = counts[ctx.dataIndex];
                  return [
                    ` Outstanding: ₹${Number(cr.toFixed(0)).toLocaleString('en-IN')} Cr`,
                    ` Bonds: ${cnt}`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 11 } },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v + 'L',
              },
              border: { display: false },
              title: { display: true, text: '₹ L Cr', color: '#00447b', font: { size: 9 } },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [gsecMaturity]);

  // ── STRIPS Outstanding Trend ─────────────────────────────────────────────────
  const [stripsData, setStripsData] = useState([]);

  useEffect(() => {
    analyticsAggregate({
      source_id: 9,
      dimension_type_id: 15,
      date_attribute_type_id: 5,
      metric_id: 29,
      granularity: 'financial_year',
      limit: 100,
    })
      .then(rows => setStripsData(rows || []))
      .catch(err => console.error('STRIPS fetch:', err));
  }, []);

  useEffect(() => {
    if (!stripsData.length) return;
    const C = window['Chart'];
    if (!C) return;

    const draw = () => {
      const el = document.getElementById('c-strips');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();

      const sorted  = [...stripsData].sort((a, b) => a.period > b.period ? 1 : -1);
      const labels  = sorted.map(r => r.period);
      const values  = sorted.map(r => Math.round(r.value));

      const gc = 'rgba(26,28,24,.05)';
      const tc = '#9a9d92';

      new C(el, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'STRIPS Outstanding',
            data: values,
            backgroundColor: 'rgba(0,68,123,.75)',
            borderColor: 'transparent',
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18',
              borderColor: 'rgba(255,255,255,.1)',
              borderWidth: 1,
              titleColor: '#888',
              bodyColor: '#f0f1ed',
              bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: { color: tc, font: { size: 10 }, maxRotation: 45 },
              border: { display: false },
            },
            y: {
              grid: { color: gc, lineWidth: 0.5 },
              ticks: {
                color: tc,
                font: { family: "'JetBrains Mono',monospace", size: 10 },
                callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v,
              },
              border: { display: false },
            },
          },
        },
      });
    };

    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [stripsData]);

  // Derived SDL state KPIs (sdlStateRows is sorted descending by total_outstanding)
  const sdlTotal       = sdlStateRows.reduce((s, r) => s + r.total_outstanding, 0);
  const sdlTop5Share   = sdlStateRows.slice(0, 5).reduce((s, r) => s + r.share_percent, 0);
  const sdlTop15Share  = sdlStateRows.slice(0, 15).reduce((s, r) => s + r.share_percent, 0);
  const sdlTopState    = sdlStateRows[0]?.state
    ? sdlStateRows[0].state.split(' ').map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : '—';

  // Derived STRIPS stats
  const stripsSorted  = [...stripsData].sort((a, b) => a.period > b.period ? 1 : -1);
  const stripsLatest  = stripsSorted.at(-1)?.value ?? null;
  const stripsEarliest = stripsSorted[0]?.value ?? null;
  const stripsGrowth  = stripsLatest && stripsEarliest && stripsEarliest > 0
    ? (stripsLatest / stripsEarliest).toFixed(1)
    : null;

  // Redraw c-ov-comp donut chart with live data
  useEffect(() => {
    if (!mktComp) return;
    const C = window['Chart'];
    if (!C) return;
    const draw = () => {
      const el = document.getElementById('c-ov-comp');
      if (!el) return;
      const existing = C.getChart ? C.getChart(el) : null;
      if (existing) existing.destroy();
      const vals = [gsec.value_cr || 0, sdl.value_cr || 0, corp.value_cr || 0];
      new C(el, {
        type: 'doughnut',
        data: {
          labels: ['G-Secs', 'SDLs', 'Corp Bonds'],
          datasets: [{ data: vals, backgroundColor: ['#e07b39','#0e7490','#2d8a4e'], borderWidth: 0, hoverOffset: 6 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a1c18', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
              bodyColor: '#f0f1ed', bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
              padding: 10, cornerRadius: 8,
              callbacks: {
                label: (ctx) => {
                  const seg = segments[ctx.dataIndex] || {};
                  return ` ₹${fmtL(ctx.raw)}L Cr · ${seg.share_percent ?? 0}%`;
                },
              },
            },
          },
        },
      });
    };
    const t = setTimeout(draw, 400);
    return () => clearTimeout(t);
  }, [mktComp, gsec, sdl, corp, segments]);

  // ── RBI Policy Rates ─────────────────────────────────────────────────────────
  const [rbiRates, setRbiRates] = useState({});

  useEffect(() => {
    const METRICS = [
      { key: 'repo_rate',    id: 46 },
      { key: 'sdf_rate',     id: 47 },
      { key: 'msf_rate',     id: 48 },
      { key: 'bank_rate',    id: 49 },
      { key: 'reverse_repo', id: 50 },
      { key: 'crr',          id: 51 },
      { key: 'slr',          id: 52 },
    ];
    Promise.all(
      METRICS.map(m =>
        analyticsAggregate({
          source_id: 11,
          date_attribute_type_id: 9,
          metric_id: m.id,
          granularity: 'month',
          aggregation: 'sum',
          limit: 100,
        })
          .then(rows => {
            const arr = Array.isArray(rows) ? rows : [];
            const latest = arr.length ? arr[arr.length - 1] : null;
            return { key: m.key, value: latest?.value ?? null, period: latest?.period ?? null };
          })
          .catch(() => ({ key: m.key, value: null, period: null }))
      )
    ).then(results => {
      const rates = {};
      results.forEach(r => { rates[r.key] = { value: r.value, period: r.period }; });
      setRbiRates(rates);
    });
  }, []);

  return (
    <div className="page" id="page-dash">
      <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>

        {/* RBI Policy Rates Band — above all tabs */}
        {Object.keys(rbiRates).length > 0 && (
          <div style={{display:'flex',alignItems:'center',padding:'0 16px',background:'#000',flexShrink:0,overflow:'auto'}}>
            <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 12px 8px 0',borderRight:'1px solid rgba(255,255,255,.12)',marginRight:'12px',flexShrink:0}}>
              <div style={{background:'#c0392b',color:'#fff',fontSize:'9px',fontWeight:700,padding:'2px 6px',borderRadius:'3px',letterSpacing:'.05em'}}>RBI</div>
              <span style={{fontSize:'10px',color:'rgba(255,255,255,.5)',fontWeight:600,whiteSpace:'nowrap'}}>Policy Rates</span>
            </div>
            <div style={{display:'flex',alignItems:'center',flex:1}}>
              {[
                { label: 'Repo',     key: 'repo_rate' },
                { label: 'SDF',      key: 'sdf_rate' },
                { label: 'MSF',      key: 'msf_rate' },
                { label: 'Bank Rate',key: 'bank_rate' },
                { label: 'Rev Repo', key: 'reverse_repo' },
                { label: 'CRR',      key: 'crr' },
                { label: 'SLR',      key: 'slr' },
              ].map((item, i, arr) => (
                <div key={item.key} style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',borderRight:i < arr.length - 1 ? '1px solid rgba(255,255,255,.1)' : 'none',whiteSpace:'nowrap'}}>
                  <span style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,.45)',letterSpacing:'.04em'}}>{item.label}</span>
                  <span style={{fontSize:'12px',fontWeight:700,fontFamily:'var(--mo)',color:rbiRates[item.key]?.value != null ? '#fff' : 'rgba(255,255,255,.3)'}}>
                    {rbiRates[item.key]?.value != null ? `${rbiRates[item.key].value}%` : '—'}
                  </span>
                </div>
              ))}
            </div>
            {rbiRates.repo_rate?.period && (
              <div style={{fontSize:'10px',color:'rgba(255,255,255,.3)',padding:'8px 0 8px 12px',borderLeft:'1px solid rgba(255,255,255,.12)',marginLeft:'4px',flexShrink:0,whiteSpace:'nowrap'}}>
                {rbiRates.repo_rate.period}
              </div>
            )}
          </div>
        )}

        {/* Dashboard section tabs */}
        <div className="dm-tabs">
          {/* {ncdTrendData?.latest?.period && ( */}
            {/* <div style={{display:'flex',alignItems:'center',padding:'0 14px 0 4px',borderRight:'1px solid var(--bdr)',marginRight:'4px',gap:'4px',flexShrink:0}}>
              <span style={{fontSize:'9px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',color:'var(--tx4)'}}>Latest FY</span>
              <span style={{fontSize:'12px',fontWeight:700,fontFamily:'var(--mo)',color:'var(--tx)'}}>
                {ncdTrendData.latest.period.replace('-', '–')}
              </span>
            </div> */}
          {/* )} */}
          <div className="dm-tab on" id="dmt-overview" onClick={() => window.dashTab('overview',this)}>Overview</div>
          <div className="dm-tab" id="dmt-gsec" onClick={() => window.dashTab('gsec',this)}>G-Secs</div>
          <div className="dm-tab" id="dmt-issuance" onClick={() => window.dashTab('issuance',this)}>SDL</div>
          <div className="dm-tab" id="dmt-secondary" onClick={() => window.dashTab('secondary',this)}>Corp Bonds</div>
          {/* <div className="dm-tab" id="dmt-sources" onClick={() => window.dashTab('sources',this)}>Data Sources</div> */}
          <div className="dm-tabs-right">
            <div className="dm-live-badge"><span className="dm-live-dot"></span>Live</div>
            {/* <span className="dm-date">FY 2025&#x2013;26 · 24 Mar 2026</span> */}
          </div>
        </div>

        {/* scrollable content */}
        <div className="scroll dm-content" id="dm-content">

          {/* ── OVERVIEW TAB ── */}
          <div className="dm-pane on" id="dmp-overview">

            {/* KPI tiles — live from market-composition API */}
            <div className="dm-kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
              <div className="dm-kpi dm-kpi-2"><div className="dm-kpi-l">G-Sec Outstanding</div><div className="dm-kpi-v">{fmtL(gsec.value_cr)}<span className="dm-kpi-u">Cr</span></div><div className="dm-kpi-s">RBI · GoI Securities</div></div>
              <div className="dm-kpi dm-kpi-3"><div className="dm-kpi-l">SDL Outstanding</div><div className="dm-kpi-v">{fmtL(sdl.value_cr)}<span className="dm-kpi-u">Cr</span></div><div className="dm-kpi-s">States · RBI</div></div>
              <div className="dm-kpi dm-kpi-4"><div className="dm-kpi-l">Corp Bond Outstanding</div><div className="dm-kpi-v">{fmtL(corp.value_cr)}<span className="dm-kpi-u">Cr</span></div><div className="dm-kpi-s">Latest quarter · SEBI</div></div>
              <div className="dm-kpi dm-kpi-1"><div className="dm-kpi-l">Total Debt Market</div><div className="dm-kpi-v">{fmtL(grandTotal)}<span className="dm-kpi-u">Cr</span></div><div className="dm-kpi-s">G-Sec + SDL + Corp</div></div>
            </div>

            {/* SDL MAP CARD */}
            <div className="sdl-card">
              <div className="sdl-hdr">
                <div className="sdl-hdr-left">
                  <div>
                    <div className="sdl-hdr-title">State Development Loans — Outstanding</div>
                    <div className="sdl-hdr-sub">Choropleth by state · Source: RBI</div>
                  </div>
                </div>
              </div>
              {/* sdl-body: React portal mount point — content rendered by IndiaMap component */}
              <div className="sdl-body" id="sdl-body-mount"></div>
            </div>
            {/* /sdl-card */}

            <div className="g2">

             <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Top State Borrowings (SDL)</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Outstanding &#x20B9;K Cr (bar) + Share % (line) &middot; RBI</div></div>
                </div>
                <div className="cp" style={{height:'240px'}}><canvas id="c-ov-sdl-states"></canvas></div>
              </div>

            {/* ROW 1: Market Composition */}
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Market Composition</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Share of India debt market &middot;</div></div>
                  <div className="dm-pill">&#x20B9;{fmtL(grandTotal)}L Cr Total</div>
                </div>
                <div style={{display:'flex',alignItems:'center',height:'240px'}}>
                  <div className="cp" style={{flex:1,height:'100%'}}><canvas id="c-ov-comp"></canvas></div>
                  <div style={{padding:'0 18px',display:'flex',flexDirection:'column',gap:'10px',flexShrink:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#e07b39',flexShrink:0}}></div><div><div style={{fontSize:'10.5px',fontWeight:600,color:'var(--tx)'}}>G-Secs</div><div style={{fontSize:'11px',fontFamily:'var(--mo)',color:'var(--tx2)'}}>{fmtL(gsec.value_cr)} Cr &middot; {gsec.share_percent ?? '—'}%</div></div></div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#0e7490',flexShrink:0}}></div><div><div style={{fontSize:'10.5px',fontWeight:600,color:'var(--tx)'}}>SDLs</div><div style={{fontSize:'11px',fontFamily:'var(--mo)',color:'var(--tx2)'}}>{fmtL(sdl.value_cr)} Cr &middot; {sdl.share_percent ?? '—'}%</div></div></div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'10px',height:'10px',borderRadius:'2px',background:'#2d8a4e',flexShrink:0}}></div><div><div style={{fontSize:'10.5px',fontWeight:600,color:'var(--tx)'}}>Corp Bonds</div><div style={{fontSize:'11px',fontFamily:'var(--mo)',color:'var(--tx2)'}}>{fmtL(corp.value_cr)} Cr &middot; {corp.share_percent ?? '—'}%</div></div></div>
                  </div>
                </div>
              </div>
              </div>


              <div className="g2">
              
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}>
                  <div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>NCD IPO Issues vs Private Placements</div>
                  <div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>NCD amount &#x20B9;Cr (bar) + Pvt. Placement &#x20B9;K Cr (line) &middot; SEBI</div>
                </div>
                <div className="cp" style={{height:'240px'}}><canvas id="c-ov-ncd-pp"></canvas></div>
              </div>

              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}>
                  <div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Corporate Bonds Outstanding VS Trades in corporate Bonds</div>
                  <div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Outstanding &#x20B9;L Cr (bar) + Trade amount &#x20B9;K Cr (line) &middot; SEBI</div>
                </div>
                <div className="cp" style={{height:'240px'}}><canvas id="c-ov-corp-os"></canvas></div>
              </div>

              </div>

          </div>
          {/* /overview */}

          {/* ── SDL DEEP DIVE TAB ── */}
          <div className="dm-pane" id="dmp-issuance">
            <div className="dm-section-lbl"><div className="dm-sl-bar" style={{background:'#0e7490'}}></div><span>State Development Loans (SDL) &#x2014; Deep Dive</span></div>
            <div className="dm-kpi-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
              <div className="dm-kpi dm-kpi-3"><div className="dm-kpi-l">Total SDL Outstanding</div><div className="dm-kpi-v">{sdlTotal ? fmtL(sdlTotal) : '—'}<span className="dm-kpi-u">Cr</span></div><div className="dm-kpi-s">{sdlStateRows.length} States &middot; RBI</div></div>
              <div className="dm-kpi dm-kpi-5"><div className="dm-kpi-l">Top 5 States Share</div><div className="dm-kpi-v">{sdlStateRows.length ? sdlTop5Share.toFixed(1) : '—'}<span className="dm-kpi-u">%</span></div><div className="dm-kpi-s">{sdlTopState} leads</div></div>
              <div className="dm-kpi dm-kpi-6"><div className="dm-kpi-l">Top 15 States Share</div><div className="dm-kpi-v">{sdlStateRows.length >= 15 ? sdlTop15Share.toFixed(1) : '—'}<span className="dm-kpi-u">%</span></div><div className="dm-kpi-s">High concentration</div></div>
            </div>
            <div className="g2">
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>SDL Outstanding &#x2014; Yearly Trend</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>&#x20B9; Cr &middot; RBI</div></div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-sdl-trend"></canvas></div>
              </div>
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Top 10 States &#x2014; SDL Outstanding</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>&#x20B9;K Cr (bar) + Share % (line) &middot; RBI</div></div><div className="dm-pill">FY 2025&#x2013;26</div></div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-sdl-states"></canvas></div>
              </div>
            </div>
            <div className="card">
              <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>State-wise SDL Outstanding &#x2014; Detailed</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Source: RBI &middot; {sdlStateRows.length} states</div></div></div>
              <div className="tw"><table><thead><tr><th>#</th><th>State</th><th className="R">Outstanding (&#x20B9; Cr)</th><th className="R">Share</th></tr></thead>
              <tbody>
                {sdlStateRows.map((row, i) => (
                  <tr key={row.state}>
                    <td className="mo" style={{color:'var(--tx4)'}}>{i + 1}</td>
                    <td className="nm">{row.state}</td>
                    <td className="R mo">{Number(row.total_outstanding.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td className="R mo">{row.share_percent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody></table></div>
              {sdlStateRows.length > 0 && (
                <div className="tbl-foot">
                  {sdlStateRows.length} states &middot; &#x20B9;{Number((sdlStateRows.reduce((s, r) => s + r.total_outstanding, 0)).toFixed(0)).toLocaleString('en-IN')} Cr total
                </div>
              )}
            </div>
          </div>
          {/* /sdl tab */}

          {/* ── CORP BONDS DEEP DIVE TAB ── */}
          <div className="dm-pane" id="dmp-secondary">
            <div className="dm-section-lbl"><div className="dm-sl-bar" style={{background:'var(--green)'}}></div><span>Corporate Bonds &#x2014; Deep Dive</span></div>
            <div className="dm-kpi-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
              <div className="dm-kpi dm-kpi-4"><div className="dm-kpi-l">Corp Bond Trading Volume</div><div className="dm-kpi-v">{tradingTrend?.latest ? fmtL(tradingTrend.latest.amount_cr) : '—'}<span className="dm-kpi-u">Cr</span></div><div className="dm-kpi-s">{tradingTrend?.latest ? `${(tradingTrend.latest.trade_count / 1000000).toFixed(2)}M trades · SEBI` : 'Latest FY · SEBI'}</div></div>
              <div className="dm-kpi dm-kpi-5"><div className="dm-kpi-l">NCD Issues (FY26 YTD)</div><div className="dm-kpi-v">{ncdTrendData?.latest ? ncdTrendData.latest.issue_count.toLocaleString('en-IN') : '—'}</div><div className="dm-kpi-s">{ncdTrendData?.latest ? `₹${Number((ncdTrendData.latest.amount_cr/1000).toFixed(0))}K Cr raised` : '—'}</div></div>
              <div className="dm-kpi dm-kpi-6"><div className="dm-kpi-l">Private Placements (FY26)</div><div className="dm-kpi-v">{ppTrendData?.latest ? ppTrendData.latest.issue_count.toLocaleString('en-IN') : '—'}</div><div className="dm-kpi-s">{ppTrendData?.latest ? `₹${Number((ppTrendData.latest.amount_cr/100000).toFixed(1))}L Cr raised` : '—'}</div></div>
            </div>
            <div className="g2">
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>NCD Public Issues &#x2014; Yearly Trend</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Amount &#x20B9;Cr (bar) + Issue Count (line) &middot; SEBI</div></div><div className="dm-pill">Latest FY2025-26 : {ncdTrendData?.latest ? `${ncdTrendData.latest.issue_count} issues · ₹${Number(ncdTrendData.latest.amount_cr.toFixed(0)).toLocaleString('en-IN')} Cr` : '—'}</div></div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-ncd"></canvas></div>
              </div>
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Private Placements &#x2014; Yearly Trend</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Amount &#x20B9;Cr (bar) + Issue Count (line) &middot; SEBI</div></div><div className="dm-pill">{ppTrendData?.latest ? `${ppTrendData.latest.issue_count.toLocaleString('en-IN')} issues · ₹${Number((ppTrendData.latest.amount_cr / 100000).toFixed(1))}L Cr` : '—'}</div></div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-pp"></canvas></div>
              </div>
            </div>
            <div className="g2">
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Corp Bond Trading Volume</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Volume &#x20B9;L Cr (bar) + Trade Count (line) &middot; SEBI</div></div>{tradingTrend?.latest && <div className="dm-pill">{(tradingTrend.latest.trade_count / 1000000).toFixed(2)}M trades · &#x20B9;{(tradingTrend.latest.amount_cr / 100000).toFixed(1)}L Cr</div>}</div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-trade"></canvas></div>
              </div>
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Outstanding by Issuer Type</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>All dimensions &middot; &#x20B9;L Cr &middot; SEBI</div></div>{issuerData?.financial_year && <div className="dm-pill">FY {issuerData.financial_year}</div>}</div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-issuer"></canvas></div>
              </div>
            </div>
            <div className="card">
              <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Issuance Summary</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>FY-wise NCD + Private Placement breakdown</div></div>
              <div className="tw"><table><thead><tr><th>FY</th><th className="R">NCD Issues</th><th className="R">NCD Amount (&#x20B9; Cr)</th><th className="R">PP Issues</th><th className="R">PP Amount (&#x20B9; Cr)</th><th className="R">Total (&#x20B9; Cr)</th></tr></thead>
              <tbody>
                {(() => {
                  const ncdMap = Object.fromEntries((ncdTrendData?.data || []).map(r => [r.period, r]));
                  const ppMap  = Object.fromEntries((ppTrendData?.data  || []).map(r => [r.period, r]));
                  const allPeriods = [...new Set([
                    ...(ncdTrendData?.data || []).map(r => r.period),
                    ...(ppTrendData?.data  || []).map(r => r.period),
                  ])].sort();
                  const latestPeriod = allPeriods.at(-1);
                  return allPeriods.map(period => {
                    const ncd = ncdMap[period];
                    const pp  = ppMap[period];
                    const ncdAmt  = ncd?.amount_cr  ?? 0;
                    const ppAmt   = pp?.amount_cr   ?? 0;
                    const total   = ncdAmt + ppAmt;
                    const isLatest = period === latestPeriod;
                    return (
                      <tr key={period} style={isLatest ? {background:'var(--sf2)'} : {}}>
                        <td className="mo nm" style={isLatest ? {color:'var(--green)'} : {}}>{period.replace('-', '–')}</td>
                        <td className="R mo">{ncd ? ncd.issue_count.toLocaleString('en-IN') : '—'}</td>
                        <td className="R mo">{ncd ? Math.round(ncdAmt).toLocaleString('en-IN') : '—'}</td>
                        <td className="R mo">{pp  ? pp.issue_count.toLocaleString('en-IN')  : '—'}</td>
                        <td className="R mo">{pp  ? Math.round(ppAmt).toLocaleString('en-IN')  : '—'}</td>
                        <td className="R mo up">{total ? Math.round(total).toLocaleString('en-IN') : '—'}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody></table></div>
            </div>
          </div>
          {/* /corp bonds tab */}

          {/* ── G-SECS TAB ── */}
          <div className="dm-pane" id="dmp-gsec">
            <div className="dm-section-lbl"><div className="dm-sl-bar" style={{background:'#e07b39'}}></div><span>Government Securities (G-Secs) — RBI</span></div>
            <div className="g2" style={{marginBottom:'12px'}}>
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>G-Sec Maturity Profile</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>By residual maturity bucket</div></div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-gsec-maturity"></canvas></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',borderTop:'1px solid var(--bdr)'}}>
                  <div style={{padding:'10px 14px',textAlign:'center',borderRight:'1px solid var(--bdr)'}}><div style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--tx3)',marginBottom:'3px'}}>Buckets</div><div style={{fontSize:'15px',fontWeight:700,fontFamily:'var(--mo)',color:'var(--blue)'}}>{gsecMaturity?.stats?.total_buckets ?? '—'}</div></div>
                  <div style={{padding:'10px 14px',textAlign:'center',borderRight:'1px solid var(--bdr)'}}><div style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--tx3)',marginBottom:'3px'}}>Avg Maturity</div><div style={{fontSize:'15px',fontWeight:700,fontFamily:'var(--mo)',color:'var(--tx)'}}>{gsecMaturity?.stats?.avg_maturity_years != null ? `${gsecMaturity.stats.avg_maturity_years} yr` : '—'}</div></div>
                  <div style={{padding:'10px 14px',textAlign:'center'}}><div style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--tx3)',marginBottom:'3px'}}>Longest</div><div style={{fontSize:'15px',fontWeight:700,fontFamily:'var(--mo)',color:'var(--purple)'}}>{gsecMaturity?.stats?.longest_bucket ?? '—'}</div></div>
                </div>
              </div>
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>STRIPS Outstanding Trend</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>RBI · Financial Year</div></div>
                <div className="cp" style={{height:'220px'}}><canvas id="c-strips"></canvas></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderTop:'1px solid var(--bdr)'}}>
                  <div style={{padding:'10px 14px',textAlign:'center',borderRight:'1px solid var(--bdr)'}}><div style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--tx3)',marginBottom:'3px'}}>Latest</div><div style={{fontSize:'15px',fontWeight:700,fontFamily:'var(--mo)',color:'var(--blue)'}}>{stripsLatest != null ? fmtL(stripsLatest) : '—'}</div></div>
                  <div style={{padding:'10px 14px',textAlign:'center'}}><div style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--tx3)',marginBottom:'3px'}}>Source</div><div style={{fontSize:'13px',fontWeight:700,fontFamily:'var(--mo)',color:'var(--tx3)'}}>RBI</div></div>
                </div>
              </div>
            </div>
          </div>
          {/* /gsec */}

          {/* ── DATA SOURCES TAB ── */}
          {/* <div className="dm-pane" id="dmp-sources">
            <div className="dm-section-lbl"><div className="dm-sl-bar" style={{background:'var(--red)'}}></div><span>Market Summary &amp; Active Data Sources</span></div>
            <div className="g2">
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Issuance &amp; Trading Snapshot</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Latest data across channels</div></div>
                <div className="dm-snap-row"><div><div className="dm-snap-lbl">Private Placements (Latest)</div><div className="dm-snap-v" style={{color:'#e07b39'}}>7,29,968 <span>Issues</span></div></div><div className="dm-snap-right"><div className="dm-snap-amt">2K Cr</div><div className="dm-snap-meta">SEBI · Private placement</div></div></div>
                <div className="dm-snap-row"><div><div className="dm-snap-lbl">NCD Public Issues (Latest)</div><div className="dm-snap-v" style={{color:'var(--green)'}}>8,272 <span>Issues</span></div></div><div className="dm-snap-right"><div className="dm-snap-amt">4K Cr</div><div className="dm-snap-meta">SEBI · NCD public</div></div></div>
                <div className="dm-snap-row"><div><div className="dm-snap-lbl">Corp Bond Trading (Latest)</div><div className="dm-snap-v" style={{color:'var(--blue)'}}>1.8M <span>trades</span></div></div><div className="dm-snap-right"><div className="dm-snap-amt">22L Cr</div><div className="dm-snap-meta">SEBI · BSE/NSE/MCX</div></div></div>
                <div className="dm-snap-row"><div><div className="dm-snap-lbl">Corp Bond Outstanding (Q)</div><div className="dm-snap-v" style={{color:'var(--purple)'}}>3K Cr</div></div><div className="dm-snap-right"><div className="dm-snap-meta">Latest quarter · SEBI</div></div></div>
                <div className="dm-snap-row"><div><div className="dm-snap-lbl">SDL Outstanding (Total)</div><div className="dm-snap-v" style={{color:'var(--teal)'}}>3K Cr</div></div><div className="dm-snap-right"><div className="dm-snap-meta">RBI · State Dev Loans</div></div></div>
                <div className="dm-snap-row"><div><div className="dm-snap-lbl">G-Sec Outstanding (Total)</div><div className="dm-snap-v" style={{color:'#e07b39'}}>52K Cr</div></div><div className="dm-snap-right"><div className="dm-snap-meta">RBI · GoI Securities</div></div></div>
              </div>
              <div className="card">
                <div style={{padding:'12px 16px',borderBottom:'1px solid var(--bdr)'}}><div style={{fontSize:'13px',fontWeight:600,color:'var(--tx)'}}>Active Data Sources</div><div style={{fontSize:'11px',color:'var(--tx3)',marginTop:'2px'}}>Live datasets powering this dashboard</div></div>
                <div className="dm-ds-list">
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-sebi">SEBI</div><div className="dm-ds-info"><div className="dm-ds-name">Public Issues (NCD)</div><div className="dm-ds-slug">SEBI_CORP_DEBT</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-sebi">SEBI</div><div className="dm-ds-info"><div className="dm-ds-name">Private Placements</div><div className="dm-ds-slug">SEBI_PRIVATE_PLACEMENT</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-sebi">SEBI</div><div className="dm-ds-info"><div className="dm-ds-name">Corporate Bond Trades</div><div className="dm-ds-slug">SEBI_CORP_BOND_TRADES</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-sebi">SEBI</div><div className="dm-ds-info"><div className="dm-ds-name">Outstanding Bonds (Qtrly)</div><div className="dm-ds-slug">SEBI_OUTSTANDING_CORP_BONDS</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-sebi">SEBI</div><div className="dm-ds-info"><div className="dm-ds-name">Outstanding by Issuer</div><div className="dm-ds-slug">SEBI_OUTSTANDING_FIN_NONFINANCIAL</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-rbi">RBI</div><div className="dm-ds-info"><div className="dm-ds-name">State Dev Loans (SDLs)</div><div className="dm-ds-slug">RBI_SDL_OUTSTANDING</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-rbi">RBI</div><div className="dm-ds-info"><div className="dm-ds-name">G-Sec Outstanding</div><div className="dm-ds-slug">RBI_GSEC_OUTSTANDING</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-rbi">RBI</div><div className="dm-ds-info"><div className="dm-ds-name">FBIL Zero Coupon Yield Curve</div><div className="dm-ds-slug">RBI_FBIL_YIELD_CURVE</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                  <div className="dm-ds-row"><div className="dm-badge dm-badge-nse">NSE</div><div className="dm-ds-info"><div className="dm-ds-name">NSE EBP Corp Bond Placements</div><div className="dm-ds-slug">NSE_EBP_CORPORATE_BOND_PLACEMENTS</div></div><div className="dm-ds-live"><span className="dm-ds-dot"></span>Live</div></div>
                </div>
              </div>
            </div>
          </div> */}
          {/* /sources */}

        </div>
        {/* /dm-content */}
      </div>
    </div>
  );
}
