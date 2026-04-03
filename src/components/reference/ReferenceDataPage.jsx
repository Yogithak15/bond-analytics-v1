import React from 'react';

export default function ReferenceDataPage() {
  return (
    <div className="page" id="page-ref">
      <div className="ref-layout" style={{flex:1,overflow:'hidden'}}>
        <div className="ref-subnav">
          <div className="ref-subnav-head"><div className="ref-subnav-title">Reference Data</div><div className="ref-subnav-sub">Master data &amp; lookups</div></div>
          <div className="ref-grp">Securities</div>
          <div className="ref-ni on" id="rni-issuers" onClick={() => window.showRef('issuers',this)}>
            <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>Issuers
          </div>
          <div className="ref-ni" id="rni-ratings" onClick={() => window.showRef('ratings',this)}>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Ratings
          </div>
          <div className="ref-ni" id="rni-curves" onClick={() => window.showRef('curves',this)}>
            <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Yield Curves
          </div>
          <div className="ref-grp">Calendar</div>
          <div className="ref-ni" id="rni-holidays" onClick={() => window.showRef('holidays',this)}>
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Holidays &amp; Calendars
          </div>
          <div className="ref-grp">Indices</div>
          <div className="ref-ni" id="rni-indices" onClick={() => window.showRef('indices',this)}>
            <svg viewBox="0 0 24 24"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>Bond Indices
          </div>
        </div>
        <div className="ref-main">

          <div className="ref-sub on" id="refp-issuers">
            <div className="ref-page-title">Issuers</div>
            <div className="ref-page-sub">Reference data for all bond issuers — 284 entities</div>
            <div className="fbar"><span className="fbar-lbl">Type:</span><div className="chip on">All</div><div className="chip">PSU Bank</div><div className="chip">Private Bank</div><div className="chip">NBFC</div><div className="chip">Infra</div></div>
            <div className="card">
              <div className="tw">
                <table>
                  <thead><tr><th>Issuer Name</th><th>Type</th><th>Sector</th><th className="R">Rating</th><th className="R">Active Bonds</th><th className="R">Total Issuance</th><th className="R">Status</th></tr></thead>
                  <tbody>
                    <tr><td className="nm">State Bank of India</td><td style={{color:'var(--tx3)'}}>PSU Bank</td><td style={{color:'var(--tx3)'}}>Banking</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R mo">12</td><td className="R mo">&#x20B9;28,400 Cr</td><td className="R"><span className="sp sp-live">Active</span></td></tr>
                    <tr><td className="nm">HDFC Bank Ltd</td><td style={{color:'var(--tx3)'}}>Private Bank</td><td style={{color:'var(--tx3)'}}>Banking</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R mo">8</td><td className="R mo">&#x20B9;14,200 Cr</td><td className="R"><span className="sp sp-live">Active</span></td></tr>
                    <tr><td className="nm">IRFC</td><td style={{color:'var(--tx3)'}}>Infra Fin</td><td style={{color:'var(--tx3)'}}>Infrastructure</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R mo">24</td><td className="R mo">&#x20B9;42,000 Cr</td><td className="R"><span className="sp sp-live">Active</span></td></tr>
                    <tr><td className="nm">Bajaj Finance Ltd</td><td style={{color:'var(--tx3)'}}>NBFC</td><td style={{color:'var(--tx3)'}}>Finance</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R mo">18</td><td className="R mo">&#x20B9;18,600 Cr</td><td className="R"><span className="sp sp-live">Active</span></td></tr>
                    <tr><td className="nm">Tata Capital</td><td style={{color:'var(--tx3)'}}>NBFC</td><td style={{color:'var(--tx3)'}}>Finance</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R mo">10</td><td className="R mo">&#x20B9;9,800 Cr</td><td className="R"><span className="sp sp-live">Active</span></td></tr>
                    <tr><td className="nm">REC Ltd</td><td style={{color:'var(--tx3)'}}>PSU</td><td style={{color:'var(--tx3)'}}>Power</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R mo">16</td><td className="R mo">&#x20B9;32,100 Cr</td><td className="R"><span className="sp sp-live">Active</span></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="tbl-foot">Showing 6 of 284 issuers<div style={{marginLeft:'auto',display:'flex',gap:'5px'}}><div className="btn btn-xs">&#x2190; Prev</div><div className="btn btn-xs btn-primary">Next &#x2192;</div></div></div>
            </div>
          </div>

          <div className="ref-sub" id="refp-ratings">
            <div className="ref-page-title">Ratings</div>
            <div className="ref-page-sub">Current vs previous credit ratings &mdash; CRISIL, ICRA, CARE</div>
            <div className="g4" style={{marginBottom:'12px'}}>
              <div className="kpi"><div className="kpi-l">AAA Issuers</div><div className="kpi-v">148</div><div className="kpi-d ne">of 3,800</div></div>
              <div className="kpi"><div className="kpi-l">Upgrades YTD</div><div className="kpi-v">42</div><div className="kpi-d up">&#x25B2; +8 vs last yr</div></div>
              <div className="kpi"><div className="kpi-l">Downgrades YTD</div><div className="kpi-v">29</div><div className="kpi-d dn">&#x25BC; &#x2212;3 vs last yr</div></div>
              <div className="kpi"><div className="kpi-l">On Watch</div><div className="kpi-v">17</div><div className="kpi-d ne">negative outlook</div></div>
            </div>
            <div className="card">
              <div className="tw">
                <table>
                  <thead><tr>
                    <th>Issuer</th><th className="R">CRISIL</th><th className="R">Prev</th><th className="R">ICRA</th><th className="R">Prev</th><th className="R">CARE</th><th className="R">Prev</th><th className="R">Updated</th><th className="R">Change</th><th className="R">Outlook</th>
                  </tr></thead>
                  <tbody>
                    <tr><td className="nm">State Bank of India</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AAA</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AAA</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AAA</td><td className="R ne">Jan 2026</td><td className="R"><span style={{background:'var(--sf2)',color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'9px',padding:'1px 5px',borderRadius:'3px',fontWeight:600}}>NC</span></td><td className="R up">Stable</td></tr>
                    <tr><td className="nm">HDFC Bank</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AAA</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AAA</td><td className="R"><span className="rb rb-aaa">AAA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AAA</td><td className="R ne">Feb 2026</td><td className="R"><span style={{background:'var(--sf2)',color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'9px',padding:'1px 5px',borderRadius:'3px',fontWeight:600}}>NC</span></td><td className="R up">Stable</td></tr>
                    <tr><td className="nm">Bajaj Finance</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA</td><td className="R ne">Dec 2025</td><td className="R"><span style={{background:'rgba(45,138,78,.1)',color:'var(--green)',fontFamily:'var(--mo)',fontSize:'9px',padding:'1px 5px',borderRadius:'3px',fontWeight:700}}>&#x2191; Up</span></td><td className="R up">Positive</td></tr>
                    <tr><td className="nm">Tata Capital</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA+</td><td className="R"><span className="rb rb-aa">AA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA+</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA+</td><td className="R ne">Jan 2026</td><td className="R"><span style={{background:'rgba(192,57,43,.1)',color:'var(--red)',fontFamily:'var(--mo)',fontSize:'9px',padding:'1px 5px',borderRadius:'3px',fontWeight:700}}>&#x2193; ICRA Dn</span></td><td className="R" style={{color:'var(--amber)'}}>Watch</td></tr>
                    <tr><td className="nm">Shriram Finance</td><td className="R"><span className="rb rb-aa">AA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA-</td><td className="R"><span className="rb rb-aa">AA-</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA-</td><td className="R"><span className="rb rb-aa">AA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA-</td><td className="R ne">Feb 2026</td><td className="R"><span style={{background:'rgba(45,138,78,.1)',color:'var(--green)',fontFamily:'var(--mo)',fontSize:'9px',padding:'1px 5px',borderRadius:'3px',fontWeight:700}}>&#x2191; CRISIL Up</span></td><td className="R up">Positive</td></tr>
                    <tr><td className="nm">Adani Ports</td><td className="R"><span className="rb rb-aa">AA+</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA</td><td className="R"><span className="rb rb-aa">AA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA</td><td className="R"><span className="rb rb-aa">AA</span></td><td className="R" style={{color:'var(--tx3)',fontFamily:'var(--mo)',fontSize:'10px'}}>AA</td><td className="R ne">Jan 2026</td><td className="R"><span style={{background:'rgba(45,138,78,.1)',color:'var(--green)',fontFamily:'var(--mo)',fontSize:'9px',padding:'1px 5px',borderRadius:'3px',fontWeight:700}}>&#x2191; CRISIL Up</span></td><td className="R up">Stable</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="tbl-foot">NC = No Change &nbsp;&middot;&nbsp; Prev = rating as of Sep 2025 &nbsp;&middot;&nbsp; Sources: CRISIL, ICRA, CARE</div>
            </div>
          </div>

          <div className="ref-sub" id="refp-curves">
            <div className="ref-page-title">Yield Curves</div>
            <div className="ref-page-sub">FBIL benchmark zero-coupon yield curves</div>
            <div className="g4" style={{marginBottom:'12px'}}>
              <div className="kpi"><div className="kpi-l">10Y G-Sec</div><div className="kpi-v">7.24%</div><div className="kpi-d dn">&#x25B2; +3 bps</div></div>
              <div className="kpi"><div className="kpi-l">5Y G-Sec</div><div className="kpi-v">7.08%</div><div className="kpi-d dn">&#x25B2; +2 bps</div></div>
              <div className="kpi"><div className="kpi-l">2Y G-Sec</div><div className="kpi-v">7.05%</div><div className="kpi-d dn">&#x25B2; +1 bps</div></div>
              <div className="kpi"><div className="kpi-l">Slope 2&#x2013;10Y</div><div className="kpi-v">19 bps</div><div className="kpi-d up">&#x25BC; &#x2212;1 bps</div></div>
            </div>
            <div className="card">
              <div style={{padding:'11px 16px',borderBottom:'1px solid var(--bdr)',display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--tx)'}}>FBIL Yield Curve</div>
                <div style={{display:'flex',gap:'5px',marginLeft:'auto'}}>
                  <div className="chip on" style={{fontSize:'10.5px',padding:'2px 7px'}}>Today</div>
                  <div className="chip" style={{fontSize:'10.5px',padding:'2px 7px'}}>1M ago</div>
                  <div className="chip" style={{fontSize:'10.5px',padding:'2px 7px'}}>1Y ago</div>
                </div>
              </div>
              <div className="cp"><canvas id="c-refyc" height="220"></canvas></div>
            </div>
          </div>

          <div className="ref-sub" id="refp-holidays">
            <div className="ref-page-title">Holidays &amp; Calendars</div>
            <div className="ref-page-sub">NSE, BSE, RBI settlement calendars — 2026</div>
            <div className="card">
              <div className="tw">
                <table>
                  <thead><tr><th>Date</th><th>Holiday</th><th>Exchange</th><th>Settlement Impact</th></tr></thead>
                  <tbody>
                    <tr><td className="mo">14 Apr 2026</td><td className="nm">Dr. Ambedkar Jayanti</td><td style={{color:'var(--tx3)'}}>NSE, BSE, RBI</td><td style={{color:'var(--tx3)'}}>T+1 &#x2192; 15 Apr</td></tr>
                    <tr><td className="mo">01 May 2026</td><td className="nm">Maharashtra Day</td><td style={{color:'var(--tx3)'}}>NSE, BSE</td><td style={{color:'var(--tx3)'}}>T+1 &#x2192; 04 May</td></tr>
                    <tr><td className="mo">15 Aug 2026</td><td className="nm">Independence Day</td><td style={{color:'var(--tx3)'}}>NSE, BSE, RBI</td><td style={{color:'var(--tx3)'}}>T+1 &#x2192; 18 Aug</td></tr>
                    <tr><td className="mo">02 Oct 2026</td><td className="nm">Gandhi Jayanti</td><td style={{color:'var(--tx3)'}}>NSE, BSE, RBI</td><td style={{color:'var(--tx3)'}}>T+1 &#x2192; 05 Oct</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="ref-sub" id="refp-indices">
            <div className="ref-page-title">Bond Indices</div>
            <div className="ref-page-sub">CRISIL, NSE and SEBI bond indices</div>
            <div className="card">
              <div className="tw">
                <table>
                  <thead><tr><th>Index Name</th><th>Provider</th><th className="R">Constituents</th><th className="R">Avg Duration</th><th className="R">Avg YTM</th><th className="R">Last Updated</th></tr></thead>
                  <tbody>
                    <tr><td className="nm">CRISIL Composite Bond Index</td><td style={{color:'var(--tx3)'}}>CRISIL</td><td className="R mo">184</td><td className="R mo">4.8 yr</td><td className="R up">7.42%</td><td className="R ne">24 Mar 2026</td></tr>
                    <tr><td className="nm">NSE G-Sec Index</td><td style={{color:'var(--tx3)'}}>NSE</td><td className="R mo">42</td><td className="R mo">8.2 yr</td><td className="R up">7.28%</td><td className="R ne">24 Mar 2026</td></tr>
                    <tr><td className="nm">SEBI Corporate Bond Index</td><td style={{color:'var(--tx3)'}}>SEBI</td><td className="R mo">320</td><td className="R mo">3.6 yr</td><td className="R up">7.84%</td><td className="R ne">24 Mar 2026</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
