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
['meaning','Co znamená proměnná','Proměnná zastupuje číslo. Zápis 3x znamená 3 · x. Stejné písmeno v jedné úloze zastupuje stejné číslo.','3x + 2 pro x = 4: 3 · 4 + 2 = 14','Za každý výskyt stejného písmene dosaď tutéž hodnotu.'],
['compose','Výraz ze slovního zadání','Nejdřív si ujasni, co proměnná označuje. „O 5 více“ je x + 5, „pětkrát více“ je 5x.','Tři sešity po x Kč a tužka za 8 Kč: 3x + 8','Popiš cenu každé části zvlášť. Pak části spoj podle zadání.'],
['substitute','Dosazování','Za proměnnou dosaď zadanou hodnotu do všech míst. Zápornou hodnotu piš do závorky.','x² − 2x pro x = −3: (−3)² − 2 · (−3) = 15','Nahraď každé písmeno zadaným číslem, záporné číslo uzavři do závorky.'],
['like','Podobné členy','Slučovat lze členy se stejnými proměnnými a stejnými exponenty. Sečti jejich koeficienty.','3x + 4x − 2 = 7x − 2','Odděl členy s x, s x² a bez proměnné. Každou skupinu sluč samostatně.'],
['minus','Znaménka před závorkou','Plus před závorkou znaménka nemění. Minus před závorkou mění znaménko každého členu.','5x − (2x − 3) = 5x − 2x + 3 = 3x + 3','Při odstranění závorky s minusem změň znaménko každého jejího členu.'],
['expand','Roznásobování','Každý člen v závorce vynásob celým činitelem před závorkou. Pak sluč podobné členy.','3(2x − 4) = 6x − 12','Nakresli si pomyslné šipky od činitele ke každému členu závorky.'],
['powers','Mocniny proměnných','Při násobení mocnin se stejným základem se exponenty sčítají. x² a x jsou různé druhy členů.','2x² · 3x = 6x³','Zvlášť násob koeficienty a zvlášť mocniny stejné proměnné.'],
['mixed','Hodnota a úprava výrazu','Úprava ponechá proměnnou, výpočet hodnoty po dosazení končí číslem. Nezaměňuj tyto dva úkoly.','Uprav: 2(x + 3) − x = x + 6. Pro x = 4 je hodnota 10.','Přečti si požadavek: máš výraz upravit, nebo vypočítat jeho hodnotu?']
],
poly:[
['terms','Členy a koeficienty','Členy oddělují znaménka plus a minus. Koeficient je číselný násobek proměnné, včetně znaménka.','V 3x² − 5x + 7 je koeficient u x roven −5.','Najdi požadovanou mocninu a nezapomeň na znaménko jejího koeficientu.'],
['degree','Stupeň mnohočlenu','Stupeň členu je součet exponentů jeho proměnných. Stupeň nenulového mnohočlenu je nejvyšší stupeň jeho nenulových členů.','4x²y + 2x − 1 má stupeň 3, protože x²y má 2 + 1 = 3.','Nejdřív sluč podobné členy. Pak hledej nejvyšší součet exponentů v jednom členu.'],
['add','Sčítání a odčítání','Odstraň závorky a sluč podobné členy. Minus před závorkou obrací všechna znaménka.','(3x² + x) − (x² − 2x) = 2x² + 3x','Seřaď členy podle mocnin. Při odčítání změň znaménka celé druhé závorky.'],
['monomial','Jednočlen krát mnohočlen','Každý člen mnohočlenu vynásob jednočlenem. Mocniny stejného základu násob sčítáním exponentů.','2x(3x − 4) = 6x² − 8x','Vynásob zvlášť každý člen závorky.'],
['product','Násobení mnohočlenů','Každý člen první závorky vynásob každým členem druhé. Potom sluč podobné členy.','(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6','Zkontroluj, že každý člen první závorky byl spojen se všemi členy druhé.'],
['square','Druhá mocnina dvojčlenu','(a + b)² = a² + 2ab + b² a (a − b)² = a² − 2ab + b². Prostřední člen nelze vynechat.','(x − 3)² = x² − 6x + 9','U druhé mocniny dvojčlenu musíš získat také dvojnásobek součinu obou členů.'],
['difference','Rozdíl druhých mocnin','(a − b)(a + b) = a² − b². Smíšené členy se při násobení navzájem zruší.','(2x − 3)(2x + 3) = 4x² − 9','Najdi dva stejné členy a dva opačné členy v závorkách.'],
['factor','Vytýkání','Najdi největší společný číselný dělitel a nejnižší společné mocniny proměnných. Každý člen jimi vyděl.','6x² + 9x = 3x(2x + 3)','Hledej činitele, kterým lze beze zbytku vydělit každý člen.'],
['mixed','Kombinované úpravy','Upravuj postupně. Nejprve mocniny a součiny, potom znaménka před závorkami a podobné členy.','(x + 2)² − x(x + 4) = x² + 4x + 4 − x² − 4x = 4','Rozepiš každou část samostatně a až potom sluč podobné členy.']
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
case'meaning':goal='number';vars={x:String(level===0?k:level===1?-k:k/10)};expression=level===0?`${a}x+${b}`:level===1?`${a}-${b}x`:`${a}x+${b}(x-${c})`;break;
case'compose':goal='compose';if(level===0){prompt=`Jeden sešit stojí x Kč. Kupuješ ${a} sešitů a tužku za ${b} Kč. Zapiš celkovou cenu.`;expression=`${a}x+${b}`}else if(level===1){prompt=`Obdélníková zahrada má délku x m a šířku o ${b} m menší. Oplotíš ji, ale necháš ${c} m širokou bránu. Zapiš délku plotu. Platí x > ${b+c}.`;expression=`2x+2(x-${b})-${c}`}else{prompt=`Jízdenka stojí x Kč. Pro ${a} lidí koupíš jízdenky se slevou ${b} Kč na každou a zaplatíš jednorázový poplatek ${c} Kč. Zapiš celkovou cenu. Platí x > ${b}.`;expression=`${a}(x-${b})+${c}`}break;
case'substitute':goal='number';vars={x:String(level===0?k:level===1?-k:k/10)};expression=level===0?`${a}x-${b}`:level===1?`x^2-${a}x+${b}`:`(${a}x-${b})^2/2+${c}x`;break;
case'like':expression=level===0?`${a}x+${b}x-${c}`:level===1?`${a}x^2-${b}x+${c}x^2+${d}x`:`${a}xy+${b}x^2-${c}xy+${d}x^2+${k}`;break;
case'minus':expression=level===0?`${a}x-(${b}x-${c})`:level===1?`${a}x-(${b}x-(${c}x-${d}))`:`${a}x^2-(${b}x^2-${c}x)-(${d}x-${k})`;break;
case'expand':expression=level===0?`${a}(x+${b})`:level===1?`-${a}(${b}x-${c})+${d}x`:`${a}x(x-${b})-${c}(x^2-${d})`;break;
case'powers':expression=level===0?`${a}x*${b}x`:level===1?`${a}x^2*${b}x-${c}x^3`:`${a}xy^2*${b}x^2y-${c}x^3y^3`;break;
case'mixed':if(seed%2){goal='number';vars={x:String(level===0?k:level===1?-k:k/10)}}expression=level===0?`${a}(x+${b})-${c}x`:level===1?`${a}(x-${b})-${c}(x+${d})`:`(${a}x-${b})(x+${c})-${d}x^2`;break;
}answer=M.format(M.poly(M.parse(expression),vars));prompt=prompt||(goal==='number'?'Dosaď a vypočítej hodnotu výrazu.':'Uprav výraz do nejjednoduššího tvaru.');
}else{switch(t){
case'terms':goal='number';expression=level===0?`${a}x^2-${b}x+${c}`:level===1?`${a}x^3-${b}x^2+${c}x-${d}`:`${a}x^2y-${b}xy^2+${c}xy-${d}`;prompt='Urči koeficient u '+(level===0?'x':level===1?'x²':'xy²')+'.';answer=String(-b);break;
case'degree':goal='number';const degreeK=2+(k%7);expression=level===0?`${a}x^${degreeK}+${b}x+${c}`:level===1?`${a}x^${degreeK}+${b}x^${degreeK+1}-${a}x^${degreeK}+${c}`:`${a}x^${degreeK}y^2+${b}xy^3+${c}`;answer=String(level===0?degreeK:level===1?degreeK+1:degreeK+2);prompt='Urči stupeň mnohočlenu po sloučení podobných členů.';break;
case'add':expression=level===0?`(${a}x+${b})+(${c}x-${d})`:level===1?`(${a}x^2-${b}x+${c})-(${d}x^2-${k}x-${a})`:`(${a}xy-${b}x^2+${c})-(${d}xy-(${k}x^2-${b}))`;break;
case'monomial':expression=level===0?`${a}x(x+${b})`:level===1?`-${a}x^2(${b}x-${c})`:`${a}xy(${b}x^2-${c}xy+${d}y^2)`;break;
case'product':expression=level===0?`(x+${a})(x-${b})`:level===1?`(${a}x-${b})(${c}x+${d})`:`(${a}x^2-${b}x+${c})(x-${d})`;break;
case'square':expression=level===0?`(x${sg}${a})^2+${b}`:level===1?`(${a}x-${b})^2`:`(${a}x-${b}y)^2+${c}xy`;break;
case'difference':expression=level===0?`(x-${a})(x+${a})+${b}`:level===1?`(${a}x-${b})(${a}x+${b})`:`(${a}x^2-${b}y)(${a}x^2+${b}y)`;break;
case'factor':goal='factor';// Coprime inner coefficients ensure the intended factor is maximal.
expression=level===0?`${a*k}x+${a*(k+1)}`:level===1?`${a*k}x^2-${a*(k+1)}x`:`${a*k}x^3y+${a*(k+1)}x^2y^2`;
answer=level===0?`${a}(${k}x+${k+1})`:level===1?`${a}x(${k}x-${k+1})`:`${a}x^2y(${k}x+${k+1}y)`;prompt='Vytkni největší společný činitel. Vnitřní výraz uprav.';break;
case'mixed':expression=level===0?`(x+${a})^2-x(x+${b})`:level===1?`(${a}x-${b})^2-(${c}x-${d})(x+${k})`:`(${a}x-${b}y)^2-(${c}x+${d}y)(${c}x-${d}y)+${k}xy`;break;
}answer=answer||M.format(M.poly(M.parse(expression)));prompt=prompt||'Uprav mnohočlen do nejjednoduššího tvaru.';
}
if(!steps.length){if(goal==='number'&&vars){const substituted=expression.replace(/[xy]/g,v=>'('+vars[v]+')').replace(/(\d)\(/g,'$1*(');steps=['Dosaď: '+substituted,...M.numericSteps(substituted).map(s=>s.expression+' = '+s.answer)]}else if(goal==='factor')steps=['Společný činitel vyděl z každého členu: '+answer,'Kontrola roznásobením: '+expression];else if(goal==='number')steps=[t==='degree'?'Po sloučení: '+M.format(M.poly(M.parse(expression)))+'; nejvyšší stupeň je '+answer:'Člen s požadovanou mocninou má koeficient '+answer];else{steps=algebraSteps(expression,answer);}}
return{kind,topic,level,seed,expression,answer,goal,vars,prompt,hint:lessons[kind][topic][4],steps};}
function algebraSteps(expression,answer){const ast=M.parse(expression),expanded=[];function strip(n){return n.t==='g'?strip(n.a):n}function walk(n,sign=1){n=strip(n);if(n.t==='+'||n.t==='-'){walk(n.a,sign);walk(n.b,n.t==='-'?-sign:sign);return}if(n.t==='u'){walk(n.a,n.op==='-'?-sign:sign);return}let products;if(n.t==='*'){products=[];for(const a of split(strip(n.a)))for(const b of split(strip(n.b)))products.push({t:'*',a,b})}else if(n.t==='^'&&strip(n.a).t!=='v'&&M.format(M.poly(n.b))==='2'){products=[];for(const a of split(strip(n.a)))for(const b of split(strip(n.a)))products.push({t:'*',a,b})}else products=[n];for(const v of products){const s=M.format(M.poly(v));expanded.push(sign<0?'-('+s+')':s)}}function split(n){n=strip(n);if(n.t==='+')return[...split(n.a),...split(n.b)];if(n.t==='-')return[...split(n.a),...split(n.b).map(a=>({t:'u',op:'-',a}))];return[n]}walk(ast);return['Rozepiš součiny a odstraň závorky: '+expanded.join(' + '),'Sluč podobné členy: '+answer]}
function verify(kind,topic,level,seed){const p=generate(kind,topic,level,seed),t=lessons[kind][topic][0];let question,answer,explain;const r=rng(seed),a=2+Math.floor(r()*8),b=2+Math.floor(r()*7);
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
const api={lessons,generate,verify,algebraSteps};if(typeof module!=='undefined')module.exports=api;root.ExpressionContent=api;})(typeof globalThis!=='undefined'?globalThis:this);
