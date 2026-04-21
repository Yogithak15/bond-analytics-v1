import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as echarts from 'echarts';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './components/dashboard/DashboardPage';
import CatalogPage from './components/catalog/CatalogPage';
import DatasetDetailPage from './components/detail/DatasetDetailPage';
import FiltersPanel from './components/panels/FiltersPanel';
import PivotPanel from './components/panels/PivotPanel';
import ComparePanel from './components/panels/ComparePanel';
import WatchlistPanel from './components/panels/WatchlistPanel';
import SourceUrlsModal from './components/SourceUrlsModal';
import IndiaMap from './components/IndiaMap';

window.echarts = echarts;

const CDN_CHARTJS = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve;
    document.body.appendChild(s);
  });
}

export default function App() {
  const [mapTarget, setMapTarget]       = useState(null);
  const [sgsMapTarget, setSgsMapTarget] = useState(null);
  const [isDark, setIsDark]             = useState(false);
  const [ovPieData, setOvPieData]       = useState([]);
  const booted = useRef(false);

  // Expose setter so DashboardPage can push market-composition data into the portal
  useEffect(() => {
    window._setOvPieData = setOvPieData;
    return () => { delete window._setOvPieData; };
  }, []);

  const boot = useCallback(async () => {
    if (booted.current) return;
    booted.current = true;

    await loadScript(CDN_CHARTJS);
    await loadScript('/app.js');

    // Navigate to the correct page: URL hash takes priority, otherwise default to dashboard
    if (window.navigate) {
      const rawHash = window.location.hash.replace('#', '');
      const hash = rawHash === 'dashboard' ? 'dash' : rawHash;
      const pages = ['dash', 'catalog', 'detail', 'ref'];
      const start = pages.includes(hash) ? hash : 'dash';
      window.navigate(start === 'detail' ? 'dash' : start);
    }

    // CatalogPage is a React component — prevent app.js from fetching
    // or writing innerHTML to the catalog DOM after it loads.
    window.loadDataSources = () => {};
    window.renderCatalog   = () => {};

    // DatasetDetailPage is a React component — route openDetail through it.
    window.openDetail = (sourceId) => {
      window.navigate?.('detail');
      window._onOpenDetail?.(sourceId);
    };
    window.buildExpChart   = () => {};
    window.rebuildExpChart = () => {};

    const origSetTheme = window.setTheme;
    if (origSetTheme) {
      window.setTheme = (t) => { origSetTheme(t); setIsDark(t === 'dark'); };
    }

    // Wait for #sdl-body-mount to have real clientWidth before mounting portal
    const tryMount = () => {
      const mapEl = document.getElementById('sdl-body-mount');
      if (!mapEl) return;

      if (mapEl.clientWidth > 0) {
        setMapTarget(mapEl);
      } else {
        // Use ResizeObserver to wait for layout
        const ro = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0) {
              ro.disconnect();
              setMapTarget(mapEl);
              break;
            }
          }
        });
        ro.observe(mapEl);
      }
    };

    const trySgsMount = () => {
      const sgsEl = document.getElementById('sdl-sgs-mount');
      if (!sgsEl) return;
      if (sgsEl.clientWidth > 0) {
        setSgsMapTarget(sgsEl);
      } else {
        // Tab is hidden — observe the parent pane for when it becomes visible
        const pane = document.getElementById('dmp-issuance') || sgsEl;
        const ro = new ResizeObserver(() => {
          if (sgsEl.clientWidth > 0) {
            ro.disconnect();
            setSgsMapTarget(sgsEl);
          }
        });
        ro.observe(pane);
      }
    };

    // Give the DOM a frame to lay out first
    requestAnimationFrame(() => setTimeout(() => { tryMount(); trySgsMount(); }, 100));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="body">
          <Topbar />
          <div className="pages">
            <DashboardPage />
            <CatalogPage />
            <DatasetDetailPage />
          </div>
        </div>
        <FiltersPanel />
        <PivotPanel />
        <ComparePanel />
        <WatchlistPanel />
      </div>
      {/* Panel backdrop */}
      <div
        id="panel-backdrop"
        onClick={() => {
          document.querySelectorAll('.slide-panel').forEach(p => p.classList.remove('on'));
          document.querySelectorAll('.tb-btn').forEach(b => b.classList.remove('lit'));
          document.getElementById('panel-backdrop').classList.remove('on');
        }}
        style={{display:'none'}}
      ></div>
      <SourceUrlsModal />
      {mapTarget    && ReactDOM.createPortal(<IndiaMap isDark={isDark} showRankings={false} plainMap={true} pieData={ovPieData} />, mapTarget)}
      {sgsMapTarget && ReactDOM.createPortal(<IndiaMap isDark={isDark} showRankings={true}  />, sgsMapTarget)}
    </>
  );
}
