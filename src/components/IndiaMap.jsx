// // // 


// // import React, { useEffect, useRef, useState } from 'react';
// // import * as echarts from 'echarts';
// // import indiaGeoJSON from '../india-decoded.json';

// // const SDL_DATA = {
// //   '2021': { total: '₹48.2L Cr', data: { 'Tamil Nadu':548000,'Maharashtra':473000,'Uttar Pradesh':408000,'West Bengal':401000,'Karnataka':352000,'Andhra Pradesh':335000,'Rajasthan':323000,'Telangana':293000,'Gujarat':229000,'Madhya Pradesh':223000,'Haryana':220000,'Punjab':207000,'Kerala':201000,'Bihar':198000,'Assam':87000 } },
// //   '2022': { total: '₹54.1L Cr', data: { 'Tamil Nadu':616000,'Maharashtra':531000,'Uttar Pradesh':457000,'West Bengal':449000,'Karnataka':395000,'Andhra Pradesh':376000,'Rajasthan':362000,'Telangana':329000,'Gujarat':257000,'Madhya Pradesh':250000,'Haryana':247000,'Punjab':232000,'Kerala':226000,'Bihar':222000,'Assam':97000 } },
// //   '2023': { total: '₹60.8L Cr', data: { 'Tamil Nadu':692000,'Maharashtra':596000,'Uttar Pradesh':513000,'West Bengal':504000,'Karnataka':443000,'Andhra Pradesh':422000,'Rajasthan':407000,'Telangana':369000,'Gujarat':288000,'Madhya Pradesh':280000,'Haryana':277000,'Punjab':261000,'Kerala':254000,'Bihar':249000,'Assam':109000 } },
// //   '2024': { total: '₹65.2L Cr', data: { 'Tamil Nadu':735000,'Maharashtra':634000,'Uttar Pradesh':546000,'West Bengal':537000,'Karnataka':471000,'Andhra Pradesh':449000,'Rajasthan':433000,'Telangana':393000,'Gujarat':307000,'Madhya Pradesh':298000,'Haryana':295000,'Punjab':278000,'Kerala':271000,'Bihar':265000,'Assam':116000 } },
// //   '2025': { total: '₹69.3L Cr', data: { 'Tamil Nadu':778044,'Maharashtra':673759,'Uttar Pradesh':578630,'West Bengal':569107,'Karnataka':500630,'Andhra Pradesh':476009,'Rajasthan':459682,'Telangana':417087,'Gujarat':325325,'Madhya Pradesh':316744,'Haryana':313539,'Punjab':294511,'Kerala':286534,'Bihar':281851,'Assam':123793 } },
// //   '2026': { total: '₹72.8L Cr', data: { 'Tamil Nadu':818000,'Maharashtra':708000,'Uttar Pradesh':608000,'West Bengal':598000,'Karnataka':526000,'Andhra Pradesh':500000,'Rajasthan':483000,'Telangana':438000,'Gujarat':342000,'Madhya Pradesh':333000,'Haryana':329000,'Punjab':309000,'Kerala':301000,'Bihar':296000,'Assam':130000 } },
// // };

// // const ALL_STATES = [
// //   'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam',
// //   'Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli','Delhi','Goa',
// //   'Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand',
// //   'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
// //   'Mizoram','Nagaland','Odisha','Pondicherry','Punjab','Rajasthan','Sikkim',
// //   'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
// // ];

// // const COLOR_RAMP = ['#c8e6d4','#8ecba6','#4daa6e','#2d8a4e','#1a5c34'];
// // const NO_DATA_COLOR = '#2e3c35';

// // function getColor(value, max) {
// //   if (!value) return NO_DATA_COLOR;
// //   const ratio = Math.min(value / max, 1);
// //   const idx = Math.min(Math.floor(ratio * COLOR_RAMP.length), COLOR_RAMP.length - 1);
// //   return COLOR_RAMP[idx];
// // }

// // const fmt = (v) => Number(v).toLocaleString('en-IN');

// // // Register map — run once at module level
// // echarts.registerMap('india-sdl', indiaGeoJSON);

// // // DEBUG: verify registration worked
// // console.log('[IndiaMap] echarts version:', echarts.version);
// // console.log('[IndiaMap] registered maps:', echarts.getMap('india-sdl') ? 'india-sdl OK' : 'india-sdl MISSING');

// // export default function IndiaMap({ isDark }) {
// //   const canvasRef = useRef(null);
// //   const chartRef  = useRef(null);
// //   const [year, setYear] = useState('2025');

// //   const yd      = SDL_DATA[year];
// //   const sorted  = Object.entries(yd.data).sort((a, b) => b[1] - a[1]);
// //   const total   = sorted.reduce((s, [, v]) => s + v, 0);
// //   const top5Pct = ((sorted.slice(0, 5).reduce((s, [, v]) => s + v, 0) / total) * 100).toFixed(1);
// //   const maxVal  = sorted[0][1];

// //   const mapData = ALL_STATES.map((name) => {
// //     const value = yd.data[name] ?? null;
// //     return {
// //       name,
// //       value,
// //       itemStyle: { areaColor: getColor(value, maxVal) },
// //     };
// //   });

// //   // DEBUG: log what Tamil Nadu gets
// //   const tnEntry = mapData.find(d => d.name === 'Tamil Nadu');
// //   console.log('[IndiaMap] Tamil Nadu entry:', tnEntry);

// //   useEffect(() => {
// //     if (!canvasRef.current) return;

// //     const h = window.innerWidth <= 640 ? 260 : 320;
// //     canvasRef.current.style.height = h + 'px';

// //     if (chartRef.current) {
// //       chartRef.current.dispose();
// //       chartRef.current = null;
// //     }

// //     console.log('[IndiaMap] initing echarts, canvasRef:', canvasRef.current);
// //     chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'canvas' });
// //     console.log('[IndiaMap] chart instance:', chartRef.current);

// //     const option = {
// //       backgroundColor: 'transparent',
// //       tooltip: {
// //         trigger: 'item',
// //         backgroundColor: '#0d0d0d',
// //         borderColor: 'rgba(255,255,255,0.12)',
// //         borderWidth: 1,
// //         padding: [8, 12],
// //         textStyle: { color: '#f0f1ed', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 },
// //         formatter: ({ name, value }) =>
// //           value != null
// //             ? `<span style="font-weight:600">${name}</span><br/>₹ ${fmt(value)} Cr`
// //             : `<span style="font-weight:600">${name}</span><br/><span style="color:#888">No data</span>`,
// //       },
// //       series: [{
// //         name: 'SDL Outstanding',
// //         type: 'map',
// //         map: 'india-sdl',
// //         roam: false,
// //         layoutCenter: ['50%', '55%'],
// //         layoutSize: '92%',
// //         aspectScale: 1,
// //         animation: false,
// //         label: { show: false },
// //         emphasis: {
// //           disabled: false,
// //           label: { show: true, color: '#fff', fontSize: 11, fontWeight: 700 },
// //           itemStyle: { areaColor: '#e07b39', borderColor: '#fff', borderWidth: 1.5 },
// //         },
// //         select: { disabled: true },
// //         itemStyle: { borderColor: '#fff', borderWidth: 0.8 },
// //         data: mapData,
// //       }],
// //     };

// //     console.log('[IndiaMap] setOption with', mapData.length, 'items');
// //     console.log('[IndiaMap] sample data[0]:', mapData[0]);
// //     console.log('[IndiaMap] sample data[28] (Tamil Nadu):', mapData[28]);
// //     chartRef.current.setOption(option);

// //     const onResize = () => chartRef.current?.resize();
// //     window.addEventListener('resize', onResize);
// //     return () => window.removeEventListener('resize', onResize);
// //   }, [year, isDark]);

// //   useEffect(() => {
// //     if (typeof window.sdlSetYear === 'function') {
// //       const pill = document.querySelector(`.sdl-yr[onclick*="sdlSetYear('${year}'"]`);
// //       if (pill) window.sdlSetYear(year, pill);
// //     }
// //   }, [year]);

// //   useEffect(() => {
// //     return () => {
// //       if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null; }
// //     };
// //   }, []);

// //   const podium = [
// //     { rank: 2, name: sorted[1]?.[0], val: sorted[1]?.[1], height: '68%' },
// //     { rank: 1, name: sorted[0]?.[0], val: sorted[0]?.[1], height: '90%', crown: true },
// //     { rank: 3, name: sorted[2]?.[0], val: sorted[2]?.[1], height: '50%' },
// //   ];

// //   return (
// //     <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

// //       <div className="sdl-yr-pills" id="sdl-yr-pills" style={{ margin: '0 0 4px' }}>
// //         {['2021','2022','2023','2024','2025','2026'].map((y) => (
// //           <div key={y} className={`sdl-yr${year === y ? ' on' : ''}`} onClick={() => setYear(y)}>
// //             {y.slice(2)}
// //           </div>
// //         ))}
// //       </div>

// //       <div style={{ position: 'relative', flexShrink: 0 }}>
// //         <div ref={canvasRef} style={{ width: '100%', height: 320, transition: 'height .2s' }} />
// //         <div className="sdl-map-floats">
// //           <div className="sdl-float">
// //             <div className="sdl-float-l">Top State</div>
// //             <div className="sdl-float-v" id="sdl-top-state">{sorted[0]?.[0]}</div>
// //             <div className="sdl-float-s" id="sdl-top-val">₹{fmt(sorted[0]?.[1])} Cr</div>
// //           </div>
// //           <div className="sdl-float">
// //             <div className="sdl-float-l">States</div>
// //             <div className="sdl-float-v">26</div>
// //             <div className="sdl-float-s">Reporting</div>
// //           </div>
// //         </div>
// //         <div className="sdl-map-floats-bottom">
// //           <div className="sdl-float">
// //             <div className="sdl-float-l">Top 5 Share</div>
// //             <div className="sdl-float-v">{top5Pct}%</div>
// //             <div className="sdl-float-s">Concentration</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="sdl-legend">
// //         <span className="sdl-leg-lo">Low</span>
// //         <div className="sdl-leg-bar" />
// //         <span className="sdl-leg-hi">High</span>
// //         <span className="sdl-leg-note">SDL Outstanding (₹ Cr)</span>
// //       </div>

// //       <div className="sdl-lb">
// //         <div className="sdl-podium">
// //           {podium.map(({ rank, name, val, height }) => (
// //             <div key={rank} className={`sdl-pod sdl-pod-${rank}`}>
// //               <div className="sdl-pod-rank">{rank}</div>
// //               <div className="sdl-pod-name">{name}</div>
// //               <div className="sdl-pod-val">{fmt(val)}</div>
// //               <div className="sdl-pod-bar" style={{ height }} />
// //             </div>
// //           ))}
// //         </div>

// //         <div className="sdl-rest" id="sdl-rest-rows">
// //           {sorted.slice(3).map(([name, val], i) => {
// //             const pct  = ((val / total) * 100).toFixed(1);
// //             const barW = ((val / sorted[0][1]) * 100).toFixed(1);
// //             return (
// //               <div className="sdl-rest-row" key={name}>
// //                 <span className="sdl-rr-n"><em>{i + 4}</em>{name}</span>
// //                 <div className="sdl-rr-track"><div className="sdl-rr-fill" style={{ width: `${barW}%` }} /></div>
// //                 <span className="sdl-rr-v">{fmt(val)}</span>
// //                 <span className="sdl-rr-p">{pct}%</span>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         <div className="sdl-totals">
// //           <div className="sdl-tot-item sdl-tot-others">
// //             <span>Others · 11 States</span>
// //             <span>₹{fmt(Math.round(total * 0.077))} Cr</span>
// //             <span>7.7%</span>
// //           </div>
// //           <div className="sdl-tot-item sdl-tot-grand">
// //             <span>Grand Total · 26 States</span>
// //             <span id="sdl-grand-v">{yd.total}</span>
// //             <span>100%</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useRef, useState } from 'react';
// import * as echarts from 'echarts';
// import indiaGeoJSON from '../india-decoded.json';

// const SDL_DATA = {
//   '2021': { total: '₹48.2L Cr', data: { 'Tamil Nadu':548000,'Maharashtra':473000,'Uttar Pradesh':408000,'West Bengal':401000,'Karnataka':352000,'Andhra Pradesh':335000,'Rajasthan':323000,'Telangana':293000,'Gujarat':229000,'Madhya Pradesh':223000,'Haryana':220000,'Punjab':207000,'Kerala':201000,'Bihar':198000,'Assam':87000 } },
//   '2022': { total: '₹54.1L Cr', data: { 'Tamil Nadu':616000,'Maharashtra':531000,'Uttar Pradesh':457000,'West Bengal':449000,'Karnataka':395000,'Andhra Pradesh':376000,'Rajasthan':362000,'Telangana':329000,'Gujarat':257000,'Madhya Pradesh':250000,'Haryana':247000,'Punjab':232000,'Kerala':226000,'Bihar':222000,'Assam':97000 } },
//   '2023': { total: '₹60.8L Cr', data: { 'Tamil Nadu':692000,'Maharashtra':596000,'Uttar Pradesh':513000,'West Bengal':504000,'Karnataka':443000,'Andhra Pradesh':422000,'Rajasthan':407000,'Telangana':369000,'Gujarat':288000,'Madhya Pradesh':280000,'Haryana':277000,'Punjab':261000,'Kerala':254000,'Bihar':249000,'Assam':109000 } },
//   '2024': { total: '₹65.2L Cr', data: { 'Tamil Nadu':735000,'Maharashtra':634000,'Uttar Pradesh':546000,'West Bengal':537000,'Karnataka':471000,'Andhra Pradesh':449000,'Rajasthan':433000,'Telangana':393000,'Gujarat':307000,'Madhya Pradesh':298000,'Haryana':295000,'Punjab':278000,'Kerala':271000,'Bihar':265000,'Assam':116000 } },
//   '2025': { total: '₹69.3L Cr', data: { 'Tamil Nadu':778044,'Maharashtra':673759,'Uttar Pradesh':578630,'West Bengal':569107,'Karnataka':500630,'Andhra Pradesh':476009,'Rajasthan':459682,'Telangana':417087,'Gujarat':325325,'Madhya Pradesh':316744,'Haryana':313539,'Punjab':294511,'Kerala':286534,'Bihar':281851,'Assam':123793 } },
//   '2026': { total: '₹72.8L Cr', data: { 'Tamil Nadu':818000,'Maharashtra':708000,'Uttar Pradesh':608000,'West Bengal':598000,'Karnataka':526000,'Andhra Pradesh':500000,'Rajasthan':483000,'Telangana':438000,'Gujarat':342000,'Madhya Pradesh':333000,'Haryana':329000,'Punjab':309000,'Kerala':301000,'Bihar':296000,'Assam':130000 } },
// };

// const ALL_STATES = [
//   'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam',
//   'Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli','Delhi','Goa',
//   'Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand',
//   'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
//   'Mizoram','Nagaland','Odisha','Pondicherry','Punjab','Rajasthan','Sikkim',
//   'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
// ];

// const COLOR_RAMP = ['#c8e6d4','#8ecba6','#4daa6e','#2d8a4e','#1a5c34'];
// const NO_DATA_COLOR = '#2e3c35';

// function getColor(value, max) {
//   if (!value) return NO_DATA_COLOR;
//   const ratio = Math.min(value / max, 1);
//   const idx = Math.min(Math.floor(ratio * COLOR_RAMP.length), COLOR_RAMP.length - 1);
//   return COLOR_RAMP[idx];
// }

// const fmt = (v) => Number(v).toLocaleString('en-IN');

// echarts.registerMap('india-sdl', indiaGeoJSON);

// function buildOption(yearData, maxVal) {
//   const mapData = ALL_STATES.map((name) => {
//     const value = yearData[name] ?? null;
//     return { name, value, itemStyle: { areaColor: getColor(value, maxVal) } };
//   });
//   return {
//     backgroundColor: 'transparent',
//     tooltip: {
//       trigger: 'item',
//       backgroundColor: '#0d0d0d',
//       borderColor: 'rgba(255,255,255,0.12)',
//       borderWidth: 1,
//       padding: [8, 12],
//       textStyle: { color: '#f0f1ed', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 },
//       formatter: ({ name, value }) =>
//         value != null
//           ? `<span style="font-weight:600">${name}</span><br/>₹ ${fmt(value)} Cr`
//           : `<span style="font-weight:600">${name}</span><br/><span style="color:#888">No data</span>`,
//     },
//     series: [{
//       name: 'SDL Outstanding',
//       type: 'map',
//       map: 'india-sdl',
//       roam: false,
//       layoutCenter: ['50%', '55%'],
//       layoutSize: '92%',
//       aspectScale: 1,
//       animation: false,
//       label: { show: false },
//       emphasis: {
//         disabled: false,
//         label: { show: true, color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" },
//         itemStyle: { areaColor: '#e07b39', borderColor: '#fff', borderWidth: 1.5 },
//       },
//       select: { disabled: true },
//       itemStyle: { borderColor: '#fff', borderWidth: 0.8 },
//       data: mapData,
//     }],
//   };
// }

// export default function IndiaMap({ isDark }) {
//   const canvasRef = useRef(null);
//   const chartRef  = useRef(null);
//   const [year, setYear] = useState('2025');

//   const yd      = SDL_DATA[year];
//   const sorted  = Object.entries(yd.data).sort((a, b) => b[1] - a[1]);
//   const total   = sorted.reduce((s, [, v]) => s + v, 0);
//   const top5Pct = ((sorted.slice(0, 5).reduce((s, [, v]) => s + v, 0) / total) * 100).toFixed(1);
//   const maxVal  = sorted[0][1];

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     // Wait for the portal container to have real dimensions
//     // Use requestAnimationFrame + small delay to ensure layout is complete
//     const initChart = () => {
//       if (!canvasRef.current) return;

//       const w = canvasRef.current.clientWidth;
//       const h = canvasRef.current.clientHeight;

//       // If still no dimensions, retry
//       if (w === 0 || h === 0) {
//         setTimeout(initChart, 50);
//         return;
//       }

//       if (chartRef.current) {
//         chartRef.current.dispose();
//         chartRef.current = null;
//       }

//       chartRef.current = echarts.init(canvasRef.current, null, { renderer: 'canvas', width: w, height: h });
//       chartRef.current.setOption(buildOption(yd.data, maxVal));

//       const onResize = () => {
//         if (chartRef.current && canvasRef.current) {
//           chartRef.current.resize({
//             width: canvasRef.current.clientWidth,
//             height: canvasRef.current.clientHeight,
//           });
//         }
//       };
//       window.addEventListener('resize', onResize);
//     };

//     requestAnimationFrame(() => setTimeout(initChart, 100));

//     return () => {
//       window.removeEventListener('resize', () => {});
//     };
//   }, [year, isDark]);

//   useEffect(() => {
//     if (typeof window.sdlSetYear === 'function') {
//       const pill = document.querySelector(`.sdl-yr[onclick*="sdlSetYear('${year}'"]`);
//       if (pill) window.sdlSetYear(year, pill);
//     }
//   }, [year]);

//   useEffect(() => {
//     return () => {
//       if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null; }
//     };
//   }, []);

//   const podium = [
//     { rank: 2, name: sorted[1]?.[0], val: sorted[1]?.[1], height: '68%' },
//     { rank: 1, name: sorted[0]?.[0], val: sorted[0]?.[1], height: '90%', crown: true },
//     { rank: 3, name: sorted[2]?.[0], val: sorted[2]?.[1], height: '50%' },
//   ];

//   return (
//     <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

//       <div className="sdl-yr-pills" id="sdl-yr-pills" style={{ margin: '0 0 4px' }}>
//         {['2021','2022','2023','2024','2025','2026'].map((y) => (
//           <div key={y} className={`sdl-yr${year === y ? ' on' : ''}`} onClick={() => setYear(y)}>
//             {y.slice(2)}
//           </div>
//         ))}
//       </div>

//       {/* Give the canvas wrapper an explicit height so echarts gets real dimensions */}
//       <div style={{ position: 'relative', flexShrink: 0, height: 320 }}>
//         <div
//           ref={canvasRef}
//           style={{ width: '100%', height: '100%' }}
//         />

//         <div className="sdl-map-floats">
//           <div className="sdl-float">
//             <div className="sdl-float-l">Top State</div>
//             <div className="sdl-float-v" id="sdl-top-state">{sorted[0]?.[0]}</div>
//             <div className="sdl-float-s" id="sdl-top-val">₹{fmt(sorted[0]?.[1])} Cr</div>
//           </div>
//           <div className="sdl-float">
//             <div className="sdl-float-l">States</div>
//             <div className="sdl-float-v">26</div>
//             <div className="sdl-float-s">Reporting</div>
//           </div>
//         </div>
//         <div className="sdl-map-floats-bottom">
//           <div className="sdl-float">
//             <div className="sdl-float-l">Top 5 Share</div>
//             <div className="sdl-float-v">{top5Pct}%</div>
//             <div className="sdl-float-s">Concentration</div>
//           </div>
//         </div>
//       </div>

//       <div className="sdl-legend">
//         <span className="sdl-leg-lo">Low</span>
//         <div className="sdl-leg-bar" />
//         <span className="sdl-leg-hi">High</span>
//         <span className="sdl-leg-note">SDL Outstanding (₹ Cr)</span>
//       </div>

//       <div className="sdl-lb">
//         <div className="sdl-podium">
//           {podium.map(({ rank, name, val, height }) => (
//             <div key={rank} className={`sdl-pod sdl-pod-${rank}`}>
//               <div className="sdl-pod-rank">{rank}</div>
//               <div className="sdl-pod-name">{name}</div>
//               <div className="sdl-pod-val">{fmt(val)}</div>
//               <div className="sdl-pod-bar" style={{ height }} />
//             </div>
//           ))}
//         </div>

//         <div className="sdl-rest" id="sdl-rest-rows">
//           {sorted.slice(3).map(([name, val], i) => {
//             const pct  = ((val / total) * 100).toFixed(1);
//             const barW = ((val / sorted[0][1]) * 100).toFixed(1);
//             return (
//               <div className="sdl-rest-row" key={name}>
//                 <span className="sdl-rr-n"><em>{i + 4}</em>{name}</span>
//                 <div className="sdl-rr-track"><div className="sdl-rr-fill" style={{ width: `${barW}%` }} /></div>
//                 <span className="sdl-rr-v">{fmt(val)}</span>
//                 <span className="sdl-rr-p">{pct}%</span>
//               </div>
//             );
//           })}
//         </div>

//         <div className="sdl-totals">
//           <div className="sdl-tot-item sdl-tot-others">
//             <span>Others · 11 States</span>
//             <span>₹{fmt(Math.round(total * 0.077))} Cr</span>
//             <span>7.7%</span>
//           </div>
//           <div className="sdl-tot-item sdl-tot-grand">
//             <span>Grand Total · 26 States</span>
//             <span id="sdl-grand-v">{yd.total}</span>
//             <span>100%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import indiaGeoJSON from '../india-decoded.json';

const SDL_DATA = {
  '2021': { total: '₹48.2L Cr', data: { 'Tamil Nadu':548000,'Maharashtra':473000,'Uttar Pradesh':408000,'West Bengal':401000,'Karnataka':352000,'Andhra Pradesh':335000,'Rajasthan':323000,'Telangana':293000,'Gujarat':229000,'Madhya Pradesh':223000,'Haryana':220000,'Punjab':207000,'Kerala':201000,'Bihar':198000,'Assam':87000 } },
  '2022': { total: '₹54.1L Cr', data: { 'Tamil Nadu':616000,'Maharashtra':531000,'Uttar Pradesh':457000,'West Bengal':449000,'Karnataka':395000,'Andhra Pradesh':376000,'Rajasthan':362000,'Telangana':329000,'Gujarat':257000,'Madhya Pradesh':250000,'Haryana':247000,'Punjab':232000,'Kerala':226000,'Bihar':222000,'Assam':97000 } },
  '2023': { total: '₹60.8L Cr', data: { 'Tamil Nadu':692000,'Maharashtra':596000,'Uttar Pradesh':513000,'West Bengal':504000,'Karnataka':443000,'Andhra Pradesh':422000,'Rajasthan':407000,'Telangana':369000,'Gujarat':288000,'Madhya Pradesh':280000,'Haryana':277000,'Punjab':261000,'Kerala':254000,'Bihar':249000,'Assam':109000 } },
  '2024': { total: '₹65.2L Cr', data: { 'Tamil Nadu':735000,'Maharashtra':634000,'Uttar Pradesh':546000,'West Bengal':537000,'Karnataka':471000,'Andhra Pradesh':449000,'Rajasthan':433000,'Telangana':393000,'Gujarat':307000,'Madhya Pradesh':298000,'Haryana':295000,'Punjab':278000,'Kerala':271000,'Bihar':265000,'Assam':116000 } },
  '2025': { total: '₹69.3L Cr', data: { 'Tamil Nadu':778044,'Maharashtra':673759,'Uttar Pradesh':578630,'West Bengal':569107,'Karnataka':500630,'Andhra Pradesh':476009,'Rajasthan':459682,'Telangana':417087,'Gujarat':325325,'Madhya Pradesh':316744,'Haryana':313539,'Punjab':294511,'Kerala':286534,'Bihar':281851,'Assam':123793 } },
  '2026': { total: '₹72.8L Cr', data: { 'Tamil Nadu':818000,'Maharashtra':708000,'Uttar Pradesh':608000,'West Bengal':598000,'Karnataka':526000,'Andhra Pradesh':500000,'Rajasthan':483000,'Telangana':438000,'Gujarat':342000,'Madhya Pradesh':333000,'Haryana':329000,'Punjab':309000,'Kerala':301000,'Bihar':296000,'Assam':130000 } },
};

const ALL_STATES = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam',
  'Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Mizoram','Nagaland','Odisha','Pondicherry','Punjab','Rajasthan','Sikkim',
  'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

const COLOR_RAMP = ['#c8e6d4','#8ecba6','#4daa6e','#2d8a4e','#1a5c34'];
const NO_DATA_COLOR = '#2e3c35';

function getColor(value, max) {
  if (!value) return NO_DATA_COLOR;
  const ratio = Math.min(value / max, 1);
  const idx = Math.min(Math.floor(ratio * COLOR_RAMP.length), COLOR_RAMP.length - 1);
  return COLOR_RAMP[idx];
}

const fmt = (v) => Number(v).toLocaleString('en-IN');

echarts.registerMap('india-sdl', indiaGeoJSON);

export default function IndiaMap({ isDark }) {
  const wrapRef  = useRef(null);   // outer wrapper — we track its size
  const chartRef = useRef(null);
  const [year, setYear] = useState('2025');

  const yd      = SDL_DATA[year];
  const sorted  = Object.entries(yd.data).sort((a, b) => b[1] - a[1]);
  const total   = sorted.reduce((s, [, v]) => s + v, 0);
  const top5Pct = ((sorted.slice(0, 5).reduce((s, [, v]) => s + v, 0) / total) * 100).toFixed(1);
  const maxVal  = sorted[0][1];

  function buildOption(data) {
    const mapData = ALL_STATES.map((name) => {
      const value = data[name] ?? null;
      return { name, value, itemStyle: { areaColor: getColor(value, maxVal) } };
    });
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#f0f1ed', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 },
        formatter: ({ name, value }) =>
          value != null
            ? `<span style="font-weight:600">${name}</span><br/>₹ ${fmt(value)} Cr`
            : `<span style="font-weight:600">${name}</span><br/><span style="color:#888">No data</span>`,
      },
      series: [{
        name: 'SDL Outstanding',
        type: 'map',
        map: 'india-sdl',
        roam: false,
        layoutCenter: ['50%', '50%'],
        layoutSize: '95%',
        aspectScale: 1,
        animation: false,
        label: { show: false },
        emphasis: {
          disabled: false,
          label: { show: true, color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" },
          itemStyle: { areaColor: '#e07b39', borderColor: '#fff', borderWidth: 1.5 },
        },
        select: { disabled: true },
        itemStyle: { borderColor: '#fff', borderWidth: 0.8 },
        data: mapData,
      }],
    };
  }

  // Init chart — only after wrapper has real width AND height
  useEffect(() => {
    if (!wrapRef.current) return;

    let chart = null;
    let ro = null;

    const init = (w, h) => {
      if (chart) { chart.dispose(); chart = null; }
      chart = echarts.init(wrapRef.current, null, { renderer: 'canvas', width: w, height: h });
      chart.setOption(buildOption(yd.data));
      chartRef.current = chart;
    };

    const tryInit = () => {
      const w = wrapRef.current?.clientWidth  || 0;
      const h = wrapRef.current?.clientHeight || 0;
      if (w > 0 && h > 0) {
        init(w, h);
      }
    };

    // Watch for size with ResizeObserver — fires as soon as layout gives real dimensions
    ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0) {
          if (!chartRef.current) {
            init(width, height);
          } else {
            chartRef.current.resize({ width, height });
          }
        }
      }
    });
    ro.observe(wrapRef.current);

    // Also try immediately in case dimensions are already available
    tryInit();

    return () => {
      ro?.disconnect();
      if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null; }
    };
  }, []); // run once on mount

  // Update data when year changes
  useEffect(() => {
    if (chartRef.current) {
      const mapData = ALL_STATES.map((name) => {
        const value = yd.data[name] ?? null;
        return { name, value, itemStyle: { areaColor: getColor(value, maxVal) } };
      });
      chartRef.current.setOption({ series: [{ data: mapData }] });
    }
  }, [year]);

  useEffect(() => {
    if (typeof window.sdlSetYear === 'function') {
      const pill = document.querySelector(`.sdl-yr[onclick*="sdlSetYear('${year}'"]`);
      if (pill) window.sdlSetYear(year, pill);
    }
  }, [year]);

  const podium = [
    { rank: 2, name: sorted[1]?.[0], val: sorted[1]?.[1], height: '68%' },
    { rank: 1, name: sorted[0]?.[0], val: sorted[0]?.[1], height: '90%', crown: true },
    { rank: 3, name: sorted[2]?.[0], val: sorted[2]?.[1], height: '50%' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      <div className="sdl-yr-pills" id="sdl-yr-pills" style={{ margin: '0 0 4px' }}>
        {['2021','2022','2023','2024','2025','2026'].map((y) => (
          <div key={y} className={`sdl-yr${year === y ? ' on' : ''}`} onClick={() => setYear(y)}>
            {y.slice(2)}
          </div>
        ))}
      </div>

      {/* Wrapper with explicit pixel height — ResizeObserver watches this */}
      <div style={{ position: 'relative', flexShrink: 0, width: '100%', height: '320px' }}>
        <div ref={wrapRef} style={{ width: '100%', height: '100%' }} />

        <div className="sdl-map-floats">
          <div className="sdl-float">
            <div className="sdl-float-l">Top State</div>
            <div className="sdl-float-v" id="sdl-top-state">{sorted[0]?.[0]}</div>
            <div className="sdl-float-s" id="sdl-top-val">₹{fmt(sorted[0]?.[1])} Cr</div>
          </div>
          <div className="sdl-float">
            <div className="sdl-float-l">States</div>
            <div className="sdl-float-v">26</div>
            <div className="sdl-float-s">Reporting</div>
          </div>
        </div>
        <div className="sdl-map-floats-bottom">
          <div className="sdl-float">
            <div className="sdl-float-l">Top 5 Share</div>
            <div className="sdl-float-v">{top5Pct}%</div>
            <div className="sdl-float-s">Concentration</div>
          </div>
        </div>
      </div>

      <div className="sdl-legend">
        <span className="sdl-leg-lo">Low</span>
        <div className="sdl-leg-bar" />
        <span className="sdl-leg-hi">High</span>
        <span className="sdl-leg-note">SDL Outstanding (₹ Cr)</span>
      </div>

      <div className="sdl-lb">
        <div className="sdl-podium">
          {podium.map(({ rank, name, val, height }) => (
            <div key={rank} className={`sdl-pod sdl-pod-${rank}`}>
              <div className="sdl-pod-rank">{rank}</div>
              <div className="sdl-pod-name">{name}</div>
              <div className="sdl-pod-val">{fmt(val)}</div>
              <div className="sdl-pod-bar" style={{ height }} />
            </div>
          ))}
        </div>

        <div className="sdl-rest" id="sdl-rest-rows">
          {sorted.slice(3).map(([name, val], i) => {
            const pct  = ((val / total) * 100).toFixed(1);
            const barW = ((val / sorted[0][1]) * 100).toFixed(1);
            return (
              <div className="sdl-rest-row" key={name}>
                <span className="sdl-rr-n"><em>{i + 4}</em>{name}</span>
                <div className="sdl-rr-track"><div className="sdl-rr-fill" style={{ width: `${barW}%` }} /></div>
                <span className="sdl-rr-v">{fmt(val)}</span>
                <span className="sdl-rr-p">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="sdl-totals">
          <div className="sdl-tot-item sdl-tot-others">
            <span>Others · 11 States</span>
            <span>₹{fmt(Math.round(total * 0.077))} Cr</span>
            <span>7.7%</span>
          </div>
          <div className="sdl-tot-item sdl-tot-grand">
            <span>Grand Total · 26 States</span>
            <span id="sdl-grand-v">{yd.total}</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}