'use strict';
/* ══════════════ FAJNZAHRADA – herní logika (vkládá se do vyjmenovana_slova.html) ══════════════ */
let game=null;
const L7 = ['B','L','M','P','S','V','Z'];
const randOf = a=>a[Math.random()*a.length|0];
function show(html){ app.innerHTML=`<div class="screen">${html}</div>`; window.scrollTo(0,0); }
function logTime(){ const g=game; if(!g||!g.start||g.timeLogged) return; g.timeLogged=true; dayLog().min+=Math.min(30,(Date.now()-g.start)/60000); }
function confetti(){
  const cols=['#ffd166','#e8457b','#3a86ff','#22b07d','#f4a63a'];
  for(let i=0;i<60;i++){ const c=document.createElement('i'); c.className='confetti';
    c.style.left=Math.random()*100+'vw'; c.style.background=cols[i%cols.length];
    c.style.animationDuration=(1.6+Math.random()*1.6)+'s'; c.style.animationDelay=(Math.random()*.4)+'s';
    document.body.appendChild(c); setTimeout(()=>c.remove(),3800); }
}
const BEDINFO = {
  B:{ico:'🌻', flower:'🌻 Slunečnice', veg:'🥔 Brambory', tool:'🪣 Konev'},
  L:{ico:'🌷', flower:'🌷 Tulipány', veg:'🧅 Cibule', tool:'🧤 Zahradní rukavice'},
  M:{ico:'🌼', flower:'🌼 Kopretiny', veg:'🥕 Mrkev', tool:'✂️ Zahradnické nůžky'},
  P:{ico:'🌹', flower:'🌹 Růže', veg:'🌶️ Papriky', tool:'🪴 Květináč'},
  S:{ico:'🌸', flower:'🌸 Třešňový květ', veg:'🥬 Salát', tool:'🧺 Košík'},
  V:{ico:'🌺', flower:'🌺 Ibišek', veg:'🍅 Rajčata', tool:'🐝 Úl'},
  Z:{ico:'💐', flower:'💐 Kytice', veg:'🥒 Okurky', tool:'👒 Slaměný klobouk'}
};
const MT = {rada:{ico:'📜', name:'Řada'}, sazeni:{ico:'🌱', name:'Sázení'}, koreny:{ico:'🥕', name:'Kořeny'}, plevel:{ico:'🌿', name:'Plevel'}};
const vsList = p=>FDZ.VSORDER[p].map(w=>FDZ.SE.has(w)?w+' se':w).join(', ');
const BEDS = L7.map(p=>({id:p, letter:p, ico:BEDINFO[p].ico, name:`Záhon ${p}`, desc:vsList(p), missions:[
  {id:p+'-rada', type:'pick', gen:'rada', p, ico:'📜', name:'Řada', desc:`Nauč se vyjmenovaná slova po ${p} v pořadí, jak je recitujete ve škole.`, levels:[
    {lv:1, name:'Které je vyjmenované?', sub:'najdi vyjmenované slovo mezi ostatními', count:8},
    {lv:2, name:'Co následuje?', sub:'pokračuj v řadě', count:8, full:true},
    {lv:3, name:'Vyjmenované, nebo příbuzné?', sub:'najdi slovo, které ve výčtu není', count:8, full:true}]},
  {id:p+'-sazeni', type:'pick', gen:'sazeni', p, ico:'🌱', name:'Sázení', desc:`Doplň i, nebo y po ${p}. Správně napsané slovo vyroste.`, levels:[
    {lv:1, name:'Vyjmenovaná slova', sub:'vyjmenovaná slova a slova s i', count:10, kinds:['vs','i']},
    {lv:2, name:'I příbuzná slova', sub:'přidají se slova příbuzná', count:10, kinds:['vs','pr','i'], full:true},
    {lv:3, name:'Všechno dohromady', sub:p==='V'?'i předpona vy- / vý-':'víc příbuzných slov, méně nápověd', count:12, kinds:['vs','pr','pr','i','pre'], full:true}]},
  {id:p+'-koreny', type:'pick', gen:'koreny', p, ico:'🥕', name:'Kořeny', desc:'Ke kterému vyjmenovanému slovu slovo patří? Najdi společný kořen.', levels:[
    {lv:1, name:'Příbuzná slova', sub:'každé slovo má svůj kořen', count:8, kinds:['pr']},
    {lv:2, name:'Nebo žádné?', sub:'některá slova k žádnému nepatří – pak píšeme i', count:8, kinds:['pr','pr','i'], full:true},
    {lv:3, name:'Bez zaváhání', sub:'víc možností a víc pastí', count:10, kinds:['pr','i'], opts:5, full:true}]},
  {id:p+'-plevel', type:'plevel', p, ico:'🌿', name:'Plevel', desc:'Skřítek Plevelín přehodil v textu i a y. Najdi chybná slova a oprav je.', levels:[
    {lv:1, name:'Podezřelá slova', sub:'podezřelá slova jsou podtržená', count:2, fakes:1, mark:true},
    {lv:2, name:'Hledej sám', sub:'nic není podtržené', count:3, fakes:2, full:true},
    {lv:3, name:'Mazaný skřítek', sub:'víc chyb v textu', count:3, fakes:3, full:true}]}
]})).concat([{id:'sklenik', letter:'*', ico:'🏡', name:'Velký skleník', desc:'Všechna písmena dohromady, předpony a záludné dvojice.', missions:[
  {id:'sklizen', type:'pick', gen:'sazeni', p:'*', ico:'🧺', name:'Velká sklizeň', desc:'Slova po všech obojetných souhláskách najednou.', levels:[
    {lv:1, name:'Vyjmenovaná slova', sub:'po všech souhláskách', count:12, kinds:['vs','i']},
    {lv:2, name:'I příbuzná slova', sub:'vyjmenovaná, příbuzná i slova s i', count:12, kinds:['vs','pr','i'], full:true},
    {lv:3, name:'Mistr sklizně', sub:'i předpona vy- / vý-', count:15, kinds:['vs','pr','pr','i','pre'], full:true}]},
  {id:'dvojice', type:'pick', gen:'dvojice', p:'*', ico:'🦋', name:'Záludné dvojice', desc:'být × bít, mýt × mít, výr × vír… Podle významu poznáš, které slovo patří do věty.', levels:[
    {lv:1, name:'Být, nebo bít?', sub:'nejznámější dvojice', count:8, set:['být','bít','byl','bil','mýt','mít','výr','vír']},
    {lv:2, name:'Všechny dvojice', sub:'i pyl × pil, výt × vít', count:10, full:true},
    {lv:3, name:'Bez nápovědy významu', sub:'význam si domysli sám', count:12, noMeaning:true, full:true}]},
  {id:'velkyplevel', type:'plevel', p:'*', ico:'🏆', name:'Velký plevel', desc:'Dlouhé texty se slovy po všech souhláskách.', levels:[
    {lv:1, name:'Podezřelá slova', sub:'podezřelá slova jsou podtržená', count:2, fakes:2, mark:true},
    {lv:2, name:'Hledej sám', sub:'nic není podtržené', count:3, fakes:2, full:true},
    {lv:3, name:'Mazaný skřítek', sub:'víc chyb v textu', count:3, fakes:3, full:true}]}
]}]);
const DISTRICTS = BEDS;    // společné funkce (odměny, rodiče) pracují s „čtvrtěmi“
const allMissions = ()=>BEDS.flatMap(d=>d.missions);
const DIFF = ['Lehká','Střední','Těžká'];
const RANKS = [[0,'Semínko'],[150,'Klíček'],[400,'Pomocník zahradníka'],[800,'Zahradník'],[1400,'Mistr zahradník'],[2200,'Strážce zahrady']];
const BADGES = [
  {id:'first', ico:'🌱', name:'První zasazení', d:'Dokonči první misi'},
  {id:'perfect', ico:'💎', name:'Bez plevele', d:'Mise bez jediné chyby'},
  {id:'streak10', ico:'🔥', name:'Zelená ruka', d:'10 správně v řadě'},
  ...L7.map(p=>({id:'bed'+p, ico:BEDINFO[p].ico, name:`Pán záhonu ${p}`, d:`3 hvězdy ve všech misích záhonu ${p} na Lehké`})),
  {id:'rady', ico:'📜', name:'Znalec řad', d:'Vyřeš Řadu u všech sedmi záhonů'},
  {id:'koreny', ico:'🥕', name:'Hledač kořenů', d:'Vyřeš Kořeny u všech sedmi záhonů'},
  {id:'sklenik', ico:'🏡', name:'Pán skleníku', d:'Vyřeš všechny mise ve Velkém skleníku'},
  {id:'zahrada', ico:'🎉', name:'Celá zahrada kvete', d:'Vyřeš aspoň jednou každou misi'},
  {id:'veteran', ico:'🎖️', name:'Veterán', d:'Získej 1000 bodů'}
];

/* ── pomocné pro slova ── */
const WORDS = FDZ.WORDS.filter(x=>x.pos>=0);
const showW = w=>FDZ.SE.has(w)?w+' se':w;
const isLong = ch=>/[íý]/.test(ch);
const ctxHTML = x=>{ const c=FDZ.KONTEXT[x.w]; return c ? `<span class="frame ctx">${esc(c).replace('_','<span class="blank gapl">_</span>')}</span><br><small>Pozor, podle smyslu věty: stejně znějící slovo se může psát jinak.</small>` : null; };
const gapHTML = x=>`${esc(x.w.slice(0,x.pos))}<span class="blank gapl">_</span>${esc(x.w.slice(x.pos+1))}`;
const fullHTML = (x,cls='')=>`${esc(x.w.slice(0,x.pos))}<b class="crit ${cls}">${esc(x.w[x.pos])}</b>${esc(x.w.slice(x.pos+1))}`;
const KTYP = {vs:'vyjmenované slovo', pr:'příbuzné slovo', i:'slovo s i (není vyjmenované ani příbuzné)', pre:'předpona vy- / vý-'};
function whyWord(x){ return whyWord0(x)+(FDZ.ROZDILMAP[x.w]?`<p class="row">⚠️ Stejně znějící slova: ${FDZ.ROZDILMAP[x.w]}.</p>`:''); }
function whyWord0(x){
  const P=x.p, c=x.w[x.pos];
  if(x.k==='pre') return `<div class="steps"><span class="step">${fullHTML(x)}</span><span class="arrow">→</span><span class="step">začíná předponou <b>${x.w.slice(0,2)}-</b></span><span class="arrow">→</span><span class="step" style="color:var(--ok)">předpona vy- / vý- se píše vždy s <b>y</b></span></div>`;
  const s1=`<span class="step"><b>${P}</b> je obojetná souhláska</span><span class="arrow">→</span>`;
  if(x.k==='vs') return `<div class="steps">${s1}<span class="step"><b>${esc(showW(x.w))}</b> je vyjmenované slovo po ${P}</span><span class="arrow">→</span><span class="step" style="color:var(--ok)">píšeme <b>${c}</b>: ${fullHTML(x)}</span></div>`;
  if(x.k==='pr') return `<div class="steps">${s1}<span class="step"><b>${esc(x.w)}</b> je příbuzné s vyjmenovaným slovem <b>${esc(showW(x.base))}</b></span><span class="arrow">→</span><span class="step" style="color:var(--ok)">píšeme <b>${c}</b>: ${fullHTML(x)}</span></div>`;
  return `<div class="steps">${s1}<span class="step"><b>${esc(x.w)}</b> není vyjmenované ani příbuzné s vyjmenovaným slovem</span><span class="arrow">→</span><span class="step" style="color:var(--ok)">píšeme <b>${c}</b>: ${fullHTML(x)}</span></div>`;
}
function hintWord(x){
  if(x.k==='pre' || (x.p==='V' && /^v[yý]/.test(x.w) && x.k!=='vs')) return `Podívej se na začátek slova. Není to předpona? A pokud ne – je slovo v řadě po V: ${vsList('V')}?`;
  return `Po ${x.p} píšeme y jen ve vyjmenovaných slovech a ve slovech s nimi příbuzných. Řekni si řadu: <i>${vsList(x.p)}</i>. Patří slovo mezi ně, nebo k některému z nich?`;
}
const pickN = (arr,n)=>shuffle(arr.slice()).slice(0,n);
const lettersOf = p=>p==='*'?L7:[p];

/* ── Řada ── */
function genRada(L){
  const p=game.m.p, vs=FDZ.VSORDER[p], vsN=vs.filter(w=>!/^[A-ZÁ-Ž]/.test(w)), out=[];
  const iw=WORDS.filter(x=>x.p===p&&x.k==='i').map(x=>x.w), prw=WORDS.filter(x=>x.p===p&&x.k==='pr');
  for(let n=0;n<L.count;n++){
    if(L.lv===1){
      const w=weightedPick(vsN, x=>1+3*(S.weak['r|'+x]||0), 1)[0], opts=shuffle([w,...pickN(iw,3)]);
      out.push({sign:p, w, q:`Které slovo je vyjmenované po ${p}?`, sub:'Jen jedno z nich je ve výčtu vyjmenovaných slov.',
        opts:opts.map(v=>({v, html:esc(showW(v))})), ok:[w], hint:`Řekni si nahlas řadu po ${p} od začátku: ${esc(vs.slice(0,3).map(showW).join(', '))}… Které slovo v ní zazní?`,
        why:`<p><b>${esc(showW(w))}</b> je vyjmenované slovo po ${p}. Ostatní slova se píšou s <b>i</b>, protože ve výčtu nejsou.</p><p class="row">Řada po ${p}: <i>${esc(vsList(p))}</i></p>`,
        stats:[['rada',p]], conf:()=>'rada|'+p, weak:'r|'+w, base:10});
    } else if(L.lv===2){
      const i=Math.random()*vs.length|0, w=vs[i], prev=vs.slice(Math.max(0,i-3),i).map(showW);
      let ds=pickN(vs.filter(x=>x!==w&&!prev.includes(showW(x))),3); if(ds.length<3) ds=ds.concat(pickN(vs.filter(x=>x!==w&&!ds.includes(x)),3-ds.length));
      const opts=shuffle([w,...ds]);
      out.push({sign:p, w, q:i?'Které slovo v řadě následuje?':`Kterým slovem začíná řada po ${p}?`,
        sub:i?`<span class="frame">${esc(prev.join(', '))}, <span class="blank">______</span></span>`:`<span class="frame"><span class="blank">______</span>, …</span>`,
        opts:opts.map(v=>({v, html:esc(showW(v))})), ok:[w], hint:`Odříkej řadu po ${p} pomalu od začátku a zastav se u mezery.`,
        why:`<p class="row">Řada po ${p}: <i>${vs.map((x,j)=>j===i?`<b style="color:var(--ok)">${esc(showW(x))}</b>`:esc(showW(x))).join(', ')}</i></p>`,
        stats:[['rada',p]], conf:()=>'rada|'+p, weak:'r|'+w, base:12});
    } else {
      const x=randOf(prw), opts=shuffle([x.w,...pickN(vsN.filter(v=>v!==x.base),3)]);
      out.push({sign:p, w:x.w, q:'Které slovo NENÍ vyjmenované? (Je jen příbuzné.)', sub:`Tři slova jsou ve výčtu vyjmenovaných slov po ${p}, jedno je jen příbuzné.`,
        opts:opts.map(v=>({v, html:esc(showW(v))})), ok:[x.w], hint:'Příbuzné slovo má stejný kořen jako některé vyjmenované, ale samo ve výčtu není. Které slovo je odvozené od jiného?',
        why:`<p><b>${esc(x.w)}</b> není ve výčtu – je příbuzné s vyjmenovaným slovem <b>${esc(showW(x.base))}</b>. Píše se s y právě proto, že je příbuzné.</p>`,
        stats:[['rada',p]], conf:()=>'rada|'+p, weak:'r|'+x.w, base:14});
    }
  }
  return out;
}
/* ── Sázení (doplň i / y) ── */
function genSazeni(L){
  const ps=lettersOf(game.m.p), out=[];
  for(let n=0;n<L.count;n++){
    let k=randOf(L.kinds); if(k==='pre' && !ps.includes('V')) k='pr';
    const okw=x=>(k==='pre'?x.k==='pre':(x.k===k&&ps.includes(x.p))) && !x.proper;
    let pool=WORDS.filter(x=>okw(x) && !out.some(o=>o.x===x)); if(!pool.length) pool=WORDS.filter(x=>okw(x)&&(!out.length||out[out.length-1].x!==x));
    const [x]=weightedPick(pool, w=>1+3*(S.weak['w|'+w.w]||0)+1.5*errRate('pis',w.p), 1); if(!x) continue;
    const c=x.w[x.pos], opts=isLong(c)?['í','ý']:['i','y'];
    out.push({x, sign:x.w, w:x.w, gap:true, q:'Doplň i, nebo y', sub:ctxHTML(x)||`<span class="word big">${gapHTML(x)}</span>`,
      opts:opts.map(v=>({v, html:`<b class="big">${v}</b>`})), ok:[c], hint:hintWord(x), why:whyWord(x),
      stats:[['pis',x.p],['typ',x.k]], conf:v=>(/[iyíý]/.test(v)&&/[yý]/.test(c)?'zi|':'zy|')+x.p+(x.k==='pre'?'|pre':''), weak:'w|'+x.w, base:L.lv===1?10:L.lv===2?12:14});
  }
  return out;
}
/* ── Kořeny ── */
const NONE='-';
function genKoreny(L){
  const p=game.m.p, vsN=FDZ.VSORDER[p].filter(w=>!/^[A-ZÁ-Ž]/.test(w)), out=[];
  for(let n=0;n<L.count;n++){
    const k=randOf(L.kinds); let pool=WORDS.filter(x=>x.p===p&&x.k===k&&!out.some(o=>o.x===x));
    if(!pool.length) pool=WORDS.filter(x=>x.p===p&&x.k===k&&(!out.length||out[out.length-1].x!==x));
    const [x]=weightedPick(pool, w=>1+3*(S.weak['k|'+w.w]||0), 1); if(!x) continue;
    const nOpt=(L.opts||4)-(L.lv>=2?1:0), ok=x.k==='pr'?x.base:NONE;
    let opts=pickN(vsN.filter(v=>v!==ok),nOpt-(x.k==='pr'?1:0)); if(x.k==='pr') opts.push(ok); opts=shuffle(opts).map(v=>({v, html:esc(showW(v))}));
    if(L.lv>=2) opts.push({v:NONE, html:'<b>k žádnému</b><small>píšeme i</small>', cls:'drawer'});
    out.push({x, sign:x.w, w:x.w, gap:true, q:'Ke kterému vyjmenovanému slovu patří?', sub:(ctxHTML(x)||`<span class="word big">${gapHTML(x)}</span>`)+`<br><small>Hledej slovo se stejným kořenem a podobným významem.</small>`,
      opts, ok:[ok], hint:`Co slovo <b>${gapHTML(x)}</b> znamená? Zkus postupně slova z řady po ${p} a ptej se: souvisí spolu významem? ${L.lv>=2?'Když nesouvisí s žádným, patří k žádnému.':''}`,
      why: (x.k==='pr' ? `<p><b>${esc(x.w)}</b> je příbuzné s vyjmenovaným slovem <b>${esc(showW(x.base))}</b> (stejný kořen).</p>` : `<p><b>${esc(x.w)}</b> nepatří k žádnému vyjmenovanému slovu po ${p}.</p>`)+whyWord(x),
      stats:[['koren',p],['typ',x.k]], conf:()=>'kor|'+p+(x.k==='i'?'|i':''), weak:'k|'+x.w, base:L.lv===1?12:14});
  }
  return out;
}
/* ── Záludné dvojice ── */
function genDvojice(L){
  const pool=FDZ.DVOJICE.filter(d=>!L.set||L.set.includes(d[1]));
  return weightedPick(pool, d=>1+3*(S.weak['d|'+d[0]]||0)+1.5*errRate('dvojice',[d[1],d[2]].sort().join('/')), L.count).map(([t,ok,bad,why])=>{
    const pair=[ok,bad].sort().join('/');
    return {sign:pair, w:t, q:'Které slovo patří do věty?', sub:`<span class="frame">${esc(t).replace('___','<span class="blank">______</span>')}</span>`,
      opts:shuffle([ok,bad]).map(v=>({v, html:`<b class="big">${esc(v)}</b>`})), ok:[ok],
      hint: L.noMeaning || !MEAN[ok] || !MEAN[bad] ? 'Zeptej se, co věta znamená. Která podoba slova k tomu významu patří – je to vyjmenované slovo, nebo ne?' : `<b>${esc(ok<bad?ok:bad)}</b> = ${MEAN[ok<bad?ok:bad]}, <b>${esc(ok<bad?bad:ok)}</b> = ${MEAN[ok<bad?bad:ok]}. Které ve větě dává smysl?`,
      why:`<p>${esc(why)}</p><div class="steps"><span class="step" style="color:var(--ok)">${esc(t.replace('___',ok))}</span></div>`,
      stats:[['dvojice',pair]], conf:()=>'dv|'+pair, weak:'d|'+t, base:L.lv===1?10:13};
  });
}
const MEAN = {'být':'existovat, stát se něčím','bít':'tlouct, uhodit','byl':'od slova být','bil':'od slova bít (tloukl)','byly':'od slova být','bily':'od slova bít (tloukly)',
  'mýt':'umývat','mít':'vlastnit, mít něco','výr':'sova','vír':'točící se voda','pyl':'prášek z květů','pil':'od slova pít',
  'výt':'hlasitě naříkat jako vlk','vít':'splétat (věnec)','nabít':'doplnit energii','nabýt':'získat','dobýt':'obsadit','dobít':'znovu nabít'};
const PICKGEN = {rada:genRada, sazeni:genSazeni, koreny:genKoreny, dvojice:genDvojice};

/* ── Plevel (chyby v textu) ── */
// základ slova v textu: nejdelší společný začátek se slovem ze seznamu stejné souhlásky
function textBase(word, p, pos){
  const norm=s=>s.toLowerCase().replace(/[áéíóúůý]/g,c=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ů':'u','ý':'y'})[c]);
  const nw0=norm(word), ex=WORDS.find(x=>x.p===p&&norm(x.w)===nw0); if(ex) return ex;
  let best=null, bl=0;
  for(const pre of ['','z','u','vy','za','od','na','po','pře','roz','s']){ if(pre&&!nw0.startsWith(pre)) continue; const nw=nw0.slice(pre.length), ps=pos-pre.length; if(ps<1) continue;
  WORDS.filter(x=>x.p===p).forEach(x=>{ const nx=norm(x.w); let i=0; while(i<nx.length&&i<nw.length&&nx[i]===nw[i]) i++; if(i>ps+1 && i>bl){ bl=i; best=x; } }); }
  return best;
}
function parseText(t){
  const toks=[]; let ci=0;
  t.s.split(/(\s+)/).forEach(part=>{
    if(!part) return; if(/^\s+$/.test(part)){ toks.push({t:'sp', s:part}); return; }
    const m=part.match(/^([^\wÁ-ž]*)(.*?)([^\wÁ-ž)]*)$/u), core=m?m[2]:part;
    const k=core.indexOf('(');
    if(k>=0){ const e=core.indexOf(')',k), ch=core[k+1], over=core.slice(k+2,e).replace(/^:/,''), word=core.slice(0,k)+ch+core.slice(e+1), pos=k, P=core[k-1].toUpperCase();
      const base = over ? WORDS.find(x=>x.w===over) : textBase(word,P,pos);
      toks.push({t:'pre', s:m[1]}); toks.push({t:'w', cand:true, i:ci++, word, pos, ch, P, base}); toks.push({t:'pre', s:m[3]}); }
    else toks.push({t:'w', word:part});
  });
  return toks;
}
function buildPlevel(L){
  const p=game.m.p, pool=FDZ.TEXTS.filter(t=>p==='*'||t.p===p);
  const n=Math.min(L.count,pool.length);
  return weightedPick(pool, t=>1+2*(S.weak['t|'+t.t]||0), n).map(t=>({text:t, w:t.t, retry:true}));
}
function plevelRound(){
  const g=game, it=g.items[g.i], L=g.L, toks=parseText(it.text);
  const cands=toks.filter(x=>x.cand); const fakes=pickN(cands, Math.min(L.fakes, cands.length));
  fakes.forEach(x=>x.fake=true); g.toks=toks; g.fakeLeft=fakes.length;
  const html=toks.map((x,j)=>{
    if(x.t==='sp') return ' '; if(x.t==='pre') return esc(x.s);
    if(!x.cand) return `<span class="w" data-act="pw" data-j="${j}">${esc(x.word)}</span>`;
    const ch=x.fake?FDZ.swapIY(x.ch):x.ch, shown=x.word.slice(0,x.pos)+ch+x.word.slice(x.pos+1);
    return `<span class="w ${L.mark?'cand':''}" data-act="pw" data-j="${j}">${esc(shown)}</span>`; }).join('');
  show(`${hudHTML('Text')}
    <div class="paper casefile"><div class="cfhead"><span class="stamp">PLEVEL</span><h3 class="type">${esc(it.text.t)}</h3></div>
      <p class="cfinfo">Skřítek Plevelín přehodil i/y v <b id="fleft">${g.fakeLeft}</b> ${plural(g.fakeLeft,'slově','slovech','slovech')}. ${L.mark?'Podezřelá slova jsou podtržená.':'Klepni na slovo, které je napsané špatně.'}</p>
      <div class="casetext" id="ctext">${html}</div>
      <div id="hintbox"></div><div id="fixpanel"></div><div id="tryfb"></div><div id="fb"></div></div>`);
  g.phase='find'; newItem(); newQuestion(plevelFindHint);
}
function plevelFindHint(){
  const x=game.toks.find(t=>t.fake&&!t.done);
  return `Jedno chybné slovo má rozhodující písmeno po souhlásce <b>${x.P}</b>. U každého slova po ${x.P} se zeptej: je vyjmenované nebo příbuzné? Pak tam patří y, jinak i.`;
}
function plevelTap(el){
  const g=game; if(!g||g.phase!=='find') return;
  const j=+el.dataset.j, x=g.toks[j];
  if(x.fake&&!x.done){ stat('plevel','find',true,!g.findWrongs); return plevelFix(j); }
  if(x.done) return;
  g.findWrongs=(g.findWrongs||0)+1; confuse('plevel|ok');
  el.classList.remove('okword'); void el.offsetWidth; el.classList.add('okword');
  const reveal=wrongAttempt(); const tb=$('#tryfb'); if(tb&&tb.firstChild) tb.firstChild.insertAdjacentHTML('afterbegin','Tohle slovo je napsané dobře. ');
  if(reveal){ stat('plevel','find',false,false); const k=g.toks.findIndex(t=>t.fake&&!t.done); $('#tryfb').innerHTML='<div class="tryagain soft">🔎 Ukážu ti, kde chyba je. Teď ji oprav.</div>'; plevelFix(k); }
  save();
}
function plevelFix(j){
  const g=game, x=g.toks[j]; g.phase='fix'; g.fixing=j; g.findWrongs=0;
  document.querySelectorAll(`#ctext [data-j="${j}"]`).forEach(e=>e.classList.add('found'));
  const opts=isLong(x.ch)?['í','ý']:['i','y'];
  $('#fixpanel').innerHTML=`<div class="fix"><b>🌿 Plevel nalezen!</b> Jak se slovo píše správně?<div class="word big" style="margin:8px 0">${esc(x.word.slice(0,x.pos))}<span class="blank gapl">_</span>${esc(x.word.slice(x.pos+1))}</div>
    <div class="opts">${opts.map((v,i)=>`<button class="opt" data-act="xopt" data-v="${v}"><kbd>${i+1}</kbd><b class="big">${v}</b></button>`).join('')}</div></div>`;
  newQuestion(()=>hintWord({p:x.P,w:x.word,k:'?'}));
}
function plevelWhy(x){
  const b=x.base, Y=/[yý]/.test(x.ch);
  if(x.P==='V' && x.pos===1 && Y && !(b&&b.k!=='pre')) return 'předpona vy- / vý- se píše vždy s y';
  if(b && Y && b.k!=='i') return b.k==='pre' ? 'předpona vy- / vý- se píše vždy s y' : `patří k vyjmenovanému slovu <b>${esc(showW(b.k==='vs'?b.w:b.base))}</b> → y`;
  if(!Y) return 'není vyjmenované ani příbuzné s vyjmenovaným slovem → i';
  return 'patří mezi vyjmenovaná nebo příbuzná slova → y';
}
function plevelAnswer(v,el){
  const g=game; if(!g||g.phase!=='fix') return;
  const x=g.toks[g.fixing], ok=v===x.ch;
  if(!ok){ if(el){ el.disabled=true; el.classList.add('wrong'); } confuse((/[yý]/.test(x.ch)?'zi|':'zy|')+x.P);
    if(g.tries===0){ g.tries++; g.itemWrongs++; sfx.bad(); const kind=x.base?(x.base.k==='pre'||(x.P==='V'&&x.pos===1&&/[yý]/.test(x.ch)&&x.base.k!=='vs'&&x.base.k!=='pr')?'pre':x.base.k):(/[yý]/.test(x.ch)?'vs':'i');
      stepPanel(x.word.slice(0,x.pos)+'_'+x.word.slice(x.pos+1), x.P, kind, ()=>{}, ()=>plevelAnswer('#fail')); save(); return; }
    if(v!=='#fail' && !wrongAttempt()){ save(); return; } stat('plevel','fix',false,false); stat('pis',x.P,false,false); g.failedThis=true; }
  else { stat('plevel','fix',true,!g.itemWrongs); stat('pis',x.P,true,!g.itemWrongs); }
  x.done=true; g.fakeLeft--; g.phase='find';
  document.querySelectorAll(`#ctext [data-j="${g.fixing}"]`).forEach(e=>{ e.textContent=x.word; e.classList.remove('found'); e.classList.add('fixed'); });
  $('#fixpanel').innerHTML=''; $('#tryfb').innerHTML=''; $('#fleft').textContent=g.fakeLeft; sfx.ok(g.streak);
  $('#fb').innerHTML=`<div class="explain ${ok?'good':''}"><b>${esc(x.word)}</b> – po ${x.P} ${plevelWhy(x)}.</div>`;
  if(g.fakeLeft>0){ newQuestion(plevelFindHint); save(); return; }
  const it=g.items[g.i];
  if(g.failedThis||g.itemWrongs>=4){ scoreFailed(it); S.weak['t|'+it.text.t]=(S.weak['t|'+it.text.t]||0)+1; }
  else { scoreSolved(g.L.fakes*8); S.weak['t|'+it.text.t]=Math.max(0,(S.weak['t|'+it.text.t]||0)-1); }
  $('#score').textContent=g.score; g.failedThis=false;
  $('#fb').insertAdjacentHTML('beforeend',`<div class="explain good"><h3>🌼 Záhon je čistý!</h3><div class="actions"><button class="btn dark" data-act="next">${g.i+1<g.items.length?'Další text →':'Dokončit →'}</button></div></div>`);
  $('#fb').scrollIntoView({behavior:'smooth',block:'nearest'}); save();
}

/* ── Krok postupu po chybě u volby i / y (dvě možnosti by jinak šly „uhodnout“ napodruhé) ── */
const STEPK = {vs:'je to vyjmenované slovo (nebo jeho tvar)', pr:'je příbuzné s vyjmenovaným slovem', i:'ani jedno – není vyjmenované ani příbuzné', pre:'začíná předponou vy- / vý-'};
function stepPanel(word, p, kind, onOk, onFail){
  const g=game; g.step={kind, onOk, onFail};
  const ks=['vs','pr','i'].concat(p==='V'?['pre']:[]);
  document.querySelectorAll('.opt[data-act="popt"]:not([disabled]),.opt[data-act="xopt"]:not([disabled])').forEach(b=>{ b.disabled=true; b.dataset.wait='1'; });
  $('#tryfb').innerHTML=`<div class="tryagain">❌ ${pickMsg(MSG1)} <b>Pojďme na to postupem.</b>
    <p style="margin:8px 0 6px">Písmeno je po obojetné souhlásce <b>${p}</b>. Slovo <b>${esc(word)}</b>…</p>
    <div class="opts">${ks.map((k,i)=>`<button class="opt stepopt" data-act="sopt" data-v="${k}"><kbd>${i+1}</kbd>${STEPK[k]}</button>`).join('')}</div><div id="stepfb"></div></div>`;
  $('#tryfb').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function stepAnswer(v,el){
  const g=game, st=g.step; if(!st) return;
  if(v===st.kind){
    g.step=null; el.classList.add('right'); document.querySelectorAll('[data-act="sopt"]').forEach(b=>b.disabled=true);
    $('#stepfb').innerHTML=`<p style="margin:8px 0 0"><b>Ano!</b> ${st.kind==='i'?'Proto píšeme <b>i</b>.':'Proto píšeme <b>y</b>.'} Teď písmeno doplň.</p>`;
    document.querySelectorAll('.opt[data-wait]').forEach(b=>{ b.disabled=false; delete b.dataset.wait; }); st.onOk(); return;
  }
  el.disabled=true; el.classList.add('wrong'); g.tries++; g.itemWrongs++; sfx.bad();
  if(g.tries===2 && !g.hinted){ $('#stepfb').innerHTML=`<p style="margin:8px 0 0">❌ ${pickMsg(MSG2)} Zkus to znovu, nebo si vezmi nápovědu.</p><div class="actions"><button class="btn" data-act="wanthint">💡 Chci nápovědu</button></div>`; return; }
  if(g.tries===3 && !g.hinted){ showHint(); $('#stepfb').innerHTML='<p style="margin:8px 0 0">❌ Ještě ne. Mrkni na nápovědu nahoře.</p>'; return; }
  if(g.tries>=4 || [...document.querySelectorAll('[data-act="sopt"]:not([disabled])')].length<=1){ g.step=null; $('#tryfb').innerHTML=''; st.onFail(); return; }
  $('#stepfb').innerHTML=`<p style="margin:8px 0 0">❌ ${pickMsg(MSG2)} Zkus to znovu.</p>`;
}

/* ── hra: obecné kolo s možnostmi ── */
function buildPick(L){ return PICKGEN[game.m.gen](L); }
const BUILD = {pick:L=>buildPick(L), plevel:L=>buildPlevel(L)};
const ROUND = {pick:()=>pickRound(), plevel:()=>plevelRound()};
function startGame(dId,mId,lv){
  const d=BEDS.find(x=>x.id===dId), m=d.missions.find(x=>x.id===mId), L=m.levels.find(x=>x.lv==lv);
  drawCity(dId);
  game={d,m,L,i:0,score:0,streak:0,best:0,ok:0,tot:0,lives:3,mist:[],done:false,start:Date.now()};
  game.items = BUILD[m.type](L);
  ROUND[m.type]();
}
function hudHTML(label){
  const g=game;
  return `<div class="hud"><button class="chip" data-act="quit">✕ Konec</button>
    <span class="chip">${label} ${Math.min(g.i+1,g.items.length)}/${g.items.length}</span><span class="sp"></span>
    <span class="chip combo" id="combo">${g.streak>=3?`🔥 ×${mult()}`:'🔥 ×1'}</span><span class="chip">⭐ <span id="score">${g.score}</span></span>
  </div><div class="progress"><i style="width:${g.i/g.items.length*100}%"></i></div>`;
}
const mult = ()=> game.streak>=8?3 : game.streak>=3?2 : 1;
function potSVG(stage){   // květináč – rostlina roste s každou správnou odpovědí
  const st=Math.min(stage,6), leaf=c=>`<path d="${c}" fill="#5aa84a"/>`;
  let s=`<svg viewBox="0 0 120 140" aria-hidden="true"><ellipse cx="60" cy="134" rx="34" ry="5" fill="rgba(0,0,0,.25)"/>`;
  if(st>=1) s+=`<path d="M60 96 C60 80 60 70 ${60+st} ${92-st*9}" stroke="#4a8f3c" stroke-width="5" fill="none"/>`;
  if(st>=2) s+=leaf('M60 84 C44 78 40 66 42 62 C52 64 60 72 60 84Z');
  if(st>=3) s+=leaf('M61 74 C76 68 82 58 80 52 C70 54 62 62 61 74Z');
  if(st>=5) s+=`<g transform="translate(${60+st} ${92-st*9})">${[0,60,120,180,240,300].map(a=>`<ellipse rx="7" ry="13" fill="#ff8fb8" transform="rotate(${a}) translate(0 -11)"/>`).join('')}<circle r="8" fill="#ffd166"/></g>`;
  else if(st>=4) s+=`<circle cx="${60+st}" cy="${92-st*9}" r="8" fill="#ffb3cf"/>`;
  s+=`<path d="M30 96 h60 l-8 38 h-44z" fill="#c8693f"/><rect x="26" y="90" width="68" height="12" rx="4" fill="#d97c4f"/></svg>`;
  return s;
}
function pickRound(){
  const g=game, it=g.items[g.i];
  show(`${hudHTML(g.m.gen==='dvojice'?'Věta':'Slovo')}
    <div class="garden-stage" id="stage"><div class="pot bob" id="sus">${potSVG(g.grow||0)}</div>
      <div class="gardener">${gardenerSVG()}</div></div>
    <div class="paper step">
      <h3>${it.q}</h3><p class="hint">${it.sub}</p>
      <div id="hintbox"></div>
      <div class="opts ${it.gap?'tiles':''}">${it.opts.map((o,i)=>`<button class="opt ${o.cls||''}" data-act="popt" data-v="${esc(o.v)}"><kbd>${i+1}</kbd>${o.html}</button>`).join('')}</div>
      <div id="tryfb"></div><div id="fb"></div></div>`);
  newItem(); newQuestion(()=>it.hint); g.answered=false;
}
function pickAnswer(v,el){
  const g=game; if(!g||g.answered) return;
  const it=g.items[g.i], ok=it.ok.includes(v);
  if(ok){
    g.answered=true; $('#tryfb').innerHTML='';
    it.stats.forEach(([c,k])=>stat(c,k,true,!g.itemWrongs));
    document.querySelectorAll('.opt').forEach(b=>{ b.disabled=true; if(b.dataset.v===v) b.classList.add('right'); });
    const pts=scoreSolved(it.base);
    S.weak[it.weak]= g.itemWrongs ? (S.weak[it.weak]||0)+1 : Math.max(0,(S.weak[it.weak]||0)-1);
    if(!g.itemWrongs){ g.grow=(g.grow||0)+1; const pot=$('#sus'); pot.innerHTML=potSVG(g.grow); pot.classList.add('grow'); }
    sfx.ok(g.streak); $('#score').textContent=g.score;
    if(it.gap) document.querySelectorAll('.gapl').forEach(e=>{ e.textContent=it.x.w[it.x.pos]; e.classList.add('filled'); });
    $('#fb').innerHTML=`<div class="explain good"><h3>${g.itemWrongs?'Opraveno!':'Správně!'} +${pts}</h3>${it.why}<div class="actions"><button class="btn dark" data-act="next">Další →</button></div></div>`;
    $('#fb').scrollIntoView({behavior:'smooth',block:'nearest'}); save(); return;
  }
  if(el){ el.disabled=true; el.classList.add('wrong'); }
  confuse(it.conf(v));
  const pot=$('#sus'); pot.classList.remove('wilt'); void pot.offsetWidth; pot.classList.add('wilt');
  if(it.opts.length===2 && g.tries===0){       // dvě možnosti: napodruhé by to šlo uhodnout
    if(it.x){ g.tries++; g.itemWrongs++; sfx.bad(); stepPanel(it.x.w.slice(0,it.x.pos)+'_'+it.x.w.slice(it.x.pos+1), it.x.p, it.x.k, ()=>{}, ()=>pickFail(it)); save(); return; }
    wrongAttempt(); showHint(); $('#tryfb').innerHTML='<div class="tryagain">❌ To není ono. <b>Podívej se nahoře, co obě slova znamenají</b>, a vyber znovu.</div>'; save(); return;
  }
  if(!wrongAttempt()){ $('#tryfb').scrollIntoView({behavior:'smooth',block:'nearest'}); save(); return; }
  pickFail(it);
}
function pickFail(it){
  const g=game; if(g.answered) return;
  g.answered=true; it.stats.forEach(([c,k])=>stat(c,k,false,false)); scoreFailed(it); S.weak[it.weak]=(S.weak[it.weak]||0)+1;
  document.querySelectorAll('.opt').forEach(b=>{ b.disabled=true; if(it.ok.includes(b.dataset.v)) b.classList.add('right'); });
  if(it.gap) document.querySelectorAll('.gapl').forEach(e=>{ e.textContent=it.x.w[it.x.pos]; e.classList.add('filled'); });
  $('#fb').innerHTML=`<div class="explain"><h3>Takhle to je:</h3>${it.why}<div class="actions"><button class="btn dark" data-act="next">Rozumím →</button></div></div>`;
  $('#fb').scrollIntoView({behavior:'smooth',block:'nearest'}); save();
}
function next(){ game.i++; if(game.i>=game.items.length) finish(); else ROUND[game.m.type](); }

/* ── postava: zahradnice Bylinka ── */
function gardenerSVG(){
  return `<svg viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="146" rx="34" ry="5" fill="rgba(0,0,0,.25)"/>
    <path d="M28 146 C26 110 36 92 60 92 C84 92 94 110 92 146Z" fill="#4f9a5a"/><rect x="46" y="100" width="28" height="34" rx="6" fill="#f3e6c6"/>
    <circle cx="60" cy="66" r="26" fill="#f6c9a5"/><circle cx="50" cy="66" r="3.5" fill="#2a2118"/><circle cx="70" cy="66" r="3.5" fill="#2a2118"/>
    <path d="M51 77 Q60 84 69 77" stroke="#8a4b2e" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="44" cy="74" r="5" fill="#f4a3a3" opacity=".6"/><circle cx="76" cy="74" r="5" fill="#f4a3a3" opacity=".6"/>
    <ellipse cx="60" cy="44" rx="44" ry="10" fill="#e9c46a"/><path d="M38 44 C40 22 80 22 82 44Z" fill="#f2d27a"/><path d="M40 40 h40" stroke="#e8457b" stroke-width="5"/>
    <circle cx="80" cy="38" r="5" fill="#ff8fb8"/><circle cx="86" cy="42" r="4" fill="#ffd166"/></svg>`;
}

/* ══════════════ OBRAZOVKY ══════════════ */
function updateTop(){
  const r=rankOf(S.xp);
  $('#rankChip').innerHTML=`🌱 <span class="rk-name">${r.name} · </span>${S.xp} b.`;
  $('#soundBtn').textContent=S.sound?'🔊':'🔇';
  $('#demoBadge').hidden=!DEMO;
}
function locked(d,m,L){ return L.full && DEMO ? 'jen v plné verzi' : ''; }
function home(){
  game=null; drawCity('home');
  const r=rankOf(S.xp);
  show(`
    <div class="hero"><div class="who bob">${gardenerSVG()}</div>
      <div class="bubble">Ahoj, já jsem <b>zahradnice Bylinka</b>! Skřítek <b>Plevelín</b> mi na zahradě poschovával slova a prohazuje v nich <b>i</b> a <b>y</b>. Pomoz mi zahradu zachránit – každý záhon patří jedné obojetné souhlásce.</div></div>
    <button class="status" data-act="profile" title="Otevřít zahradnický deník">
      <div class="st wide"><small>🌱 Hodnost</small><b>${r.name}</b><div class="xpbar"><i style="width:${xpPct(S.xp)}%"></i></div><small>${S.xp} bodů${r.next?` · do hodnosti ${r.next[1]} chybí ${r.next[0]-S.xp}`:''}</small></div>
      <div class="st"><small>⭐ Hvězdy</small><b>${starsTotal()} / ${starsMax()}</b></div>
      <div class="st"><small>🧺 Úroda</small><b>${evCount()} / ${allMissions().length}</b></div>
      <div class="st"><small>🏅 Odznaky</small><b>${S.badges.length} / ${BADGES.length}</b></div>
      <div class="st"><small>🌼 Čisté záhony</small><b>${clueCount()} / ${BEDS.length}</b></div>
    </button>
    <h2 class="section-title">Zahrada</h2>
    ${sceneBanner('home', clueCount()===BEDS.length?'🎉 Zahrada je zachráněná!':'Záhony rozkvetou, až v nich budeš řešit úkoly')}
    <div class="districts">${BEDS.map(d=>{ const n=d.missions.length, dn=d.missions.filter(m=>evTier(m.id)).length, st=d.missions.reduce((a,m)=>a+m.levels.reduce((b,L)=>b+(S.stars[m.id+L.lv]||0),0),0);
      return `<button class="district open" data-act="district" data-id="${d.id}"><span class="glow"></span>${distDone(d)?'<span class="dstamp">ČISTÝ ✓</span>':''}
        <div class="ico">${d.letter==='*'?d.ico:`<span class="bedletter">${d.letter}</span>`}</div><h3>${d.name}</h3><p>${esc(d.desc)}</p>
        <span class="dprog">⭐ ${st}/${n*9} · 🧺 ${dn}/${n}</span></button>`; }).join('')}</div>
    <div class="mystery"><h2 class="section-title">🍓 Příběh zahrady</h2>
      <div class="clues">${BEDS.map(d=>distDone(d)?`<div class="cl"><span class="ci">${d.ico}</span> ${CLUES[d.id]}</div>`:`<div class="cl off"><span class="ci">❔</span> ${d.name}: vyřeš všechny jeho mise aspoň na 1 ★.</div>`).join('')}</div>
      ${clueCount()===BEDS.length?`<div class="clue final">🏆 ${FINAL_CLUE}</div>`:''}</div>
    ${DEMO?`<p class="demo-cta">Hraješ ukázku. Všechny úrovně najdeš v plné verzi na <a href="${FULL_URL}" target="_top">fajndoucko.cz</a>.</p>`:''}`);
  if(!S.intro) intro();
}
function intro(){
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="paper tape"><h2 class="type">Zahrada v nesnázích</h2>
    <p>Po obojetných souhláskách <b>B, L, M, P, S, V, Z</b> píšeme <b>y</b> jen ve <b>vyjmenovaných slovech</b> a ve slovech s nimi <b>příbuzných</b>. Všude jinde píšeme <b>i</b>.</p>
    <p>Skřítek Plevelín ale písmena prohazuje. Na každém záhonu tě čeká <b>Řada</b> (naučíš se vyjmenovaná slova), <b>Sázení</b> (doplníš i/y), <b>Kořeny</b> (najdeš příbuzná slova) a <b>Plevel</b> (opravíš chyby v textu).</p>
    <p>Za každou misi získáš <b>úrodu do sbírky</b> a zahrada bude kvést. Všechno najdeš v <b>Zahradnickém deníku</b> (📖 nahoře).</p>
    <div class="actions"><button class="btn" data-act="closeintro">Jdu na to!</button></div></div>`;
  document.body.appendChild(m);
}
function levelPicker(d,m){
  let sel=m.levels.find(L=>L.lv===S.sel[m.id] && !locked(d,m,L)) || m.levels.find(L=>!locked(d,m,L));
  return `<div class="diff-row"><span class="diff-lbl">Náročnost:</span><div class="diff" role="radiogroup">${m.levels.map(L=>{ const lk=locked(d,m,L);
      return `<button class="seg ${L===sel?'on':''}" role="radio" aria-checked="${L===sel}" ${lk?`disabled title="${lk}"`:''} data-act="lv" data-d="${d.id}" data-m="${m.id}" data-lv="${L.lv}">
        <b>${lk?'🔒 ':''}${DIFF[L.lv-1]}</b><span class="stars">${starsTxt(S.stars[m.id+L.lv]||0)}</span></button>`; }).join('')}</div></div>
    <p class="lvdesc"><b>${sel.name}</b> – ${sel.sub}</p>
    <button class="btn" data-act="play" data-d="${d.id}" data-m="${m.id}" data-lv="${sel.lv}">▶ Hrát</button>
    ${DEMO&&m.levels.some(L=>locked(d,m,L))?'<small class="demo-note">Střední a těžká náročnost jsou v plné verzi.</small>':''}`;
}
function district(id){
  const d=BEDS.find(x=>x.id===id); drawCity(id);
  show(`<button class="back" data-act="home">← Zahrada</button>
    <h2 class="section-title">${d.ico} ${d.name}</h2>
    ${sceneBanner(d.id, distDone(d)?'✓ Záhon je čistý':'Každá vyřešená mise tu něco vypěstuje ❔')}
    ${d.letter!=='*'?`<div class="paper vsbox"><b>Vyjmenovaná slova po ${d.letter}:</b> ${esc(vsList(d.letter))}</div>`:''}
    <div class="missions">${d.missions.map(m=>`<div class="paper mission"><div class="mico">${m.ico}${EVID[m.id]?`<span class="evmini" title="${EVID[m.id][1]}" style="${evTier(m.id)?'':'opacity:.3;filter:grayscale(1)'}">${EVID[m.id][0]}</span>`:''}</div>
      <div><h3>${m.name}</h3><p>${m.desc}</p>${levelPicker(d,m)}</div></div>`).join('')}</div>`);
}

/* ══════════════ ODMĚNY: úroda, příběh, cíle ══════════════ */
const EVID = {};
const splitIco = t=>{ const i=t.indexOf(' '); return [t.slice(0,i), t.slice(i+1)]; };
BEDS.forEach(d=>d.missions.forEach(m=>{ const b=BEDINFO[d.letter];
  EVID[m.id] = !b ? ({sklizen:['🍓','Jahody ze skleníku'], dvojice:['🦋','Motýl ze skleníku'], velkyplevel:['🏆','Zlatá konev']})[m.id]
    : m.gen==='rada' ? ['🌱',`Semínka ze záhonu ${d.letter}`] : m.gen==='sazeni' ? splitIco(b.flower) : m.gen==='koreny' ? splitIco(b.veg) : splitIco(b.tool); }));
const TIER_N = ['', 'bronzová', 'stříbrná', 'zlatá'];
const CLUES = {B:'Záhon B je čistý! Pod slunečnicemi jsi našel Plevelínovu čepičku.', L:'Záhon L kvete! Ve tulipánech zůstala Plevelínova stopa.', M:'Záhon M je zachráněný! Mrkev prozradila, kudy Plevelín utíkal.',
  P:'Záhon P voní růžemi. Plevelín tu ztratil svou lopatičku.', S:'Záhon S je plný salátu. Sýkora ti pošeptala, že se Plevelín schovává ve skleníku.',
  V:'Záhon V bzučí včelami. Na rajčatech jsi našel Plevelínův šátek.', Z:'Záhon Z je hotový! Brzy budeš mít Plevelína v hrsti.', sklenik:'Ve skleníku jsi Plevelína konečně chytil! Slíbil, že už nebude písmena prohazovat.'};
const FINAL_CLUE = 'Celá zahrada kvete! Zahradnice Bylinka pořádá <b>Slavnost úrody</b> a ty jsi čestný host. Plevelín teď pomáhá zalévat – a i a y už nikdy neprohodí. Gratulujeme, mistře zahradníku!';
function evTier(mid){ const m=allMissions().find(x=>x.id===mid); if(!m) return 0;
  const st=m.levels.map(L=>S.stars[mid+L.lv]||0), hard=m.levels[m.levels.length-1];
  return S.stars[mid+hard.lv]===3 ? 3 : st.includes(3) ? 2 : st.some(x=>x>0) ? 1 : 0; }
const distDone = d=>d.missions.every(m=>evTier(m.id)>0);
const starsTotal = ()=>allMissions().reduce((a,m)=>a+m.levels.reduce((b,L)=>b+(S.stars[m.id+L.lv]||0),0),0);
const starsMax = ()=>allMissions().reduce((a,m)=>a+m.levels.length*3,0);
const evCount = ()=>allMissions().filter(m=>evTier(m.id)>0).length;
const clueCount = ()=>BEDS.filter(distDone).length;
function evCard(mid,label,isNew){ const [ico,name]=EVID[mid]||['❔','Úroda'], t=evTier(mid);
  return `<div class="evcard t${t} ${isNew?'new':''}">${label?`<span class="evlbl">${label}</span>`:''}<span class="evico">${ico}</span><b>${name}</b><small>${t?TIER_N[t]+' úroda':'zatím nevypěstováno'}</small></div>`; }
function evHow(t){ return t>=3 ? 'Úroda je zlatá – lepší už to nejde!' : t===2 ? 'Získej 3 ★ na Těžké a úroda zezlátne.' : 'Získej 3 ★ a úroda bude stříbrná.'; }
function xpPct(xp){ const r=rankOf(xp), from=RANKS[r.i][0]; return r.next ? Math.round((xp-from)/(r.next[0]-from)*100) : 100; }
function rankOf(xp){ let r=RANKS[0],i=0; RANKS.forEach((x,j)=>{ if(xp>=x[0]){r=x;i=j;} }); return {name:r[1], i, next:RANKS[i+1]}; }

function finish(){
  const g=game; if(g.done) return; g.done=true;
  const acc=g.tot?g.ok/g.tot:0, stars= acc>=.9?3 : acc>=.75?2 : acc>=.5?1 : 0;
  const key=g.m.id+g.L.lv, prevRank=rankOf(S.xp).i, prevPct=xpPct(S.xp), prevTier=evTier(g.m.id), prevDist=distDone(g.d), prevAll=clueCount()===BEDS.length;
  S.stars[key]=Math.max(S.stars[key]||0,stars);
  S.xp+=g.score; logTime();
  S.hist=S.hist||[]; S.hist.unshift({t:Date.now(), m:g.m.name+(g.d.letter!=='*'?' '+g.d.letter:''), lv:g.L.lv, st:stars, acc:Math.round(acc*100), n:g.tot}); S.hist.length=Math.min(S.hist.length,40);
  const earned=[], give=id=>{ if(!S.badges.includes(id)){ S.badges.push(id); earned.push(BADGES.find(b=>b.id===id)); } };
  give('first'); if(g.mist.length===0&&stars) give('perfect'); if(g.best>=10) give('streak10');
  L7.forEach(p=>{ if(BEDS.find(d=>d.id===p).missions.every(m=>(S.stars[m.id+'1']||0)===3)) give('bed'+p); });
  if(L7.every(p=>evTier(p+'-rada'))) give('rady'); if(L7.every(p=>evTier(p+'-koreny'))) give('koreny');
  if(distDone(BEDS.find(d=>d.id==='sklenik'))) give('sklenik'); if(allMissions().every(m=>evTier(m.id))) give('zahrada'); if(S.xp>=1000) give('veteran');
  save(); updateTop(); drawCity();
  const rk=rankOf(S.xp), up=rk.i>prevRank, tier=evTier(g.m.id), newEv=tier>prevTier, nowDist=distDone(g.d), nowAll=clueCount()===BEDS.length;
  const left=g.d.missions.filter(m=>!evTier(m.id)).length, goals=[];
  if(tier<3) goals.push(evHow(tier));
  if(!nowDist) goals.push(`Vyřeš ještě ${left} ${left===1?'misi':left<5?'mise':'misí'} na tomto záhonu a bude úplně čistý.`);
  if(rk.next) goals.push(`Do hodnosti <b>${rk.next[1]}</b> ti chybí ${rk.next[0]-S.xp} bodů.`);
  const word=it=>it.text?`text „${esc(it.text.t)}“`:it.x?esc(it.x.w):esc(it.w);
  show(`<div class="paper tape result">
    <h2 class="type" style="color:var(--ink)">${stars?'Mise splněna':'Ještě to chce zalít'}</h2>
    <div class="bigstars">${[0,1,2].map(i=>`<span class="${i<stars?'':'off'}">★</span>`).join('')}</div>
    <div class="stats"><div class="stat"><b>${g.score}</b><small>bodů</small></div><div class="stat"><b>${Math.round(acc*100)} %</b><small>úspěšnost</small></div><div class="stat"><b>${g.best}</b><small>nejdelší série</small></div></div>
    <div class="rewards"><h3>🎁 Tvoje odměny</h3>
      <div class="rw-xp"><b>+${g.score} bodů</b> <small>(celkem ${S.xp})</small><div class="xpbar"><i id="rwxp" style="width:${up?0:prevPct}%" data-to="${xpPct(S.xp)}"></i></div>
        <small><b>${rk.name}</b>${rk.next?` → ${rk.next[1]}`:' – nejvyšší hodnost'}</small></div>
      ${up?`<div class="rankup">🎉 Povýšení! Nová hodnost: ${rk.name}</div>`:''}
      <div class="rw-row">${evCard(g.m.id, newEv?(prevTier?'ÚRODA VYLEPŠENA!':'NOVÁ ÚRODA!'):(tier?'tvoje úroda':''), newEv)}
        ${earned.map(b=>`<div class="bigbadge"><span class="bi">${b.ico}</span>${b.name}<small>Nový odznak! ${b.d}</small></div>`).join('')}</div>
      ${!tier?'<p style="text-align:center;font-weight:700">Úrodu z této mise sklidíš, až ji vyřešíš aspoň na 1 ★.</p>':''}
      ${nowDist&&!prevDist?`<div class="clue">🌼 <b>${esc(g.d.name)} je čistý!</b><br>${CLUES[g.d.id]}</div>`:''}
      ${nowAll&&!prevAll?`<div class="clue final">🏆 ${FINAL_CLUE}</div>`:''}
      ${goals.length?`<b>Další cíle:</b><ul class="goals">${goals.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>
    ${g.mist.length?`<div class="mistakes"><b>Tyhle si zopakujeme příště:</b><ul>${g.mist.map(it=>`<li>${word(it)}</li>`).join('')}</ul></div>`:''}
    <div class="actions"><button class="btn" data-act="play" data-d="${g.d.id}" data-m="${g.m.id}" data-lv="${g.L.lv}">↻ Znovu</button>
      <button class="btn dark" data-act="district" data-id="${g.d.id}">Zpět na záhon</button></div></div>
    ${DEMO?`<p class="demo-cta">Další úrovně čekají v plné verzi na <a href="${FULL_URL}" target="_top">fajndoucko.cz</a>.</p>`:''}`);
  setTimeout(()=>{ const x=$('#rwxp'); if(x) x.style.width=x.dataset.to+'%'; },350);
  if(stars>=2||newEv||earned.length){ sfx.win(); confetti(); }
}
function profile(){
  const r=rankOf(S.xp), bar=(label,a)=>{ const v=a&&a[1]?Math.round((a[2]!==undefined?a[2]:a[0])/a[1]*100):null;
    return `<div class="bar"><span>${label}</span><span class="track"><i style="width:${v||0}%;background:var(--n)"></i></span><span class="pct">${v===null?'–':v+' %'}</span></div>`; };
  show(`<button class="back" data-act="home">← Zahrada</button>
    <div class="paper profile"><div class="head"><div style="width:90px">${gardenerSVG()}</div><div><h2 class="type" style="color:var(--ink)">Zahradnický deník</h2>
      <b style="color:var(--f)">${r.name}</b> · ${S.xp} bodů<div class="xpbar"><i style="width:${xpPct(S.xp)}%"></i></div>
      <small style="color:var(--ink2);font-weight:800">${r.next?`Do hodnosti ${r.next[1]}: ${r.next[0]-S.xp} bodů`:'Nejvyšší hodnost!'}</small></div></div>
      <h3>🧺 Sbírka úrody (${evCount()} / ${allMissions().length})</h3>
      <p style="margin:4px 0 0;color:var(--ink2);font-weight:700">Za každou vyřešenou misi sklidíš úrodu: bronzovou za vyřešení, stříbrnou za 3 ★, zlatou za 3 ★ na Těžké.</p>
      <div class="evgrid">${allMissions().map(m=>evCard(m.id)).join('')}</div>
      <h3>🍓 Příběh zahrady (${clueCount()} / ${BEDS.length})</h3>
      ${BEDS.map(d=>`<div class="clue" style="${distDone(d)?'':'opacity:.55'}">${d.ico} ${distDone(d)?CLUES[d.id]:`${d.name}: zatím nevyřešeno.`}</div>`).join('')}
      ${clueCount()===BEDS.length?`<div class="clue final">🏆 ${FINAL_CLUE}</div>`:''}
      <h3>Jak ti jdou jednotlivá písmena (napoprvé)</h3><div class="bars">${L7.map(p=>bar('po '+p,(S.stats.pis||{})[p])).join('')}</div>
      <h3>🏅 Odznaky (${S.badges.length} / ${BADGES.length})</h3><div class="badges">${BADGES.map(b=>`<div class="badge ${S.badges.includes(b.id)?'':'off'}"><span class="bi">${b.ico}</span>${b.name}<br><small style="color:var(--ink2)">${b.d}</small></div>`).join('')}</div>
      <p style="color:var(--ink2);font-weight:700;margin-top:16px">Výsledky může vynulovat jen rodič v sekci <b>Pro rodiče</b>.</p></div>`);
}

/* ══════════════ SCÉNA ══════════════ */
let sceneView='home';
function sceneData(){ const tier={}, prog={};
  BEDS.forEach(d=>{ d.missions.forEach(m=>tier[m.id]=evTier(m.id)); prog[d.id]=d.missions.filter(m=>tier[m.id]>0).length/d.missions.length; });
  return {tier, prog, solved:BEDS.every(d=>prog[d.id]>=1)}; }
function sceneBanner(view, cap){ const o=sceneData();
  return `<div class="scenebanner" data-view="${view}"><svg viewBox="0 140 1200 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${FDGarden.render({...o, view, theme:document.documentElement.dataset.theme})}</svg>${cap?`<span class="cap">${cap}</span>`:''}</div>`; }
function drawCity(view){
  if(view!==undefined) sceneView=view;
  let o; try{ o=sceneData(); }catch(e){ o={tier:{},prog:{},solved:false}; }
  document.querySelectorAll('.scenebanner').forEach(b=>b.querySelector('svg').innerHTML=FDGarden.render({...o, view:b.dataset.view, theme:document.documentElement.dataset.theme}));
  $('#city').innerHTML=FDGarden.render({...o, view:sceneView, theme:document.documentElement.dataset.theme, bg:true});
}

/* ══════════════ PŘEHLED PRO RODIČE – obsah ══════════════ */
function confInfo(k){
  const [t,a,b]=k.split('|');
  if(t==='zi') return {txt:b==='pre'?'Píše „vi-“ místo předpony vy- / vý-':`Píše i místo y po ${a} (ve vyjmenovaném nebo příbuzném slově)`,
    tip:b==='pre'?'Předpona vy- / vý- se píše vždy s y (vyletět, výlet). Ukažte si, že bez předpony slovo dává smysl: vy-skočit → skočit.':`Říkejte si spolu řadu po ${a} nahlas (${esc(vsList(a))}) a hledejte k ní příbuzná slova – např. ${a==='B'?'bydlit → bydliště, obydlí':a==='L'?'mlýn → mlynář, mlýnek':a==='M'?'mýt → mýdlo, umývadlo':a==='P'?'pytel → pytlík, pytlák':a==='S'?'sypat → nasypat, násyp':a==='V'?'zvykat → zvyk, obvykle':'jazyk → jazýček'}.`};
  if(t==='zy') return {txt:`Píše y i tam, kde patří i (po ${a})`, tip:`Y po ${a} patří jen do vyjmenovaných a příbuzných slov. Když slovo v řadě není a s žádným vyjmenovaným slovem nesouvisí, píšeme i (např. ${a==='B'?'bílý, obilí':a==='L'?'lípa, klid':a==='M'?'milý, místo':a==='P'?'pivo, písek':a==='S'?'síla, silnice':a==='V'?'víla, vidět':'zima, zítra'}).`};
  if(t==='kor') return {txt:b==='i'?`Hledá vyjmenované slovo i tam, kde žádné není (po ${a})`:`Nepozná, ke kterému vyjmenovanému slovu slovo patří (po ${a})`, tip:'Hledejte společný kořen a význam: mlynář pracuje ve mlýně, bydliště je místo, kde bydlíme. Když význam nesouvisí, slovo není příbuzné.'};
  if(t==='rada') return {txt:`Neumí ještě řadu vyjmenovaných slov po ${a}`, tip:`Řadu se vyplatí umět nazpaměť jako básničku: ${esc(vsList(a))}. Zkuste ji říkat do rytmu nebo při chůzi.`};
  if(t==='dv') return {txt:`Plete si ${a.replace('/',' × ')}`, tip:'Rozhoduje význam: být (existovat) × bít (tlouct), mýt (umývat) × mít (vlastnit), výr (sova) × vír (voda). Ať dítě zkusí slovo nahradit jiným se stejným významem.'};
  if(t==='plevel') return {txt:'V textu označuje dobře napsaná slova jako chybná', tip:'Ať si dítě u podezřelého slova projde postup: je po obojetné souhlásce? Je vyjmenované, nebo příbuzné? Teprve pak rozhodne.'};
  return {txt:k, tip:''};
}
function recommend(){
  const C=[], add=(cat,k,label,mission,lv)=>{ const c=pc((S.stats[cat]||{})[k]); if(c.tot>=3) C.push({r:c.first/c.tot,label,mission,lv}); };
  L7.forEach(p=>{ add('rada',p,`řada po ${p}`,`Řada (záhon ${p})`,'Lehká'); add('pis',p,`i/y po ${p}`,`Sázení (záhon ${p})`,'Lehká'); add('koren',p,`příbuzná slova po ${p}`,`Kořeny (záhon ${p})`,'Lehká'); });
  [['pr','příbuzná slova'],['i','slova s i'],['pre','předpona vy-']].forEach(([k,l])=>add('typ',k,l,'Velká sklizeň','Střední'));
  add('plevel','find','hledání chyb v textu','Plevel','Lehká'); add('plevel','fix','oprava chyb v textu','Plevel','Lehká');
  const weak=C.filter(x=>x.r<.85).sort((a,b)=>a.r-b.r);
  if(weak.length){
    const groups=[]; weak.forEach(w=>{ let gr=groups.find(x=>x.mission===w.mission); if(!gr) groups.push(gr={mission:w.mission, lv:w.lv, items:[]}); if(gr.items.length<3) gr.items.push(w); });
    const line=gr=>`<b>${gr.mission} – ${gr.lv}</b> (${gr.items.map(w=>`${w.label}: ${Math.round(w.r*100)} % napoprvé`).join(', ')})`;
    return `Doporučujeme zahrát ${line(groups[0])}.${groups.length>1?` Potom: ${groups.slice(1,3).map(line).join('; ')}.`:''}`;
  }
  if(!C.length) return 'Zatím je málo dat. Doporučujeme začít misí <b>Řada – Lehká</b> na záhonu B a pak <b>Sázení – Lehká</b>.';
  const nx=allMissions().flatMap(m=>m.levels.map(L=>({m,L}))).find(x=>(S.stars[x.m.id+x.L.lv]||0)<3);
  return nx ? `Všechno procvičované jde dítěti dobře. Zkuste dál: <b>${nx.m.name}${nx.m.p!=='*'?' (záhon '+nx.m.p+')':''} – ${DIFF[nx.L.lv-1]}</b>.` : 'Výborně – všechny mise jsou na tři hvězdy.';
}
function parentDash(){
  const days=S.days||{}, keys=Object.keys(days);
  const T=keys.reduce((t,k)=>({first:t.first+days[k].first, help:t.help+days[k].help, fail:t.fail+days[k].fail, min:t.min+(days[k].min||0)}),{first:0,help:0,fail:0,min:0});
  const tot=T.first+T.help+T.fail, pct=n=>tot?Math.round(n/tot*100)+' %':'–';
  const last=[]; for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); last.push({d, v:days[dayKey(d)]||{first:0,help:0,fail:0,min:0}}); }
  const maxN=Math.max(1,...last.map(x=>x.v.first+x.v.help+x.v.fail));
  const bars=last.map(x=>{ const v=x.v, n=v.first+v.help+v.fail, lab=`${x.d.getDate()}. ${x.d.getMonth()+1}.`, seg=(m,cls)=> m?`<i class="${cls}" style="height:${m/maxN*100}%"></i>`:'';
    return `<div class="pday" title="${lab}: ${n} úloh – ${v.first} napoprvé, ${v.help} s pomocí, ${v.fail} neúspěšně${v.min?`, ${Math.round(v.min)} min`:''}"><span class="pv">${n||''}</span><div class="pcol">${seg(v.fail,'s3')}${seg(v.help,'s2')}${seg(v.first,'s1')}</div><span class="pd">${x.d.getDate()}.</span></div>`; }).join('');
  const conf=Object.entries(S.conf||{}).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const weakW=Object.entries(S.weak||{}).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]).slice(0,14).map(([k])=>{ const [t,w]=[k.slice(0,k.indexOf('|')),k.slice(k.indexOf('|')+1)];
    const title={w:'Sázení',k:'Kořeny',r:'Řada',d:'Záludné dvojice',t:'Plevel'}[t]||''; const x=WORDS.find(y=>y.w===w);
    return `<span class="pchip" title="${title}">${t==='d'?esc(w):t==='t'?'text „'+esc(w)+'“':x?fullHTML(x):esc(w)}</span>`; }).join('');
  const hist=(S.hist||[]).slice(0,10).map(h=>{ const d=new Date(h.t); return `<tr><td>${d.getDate()}. ${d.getMonth()+1}.</td><td>${esc(h.m)}</td><td>${DIFF[h.lv-1]}</td><td class="pst">${starsTxt(h.st)}</td><td>${h.acc} %</td><td>${h.n}</td></tr>`; }).join('');
  pModal(`
    <div class="ptiles"><div class="ptile"><b>${tot}</b><span>úloh celkem</span></div><div class="ptile"><b>${pct(T.first)}</b><span>napoprvé</span></div>
      <div class="ptile"><b>${pct(T.help)}</b><span>s pomocí</span></div><div class="ptile"><b>${pct(T.fail)}</b><span>neúspěšně</span></div>
      <div class="ptile"><b>${Math.round(T.min)}</b><span>${plural(Math.round(T.min),'minuta','minuty','minut')} hraní</span></div>
      <div class="ptile"><b>${(S.hist||[]).length}</b><span>${plural((S.hist||[]).length,'dokončená mise','dokončené mise','dokončených misí')}</span></div></div>
    <div class="prec">🎯 ${recommend()}</div>
    <div class="plegend"><span><i class="s1"></i>napoprvé</span><span><i class="s2"></i>s pomocí (opravilo se)</span><span><i class="s3"></i>neúspěšně (ukázali jsme řešení)</span></div>
    <h3>Aktivita za posledních 14 dní</h3><div class="pchart">${bars}</div>
    <h3>Dovednosti</h3>
    <div class="pgroup"><h4>Psaní i / y podle souhlásky <small>Sázení, Plevel</small></h4>${L7.map(p=>skillRow(`po ${p}`,(S.stats.pis||{})[p])).join('')}</div>
    <div class="pgroup"><h4>Druh slova <small>Sázení, Kořeny</small></h4>${['vs','pr','i','pre'].map(k=>skillRow(KTYP[k],(S.stats.typ||{})[k])).join('')}</div>
    <div class="pgroup"><h4>Řada vyjmenovaných slov <small>Řada</small></h4>${L7.map(p=>skillRow(`řada po ${p}`,(S.stats.rada||{})[p])).join('')}</div>
    <div class="pgroup"><h4>Příbuzná slova – hledání kořene <small>Kořeny</small></h4>${L7.map(p=>skillRow(`příbuzná slova po ${p}`,(S.stats.koren||{})[p])).join('')}</div>
    <div class="pgroup"><h4>Práce s textem <small>Plevel</small></h4>${skillRow('najít chybu v textu',(S.stats.plevel||{}).find)}${skillRow('opravit chybu',(S.stats.plevel||{}).fix)}</div>
    <div class="pgroup"><h4>Záludné dvojice <small>Velký skleník</small></h4>${[...new Set(FDZ.DVOJICE.map(d=>[d[1],d[2]].sort().join('/')))].map(pr=>skillRow(pr.replace('/',' × '),(S.stats.dvojice||{})[pr])).join('')}</div>
    <p class="pnote">Stav: <b>✓ zvládá</b> = aspoň 85 % napoprvé · <b>~ procvičuje</b> = 60–85 % · <b>! potřebuje pomoc</b> = pod 60 % · hodnotíme až od 3 pokusů.</p>
    <h3>Na co se zaměřit</h3>
    ${conf.length?`<div class="pconf">${conf.map(([k,n])=>{ const c=confInfo(k); return `<div class="pci"><b>${c.txt}</b> <span class="pcount">${n}×</span><p>💡 ${c.tip}</p></div>`; }).join('')}</div>`:'<p class="pnote">Zatím žádné opakované záměny.</p>'}
    ${weakW?`<h3>Slova, která dělají potíže</h3><div class="pchips">${weakW}</div>`:''}
    <h3>Poslední mise</h3>
    ${hist?`<div class="ptable"><table><thead><tr><th>Den</th><th>Mise</th><th>Náročnost</th><th>Hvězdy</th><th>Úspěšnost</th><th>Úloh</th></tr></thead><tbody>${hist}</tbody></table></div>`:'<p class="pnote">Zatím žádná dokončená mise.</p>'}
    <h3>Jak modul učí</h3>
    <div class="pdid">
      <p>Dítě se u každé úlohy může <b>samo opravit</b>: po 1. chybě zkouší znovu, po 2. si může vzít nápovědu, po 3. nápovědu dostane (vede k postupu, neprozradí výsledek) a teprve po 4. chybě ukážeme řešení s vysvětlením.</p>
      <p><b>Postup jako ve škole:</b> 1) je písmeno po obojetné souhlásce? 2) je slovo vyjmenované? 3) je s vyjmenovaným slovem příbuzné (stejný kořen)? → y; jinak i. Předpona vy- / vý- se píše vždy s y.</p>
      <p><b>Učíme i řadu nazpaměť</b> (mise Řada) a hledání kořene (mise Kořeny), protože bez nich se pravopis jen hádá. Chybná slova se dítěti vracejí častěji.</p>
    </div>
    <div class="actions noprint" style="justify-content:flex-start"><button class="btn ghost" data-act="p-pass">Změnit heslo</button>
      <button class="btn ghost" data-act="p-reset">Vynulovat výsledky dítěte</button><button class="btn dark" data-act="p-close">Hotovo</button></div>
    <p class="pnote">Heslo i statistiky zůstávají jen v tomto zařízení a prohlížeči.</p>`);
}

/* ══════════════ OVLÁDÁNÍ ══════════════ */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b||b.disabled) return;
  const a=b.dataset.act;
  if(a==='home') home();
  else if(a==='district') district(b.dataset.id);
  else if(a==='play') startGame(b.dataset.d,b.dataset.m,b.dataset.lv);
  else if(a==='lv'){ S.sel[b.dataset.m]=+b.dataset.lv; save(); const y=window.scrollY; district(b.dataset.d); window.scrollTo(0,y); }
  else if(a==='next') next();
  else if(a==='popt') pickAnswer(b.dataset.v,b);
  else if(a==='sopt') stepAnswer(b.dataset.v,b);
  else if(a==='pw') plevelTap(b);
  else if(a==='xopt') plevelAnswer(b.dataset.v,b);
  else if(a==='tryagain') $('#tryfb').innerHTML='';
  else if(a==='wanthint'){ showHint(); if(game&&game.step){ $('#stepfb').innerHTML='<p style="margin:8px 0 0">💡 Nápověda je nahoře. Zkus to znovu.</p>'; } else $('#tryfb').innerHTML='<div class="tryagain soft">💡 Nápověda je nahoře. Zkus to znovu.</div>'; }
  else if(a==='quit'){ const id=game.d.id; logTime(); save(); game=null; district(id); }
  else if(a==='profile') profile();
  else if(a==='theme') cycleTheme();
  else if(a==='sound'){ S.sound=!S.sound; save(); updateTop(); }
  else if(a==='closeintro'){ S.intro=true; save(); b.closest('.modal').remove(); }
  else if(a==='parent') openParent();
  else if(a&&a.startsWith('p-')) parentAction(a,b);
});
document.addEventListener('keydown',e=>{
  if($('#pmodal')){
    if(e.key==='Escape') closeParent();
    else if(e.key==='Enter'){ const b=$('#pmodal [data-act="p-login"],#pmodal [data-act="p-setup"],#pmodal [data-act="p-forgot-ok"]'); if(b){ e.preventDefault(); b.click(); } }
    return;
  }
  if(!game||game.done) return;
  const n=+e.key;
  if(n>=1){ const o=(game.step?document.querySelectorAll('[data-act="sopt"]'):game.m.type==='plevel'?document.querySelectorAll('#fixpanel .opt'):document.querySelectorAll('.opt'))[n-1]; if(o&&!o.disabled) o.click(); }
  else if(e.key==='Enter'){ const nb=$('[data-act="next"]'); if(nb){ e.preventDefault(); nb.click(); } }
});
