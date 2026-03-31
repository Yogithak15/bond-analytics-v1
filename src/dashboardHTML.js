const dashboardHTML = `<div class="app">

<!-- ████ SIDEBAR — 3 items, navigation only ████ -->
<nav class="sidebar">
  <div class="sb-logo">B</div>
  <div class="sb-nav">
    <div class="sb-item" id="sni-dash"    data-tip="Dashboard"      onclick="navigate('dash')">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
    </div>
    <div class="sb-item on" id="sni-catalog" data-tip="Dataset Catalog" onclick="navigate('catalog')">
      <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
    </div>
    <div class="sb-item"    id="sni-ref"     data-tip="Reference Data"  onclick="navigate('ref')">
      <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
    </div>
  </div>
</nav>

<!-- ████ BODY ████ -->
<div class="body">

  <!-- TOPBAR — actions only, zero navigation -->
  <header class="topbar">
    <div class="tb-acts">
      <!-- theme toggle pill -->
      <div class="theme-pill">
        <div class="topt on" id="topt-light" onclick="setTheme('light')" title="Light">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </div>
        <div class="topt" id="topt-dark" onclick="setTheme('dark')" title="Dark">
          <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        </div>
      </div>
      <!-- compare -->
      <div class="tb-btn" id="btn-compare" onclick="togglePanel('compare')" title="Compare">
        <svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
      </div>
      <!-- watchlist -->
      <div class="tb-btn" id="btn-watchlist" onclick="togglePanel('watchlist')" title="Watchlist">
        <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <!-- notifications -->
      <div class="tb-btn" title="Notifications">
        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        <span class="tb-dot"></span>
      </div>
      <!-- profile -->
      <div class="tb-profile">
        <div class="tb-pav">AK</div>
        <div><div class="tb-pname">Arjun Kumar</div><div class="tb-pemail"><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="32534058475c72505d5c5650475e5e411c5b5c">[email&#160;protected]</a></div></div>
      </div>
    </div>
  </header>

  <!-- PAGES -->
  <div class="pages">

    <!-- ═══════════════════════════════════
         DASHBOARD — India Debt Market
    ═══════════════════════════════════ -->
    <div class="page" id="page-dash">
      <div style="display:flex;flex-direction:column;height:100%;overflow:hidden">

        <!-- Dashboard section tabs -->
        <div class="dm-tabs">
          <div class="dm-tab on" id="dmt-overview"  onclick="dashTab('overview',this)">Overview</div>
          <div class="dm-tab"    id="dmt-gsec"      onclick="dashTab('gsec',this)">G-Secs</div>
          <div class="dm-tab"    id="dmt-issuance"  onclick="dashTab('issuance',this)">SDL</div>
          <div class="dm-tab"    id="dmt-secondary" onclick="dashTab('secondary',this)">Corp Bonds</div>
          <div class="dm-tab"    id="dmt-sources"   onclick="dashTab('sources',this)">Data Sources</div>
          <div class="dm-tabs-right">
            <div class="dm-live-badge"><span class="dm-live-dot"></span>Live</div>
            <span class="dm-date">FY 2025–26 · 24 Mar 2026</span>
          </div>
        </div>

        <!-- scrollable content -->
        <div class="scroll dm-content" id="dm-content">

          <!-- ── OVERVIEW TAB ── -->
          <div class="dm-pane on" id="dmp-overview">

            <!-- KPI tiles FIRST -->
            <div class="dm-kpi-grid" style="grid-template-columns:repeat(4,1fr)">
              <div class="dm-kpi dm-kpi-2"><div class="dm-kpi-l">G-Sec Outstanding</div><div class="dm-kpi-v">120.4L<span class="dm-kpi-u">Cr</span></div><div class="dm-kpi-s">RBI · GoI Securities</div></div>
              <div class="dm-kpi dm-kpi-3"><div class="dm-kpi-l">SDL Outstanding</div><div class="dm-kpi-v">69.3L<span class="dm-kpi-u">Cr</span></div><div class="dm-kpi-s">26 States · RBI</div></div>
              <div class="dm-kpi dm-kpi-4"><div class="dm-kpi-l">Corp Bond Outstanding</div><div class="dm-kpi-v">58.0L<span class="dm-kpi-u">Cr</span></div><div class="dm-kpi-s">Latest quarter · SEBI</div></div>
              <div class="dm-kpi dm-kpi-1"><div class="dm-kpi-l">Total Debt Market</div><div class="dm-kpi-v">247.7L<span class="dm-kpi-u">Cr</span></div><div class="dm-kpi-s">G-Sec + SDL + Corp</div></div>
            </div>

            <!-- SDL MAP CARD SECOND -->
            <div class="sdl-card">
              <div class="sdl-hdr">
                <div class="sdl-hdr-left">
                  <div>
                    <div class="sdl-hdr-title">State Development Loans — Outstanding</div>
                    <div class="sdl-hdr-sub">Choropleth by state · Source: RBI</div>
                  </div>
                </div>
                <div class="sdl-hdr-row2">
                  <div class="sdl-yr-wrap">
                    <span class="sdl-yr-lbl">FY</span>
                    <div class="sdl-yr-pills" id="sdl-yr-pills">
                      <div class="sdl-yr on" onclick="sdlSetYear('2021',this)">21</div>
                      <div class="sdl-yr" onclick="sdlSetYear('2022',this)">22</div>
                      <div class="sdl-yr" onclick="sdlSetYear('2023',this)">23</div>
                      <div class="sdl-yr" onclick="sdlSetYear('2024',this)">24</div>
                      <div class="sdl-yr" onclick="sdlSetYear('2025',this)">25</div>
                      <div class="sdl-yr" onclick="sdlSetYear('2026',this)">26</div>
                    </div>
                  </div>
                  <div class="sdl-total-pill">
                    <span class="sdl-total-l">Total</span>
                    <span class="sdl-total-v" id="sdl-total-v">&#x20B9;69.3L Cr</span>
                  </div>
                </div>
              </div>
              <div class="sdl-body">
                <div class="sdl-map-col">
                  <div style="position:relative;flex-shrink:0">
                    <div id="india-echarts-map" style="width:100%;height:320px;display:block"></div>
                    <div class="sdl-map-floats">
                      <div class="sdl-float"><div class="sdl-float-l">Top State</div><div class="sdl-float-v" id="sdl-top-state">Tamil Nadu</div><div class="sdl-float-s" id="sdl-top-val">&#x20B9;7,78,044 Cr</div></div>
                      <div class="sdl-float"><div class="sdl-float-l">States</div><div class="sdl-float-v">26</div><div class="sdl-float-s">Reporting</div></div>
                    </div>
                    <div class="sdl-map-floats-bottom">
                      <div class="sdl-float"><div class="sdl-float-l">Top 5 Share</div><div class="sdl-float-v">44.7%</div><div class="sdl-float-s">Concentration</div></div>
                    </div>
                  </div>
                  <div class="sdl-legend" style="margin-top:auto">
                    <span class="sdl-leg-lo">Low</span><div class="sdl-leg-bar"></div><span class="sdl-leg-hi">High</span><span class="sdl-leg-note">SDL Outstanding (&#x20B9; Cr)</span>
                  </div>
                </div>
                <div class="sdl-lb">
                  <div class="sdl-podium">
                    <div class="sdl-pod sdl-pod-2"><div class="sdl-pod-rank">2</div><div class="sdl-pod-name" id="sdl-p2-name">Maharashtra</div><div class="sdl-pod-val" id="sdl-p2-val">6,73,759</div><div class="sdl-pod-bar" style="height:68%"></div></div>
                    <div class="sdl-pod sdl-pod-1"><div class="sdl-pod-rank">1</div><div class="sdl-pod-name" id="sdl-p1-name">Tamil Nadu</div><div class="sdl-pod-val" id="sdl-p1-val">7,78,044</div><div class="sdl-pod-bar" style="height:90%"></div></div>
                    <div class="sdl-pod sdl-pod-3"><div class="sdl-pod-rank">3</div><div class="sdl-pod-name" id="sdl-p3-name">Uttar Pradesh</div><div class="sdl-pod-val" id="sdl-p3-val">5,78,630</div><div class="sdl-pod-bar" style="height:50%"></div></div>
                  </div>
                  <div class="sdl-rest" id="sdl-rest-rows">
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>4</em>West Bengal</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:73.1%"></div></div><span class="sdl-rr-v">5,69,107</span><span class="sdl-rr-p">8.2%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>5</em>Karnataka</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:64.3%"></div></div><span class="sdl-rr-v">5,00,630</span><span class="sdl-rr-p">7.2%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>6</em>Andhra Pradesh</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:61.2%"></div></div><span class="sdl-rr-v">4,76,009</span><span class="sdl-rr-p">6.9%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>7</em>Rajasthan</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:59.1%"></div></div><span class="sdl-rr-v">4,59,682</span><span class="sdl-rr-p">6.6%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>8</em>Telangana</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:53.6%"></div></div><span class="sdl-rr-v">4,17,087</span><span class="sdl-rr-p">6.0%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>9</em>Gujarat</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:41.8%"></div></div><span class="sdl-rr-v">3,25,325</span><span class="sdl-rr-p">4.7%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>10</em>Madhya Pradesh</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:40.7%"></div></div><span class="sdl-rr-v">3,16,744</span><span class="sdl-rr-p">4.6%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>11</em>Haryana</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:40.3%"></div></div><span class="sdl-rr-v">3,13,539</span><span class="sdl-rr-p">4.5%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>12</em>Punjab</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:37.9%"></div></div><span class="sdl-rr-v">2,94,511</span><span class="sdl-rr-p">4.2%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>13</em>Kerala</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:36.8%"></div></div><span class="sdl-rr-v">2,86,534</span><span class="sdl-rr-p">4.2%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>14</em>Bihar</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:36.2%"></div></div><span class="sdl-rr-v">2,81,851</span><span class="sdl-rr-p">4.1%</span></div>
                    <div class="sdl-rest-row"><span class="sdl-rr-n"><em>15</em>Assam</span><div class="sdl-rr-track"><div class="sdl-rr-fill" style="width:15.9%"></div></div><span class="sdl-rr-v">1,23,793</span><span class="sdl-rr-p">1.8%</span></div>
                  </div>
                  <div class="sdl-totals">
                    <div class="sdl-tot-item sdl-tot-others"><span>Others &middot; 11 States</span><span>&#x20B9;5,32,755 Cr</span><span>7.7%</span></div>
                    <div class="sdl-tot-item sdl-tot-grand"><span>Grand Total &middot; 26 States</span><span id="sdl-grand-v">&#x20B9;69,30,000 Cr</span><span>100%</span></div>
                  </div>
                </div>
              </div>
            </div><!-- /sdl-card -->

            <!-- ROW 1: Market Composition + NCD vs PP -->
            <div class="g2">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between">
                  <div><div style="font-size:13px;font-weight:600;color:var(--tx)">Market Composition</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Share of India debt market &middot; FY 2025&#x2013;26</div></div>
                  <div class="dm-pill">&#x20B9;247.7L Cr Total</div>
                </div>
                <div style="display:flex;align-items:center;">
                  <div class="cp" style="flex:1"><canvas id="c-ov-comp" height="200"></canvas></div>
                  <div style="padding:0 18px;display:flex;flex-direction:column;gap:10px">
                    <div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:#e07b39;flex-shrink:0"></div><div><div style="font-size:10.5px;font-weight:600;color:var(--tx)">G-Secs</div><div style="font-size:11px;font-family:var(--mo);color:var(--tx2)">120.4L Cr &middot; 48.6%</div></div></div>
                    <div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:#0e7490;flex-shrink:0"></div><div><div style="font-size:10.5px;font-weight:600;color:var(--tx)">SDLs</div><div style="font-size:11px;font-family:var(--mo);color:var(--tx2)">69.3L Cr &middot; 28.0%</div></div></div>
                    <div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:#2d8a4e;flex-shrink:0"></div><div><div style="font-size:10.5px;font-weight:600;color:var(--tx)">Corp Bonds</div><div style="font-size:11px;font-family:var(--mo);color:var(--tx2)">58.0L Cr &middot; 23.4%</div></div></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)">
                  <div style="font-size:13px;font-weight:600;color:var(--tx)">NCD IPO Issues vs Private Placements</div>
                  <div style="font-size:11px;color:var(--tx3);margin-top:2px">Issue count (bar) + Amount &#x20B9;Cr (line) &middot; SEBI</div>
                </div>
                <div class="cp"><canvas id="c-ov-ncd-pp" height="200"></canvas></div>
              </div>
            </div>

            <!-- ROW 2: Corp Bonds Outstanding + Top State Borrowings -->
            <div class="g2">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)">
                  <div style="font-size:13px;font-weight:600;color:var(--tx)">Corporate Bonds Outstanding</div>
                  <div style="font-size:11px;color:var(--tx3);margin-top:2px">Quarterly trend (&#x20B9;K Cr) + Trade count (line) &middot; SEBI</div>
                </div>
                <div class="cp"><canvas id="c-ov-corp-os" height="200"></canvas></div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between">
                  <div><div style="font-size:13px;font-weight:600;color:var(--tx)">Top State Borrowings (SDL)</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Outstanding &#x20B9;K Cr (bar) + Share % (line) &middot; RBI</div></div>
                  <div class="dm-pill">FY 2025&#x2013;26</div>
                </div>
                <div class="cp"><canvas id="c-ov-sdl-states" height="200"></canvas></div>
              </div>
            </div>

          </div><!-- /overview -->

          <!-- ── SDL DEEP DIVE TAB ── -->
          <div class="dm-pane" id="dmp-issuance">
            <div class="dm-section-lbl"><div class="dm-sl-bar" style="background:#0e7490"></div><span>State Development Loans (SDL) &#x2014; Deep Dive</span></div>
            <div class="dm-kpi-grid" style="grid-template-columns:repeat(3,1fr)">
              <div class="dm-kpi dm-kpi-3"><div class="dm-kpi-l">Total SDL Outstanding</div><div class="dm-kpi-v">69.3L<span class="dm-kpi-u">Cr</span></div><div class="dm-kpi-s">26 States &middot; RBI &middot; FY26</div></div>
              <div class="dm-kpi dm-kpi-5"><div class="dm-kpi-l">Top 5 States Share</div><div class="dm-kpi-v">44.7<span class="dm-kpi-u">%</span></div><div class="dm-kpi-s">Tamil Nadu leads</div></div>
              <div class="dm-kpi dm-kpi-6"><div class="dm-kpi-l">Top 15 States Share</div><div class="dm-kpi-v">92.3<span class="dm-kpi-u">%</span></div><div class="dm-kpi-s">High concentration</div></div>
            </div>
            <div class="g2">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">SDL Outstanding &#x2014; Yearly Trend</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">&#x20B9;L Cr (bar) + YoY Growth % (line) &middot; RBI</div></div>
                <div class="cp"><canvas id="c-sdl-trend" height="220"></canvas></div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:13px;font-weight:600;color:var(--tx)">Top 10 States &#x2014; SDL Outstanding</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">&#x20B9;K Cr (bar) + Share % (line) &middot; RBI</div></div><div class="dm-pill">FY 2025&#x2013;26</div></div>
                <div class="cp"><canvas id="c-sdl-states" height="220"></canvas></div>
              </div>
            </div>
            <div class="card">
              <div style="padding:12px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:13px;font-weight:600;color:var(--tx)">State-wise SDL Outstanding &#x2014; Detailed</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Source: RBI &middot; All 26 states</div></div></div>
              <div class="tw"><table><thead><tr><th>#</th><th>State</th><th class="R">Outstanding (&#x20B9; Cr)</th><th class="R">Share</th><th class="R">YoY Growth</th><th class="R">5Y CAGR</th></tr></thead>
              <tbody>
                <tr><td class="mo" style="color:var(--tx4)">1</td><td class="nm">Tamil Nadu</td><td class="R mo">7,78,044</td><td class="R mo">11.2%</td><td class="R up">+5.5%</td><td class="R up">8.2%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">2</td><td class="nm">Maharashtra</td><td class="R mo">6,73,759</td><td class="R mo">9.7%</td><td class="R up">+4.8%</td><td class="R up">7.6%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">3</td><td class="nm">Uttar Pradesh</td><td class="R mo">5,78,630</td><td class="R mo">8.3%</td><td class="R up">+6.1%</td><td class="R up">9.1%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">4</td><td class="nm">West Bengal</td><td class="R mo">5,69,107</td><td class="R mo">8.2%</td><td class="R up">+3.9%</td><td class="R up">6.8%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">5</td><td class="nm">Karnataka</td><td class="R mo">5,00,630</td><td class="R mo">7.2%</td><td class="R up">+7.2%</td><td class="R up">10.1%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">6</td><td class="nm">Andhra Pradesh</td><td class="R mo">4,76,009</td><td class="R mo">6.9%</td><td class="R up">+4.2%</td><td class="R up">7.9%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">7</td><td class="nm">Rajasthan</td><td class="R mo">4,59,682</td><td class="R mo">6.6%</td><td class="R up">+8.1%</td><td class="R up">11.4%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">8</td><td class="nm">Telangana</td><td class="R mo">4,17,087</td><td class="R mo">6.0%</td><td class="R up">+5.0%</td><td class="R up">8.8%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">9</td><td class="nm">Gujarat</td><td class="R mo">3,25,325</td><td class="R mo">4.7%</td><td class="R up">+3.2%</td><td class="R up">6.2%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">10</td><td class="nm">Madhya Pradesh</td><td class="R mo">3,16,744</td><td class="R mo">4.6%</td><td class="R up">+6.8%</td><td class="R up">9.5%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">11</td><td class="nm">Haryana</td><td class="R mo">3,13,539</td><td class="R mo">4.5%</td><td class="R up">+3.5%</td><td class="R up">7.1%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">12</td><td class="nm">Punjab</td><td class="R mo">2,94,511</td><td class="R mo">4.2%</td><td class="R up">+4.1%</td><td class="R up">7.3%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">13</td><td class="nm">Kerala</td><td class="R mo">2,86,534</td><td class="R mo">4.2%</td><td class="R up">+4.7%</td><td class="R up">7.8%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">14</td><td class="nm">Bihar</td><td class="R mo">2,81,851</td><td class="R mo">4.1%</td><td class="R up">+7.4%</td><td class="R up">10.2%</td></tr>
                <tr><td class="mo" style="color:var(--tx4)">15</td><td class="nm">Assam</td><td class="R mo">1,23,793</td><td class="R mo">1.8%</td><td class="R up">+6.3%</td><td class="R up">9.6%</td></tr>
              </tbody></table></div>
              <div class="tbl-foot">Showing top 15 of 26 states &middot; &#x20B9;63,97,245 Cr (92.3% of total)</div>
            </div>
          </div><!-- /sdl tab -->

          <!-- ── CORP BONDS DEEP DIVE TAB ── -->
          <div class="dm-pane" id="dmp-secondary">
            <div class="dm-section-lbl"><div class="dm-sl-bar" style="background:var(--green)"></div><span>Corporate Bonds &#x2014; Deep Dive</span></div>
            <div class="dm-kpi-grid" style="grid-template-columns:repeat(3,1fr)">
              <div class="dm-kpi dm-kpi-4"><div class="dm-kpi-l">Corp Bond Outstanding</div><div class="dm-kpi-v">58.0L<span class="dm-kpi-u">Cr</span></div><div class="dm-kpi-s">Latest quarter &middot; SEBI</div></div>
              <div class="dm-kpi dm-kpi-5"><div class="dm-kpi-l">NCD Issues (FY26 YTD)</div><div class="dm-kpi-v">8,272</div><div class="dm-kpi-s">&#x20B9;4K Cr raised</div></div>
              <div class="dm-kpi dm-kpi-6"><div class="dm-kpi-l">Private Placements (FY26)</div><div class="dm-kpi-v">7.3L</div><div class="dm-kpi-s">&gt;95% of issuance</div></div>
            </div>
            <div class="g2">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:13px;font-weight:600;color:var(--tx)">NCD Public Issues &#x2014; Yearly Trend</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Issue count (bar) + Amount &#x20B9;Cr (line) &middot; SEBI</div></div><div class="dm-pill">Latest: 8,272 &middot; &#x20B9;4K Cr</div></div>
                <div class="cp"><canvas id="c-ncd" height="220"></canvas></div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:13px;font-weight:600;color:var(--tx)">Private Placements &#x2014; Yearly Trend</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Issue count (bar) + Amount &#x20B9;K Cr (line) &middot; SEBI</div></div><div class="dm-pill">Latest: 7.3L Issues</div></div>
                <div class="cp"><canvas id="c-pp" height="220"></canvas></div>
              </div>
            </div>
            <div class="g2">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">Corp Bond Trading Volume</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Volume &#x20B9;L Cr (bar) + Trade count M (line) &middot; SEBI</div></div>
                <div class="cp"><canvas id="c-trade" height="200"></canvas></div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">Outstanding by Issuer Type</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">PSU / Private / Banks &middot; SEBI</div></div>
                <div class="cp"><canvas id="c-issuer" height="200"></canvas></div>
              </div>
            </div>
            <div class="card">
              <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">Issuance Summary</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">FY-wise NCD + Private Placement breakdown</div></div>
              <div class="tw"><table><thead><tr><th>FY</th><th class="R">NCD Issues</th><th class="R">NCD Amount (&#x20B9; Cr)</th><th class="R">PP Issues</th><th class="R">PP Amount (&#x20B9; Cr)</th><th class="R">Total (&#x20B9; Cr)</th></tr></thead>
              <tbody>
                <tr><td class="mo nm">2018&#x2013;19</td><td class="R mo">14,200</td><td class="R mo">13,500</td><td class="R mo">1,100</td><td class="R mo">1,45,000</td><td class="R mo up">1,58,500</td></tr>
                <tr><td class="mo nm">2019&#x2013;20</td><td class="R mo">9,800</td><td class="R mo">6,200</td><td class="R mo">1,250</td><td class="R mo">1,62,000</td><td class="R mo up">1,68,200</td></tr>
                <tr><td class="mo nm">2020&#x2013;21</td><td class="R mo">4,200</td><td class="R mo">2,400</td><td class="R mo">1,200</td><td class="R mo">1,40,000</td><td class="R mo up">1,42,400</td></tr>
                <tr><td class="mo nm">2021&#x2013;22</td><td class="R mo">5,600</td><td class="R mo">3,800</td><td class="R mo">1,450</td><td class="R mo">1,58,000</td><td class="R mo up">1,61,800</td></tr>
                <tr><td class="mo nm">2022&#x2013;23</td><td class="R mo">6,000</td><td class="R mo">3,700</td><td class="R mo">1,600</td><td class="R mo">1,52,000</td><td class="R mo up">1,55,700</td></tr>
                <tr><td class="mo nm">2023&#x2013;24</td><td class="R mo">8,400</td><td class="R mo">10,800</td><td class="R mo">1,900</td><td class="R mo">1,98,000</td><td class="R mo up">2,08,800</td></tr>
                <tr><td class="mo nm">2024&#x2013;25</td><td class="R mo">6,800</td><td class="R mo">3,400</td><td class="R mo">1,800</td><td class="R mo">1,75,000</td><td class="R mo up">1,78,400</td></tr>
                <tr style="background:var(--sf2)"><td class="mo nm" style="color:var(--green)">2025&#x2013;26 YTD</td><td class="R mo">8,272</td><td class="R up mo">4,000</td><td class="R mo">7,29,968</td><td class="R up mo">2,00,000</td><td class="R up mo">2,04,000</td></tr>
              </tbody></table></div>
            </div>
          </div><!-- /corp bonds tab -->

          <!-- ── G-SECS TAB ── -->
          <div class="dm-pane" id="dmp-gsec">
            <div class="dm-section-lbl"><div class="dm-sl-bar" style="background:#e07b39"></div><span>Government Securities (G-Secs) — RBI</span></div>
            <div class="g3" style="margin-bottom:12px">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">Security Type Breakdown</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">RBI · 52K Cr total</div></div>
                <div style="padding:14px 16px;display:flex;justify-content:center"><canvas id="c-gsec-type" height="200" style="max-width:220px"></canvas></div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--bdr)">
                  <div style="padding:10px 14px;text-align:center;border-right:1px solid var(--bdr)"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Total</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:#e07b39">52K Cr</div></div>
                  <div style="padding:10px 14px;text-align:center;border-right:1px solid var(--bdr)"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Types</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--blue)">1</div></div>
                  <div style="padding:10px 14px;text-align:center"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Fixed</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--green)">100%</div></div>
                </div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">G-Sec Maturity Profile</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">By residual maturity bucket</div></div>
                <div class="cp"><canvas id="c-gsec-maturity" height="200"></canvas></div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--bdr)">
                  <div style="padding:10px 14px;text-align:center;border-right:1px solid var(--bdr)"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Buckets</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--blue)">5</div></div>
                  <div style="padding:10px 14px;text-align:center;border-right:1px solid var(--bdr)"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Avg Maturity</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--tx)">12.4 yr</div></div>
                  <div style="padding:10px 14px;text-align:center"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Longest</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--purple)">&gt;20Y</div></div>
                </div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">STRIPS Outstanding Trend</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">RBI · Quarterly</div></div>
                <div class="cp"><canvas id="c-strips" height="200"></canvas></div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--bdr)">
                  <div style="padding:10px 14px;text-align:center;border-right:1px solid var(--bdr)"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Current</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--blue)">2,950</div></div>
                  <div style="padding:10px 14px;text-align:center;border-right:1px solid var(--bdr)"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Growth</div><div style="font-size:15px;font-weight:700;font-family:var(--mo);color:var(--green)">↑ 2.5×</div></div>
                  <div style="padding:10px 14px;text-align:center"><div style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:3px">Source</div><div style="font-size:13px;font-weight:700;font-family:var(--mo);color:var(--tx3)">RBI</div></div>
                </div>
              </div>
            </div>
          </div><!-- /gsec -->

          <!-- ── DATA SOURCES TAB ── -->
          <div class="dm-pane" id="dmp-sources">
            <div class="dm-section-lbl"><div class="dm-sl-bar" style="background:var(--red)"></div><span>Market Summary &amp; Active Data Sources</span></div>
            <div class="g2">
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">Issuance &amp; Trading Snapshot</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Latest data across channels</div></div>
                <div class="dm-snap-row"><div><div class="dm-snap-lbl">Private Placements (Latest)</div><div class="dm-snap-v" style="color:#e07b39">7,29,968 <span>Issues</span></div></div><div class="dm-snap-right"><div class="dm-snap-amt">2K Cr</div><div class="dm-snap-meta">SEBI · Private placement</div></div></div>
                <div class="dm-snap-row"><div><div class="dm-snap-lbl">NCD Public Issues (Latest)</div><div class="dm-snap-v" style="color:var(--green)">8,272 <span>Issues</span></div></div><div class="dm-snap-right"><div class="dm-snap-amt">4K Cr</div><div class="dm-snap-meta">SEBI · NCD public</div></div></div>
                <div class="dm-snap-row"><div><div class="dm-snap-lbl">Corp Bond Trading (Latest)</div><div class="dm-snap-v" style="color:var(--blue)">1.8M <span>trades</span></div></div><div class="dm-snap-right"><div class="dm-snap-amt">22L Cr</div><div class="dm-snap-meta">SEBI · BSE/NSE/MCX</div></div></div>
                <div class="dm-snap-row"><div><div class="dm-snap-lbl">Corp Bond Outstanding (Q)</div><div class="dm-snap-v" style="color:var(--purple)">3K Cr</div></div><div class="dm-snap-right"><div class="dm-snap-meta">Latest quarter · SEBI</div></div></div>
                <div class="dm-snap-row"><div><div class="dm-snap-lbl">SDL Outstanding (Total)</div><div class="dm-snap-v" style="color:var(--teal)">3K Cr</div></div><div class="dm-snap-right"><div class="dm-snap-meta">RBI · State Dev Loans</div></div></div>
                <div class="dm-snap-row"><div><div class="dm-snap-lbl">G-Sec Outstanding (Total)</div><div class="dm-snap-v" style="color:#e07b39">52K Cr</div></div><div class="dm-snap-right"><div class="dm-snap-meta">RBI · GoI Securities</div></div></div>
              </div>
              <div class="card">
                <div style="padding:12px 16px;border-bottom:1px solid var(--bdr)"><div style="font-size:13px;font-weight:600;color:var(--tx)">Active Data Sources</div><div style="font-size:11px;color:var(--tx3);margin-top:2px">Live datasets powering this dashboard</div></div>
                <div class="dm-ds-list">
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-sebi">SEBI</div><div class="dm-ds-info"><div class="dm-ds-name">Public Issues (NCD)</div><div class="dm-ds-slug">SEBI_CORP_DEBT</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-sebi">SEBI</div><div class="dm-ds-info"><div class="dm-ds-name">Private Placements</div><div class="dm-ds-slug">SEBI_PRIVATE_PLACEMENT</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-sebi">SEBI</div><div class="dm-ds-info"><div class="dm-ds-name">Corporate Bond Trades</div><div class="dm-ds-slug">SEBI_CORP_BOND_TRADES</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-sebi">SEBI</div><div class="dm-ds-info"><div class="dm-ds-name">Outstanding Bonds (Qtrly)</div><div class="dm-ds-slug">SEBI_OUTSTANDING_CORP_BONDS</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-sebi">SEBI</div><div class="dm-ds-info"><div class="dm-ds-name">Outstanding by Issuer</div><div class="dm-ds-slug">SEBI_OUTSTANDING_FIN_NONFINANCIAL</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-rbi">RBI</div><div class="dm-ds-info"><div class="dm-ds-name">State Dev Loans (SDLs)</div><div class="dm-ds-slug">RBI_SDL_OUTSTANDING</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-rbi">RBI</div><div class="dm-ds-info"><div class="dm-ds-name">G-Sec Outstanding</div><div class="dm-ds-slug">RBI_GSEC_OUTSTANDING</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-rbi">RBI</div><div class="dm-ds-info"><div class="dm-ds-name">FBIL Zero Coupon Yield Curve</div><div class="dm-ds-slug">RBI_FBIL_YIELD_CURVE</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                  <div class="dm-ds-row"><div class="dm-badge dm-badge-nse">NSE</div><div class="dm-ds-info"><div class="dm-ds-name">NSE EBP Corp Bond Placements</div><div class="dm-ds-slug">NSE_EBP_CORPORATE_BOND_PLACEMENTS</div></div><div class="dm-ds-live"><span class="dm-ds-dot"></span>Live</div></div>
                </div>
              </div>
            </div>
          </div><!-- /sources -->

        </div><!-- /dm-content -->
      </div>
    </div><!-- /page-dash -->

    <!-- ═══════════════════════════════════
         DATASET CATALOG (redesigned)
    ═══════════════════════════════════ -->
    <div class="page on" id="page-catalog">
      <div class="cat-shell">

        <!-- LEFT PANEL: compact, monochrome, no duplicate filters -->
        <aside class="cat-panel">
          <div class="cat-panel-head">
            <span class="cat-panel-title">Filters</span>
            
          </div>

          <!-- STATUS — correct order: All / Active / Inactive -->
          <span class="fp-lbl">Status</span>
          <div class="status-seg">
            <div class="seg-opt on" id="st-all"      onclick="setStatus('all',this)">All</div>
            <div class="seg-opt"    id="st-active"   onclick="setStatus('active',this)">Active</div>
            <div class="seg-opt"    id="st-inactive" onclick="setStatus('inactive',this)">Inactive</div>
          </div>

          <div class="fp-divider"></div>

          <!-- BY SOURCE — populated dynamically by rebuildSourceFilters() -->
          <span class="fp-lbl">Source</span>
          <div id="cat-src-filters">
            <div class="src-row on" id="src-all" onclick="setSrc('all',this)">
              <span class="src-label">All Sources</span>
              <span class="src-count" id="src-all-count">—</span>
            </div>
          </div>

          <div class="fp-divider"></div>

          <!-- FREQUENCY — neutral, no per-frequency colours -->
          <span class="fp-lbl">Frequency</span>
          <div class="src-row on" id="freq-all"     onclick="setFreq('all',this)">
            <span class="src-label">All</span>
            <span class="src-count" id="freq-count-all">—</span>
          </div>
          <div class="src-row" id="freq-daily"   onclick="setFreq('daily',this)">
            <span class="src-label">Daily</span>
            <span class="src-count" id="freq-count-daily">—</span>
          </div>
          <div class="src-row" id="freq-weekly"  onclick="setFreq('weekly',this)">
            <span class="src-label">Weekly</span>
            <span class="src-count" id="freq-count-weekly">—</span>
          </div>
          <div class="src-row" id="freq-monthly" onclick="setFreq('monthly',this)">
            <span class="src-label">Monthly</span>
            <span class="src-count" id="freq-count-monthly">—</span>
          </div>
        </aside>

        <!-- MAIN CATALOG AREA -->
        <div class="cat-main">
          <!-- Mobile filter trigger -->
          <div class="fbar-mobile-btn" style="display:none;padding:10px 10px 4px;gap:8px;align-items:center;flex-shrink:0">
            <button class="btn" style="display:flex;align-items:center;gap:6px;font-size:12px" onclick="togglePanel('filters')">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filters
            </button>
          </div>


          <!-- Summary strip — compact inline, no card boxes -->
          <div class="cat-summary">
            <div class="sum-kpi"><div class="sum-kpi-v" id="sum-kpi-total">—</div><div class="sum-kpi-l">Datasets</div></div>
            <div class="sum-kpi"><div class="sum-kpi-v" id="sum-kpi-active">—</div><div class="sum-kpi-l">Active</div></div>
            <div class="sum-kpi"><div class="sum-kpi-v" id="sum-kpi-metrics">—</div><div class="sum-kpi-l">Metrics</div></div>
            <div class="sum-kpi"><div class="sum-kpi-v" id="sum-kpi-dims">—</div><div class="sum-kpi-l">Dimensions</div></div>
          </div>

          <!-- Toolbar: search + sort + view toggle — single clean bar -->
          <div class="cat-toolbar">
            <div class="cat-search">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search datasets…" id="cat-q" oninput="filterCat()">
            </div>
            <div style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--tx3);margin-left:auto;white-space:nowrap">
              Sort:
              <select id="cat-sort" onchange="renderCatalog()" style="background:none;border:none;outline:none;font-size:11.5px;color:var(--tx2);font-family:var(--fn);cursor:pointer">
                <option value="name">Name A–Z</option>
                <option value="src">Source</option>
                <option value="updated">Last Updated</option>
                <option value="metrics">Metrics ↓</option>
                <option value="dims">Dimensions ↓</option>
              </select>
            </div>
            <div class="view-toggle">
              <div class="vt-btn on" id="vt-list" onclick="setView('list')" title="List view">
                <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </div>
              <div class="vt-btn" id="vt-card" onclick="setView('card')" title="Card view">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              </div>
            </div>
          </div>

          <!-- Result count bar -->
          <div class="cat-result-bar">
            <div class="cat-result-txt" id="cat-count"><strong>10</strong> datasets</div>
          </div>

          <!-- Dense list view (default) -->
          <div class="cat-list" id="cat-list-wrap">
            <div id="cat-list-view">
              <!-- Column headers -->
              <div class="list-head">
                <div class="lh-cell" onclick="catSort('name')">Dataset <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
                <div class="lh-cell" onclick="catSort('src')">Source</div>
                <div class="lh-cell" onclick="catSort('freq')">Frequency</div>
                <div class="lh-cell" onclick="catSort('metrics')">Metrics <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
                <div class="lh-cell" onclick="catSort('dims')">Dimensions <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
                <div class="lh-cell" onclick="catSort('updated')">Last Updated <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
                <div class="lh-cell">Status</div>
                <div class="lh-cell"></div>
              </div>
              <!-- Rows injected by JS -->
              <div id="cat-rows"></div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════
         DATASET DETAIL — single unified page
    ═══════════════════════════════════ -->
    <div class="page" id="page-detail">
      <div style="display:flex;flex-direction:column;height:100%;overflow:hidden">

        <!-- Breadcrumb bar -->
        <div class="breadbar">
          <div class="bc">
            <span class="bc-a" onclick="navigate('catalog')">Dataset Catalog</span>
            <span class="bc-sep">›</span>
            <span class="bc-cur" id="det-bc">—</span>
          </div>
          <div style="display:flex;align-items:center;gap:7px">
            <button class="btn btn-xs" id="det-src-btn">
              <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>Source URLs
            </button>
            <button class="btn btn-sm btn-ghost" onclick="navigate('catalog')">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>Back
            </button>
          </div>
        </div>

        <!-- Body: left sidebar controls + right content -->
        <!-- Mobile: "Chart Builder" toggle button -->
        <div class="det-pivot-btn" style="display:none;padding:8px 12px;border-bottom:1px solid var(--bdr);background:var(--sf);position:sticky;top:52px;z-index:199;flex-shrink:0">
          <button class="btn" style="display:flex;align-items:center;gap:6px;font-size:12px;width:100%;justify-content:center" onclick="togglePanel('pivot')">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6"/></svg>
            Pivot &amp; Chart Builder
          </button>
        </div>
        <div class="det-shell-inner" style="flex:1;display:flex;overflow:hidden">

          <!-- LEFT SIDEBAR: Pivot & Chart controls -->
          <div id="det-sidebar" style="width:220px;flex-shrink:0;background:var(--sf);border-right:1px solid var(--bdr);overflow-y:auto;padding:16px 14px 24px;display:flex;flex-direction:column;gap:0">
            <div style="font-size:11px;font-weight:700;color:var(--tx);margin-bottom:16px;letter-spacing:.01em">Pivot &amp; Chart Builder</div>

            <!-- Dataset -->
            <div class="ctrl-blk" style="margin-bottom:13px">
              <div class="ctrl-lbl" style="margin-bottom:4px">Dataset</div>
              <select class="ctrl-sel" id="exp-ds" onchange="buildExpChart()"><option id="exp-ds-opt">—</option></select>
            </div>
            <!-- Metric -->
            <div class="ctrl-blk" style="margin-bottom:13px">
              <div class="ctrl-lbl" style="margin-bottom:4px">Metric</div>
              <select class="ctrl-sel" id="exp-metric" onchange="buildExpChart()">
                <option value="base_issue_size">base_issue_size</option>
                <option value="ytm">ytm</option>
                <option value="clean_price">clean_price</option>
                <option value="volume_cr">volume_cr</option>
                <option value="trade_count">trade_count</option>
              </select>
            </div>
            <!-- Aggregation -->
            <div class="ctrl-blk" style="margin-bottom:4px">
              <div class="ctrl-lbl" style="margin-bottom:4px">Aggregation</div>
              <select class="ctrl-sel" id="exp-agg" onchange="buildExpChart()">
                <option>SUM</option><option>AVG</option><option>COUNT</option><option>MIN</option><option>MAX</option>
              </select>
            </div>
            <div class="ctrl-hint" id="exp-unit" style="margin-bottom:13px;padding-left:2px">Unit: INR_CR</div>
            <!-- Periodicity -->
            <div class="ctrl-blk" style="margin-bottom:13px">
              <div class="ctrl-lbl" style="margin-bottom:4px">Periodicity</div>
              <select class="ctrl-sel" id="exp-period" onchange="buildExpChart()">
                <option>YEARLY</option><option>QUARTERLY</option><option>MONTHLY</option>
              </select>
            </div>
            <!-- Date Attribute -->
            <div class="ctrl-blk" style="margin-bottom:13px">
              <div class="ctrl-lbl" style="margin-bottom:4px">Date Attribute</div>
              <select class="ctrl-sel" id="exp-dateattr">
                <option>Bidding Date</option><option>Issue Date</option><option>Maturity Date</option><option>Allotment Date</option>
              </select>
            </div>
            <!-- Filter by Dimension -->
            <div class="ctrl-blk">
              <div class="ctrl-lbl" style="margin-bottom:4px">Filter by Dimension</div>
              <select class="ctrl-sel" id="exp-dim">
                <option>All Dimensions</option><option>NSE EBP</option><option>RBI</option><option>SEBI</option>
              </select>
            </div>
          </div>

          <!-- RIGHT CONTENT: scrollable -->
          <div class="scroll" id="det-scroll" style="flex:1;overflow-y:auto;padding:14px 18px 40px;display:flex;flex-direction:column;gap:10px">

            <!-- ① OVERVIEW CARD: identity + desc + dataset info (left) | KPI stats (right) -->
            <div class="card" style="display:grid;grid-template-columns:1fr 260px;overflow:hidden;flex-shrink:0">

              <!-- Left: slug, title, tags, description, dataset info below -->
              <div style="padding:12px 16px 0;border-right:1px solid var(--bdr);display:flex;flex-direction:column">
                <div style="font-family:var(--mo);font-size:9.5px;color:var(--tx3);letter-spacing:.04em;margin-bottom:4px" id="det-slug">—</div>
                <div style="font-size:14px;font-weight:700;color:var(--tx);letter-spacing:-.3px;line-height:1.3;margin-bottom:7px" id="det-title">—</div>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px" id="det-tags"></div>
                <div style="font-size:12px;color:var(--tx2);line-height:1.65;margin-bottom:10px" id="det-desc">—</div>
                <!-- Dataset Info below description with a separator -->
                <div style="border-top:1px solid var(--bdr);padding-top:8px;padding-bottom:12px;margin-top:auto">
                  <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);margin-bottom:5px">Dataset Info</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
                    <div class="ir" style="padding:4px 0;border-right:1px solid var(--bdr);padding-right:10px"><span class="ik">Dataset ID</span><span class="iv" id="meta-id" style="font-family:var(--mo);font-size:10px;word-break:break-all">—</span></div>
                    <div class="ir" style="padding:4px 0 4px 10px"><span class="ik">Source</span><span class="iv" id="meta-src">—</span></div>
                    <div class="ir" style="padding:4px 0;border-right:1px solid var(--bdr);padding-right:10px"><span class="ik">Category</span><span class="iv" id="meta-cat">—</span></div>
                    <div class="ir" style="padding:4px 0 4px 10px"><span class="ik">Frequency</span><span class="iv" id="meta-freq">—</span></div>
                    <div class="ir" style="padding:4px 0;border-right:1px solid var(--bdr);padding-right:10px"><span class="ik">Metrics</span><span class="iv" id="meta-metrics">—</span></div>
                    <div class="ir" style="padding:4px 0 4px 10px"><span class="ik">Dimensions</span><span class="iv" id="meta-dims">—</span></div>
                    <div class="ir" style="padding:4px 0;border-right:1px solid var(--bdr);padding-right:10px;border-bottom:none"><span class="ik">Date Attrs</span><span class="iv" id="meta-dateattrs">—</span></div>
                    <div class="ir" style="padding:4px 0 4px 10px;border-bottom:none"><span class="ik">Last Updated</span><span class="iv" id="det-meta-updated2">—</span></div>
                  </div>
                </div>
                <!-- hidden stubs for openDetail JS -->
                <span style="display:none" id="det-meta-src"></span><span style="display:none" id="det-meta-freq"></span>
                <span style="display:none" id="det-meta-cat"></span><span style="display:none" id="det-meta-metrics"></span>
                <span style="display:none" id="det-meta-dims"></span><span style="display:none" id="det-meta-updated"></span>
                <span style="display:none" id="det-schema-inline"></span>
              </div>

              <!-- Right: 4 KPI stats — live, updated by buildExpChart() -->
              <div style="display:flex;flex-direction:column">
                <div style="padding:7px 14px;border-bottom:1px solid var(--bdr);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--tx3);background:var(--sf2)">Key Metrics</div>
                <!-- Total -->
                <div style="padding:9px 14px;border-bottom:1px solid var(--bdr)">
                  <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tx3);margin-bottom:2px">Total</div>
                  <div style="font-size:16px;font-weight:800;font-family:var(--mo);color:var(--tx);line-height:1.1" id="kpi-total">—</div>
                  <div style="font-size:9.5px;color:var(--tx3);margin-top:2px" id="kpi-total-sub">INR_CR</div>
                </div>
                <!-- Peak -->
                <div style="padding:9px 14px;border-bottom:1px solid var(--bdr)">
                  <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tx3);margin-bottom:2px">Peak</div>
                  <div style="font-size:16px;font-weight:800;font-family:var(--mo);color:var(--tx);line-height:1.1" id="kpi-peak">—</div>
                  <div style="font-size:9.5px;color:var(--tx3);margin-top:2px" id="kpi-peak-sub">Highest period</div>
                </div>
                <!-- Average -->
                <div style="padding:9px 14px;border-bottom:1px solid var(--bdr)">
                  <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tx3);margin-bottom:2px">Average</div>
                  <div style="font-size:16px;font-weight:800;font-family:var(--mo);color:var(--tx);line-height:1.1" id="kpi-avg">—</div>
                  <div style="font-size:9.5px;color:var(--tx3);margin-top:2px" id="kpi-avg-sub">Per period</div>
                </div>
                <!-- Latest Point -->
                <div style="padding:9px 14px">
                  <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tx3);margin-bottom:2px">Latest Point</div>
                  <div style="font-size:16px;font-weight:800;font-family:var(--mo);color:var(--tx);line-height:1.1" id="kpi-pts">—</div>
                  <div style="font-size:9.5px;color:var(--tx3);margin-top:2px" id="kpi-pts-sub">Most recent</div>
                </div>
              </div>
            </div>

            <!-- ② CHART CARD: time range inline + filter bar + chart — all tightly coupled -->
            <div class="card" style="flex-shrink:0">

              <!-- Chart header: title/sub left | chart-type toggle + total right -->
              <div style="padding:10px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;gap:12px">
                <div>
                  <div style="font-size:13px;font-weight:700;color:var(--tx)" id="exp-chart-title">Chart</div>
                  <div style="font-size:10.5px;color:var(--tx3);margin-top:1px" id="exp-chart-sub">SUM(base_issue_size) · YEARLY</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <span style="font-size:11.5px;font-weight:600;color:var(--tx2)" id="exp-chart-total">—</span>
                  <div class="ct-row">
                    <div class="ct-b on" onclick="setExpCT('line',this)">Line</div>
                    <div class="ct-b"    onclick="setExpCT('area',this)">Area</div>
                    <div class="ct-b"    onclick="setExpCT('bar',this)">Bar</div>
                    <div class="ct-b"    onclick="setExpCT('pie',this)">Pie</div>
                  </div>
                </div>
              </div>


              <!-- Filter bar: always-visible time range + chips + expandable dimension filter -->
              <div style="border-bottom:1px solid var(--bdr);background:var(--sf2)">

                <!-- Row 1: Time Range — always visible, directly drives chart -->
                <div style="padding:7px 16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;border-bottom:1px solid var(--bdr)">
                  <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tx3);white-space:nowrap;min-width:76px">Time Range</span>
                  <div class="ctrl-dates">
                    <input type="date" class="ctrl-date" value="2023-01-01" id="exp-from" style="height:26px;font-size:11px;padding:0 7px">
                    <span class="ctrl-sep">–</span>
                    <input type="date" class="ctrl-date" value="2025-12-31" id="exp-to" style="height:26px;font-size:11px;padding:0 7px">
                  </div>
                  <div style="display:flex;gap:4px">
                    <div class="btn btn-xs btn-ghost" onclick="setQuickRange('1y')">1Y</div>
                    <div class="btn btn-xs btn-ghost" onclick="setQuickRange('2y')">2Y</div>
                    <div class="btn btn-xs btn-ghost" onclick="setQuickRange('3y')">3Y</div>
                    <div class="btn btn-xs btn-ghost" onclick="setQuickRange('all')">All</div>
                  </div>
                </div>

                <!-- Row 2: Active chips + Add Filter + Clear + Presets -->
                <div style="padding:7px 16px;display:flex;align-items:center;gap:7px;flex-wrap:wrap;min-height:36px">
                  <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--tx3);flex-shrink:0">Filters</span>
                  <div id="det-active-chips" style="display:flex;gap:5px;flex-wrap:wrap;flex:1;align-items:center"></div>
                  <div style="display:flex;align-items:center;gap:5px;flex-shrink:0">
                    <span style="font-size:9.5px;color:var(--tx3)">Presets:</span>
                    <button class="btn btn-xs btn-ghost" onclick="applyPreset('aaa')" style="font-size:10px">AAA Only</button>
                    <button class="btn btn-xs btn-ghost" onclick="applyPreset('highyield')" style="font-size:10px">High Yield</button>
                    <button class="btn btn-xs btn-ghost" onclick="applyPreset('gsec')" style="font-size:10px">G-Sec</button>
                  </div>
                </div>

                <!-- Row 3: Expandable dimension filter form + Apply -->
                <div id="det-filter-form" style="display:none;padding:8px 16px 10px;border-top:1px solid var(--bdr)">
                  <div style="display:grid;grid-template-columns:150px 100px 1fr auto auto;gap:7px;align-items:end">
                    <div>
                      <div class="ctrl-lbl" style="margin-bottom:3px">Dimension</div>
                      <select class="ctrl-sel" id="flt-dim" onchange="updateFilterOps()" style="height:28px;font-size:11px;padding:0 7px">
                        <option value="metric">Metric</option><option value="periodicity">Periodicity</option>
                        <option value="source">Source</option><option value="rating">Rating</option>
                        <option value="year">Year</option><option value="ytm">YTM (%)</option><option value="tenure">Tenure (yr)</option>
                      </select>
                    </div>
                    <div>
                      <div class="ctrl-lbl" style="margin-bottom:3px">Operator</div>
                      <select class="ctrl-sel" id="flt-op" style="height:28px;font-size:11px;padding:0 7px">
                        <option value="=">=</option><option value="≥">≥</option><option value="≤">≤</option><option value="contains">contains</option>
                      </select>
                    </div>
                    <div>
                      <div class="ctrl-lbl" style="margin-bottom:3px">Value</div>
                      <input class="ctrl-sel" id="flt-val" type="text" placeholder="e.g. AAA, 2025, 7.5" style="height:28px;font-size:11px;padding:0 8px;width:100%">
                    </div>
                    <button class="btn btn-xs btn-primary" onclick="addFilter()" style="height:28px;white-space:nowrap">+ Add</button>
                    <button class="btn btn-sm btn-primary" onclick="buildExpChart()" style="height:28px;white-space:nowrap;font-weight:600">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Apply
                    </button>
                  </div>
                </div>

                <div id="exp-filter-summary" style="display:none;padding:5px 16px 7px;font-size:11px;color:var(--tx3)"></div>
              </div>

              <!-- Canvas -->
              <div style="padding:12px 16px 10px"><canvas id="c-explore" height="230"></canvas></div>
            </div>

            <!-- ④ RESULTS — separate card -->
            <div class="results-card">
              <div class="results-head">
                <div class="results-title">Results</div>
                <div class="results-cnt" id="res-count">8 rows</div>
                <div class="results-pg" style="margin-left:auto">Page 1 of 1</div>
              </div>
              <div class="tw"><table>
                <thead><tr>
                  <th style="width:32px">#</th><th>PERIOD</th><th class="R">VALUE (INR_CR)</th>
                  <th>METRIC</th><th>PERIODICITY</th><th>DATASET</th>
                </tr></thead>
                <tbody id="exp-tbl-body">
                  <tr><td class="hh">1</td><td><strong>2019</strong></td><td class="nb R">112.4K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt" id="exp-tbl-ds">—</td></tr>
                  <tr><td class="hh">2</td><td><strong>2020</strong></td><td class="nb R">98.6K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                  <tr><td class="hh">3</td><td><strong>2021</strong></td><td class="nb R">124.5K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                  <tr><td class="hh">4</td><td><strong>2022</strong></td><td class="nb R">168.2K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                  <tr><td class="hh">5</td><td><strong>2023</strong></td><td class="nb R">192.8K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                  <tr><td class="hh">6</td><td><strong>2024</strong></td><td class="nb R">184.6K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                  <tr><td class="hh">7</td><td><strong>2025</strong></td><td class="nb R">203.2K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                  <tr><td class="hh">8</td><td><strong>2026</strong></td><td class="nb R">69.4K</td><td class="mt">base_issue_size</td><td class="mt">YEARLY</td><td class="mt">—</td></tr>
                </tbody>
              </table></div>
              <div class="results-foot">
                <span style="font-size:11.5px;color:var(--tx3)" id="res-foot-label">1–8 of 8</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="pg-wrap">
                    <div class="pg-b"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></div>
                    <div class="pg-b on">1</div>
                    <div class="pg-b"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>
                  </div>
                  <div class="rpp">Rows: <select><option>25</option><option>50</option><option>100</option></select></div>
                </div>
              </div>
            </div>

          </div><!-- /right content -->
        </div><!-- /body -->
      </div>
    </div><!-- /page-detail -->
    <!-- ═══════════════════════════════════
         REFERENCE DATA
    ═══════════════════════════════════ -->
    <div class="page" id="page-ref">
      <div class="ref-layout" style="flex:1;overflow:hidden">
        <div class="ref-subnav">
          <div class="ref-subnav-head"><div class="ref-subnav-title">Reference Data</div><div class="ref-subnav-sub">Master data &amp; lookups</div></div>
          <div class="ref-grp">Securities</div>
          <div class="ref-ni on" id="rni-issuers" onclick="showRef('issuers',this)"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>Issuers</div>
          <div class="ref-ni"    id="rni-ratings" onclick="showRef('ratings',this)"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Ratings</div>
          <div class="ref-ni"    id="rni-curves"  onclick="showRef('curves',this)"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Yield Curves</div>
          <div class="ref-grp">Calendar</div>
          <div class="ref-ni" id="rni-holidays" onclick="showRef('holidays',this)"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Holidays &amp; Calendars</div>
          <div class="ref-grp">Indices</div>
          <div class="ref-ni" id="rni-indices" onclick="showRef('indices',this)"><svg viewBox="0 0 24 24"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>Bond Indices</div>
        </div>
        <div class="ref-main">

          <div class="ref-sub on" id="refp-issuers">
            <div class="ref-page-title">Issuers</div><div class="ref-page-sub">Reference data for all bond issuers — 284 entities</div>
            <div class="fbar"><span class="fbar-lbl">Type:</span><div class="chip on">All</div><div class="chip">PSU Bank</div><div class="chip">Private Bank</div><div class="chip">NBFC</div><div class="chip">Infra</div></div>
            <div class="card"><div class="tw"><table><thead><tr><th>Issuer Name</th><th>Type</th><th>Sector</th><th class="R">Rating</th><th class="R">Active Bonds</th><th class="R">Total Issuance</th><th class="R">Status</th></tr></thead><tbody>
              <tr><td class="nm">State Bank of India</td><td style="color:var(--tx3)">PSU Bank</td><td style="color:var(--tx3)">Banking</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R mo">12</td><td class="R mo">₹28,400 Cr</td><td class="R"><span class="sp sp-live">Active</span></td></tr>
              <tr><td class="nm">HDFC Bank Ltd</td><td style="color:var(--tx3)">Private Bank</td><td style="color:var(--tx3)">Banking</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R mo">8</td><td class="R mo">₹14,200 Cr</td><td class="R"><span class="sp sp-live">Active</span></td></tr>
              <tr><td class="nm">IRFC</td><td style="color:var(--tx3)">Infra Fin</td><td style="color:var(--tx3)">Infrastructure</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R mo">24</td><td class="R mo">₹42,000 Cr</td><td class="R"><span class="sp sp-live">Active</span></td></tr>
              <tr><td class="nm">Bajaj Finance Ltd</td><td style="color:var(--tx3)">NBFC</td><td style="color:var(--tx3)">Finance</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R mo">18</td><td class="R mo">₹18,600 Cr</td><td class="R"><span class="sp sp-live">Active</span></td></tr>
              <tr><td class="nm">Tata Capital</td><td style="color:var(--tx3)">NBFC</td><td style="color:var(--tx3)">Finance</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R mo">10</td><td class="R mo">₹9,800 Cr</td><td class="R"><span class="sp sp-live">Active</span></td></tr>
              <tr><td class="nm">REC Ltd</td><td style="color:var(--tx3)">PSU</td><td style="color:var(--tx3)">Power</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R mo">16</td><td class="R mo">₹32,100 Cr</td><td class="R"><span class="sp sp-live">Active</span></td></tr>
            </tbody></table></div><div class="tbl-foot">Showing 6 of 284 issuers<div style="margin-left:auto;display:flex;gap:5px"><div class="btn btn-xs">← Prev</div><div class="btn btn-xs btn-primary">Next →</div></div></div></div>
          </div>

          <div class="ref-sub" id="refp-ratings">
            <div class="ref-page-title">Ratings</div><div class="ref-page-sub">Current vs previous credit ratings &mdash; CRISIL, ICRA, CARE</div>
            <div class="g4" style="margin-bottom:12px">
              <div class="kpi"><div class="kpi-l">AAA Issuers</div><div class="kpi-v">148</div><div class="kpi-d ne">of 3,800</div></div>
              <div class="kpi"><div class="kpi-l">Upgrades YTD</div><div class="kpi-v">42</div><div class="kpi-d up">&#x25B2; +8 vs last yr</div></div>
              <div class="kpi"><div class="kpi-l">Downgrades YTD</div><div class="kpi-v">29</div><div class="kpi-d dn">&#x25BC; &minus;3 vs last yr</div></div>
              <div class="kpi"><div class="kpi-l">On Watch</div><div class="kpi-v">17</div><div class="kpi-d ne">negative outlook</div></div>
            </div>
            <div class="card"><div class="tw"><table><thead><tr>
              <th>Issuer</th><th class="R">CRISIL</th><th class="R">Prev</th><th class="R">ICRA</th><th class="R">Prev</th><th class="R">CARE</th><th class="R">Prev</th><th class="R">Updated</th><th class="R">Change</th><th class="R">Outlook</th>
            </tr></thead><tbody>
              <tr><td class="nm">State Bank of India</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AAA</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AAA</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AAA</td><td class="R ne">Jan 2026</td><td class="R"><span style="background:var(--sf2);color:var(--tx3);font-family:var(--mo);font-size:9px;padding:1px 5px;border-radius:3px;font-weight:600">NC</span></td><td class="R up">Stable</td></tr>
              <tr><td class="nm">HDFC Bank</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AAA</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AAA</td><td class="R"><span class="rb rb-aaa">AAA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AAA</td><td class="R ne">Feb 2026</td><td class="R"><span style="background:var(--sf2);color:var(--tx3);font-family:var(--mo);font-size:9px;padding:1px 5px;border-radius:3px;font-weight:600">NC</span></td><td class="R up">Stable</td></tr>
              <tr><td class="nm">Bajaj Finance</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA</td><td class="R ne">Dec 2025</td><td class="R"><span style="background:rgba(45,138,78,.1);color:var(--green);font-family:var(--mo);font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700">&#x2191; Up</span></td><td class="R up">Positive</td></tr>
              <tr><td class="nm">Tata Capital</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA+</td><td class="R"><span class="rb rb-aa">AA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA+</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA+</td><td class="R ne">Jan 2026</td><td class="R"><span style="background:rgba(192,57,43,.1);color:var(--red);font-family:var(--mo);font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700">&#x2193; ICRA Dn</span></td><td class="R" style="color:var(--amber)">Watch</td></tr>
              <tr><td class="nm">Shriram Finance</td><td class="R"><span class="rb rb-aa">AA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA-</td><td class="R"><span class="rb rb-aa">AA-</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA-</td><td class="R"><span class="rb rb-aa">AA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA-</td><td class="R ne">Feb 2026</td><td class="R"><span style="background:rgba(45,138,78,.1);color:var(--green);font-family:var(--mo);font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700">&#x2191; CRISIL Up</span></td><td class="R up">Positive</td></tr>
              <tr><td class="nm">Adani Ports</td><td class="R"><span class="rb rb-aa">AA+</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA</td><td class="R"><span class="rb rb-aa">AA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA</td><td class="R"><span class="rb rb-aa">AA</span></td><td class="R" style="color:var(--tx3);font-family:var(--mo);font-size:10px">AA</td><td class="R ne">Jan 2026</td><td class="R"><span style="background:rgba(45,138,78,.1);color:var(--green);font-family:var(--mo);font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700">&#x2191; CRISIL Up</span></td><td class="R up">Stable</td></tr>
            </tbody></table></div>
            <div class="tbl-foot">NC = No Change &nbsp;&middot;&nbsp; Prev = rating as of Sep 2025 &nbsp;&middot;&nbsp; Sources: CRISIL, ICRA, CARE</div>
            </div>
          </div>

<div class="ref-sub" id="refp-curves">
            <div class="ref-page-title">Yield Curves</div><div class="ref-page-sub">FBIL benchmark zero-coupon yield curves</div>
            <div class="g4" style="margin-bottom:12px">
              <div class="kpi"><div class="kpi-l">10Y G-Sec</div><div class="kpi-v">7.24%</div><div class="kpi-d dn">▲ +3 bps</div></div>
              <div class="kpi"><div class="kpi-l">5Y G-Sec</div><div class="kpi-v">7.08%</div><div class="kpi-d dn">▲ +2 bps</div></div>
              <div class="kpi"><div class="kpi-l">2Y G-Sec</div><div class="kpi-v">7.05%</div><div class="kpi-d dn">▲ +1 bps</div></div>
              <div class="kpi"><div class="kpi-l">Slope 2–10Y</div><div class="kpi-v">19 bps</div><div class="kpi-d up">▼ −1 bps</div></div>
            </div>
            <div class="card"><div style="padding:11px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:8px"><div style="font-size:12.5px;font-weight:600;color:var(--tx)">FBIL Yield Curve</div><div style="display:flex;gap:5px;margin-left:auto"><div class="chip on" style="font-size:10.5px;padding:2px 7px">Today</div><div class="chip" style="font-size:10.5px;padding:2px 7px">1M ago</div><div class="chip" style="font-size:10.5px;padding:2px 7px">1Y ago</div></div></div><div class="cp"><canvas id="c-refyc" height="220"></canvas></div></div>
          </div>

          <div class="ref-sub" id="refp-holidays">
            <div class="ref-page-title">Holidays &amp; Calendars</div><div class="ref-page-sub">NSE, BSE, RBI settlement calendars — 2026</div>
            <div class="card"><div class="tw"><table><thead><tr><th>Date</th><th>Holiday</th><th>Exchange</th><th>Settlement Impact</th></tr></thead><tbody>
              <tr><td class="mo">14 Apr 2026</td><td class="nm">Dr. Ambedkar Jayanti</td><td style="color:var(--tx3)">NSE, BSE, RBI</td><td style="color:var(--tx3)">T+1 → 15 Apr</td></tr>
              <tr><td class="mo">01 May 2026</td><td class="nm">Maharashtra Day</td><td style="color:var(--tx3)">NSE, BSE</td><td style="color:var(--tx3)">T+1 → 04 May</td></tr>
              <tr><td class="mo">15 Aug 2026</td><td class="nm">Independence Day</td><td style="color:var(--tx3)">NSE, BSE, RBI</td><td style="color:var(--tx3)">T+1 → 18 Aug</td></tr>
              <tr><td class="mo">02 Oct 2026</td><td class="nm">Gandhi Jayanti</td><td style="color:var(--tx3)">NSE, BSE, RBI</td><td style="color:var(--tx3)">T+1 → 05 Oct</td></tr>
            </tbody></table></div></div>
          </div>

          <div class="ref-sub" id="refp-indices">
            <div class="ref-page-title">Bond Indices</div><div class="ref-page-sub">CRISIL, NSE and SEBI bond indices</div>
            <div class="card"><div class="tw"><table><thead><tr><th>Index Name</th><th>Provider</th><th class="R">Constituents</th><th class="R">Avg Duration</th><th class="R">Avg YTM</th><th class="R">Last Updated</th></tr></thead><tbody>
              <tr><td class="nm">CRISIL Composite Bond Index</td><td style="color:var(--tx3)">CRISIL</td><td class="R mo">184</td><td class="R mo">4.8 yr</td><td class="R up">7.42%</td><td class="R ne">24 Mar 2026</td></tr>
              <tr><td class="nm">NSE G-Sec Index</td><td style="color:var(--tx3)">NSE</td><td class="R mo">42</td><td class="R mo">8.2 yr</td><td class="R up">7.28%</td><td class="R ne">24 Mar 2026</td></tr>
              <tr><td class="nm">SEBI Corporate Bond Index</td><td style="color:var(--tx3)">SEBI</td><td class="R mo">320</td><td class="R mo">3.6 yr</td><td class="R up">7.84%</td><td class="R ne">24 Mar 2026</td></tr>
            </tbody></table></div></div>
          </div>

        </div>
      </div>
    </div>

  </div><!-- /pages -->
</div><!-- /body -->

<!-- MOBILE FILTERS PANEL -->
<div class="slide-panel" id="panel-filters" style="width:320px">
  <div class="panel-head">
    <div class="panel-title">Filters</div>
  </div>
  <div class="panel-body" style="padding:0">
    <div style="padding:14px 16px;border-bottom:1px solid var(--bdr)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:10px">Status</div>
      <div class="status-seg" style="display:flex;gap:4px">
        <div class="seg-opt on" id="st-all-mob" onclick="setStatus('all',this);document.getElementById('st-all')?.click()">All</div>
        <div class="seg-opt" id="st-active-mob" onclick="setStatus('active',this);document.getElementById('st-active')?.click()">Active</div>
        <div class="seg-opt" id="st-inactive-mob" onclick="setStatus('inactive',this);document.getElementById('st-inactive')?.click()">Inactive</div>
      </div>
    </div>
    <div style="padding:14px 16px;border-bottom:1px solid var(--bdr)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:10px">Source</div>
      <div id="mob-src-filters" style="display:flex;flex-direction:column;gap:2px">
        <div class="src-row on" onclick="setSrc('all',this);document.getElementById('src-all')?.classList.add('on')"><span class="src-label">All Sources</span><span class="src-count" id="mob-src-count-all">—</span></div>
      </div>
    </div>
    <div style="padding:14px 16px;border-bottom:1px solid var(--bdr)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:10px">Frequency</div>
      <div style="display:flex;flex-direction:column;gap:2px">
        <div class="src-row on" onclick="setFreq('all',this);document.getElementById('freq-all')?.click()"><span class="src-label">All</span><span class="src-count" id="mob-freq-count-all">—</span></div>
        <div class="src-row" onclick="setFreq('daily',this);document.getElementById('freq-daily')?.click()"><span class="src-label">Daily</span><span class="src-count" id="mob-freq-count-daily">—</span></div>
        <div class="src-row" onclick="setFreq('weekly',this);document.getElementById('freq-weekly')?.click()"><span class="src-label">Weekly</span><span class="src-count" id="mob-freq-count-weekly">—</span></div>
        <div class="src-row" onclick="setFreq('monthly',this);document.getElementById('freq-monthly')?.click()"><span class="src-label">Monthly</span><span class="src-count" id="mob-freq-count-monthly">—</span></div>
      </div>
    </div>
    <div style="padding:14px 16px">
      <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="closePanel('filters')">Apply Filters</button>
    </div>
  </div>
</div>

   
  </div>
  <div class="panel-body" style="padding:0">
    <div style="padding:14px 16px;border-bottom:1px solid var(--bdr)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:10px">Source</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <div class="chip on" onclick="addFilter('source','All',this)">All</div>
        <div class="chip" onclick="addFilter('source','SEBI',this)">SEBI</div>
        <div class="chip" onclick="addFilter('source','RBI',this)">RBI</div>
        <div class="chip" onclick="addFilter('source','NSE',this)">NSE</div>
        <div class="chip" onclick="addFilter('source','BSE',this)">BSE</div>
      </div>
    </div>
    <div style="padding:14px 16px;border-bottom:1px solid var(--bdr)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:10px">Asset Type</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <div class="chip on" onclick="addFilter('type','All',this)">All</div>
        <div class="chip" onclick="addFilter('type','G-Sec',this)">G-Sec</div>
        <div class="chip" onclick="addFilter('type','SDL',this)">SDL</div>
        <div class="chip" onclick="addFilter('type','Corp Bond',this)">Corp Bond</div>
        <div class="chip" onclick="addFilter('type','T-Bill',this)">T-Bill</div>
      </div>
    </div>
    <div style="padding:14px 16px;border-bottom:1px solid var(--bdr)">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tx3);margin-bottom:10px">Status</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <div class="chip on" onclick="setStatus('all',this)">All</div>
        <div class="chip" onclick="setStatus('live',this)">Live</div>
        <div class="chip" onclick="setStatus('historical',this)">Historical</div>
      </div>
    </div>
    <div style="padding:14px 16px">
      <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="closePanel('filters')">Apply Filters</button>
    </div>
  </div>
</div>


<!-- MOBILE PIVOT & CHART BUILDER PANEL -->
<div class="slide-panel" id="panel-pivot" style="width:320px">
  <div class="panel-head">
    <div class="panel-title">Pivot &amp; Chart Builder</div>
    <div class="panel-close" onclick="closePanel('pivot')">✕</div>
  </div>
  <div class="panel-body" style="padding:16px 18px 32px">
    <div class="ctrl-blk" style="margin-bottom:14px">
      <div class="ctrl-lbl" style="margin-bottom:5px">Dataset</div>
      <select class="ctrl-sel" id="exp-ds-mob" onchange="document.getElementById('exp-ds').value=this.value;buildExpChart()"><option id="exp-ds-opt-mob">—</option></select>
    </div>
    <div class="ctrl-blk" style="margin-bottom:14px">
      <div class="ctrl-lbl" style="margin-bottom:5px">Metric</div>
      <select class="ctrl-sel" id="exp-metric-mob" onchange="document.getElementById('exp-metric').value=this.value;buildExpChart()">
        <option value="base_issue_size">base_issue_size</option>
        <option value="ytm">ytm</option>
        <option value="clean_price">clean_price</option>
        <option value="volume_cr">volume_cr</option>
        <option value="trade_count">trade_count</option>
      </select>
    </div>
    <div class="ctrl-blk" style="margin-bottom:14px">
      <div class="ctrl-lbl" style="margin-bottom:5px">Aggregation</div>
      <select class="ctrl-sel" id="exp-agg-mob" onchange="document.getElementById('exp-agg').value=this.value;buildExpChart()">
        <option>SUM</option><option>AVG</option><option>COUNT</option><option>MIN</option><option>MAX</option>
      </select>
    </div>
    <div class="ctrl-blk" style="margin-bottom:14px">
      <div class="ctrl-lbl" style="margin-bottom:5px">Periodicity</div>
      <select class="ctrl-sel" id="exp-period-mob" onchange="document.getElementById('exp-period').value=this.value;buildExpChart()">
        <option>YEARLY</option><option>QUARTERLY</option><option>MONTHLY</option>
      </select>
    </div>
    <div class="ctrl-blk" style="margin-bottom:14px">
      <div class="ctrl-lbl" style="margin-bottom:5px">Date Attribute</div>
      <select class="ctrl-sel" id="exp-dateattr-mob" onchange="document.getElementById('exp-dateattr').value=this.value">
        <option>Bidding Date</option><option>Issue Date</option><option>Maturity Date</option><option>Allotment Date</option>
      </select>
    </div>
    <div class="ctrl-blk" style="margin-bottom:20px">
      <div class="ctrl-lbl" style="margin-bottom:5px">Filter by Dimension</div>
      <select class="ctrl-sel" id="exp-dim-mob" onchange="document.getElementById('exp-dim').value=this.value">
        <option>All Dimensions</option><option>NSE EBP</option><option>RBI</option><option>SEBI</option>
      </select>
    </div>
    <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="buildExpChart();closePanel('pivot')">
      Build Chart
    </button>
  </div>
</div>

</div><!-- /app -->
<div id="panel-backdrop" onclick="document.querySelectorAll('.slide-panel').forEach(p=>p.classList.remove('on'));document.querySelectorAll('.tb-btn').forEach(b=>b.classList.remove('lit'));this.classList.remove('on')" style="display:none"></div>

<!-- SOURCE URLS MODAL -->
<div class="modal-ov" id="modal-ov" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <div class="modal-head"><div><div class="modal-title">Source URLs</div><div class="modal-sub" id="modal-ds">—</div></div><div class="modal-x" onclick="closeModal()">✕</div></div>
    <div class="modal-body" id="modal-body"></div>
    <div class="modal-foot"><button class="btn-modal-x" onclick="closeModal()">Close</button></div>
  </div>
</div>

<!-- COMPARE PANEL -->
<div class="slide-panel panel-compare" id="panel-compare">
  <div class="panel-head"><div class="panel-title">Compare Bonds</div>
  
  <div class="panel-close" onclick="closePanel('compare')">✕</div>
  
  
  </div>
  <div class="panel-body">
    <div class="cmp-grid">
      <div style="background:var(--sf2)"><div class="cmp-h" style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3)">Metric</div><div class="cmp-c" style="color:var(--tx2)">Bond Name</div><div class="cmp-c" style="color:var(--tx2)">Rating</div><div class="cmp-c" style="color:var(--tx2)">Clean Price</div><div class="cmp-c" style="color:var(--tx2)">YTM</div><div class="cmp-c" style="color:var(--tx2)">Coupon</div><div class="cmp-c" style="color:var(--tx2)">G-Sec Spread</div><div class="cmp-c" style="color:var(--tx2)">Duration</div><div class="cmp-c" style="color:var(--tx2);border-bottom:none">Maturity</div></div>
      <div class="cmp-data-c"><div class="cmp-h"><div style="font-size:12px;font-weight:700;color:var(--tx)">SBI 7.45% 2030</div><span class="rb rb-aaa">AAA</span></div><div class="cmp-c">SBI NCD 2030</div><div class="cmp-c"><span class="rb rb-aaa">AAA/Stable</span></div><div class="cmp-c">99.82</div><div class="cmp-c" style="color:var(--green)">7.48%</div><div class="cmp-c">7.45%</div><div class="cmp-c">122 bps</div><div class="cmp-c">5.61 yr</div><div class="cmp-c" style="border-bottom:none">Jun 2030</div></div>
      <div class="cmp-data-c"><div class="cmp-h"><div style="font-size:12px;font-weight:700;color:var(--tx)">HDFC 8.10% 2027</div><span class="rb rb-aaa">AAA</span></div><div class="cmp-c">HDFC Bank NCD</div><div class="cmp-c"><span class="rb rb-aaa">AAA/Stable</span></div><div class="cmp-c">100.45</div><div class="cmp-c" style="color:var(--red)">7.92%</div><div class="cmp-c">8.10%</div><div class="cmp-c" style="color:var(--amber)">168 bps</div><div class="cmp-c">3.05 yr</div><div class="cmp-c" style="border-bottom:none">Aug 2027</div></div>
    </div>
    <div style="margin-top:12px"><canvas id="c-cmp" height="170"></canvas></div>
  </div>
</div>

<!-- WATCHLIST PANEL -->
<div class="slide-panel panel-watchlist" id="panel-watchlist">
  <div class="panel-head"><div class="panel-title">Watchlist <span style="font-size:11px;color:var(--tx3);font-weight:400;margin-left:5px">7 bonds</span></div><div class="panel-close" onclick="closePanel('watchlist')">✕</div></div>
  <div class="panel-body">
    <div style="font-size:10.5px;color:var(--tx3);margin-bottom:10px">Updated 2 min ago</div>
    <div class="wl-p-row"><div class="wl-p-dot" style="background:var(--green)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">SBI 7.45% 2030</div><div style="font-size:10px;color:var(--tx3)">INE062A08168 · AAA · NCD</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--green)">7.48%</div><div style="font-size:9.5px;color:var(--green)">▲ +2 bps</div></div></div>
    <div class="wl-p-row"><div class="wl-p-dot" style="background:var(--red)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">HDFC Bank 8.10% 2027</div><div style="font-size:10px;color:var(--tx3)">INE040A08534 · AAA · NCD</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--red)">8.10%</div><div style="font-size:9.5px;color:var(--red)">▼ −6 bps</div></div></div>
    <div class="wl-p-row"><div class="wl-p-dot" style="background:var(--green)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">GOI 6.54% 2032</div><div style="font-size:10px;color:var(--tx3)">IN0020210053 · SOV · G-Sec</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--green)">7.24%</div><div style="font-size:9.5px;color:var(--green)">▲ +3 bps</div></div></div>
    <div class="wl-p-row"><div class="wl-p-dot" style="background:var(--amber)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">REC 7.75% 2026</div><div style="font-size:10px;color:var(--tx3)">INE020B08BJ0 · AAA · Infra</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--tx2)">7.75%</div><div style="font-size:9.5px;color:var(--tx3)">─ flat</div></div></div>
    <div class="wl-p-row"><div class="wl-p-dot" style="background:var(--green)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">IRFC 7.34% 2033</div><div style="font-size:10px;color:var(--tx3)">INE053F09HF6 · AAA · Infra</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--green)">7.68%</div><div style="font-size:9.5px;color:var(--green)">▲ +5 bps</div></div></div>
    <div class="wl-p-row"><div class="wl-p-dot" style="background:var(--green)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">PFC 7.50% 2029</div><div style="font-size:10px;color:var(--tx3)">INE134E08KA3 · AAA · PSU</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--tx2)">7.65%</div><div style="font-size:9.5px;color:var(--tx3)">─ flat</div></div></div>
    <div class="wl-p-row" style="border-bottom:none"><div class="wl-p-dot" style="background:var(--blue)"></div><div style="flex:1"><div style="font-weight:600;font-size:12.5px;color:var(--tx)">GOI 7.18% 2037</div><div style="font-size:10px;color:var(--tx3)">IN0020230017 · SOV · G-Sec</div></div><div style="text-align:right"><div style="font-family:var(--mo);font-size:12.5px;font-weight:500;color:var(--tx2)">7.20%</div><div style="font-size:9.5px;color:var(--tx3)">─ flat</div></div></div>
    <div style="margin-top:14px"><button class="btn btn-primary" style="width:100%;justify-content:center">+ Add Bond to Watchlist</button></div>
  </div>
</div>`;
export default dashboardHTML;