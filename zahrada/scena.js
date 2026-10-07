/* FajnZahrada – kreslená zahrada (SVG 1200 × 700), která rozkvétá podle pokroku.
   FDGarden.render({view, theme, tier, prog, solved}); view = 'home' | 'B'…'Z' | 'sklenik'.
   tier[idMise] 0–3, prog[idZáhonu] 0–1. Nevypěstované věci = obrys s otazníkem. */
(function(root){
'use strict';
function rng(seed){ return ()=>{ seed=(seed+0x6D2B79F5)|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const THEME={dark:{night:true,tint:'rgba(12,20,48,.35)',stars:50,orb:'moon',grass:['#3f6d3a','#2f5530'],hill:'#2a4a3a'},
  girly:{night:true,tint:'rgba(110,40,100,.25)',stars:20,orb:'moon',grass:['#6da35c','#55894a'],hill:'#7a9a78'},
  light:{night:false,tint:'',stars:0,orb:'sun',grass:['#7cc35e','#5fa648'],hill:'#8fc77a'}};
const FLOWER={B:'#f6c445',L:'#e8457b',M:'#ffffff',P:'#d7263d',S:'#ffb3cf',V:'#ff6f61',Z:'#9b8cff'};
let T,R,H,GB;
const add=s=>{H+=s;};
function satMat(p){ const s=.12+.88*p, b=.66+.34*p, r=.213*(1-s), g=.715*(1-s), bl=.072*(1-s);
  const row=(a,c,d)=>[a*b,c*b,d*b,0,0].map(v=>v.toFixed(3)).join(' ');
  return [row(r+s,g,bl),row(r,g+s,bl),row(r,g,bl+s),'0 0 0 1 0'].join(' '); }
const colorStart=(id,p)=>add(`<filter id="g-sat-${id}"><feColorMatrix type="matrix" values="${satMat(p)}"/></filter><g filter="url(#g-sat-${id})">`);
const colorEnd=()=>add('</g>');
function defs(){ add(`<defs><filter id="g-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <linearGradient id="g-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5236"/><stop offset="1" stop-color="#4f3322"/></linearGradient>
  <linearGradient id="g-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.grass[0]}"/><stop offset="1" stop-color="${T.grass[1]}"/></linearGradient>
  <linearGradient id="g-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8f6ff" stop-opacity=".75"/><stop offset="1" stop-color="#a9d6ef" stop-opacity=".45"/></linearGradient></defs>`); }
function sky(){
  for(let i=0;i<T.stars;i++) add(`<circle cx="${(R()*1200)|0}" cy="${(R()*320)|0}" r="${(R()*1.4+.3).toFixed(1)}" fill="#fff" opacity="${(R()*.6+.2).toFixed(2)}"/>`);
  if(T.orb==='moon') add('<circle cx="1000" cy="200" r="70" fill="rgba(255,240,190,.08)"/><circle cx="1000" cy="200" r="38" fill="#fff4cf"/>');
  else { add('<circle cx="1000" cy="200" r="85" fill="rgba(255,240,150,.30)"/><circle cx="1000" cy="200" r="44" fill="#ffe066"/>');
    [[240,210,1],[620,180,.8]].forEach(([x,y,k])=>add(`<g fill="#fff" opacity=".9" transform="translate(${x} ${y}) scale(${k})"><ellipse rx="60" ry="20"/><ellipse cx="-28" cy="-10" rx="28" ry="20"/><ellipse cx="22" cy="-14" rx="32" ry="24"/></g>`)); }
}
function landscape(y){
  add(`<path d="M0 ${y-40} C200 ${y-120} 380 ${y-60} 560 ${y-100} C760 ${y-150} 960 ${y-60} 1200 ${y-110} V${y+20} H0Z" fill="${T.hill}" opacity=".85"/>`);
  add(`<rect x="0" y="${y}" width="1200" height="${700-y}" fill="url(#g-grass)"/>`);
  for(let x=0;x<1200;x+=46) add(`<rect x="${x}" y="${y-38}" width="12" height="44" rx="3" fill="#e9dcc2"/><polygon points="${x},${y-38} ${x+6},${y-46} ${x+12},${y-38}" fill="#e9dcc2"/>`);
  add(`<rect x="0" y="${y-30}" width="1200" height="6" fill="#d8c9a8"/><rect x="0" y="${y-14}" width="1200" height="6" fill="#d8c9a8"/>`);
}
function tree(x,y,s,col){ add(`<rect x="${x-5*s}" y="${y-45*s}" width="${10*s}" height="${45*s}" fill="#6b4a2e"/><circle cx="${x}" cy="${y-70*s}" r="${34*s}" fill="${col}"/><circle cx="${x-24*s}" cy="${y-52*s}" r="${22*s}" fill="${col}"/><circle cx="${x+24*s}" cy="${y-56*s}" r="${24*s}" fill="${col}"/>`); }
function sparkle(x,y){ [[0,0,1],[-22,12,.6],[20,-10,.7]].forEach(([dx,dy,k])=>add(`<path transform="translate(${x+dx} ${y+dy}) scale(${k})" d="M0-12 L3-3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3-3Z" fill="#ffe680" filter="url(#g-glow)"/>`)); }
function ghost(x,y,draw){ const h0=H; H=''; draw(); const g=H; H=h0;
  GB+=`<g opacity=".8" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 5" fill="none">${g.replace(/fill="(?!none)[^"]*"/g,'fill="none"')}</g><g transform="translate(${x} ${y})"><circle r="15" fill="rgba(20,40,30,.75)" stroke="#ffd166" stroke-width="2.5"/><text y="7" text-anchor="middle" font-family="Arial" font-weight="900" font-size="19" fill="#ffd166">?</text></g>`; }
function prop(t,x,y,draw){ if(!t) return ghost(x,y,draw); draw(); if(t>=3) sparkle(x,y-30); }
// rostliny
const sprout=(x,y,k=1)=>add(`<path d="M${x} ${y} v${-14*k}" stroke="#4a8f3c" stroke-width="${3*k}"/><path d="M${x} ${y-10*k} c-8 -2 -12 -8 -12 -12 c6 0 12 4 12 12z M${x} ${y-12*k} c8 -2 12 -8 12 -12 c-6 0 -12 4 -12 12z" fill="#6cc04a"/>`);
const flower=(x,y,c,k=1)=>add(`<path d="M${x} ${y} v${-34*k}" stroke="#3f8a37" stroke-width="${3*k}"/><path d="M${x} ${y-14*k} c-10 -2 -14 -10 -14 -14 c8 0 14 6 14 14z" fill="#5aa84a"/><g transform="translate(${x} ${y-36*k}) scale(${k})">${[0,72,144,216,288].map(a=>`<ellipse rx="6" ry="10" fill="${c}" transform="rotate(${a}) translate(0 -8)"/>`).join('')}<circle r="5" fill="#ffd166"/></g>`);
const veg=(x,y,k=1)=>add(`<path d="M${x} ${y} l-8 -26 M${x} ${y} l0 -30 M${x} ${y} l8 -26" stroke="#4fae3f" stroke-width="${4*k}" stroke-linecap="round"/><path d="M${x-9} ${y} q9 22 18 0z" fill="#f28b2c"/>`);
const weed=(x,y)=>add(`<path d="M${x} ${y} l-10 -22 l6 8 l4 -24 l4 22 l6 -10 l-4 26z" fill="#4d5a2a"/>`);
// záhon s rostlinami podle misí
function bed(x,y,w,h,p,t,big){
  const id=p, rada=t[p+'-rada'], saz=t[p+'-sazeni'], kor=t[p+'-koreny'], pl=t[p+'-plevel'];
  add(`<rect x="${x-6}" y="${y-6}" width="${w+12}" height="${h+12}" rx="10" fill="#8a6a46"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="url(#g-soil)"/>`);
  for(let i=0;i<3;i++) add(`<rect x="${x+8}" y="${y+h*(i+1)/4}" width="${w-16}" height="3" rx="1.5" fill="rgba(0,0,0,.18)"/>`);
  const n=Math.max(3,Math.round(w/(big?60:30))), gx=w/n, k=big?1.6:1;
  const rowY=i=>y+h*(i+1)/4+2;
  if(rada) for(let i=0;i<n;i++) sprout(x+gx*(i+.5), rowY(0), k);
  if(saz) for(let i=0;i<n;i++) flower(x+gx*(i+.5), rowY(1), FLOWER[p]||'#ffb3cf', k*.9);
  if(kor) for(let i=0;i<n;i++) veg(x+gx*(i+.5), rowY(2), k*.9);
  if(!pl) for(let i=0;i<n+1;i++) weed(x+gx*i+8, y+h-4-(i%2)*h*.4);
  // cedulka s písmenem
  const sx=x+w/2, sy=y-(big?70:34), sw=big?70:34;
  add(`<rect x="${sx-3}" y="${sy}" width="6" height="${big?70:34}" fill="#6b4a2e"/><rect x="${sx-sw/2}" y="${sy-sw*.75}" width="${sw}" height="${sw*.75}" rx="5" fill="#f3e6c6" stroke="#6b4a2e" stroke-width="3"/><text x="${sx}" y="${sy-sw*.16}" text-anchor="middle" font-family="Georgia" font-weight="900" font-size="${sw*.6}" fill="#4f3322">${p}</text>`);
  if(big){ // velké předměty k misím
    prop(rada, x-60, y+h-40, ()=>add(`<rect x="${x-90}" y="${y+h-80}" width="56" height="70" rx="6" fill="#f6e3b0" stroke="#b07a3a" stroke-width="3"/><text x="${x-62}" y="${y+h-40}" text-anchor="middle" font-size="26">🌱</text>`));
    prop(pl, x+w+60, y+h-40, ()=>add(`<path d="M${x+w+30} ${y+h-20} h56 l-6 -46 h-44z" fill="#4f9ac9"/><path d="M${x+w+86} ${y+h-56} l34 -22" stroke="#4f9ac9" stroke-width="8" stroke-linecap="round"/><path d="M${x+w+40} ${y+h-66} a20 20 0 0 1 36 0" stroke="#4f9ac9" stroke-width="6" fill="none"/>`));
    if(!rada) ghost(x+w*.2, rowY(0)-10, ()=>sprout(x+w*.2, rowY(0), k));
    if(!saz) ghost(x+w*.5, rowY(1)-40, ()=>flower(x+w*.5, rowY(1), '#fff', k));
    if(!kor) ghost(x+w*.8, rowY(2)-20, ()=>veg(x+w*.8, rowY(2), k));
    if(rada&&saz&&kor&&pl) [[x+w*.3,y-30],[x+w*.7,y-60],[x+w*.5,y-110]].forEach(([bx,by])=>add(`<g transform="translate(${bx} ${by})"><ellipse cx="-8" cy="0" rx="10" ry="7" fill="${FLOWER[p]}" transform="rotate(-25)"/><ellipse cx="8" cy="0" rx="10" ry="7" fill="${FLOWER[p]}" transform="rotate(25)"/><rect x="-2" y="-8" width="4" height="16" rx="2" fill="#333"/></g>`));
  }
  [rada,saz,kor,pl].forEach((tt,i)=>{ if(tt>=3 && !big) sparkle(x+w*(i+.5)/4, y-6); });
}
function greenhouse(x,y,w,h,p,t){
  add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#g-glass)" stroke="#e8f1f5" stroke-width="4"/><polygon points="${x-8},${y} ${x+w/2},${y-h*.45} ${x+w+8},${y}" fill="url(#g-glass)" stroke="#e8f1f5" stroke-width="4"/>`);
  for(let i=1;i<4;i++) add(`<rect x="${x+w*i/4-2}" y="${y}" width="4" height="${h}" fill="#e8f1f5"/>`);
  add(`<rect x="${x+w/2-22}" y="${y+h-60}" width="44" height="60" fill="rgba(255,255,255,.35)" stroke="#e8f1f5" stroke-width="3"/>`);
  if(t){ const sk=t.sklizen, dv=t.dvojice, vp=t.velkyplevel;
    prop(sk, x+w*.2, y+h-50, ()=>[0,1,2].forEach(i=>add(`<circle cx="${x+w*.12+i*18}" cy="${y+h-20}" r="9" fill="#e63946"/><path d="M${x+w*.12+i*18-6} ${y+h-28} l6 4 l6 -4" stroke="#3f8a37" stroke-width="3" fill="none"/>`)));
    prop(dv, x+w*.5, y+h*.35, ()=>add(`<g transform="translate(${x+w*.5} ${y+h*.35})"><ellipse cx="-12" cy="0" rx="14" ry="10" fill="#9b8cff" transform="rotate(-25)"/><ellipse cx="12" cy="0" rx="14" ry="10" fill="#ffb3cf" transform="rotate(25)"/><rect x="-2" y="-10" width="4" height="20" rx="2" fill="#333"/></g>`));
    prop(vp, x+w*.82, y+h-45, ()=>add(`<path d="M${x+w*.74} ${y+h-12} h40 l-4 -34 h-32z" fill="#f3c445"/><path d="M${x+w*.74+40} ${y+h-38} l24 -16" stroke="#f3c445" stroke-width="6" stroke-linecap="round"/>`)); }
}
function render(o){
  T=THEME[o.theme]||THEME.dark; R=rng(5); H=''; GB='';
  const t=o.tier||{}, P=o.prog||{};
  defs(); sky();
  const v=o.view||'home';
  if(v==='home'){
    landscape(450);
    tree(70,470,1.4,'#3f7d3a'); tree(1130,470,1.5,'#4f8f44');
    colorStart('gh',P.sklenik||0); greenhouse(520,330,160,120,'sklenik',null); colorEnd();
    const L=['B','L','M','P','S','V','Z'], w=112, gap=18, x0=600-(L.length*w+(L.length-1)*gap)/2;
    L.forEach((p,i)=>{ colorStart('b'+p,P[p]||0); bed(x0+i*(w+gap), 540, w, 90, p, t, false); colorEnd(); if(!(P[p]>0)) GB+=`<g transform="translate(${x0+i*(w+gap)+w/2} 585)"><circle r="15" fill="rgba(20,40,30,.75)" stroke="#ffd166" stroke-width="2.5"/><text y="7" text-anchor="middle" font-family="Arial" font-weight="900" font-size="19" fill="#ffd166">?</text></g>`; });
    if(o.solved) [[300,240,'#ff7aa8'],[600,200,'#ffd166'],[900,250,'#6fa8ff']].forEach(([x,y,c])=>{ for(let a=0;a<360;a+=30) add(`<line x1="${x}" y1="${y}" x2="${x+Math.cos(a*Math.PI/180)*50}" y2="${y+Math.sin(a*Math.PI/180)*50}" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g-glow)"/>`); });
  } else if(v==='sklenik'){
    landscape(470); tree(160,500,1.5,'#3f7d3a'); tree(1040,500,1.6,'#4f8f44');
    colorStart('gh',P.sklenik||0); greenhouse(330,300,540,330,'sklenik',t); colorEnd();
  } else {
    landscape(440); tree(120,470,1.5,'#3f7d3a'); tree(1080,470,1.6,'#4f8f44');
    colorStart('bed',P[v]||0); bed(340,470,520,170,v,t,true); colorEnd();
  }
  if(T.night) add(`<rect x="0" y="0" width="1200" height="700" fill="${T.tint}"/>`);
  if(!o.bg) add(GB);
  return H;
}
const API={render};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.FDGarden=API;
})(typeof window!=='undefined'?window:this);
