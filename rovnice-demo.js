(() => {
"use strict";
const FULL="https://fajndoucko.cz/fajncvicebna/";
const DEMO_MAX=12;
const DEMO_PER_SESSION=4;

// Demo ukazuje čtyři reprezentativní oblasti, ne celý katalog.
const picks=[
  {match:"Dva kroky",label:"Základ · dva kroky"},
  {match:"Jedna závorka",label:"Školní · závorka"},
  {match:"x na obou stranách — náročnější",label:"Pokročilá · x na obou stranách"},
  {match:"Znaménko před závorkou",label:"Mistr · znaménko před závorkou"}
];
const keep=[];
picks.forEach(p=>{
  const t=TOPICS.find(x=>x.name===p.match);
  if(t){ t.section="Ukázka · "+p.label; keep.push(t); }
});
TOPICS.splice(0,TOPICS.length,...keep);

function demoCount(){return Number(localStorage.getItem("fajnrovnice-demo-count")||0);}
function addDemo(n){localStorage.setItem("fajnrovnice-demo-count",String(demoCount()+n));}
function limitModal(){
  let o=document.getElementById("rv-demo-limit");
  if(!o){
    o=document.createElement("div");o.id="rv-demo-limit";o.className="rv-demo-overlay";
    o.innerHTML='<div class="rv-demo-modal"><div class="rv-demo-kicker">FajnRovnice · demo</div>'+
      '<h2>Ukázku už máš vyzkoušenou</h2><p>V demu je 12 rovnic ze čtyř různých obtížností. Plná FajnCvičebna obsahuje celý výběr témat, dlouhodobý pokrok, rodičovský přehled a kompletní Laboratoř neznámé X.</p>'+
      '<a class="rv-demo-full" href="'+FULL+'">Chci plnou verzi</a>'+
      '<button class="rv-demo-close">Ještě se podívám</button></div>';
    document.body.appendChild(o);
    o.querySelector(".rv-demo-close").onclick=()=>o.classList.remove("show");
  }
  o.classList.add("show");
}
const oldStart=startSession;
startSession=function(idx){
  if(demoCount()>=DEMO_MAX){limitModal();return;}
  oldStart(idx);
  if(SES.eqs.length>DEMO_PER_SESSION) SES.eqs=SES.eqs.slice(0,DEMO_PER_SESSION);
  renderEquation();
};
const oldProcess=processStep;
processStep=function(raw){
  const before=SES?.solved||0;
  oldProcess(raw);
  if((SES?.solved||0)>before)addDemo(1);
};
const oldReveal=window.revealSolution;
if(oldReveal) window.revealSolution=function(){
  if(!SES?.done)addDemo(1);
  oldReveal();
};

// Demo rodičovská sekce: vysvětlení, žádné nastavování hesla.
function replaceParent(){
  const b=document.getElementById("parent-open-btn");
  if(!b)return;
  const clone=b.cloneNode(true); b.replaceWith(clone);
  clone.onclick=()=>{
    let o=document.getElementById("rv-demo-parent");
    if(!o){
      o=document.createElement("div");o.id="rv-demo-parent";o.className="rv-demo-overlay";
      o.innerHTML='<div class="rv-demo-modal"><div class="rv-demo-kicker">V plné verzi</div><h2>Přehled pro rodiče</h2>'+
       '<p>Rodičovská část je chráněná vlastním heslem. Ukáže počet vyřešených rovnic, přeskočené příklady, zobrazená řešení, XP a přehled práce podle témat.</p>'+
       '<p>Přeskočená rovnice se nepočítá jako chyba — rodič jen vidí, kolikrát dítě zvolilo „na tu si netroufám“.</p>'+
       '<a class="rv-demo-full" href="'+FULL+'">Chci plnou verzi</a><button class="rv-demo-close">Zavřít</button></div>';
      document.body.appendChild(o);o.querySelector(".rv-demo-close").onclick=()=>o.classList.remove("show");
    } o.classList.add("show");
  };
}
const oldHome=renderHome;
renderHome=function(){
  oldHome();
  const eyebrow=document.querySelector(".home-eyebrow"); if(eyebrow) eyebrow.textContent="FajnRovnice · ukázka";
  const title=document.querySelector(".home-title"); if(title) title.textContent="Vyzkoušej si rovnice";
  const sub=document.querySelector(".home-sub"); if(sub) sub.textContent="Čtyři typy obtížnosti. Napiš další krok, nebo rovnou výsledek.";
  const controls=document.getElementById("rovnice-controls");
  if(controls) controls.style.display="none";
  replaceParent();
  let cta=document.getElementById("rv-demo-cta");
  if(!cta){
    cta=document.createElement("a");cta.id="rv-demo-cta";cta.href=FULL;cta.className="rv-demo-topcta";cta.textContent="Chci plnou verzi";
    document.querySelector("#screen-home .app-header .hdr-right")?.prepend(cta);
  }
};
const css=document.createElement("style");
css.textContent=`
.rv-demo-topcta{font-size:.68rem;font-weight:800;text-decoration:none;color:var(--accent);border:1px solid var(--border);border-radius:10px;padding:6px 8px;background:var(--paper)}
.rv-demo-overlay{position:fixed;inset:0;z-index:9999;background:rgba(20,24,45,.58);display:none;place-items:center;padding:20px}.rv-demo-overlay.show{display:grid}
.rv-demo-modal{width:min(420px,100%);background:var(--paper);color:var(--ink);border-radius:18px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.rv-demo-kicker{text-transform:uppercase;letter-spacing:2px;font-size:.62rem;color:var(--accent);font-weight:900}.rv-demo-modal h2{font-family:'Playfair Display',serif;margin:5px 0 10px}.rv-demo-modal p{font-size:.84rem;line-height:1.55;color:var(--ink2)}
.rv-demo-full{display:block;text-align:center;background:var(--accent);color:#fff;text-decoration:none;border-radius:11px;padding:12px;font-weight:900;margin-top:15px}.rv-demo-close{display:block;width:100%;border:0;background:none;color:var(--ink2);padding:12px;cursor:pointer}
`;
document.head.appendChild(css);
renderHome();
})();