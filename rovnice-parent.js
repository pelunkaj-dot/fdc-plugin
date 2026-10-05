(() => {
"use strict";

async function rvHash(text){
  const data=new TextEncoder().encode(text);
  const hash=await crypto.subtle.digest("SHA-256",data);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function rvAuth(){
  if(!ST.parentAuth) ST.parentAuth={salt:"",hash:""};
  return ST.parentAuth;
}
function rvSalt(){
  const a=new Uint32Array(4); crypto.getRandomValues(a);
  return Array.from(a).map(n=>n.toString(16)).join("");
}
function rvCloseParent(){
  document.getElementById("rv-parent-overlay")?.classList.remove("show");
}
function rvEnsureParent(){
  if(!document.getElementById("parent-open-btn")){
    const hdr=document.querySelector("#screen-home .hdr-right");
    if(hdr){
      const b=document.createElement("button");
      b.id="parent-open-btn"; b.type="button"; b.className="rv-parent-btn"; b.textContent="Pro rodiče";
      b.addEventListener("click",rvOpenParent); hdr.prepend(b);
    }
  }
  if(document.getElementById("rv-parent-overlay")) return;
  const o=document.createElement("div");
  o.id="rv-parent-overlay"; o.className="rv-parent-overlay";
  o.innerHTML='<div class="rv-parent-modal" role="dialog" aria-modal="true">'+
    '<div class="rv-parent-head"><div><div class="rv-parent-kicker">FajnRovnice</div>'+
    '<div class="rv-parent-title">Přehled pro rodiče</div></div>'+
    '<button type="button" class="rv-parent-close" aria-label="Zavřít">✕</button></div>'+
    '<div id="rv-parent-body"></div></div>';
  document.body.appendChild(o);
  o.querySelector(".rv-parent-close").addEventListener("click",rvCloseParent);
  o.addEventListener("click",e=>{if(e.target===o)rvCloseParent();});
}
function rvLoginHtml(first){
  return '<div class="rv-parent-login"><p>'+
    (first?'Při prvním otevření si nastavte heslo. Statistiky dítěte zůstanou uložené v tomto zařízení.':'Zadejte rodičovské heslo.')+
    '</p><label>'+(first?'Nastavit rodičovské heslo':'Rodičovské heslo')+'</label>'+
    '<input id="rv-parent-pass" type="password" placeholder="alespoň 4 znaky">'+
    (first?'<input id="rv-parent-pass2" type="password" placeholder="heslo znovu">':'')+
    '<div class="rv-parent-error" id="rv-parent-error"></div>'+
    '<button class="btn-primary" id="rv-parent-submit">'+(first?'Nastavit a otevřít':'Otevřít přehled')+'</button>'+
    (first?'':'<button class="rv-parent-link" id="rv-parent-resetpass">Zapomenuté heslo / nastavit nové</button>')+
    '</div>';
}
async function rvOpenParent(){
  rvEnsureParent();
  const o=document.getElementById("rv-parent-overlay"); o.classList.add("show");
  const auth=rvAuth(), first=!auth.hash||!auth.salt;
  const body=document.getElementById("rv-parent-body"); body.innerHTML=rvLoginHtml(first);
  document.getElementById("rv-parent-submit").addEventListener("click",async()=>{
    const pass=document.getElementById("rv-parent-pass").value;
    const err=document.getElementById("rv-parent-error");
    if(pass.length<4){err.textContent="Heslo musí mít alespoň 4 znaky.";return;}
    if(first){
      const pass2=document.getElementById("rv-parent-pass2").value;
      if(pass!==pass2){err.textContent="Hesla se neshodují.";return;}
      const salt=rvSalt(); ST.parentAuth={salt,hash:await rvHash(salt+"|"+pass)}; saveST(); rvDashboard();
    }else{
      if(await rvHash(auth.salt+"|"+pass)!==auth.hash){err.textContent="Nesprávné heslo.";return;}
      rvDashboard();
    }
  });
  const reset=document.getElementById("rv-parent-resetpass");
  if(reset) reset.addEventListener("click",()=>{ST.parentAuth={salt:"",hash:""};saveST();rvOpenParent();});
}
function rvDashboard(){
  const body=document.getElementById("rv-parent-body");
  const s=ST.stats||{solved:0,skipped:0,revealed:0};
  const rows=Object.entries(ST.topicStats||{}).map(([i,x])=>({topic:TOPICS[Number(i)],...x}))
    .filter(r=>r.topic&&((r.solved||0)+(r.skipped||0)+(r.revealed||0)>0))
    .sort((a,b)=>(b.skipped||0)-(a.skipped||0));
  let table='';
  if(rows.length){
    table=rows.map(r=>'<div class="rv-parent-row"><div><strong>'+r.topic.name+'</strong>'+
      '<small>Úroveň '+(r.topic.level||1)+'</small></div><span>✓ '+(r.solved||0)+'</span>'+
      '<span>↷ '+(r.skipped||0)+'</span><span>👁 '+(r.revealed||0)+'</span></div>').join('');
  }else table='<div class="rv-parent-empty">Zatím nejsou uložené žádné výsledky.</div>';
  body.innerHTML='<div class="rv-parent-grid">'+
    '<div class="rv-stat"><strong>'+(s.solved||0)+'</strong><span>vyřešeno</span></div>'+
    '<div class="rv-stat"><strong>'+(s.skipped||0)+'</strong><span>přeskočeno</span></div>'+
    '<div class="rv-stat"><strong>'+(s.revealed||0)+'</strong><span>zobrazeno řešení</span></div>'+
    '<div class="rv-stat"><strong>'+(ST.xp||0)+'</strong><span>XP</span></div></div>'+
    '<div class="rv-parent-note">Přeskočená rovnice není chyba. Je to informace, že si na ni dítě netrouflo. Zobrazení řešení evidujeme zvlášť.</div>'+
    '<div class="rv-parent-subtitle">Aktivita podle témat</div><div class="rv-parent-table">'+table+'</div>'+
    '<div class="rv-parent-actions"><button class="btn-secondary" id="rv-change-pass">Změnit rodičovské heslo</button>'+
    '<button class="btn-secondary" id="rv-reset-progress">Vynulovat výsledky dítěte</button></div>';
  document.getElementById("rv-change-pass").addEventListener("click",()=>{ST.parentAuth={salt:"",hash:""};saveST();rvOpenParent();});
  document.getElementById("rv-reset-progress").addEventListener("click",()=>{
    if(!confirm("Opravdu vynulovat výsledky, XP, hvězdy a statistiky? Rodičovské heslo zůstane zachováno."))return;
    const auth=ST.parentAuth;
    ST={xp:0,streak:0,progress:{},parentAuth:auth,stats:{solved:0,skipped:0,revealed:0},topicStats:{},level:1};
    saveST();rvDashboard();renderHome();
  });
}
const css=document.createElement("style");
css.textContent='.rv-parent-btn{border:1.5px solid var(--border);background:var(--paper);color:var(--ink2);border-radius:20px;padding:5px 11px;font-family:Nunito,sans-serif;font-size:.76rem;font-weight:800;cursor:pointer}'+
'.rv-parent-overlay{display:none;position:fixed;inset:0;z-index:500;background:rgba(28,28,46,.55);padding:18px;align-items:center;justify-content:center}.rv-parent-overlay.show{display:flex}'+
'.rv-parent-modal{background:var(--paper);border-radius:18px;box-shadow:var(--shadow-lg);width:min(620px,100%);max-height:88svh;overflow:auto;padding:20px}'+
'.rv-parent-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}.rv-parent-kicker{font-size:.65rem;letter-spacing:2px;text-transform:uppercase;color:var(--ink3)}'+
'.rv-parent-title{font-family:"Playfair Display",serif;font-size:1.35rem;font-weight:800}.rv-parent-close{border:0;background:none;font-size:1.2rem;cursor:pointer;color:var(--ink2)}'+
'.rv-parent-login{max-width:360px;margin:10px auto}.rv-parent-login p{font-size:.84rem;color:var(--ink2);line-height:1.5;margin-bottom:14px}.rv-parent-login label{display:block;font-size:.76rem;font-weight:800;margin-bottom:6px}'+
'.rv-parent-login input{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:11px 12px;margin-bottom:8px;font:inherit}.rv-parent-error{min-height:20px;color:var(--wrong);font-size:.76rem;margin-bottom:6px}'+
'.rv-parent-link{display:block;margin:12px auto 0;border:0;background:none;color:var(--ink2);text-decoration:underline;cursor:pointer}.rv-parent-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}'+
'.rv-stat{border:1.5px solid var(--border);border-radius:12px;padding:12px;text-align:center;background:var(--bg)}.rv-stat strong{display:block;font-size:1.5rem;color:var(--accent)}.rv-stat span{font-size:.74rem;color:var(--ink2)}'+
'.rv-parent-note{margin:12px 0 18px;padding:10px 12px;border-radius:10px;background:var(--warn-bg);font-size:.78rem;color:var(--ink2);line-height:1.45}.rv-parent-subtitle{font-weight:800;margin-bottom:8px}'+
'.rv-parent-table{display:flex;flex-direction:column;gap:6px}.rv-parent-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto;gap:10px;align-items:center;border-bottom:1px solid var(--border);padding:8px 2px;font-size:.76rem}'+
'.rv-parent-row strong{display:block;overflow:hidden;text-overflow:ellipsis}.rv-parent-row small{display:block;color:var(--ink3)}.rv-parent-empty{text-align:center;color:var(--ink2);padding:18px}.rv-parent-actions{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap}'+
'@media(min-width:560px){.rv-parent-grid{grid-template-columns:repeat(4,1fr)}}';
document.head.appendChild(css);
rvEnsureParent();
})();