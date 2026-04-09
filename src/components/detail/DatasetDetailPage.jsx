import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  getDataSourceMetrics,
  getDataSourceDimensionTypes,
  getDataSourceDates,
  getDateAttributeTypes,
  getAllDimensions,
  analyticsAggregate,
  getDataSourceDateRange,
} from '../../api/bond_api';

// ── helpers ────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

// period label → first calendar date of that period
function periodToStartDate(period) {
  if (!period) return null;
  const s = String(period).trim();
  const qm = s.match(/^(\d{4})-Q(\d)$/i);
  if (qm) {
    const startMonths = ['01','04','07','10'];
    const q = parseInt(qm[2]) - 1;
    return `${qm[1]}-${startMonths[q]}-01`;
  }
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;
  const m = s.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const n = parseInt(m[2]);
    if (n > 12) return `${m[1]}-04-01`; // financial year starts April
    return `${m[1]}-${m[2]}-01`;
  }
  return null;
}

// period label → last calendar date of that period
function periodToEndDate(period) {
  if (!period) return null;
  const s = String(period).trim();
  const qm = s.match(/^(\d{4})-Q(\d)$/i);
  if (qm) {
    const endMonths = ['03','06','09','12'];
    const endDays   = ['31','30','30','31'];
    const q = parseInt(qm[2]) - 1;
    return `${qm[1]}-${endMonths[q]}-${endDays[q]}`;
  }
  if (/^\d{4}$/.test(s)) return `${s}-12-31`;
  const m = s.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const n = parseInt(m[2]);
    if (n > 12) {
      const endYear = parseInt(m[1]) + 1;
      return `${endYear}-03-31`;
    }
    const lastDay = new Date(parseInt(m[1]), n, 0).getDate();
    return `${m[1]}-${m[2]}-${String(lastDay).padStart(2,'0')}`;
  }
  return null;
}

function fmt(v, unit) {
  if (unit === '%') return v.toFixed(2) + '%';
  if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
  return Number(v).toLocaleString('en-IN');
}

const GRANULARITIES = [
  { label: 'Financial Year', value: 'financial_year' },
  { label: 'Yearly',         value: 'year'           },
  { label: 'Quarterly',      value: 'quarter'        },
  { label: 'Monthly',        value: 'month'          },
  { label: 'Weekly',      value: 'week'        },
  { label: 'Daily',        value: 'day'          },
];

const AGGREGATIONS = ['sum', 'avg', 'max', 'min', 'stddev'];

const CHART_COLORS = {
  line: { border: '#2557a7', bg: 'rgba(37,87,167,.08)' },
  area: { border: '#2557a7', bg: 'rgba(37,87,167,.18)' },
  bar:  { border: 'rgba(37,87,167,.85)', bg: 'rgba(37,87,167,.85)' },
  pie:  { border: '#fff',    bg: ['#2557a7','#2d8a4e','#c47a1e','#c0392b','#6d3fc0','#0e7490','#8b4513'] },
};

// ── component ──────────────────────────────────────────────────────────────
export default function DatasetDetailPage() {
  const [sourceId,       setSourceId]       = useState(null);
  const [datasetInfo,    setDatasetInfo]     = useState(null);

  // metadata
  const [metrics,        setMetrics]        = useState([]);
  const [dateAttrTypes,  setDateAttrTypes]  = useState([]);
  const [dimTypes,       setDimTypes]       = useState([]);
  const [dimensions,     setDimensions]     = useState([]);
  const [metaLoading,    setMetaLoading]    = useState(false);
  const [dimsLoading,    setDimsLoading]    = useState(false);

  // controls
  const [metricId,       setMetricId]       = useState(null);
  const [aggregation,    setAggregation]    = useState('sum');
  const [granularity,    setGranularity]    = useState('financial_year');
  const [dateAttrId,     setDateAttrId]     = useState(null);
  const [dimTypeId,      setDimTypeId]      = useState(null);
  const [selectedDims,   setSelectedDims]   = useState([]);
  const [dimSearch,      setDimSearch]      = useState('');
  const [startDate,      setStartDate]      = useState('');
  const [endDate,        setEndDate]        = useState('');
  const [availableStart, setAvailableStart] = useState('');
  const [availableEnd,   setAvailableEnd]   = useState('');

  // results
  const [results,        setResults]        = useState([]);
  const [unit,           setUnit]           = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError,   setAnalyticsError]   = useState(null);

  // chart
  const [chartType,      setChartType]      = useState('line');
  const chartRef         = useRef(null);
  const chartInstance    = useRef(null);

  // ── register React handler so App.jsx's openDetail override can call us ──
  useEffect(() => {
    window._onOpenDetail = (id) => setSourceId(String(id));
    return () => { delete window._onOpenDetail; };
  }, []);

  // ── load metadata when sourceId changes ───────────────────────────────
  useEffect(() => {
    if (!sourceId) return;

    // Find cached info from DATASETS
    const cached = window.DATASETS?.find(d => String(d.sourceId) === String(sourceId));
    setDatasetInfo(cached || null);

    // Reset everything

    setMetrics([]);
    setDateAttrTypes([]);
    setDimTypes([]);
    setDimensions([]);
    setSelectedDims([]);
    setDimTypeId(null);
    setDimSearch('');
    setStartDate('');
    setEndDate('');
    setAvailableStart('');
    setAvailableEnd('');
    setResults([]);
    setAnalyticsError(null);

    setMetaLoading(true);

    Promise.all([
      getDataSourceMetrics(sourceId),
      getDataSourceDates(sourceId),
      getDataSourceDimensionTypes(sourceId),
    ]).then(async ([metricsRes, datesRes, dimTypesRes]) => {
      const metricsList  = Array.isArray(metricsRes)  ? metricsRes  : [];
      const datesList    = Array.isArray(datesRes)    ? datesRes    : [];
      const dimTypesList = Array.isArray(dimTypesRes) ? dimTypesRes : [];

      setMetrics(metricsList);
      setDimTypes(dimTypesList);

      // Fetch full date attribute type details (name, etc.) in parallel
      const dateDetails = await Promise.all(
        datesList.map(item => {
          const id = item.date_attribute_type_id || item.id;
          return id ? getDateAttributeTypes(id).catch(() => item) : Promise.resolve(item);
        })
      );
      setDateAttrTypes(dateDetails);

      // Set defaults
      const firstMetric  = metricsList[0];
      const firstDate    = dateDetails[0];
      const firstDimType = dimTypesList[0];
      const firstMetricId  = firstMetric?.metric_id ?? firstMetric?.id ?? null;
      const firstDateAttrId = firstDate?.date_attribute_type_id ?? firstDate?.id ?? null;
      setMetricId(firstMetricId);
      setUnit(firstMetric?.unit || '');
      setDateAttrId(firstDateAttrId);
      setDimTypeId(String(firstDimType?.dimension_type_id ?? firstDimType?.id ?? '') || null);

      // Fetch available date range and pre-fill date pickers before analytics fires
      if (firstMetricId && firstDateAttrId) {
        try {
          const { start, end } = await getDataSourceDateRange({
            source_id: sourceId,
            date_attribute_type_id: firstDateAttrId,
            metric_id: firstMetricId,
          });
          if (start) {
            setAvailableStart(start);
            const s = periodToStartDate(start);
            if (s) setStartDate(s);
          }
          if (end) {
            setAvailableEnd(end);
            const e = periodToEndDate(end);
            if (e) setEndDate(e);
          }
        } catch (_) { /* fall through; analytics will still run */ }
      }
    }).catch(console.error)
      .finally(() => setMetaLoading(false));
  }, [sourceId]);

  // ── load dimensions when dim type changes ─────────────────────────────
  useEffect(() => {
    if (!dimTypeId) { setDimensions([]); setSelectedDims([]); return; }
    setDimsLoading(true);
    setSelectedDims([]);
    getAllDimensions(dimTypeId)
      .then(res => setDimensions(Array.isArray(res) ? res : []))
      .catch(() => setDimensions([]))
      .finally(() => setDimsLoading(false));
  }, [dimTypeId]);

  // ── update unit when metric changes ──────────────────────────────────
  useEffect(() => {
    const m = metrics.find(m => String(m.metric_id ?? m.id) === String(metricId));
    if (m) setUnit(m.unit || '');
  }, [metricId, metrics]);

  // ── fetch analytics ───────────────────────────────────────────────────
  const fetchAnalytics = useCallback(async () => {
    if (!sourceId || !metricId || !dateAttrId) return;
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const res = await analyticsAggregate({
        source_id:              sourceId,
        date_attribute_type_id: dateAttrId,
        aggregation,
        granularity,
        metric_id:              metricId,
        dimension_type_id:      dimTypeId  || undefined,
        dimension_id:           selectedDims.length ? selectedDims : undefined,
        start_date:             startDate  || undefined,
        end_date:               endDate    || undefined,
        limit:                  500,
      });
      const rows = Array.isArray(res) ? res : (res.data || res.items || []);
      setResults(rows);
    } catch (err) {
      setAnalyticsError(err.message);
      setResults([]);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [sourceId, metricId, aggregation, granularity, dateAttrId, dimTypeId, selectedDims, startDate, endDate]);

  // Auto-fetch when params are ready / change
  useEffect(() => {
    if (sourceId && metricId && dateAttrId) fetchAnalytics();
  }, [fetchAnalytics]);

  // ── Date display (falls back to available range when no user selection) ─
  const displayFrom = startDate
    ? fmtDate(startDate)
    : availableStart
      ? (fmtDate(periodToStartDate(availableStart) || '') || '—')
      : '—';
  const displayTo = endDate
    ? fmtDate(endDate)
    : availableEnd
      ? (fmtDate(periodToEndDate(availableEnd) || '') || '—')
      : '—';

  // ── KPIs ──────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const values = results.map(r => Number(r.value ?? r.aggregate_value ?? r.metric_value ?? 0));
    if (!values.length) return { total: 0, peak: 0, avg: 0, latest: 0, peakPeriod: '—', latestPeriod: '—' };
    const total     = values.reduce((a, b) => a + b, 0);
    const peak      = Math.max(...values);
    const peakIdx   = values.indexOf(peak);
    const avg       = total / values.length;
    const latest    = values[values.length - 1];
    return {
      total, peak, avg, latest,
      peakPeriod:   results[peakIdx]?.period || '—',
      latestPeriod: results[results.length - 1]?.period || '—',
      points:       values.length,
    };
  }, [results]);

  // ── chart ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const Chart = window['Chart'];
    if (!chartRef.current || !Chart || !results.length) {
      if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
      return;
    }
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }

    const labels = results.map(r => r.period || r.label || '');
    const data   = results.map(r => Number(r.value ?? r.aggregate_value ?? r.metric_value ?? 0));
    const c      = CHART_COLORS[chartType] || CHART_COLORS.line;
    const dark   = document.documentElement.getAttribute('data-theme') === 'dark';
    const gc     = dark ? 'rgba(255,255,255,.05)' : 'rgba(26,28,24,.04)';
    const tc2    = dark ? '#686868' : '#9a9d92';

    const dataset = chartType === 'pie'
      ? { data, backgroundColor: c.bg, borderColor: c.border, borderWidth: 2, hoverOffset: 8 }
      : {
          label: metrics.find(m => String(m.metric_id ?? m.id) === String(metricId))?.metric_name
                 || metrics.find(m => String(m.metric_id ?? m.id) === String(metricId))?.name
                 || '',
          data,
          borderColor:      c.border,
          backgroundColor:  c.bg,
          borderWidth:      chartType === 'bar' ? 0 : 2.5,
          fill:             chartType === 'area',
          tension:          0.42,
          borderRadius:     chartType === 'bar' ? 5 : 0,
          pointRadius:      chartType === 'line' ? 4 : 0,
          pointBackgroundColor: c.border,
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
        };

    const opts = {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: chartType === 'pie', labels: { color: dark ? '#909090' : '#5a5d54', font: { size: 11 }, boxWidth: 12, padding: 14 } },
        tooltip: {
          backgroundColor: dark ? '#0d0d0d' : '#1a1c18',
          borderColor: dark ? 'rgba(255,255,255,.12)' : 'rgba(26,28,24,.15)',
          borderWidth: 1, titleColor: '#888', bodyColor: dark ? '#e8e8e8' : '#1a1c18',
          bodyFont: { family: "'JetBrains Mono',monospace", size: 11 },
          padding: 10, cornerRadius: 9,
          callbacks: { label: ctx => ` ${fmt(ctx.parsed?.y ?? ctx.parsed, unit)} ${unit}` },
        },
      },
    };
    if (chartType !== 'pie') {
      opts.scales = {
        x: { grid: { color: gc, lineWidth: .5 }, ticks: { color: tc2, font: { size: 11 } }, border: { display: false } },
        y: { grid: { color: gc, lineWidth: .5 }, ticks: { color: tc2, font: { family: "'JetBrains Mono',monospace", size: 10.5 }, callback: v => unit === '%' ? v + '%' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v }, border: { display: false } },
      };
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: chartType === 'area' ? 'line' : chartType,
      data: { labels, datasets: [dataset] },
      options: opts,
    });
  }, [results, chartType, unit, metricId, metrics]);

  // ── derived display values ────────────────────────────────────────────
  const metricName = useMemo(() => {
    const m = metrics.find(m => String(m.metric_id ?? m.id) === String(metricId));
    return m?.metric_name || m?.name || '';
  }, [metrics, metricId]);

  const dateAttrName = useMemo(() => {
    const d = dateAttrTypes.find(d => String(d.date_attribute_type_id ?? d.id) === String(dateAttrId));
    return d?.attribute_name || d?.name || d?.date_attribute_type_name || '';
  }, [dateAttrTypes, dateAttrId]);

  const dimTypeName = useMemo(() => {
    const d = dimTypes.find(d => String(d.dimension_type_id ?? d.id) === String(dimTypeId));
    return d?.dimension_type || d?.name || '';
  }, [dimTypes, dimTypeId]);

  const filteredDims = useMemo(() => {
    const q = dimSearch.toLowerCase();
    return q
      ? dimensions.filter(d =>
          (d.dimension_value || d.value || d.name || d.dimension_name || '').toLowerCase().includes(q)
        )
      : dimensions;
  }, [dimensions, dimSearch]);

  function toggleDim(id) {
    setSelectedDims(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const chartSubtitle = useMemo(() => {
    const parts = [`${aggregation.toUpperCase()}(${metricName})`];
    if (dimTypeName) parts.push(`Type: ${dimTypeName}`);
    if (startDate && endDate) parts.push(`${fmtDate(startDate)} → ${fmtDate(endDate)}`);
    if (granularity) parts.push(`Periodicity: ${GRANULARITIES.find(g => g.value === granularity)?.label || granularity}`);
    return parts.join(' • ');
  }, [aggregation, metricName, dimTypeName, startDate, endDate, granularity]);

  // ── render ────────────────────────────────────────────────────────────
  if (!sourceId) {
    return <div className="page" id="page-detail" />;
  }

  return (
    <div className="page" id="page-detail">
      <div className="det-page-wrap" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Breadcrumb */}
        <div className="breadbar">
          <div className="bc">
            <span className="bc-a" onClick={() => window['navigate']?.('catalog')}>Dataset Catalog</span>
            <span className="bc-sep">›</span>
            <span className="bc-cur">{datasetInfo?.title || sourceId}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <button
              className="det-pivot-btn"
              style={{ display: 'none' }}
              onClick={() => document.getElementById('det-sidebar')?.classList.toggle('det-open')}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="11" y2="18"/></svg>
              Chart Builder
            </button>
            <button className="btn btn-xs" onClick={() => window.openSourceUrlsModal?.(sourceId, datasetInfo?.title)}>
              <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>Source URLs
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => window['navigate']?.('catalog')}>
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>Back
            </button>
          </div>
        </div>

        <div className="det-shell-inner" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* ── LEFT SIDEBAR ── */}
          <div id="det-sidebar" style={{ width: 220, flexShrink: 0, minHeight: 0, background: 'var(--sf)', borderRight: '1px solid var(--bdr)', overflowY: 'auto', padding: '16px 14px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', marginBottom: 16, letterSpacing: '.01em' }}>Pivot &amp; Chart Builder</div>

            {/* Dataset */}
            <div className="ctrl-blk" style={{ marginBottom: 13 }}>
              <div className="ctrl-lbl" style={{ marginBottom: 4 }}>Dataset</div>
              <div style={{ fontSize: 11.5, color: 'var(--tx2)', padding: '5px 0', wordBreak: 'break-word' }}>{datasetInfo?.title || '—'}</div>
            </div>

            {/* Metric */}
            <div className="ctrl-blk" style={{ marginBottom: 13 }}>
              <div className="ctrl-lbl" style={{ marginBottom: 4 }}>Metric</div>
              {metaLoading ? <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Loading…</div> : (
                <select className="ctrl-sel" value={metricId ?? ''} onChange={e => setMetricId(e.target.value)}>
                  {metrics.map(m => {
                    const id   = m.metric_id ?? m.id;
                    const name = m.metric_name || m.name || String(id);
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
              )}
            </div>

            {/* Aggregation */}
            <div className="ctrl-blk" style={{ marginBottom: 4 }}>
              <div className="ctrl-lbl" style={{ marginBottom: 4 }}>Aggregation</div>
              <select className="ctrl-sel" value={aggregation} onChange={e => setAggregation(e.target.value)}>
                {AGGREGATIONS.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
              </select>
            </div>
            {unit && <div className="ctrl-hint" style={{ marginBottom: 13, paddingLeft: 2 }}>Unit: {unit}</div>}

            {/* Periodicity */}
            <div className="ctrl-blk" style={{ marginBottom: 13 }}>
              <div className="ctrl-lbl" style={{ marginBottom: 4 }}>Periodicity</div>
              <select className="ctrl-sel" value={granularity} onChange={e => setGranularity(e.target.value)}>
                {GRANULARITIES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            {/* Date Attribute Type */}
            <div className="ctrl-blk" style={{ marginBottom: 13 }}>
              <div className="ctrl-lbl" style={{ marginBottom: 4 }}>Date Attribute Type</div>
              {metaLoading ? <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Loading…</div> : (
                <select className="ctrl-sel" value={dateAttrId ?? ''} onChange={e => setDateAttrId(e.target.value)}>
                  {dateAttrTypes.map(d => {
                    const id   = d.date_attribute_type_id ?? d.id;
                    const name = d.attribute_name || d.name || d.date_attribute_type_name || String(id);
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
              )}
            </div>

            {/* Dimension Type */}
            <div className="ctrl-blk" style={{ marginBottom: dimTypeId ? 8 : 0 }}>
              <div className="ctrl-lbl" style={{ marginBottom: 4 }}>Dimension Type</div>
              {metaLoading ? <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Loading…</div> : (
                <select className="ctrl-sel" value={dimTypeId ?? ''} onChange={e => setDimTypeId(e.target.value || null)}>
                  <option value="">— None —</option>
                  {dimTypes.map(d => {
                    const id   = d.dimension_type_id ?? d.id;
                    const name = d.dimension_type || d.name || String(id);
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
              )}
            </div>

            {/* Dimension Values */}
            {dimTypeId && (
              <div className="ctrl-blk">
                <div className="ctrl-lbl" style={{ marginBottom: 4 }}>
                  Dimension Values{dimensions.length > 0 && <span style={{ color: 'var(--tx3)', fontWeight: 400 }}> {dimensions.length} total</span>}
                </div>
                <input
                  className="ctrl-sel"
                  placeholder={`Search ${dimensions.length} values…`}
                  value={dimSearch}
                  onChange={e => setDimSearch(e.target.value)}
                  style={{ marginBottom: 6 }}
                />
                {dimsLoading ? (
                  <div style={{ fontSize: 11, color: 'var(--tx3)', padding: '4px 0' }}>Loading…</div>
                ) : (
                  <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredDims.map(d => {
                      const id   = d.dimension_id ?? d.id;
                      const name = d.dimension_value || d.value || d.name || d.dimension_name || String(id);
                      return (
                        <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--tx2)', cursor: 'pointer', padding: '2px 0' }}>
                          <input
                            type="checkbox"
                            checked={selectedDims.includes(id)}
                            onChange={() => toggleDim(id)}
                            style={{ cursor: 'pointer', accentColor: 'var(--blue)' }}
                          />
                          {name}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="det-right-wrap" style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>

            {/* ── FIXED HEADER: title + KPI cards ── */}
            <div style={{ flexShrink: 0, padding: '14px 18px 12px', display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid var(--bdr)', background: 'var(--bg)' }}>

              {/* Dataset title */}
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', letterSpacing: '-.3px' }}>
                {datasetInfo?.title || '—'}
              </div>

              {/* KPI strip */}
              <div className="det-kpi-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {[
                  { label: 'TOTAL', value: analyticsLoading ? '—' : fmt(kpis.total, unit), sub: metricName },
                  { label: 'PEAK',  value: analyticsLoading ? '—' : fmt(kpis.peak,  unit), sub: `Highest ${kpis.peakPeriod}` },
                  { label: 'AVG',   value: analyticsLoading ? '—' : fmt(kpis.avg,   unit), sub: `Per ${GRANULARITIES.find(g => g.value === granularity)?.label || granularity}` },
                  { label: 'POINTS',value: analyticsLoading ? '—' : String(kpis.points || 0), sub: `${GRANULARITIES.find(g => g.value === granularity)?.label || granularity} periods` },
                ].map(k => (
                  <div key={k.label} className="card" style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--tx3)', marginBottom: 4 }}>{k.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--mo)', color: 'var(--tx)', lineHeight: 1.1 }}>{k.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 3 }}>{k.sub}</div>
                  </div>
                ))}
              </div>

            </div>{/* /fixed header */}

            {/* ── SCROLLABLE BODY: chart + results ── */}
            <div className="det-body-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <div style={{ padding: '14px 18px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Chart card */}
            <div className="card" style={{ flexShrink: 0 }}>
              <div className="det-chart-card-hdr" style={{ padding: '10px 16px', borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>Chart</div>
                  <div style={{ fontSize: 10.5, color: 'var(--tx3)', marginTop: 1 }}>{chartSubtitle}</div>
                </div>
                <div className="det-chart-controls" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
                  {/* Date range pickers */}
                  <div className="det-date-row" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  
                    <span style={{ fontSize: 10, color: 'var(--tx3)' }}>From</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="ctrl-sel"
                      style={{ fontFamily: 'var(--mo)', fontSize: 11, color: 'var(--tx)', padding: '3px 8px', cursor: 'pointer', minWidth: 120 }}
                    />
                    <span style={{ fontSize: 10, color: 'var(--tx3)' }}>To</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="ctrl-sel"
                      style={{ fontFamily: 'var(--mo)', fontSize: 11, color: 'var(--tx)', padding: '3px 8px', cursor: 'pointer', minWidth: 120 }}
                    />
                  </div>
                  {/* Divider */}
                  <div style={{ width: 1, height: 18, background: 'var(--bdr)', flexShrink: 0 }} />
                  {!analyticsLoading && results.length > 0 && (
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--tx2)', whiteSpace: 'nowrap' }}>
                      Total: {fmt(kpis.total, unit)} {unit}
                    </span>
                  )}
                  <div className="ct-row">
                    {['line', 'area', 'bar', 'pie'].map(ct => (
                      <div key={ct} className={`ct-b${chartType === ct ? ' on' : ''}`} onClick={() => setChartType(ct)}>
                        {ct.charAt(0).toUpperCase() + ct.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 16px 10px', minHeight: 260, position: 'relative' }}>
                {analyticsLoading && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--tx3)', background: 'var(--sf)', zIndex: 2 }}>
                    Loading chart…
                  </div>
                )}
                {analyticsError && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--red)', background: 'var(--sf)', zIndex: 2 }}>
                    {analyticsError}
                  </div>
                )}
                <canvas ref={chartRef} height={230} />
              </div>
            </div>

            {/* Results table */}
            <div className="results-card">
              <div className="results-head">
                <div className="results-title">Results</div>
                <div className="results-cnt">{results.length} total rows</div>
                <div className="results-pg" style={{ marginLeft: 'auto' }}>Page 1 of 1</div>
              </div>
              <div className="tw" style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', minWidth: 640 }}>
                  <thead><tr>
                    <th style={{ width: 32 }}>#</th>
                    <th>PERIOD</th>
                    <th className="R">VALUE {unit ? `(${unit})` : ''}</th>
                    <th>METRIC</th>
                    <th>DATE ATTRIBUTE</th>
                    <th>DATASET</th>
                  </tr></thead>
                  <tbody>
                    {analyticsLoading ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--tx3)', fontSize: 12 }}>Loading…</td></tr>
                    ) : analyticsError ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--red)', fontSize: 12 }}>{analyticsError}</td></tr>
                    ) : results.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--tx3)', fontSize: 12 }}>No data</td></tr>
                    ) : results.map((row, i) => {
                      const val = Number(row.value ?? row.aggregate_value ?? row.metric_value ?? 0);
                      const period = row.period || row.period_label || '—';
                      const rowMetric = row.metric_name || metricName || '—';
                      const rowDateAttr = row.date_attribute_type_name || dateAttrName || '—';
                      const rowDataset = row.dataset_name || datasetInfo?.title || '—';
                      return (
                        <tr key={i}>
                          <td className="hh">{i + 1}</td>
                          <td><strong>{period}</strong></td>
                          <td className="nb R" style={{ color: 'var(--blue)', fontWeight: 600 }}>{fmt(val, unit)}</td>
                          <td className="mt">{rowMetric}</td>
                          <td className="mt">{rowDateAttr}</td>
                          <td className="mt">{rowDataset}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="results-foot">
                <span style={{ fontSize: 11.5, color: 'var(--tx3)' }}>1–{results.length} of {results.length}</span>
              </div>
            </div>

          </div>{/* /inner flex col */}
          </div>{/* /scrollable body */}
          </div>
          {/* /right */}
        </div>
      </div>
    </div>
  );
}
