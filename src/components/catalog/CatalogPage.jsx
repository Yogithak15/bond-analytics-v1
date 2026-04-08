import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDataSources, getDataSourceMetrics, getDataSourceDimensionTypes, getAllDimensions, getDataSourceUrls } from '../../api/bond_api';

// ── shape mapper — uses actual API field names from /data-sources/ response ─
function mapSource(raw) {
  // source_name: "RBI", "NSE EBP", etc.
  const shortName = (raw.source_name || '').toLowerCase();
  let srcKey = 'other';
  if (shortName.includes('nse'))       srcKey = 'nse';
  else if (shortName.includes('rbi'))  srcKey = 'rbi';
  else if (shortName.includes('sebi')) srcKey = 'sebi';
  else if (shortName.includes('ccil')) srcKey = 'ccil';
  else if (shortName.includes('fbil')) srcKey = 'fbil';
  else if (shortName.includes('bse'))  srcKey = 'bse';

  // update_interval: "daily" | "weekly" | "monthly" | "quarterly"
  const rawFreq = (raw.update_interval || raw.frequency || '').toLowerCase();
  let freq = 'weekly';
  if (rawFreq.includes('daily'))        freq = 'daily';
  else if (rawFreq.includes('month'))   freq = 'monthly';
  else if (rawFreq.includes('quarter')) freq = 'quarterly';
  else if (rawFreq.includes('week'))    freq = 'weekly';

  // updated_at is the timestamp field in this API
  let updated = raw.updated_at || raw.last_updated || '';
  if (updated) {
    try {
      const d = new Date(updated);
      if (!isNaN(d))
        updated = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (_) {}
  }

  return {
    // data_source_id is the numeric PK used for related API calls
    sourceId: raw.data_source_id || raw.id,
    id:       raw.dataset_code   || String(raw.data_source_id || raw.id || ''),
    title:    raw.dataset_name   || raw.name || raw.title || 'Untitled Dataset',
    src:      srcKey,
    srcLabel: raw.source_name    || srcKey.toUpperCase(),
    freq,
    // metrics/dims start at 0; enriched by parallel API calls after initial load
    metrics:  0,
    dims:     0,
    updated,
    status:   raw.is_active === false ? 'inactive' : 'active',
    desc:     raw.description || '',
    cat:      raw.category || raw.cat || '',
    url:      raw.source_url || raw.url || '',
  };
}

// ── CSS class helpers ──────────────────────────────────────────────────────
const srcTagClass = src =>
  ({ nse: 'tag-nse', rbi: 'tag-rbi', sebi: 'tag-sebi', ccil: 'tag-ccil', fbil: 'tag-fbil' }[src] || 'tag-nse');
const freqClass = f =>
  ({ daily: 'freq-d', weekly: 'freq-w', monthly: 'freq-m' }[f] || 'freq-w');
const spClass = s => (s === 'active' ? 'sp-live' : 'sp-stale');

// ── Fetch source URLs then open the modal ─────────────────────────────────
async function openSourceUrlsModal(sourceId, title) {
  // Show modal immediately with a loading state
  const bodyEl = document.getElementById('modal-body');
  const dsEl   = document.getElementById('modal-ds');
  const modalEl = document.getElementById('modal-ov');
  if (!modalEl) return;
  if (dsEl)   dsEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = '<div style="padding:24px;text-align:center;font-size:12px;color:var(--tx3)">Loading…</div>';
  modalEl.classList.add('on');

  try {
    const urls = await getDataSourceUrls(sourceId);
    const list = Array.isArray(urls) ? urls : [];
    if (bodyEl) {
      if (list.length === 0) {
        bodyEl.innerHTML = '<div style="padding:24px;text-align:center;font-size:12px;color:var(--tx3)">No source URLs found.</div>';
      } else {
        bodyEl.innerHTML = list.map((item, i) => {
          const href = item.url || item.source_url || item.link || String(item);
          const label = item.name || item.label || `Source ${i + 1}`;
          return `
            <div class="src-item">
              <div class="src-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></div>
              <div style="flex:1;min-width:0"><div class="src-name">${label}</div><div class="src-url">${href}</div></div>
              <button class="btn-src" onclick="window.open('${href}','_blank')">Open <svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><line x1="21" y1="3" x2="14" y2="10"/></svg></button>
            </div>`;
        }).join('');
      }
    }
  } catch {
    if (bodyEl) bodyEl.innerHTML = '<div style="padding:24px;text-align:center;font-size:12px;color:var(--tx3)">Failed to load URLs.</div>';
  }
}

// ── Row components defined at module level (never inside a render) ─────────
function ListRow({ d }) {
  return (
    <div className="ds-row" onClick={() => window.openDetail?.(d.sourceId)}>
      <div className="ds-cell">
        <div className="ds-name-wrap">
          <div className="ds-name">{d.title}</div>
          <div className="ds-slug">{d.id}</div>
        </div>
      </div>
      <div className="ds-cell"><span className={`src-tag ${srcTagClass(d.src)}`}>{d.srcLabel}</span></div>
      <div className="ds-cell"><span className={`freq ${freqClass(d.freq)}`}>{d.freq}</span></div>
      <div className="ds-cell" style={{ fontFamily: 'var(--mo)', fontWeight: 600, color: 'var(--tx)' }}>{d.metrics}</div>
      <div className="ds-cell" style={{ fontFamily: 'var(--mo)', color: 'var(--tx2)' }}>{d.dims.toLocaleString()}</div>
      <div className="ds-cell" style={{ fontSize: 11.5, color: 'var(--tx3)' }}>{d.updated}</div>
      <div className="ds-cell"><span className={`sp ${spClass(d.status)}`}>{d.status === 'active' ? 'Active' : 'Inactive'}</span></div>
      <div className="row-act" onClick={e => e.stopPropagation()}>
        <div className="row-ico-btn" onClick={() => window.openDetail?.(d.sourceId)} title="Explore">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
        </div>
        <div className="row-ico-btn" onClick={() => openSourceUrlsModal(d.sourceId, d.title)} title="Source URLs">
          <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
        </div>
      </div>
    </div>
  );
}

function CardItem({ d }) {
  return (
    <div
      style={{
        background: 'var(--sf)', border: '1px solid var(--bdr)', borderRadius: 12,
        padding: '12px 14px', cursor: 'pointer', transition: 'all .13s', boxShadow: 'var(--shxs)',
      }}
      onClick={() => window.openDetail?.(d.sourceId)}
      onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shmd)'; e.currentTarget.style.borderColor = 'var(--bdr2)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = 'var(--shxs)'; e.currentTarget.style.borderColor = 'var(--bdr)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--tx)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
          <div style={{ fontFamily: 'var(--mo)', fontSize: 9.5, color: 'var(--tx3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.id}</div>
        </div>
        <span className={`src-tag ${srcTagClass(d.src)}`} style={{ flexShrink: 0 }}>{d.srcLabel}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className={`freq ${freqClass(d.freq)}`}>{d.freq}</span>
          <span className={`sp ${spClass(d.status)}`}>{d.status === 'active' ? 'Active' : 'Inactive'}</span>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--tx3)' }}>
          <span style={{ fontFamily: 'var(--mo)', fontWeight: 600, color: 'var(--tx)' }}>{d.metrics}</span> metrics ·{' '}
          <span style={{ fontFamily: 'var(--mo)', fontWeight: 600, color: 'var(--tx)' }}>{d.dims.toLocaleString()}</span> dims
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────
function CatalogSkeleton() {
  return (
    <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            height: 48, background: 'var(--sf2)', borderRadius: 8,
            animation: 'catSkel 1.4s ease-in-out infinite', opacity: 0.7,
            animationDelay: `${i * 0.1}s`
          }} />
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 4 }}>Loading datasets…</div>
    </div>
  );
}

export default function CatalogPage() {
  const [datasets, setDatasets]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [enriching, setEnriching]       = useState(false);
  const [error, setError]               = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [srcFilter, setSrcFilter]       = useState('all');
  const [freqFilter, setFreqFilter]     = useState('all');
  const [search, setSearch]             = useState('');
  const [sort, setSort]                 = useState('src');
  const [view, setView]                 = useState('list');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Phase 1 — fetch all data sources (paginated)
      const PAGE = 50;
      let skip = 0;
      const all = [];
      while (true) {
        const page = await getDataSources(skip, PAGE);
        const rows = Array.isArray(page) ? page : (page.items || page.data || []);
        if (!rows.length) break;
        all.push(...rows);
        if (rows.length < PAGE) break;
        skip += PAGE;
      }
      const mapped = all.map(mapSource);
      setDatasets(mapped);
      window.DATASETS = mapped;
      setLoading(false);

      // Phase 2 — enrich each row with metric count + total dimension count in parallel
      setEnriching(true);
      const enriched = await Promise.all(
        mapped.map(async (d) => {
          try {
            const [metricsRes, dimTypes] = await Promise.all([
              getDataSourceMetrics(d.sourceId),
              getDataSourceDimensionTypes(d.sourceId),
            ]);

            // Sum all dimensions across every dimension type for this source
            let totalDims = 0;
            if (Array.isArray(dimTypes) && dimTypes.length > 0) {
              const dimCounts = await Promise.all(
                dimTypes.map(dt => getAllDimensions(dt.dimension_type_id || dt.id))
              );
              totalDims = dimCounts.reduce((sum, dims) => sum + (Array.isArray(dims) ? dims.length : 0), 0);
            }

            return {
              ...d,
              metrics: Array.isArray(metricsRes) ? metricsRes.length : 0,
              dims:    totalDims,
            };
          } catch {
            return d;
          }
        })
      );
      setDatasets(enriched);
      window.DATASETS = enriched;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      setEnriching(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── derived data ──────────────────────────────────────────────────────
  const sourceCounts = useMemo(() => {
    const c = {};
    datasets.forEach(d => { c[d.src] = (c[d.src] || 0) + 1; });
    return c;
  }, [datasets]);

  const uniqueSources = useMemo(() => {
    const m = {};
    datasets.forEach(d => { m[d.src] = d.srcLabel; });
    return m;
  }, [datasets]);

  const freqCounts = useMemo(() => {
    const c = { daily: 0, weekly: 0, monthly: 0 };
    datasets.forEach(d => { if (c[d.freq] !== undefined) c[d.freq]++; });
    return c;
  }, [datasets]);

  const summary = useMemo(() => ({
    total:   datasets.length,
    active:  datasets.filter(d => d.status === 'active').length,
    metrics: datasets.reduce((s, d) => s + (d.metrics || 0), 0),
    dims:    datasets.reduce((s, d) => s + (d.dims    || 0), 0),
  }), [datasets]);

  const filtered = useMemo(() => {
    let ds = [...datasets];
    if (srcFilter    !== 'all') ds = ds.filter(d => d.src    === srcFilter);
    if (statusFilter !== 'all') ds = ds.filter(d => d.status === statusFilter);
    if (freqFilter   !== 'all') ds = ds.filter(d => d.freq   === freqFilter);
    const q = search.toLowerCase().trim();
    if (q) ds = ds.filter(d =>
      d.title.toLowerCase().includes(q)    ||
      d.id.toLowerCase().includes(q)       ||
      d.srcLabel.toLowerCase().includes(q) ||
      d.cat.toLowerCase().includes(q)
    );
    const sortMap = {
      name:    (a, b) => a.title.localeCompare(b.title),
      src: (a, b) => {
        const grp = { rbi: 0, nse: 1, sebi: 2 };
        const ga = grp[a.src] ?? 99, gb = grp[b.src] ?? 99;
        if (ga !== gb) return ga - gb;
        // within RBI: sourceId 8 first
        if (a.src === 'rbi') {
          if (Number(a.sourceId) === 8) return -1;
          if (Number(b.sourceId) === 8) return 1;
        }
        return a.title.localeCompare(b.title);
      },
      freq:    (a, b) => a.freq.localeCompare(b.freq),
      metrics: (a, b) => b.metrics - a.metrics,
      dims:    (a, b) => b.dims - a.dims,
      updated: (a, b) => b.updated.localeCompare(a.updated),
    };
    if (sortMap[sort]) ds.sort(sortMap[sort]);
    return ds;
  }, [datasets, srcFilter, statusFilter, freqFilter, search, sort]);

  // ── main render ───────────────────────────────────────────────────────
  return (
    <div className="page on" id="page-catalog">
      <div className="cat-shell">

        {/* LEFT PANEL: filters */}
        <aside className="cat-panel">
          <div className="cat-panel-head">
            <span className="cat-panel-title">Filters</span>
          </div>

          {/* STATUS */}
          <span className="fp-lbl">Status</span>
          <div className="status-seg">
            {['all', 'active', 'inactive'].map(st => (
              <div
                key={st}
                className={`seg-opt${statusFilter === st ? ' on' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </div>
            ))}
          </div>

          <div className="fp-divider" />

          {/* BY SOURCE */}
          <span className="fp-lbl">Source</span>
          <div id="cat-src-filters">
            <div
              className={`src-row${srcFilter === 'all' ? ' on' : ''}`}
              onClick={() => setSrcFilter('all')}
            >
              <span className="src-label">All Sources</span>
              <span className="src-count">{datasets.length || '—'}</span>
            </div>
            {Object.entries(uniqueSources).sort(([a], [b]) => {
              const order = { rbi: 0, nse: 1, sebi: 2 };
              return (order[a] ?? 99) - (order[b] ?? 99);
            }).map(([key, label]) => (
              <div
                key={key}
                className={`src-row${srcFilter === key ? ' on' : ''}`}
                onClick={() => setSrcFilter(key)}
              >
                <span className="src-label">{label}</span>
                <span className="src-count">{sourceCounts[key] || 0}</span>
              </div>
            ))}
          </div>

          <div className="fp-divider" />

          {/* FREQUENCY */}
          <span className="fp-lbl">Frequency</span>
          {[['all', 'All', datasets.length], ['daily', 'Daily', freqCounts.daily], ['weekly', 'Weekly', freqCounts.weekly], ['monthly', 'Monthly', freqCounts.monthly]].map(([val, label, count]) => (
            <div
              key={val}
              className={`src-row${freqFilter === val ? ' on' : ''}`}
              onClick={() => setFreqFilter(val)}
            >
              <span className="src-label">{label}</span>
              <span className="src-count">{count || (loading ? '—' : 0)}</span>
            </div>
          ))}
        </aside>

        {/* MAIN CATALOG AREA */}
        <div className="cat-main">
          {/* Mobile filter trigger */}
          <div className="fbar-mobile-btn" style={{ display: 'none', padding: '10px 10px 4px', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }} onClick={() => window.togglePanel?.('filters')}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
            </button>
          </div>

          {/* Summary strip */}
          <div className="cat-summary">
            <div className="sum-kpi"><div className="sum-kpi-v">{loading ? '—' : summary.total}</div><div className="sum-kpi-l">Datasets</div></div>
            <div className="sum-kpi"><div className="sum-kpi-v">{loading ? '—' : summary.active}</div><div className="sum-kpi-l">Active</div></div>
            <div className="sum-kpi"><div className="sum-kpi-v" style={enriching ? { opacity: 0.5 } : {}}>{loading ? '—' : summary.metrics}</div><div className="sum-kpi-l">Metrics</div></div>
            <div className="sum-kpi"><div className="sum-kpi-v" style={enriching ? { opacity: 0.5 } : {}}>{loading ? '—' : summary.dims.toLocaleString()}</div><div className="sum-kpi-l">Dimensions</div></div>
          </div>

          {/* Toolbar: search + sort + view toggle */}
          <div className="cat-toolbar">
            <div className="cat-search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                placeholder="Search datasets…"
                id="cat-q"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--tx3)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              Sort:
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 11.5, color: 'var(--tx2)', fontFamily: 'var(--fn)', cursor: 'pointer' }}
              >
                <option value="name">Name A–Z</option>
                <option value="src">Source</option>
                <option value="updated">Last Updated</option>
                <option value="metrics">Metrics ↓</option>
                <option value="dims">Dimensions ↓</option>
              </select>
            </div>
            <div className="view-toggle">
              <div className={`vt-btn${view === 'list' ? ' on' : ''}`} onClick={() => setView('list')} title="List view">
                <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              </div>
              <div className={`vt-btn${view === 'card' ? ' on' : ''}`} onClick={() => setView('card')} title="Card view">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
              </div>
            </div>
          </div>

          {/* List / Card content */}
          <div className="cat-list" id="cat-list-wrap">
            <div id="cat-list-view">
              {error ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--tx2)', marginBottom: 8 }}>Failed to load datasets</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 16 }}>{error}</div>
                  <button className="btn" style={{ fontSize: 12 }} onClick={loadData}>Retry</button>
                </div>
              ) : loading ? (
                <CatalogSkeleton />
              ) : view === 'list' ? (
                <>
                  <div className="list-head">
                    <div className="lh-cell" onClick={() => setSort('name')}>Dataset <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg></div>
                    <div className="lh-cell" onClick={() => setSort('src')}>Source</div>
                    <div className="lh-cell" onClick={() => setSort('freq')}>Frequency</div>
                    <div className="lh-cell" onClick={() => setSort('metrics')}>Metrics <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg></div>
                    <div className="lh-cell" onClick={() => setSort('dims')}>Dimensions <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg></div>
                    <div className="lh-cell" onClick={() => setSort('updated')}>Last Updated <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg></div>
                    <div className="lh-cell">Status</div>
                    <div className="lh-cell" />
                  </div>
                  <div id="cat-rows">
                    {filtered.length === 0 ? (
                      <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--tx3)' }}>No datasets match your filters.</div>
                    ) : (
                      filtered.map(d => <ListRow key={d.id} d={d} />)
                    )}
                  </div>
                </>
              ) : (
                <div id="cat-rows">
                  {filtered.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--tx3)' }}>No datasets match your filters.</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px 18px' }}>
                      {filtered.map(d => <CardItem key={d.id} d={d} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
