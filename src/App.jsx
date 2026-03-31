// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import ReactDOM from 'react-dom';
// import * as echarts from 'echarts';
// import dashboardHTML from './dashboardHTML';
// import IndiaMap from './components/IndiaMap';

// // Expose npm echarts to window so public/app.js can use the same instance
// window.echarts = echarts;

// const CDN_CHARTJS = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';

// function loadScript(src) {
//   return new Promise((resolve) => {
//     if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
//     const s = document.createElement('script');
//     s.src = src;
//     s.onload = resolve;
//     s.onerror = resolve;
//     document.body.appendChild(s);
//   });
// }

// export default function App() {
//   const containerRef = useRef(null);
//   const [mapTarget, setMapTarget]   = useState(null);
//   const [isDark, setIsDark]         = useState(false);
//   const booted = useRef(false);

//   const boot = useCallback(async () => {
//     if (booted.current) return;
//     booted.current = true;

//     // Load Chart.js from CDN (echarts comes from npm now, not CDN)
//     await loadScript(CDN_CHARTJS);

//     // Load dashboard logic
//     await loadScript('/app.js');

//     // Patch setTheme
//     const origSetTheme = window.setTheme;
//     if (origSetTheme) {
//       window.setTheme = (t) => {
//         origSetTheme(t);
//         setIsDark(t === 'dark');
//       };
//     }

//     // Find the map placeholder and portal IndiaMap into it
//     if (containerRef.current) {
//       const mapEl = containerRef.current.querySelector('#india-echarts-map');
//       if (mapEl) setMapTarget(mapEl);
//     }

//     setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
//   }, []);

//   useEffect(() => {
//     if (containerRef.current) boot();
//   }, [boot]);

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
//   }, [isDark]);

//   return (
//     <>
//       <div
//         ref={containerRef}
//         dangerouslySetInnerHTML={{ __html: dashboardHTML }}
//       />
//       {mapTarget && ReactDOM.createPortal(
//         <IndiaMap isDark={isDark} />,
//         mapTarget
//       )}
//     </>
//   );
// }



import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as echarts from 'echarts';
import dashboardHTML from './dashboardHTML';
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
  const containerRef = useRef(null);
  const [mapTarget, setMapTarget] = useState(null);
  const [isDark, setIsDark]       = useState(false);
  const booted = useRef(false);

  const boot = useCallback(async () => {
    if (booted.current) return;
    booted.current = true;

    await loadScript(CDN_CHARTJS);
    await loadScript('/app.js');

    const origSetTheme = window.setTheme;
    if (origSetTheme) {
      window.setTheme = (t) => { origSetTheme(t); setIsDark(t === 'dark'); };
    }

    // Wait for #india-echarts-map to have real clientWidth before mounting portal
    const tryMount = () => {
      if (!containerRef.current) return;
      const mapEl = containerRef.current.querySelector('#india-echarts-map');
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

    // Give the HTML a frame to lay out first
    requestAnimationFrame(() => setTimeout(tryMount, 100));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }, []);

  useEffect(() => {
    if (containerRef.current) boot();
  }, [boot]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: dashboardHTML }} />
      {mapTarget && ReactDOM.createPortal(<IndiaMap isDark={isDark} />, mapTarget)}
    </>
  );
}
