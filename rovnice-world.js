(() => {
"use strict";

const WORLD_STAGES = [
  {n:"Prázdná dílna",icon:"◇",need:0},
  {n:"Stůl badatele",icon:"▱",need:5},
  {n:"Rozsvícená laboratoř",icon:"✦",need:15},
  {n:"Stroj na rovnice",icon:"⚙",need:30},
  {n:"Řídicí centrum",icon:"⌁",need:50},
  {n:"Trezor neznámé X",icon:"✕",need:75},
  {n:"Mistrovská laboratoř",icon:"★",need:110}
];
function solvedCount(){ return Number(ST?.stats?.solved)||0; }
function stageIndex(){
  const s=solvedCount(); let i=0;
  WORLD_STAGES.forEach((x,n)=>{if(s>=x.need)i=n;}); return i;
}
function worldHtml(){
  const solved=solvedCount(), idx=stageIndex(), cur=WORLD_STAGES[idx], next=WORLD_STAGES[idx+1];
  const from=cur.need, to=next?next.need:cur.need;
  const pct=next?Math.max(0,Math.min(100,(solved-from)/(to-from)*100)):100;
  const nodes=WORLD_STAGES.map((s,i)=>{
    const state=i<idx?"done":i===idx?"current":"locked";
    return '<div class="rvw-node '+state+'"><span>'+s.icon+'</span><small>'+s.n+'</small></div>';
  }).join("");
  const sub=next
    ? 'Ještě <strong>'+(next.need-solved)+'</strong> vyřešených rovnic a odemkneš: <strong>'+next.n+'</strong>.'
    : 'Laboratoř je kompletní. Teď už jde o mistrovství.';
  return '<section class="rv-world"><div class="rvw-head"><div><div class="rvw-kicker">Tvoje laboratoř neznámé X</div>'+
    '<div class="rvw-title">'+cur.icon+' '+cur.n+'</div></div><div class="rvw-count">'+solved+' ✓</div></div>'+
    '<div class="rvw-scene stage-'+idx+'">'+
      '<div class="rvw-glow"></div><div class="rvw-floor"></div>'+
      '<div class="rvw-table">▱</div><div class="rvw-lamp">✦</div><div class="rvw-gear">⚙</div>'+
      '<div class="rvw-screen">x = ?</div><div class="rvw-safe">✕</div><div class="rvw-star">★</div>'+
    '</div><div class="rvw-progress"><i style="width:'+pct+'%"></i></div>'+
    '<div class="rvw-sub">'+sub+'</div><div class="rvw-nodes">'+nodes+'</div></section>';
}
function ensureWorld(){
  let host=document.getElementById("rv-world-host");
  if(!host){
    host=document.createElement("div"); host.id="rv-world-host";
    const hero=document.querySelector("#screen-home .home-hero");
    if(hero) hero.insertAdjacentElement("afterend",host);
  }
  host.innerHTML=worldHtml();
}
function ensureResultWorld(){
  const box=document.querySelector("#screen-result .result-body");
  if(!box)return;
  let r=document.getElementById("rv-result-world");
  if(!r){
    r=document.createElement("div"); r.id="rv-result-world"; r.className="rv-result-world";
    const actions=box.querySelector(".res-actions"); box.insertBefore(r,actions);
  }
  const solved=solvedCount(), idx=stageIndex(), next=WORLD_STAGES[idx+1];
  r.innerHTML='<strong>Laboratoř: '+WORLD_STAGES[idx].n+'</strong><span>'+
    (next?'Další část za '+Math.max(0,next.need-solved)+' vyřešených rovnic.':'Mistrovská laboratoř je kompletní.')+'</span>';
}
const oldRenderHome=renderHome;
renderHome=function(){ oldRenderHome(); ensureWorld(); };
const oldFinish=finishSession;
finishSession=function(){ oldFinish(); ensureResultWorld(); };

const css=document.createElement("style");
css.textContent=`
#rv-world-host{max-width:500px;margin:12px auto 2px;padding:0 18px}
.rv-world{background:linear-gradient(160deg,#161c35,#252d54);color:#fff;border-radius:18px;padding:14px;box-shadow:0 12px 30px rgba(20,27,58,.18);overflow:hidden}
.rvw-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.rvw-kicker{font-size:.58rem;letter-spacing:1.8px;text-transform:uppercase;opacity:.65}
.rvw-title{font-family:'Playfair Display',serif;font-weight:800;font-size:1.12rem;margin-top:2px}.rvw-count{font-family:'JetBrains Mono',monospace;font-size:.72rem;background:rgba(255,255,255,.1);padding:5px 8px;border-radius:12px}
.rvw-scene{height:112px;position:relative;margin:10px -4px 8px;border-radius:12px;overflow:hidden;background:linear-gradient(#11172d,#20294c)}
.rvw-floor{position:absolute;left:0;right:0;bottom:0;height:32%;background:linear-gradient(165deg,#303a62,#1b2342);clip-path:polygon(0 35%,100% 0,100% 100%,0 100%)}
.rvw-glow{position:absolute;width:150px;height:150px;border-radius:50%;left:50%;top:-85px;transform:translateX(-50%);background:radial-gradient(circle,rgba(116,150,255,.28),transparent 68%);opacity:0}
.rvw-table,.rvw-lamp,.rvw-gear,.rvw-screen,.rvw-safe,.rvw-star{position:absolute;opacity:.08;transition:.3s}.rvw-table{font-size:64px;left:13%;bottom:13px;transform:rotate(-4deg)}
.rvw-lamp{font-size:30px;left:42%;top:13px}.rvw-gear{font-size:35px;right:30%;bottom:18px}.rvw-screen{right:8%;top:19px;border:2px solid currentColor;border-radius:7px;padding:7px;font:700 .8rem 'JetBrains Mono'}
.rvw-safe{font-size:43px;right:9%;bottom:4px}.rvw-star{font-size:32px;left:50%;top:43%;transform:translate(-50%,-50%)}
.stage-1 .rvw-table,.stage-2 .rvw-table,.stage-3 .rvw-table,.stage-4 .rvw-table,.stage-5 .rvw-table,.stage-6 .rvw-table{opacity:.85}
.stage-2 .rvw-lamp,.stage-3 .rvw-lamp,.stage-4 .rvw-lamp,.stage-5 .rvw-lamp,.stage-6 .rvw-lamp{opacity:1;text-shadow:0 0 18px #ffe88a}.stage-2 .rvw-glow,.stage-3 .rvw-glow,.stage-4 .rvw-glow,.stage-5 .rvw-glow,.stage-6 .rvw-glow{opacity:1}
.stage-3 .rvw-gear,.stage-4 .rvw-gear,.stage-5 .rvw-gear,.stage-6 .rvw-gear{opacity:.9}.stage-3 .rvw-gear{animation:rvspin 7s linear infinite}
.stage-4 .rvw-screen,.stage-5 .rvw-screen,.stage-6 .rvw-screen{opacity:1;color:#9fffc6;box-shadow:0 0 14px rgba(100,255,180,.15)}
.stage-5 .rvw-safe,.stage-6 .rvw-safe{opacity:1;color:#ffd86b}.stage-6 .rvw-star{opacity:1;color:#fff3a1;text-shadow:0 0 20px #ffd86b}
@keyframes rvspin{to{transform:rotate(360deg)}}.rvw-progress{height:7px;background:rgba(255,255,255,.12);border-radius:8px;overflow:hidden}.rvw-progress i{display:block;height:100%;background:linear-gradient(90deg,#7ca0ff,#a8ffcb);border-radius:8px}
.rvw-sub{font-size:.69rem;opacity:.82;margin:7px 0 10px;line-height:1.4}.rvw-nodes{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.rvw-node{text-align:center;opacity:.28}.rvw-node.done,.rvw-node.current{opacity:1}.rvw-node.current span{background:#fff;color:#1e2748}
.rvw-node span{display:grid;place-items:center;width:25px;height:25px;margin:auto;border:1px solid rgba(255,255,255,.35);border-radius:50%;font-size:.7rem}.rvw-node small{display:none}
.rv-result-world{width:100%;background:var(--paper);border:1.5px solid var(--border);border-radius:11px;padding:10px 12px;margin:0 0 14px;font-size:.76rem}.rv-result-world strong,.rv-result-world span{display:block}.rv-result-world span{color:var(--ink2);margin-top:2px}
@media(min-width:520px){.rvw-node small{display:block;font-size:.48rem;line-height:1.1;margin-top:4px}}
`;
document.head.appendChild(css);
ensureWorld();
})();