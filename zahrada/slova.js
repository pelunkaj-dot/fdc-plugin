/* FajnZahrada – vyjmenovaná slova (data).
   Pro každou obojetnou souhlásku: vs = vyjmenovaná slova v pořadí, jak se učí ve škole,
   pr = příbuzná slova (klíč = vyjmenované slovo, od kterého pochází),
   i = slova, kde po téže souhlásce v kořeni píšeme i/í (nejsou vyjmenovaná ani příbuzná).
   Rozhodující písmeno = první i/í/y/ý hned za danou souhláskou (vlastní jména s velkým písmenem jen v Řadě).
   Platí i pro Node.js (testy): module.exports. */
(function(root){
'use strict';
const ZS = {
 B:{vs:'být bydlit obyvatel byt příbytek nábytek dobytek obyčej bystrý bylina kobyla býk Přibyslav',
   pr:{'být':'bývat byl bytost zbytek zbytečný pobyt dobývat ubývat přibývat bývalý nabýt odbýt',
       'bydlit':'bydliště bydlení obydlí', 'obyvatel':'obyvatelstvo obyvatelný neobyvatelný', 'byt':'bytový',
       'nábytek':'nábytkový', 'dobytek':'dobytče', 'obyčej':'obyčejný obyčejně', 'bystrý':'bystřina bystrost',
       'bylina':'bylinka bylinkový bylinář', 'kobyla':'kobylka kobylí', 'býk':'býček býčí'},
   i:'bílý bílek bič bičík bitva bitka bít obilí obilný bída bídný babička zbitý'},
 L:{vs:'slyšet mlýn blýskat polykat plynout plýtvat vzlykat lysý lýko lýtko lyže pelyněk plyš',
   pr:{'slyšet':'slyšitelný neslyšící uslyšet slýchat', 'mlýn':'mlynář mlynářka mlýnek mlýnský',
       'blýskat':'blýskavý blyštět blýskání', 'polykat':'spolykat polykání', 'plynout':'plynulý plyn plynový plynule',
       'plýtvat':'plýtvání', 'vzlykat':'vzlyk vzlykot', 'lysý':'lysina', 'lýko':'lýkový', 'lýtko':'lýtkový',
       'lyže':'lyžař lyžovat lyžařský', 'pelyněk':'pelyňkový', 'plyš':'plyšový plyšák'},
   i:'lípa list listí liška lilie líný líto lis lid lidový slib slíbit plivat klid klidný blízko blikat plíce plíseň klika líbit lízat'},
 M:{vs:'my mýt myslit mýlit hmyz myš hlemýžď mýtit zamykat smýkat dmýchat chmýří nachomýtnout Litomyšl',
   pr:{'mýt':'umývat umývadlo mýdlo myčka mycí', 'myslit':'myšlenka smysl smyslový nesmysl úmysl rozmyslet myslivec myslivna přemýšlet',
       'mýlit':'omyl mylný omylem neomylný', 'hmyz':'hmyzí', 'myš':'myška myšák myší', 'hlemýžď':'hlemýždí',
       'mýtit':'mýtina vymýtit', 'zamykat':'odemykat zamykání', 'smýkat':'smyk smyčka', 'dmýchat':'dmychadlo'},
   i:'milý mile míč mísa mince minuta místo mír mimo mistr smích smíchat mít mívat mizet zmizet kominík zamilovat'},
 P:{vs:'pýcha pytel pysk netopýr slepýš pyl kopyto klopýtat třpytit zpytovat pykat pýr pýřit čepýřit',
   pr:{'pýcha':'pyšný pyšně', 'pytel':'pytlík pytlák', 'pysk':'pyskatý', 'pyl':'pylový opylovat',
       'kopyto':'kopýtko kopytník', 'klopýtat':'klopýtnout', 'třpytit':'třpyt třpytivý', 'pykat':'odpykat',
       'pýřit':'zapýřit', 'čepýřit':'načepýřený'},
   i:'pivo pila pilný písek píseň pít pískat opice pichlavý píchat pilník'},
 S:{vs:'syn sytý sýr syrový sychravý usychat sýkora sýček sysel syčet sypat',
   pr:{'syn':'synovec synáček', 'sytý':'nasytit sytost sytit nenasytný', 'sýr':'sýrový sýreček',
       'syrový':'syrovátka', 'sýkora':'sýkorka', 'syčet':'sykot syčení', 'sypat':'nasypat posypat sypký násyp'},
   i:'síla silný silnice sílit síť sítko sito sirka osika prosit sídlo sídliště sirotek sít'},
 V:{vs:'vy vykat výt výskat zvykat žvýkat vydra výr vyžle povyk výheň',
   pr:{'vykat':'vykání', 'výt':'vytí zavýt', 'výskat':'výskot zavýskat', 'zvykat':'zvyk zvyklost obvykle navyknout nezvyklý',
       'žvýkat':'žvýkačka', 'vydra':'vydří'},
   i:'víla vidět vítr víno vila vítat vítěz vír zvíře svíčka svítit povídat vidlička kvítek dvířka vítězství'},
 Z:{vs:'brzy jazyk nazývat Ruzyně',
   pr:{'jazyk':'jazýček jazykový'},
   i:'zima zimní zítra zinek zisk zívat zídka'}
};
// předpona vy-/vý- (píše se vždy s y) a slova s vi-, která předponu nemají
const PREDPONA = 'vyletět výlet vyhrát výhra vyskočit výskok vyběhnout výběh vymyslet vypadat výstava vychovat výchova vyprávět výtah vytáhnout vybrat výběr';
// slovesa, kde nesmíme splést být × bít apod.: [věta, správně, chybně, vysvětlení]
const DVOJICE = [
 ['Chci ___ lékařem.','být','bít','být = existovat, stát se něčím – vyjmenované slovo'],['Nesmíš ___ psa.','bít','být','bít = tlouct, uhodit'],
 ['Včera ___ krásný den.','byl','bil','byl ← být (vyjmenované slovo)'],['Kovář ___ kladivem do železa.','bil','byl','bil ← bít (tloukl)'],
 ['Děti ___ venku.','byly','bily','byly ← být'],['Hodiny na věži ___ dvanáct.','bily','byly','bily ← bít (hodiny odbíjejí)'],
 ['Musím si ___ ruce.','mýt','mít','mýt = umývat – vyjmenované slovo'],['Chtěl bych ___ psa.','mít','mýt','mít = vlastnit'],
 ['V lese houká ___.','výr','vír','výr = sova – vyjmenované slovo'],['Na řece se točil ___.','vír','výr','vír = točící se voda'],
 ['Včely sbírají ___.','pyl','pil','pyl = prášek z květů – vyjmenované slovo'],['Táta ___ kávu.','pil','pyl','pil ← pít'],
 ['Vlk začal ___ na měsíc.','výt','vít','výt = hlasitě naříkat (vlk vyje) – vyjmenované slovo'],['Babička umí ___ věnce.','vít','výt','vít = splétat'],
 ['Musím ___ mobil.','nabít','nabýt','nabít = doplnit energii (od bít)'],['Chce ___ odvahy.','nabýt','nabít','nabýt = získat (od být)'],
 ['Rytíři chtěli ___ hrad.','dobýt','dobít','dobýt = obsadit (od být)'],['Zapomněl jsem ___ baterku.','dobít','dobýt','dobít = nabít (od bít)'],
 ['U řeky stojí starý ___.','mlýn','mlín','mlýn – vyjmenované slovo'],['Mlynář bude ___ mouku.','mlít','mlýt','mlít se píše s í, i když zní podobně jako mlýn – pozor, past!']
];
// Plevel: texty, (y) / (i) = rozhodující písmeno ve slově, které může být podvržené
const TEXTY = [
 {p:'B', t:'U dědy na statku', s:'Náš děda b(y)dlí na vesnici a chová dob(y)tek. Každé ráno nosí kob(y)le seno a b(í)lé slepice krmí ob(i)lím. Říká, že takový ob(y)čej má od dětství.'},
 {p:'B', t:'Nový byt', s:'V novém b(y:byt)tě jsme měli málo náb(y)tku. Babička nám přivezla starou skříň a b(y)linky do kuchyně. Ob(y)vatelé domu nám pomohli s b(í)lou pohovkou.'},
 {p:'B', t:'Na pastvě', s:'Na pastvě stál b(ý)k a vedle něj kob(y)la s hříbětem. Pastevec b(y)l b(y)strý a hlídal, aby se zvířata nepoprala. Zb(y)tek dne odpočívali ve stínu.'},
 {p:'B', t:'Dobývání hradu', s:'Rytíři chtěli dob(ý:dobývat)t hrad. B(i)tva trvala celý den. Nakonec se ob(y)vatelé hradu vzdali a b(i)tva skončila.'},
 {p:'L', t:'Starý mlýn', s:'Za vesnicí stojí starý ml(ý)n. Ml(y)nář v něm mele mouku. Když prší, sl(y)šíme, jak voda pl(y)ne pod kolem. Pod l(í)pou u ml(ý)na je kl(i)d.'},
 {p:'L', t:'Na horách', s:'V zimě jezdíme na l(y)žích. Táta je výborný l(y)žař. Mně se nejvíc l(í)bí sníh, který se bl(y)ští na sluníčku. Večer mě bolí l(ý)tka.'},
 {p:'L', t:'Plyšový medvídek', s:'Babička říká, že nemáme pl(ý)tvat jídlem. Malý bráška vzl(y)kal, protože nechtěl pol(y)kat prášek. Dostal pl(y)šového medvídka a hned byl kl(i)dný.'},
 {p:'L', t:'Liška v listí', s:'L(i)ška se schovala pod l(i)stí. Na l(y)sém kopci jsme našli pel(y)něk. L(í)ně jsme leželi v trávě a dívali se, jak se bl(ý)ská na časy.'},
 {p:'M', t:'Mýdlo', s:'Před jídlem si m(y:mýt)jeme ruce m(ý)dlem. M(y) jsme na to nezapomněli, ale bratr se zm(ý)lil a vzal si prací prášek. Celá rodina se tomu smála.'},
 {p:'M', t:'Malý svět v trávě', s:'V trávě žije spousta drobného hm(y)zu. Pomalu tu leze hlem(ý)žď a pod kamenem se schovává m(y)š. Táta to pozoruje lupou a m(y)slí si, že je to zajímavé.'},
 {p:'M', t:'Myslivec', s:'M(y)slivec šel lesem až na m(ý)tinu. Na tom m(í)stě postavil krmelec. Když odcházel, pečlivě zam(y)kal branku.'},
 {p:'M', t:'Úklid', s:'Máma chce m(í)t čisté nádobí, a tak ho m(y:mýt)je v m(y)čce. Já si zatím hraju s m(í)čem a dávám pozor, abych nic nerozbil.'},
 {p:'P', t:'Noční zvířata', s:'Netop(ý)r visí hlavou dolů. Kůň má na noze kop(y)to. Včely nosí p(y)l do úlu a slep(ý)š se vyhřívá na kameni.'},
 {p:'P', t:'Pyšná princezna', s:'Princezna byla p(y)šná. P(ý)cha jí nedovolila poděkovat. Nakonec za to musela p(y)kat a zap(ý)řila se studem.'},
 {p:'P', t:'Táta pracuje', s:'Táta p(i)lou řeže dřevo. Pak nasypal p(í)sek do p(y)tle a p(i)l studenou vodu. Cestou domů klop(ý)tl o kámen.'},
 {p:'P', t:'Ráno na dvoře', s:'Rosa se třp(y)tí na trávě. Kos p(í)ská na plotě a slepice čep(ý)ří peří.'},
 {p:'S', t:'Sýr pro syna', s:'Můj s(y)n má rád s(ý)r. Babička mu ho nas(y)pala do misky. Když se nas(y)til, šel ven, i když bylo s(y)chravo.'},
 {p:'S', t:'Na poli', s:'Na zahradě s(y:syčet)čí had. Na stromě sedí s(ý)kora a v poli se schovává s(y)sel. S(i)lný vítr ohýbá větve.'},
 {p:'S', t:'Písek na cestě', s:'Po s(i)lnici jel náklaďák plný písku. Řidič s(y)pal písek na cestu, aby neklouzala.'},
 {p:'S', t:'Na sídlišti', s:'Na s(í)dlišti je nové hřiště. Děti na něm hrají fotbal a s(y)n sousedů chytá do s(í)tě. Večer mu maminka dala s(y)rovou mrkev.'},
 {p:'V', t:'Noc v lese', s:'V lese žije v(ý)r a v řece v(y)dra. V noci jsme slyšeli, jak v(y:výt)jí vlci. Ráno nás probudil v(ý)skot dětí.'},
 {p:'V', t:'Noví sousedé', s:'V(y) jste noví sousedé? Je zv(y)kem, že si tu všichni v(y)kají. Pojďte dál, dáme si v(í)no a v(y)právějte.'},
 {p:'V', t:'Pes a vyžle', s:'Pes žv(ý)ká kost. Malé v(y)žle po něm kouká a v(i)dí, že by chtělo taky. V(í)tr fouká a na dvoře je pov(y)k.'},
 {p:'V', t:'Víla u potoka', s:'V(í)la tančila u potoka. Sv(í)tila jí luna a v(í)tr si hrál s jejími vlasy. Když uv(i)děla v(ý)ra, utekla.'},
 {p:'Z', t:'Zimní ráno', s:'Z(í)tra musíme vstát brz(y). V z(i)mě je ráno ještě tma. Učitelka nás naučila, jak se naz(ý)vají zimní ptáci.'},
 {p:'Z', t:'Unavený pes', s:'Pes má dlouhý jaz(y)k. Z(í)vá, protože je unavený. Na z(í)dce sedí kočka a hlídá ho.'},
 {p:'*', t:'Výlet k mlýnu', s:'M(y) jsme b(y:byl)li na v(ý)letě u ml(ý)na. Ml(y)nář nám ukázal p(y)tle s moukou a s(ý)r z vlastní kuchyně. Na zpáteční cestě jsme v(i)děli l(i)šku.'},
 {p:'*', t:'Na louce', s:'Na louce se pase kob(y)la. V(y)dra loví ryby v řece. Na b(y)linkách sedí hm(y)z a sl(y)šíme bzučení včel, které sbírají p(y)l.'},
 {p:'*', t:'Zimní kopec', s:'V(y)běhli jsme ven. Sníh se třp(y)til a l(y)že stály u dveří. Nechtěli jsme pl(ý)tvat časem, a tak jsme hned v(y:vyskočit)razili na kopec.'},
 {p:'*', t:'U babičky', s:'Babička usmažila s(ý)r a uvařila b(y)linkový čaj. M(y) jsme jí pomáhali m(ý)t nádobí. Pak nám v(y)právěla o b(ý)kovi, který b(y)dlel u jejího strýce.'},
 {p:'*', t:'Netopýr a výr', s:'Netop(ý)r se probudil brz(y) večer. Létal nad m(ý)tinou a lovil hm(y)z. V(ý)r ho sl(y)šel, ale netop(ý)r b(y)l rychlejší.'},
 {p:'*', t:'Kocour a myš', s:'Kocour se ob(y)čejně prochází po dvoře. Dnes ale uv(i)děl m(y)š a s(y:syčet)čel na ni. M(y)š se schovala do p(y)tle s ob(i)lím.'}
];

// ── odvozená data ──
const WORDS = [];   // {w, p:souhláska, k:'vs'|'pr'|'i'|'pre', base, pos:index rozhodujícího písmene}
const VOWEL = /[iíyý]/;
function critPos(w, p){
  const s=w.toLowerCase(), c=p.toLowerCase();
  for(let i=0;i<s.length-1;i++) if(s[i]===c && VOWEL.test(s[i+1])) return i+1;
  return -1;
}
Object.entries(ZS).forEach(([p,d])=>{
  d.vs.split(' ').forEach(w=>WORDS.push({w, p, k:'vs', base:w, pos:critPos(w,p), proper:/^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(w)}));
  Object.entries(d.pr).forEach(([b,ws])=>ws.split(' ').forEach(w=>WORDS.push({w, p, k:'pr', base:b, pos:critPos(w,p)})));
  d.i.split(' ').forEach(w=>WORDS.push({w, p, k:'i', base:null, pos:critPos(w,p)}));
});
PREDPONA.split(' ').forEach(w=>WORDS.push({w, p:'V', k:'pre', base:'vy-', pos:1}));
const VSORDER = Object.fromEntries(Object.entries(ZS).map(([p,d])=>[p,d.vs.split(' ')]));
// texty: rozhodující písmena
const TEXTS = TEXTY.map(x=>({...x}));
const swapIY = ch=>({i:'y',y:'i','í':'ý','ý':'í',I:'Y',Y:'I','Í':'Ý','Ý':'Í'})[ch]||ch;

// zvratné „se“ u vyjmenovaných sloves (pro zobrazení řady)
const SE = new Set('blýskat mýlit nachomýtnout třpytit pýřit čepýřit nazývat'.split(' '));
const API={SE, ZS, WORDS, VSORDER, DVOJICE, TEXTS, PREDPONA, critPos, swapIY};
if(typeof module!=='undefined'&&module.exports) module.exports=API; else root.FDZ=API;
})(typeof window!=='undefined'?window:this);
