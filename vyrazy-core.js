'use strict';
/* Výrazy — samostatné jádro, společné pro plnou verzi a ukázku. */
(function(){
const DEMO=/vyrazy-demo\.html$/i.test(location.pathname),LIMIT=12;
const KEY=DEMO?'fdc-vyrazy-demo-v3':'fdc-vyrazy-v3';
const topics=[
 ['zaklady','Sčítání a násobení','Kterou operaci počítat dřív?'],
 ['prednost','Násobení a dělení','Násobení a dělení mají stejnou přednost.'],
 ['zavorky','Závorky','Nejdřív počítej uvnitř závorek.'],
 ['znamenka','Znaménko před závorkou','Minus před závorkou mění znaménka.'],
 ['zaporne','Záporná čísla','Záporná čísla patří do výpočtu stejně jako kladná.'],
 ['mix','Velké výrazy','Spoj všechna pravidla dohromady.'],
 ['desetiny','Desetinná čísla a zlomky','Zlomky s polovinou a čtvrtinou lze převést na desetinná čísla.']
];
const levels=['Lehká','Střední','Těžká'];
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const choose=a=>a[rnd(0,a.length-1)];
const $=id=>document.getElementById(id);
const fmt=n=>String(n).replace('.',',').replace('-', '−');
const defaultStats=()=>({done:0,right:0,wrong:0,hints:0,skips:0,first:0,days:{},cells:{},history:[],seen:[],unlocks:0});
function load(){try{return JSON.parse(localStorage.getItem(KEY))||defaultStats()}catch(e){return defaultStats()}}
let stats=Object.assign(defaultStats(),load()),topic=0,level=0,mode='teach',problem=null,attempt=0,hinted=false,stage='answer',sound=true,theme='light',pendingStep=null;
const safeSave=()=>{try{localStorage.setItem(KEY,JSON.stringify(stats))}catch(e){}};
const N=n=>({t:'n',v:n});
const O=(op,a,b)=>({t:'o',op,a,b});
const NEG=a=>({t:'neg',a});
function value(n){if(n.t==='n')return n.v;if(n.t==='neg')return -value(n.a);const a=value(n.a),b=value(n.b);return n.op==='+'?a+b:n.op==='−'?a-b:n.op==='×'?a*b:a/b;}
function render(n,parentPrec=0,isRight=false,parentOp=''){
 if(n.t==='n')return n.v<0?'('+fmt(n.v)+')':fmt(n.v);
 if(n.t==='neg')return '−('+render(n.a)+')';
 const prec=n.op==='+'||n.op==='−'?1:2;
 const left=render(n.a,prec,false,n.op);
 let right=render(n.b,prec,true,n.op);
 if(n.b.t==='neg'){right='('+right+')'}
 const joined=left+' '+n.op+' '+right;
 const wrap=prec<parentPrec||(isRight&&prec===parentPrec&&(parentOp==='−'||parentOp==='÷'));
 return wrap?'('+joined+')':joined;
}
function collect(n,arr){if(n.t==='n')return;n.t==='neg'?collect(n.a,arr):(collect(n.a,arr),collect(n.b,arr));arr.push(value(n));}
function leaf(a,b,op){return O(op,N(a),N(b))}
function workNodes(n){if(n.t==='n')return [];if(n.t==='neg')return [...workNodes(n.a),n];return [...workNodes(n.a),...workNodes(n.b),n]}
function targetPrompt(){const nodes=workNodes(problem.root);const n=nodes[Math.min(teachIndex,nodes.length-1)];return 'Krok '+(teachIndex+1)+'/'+nodes.length+': vypočítej '+render(n)+'. (Můžeš také zadat konečný výsledek.)'}
let teachIndex=0;
const eq=(a,b)=>Math.abs(a-b)<1e-8;
function guidance(n){if(!n)return problem.rule;if(n.t==='neg')return 'U minusu před závorkou změň znaménka všech členů uvnitř.';if(n.op==='×')return 'Nejdřív vypočítej násobení '+render(n.a)+' × '+render(n.b)+'.';if(n.op==='÷')return 'Vypočítej dělení '+render(n.a)+' ÷ '+render(n.b)+'.';if(n.op==='−')return 'Teď odečti '+render(n.b)+' od '+render(n.a)+'. Dej pozor na znaménka.';return 'Sečti '+render(n.a)+' a '+render(n.b)+'.';}
function hintStep(){const nodes=workNodes(problem.root);return guidance(nodes[mode==='teach'?Math.min(teachIndex,nodes.length-1):0]);}
function generator(t,l,variant){
const a=rnd(2,8+l*5),b=rnd(2,7+l*4),c=rnd(2,6+l*3),d=rnd(2,5+l*3);
let root,rule;
switch(t){
case 0:
 root=variant%3===0?O('+',N(a),leaf(b,c,'×')):variant%3===1?O('−',leaf(a,b,'×'),N(c)):O('+',leaf(a,b,'×'),N(c));rule='Násobení má přednost před sčítáním i odčítáním.';break;
case 1:{
 const q=rnd(2,5+l*2),k=rnd(2,5+l*2),m=rnd(2,5+l*2);
 root=variant%3===0?O('+',N(a),leaf(q*k,q,'÷')):variant%3===1?O('−',leaf(q*k,q,'÷'),N(b)):O('×',leaf(q*k,q,'÷'),N(m));
 rule='Násobení a dělení mají stejnou přednost; na stejné úrovni počítej zleva doprava.';break;}
case 2:
 root=variant%3===0?O('×',O('+',N(a),N(b)),N(c)):variant%3===1?O('−',N(a),O('×',O('+',N(b),N(c)),N(d))):O('×',O('−',N(a+b),O('+',N(b),N(c))),N(d));
 rule='Nejprve vyřeš nejvnitřnější závorky.';break;
case 3:
 root=variant%3===0?O('+',N(a),NEG(O('+',N(b),N(c)))):variant%3===1?O('−',N(a),NEG(O('−',N(b),N(c)))):O('+',NEG(O('+',N(a),N(b))),N(c));
 rule='Před závorkou je minus: při jejím odstranění změníš znaménko každého členu.';break;
case 4:
 root=variant%3===0?O('+',N(-a),leaf(b,c,'×')):variant%3===1?O('−',N(-a),O('−',N(b),N(c))):O('×',N(-a),O('−',N(b),N(c)));
 rule='Mysli na znaménka i na pořadí operací.';break;
case 5:{
 const q=rnd(2,5+l),k=rnd(2,6+l*2);
 root=variant%3===0?O('−',O('×',O('+',N(a),N(b)),N(c)),O('÷',N(q*k),N(q))):variant%3===1?O('+',NEG(O('−',N(a),O('×',N(b),N(c)))),O('÷',N(q*k),N(q))):O('×',O('−',N(a),O('+',N(b),N(-c))),O('+',N(d),N(k)));
 rule='Vyřeš závorky, potom násobení a dělení, nakonec sčítání a odčítání.';break;}
default:{
 root=variant%3===0?O('+',O('×',N(0.5),N(2*a)),N(b)):variant%3===1?O('−',N(a+b),O('×',N(0.25),N(4*b))):O('×',O('+',N(0.5),N(a)),N(2));
 rule='Polovina je 0,5 a čtvrtina je 0,25. Před sčítáním a odčítáním proveď násobení.';break;}
}
if(l===2&&(t<3||t===6)){root=O('+',root,leaf(d,rnd(2,8),'×'))}
const intermediates=[];collect(root,intermediates);
return {root,answer:value(root),text:render(root),rule,intermediates:intermediates.slice(0,-1),variant};
}
function getProblem(){
 let p;
 for(let i=0;i<40;i++){p=generator(topic,level,rnd(0,2));if(!stats.seen.includes(topic+':'+level+':'+p.text))break}
 stats.seen.push(topic+':'+level+':'+p.text);if(stats.seen.length>130)stats.seen.shift();
 safeSave();return p;
}
function play(ok){if(!sound)return;try{const ctx=new(window.AudioContext||window.webkitAudioContext)(),now=ctx.currentTime;const freq=ok?[choose([[392,523],[440,587],[523,659]])]:[[240,195]];freq.forEach((notes,j)=>notes.forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(ctx.destination);const tm=now+j*.12+i*.11;g.gain.setValueAtTime(.0001,tm);g.gain.exponentialRampToValueAtTime(.065,tm+.01);g.gain.exponentialRampToValueAtTime(.0001,tm+.16);o.start(tm);o.stop(tm+.17)}));setTimeout(()=>ctx.close(),550)}catch(e){}}
function cell(){const k=topic+'-'+level;return stats.cells[k]||(stats.cells[k]={done:0,right:0,first:0,hints:0,skips:0})}
function setMessage(message,type){$('feedback').textContent=message;$('feedback').className='feedback '+(type||'');}
function renderWorld(){
 const built=Math.min(18,Math.floor(stats.right/5));
 $('world').innerHTML=Array.from({length:18},(_,i)=>'<div class="tower '+(i<built?'built':'')+'" title="'+(i<built?'Oblast oživena':'Odemkne se postupem v matematice')+'"><span>'+(i<built?['◆','▥','◈','✦','⬡','▤'][i%6]:'◇')+'</span></div>').join('');
 $('worldProgress').textContent='Město výrazů: '+built+'/18 rozsvícených čtvrtí · každých 5 správně vyřešených úloh rozsvítí další.';
 $('stat').textContent='Vyřešeno '+stats.done+' · Správně '+stats.right;
}
function renderOptions(){
 $('topic').innerHTML=topics.map((t,i)=>'<option value="'+i+'">'+t[1]+'</option>').join('');
 $('topic').value=topic;
 $('level').innerHTML=levels.map((v,i)=>'<option value="'+i+'">'+v+'</option>').join('');
 $('level').value=level;
}
function draw(){
 renderWorld();renderOptions();
 $('teach').classList.toggle('chosen',mode==='teach');$('practice').classList.toggle('chosen',mode==='practice');
 $('expression').textContent=problem.text;
 $('rule').textContent=mode==='teach'?'Nauč mě to — '+problem.rule+' Nejprve si rozmysli první operaci. Můžeš napsat její výsledek a pak pokračovat k celému výrazu.':'Procvičování — urči hodnotu výrazu. Můžeš zadat i správný mezivýsledek.';
 $('answer').value='';$('answer').disabled=false;
 $('answer').placeholder='Tvoje odpověď';
 $('check').hidden=false;$('next').hidden=true;$('hint').hidden=false;$('skip').hidden=false;
 $('explain').hidden=true;$('explain').textContent='';
 $('feedback').textContent='';$('feedback').className='feedback';
 attempt=0;hinted=false;stage='answer';pendingStep=null;teachIndex=0;
 if(mode==='teach')$('rule').textContent=targetPrompt();
 if(DEMO){$('demoCounter').textContent='Ukázka: '+stats.done+' / '+LIMIT+' úloh';$('level').disabled=true;}
 $('answer').focus();
}
function finish(ok,skipped){
 stage='finished';$('answer').disabled=true;$('check').hidden=true;$('next').hidden=false;$('hint').hidden=true;$('skip').hidden=true;
 const c=cell();stats.done++;c.done++;
 if(skipped){stats.skips++;c.skips++}else if(ok){stats.right++;c.right++;if(attempt===0&&!hinted){stats.first++;c.first++}}else{stats.wrong++}
 const date=new Date().toLocaleDateString('sv-SE');stats.days[date]=(stats.days[date]||0)+1;
 stats.history.unshift({date,topic:topics[topic][1],level:levels[level],result:skipped?'Přeskočeno':ok?'Správně':'S pomocí / chybně',expression:problem.text});
 stats.history=stats.history.slice(0,80);safeSave();renderWorld();
 $('explain').hidden=false;
 $('explain').textContent='Postup: '+steps(problem.root).join(' → ')+' = '+fmt(problem.answer)+'.';
 setMessage(skipped?'Úloha přeskočena. Projdi si řešení a pokračuj.':ok?'Správně! Rozsvěcujeme další část města.':'Tady je celý postup. Příště už to zvládneš.',ok?'good':'');
 if(ok)play(true);
}
function steps(n){if(n.t==='n')return[];if(n.t==='neg')return [...steps(n.a),fmt(value(n))];return [...steps(n.a),...steps(n.b),fmt(value(n))]}
function check(){
 if(stage==='finished'){next();return}
 const raw=$('answer').value.trim().replace(',','.').replace('−','-');
 if(!/^-?\d+(?:\.\d+)?$/.test(raw)){setMessage('Zadej číslo. Může být i záporné.','warn');return}
 const val=Number(raw),nodes=workNodes(problem.root);
 if(eq(val,problem.answer)){finish(true,false);return}
 if(mode==='teach'){
  const idx=nodes.findIndex((n,i)=>i>=teachIndex&&eq(val,value(n)));
  if(idx>=0){
   teachIndex=idx+1;attempt=0;
   if(teachIndex>=nodes.length){finish(true,false);return}
   $('rule').textContent=targetPrompt();
   setMessage('Správný mezivýsledek '+fmt(val)+'. Řešení ještě není dokončené, pokračuj dalším krokem.','good');
   $('answer').value='';return;
  }
 }else if(nodes.slice(0,-1).some(n=>eq(val,value(n)))){
  pendingStep=val;setMessage('Ano, '+fmt(val)+' je správný mezivýsledek. Ještě pokračuj ke konečnému výsledku.','good');$('answer').value='';return;
 }
 attempt++;stats.incorrectAttempts=(stats.incorrectAttempts||0)+1;safeSave();play(false);
 $('answer').value='';$('answer').focus();
 if(attempt===1){setMessage('To ještě nesedí. Zkus to opravit, máš další pokus.','warn');return}
 if(attempt===2){setMessage('Podívej se na pořadí operací. Můžeš pokračovat nebo požádat o nápovědu.','warn');return}
 if(!hinted){hint();return}
 finish(false,false);
}
function hint(){
 if(stage==='finished')return;
 if(!hinted){hinted=true;stats.hints++;cell().hints++;safeSave()}
 setMessage('Nápověda k postupu: '+hintStep()+' Výsledek si vypočítej sám.','warn');
}
function next(){
 if(DEMO&&stats.done>=LIMIT){showDemoEnd();return}
 problem=getProblem();draw();
}
function showDemoEnd(){
 stage='finished';$('exercise').hidden=true;$('demoEnd').hidden=false;$('demoCounter').textContent='Ukázka dokončena ('+LIMIT+' úloh)';
}
function statsTable(){
 const rows=Object.entries(stats.cells).map(([key,v])=>{const [t,l]=key.split('-').map(Number);return '<tr><td>'+topics[t][1]+'</td><td>'+levels[l]+'</td><td>'+v.done+'</td><td>'+v.right+'</td><td>'+v.hints+'</td><td>'+v.skips+'</td></tr>'}).join('');
 $('parentData').innerHTML='<p>Vyřešeno: <b>'+stats.done+'</b> · Správně: <b>'+stats.right+'</b> · Chybně dokončeno: <b>'+stats.wrong+'</b> · Chybné pokusy: <b>'+(stats.incorrectAttempts||0)+'</b> · Napoprvé: <b>'+stats.first+'</b> · Nápovědy: <b>'+stats.hints+'</b> · Přeskočeno: <b>'+stats.skips+'</b></p><div class="tablewrap"><table><thead><tr><th>Téma</th><th>Obtížnost</th><th>Úloh</th><th>Správně</th><th>Nápověd</th><th>Přeskočeno</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>Aktivita po dnech: '+Object.entries(stats.days).slice(-14).map(([d,n])=>d+': '+n).join(' · ')+'</p><p>Statistiky se ukládají pouze v tomto prohlížeči, nesynchronizují se mezi zařízeními.</p>';
}
function hash(p,salt){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+p)).then(buf=>Array.from(new Uint8Array(buf),x=>x.toString(16).padStart(2,'0')).join(''))}
function getAuth(){try{return JSON.parse(localStorage.getItem('fdc-vyrazy-parent-v3'))}catch(e){return null}}
async function openParent(){
 $('parent').hidden=false;$('exercise').hidden=true;$('parentInfo').textContent='';
 if(DEMO){$('parentLogin').hidden=true;$('parentData').innerHTML='V plné verzi rodiče uvidí výsledky podle témat a obtížností, nápovědy, přeskočené úlohy a aktivitu po jednotlivých dnech. Mohou nastavit heslo a resetovat statistiky.';$('parentActions').hidden=true;return}
 $('parentLogin').hidden=false;$('parentData').innerHTML='';$('parentActions').hidden=true;
 $('parentInfo').textContent=getAuth()?'Zadej rodičovské heslo.':'Nastav rodičovské heslo (alespoň 4 znaky).';
}
async function authorize(){
 const p=$('parentPassword').value;
 const auth=getAuth();
 if(p.length<4){$('parentInfo').textContent='Heslo musí mít alespoň 4 znaky.';return}
 if(!window.crypto||!crypto.subtle){$('parentInfo').textContent='Pro bezpečné uložení hesla otevři modul přes HTTPS.';return}
 if(!auth){
 const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
 localStorage.setItem('fdc-vyrazy-parent-v3',JSON.stringify({salt,hash:await hash(p,salt)}));
 }else if(await hash(p,auth.salt)!==auth.hash){$('parentInfo').textContent='Nesprávné heslo.';return}
 $('parentPassword').value='';$('parentLogin').hidden=true;$('parentActions').hidden=false;$('parentInfo').textContent='Rodičovská sekce odemčena.';statsTable();
}
function closeParent(){$('parent').hidden=true;$('exercise').hidden=false;if(DEMO&&stats.done>=LIMIT)showDemoEnd();else $('answer').focus()}
function reset(){if(!confirm('Opravdu chceš smazat všechny výsledky dítěte?'))return;stats=defaultStats();safeSave();statsTable();renderWorld()}
function init(){
 document.body.dataset.theme=localStorage.getItem('fdc-vyrazy-theme')||'light';
 $('topic').addEventListener('change',e=>{topic=Number(e.target.value);next()});
 $('level').addEventListener('change',e=>{level=DEMO?0:Number(e.target.value);next()});
 $('teach').onclick=()=>{mode='teach';next()};
 $('practice').onclick=()=>{mode='practice';next()};
 $('check').onclick=check;$('next').onclick=next;$('hint').onclick=hint;$('skip').onclick=()=>finish(false,true);
 document.addEventListener('keydown',e=>{if(e.key!=='Enter'||!$('parent').hidden)return;const tag=e.target.tagName;if(tag==='SELECT'||tag==='BUTTON'||tag==='TEXTAREA')return;if(e.target!==$('answer')&&e.target!==document.body)return;e.preventDefault();stage==='finished'?next():check()});
 $('parentButton').onclick=openParent;$('parentClose').onclick=closeParent;$('parentUnlock').onclick=authorize;$('parentReset').onclick=reset;
 $('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'🔊 Zvuk':'🔇 Zvuk'};
 $('theme').onclick=()=>{const t=document.body.dataset.theme==='dark'?'light':'dark';document.body.dataset.theme=t;localStorage.setItem('fdc-vyrazy-theme',t)};
 if(DEMO){$('demoCounter').hidden=false;$('fullLink').hidden=false;if(stats.done>=LIMIT){showDemoEnd();renderWorld();return}}
 next();
}
window.VyrazyTest={generator,value,steps,topics,levels,workNodes,getState:()=>({stats,topic,level,mode,problem,stage,attempt,teachIndex}),check,next,hint,finish};
init();
})();