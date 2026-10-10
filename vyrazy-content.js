/* Deterministic task factories and short Czech lessons. Shared by all six pages. */
(function(root){'use strict';const M=typeof module!=='undefined'?require('./vyrazy-math.js'):root.ExpressionMath;
const lessons={
num:[
['order','Pořadí operací','Násobení a dělení mají přednost před sčítáním a odčítáním. Operace se stejnou předností počítej zleva doprava.','8 + 3 · 4 = 8 + 12 = 20','Nejdřív označ násobení a dělení. Sčítání nech nakonec.'],
['division','Násobení a dělení','Násobení a dělení mají stejnou přednost. Rozhoduje jejich pořadí zleva doprava.','24 : 6 · 2 = 4 · 2 = 8','Dělení a násobení prováděj postupně zleva doprava.'],
['brackets','Závorky','Počítej nejprve nejvnitřnější závorku. Závorky mohou změnit pořadí operací.','3 · (8 − (2 + 1)) = 3 · (8 − 3) = 15','Najdi závorku, která už neobsahuje další závorku.'],
['signs','Znaménka a záporná čísla','Odečtení záporného čísla je přičtení jeho opačného čísla. Součin dvou záporných čísel je kladný.','−4 − (−7) = −4 + 7 = 3','Rozlišuj znaménko čísla a početní operaci. Minus před závorkou mění všechna znaménka v závorce.'],
['decimals','Desetinná čísla','Pořadí operací se nemění. Desetinnou čárku při násobení umísti podle celkového počtu desetinných míst činitelů.','1,2 + 0,5 · 4 = 1,2 + 2 = 3,2','Nejdřív násob nebo děl. Při sčítání srovnej desetinné čárky pod sebe.'],
['fractions','Zlomky','Zlomky sčítej se společným jmenovatelem. Při dělení zlomkem násob jeho převrácenou hodnotou.','1/2 + 1/3 = 3/6 + 2/6 = 5/6','U součtu hledej společného jmenovatele. Při násobení můžeš krátit.'],
['powers','Mocniny','Mocninu vypočítej před násobením. V zápisu −3² se umocňuje pouze 3, v (−3)² celé záporné číslo.','−3² = −9, ale (−3)² = 9','Zkontroluj, zda záporné znaménko patří do umocňované závorky.'],
['mixed','Složené výrazy','Spoj pravidla: závorky, mocniny, násobení a dělení, nakonec sčítání a odčítání.','2 · (3² − 5) + 1/2 = 2 · 4 + 1/2 = 17/2','Rozděl výraz na malé části. Začni nejvnitřnější závorkou.']
],
var:[
['mixed','Zjednodušování výrazů','Nejdřív roznásob závorky, potom seskup členy se stejnou proměnnou. Koeficienty u x sluč zvlášť, u y zvlášť. Proměnné zůstávají v odpovědi.','3(x + 2) + 2y − 5(x + y) − 2x + 6y = −4x + 3y + 6','Každým činitelem před závorkou vynásob všechny členy uvnitř. Pak zvlášť sluč členy s x, s y a bez proměnné.'],
['like','Slučování podobných členů','Podobné členy mají stejné proměnné se stejnými exponenty. Sčítáme jejich koeficienty; ostatní členy ponecháme oddělené.','3x + 2y − 5x + 4y = −2x + 6y','Nejdřív seskup členy podle proměnných a exponentů. Neslučuj například x a y.'],
['minus','Plus a minus před závorkou','Plus před závorkou znaménka zachovává. Minus před závorkou změní znaménko každého členu uvnitř.','3x − (2x − 5y) + y = x + 6y','Odstraň závorky. U závorky s minusem obrať všechna znaménka.'],
['expand','Roznásobování závorek','Každý člen závorky vynásob činitelem před ní. Záporný činitel musí ovlivnit znaménko každého součinu.','3(x + 2y) − 2(x − y) = 3x + 6y − 2x + 2y = x + 8y','Roznásob každou závorku samostatně, teprve potom sluč podobné členy.'],
['nested','Více závorek','Vnořené závorky odstraňuj zevnitř ven. Průběžně hlídej znaménka; slučování všech podobných členů nech až po roznásobení.','2(x − (3y − x)) − (x + y) = 3x − 7y','Začni nejvnitřnější závorkou. Minus před ní se vztahuje na všechny její členy.'],
['powers','Členy s mocninami','x · x = x². Při násobení mocnin se stejným základem se exponenty sčítají. Slučovat lze jen stejné mocniny stejných proměnných.','2x(x + 3) − x² + 4x = x² + 10x','Koeficienty násob zvlášť. Při slučování odděl členy s x², x, xy a dalšími mocninami.'],
['rational','Zlomkové a desetinné koeficienty','Proměnné se upravují stejně jako u celých koeficientů. Číselné koeficienty počítej přesně; zlomky slučuj se společným jmenovatelem.','0,5(x + 2y) + 1/2x − y = x','Roznásob závorky a pak přesně sečti koeficienty podobných členů.']
],
poly:[
['add','Sčítání a odčítání mnohočlenů','Odstraň závorky a sluč podobné členy. x² a x nejsou podobné členy. Minus před závorkou obrací všechna znaménka.','(3x² + 2x − 1) − (x² − 3x + 2) = 2x² + 5x − 3','Nejprve odstraň závorky, potom seskup stejné mocniny.'],
['monomial','Jednočlen krát mnohočlen','Každý člen mnohočlenu vynásob celým jednočlenem. U stejných proměnných se exponenty při násobení sčítají.','2x(3x − 4y + 1) = 6x² − 8xy + 2x','Vynásob zvlášť všechny členy závorky.'],
['product','Násobení mnohočlenů','Každý člen první závorky vynásob každým členem druhé. Nakonec sluč podobné členy.','(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6','Zkontroluj všechny dvojice členů z obou závorek.'],
['squarePlus','Vzorec (a + b)²','(a + b)² = a² + 2ab + b². Druhá mocnina součtu obsahuje také prostřední člen 2ab.','(x + 3y)² = x² + 6xy + 9y²','Urči první a druhý člen dvojčlenu. Napiš jejich druhé mocniny a dvojnásobek jejich součinu.'],
['squareMinus','Vzorec (a − b)²','(a − b)² = a² − 2ab + b². Prostřední člen je záporný, poslední druhá mocnina kladná.','(2x − 3y)² = 4x² − 12xy + 9y²','Zvlášť urči a², −2ab a b². Neumocňuj pouze oba krajní členy.'],
['difference','Vzorec (a − b)(a + b)','(a − b)(a + b) = a² − b². Smíšené členy se navzájem zruší.','(2x − 3y)(2x + 3y) = 4x² − 9y²','Najdi společnou část obou závorek a jejich opačné druhé členy.'],
['factor','Vytýkání společného činitele','Vytkni největší společný číselný dělitel a společné mocniny proměnných. Uvnitř závorky zůstane každý původní člen vydělený vytknutým činitelem.','6x² + 9xy − 3x = 3x(2x + 3y − 1)','Najdi činitele společného všem členům. Vyděl jím každý člen a výsledky napiš do závorky.'],
['identityFactor','Rozklad pomocí a² − b²','Rozdíl druhých mocnin můžeme přepsat na součin: a² − b² = (a − b)(a + b). Výsledkem mají být dvě závorky, nikoli jejich rozvoj.','4x² − 9y² = (2x − 3y)(2x + 3y)','Rozpoznej druhou mocninu prvního i druhého členu. Jedna závorka obsahuje rozdíl, druhá součet.'],
['mixed','Kombinované úpravy se vzorci','V jednom výrazu mohou být součiny, mocniny dvojčlenů i minus před závorkou. Použij vhodné vzorce, roznásob zbývající části a sluč podobné členy.','(x + 2y)² − (x − y)(x + y) − 4xy = 5y²','Každou mocninu nebo součin uprav zvlášť. Nakonec sluč členy se stejnými proměnnými a exponenty.']
]};
function rng(seed){let s=(seed+1)>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
function generate(kind,topic,level,seed){const random=rng(seed),r=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1));const a=r(2,23),b=r(2,19),c=r(2,17),d=r(2,13),k=r(2,13),sg=seed%2?'-':'+';let expression,goal='simplify',vars,answer,prompt,steps=[];const t=lessons[kind][topic][0];
if(kind==='num'){goal='number';switch(t){
case'order':expression=level===0?`${a}+${b}*${c}`:level===1?`${a}*${b}-${c}*${d}`:`${a}+${b}*${c}-${k}^2+${d}*2`;break;
case'division':expression=level===0?`${a*b}/${b}*${c}`:level===1?`${a*b}/${b}*${c}-${c*d}/${d}`:`(${a*b}/${b}*${c}-${d})/2+${k}`;break;
case'brackets':expression=level===0?`${a}*(${b}+${c})`:level===1?`${a}*(${b}-(${c}+${d}))`:`(${a}-(${b}-${c})*2)*(${d}+${k})`;break;
case'signs':expression=level===0?`-${a}-(-${b})`:level===1?`(-${a})*(${b}-${c})-(-${d})`:`-${a}-(-${b}-(-${c}*${d}))+(-${k})^2`;break;
case'decimals':expression=level===0?`${a/10}+${b/10}*${c}`:level===1?`(${a/10}-${b/10})*${c/10}`:`(-${a/10})*(${b/10}-${c/10})+${d/10}/${k}`;break;
case'fractions':expression=level===0?`${a}/${b}+${c}/${b}`:level===1?`${a}/${b}*(${c}/${d}-${k}/${b})`:`(${a}/${b}-${c}/${d})/(${k}/${b})+1/3`;break;
case'powers':expression=level===0?`${a} ${sg} ${k}^2`:level===1?`(-${k})^2-${b}*2+${a}`:`-${k}^2+(-${d})^3-(${a}-${b})^2`;break;
case'mixed':expression=level===0?`${a}*(${b}-${c})+${k}^2`:level===1?`(${a}-${b})^2-(${c}+${d})/${k}`:`((${a}/${b}+${c}/${d})*${k}-(-${d})^2)/3`;break;
}prompt='Urči hodnotu výrazu.';answer=M.format(M.poly(M.parse(expression)));steps=M.numericSteps(expression).map(s=>`${s.expression} = ${s.answer}`);
 }else if(kind==='var'){switch(t){
case'mixed':expression=level===0?`${a}(x+${b})+${c}y-${d}(x+y)-${k}x+${b}y`:level===1?`${a}(x-${b}y)-${c}(${d}x-y)+${k}(x+${c}y)-(${b}x-${d}y)`:`${a}x(x+${b}y)-${c}(x^2-${d}xy)+${k}y(x-y)-${b}x^2`;break;
case'like':expression=level===0?`${a}x+${b}y-${c}x+${d}y-${k}`:level===1?`${a}x^2-${b}xy+${c}x^2+${d}xy-${k}y^2`:`${a}x^2y+${b}xy^2-${c}x^2y+${d}xy^2-${k}x^3`;break;
case'minus':expression=level===0?`${a}x-(${b}x-${c}y)+${d}y`:level===1?`(${a}x-${b}y)-(${c}x-(${d}y-${k}x))`:`${a}x^2-(${b}x^2-${c}xy)-(${d}xy-${k}y^2)`;break;
case'expand':expression=level===0?`${a}(x+${b}y)-${c}(x-y)`:level===1?`-${a}(${b}x-${c}y)+${d}(${k}x+y)`:`${a}x(x-${b}y)-${c}y(${d}x-${k}y)`;break;
case'nested':expression=level===0?`${a}(x-(${b}y-x))-(${c}x+${d}y)`:level===1?`${a}(x-${b}(y-${c}x))-(${d}x-(${k}y-x))`:`${a}x(x-(${b}y-x))-${c}(x^2-(${d}xy-${k}y^2))`;break;
case'powers':expression=level===0?`${a}x(x+${b})-${c}x^2+${d}x`:level===1?`${a}x^2(x-${b})-${c}x(x^2-${d}x)+${k}x^3`:`${a}xy(${b}x-${c}y)-${d}x^2y+${k}xy^2`;break;
case'rational':expression=level===0?`${a/10}(x+${b}y)-${c/10}x+${d/10}y`:level===1?`${a}/${k}*(x-${b}y)-${c}/${k}*x+${d}/${k}*y`:`${a}/${k}*x(x-${b}y)-${c}/${d}*(x^2-${k}xy)+${b}/2*y^2`;break;
}answer=M.format(M.poly(M.parse(expression)));prompt='Zjednoduš výraz. Za proměnné nedosazuj čísla.';
}else{switch(t){
case'add':expression=level===0?`(${a}x^2+${b}x-${c})-(${d}x^2-${k}x+${b})`:level===1?`(${a}x^2-${b}xy+${c}y^2)-(${d}x^2-${k}xy-${a}y^2)`:`(${a}x^3-${b}x^2y+${c}xy^2)-(${d}x^3-(${k}x^2y-${b}xy^2))`;break;
case'monomial':expression=level===0?`${a}x(x+${b}y-${c})`:level===1?`-${a}x^2(${b}x-${c}y+${d})`:`${a}xy(${b}x^2-${c}xy+${d}y^2)`;break;
case'product':expression=level===0?`(x+${a}y)(x-${b}y)` :level===1?`(${a}x-${b}y)(${c}x+${d}y)`:`(${a}x^2-${b}xy+${c}y^2)(x-${d}y)`;break;
case'squarePlus':expression=level===0?`(x+${a})^2+${b}x`:level===1?`(${a}x+${b}y)^2`:`(${a}x^2+${b}y)^2-${c}x^2y`;break;
case'squareMinus':expression=level===0?`(x-${a})^2+${b}x`:level===1?`(${a}x-${b}y)^2`:`(${a}x^2-${b}y)^2+${c}x^2y`;break;
case'difference':expression=level===0?`(x-${a})(x+${a})+${b}x`:level===1?`(${a}x-${b}y)(${a}x+${b}y)`:`(${a}x^2-${b}y)(${a}x^2+${b}y)`;break;
case'factor':goal='factor';expression=level===0?`${a*k}x+${a*(k+1)}y`:level===1?`${a*k}x^2-${a*(k+1)}xy+${a*b}x`:`${a*k}x^3y+${a*(k+1)}x^2y^2-${a*b}x^2y`;answer=level===0?`${a}(${k}x+${k+1}y)`:level===1?`${a}x(${k}x-${k+1}y+${b})`:`${a}x^2y(${k}x+${k+1}y-${b})`;prompt='Vytkni největší společný činitel. Vnitřní výraz uprav.';break;
case'identityFactor':goal='identityFactor';expression=level===0?`${a*a}x^2-${b*b}`:level===1?`${a*a}x^2-${b*b}y^2`:`${a*a}x^4-${b*b}y^2`;answer=level===0?`(${a}x-${b})(${a}x+${b})`:level===1?`(${a}x-${b}y)(${a}x+${b}y)`:`(${a}x^2-${b}y)(${a}x^2+${b}y)`;prompt='Rozlož výraz na součin dvou závorek pomocí vzorce a² − b².';break;
case'mixed':expression=level===0?`(x+${a}y)^2-x(x+${b}y)-${c}y^2`:level===1?`(${a}x-${b}y)^2-(${c}x-${d}y)(x+${k}y)+${b}xy`:`(${a}x-(${b}y-x))^2-(${c}x+${d}y)(${c}x-${d}y)+${k}xy-${b}y^2`;break;
}answer=answer||M.format(M.poly(M.parse(expression)));prompt=prompt||'Zjednoduš mnohočlen. Rozepiš součiny a vzorce a sluč podobné členy.';
}
if(!steps.length){if(goal==='number'&&vars){const substituted=expression.replace(/[xy]/g,v=>'('+vars[v]+')').replace(/(\d)\(/g,'$1*(');steps=['Dosaď: '+substituted,...M.numericSteps(substituted).map(s=>s.expression+' = '+s.answer)]}else if(goal==='identityFactor')steps=['Rozpoznej druhé mocniny obou členů.','Použij a² − b² = (a − b)(a + b): '+answer,'Kontrola roznásobením: '+expression];else if(goal==='factor')steps=['Společný činitel vyděl z každého členu: '+answer,'Kontrola roznásobením: '+expression];else if(goal==='number')steps=[t==='degree'?'Po sloučení: '+M.format(M.poly(M.parse(expression)))+'; nejvyšší stupeň je '+answer:'Člen s požadovanou mocninou má koeficient '+answer];else{steps=algebraSteps(expression,answer);}}
return{kind,topic,topicId:t,level,seed,expression,answer,goal,vars,prompt,hint:lessons[kind][topic][4],steps};}
function algebraDerivation(expression){const ast=M.parse(expression);function strip(n){return n.t==='g'?strip(n.a):n}function distributed(n){n=strip(n);if(n.t==='+')return [...distributed(n.a),...distributed(n.b)];if(n.t==='-')return [...distributed(n.a),...distributed(n.b).map(a=>({t:'u',op:'-',a}))];if(n.t==='u')return distributed(n.a).map(a=>({t:'u',op:n.op,a}));if(n.t==='*'){const out=[];for(const a of distributed(n.a))for(const b of distributed(n.b))out.push({t:'*',a,b});return out}if(n.t==='/')return distributed(n.a).map(a=>({t:'/',a,b:n.b}));if(n.t==='^'&&M.poly(n.a).size>1){const exponent=Number(M.format(M.poly(n.b)));let out=[{t:'n',v:'1'}];for(let i=0;i<exponent;i++){const next=[];for(const a of out)for(const b of distributed(n.a))next.push({t:'*',a,b});out=next;if(out.length>200)throw Error('Příliš rozsáhlý rozvoj.')}return out}return [n]}
const pieces=[],groups=new Map();for(const term of distributed(ast))for(const[key,q]of M.poly(term)){if(!q.n)continue;pieces.push(M.format(new Map([[key,q]])));if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q.toString())}
const join=list=>list.reduce((out,v)=>out?(v.startsWith('-')?out+' - '+v.slice(1):out+' + '+v):v,'')||'0';const expanded=join(pieces),grouped=[];for(const[key,list]of groups){const[x,y]=key.split(',').map(Number),monomial=(x?'x'+(x>1?'^'+x:''):'')+(y?'y'+(y>1?'^'+y:''):'');grouped.push(list.length>1?'('+join(list)+')'+monomial:monomial?M.format(new Map([[key,M.Q.from(list[0])]])):list[0])}return{expanded,grouped:join(grouped),answer:M.format(M.poly(ast))}}
function algebraSteps(expression,answer){const d=algebraDerivation(expression);return['Roznásob součiny a odstraň závorky: '+d.expanded,'Seskup koeficienty podobných členů: '+d.grouped,'Sečti koeficienty: '+answer]}
function example(kind,topic,level){if(kind==='var'&&topic===0&&level===0){const expression='3(x+2)+2y-5(x+y)-2x+6y',answer='-4x+3y+6';return{kind,topic,topicId:'mixed',level,seed:-1,goal:'simplify',expression,answer,prompt:'Zjednoduš výraz. Za proměnné nedosazuj čísla.',hint:lessons.var[0][4],steps:algebraSteps(expression,answer)}}return generate(kind,topic,level,310987)}
function verify(kind,topic,level,seed){if(kind!=='num'){const p=generate(kind,topic,level,seed);p.prompt='Samostatně ověř zvládnutí úpravy: '+p.prompt;return p}const p=generate(kind,topic,level,seed),t=lessons[kind][topic][0];let question,answer,explain;const r=rng(seed),a=2+Math.floor(r()*8),b=2+Math.floor(r()*7);
if(kind==='num'){
if(t==='order'||t==='division'||t==='mixed'){question='Který výpočet se provede dříve? 1: '+a+' + '+b+' · 3 (sčítání), 2: '+a+' + '+b+' · 3 (násobení). Napiš 1 nebo 2.';answer='2';explain='Násobení má přednost před sčítáním.'}
else if(t==='brackets'){question='Ve výrazu 2 · ('+a+' − ('+b+' + 1)) se nejdřív počítá 1: '+a+' − '+b+', nebo 2: '+b+' + 1? Napiš 1 nebo 2.';answer='2';explain='Začínáme nejvnitřnější závorkou.'}
else if(t==='signs'||t==='powers'){question='Urči hodnotu −'+a+'². Patří minus do umocňované závorky? Zapiš výsledek.';answer=String(-a*a);explain='Bez závorky se umocní jen kladné číslo; minus zůstane před výsledkem.'}
else if(t==='decimals'){question='Kolik desetinných míst stačí pro přesný součin 0,3 · 0,7? Zapiš počet.';answer='2';explain='Činitelé mají dohromady dvě desetinná místa: 0,21.'}
else{question='Urči hodnotu 1/'+a+' : 1/'+a+'. Pozor: jde o dělení, ne o násobení.';answer='1';explain='Každé nenulové číslo dělené samo sebou je 1.'}
}else if(kind==='var'){
if(t==='meaning'||t==='compose'){question='Který zápis znamená „o '+a+' více než x“? 1: '+a+'x, 2: x + '+a+'. Napiš 1 nebo 2.';answer='2';explain='„O více“ znamená přičíst, „krát více“ znamená násobit.'}
else if(t==='substitute'){question='Urči hodnotu x² pro x = −'+a+'.';answer=String(a*a);explain='Dosazujeme celé záporné číslo: (−'+a+')².'}
else if(t==='like'||t==='powers'){question='Lze sloučit '+a+'x² a '+b+'x do jediného členu sečtením koeficientů? Napiš 1 pro ano, 2 pro ne.';answer='2';explain='Členy mají různé exponenty, nejsou podobné.'}
else if(t==='minus'){question='Uprav '+a+'x − (x − '+b+').';p.expression=a+'x-(x-'+b+')';p.answer=M.format(M.poly(M.parse(p.expression)));p.prompt=question;return p}
else if(t==='expand'){question='Kolik členů závorky násobíš při roznásobování '+a+'(x − '+b+')? Zapiš počet.';answer='2';explain='Činitelem násobíme každý ze dvou členů závorky.'}
else{question='Který pokyn končí číslem? 1: Uprav výraz 3x + 2x. 2: Urči jeho hodnotu pro x = '+a+'. Napiš 1 nebo 2.';answer='2';explain='Úprava obvykle zachová proměnnou; hodnota po dosazení je číslo.'}
}else{
if(t==='square'){question='Jaký je koeficient u x v rozvoji (x − '+a+')²?';answer=String(-2*a);explain='Prostřední člen je −2 · x · '+a+'.'}
else if(t==='difference'){question='Jaký je koeficient u x v rozvoji (x − '+a+')(x + '+a+')?';answer='0';explain='Smíšené členy jsou opačné a zruší se.'}
else if(t==='product'){question='Kolik součinů členů vznikne před slučováním při násobení dvojčlenu trojčlenem?';answer='6';explain='Každý ze dvou členů násobíme třemi členy: 2 · 3 = 6.'}
else if(t==='monomial'){question='Jaký exponent má x v součinu x² · x³?';answer='5';explain='Exponenty stejného základu při násobení sčítáme: 2 + 3 = 5.'}
else return p;
}
return{...p,goal:'number',vars:undefined,expression:question,prompt:'Ověř porozumění pravidlu.',answer,steps:[explain,'Odpověď: '+answer],hint:'Vrať se k pravidlu nad úlohou. Zvaž význam početního znaménka a závorek.',concept:true};}
const api={lessons,generate,verify,algebraSteps,algebraDerivation,example};if(typeof module!=='undefined')module.exports=api;root.ExpressionContent=api;})(typeof globalThis!=='undefined'?globalThis:this);
