/* FajnDetektiv – kreslené pozadí (SVG 1200 × 700), které se mění podle pokroku.
   FDScene.render({view, theme, tier, prog, solved}) vrátí obsah <svg>.
   view: 'home' nebo id čtvrti; tier[idMise] = 0 (nevyřešeno) … 3 (zlatý důkaz);
   prog[idČtvrti] = 0…1 (podíl získaných důkazů); solved = vyřešena hlavní záhada.
   Neprozkoumané části jsou šedé a v mlze, vyřešené mise rozsvítí svůj předmět ve scéně.
   Důležité věci jsou mezi x = 440 a 760 – to je vidět i na mobilu na výšku. */
(function(root){
'use strict';
function rng(seed){ return ()=>{ seed=(seed+0x6D2B79F5)|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const THEME = {
  dark:{night:true, tint:'rgba(12,20,48,.38)', ground:'#1d2438', ground2:'#141a2b', glow:'#ffd27a', haze:'#1b2c50', orb:'moon', stars:60},
  girly:{night:true, tint:'rgba(110,40,100,.38)', ground:'#8a4f7d', ground2:'#6e3c63', glow:'#ffe3f3', haze:'#e9a9d2', orb:'moon', stars:25},
  light:{night:false, tint:'rgba(255,255,255,0)', ground:'#9aa6b8', ground2:'#7f8ca0', glow:'#fff6c8', haze:'#dcebf7', orb:'sun', stars:0}
};
let T, R, H, LB='', GB='';   // GB = obrysy dosud neobjevených předmětů – kreslí se nad mlhu   // LB = rozsvícená okna – kreslí se až nad noční tmu            // aktuální téma, generátor náhody, výstup
const add = s=>{ H+=s; };
const pct = v=>Math.max(0,Math.min(1,v));

/* ── stavebnice ── */
function defs(){
  add(`<defs>
  <filter id="sc-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="sc-soft"><feGaussianBlur stdDeviation="2.5"/></filter>
  <radialGradient id="sc-halo"><stop offset="0" stop-color="${T.glow}" stop-opacity=".75"/><stop offset="1" stop-color="${T.glow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="sc-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.night?'#1f3b63':'#5aa9d6'}"/><stop offset="1" stop-color="${T.night?'#0c1a30':'#2d6f9e'}"/></linearGradient>
  <linearGradient id="sc-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.haze}" stop-opacity="0"/><stop offset=".55" stop-color="${T.haze}" stop-opacity=".75"/><stop offset="1" stop-color="${T.haze}" stop-opacity=".9"/></linearGradient>
  <linearGradient id="sc-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f9a4c"/><stop offset="1" stop-color="#3f6d34"/></linearGradient>
  <linearGradient id="sc-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  </defs>`);
}
function sky(){
  for(let i=0;i<T.stars;i++) add(`<circle cx="${(R()*1200).toFixed(0)}" cy="${(R()*300).toFixed(0)}" r="${(R()*1.5+.3).toFixed(1)}" fill="#fff" opacity="${(R()*.6+.2).toFixed(2)}"/>`);
  if(T.orb==='moon') add('<circle cx="1010" cy="105" r="80" fill="rgba(255,240,190,.08)"/><circle cx="1010" cy="105" r="42" fill="#fff4cf"/><circle cx="1024" cy="96" r="8" fill="rgba(0,0,0,.06)"/><circle cx="996" cy="120" r="5" fill="rgba(0,0,0,.05)"/>');
  else{ add('<circle cx="1010" cy="105" r="95" fill="rgba(255,240,150,.30)"/><circle cx="1010" cy="105" r="48" fill="#ffe066"/>');
    [[180,120,1],[560,70,.8],[820,190,.7]].forEach(([x,y,k])=>add(`<g fill="#fff" opacity=".85" transform="translate(${x} ${y}) scale(${k})"><ellipse rx="62" ry="22"/><ellipse cx="-30" cy="-12" rx="30" ry="22"/><ellipse cx="22" cy="-16" rx="34" ry="26"/></g>`)); }
}
// silueta vzdáleného města (vždy v oparu)
function skyline(y0, col, op){
  let x=-20; const r=rng(11);
  while(x<1220){ const w=50+r()*80, h=60+r()*140;
    add(`<rect x="${x.toFixed(0)}" y="${(y0-h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+80).toFixed(0)}" fill="${col}" opacity="${op}"/>`);
    if(r()<.3) add(`<polygon points="${x+w*.2},${y0-h} ${x+w/2},${y0-h-30} ${x+w*.8},${y0-h}" fill="${col}" opacity="${op}"/>`);
    x+=w+2; }
}
// budova: stěna s přechodem, okna (svítí podle pokroku), střecha
function house(x,y,w,h,wall,roof,{lit=0, roofType='gable', cols, rows, door=true, seed=1}={}){
  const r=rng(seed);
  add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wall}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sc-shade)"/>`);
  if(roofType==='gable') add(`<polygon points="${x-8},${y} ${x+w/2},${y-w*.38} ${x+w+8},${y}" fill="${roof}"/><polygon points="${x+w/2},${y-w*.38} ${x+w+8},${y} ${x+w/2},${y}" fill="rgba(0,0,0,.18)"/>`);
  else if(roofType==='flat') add(`<rect x="${x-5}" y="${y-10}" width="${w+10}" height="12" fill="${roof}"/>`);
  else if(roofType==='mansard') add(`<path d="M${x-6} ${y} L${x+10} ${y-34} L${x+w-10} ${y-34} L${x+w+6} ${y}Z" fill="${roof}"/>`);
  cols=cols||Math.max(2,Math.floor(w/34)); rows=rows||Math.max(1,Math.floor((h-(door?50:20))/40));
  const gx=w/cols;
  for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){
    const wx=x+gx*i+gx/2-8, wy=y+18+j*40, on=r()<lit;
    add(`<rect x="${wx.toFixed(1)}" y="${wy}" width="16" height="22" rx="2" fill="${T.night?'#2a3350':'#cfe3f2'}"/><rect x="${(wx-2).toFixed(1)}" y="${wy+22}" width="20" height="3" fill="rgba(0,0,0,.25)"/>`);
    if(on) LB+=`<rect x="${wx.toFixed(1)}" y="${wy}" width="16" height="22" rx="2" fill="${T.glow}" opacity="${T.night?.95:.55}" ${T.night?'filter="url(#sc-glow)"':''}/>`;
  }
  if(door) add(`<rect x="${x+w/2-11}" y="${y+h-38}" width="22" height="38" rx="10" fill="#4a3324"/>`);
}
function lamp(x,y,on){
  if(on&&T.night) add(`<circle cx="${x}" cy="${y-62}" r="70" fill="url(#sc-halo)"/>`);
  add(`<rect x="${x-3}" y="${y-70}" width="6" height="70" fill="#2b2f3a"/><path d="M${x-12} ${y-70} h24 l-5 -14 h-14z" fill="#2b2f3a"/><circle cx="${x}" cy="${y-74}" r="6" fill="${on?T.glow:'#555b66'}" ${on?'filter="url(#sc-glow)"':''}/>`);
}
function tree(x,y,s,col,lit){
  add(`<rect x="${x-4*s}" y="${y-40*s}" width="${8*s}" height="${40*s}" fill="#5b3d26"/>`);
  add(`<circle cx="${x}" cy="${y-60*s}" r="${30*s}" fill="${col}"/><circle cx="${x-20*s}" cy="${y-45*s}" r="${20*s}" fill="${col}"/><circle cx="${x+20*s}" cy="${y-48*s}" r="${22*s}" fill="${col}"/><circle cx="${x+8*s}" cy="${y-72*s}" r="${16*s}" fill="rgba(255,255,255,.12)"/>`);
  if(lit) for(let i=0;i<6;i++) add(`<circle cx="${x+(R()-.5)*50*s}" cy="${y-(45+R()*35)*s}" r="${3*s}" fill="${lit}"/>`);
}
// zlatý důkaz – třpyt kolem předmětu
function sparkle(x,y){ [[0,0,1],[-26,14,.6],[24,-10,.7],[10,22,.5]].forEach(([dx,dy,k])=>add(`<path transform="translate(${x+dx} ${y+dy}) scale(${k})" d="M0-12 L3-3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3-3Z" fill="#ffe680" filter="url(#sc-glow)"/>`)); }
// předmět mise: nevyřešeno = jen přerušovaný obrys, vyřešeno = barevný, zlato = třpyt
function prop(t, x, y, draw){
  if(!t){ const h0=H; H=''; draw(false); const g=H; H=h0;
    GB+=`<g opacity=".8" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 5" fill="none">${g.replace(/fill="(?!none)[^"]*"/g,'fill="none"')}</g>`+
      `<g transform="translate(${x} ${y-10})"><circle r="15" fill="rgba(20,28,50,.75)" stroke="#ffd166" stroke-width="2.5"/><text y="7" text-anchor="middle" font-family="Arial" font-weight="900" font-size="19" fill="#ffd166">?</text></g>`; return; }
  draw(true); if(t>=3) sparkle(x,y);
}
function ground(y,col1,col2){ add(`<rect x="0" y="${y}" width="1200" height="${700-y}" fill="${col1}"/><rect x="0" y="${y}" width="1200" height="6" fill="${col2}"/>`);
  for(let i=0;i<40;i++) add(`<rect x="${(i*31)%1200}" y="${y+14+(i%4)*18}" width="20" height="3" rx="1.5" fill="rgba(255,255,255,.06)"/>`); }
function fog(p){ if(p<.98) add(`<rect x="0" y="250" width="1200" height="450" fill="url(#sc-fog)" opacity="${(.4*(1-p)).toFixed(2)}"/>`); }
function nightTint(){ if(T.night) add(`<rect x="0" y="0" width="1200" height="700" fill="${T.tint}"/>`); add(LB); LB=''; }
// skupina, která se z šedé postupně vybarví podle pokroku
// nasycení i jas rostou s pokrokem: neprozkoumané = šedé a přítmí
function satMat(p){ const s=.12+.88*p, b=.62+.38*p, r=.213*(1-s), g=.715*(1-s), bl=.072*(1-s);
  const row=(a,c,d)=>[a*b,c*b,d*b,0,0].map(v=>v.toFixed(3)).join(' ');
  return [row(r+s,g,bl),row(r,g+s,bl),row(r,g,bl+s),'0 0 0 1 0'].join(' '); }
const colorStart = (id,p)=>add(`<filter id="sat-${id}"><feColorMatrix type="matrix" values="${satMat(p)}"/></filter><g filter="url(#sat-${id})">`);
const colorEnd = ()=>add('</g>');

/* ── scény čtvrtí ── */
const SCENES = {
 pods(t,p){ // Ulice podstatných jmen
  colorStart('pods',p);
  ground(600,'#6f6a66','#8a837d');
  house(-40,330,190,270,'#c98b6b','#7a3b2e',{lit:p,seed:2,roofType:'gable'});
  house(160,370,150,230,'#e2c290','#5c4a3a',{lit:p,seed:3,roofType:'mansard'});
  house(320,300,170,300,'#9fb7c9','#3e4d63',{lit:p,seed:4,roofType:'gable'});
  // policejní stanice se třemi dveřmi (Třídírna) a výslechovým oknem
  house(500,280,220,320,'#d8d2c4','#2f3b55',{lit:p*.6,seed:5,roofType:'flat',door:false,rows:4,cols:5});
  add('<rect x="540" y="292" width="140" height="22" rx="3" fill="#2f3b55"/><text x="610" y="308" text-anchor="middle" font-family="Arial" font-weight="800" font-size="13" fill="#fff">POLICIE</text>');
  prop(t.tridirna,610,560,on=>[['#3a86ff',548],['#e8457b',598],['#22b07d',648]].forEach(([c,dx])=>add(`<rect x="${dx}" y="548" width="26" height="52" rx="12" fill="${on?c:'none'}"/>`)));
  prop(t.vyslech,660,420,on=>add(`${on&&T.night?'<circle cx="660" cy="430" r="40" fill="url(#sc-halo)"/>':''}<rect x="640" y="410" width="40" height="34" fill="${on?'#ffe9a8':'none'}"/><path d="M650 410 l10 -14 l10 14" fill="${on?'#333':'none'}"/>`));
  // vývěska HLEDÁ SE (Usvědčení)
  prop(t.usvedceni,770,520,on=>add(`<rect x="742" y="470" width="58" height="72" fill="${on?'#f7ecd0':'none'}"/><rect x="767" y="542" width="8" height="58" fill="${on?'#5b3d26':'none'}"/><text x="771" y="486" text-anchor="middle" font-family="Arial" font-weight="900" font-size="9" fill="${on?'#b33':'none'}">HLEDÁ SE</text><circle cx="771" cy="508" r="11" fill="${on?'#f28b54':'none'}"/>`));
  // kovárna s výhní (Kovárna)
  house(830,380,170,220,'#7d6a5a','#3a2c22',{lit:0,seed:6,roofType:'gable',door:false,rows:1});
  prop(t.kovarna,915,560,on=>add(`<rect x="880" y="520" width="70" height="80" rx="6" fill="${on?'#2a1d16':'none'}"/>${on?'<ellipse cx="915" cy="575" rx="26" ry="16" fill="#ff8a3d" filter="url(#sc-glow)"/><ellipse cx="915" cy="578" rx="14" ry="8" fill="#ffe08a"/>':''}<path d="M960 585 h34 l-6 12 h-22z" fill="${on?'#4a4f59':'none'}"/>`));
  // kancelář se zapečetěným spisem (Velký případ)
  house(1010,320,200,280,'#b5a2c8','#4b3b63',{lit:p,seed:7,roofType:'mansard'});
  prop(t.pripad,1110,470,on=>add(`<rect x="1080" y="452" width="60" height="40" rx="4" fill="${on?'#fff3c4':'none'}"/><text x="1110" y="477" text-anchor="middle" font-family="Arial" font-weight="900" font-size="12" fill="${on?'#7a3b2e':'none'}">SPISY</text>`));
  nightTint();
  [80,470,800].forEach(x=>lamp(x,600,p>0));
  colorEnd(); fog(p);
 },
 prid(t,p){ // Náměstí přídavných jmen
  colorStart('prid',p);
  ground(590,'#a89b8a','#c4b6a2');
  house(-30,360,170,230,'#f0c987','#9a4b3a',{lit:p,seed:12});
  house(130,330,160,260,'#f2a5a5','#6b3d5a',{lit:p,seed:13,roofType:'mansard'});
  house(900,340,150,250,'#a5d6c3','#3c6b5c',{lit:p,seed:14});
  house(1050,310,170,280,'#f6e39b','#7c5a2e',{lit:p,seed:15,roofType:'mansard'});
  // radnice s věží (Hlídka = hodiny na věži)
  house(470,330,260,260,'#efe3c8','#8a3b2e',{lit:p,seed:16,roofType:'flat',door:true,cols:6});
  add('<rect x="560" y="170" width="80" height="160" fill="#e3d2ae"/><polygon points="550,170 600,90 650,170" fill="#8a3b2e"/>');
  prop(t.hlidka,600,215,on=>add(`<circle cx="600" cy="215" r="26" fill="${on?'#fffbe8':'none'}" ${on&&T.night?'filter="url(#sc-glow)"':''}/><path d="M600 215 v-16 M600 215 h12" stroke="${on?'#333':'#fff'}" stroke-width="3"/>`));
  // kašna (vždy)
  add('<ellipse cx="600" cy="640" rx="110" ry="22" fill="#8c8f99"/><ellipse cx="600" cy="636" rx="96" ry="16" fill="url(#sc-water)"/><rect x="592" y="580" width="16" height="56" fill="#8c8f99"/><ellipse cx="600" cy="580" rx="36" ry="9" fill="#8c8f99"/>');
  if(p>0) add('<path d="M600 576 q-30 -40 -60 50 M600 576 q30 -40 60 50" stroke="#bfe6fb" stroke-width="3" fill="none" opacity=".8"/>');
  // stánek se šuplíky (Kartotéka)
  prop(t.druhy,350,560,on=>add(`<rect x="300" y="520" width="100" height="70" fill="${on?'#8b5a3c':'none'}"/><path d="M290 520 l20 -30 h80 l20 30z" fill="${on?'#e8457b':'none'}"/>${[0,1,2].map(i=>`<rect x="${310+i*30}" y="535" width="24" height="16" fill="${on?'#f3e6c6':'none'}"/>`).join('')}`));
  // malířský stojan (Shoda)
  prop(t.shoda,820,540,on=>add(`<path d="M790 600 l25 -100 l25 100 M815 500 v100" stroke="${on?'#6b4a2e':'#fff'}" stroke-width="5" fill="none"/><rect x="785" y="500" width="62" height="48" fill="${on?'#fff':'none'}"/>${on?'<circle cx="800" cy="515" r="7" fill="#e8457b"/><circle cx="818" cy="530" r="7" fill="#3a86ff"/><circle cx="835" cy="515" r="7" fill="#f6c445"/>':''}`));
  nightTint();
  [250,950].forEach(x=>lamp(x,590,p>0));
  colorEnd(); fog(p);
 },
 slov(t,p){ // Nádraží sloves
  colorStart('slov',p);
  ground(560,'#5d5a57','#77736f');
  // nádražní budova z cihel s obloukovými okny a hodinami
  add('<rect x="300" y="290" width="600" height="270" fill="#b5654a"/>');
  for(let y=300;y<560;y+=14) add(`<rect x="300" y="${y}" width="600" height="1.5" fill="rgba(0,0,0,.12)"/>`);
  add('<rect x="300" y="290" width="600" height="270" fill="url(#sc-shade)"/><rect x="292" y="280" width="616" height="14" fill="#7a3b2e"/><rect x="292" y="400" width="616" height="8" fill="#e8d3b0"/>');
  add('<path d="M470 280 V230 Q600 150 730 230 V280Z" fill="#c4775a"/><path d="M462 232 Q600 140 738 232" stroke="#7a3b2e" stroke-width="10" fill="none"/>');
  add('<circle cx="600" cy="226" r="30" fill="#fffbe8" stroke="#7a3b2e" stroke-width="5"/><path d="M600 226 v-18 M600 226 l13 6" stroke="#333" stroke-width="3"/>');
  add('<rect x="540" y="262" width="120" height="16" rx="3" fill="#2f3b55"/><text x="600" y="275" text-anchor="middle" font-family="Arial" font-weight="800" font-size="12" fill="#fff">NÁDRAŽÍ</text>');
  [[330,0],[410,0],[490,1],[560,1],[630,1],[700,1],[780,0],[860,0]].forEach(([x,big],k)=>{ const w=big?52:40, h=big?110:80, y=big?298:308;
    add(`<path d="M${x} ${y+h} V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V${y+h}Z" fill="${T.night?'#2a3350':'#cfe3f2'}" stroke="#e8d3b0" stroke-width="4"/>`);
    if(k%3!==1 && R()<.25+.75*p) LB+=`<path d="M${x} ${y+h} V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V${y+h}Z" fill="${T.glow}" opacity="${T.night?.85:.45}" ${T.night?'filter="url(#sc-glow)"':''}/>`; });
  [[330,430],[860,430]].forEach(([x,y])=>add(`<rect x="${x}" y="${y}" width="40" height="70" fill="#4a3324"/>`));
  add('<path d="M500 560 V470 A100 60 0 0 1 700 470 V560Z" fill="#3b2a20"/>');
  // nástupiště se zastřešením
  add('<rect x="0" y="560" width="1200" height="20" fill="#8d8a86"/><rect x="0" y="574" width="1200" height="5" fill="#f6c445"/>');
  add('<path d="M-10 452 L1210 452 L1210 470 L-10 470Z" fill="#3e4a5c"/><path d="M-10 452 L1210 452 L1190 440 L10 440Z" fill="#56657c"/>');
  for(let x=40;x<1200;x+=150) if(x<290||x>910) add(`<rect x="${x}" y="470" width="10" height="90" fill="#3e4a5c"/><rect x="${x-6}" y="466" width="22" height="8" fill="#56657c"/>`);
  [610,660].forEach(y=>{ for(let x=0;x<1200;x+=34) add(`<rect x="${x}" y="${y-4}" width="22" height="16" rx="2" fill="#4a3a2c" opacity=".75"/>`); add(`<rect x="0" y="${y}" width="1200" height="5" fill="#a9b0ba"/><rect x="0" y="${y+5}" width="1200" height="2" fill="#5d636c"/>`); });
  // tabule odjezdů (Jízdní řád)
  prop(t.jizdni,600,440,on=>add(`<rect x="540" y="410" width="120" height="60" rx="4" fill="${on?'#141a2b':'none'}"/>${on?[0,1,2].map(i=>`<rect x="550" y="${420+i*16}" width="${60+i*12}" height="8" fill="#ffd166"/>`).join(''):''}`));
  // návěstidlo (Výhybka)
  prop(t.vyhybka,800,480,on=>add(`<rect x="796" y="470" width="8" height="90" fill="${on?'#333':'none'}"/><rect x="786" y="440" width="28" height="56" rx="8" fill="${on?'#222':'none'}"/><circle cx="800" cy="455" r="8" fill="${on?'#3a3a3a':'none'}"/><circle cx="800" cy="480" r="8" fill="${on?'#2bd47a':'none'}" ${on?'filter="url(#sc-glow)"':''}/>`));
  // amplion (Hlášení)
  prop(t.hlaseni,420,470,on=>add(`<rect x="416" y="470" width="8" height="90" fill="${on?'#555':'none'}"/><path d="M420 470 l-30 -14 v-20 l30 -10z" fill="${on?'#c9ced6':'none'}"/>${on?'<path d="M380 440 q-12 6 0 14 M370 434 q-18 12 0 26" stroke="#ffd166" stroke-width="3" fill="none"/>':''}`));
  // vlak přijede, až je čtvrť celá vyřešená
  if(p>=1){ add('<g><rect x="60" y="560" width="300" height="56" rx="12" fill="#e8457b"/><rect x="80" y="572" width="40" height="22" rx="3" fill="#ffe9a8"/><rect x="140" y="572" width="40" height="22" rx="3" fill="#ffe9a8"/><rect x="200" y="572" width="40" height="22" rx="3" fill="#ffe9a8"/><rect x="290" y="566" width="60" height="30" rx="6" fill="#2f3b55"/><circle cx="110" cy="618" r="10" fill="#222"/><circle cx="300" cy="618" r="10" fill="#222"/></g>'); }
  nightTint();
  [200,1000].forEach(x=>lamp(x,560,p>0));
  colorEnd(); fog(p);
 },
 zajm(t,p){ // Park zájmen
  colorStart('zajm',p);
  add('<rect x="0" y="520" width="1200" height="180" fill="url(#sc-grass)"/>');
  add('<ellipse cx="300" cy="620" rx="230" ry="50" fill="url(#sc-water)"/><ellipse cx="300" cy="612" rx="200" ry="34" fill="rgba(255,255,255,.08)"/>');
  [[-10,560,1.6,'#3f7d3a'],[120,540,1.2,'#4f8f44'],[980,555,1.7,'#3f7d3a'],[1120,540,1.3,'#4f8f44'],[860,530,1,'#5a9a4c']].forEach(a=>tree(...a));
  // strom s podepsaným listem (Druhy zájmen) – rozkvete
  prop(t.zdruhy,600,420,on=>tree(600,540,1.9,on?'#e78a3c':'none',on?'#ffd166':null));
  // lavička s pastí (Pasti) a lucerny na cestě (Pátrání)
  prop(t.pasti,760,560,on=>add(`<rect x="720" y="548" width="90" height="8" fill="${on?'#8b5a3c':'none'}"/><rect x="720" y="530" width="90" height="6" fill="${on?'#8b5a3c':'none'}"/><rect x="726" y="556" width="6" height="24" fill="${on?'#333':'none'}"/><rect x="798" y="556" width="6" height="24" fill="${on?'#333':'none'}"/>`));
  add('<path d="M470 700 C520 620 560 600 640 560 L700 560 C640 600 620 640 600 700Z" fill="#d6c39b" opacity=".85"/>');
  prop(t.patrani,520,600,on=>[[505,650],[560,590]].forEach(([x,y])=>lamp(x,y,on)));
  // kachny na rybníku, když je park vyřešený
  if(p>=1) [[240,610],[300,622],[360,606]].forEach(([x,y])=>add(`<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="#f6e39b"/><circle cx="${x+10}" cy="${y-8}" r="6" fill="#2e8b57"/><path d="M${x+15} ${y-8} l7 2 l-7 2z" fill="#f4a63a"/>`));
  nightTint();
  colorEnd(); fog(p);
 },
 cisl(t,p){ // Banka číslovek
  colorStart('cisl',p);
  ground(600,'#8e8a82','#a8a39a');
  house(-20,360,200,240,'#c7cfd8','#4a5566',{lit:p,seed:31,roofType:'flat'});
  house(1000,340,220,260,'#d8c9a8','#5e4a32',{lit:p,seed:32,roofType:'flat'});
  // banka se sloupy
  add('<rect x="330" y="300" width="540" height="300" fill="#ece5d6"/><polygon points="310,300 600,200 890,300" fill="#d9cfba"/><polygon points="360,292 600,214 840,292" fill="#f5f0e4"/><rect x="310" y="296" width="580" height="14" fill="#cfc4ad"/>');
  for(let i=0;i<7;i++) add(`<rect x="${362+i*72}" y="318" width="26" height="250" fill="#f8f4ea"/><rect x="${362+i*72}" y="318" width="26" height="250" fill="url(#sc-shade)"/>`);
  add('<rect x="320" y="568" width="560" height="32" fill="#cfc4ad"/>');
  // nápis BANKA (Šeky), trezor (Trezor), měšce (Pokladna)
  prop(t.seky,600,262,on=>add(`<text x="600" y="276" text-anchor="middle" font-family="Georgia" font-weight="900" font-size="34" fill="${on?'#b8860b':'none'}" ${on&&T.night?'filter="url(#sc-glow)"':''}>BANKA</text>`));
  prop(t.trezor,600,470,on=>add(`<circle cx="600" cy="470" r="62" fill="${on?'#9aa3ad':'none'}"/><circle cx="600" cy="470" r="48" fill="${on?'#7d8792':'none'}"/><circle cx="600" cy="470" r="12" fill="${on?'#ffd166':'none'}"/>${on?[0,60,120,180,240,300].map(a=>`<rect x="596" y="428" width="8" height="22" fill="#5b636d" transform="rotate(${a} 600 470)"/>`).join(''):''}`));
  prop(t.pokladna,770,560,on=>[[740,580],[775,586],[805,578]].forEach(([x,y])=>add(`<ellipse cx="${x}" cy="${y}" rx="17" ry="20" fill="${on?'#c9a25a':'none'}"/><text x="${x}" y="${y+6}" text-anchor="middle" font-family="Arial" font-weight="900" font-size="14" fill="${on?'#6b4a1e':'none'}">Kč</text>`)));
  nightTint();
  [250,950].forEach(x=>lamp(x,600,p>0));
  colorEnd(); fog(p);
 },
 pristav(t,p){ // Přístav neohebných slov
  colorStart('pristav',p);
  add('<rect x="0" y="520" width="1200" height="180" fill="url(#sc-water)"/>');
  for(let i=0;i<26;i++) add(`<rect x="${(i*47)%1200}" y="${540+(i%6)*24}" width="${30+(i%3)*14}" height="3" rx="1.5" fill="rgba(255,255,255,.18)"/>`);
  // molo a sklady
  add('<rect x="0" y="500" width="520" height="30" fill="#6b4a2e"/><rect x="0" y="530" width="520" height="8" fill="#4a3320"/>');
  for(let x=20;x<520;x+=60) add(`<rect x="${x}" y="530" width="12" height="70" fill="#4a3320"/>`);
  house(10,370,200,130,'#a4553a','#5a2e20',{lit:p,seed:41,roofType:'gable',rows:1});
  // celnice s vlajkou (Celnice)
  house(230,380,160,120,'#e5d9b8','#2f3b55',{lit:p,seed:42,roofType:'flat',rows:1});
  prop(t.celnice,310,330,on=>add(`<rect x="306" y="300" width="4" height="80" fill="${on?'#333':'none'}"/><path d="M310 302 h44 v28 h-44z" fill="${on?'#fff':'none'}"/><path d="M310 316 h44 v14 h-44z" fill="${on?'#d7141a':'none'}"/><path d="M310 302 l22 14 l-22 14z" fill="${on?'#11457e':'none'}"/>`));
  // maják (Kompas) – svítí
  add('<rect x="900" y="505" width="140" height="22" fill="#6b6f78"/><polygon points="935,510 952,280 988,280 1005,510" fill="#f2f2f2"/><rect x="944" y="340" width="54" height="22" fill="#d7141a"/><rect x="940" y="420" width="62" height="22" fill="#d7141a"/><rect x="948" y="248" width="44" height="32" fill="#2f3b55"/><polygon points="944,248 970,226 996,248" fill="#d7141a"/>');
  prop(t.kompas,970,264,on=>{ if(on) LB+=`<linearGradient id="sc-beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff6c8" stop-opacity=".75"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient><polygon points="970,264 620,195 620,335" fill="url(#sc-beam)" opacity="${T.night?1:.6}"/><circle cx="970" cy="264" r="12" fill="${T.glow}" filter="url(#sc-glow)"/>`; else add('<circle cx="970" cy="264" r="12" fill="#888"/>'); });
  // policejní člun (Razie)
  prop(t.razie,640,560,on=>add(`<path d="M560 560 h170 l-24 34 h-130z" fill="${on?'#2f3b55':'none'}"/><rect x="600" y="532" width="70" height="28" rx="4" fill="${on?'#fff':'none'}"/><rect x="626" y="520" width="18" height="12" fill="${on?'#3a86ff':'none'}" ${on?'filter="url(#sc-glow)"':''}/>`));
  // velká loď připluje, až je přístav vyřešený
  if(p>=1) add('<g transform="translate(-60 0)"><path d="M780 470 h260 l-40 60 h-190z" fill="#b33a3a"/><rect x="820" y="420" width="160" height="50" fill="#f2efe6"/><rect x="850" y="380" width="50" height="40" fill="#f2efe6"/><rect x="900" y="370" width="22" height="50" fill="#2f3b55"/>'+[0,1,2,3].map(i=>`<circle cx="${845+i*36}" cy="444" r="7" fill="#ffe9a8"/>`).join('')+'</g>');
  nightTint();
  [120,420].forEach(x=>lamp(x,500,p>0));
  colorEnd(); fog(p);
 }
};

/* ── mapa města: panorama s dominantami čtvrtí ── */
function panorama(o){
  const P=o.prog||{}, all=Object.values(P), avg=all.length?all.reduce((a,b)=>a+b,0)/all.length:0;
  skyline(470, T.night?'#24365c':'#9fb5d1', .9);
  add('<g>');
  ground(600,T.ground,T.ground2);
  const marks=[
   ['pristav',200,()=>{ add('<polygon points="170,600 190,400 220,400 240,600" fill="#f2f2f2"/><rect x="176" y="460" width="58" height="22" fill="#d7141a"/><rect x="185" y="370" width="40" height="30" fill="#2f3b55"/><polygon points="181,370 205,350 229,370" fill="#d7141a"/>'); return [205,385]; }],
   ['cisl',360,()=>{ add('<rect x="285" y="450" width="150" height="150" fill="#ece5d6"/><polygon points="275,450 360,405 445,450" fill="#d9cfba"/>'); for(let i=0;i<5;i++) add(`<rect x="${295+i*29}" y="462" width="12" height="130" fill="#f8f4ea"/>`); return [360,430]; }],
   ['pods',525,()=>{ house(465,430,120,170,'#c98b6b','#7a3b2e',{lit:P.pods||0,seed:51,cols:3}); return [525,390]; }],
   ['prid',690,()=>{ add('<rect x="640" y="440" width="100" height="160" fill="#efe3c8"/><rect x="665" y="330" width="50" height="110" fill="#e3d2ae"/><polygon points="658,330 690,270 722,330" fill="#8a3b2e"/><circle cx="690" cy="360" r="14" fill="#fffbe8"/>'); return [690,300]; }],
   ['slov',855,()=>{ house(780,460,150,140,'#b5654a','#6b3a2a',{lit:P.slov||0,seed:52,roofType:'flat',rows:2,cols:4}); add('<path d="M810 452 a45 30 0 0 1 90 0z" fill="#6b3a2a"/><circle cx="855" cy="440" r="11" fill="#fffbe8"/>'); return [855,420]; }],
   ['zajm',1010,()=>{ tree(985,600,1.4,'#3f7d3a'); tree(1040,600,1.7,'#4f8f44'); return [1012,470]; }]
  ];
  marks.forEach(([id,x,draw])=>{ const p=P[id]||0;
    add(`<filter id="sat-m-${id}"><feColorMatrix type="matrix" values="${satMat(p)}"/></filter><g filter="url(#sat-m-${id})" transform="translate(${x} 600) scale(1.3) translate(${-x} -600)">`);
    let [cx,cy]=draw(); add('</g>'); cy=600-(600-cy)*1.3;
    if(!p) GB+=`<g transform="translate(${cx} ${cy-20})"><circle r="17" fill="rgba(20,28,50,.75)" stroke="#ffd166" stroke-width="2.5"/><text y="7" text-anchor="middle" font-family="Arial" font-weight="900" font-size="20" fill="#ffd166">?</text></g>`;
    if(p>0&&T.night) add(`<circle cx="${cx}" cy="${cy+60}" r="${60+50*p}" fill="url(#sc-halo)" opacity="${(.25+.5*p).toFixed(2)}"/>`);
    if(p>=1) sparkle(cx,cy-30);
  });
  nightTint();
  [60,260,430,600,770,980,1160].forEach((x,i)=>lamp(x,600,avg>i/7));
  add('</g>');
  add(`<rect x="0" y="380" width="1200" height="320" fill="url(#sc-fog)" opacity="${(.35*(1-avg)).toFixed(2)}"/>`);
  if(o.solved) [[300,150,'#ff7aa8'],[600,110,'#ffd166'],[900,160,'#6fa8ff']].forEach(([x,y,c])=>{ for(let a=0;a<360;a+=30) add(`<line x1="${x}" y1="${y}" x2="${x+Math.cos(a*Math.PI/180)*55}" y2="${y+Math.sin(a*Math.PI/180)*55}" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#sc-glow)"/>`); });
}

function render(o){
  T=THEME[o.theme]||THEME.dark; R=rng(7); H=''; LB=''; GB='';
  defs(); sky();
  if(o.view && SCENES[o.view]){ skyline(420, T.night?'#22335a':'#a9bfdc', .55); SCENES[o.view](o.tier||{}, (o.prog||{})[o.view]||0); }
  else panorama(o);
  add(GB); GB='';
  return H;
}
const API={render};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.FDScene=API;
})(typeof window!=='undefined'?window:this);
