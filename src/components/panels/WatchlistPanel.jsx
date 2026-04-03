import React from 'react';

export default function WatchlistPanel() {
  return (
    <div className="slide-panel panel-watchlist" id="panel-watchlist">
      <div className="panel-head">
        <div className="panel-title">Watchlist <span style={{fontSize:'11px',color:'var(--tx3)',fontWeight:400,marginLeft:'5px'}}>7 bonds</span></div>
        <div className="panel-close" onClick={() => window.closePanel('watchlist')}>&#x2715;</div>
      </div>
      <div className="panel-body">
        <div style={{fontSize:'10.5px',color:'var(--tx3)',marginBottom:'10px'}}>Updated 2 min ago</div>
        <div className="wl-p-row"><div className="wl-p-dot" style={{background:'var(--green)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>SBI 7.45% 2030</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>INE062A08168 · AAA · NCD</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--green)'}}>7.48%</div><div style={{fontSize:'9.5px',color:'var(--green)'}}>&#x25B2; +2 bps</div></div></div>
        <div className="wl-p-row"><div className="wl-p-dot" style={{background:'var(--red)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>HDFC Bank 8.10% 2027</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>INE040A08534 · AAA · NCD</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--red)'}}>8.10%</div><div style={{fontSize:'9.5px',color:'var(--red)'}}>&#x25BC; &#x2212;6 bps</div></div></div>
        <div className="wl-p-row"><div className="wl-p-dot" style={{background:'var(--green)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>GOI 6.54% 2032</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>IN0020210053 · SOV · G-Sec</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--green)'}}>7.24%</div><div style={{fontSize:'9.5px',color:'var(--green)'}}>&#x25B2; +3 bps</div></div></div>
        <div className="wl-p-row"><div className="wl-p-dot" style={{background:'var(--amber)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>REC 7.75% 2026</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>INE020B08BJ0 · AAA · Infra</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--tx2)'}}>7.75%</div><div style={{fontSize:'9.5px',color:'var(--tx3)'}}>&#x2500; flat</div></div></div>
        <div className="wl-p-row"><div className="wl-p-dot" style={{background:'var(--green)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>IRFC 7.34% 2033</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>INE053F09HF6 · AAA · Infra</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--green)'}}>7.68%</div><div style={{fontSize:'9.5px',color:'var(--green)'}}>&#x25B2; +5 bps</div></div></div>
        <div className="wl-p-row"><div className="wl-p-dot" style={{background:'var(--green)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>PFC 7.50% 2029</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>INE134E08KA3 · AAA · PSU</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--tx2)'}}>7.65%</div><div style={{fontSize:'9.5px',color:'var(--tx3)'}}>&#x2500; flat</div></div></div>
        <div className="wl-p-row" style={{borderBottom:'none'}}><div className="wl-p-dot" style={{background:'var(--blue)'}}></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:'12.5px',color:'var(--tx)'}}>GOI 7.18% 2037</div><div style={{fontSize:'10px',color:'var(--tx3)'}}>IN0020230017 · SOV · G-Sec</div></div><div style={{textAlign:'right'}}><div style={{fontFamily:'var(--mo)',fontSize:'12.5px',fontWeight:500,color:'var(--tx2)'}}>7.20%</div><div style={{fontSize:'9.5px',color:'var(--tx3)'}}>&#x2500; flat</div></div></div>
        <div style={{marginTop:'14px'}}><button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>+ Add Bond to Watchlist</button></div>
      </div>
    </div>
  );
}
