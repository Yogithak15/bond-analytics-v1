import React from 'react';

export default function ComparePanel() {
  return (
    <div className="slide-panel panel-compare" id="panel-compare">
      <div className="panel-head">
        <div className="panel-title">Compare Bonds</div>
        <div className="panel-close" onClick={() => window.closePanel('compare')}>&#x2715;</div>
      </div>
      <div className="panel-body">
        <div className="cmp-grid">
          <div style={{background:'var(--sf2)'}}>
            <div className="cmp-h" style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--tx3)'}}>Metric</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>Bond Name</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>Rating</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>Clean Price</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>YTM</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>Coupon</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>G-Sec Spread</div>
            <div className="cmp-c" style={{color:'var(--tx2)'}}>Duration</div>
            <div className="cmp-c" style={{color:'var(--tx2)',borderBottom:'none'}}>Maturity</div>
          </div>
          <div className="cmp-data-c">
            <div className="cmp-h"><div style={{fontSize:'12px',fontWeight:700,color:'var(--tx)'}}>SBI 7.45% 2030</div><span className="rb rb-aaa">AAA</span></div>
            <div className="cmp-c">SBI NCD 2030</div>
            <div className="cmp-c"><span className="rb rb-aaa">AAA/Stable</span></div>
            <div className="cmp-c">99.82</div>
            <div className="cmp-c" style={{color:'var(--green)'}}>7.48%</div>
            <div className="cmp-c">7.45%</div>
            <div className="cmp-c">122 bps</div>
            <div className="cmp-c">5.61 yr</div>
            <div className="cmp-c" style={{borderBottom:'none'}}>Jun 2030</div>
          </div>
          <div className="cmp-data-c">
            <div className="cmp-h"><div style={{fontSize:'12px',fontWeight:700,color:'var(--tx)'}}>HDFC 8.10% 2027</div><span className="rb rb-aaa">AAA</span></div>
            <div className="cmp-c">HDFC Bank NCD</div>
            <div className="cmp-c"><span className="rb rb-aaa">AAA/Stable</span></div>
            <div className="cmp-c">100.45</div>
            <div className="cmp-c" style={{color:'var(--red)'}}>7.92%</div>
            <div className="cmp-c">8.10%</div>
            <div className="cmp-c" style={{color:'var(--amber)'}}>168 bps</div>
            <div className="cmp-c">3.05 yr</div>
            <div className="cmp-c" style={{borderBottom:'none'}}>Aug 2027</div>
          </div>
        </div>
        <div style={{marginTop:'12px'}}><canvas id="c-cmp" height="170"></canvas></div>
      </div>
    </div>
  );
}
