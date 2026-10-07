/* FajnDetektiv – slovník a tvarotvorné stroje (podstatná a přídavná jména, slovesa).
   Funguje v prohlížeči (window.FDLEX) i v Node.js (module.exports) – kvůli testům.
   Každé slovo: základní tvar, vzor, sémantická skupina a jen nezbytné výjimky.
   Sémantika: o osoba, z zvíře, m místo, v věc, j jídlo, p příroda, a abstraktní. */
(function(root){
'use strict';
const VOW='aeiouyáéíóúůýě';
const ORTH=[['ňe','ně'],['ťe','tě'],['ďe','dě'],['ňi','ni'],['ťi','ti'],['ďi','di'],['ňí','ní'],['ťí','tí'],['ďí','dí'],['ňě','ně'],['ťě','tě'],['ďě','dě']];
const orth=w=>{ ORTH.forEach(([a,b])=>{ w=w.split(a).join(b); }); return w; };
const velar=st=>/(k|h|g|ch)$/.test(st);
function pal(st,end){ // měkčení k→c, h/g→z, ch→š, r→ř před -i/-e
  if(/ch$/.test(st)) return st.slice(0,-2)+'š'+end;
  if(/k$/.test(st)) return st.slice(0,-1)+'c'+end;
  if(/[hg]$/.test(st)) return st.slice(0,-1)+'z'+end;
  if(/r$/.test(st)) return st.slice(0,-1)+'ř'+end;
  return st+end;
}
function palE(st){ // 3./6. pád ženy, 6. pád města
  if(velar(st)||/r$/.test(st)) return pal(st,'e');
  if(/[dtnbpvmf]$/.test(st)) return st+'ě';
  return st+'e';
}
function voc(st){ // 5. pád pán, hrad
  if(velar(st)) return st+'u';
  if(new RegExp('[^'+VOW+']r$').test(st)) return st.slice(0,-1)+'ře';
  return st+'e';
}
const pal6pl=st=>velar(st)? pal(st,'ích') : st+'ech';
const softStem=w=>w.replace(/ně$/,'ň').replace(/tě$/,'ť').replace(/dě$/,'ď').replace(/[eěí]$/,'');

// ── VZORY: funkce (lemma, kmen, volby) → {s:[7 polí], p:[7 polí]}, pole = varianty
const V={
  'pán':(w,s,o)=>({s:[[w],[s+'a'],[s+'ovi',s+'u'],[s+'a'],[voc(s)],[s+'ovi',s+'u'],[s+'em']],
                  p:[[pal(s,'i')],[s+'ů'],[s+'ům'],[s+'y'],[pal(s,'i')],[pal6pl(s)],[s+'y']]}),
  'muž':(w,s,o)=>({s:[[w],[s+'e'],[s+'i',s+'ovi'],[s+'e'],[s+'i'],[s+'i',s+'ovi'],[s+'em']],
                  p:[[s+'i'],[s+'ů'],[s+'ům'],[s+'e'],[s+'i'],[s+'ích'],[s+'i']]}),
  'předseda':(w,s,o)=>({s:[[w],[s+'y'],[s+'ovi'],[s+'u'],[s+'o'],[s+'ovi'],[s+'ou']],
                  p:[[s+'ové'],[s+'ů'],[s+'ům'],[s+'y'],[s+'ové'],[s+'ech'],[s+'y']]}),
  'soudce':(w,s,o)=>({s:[[w],[s+'e'],[s+'i',s+'ovi'],[s+'e'],[s+'e'],[s+'i',s+'ovi'],[s+'em']],
                  p:[[s+'i'],[s+'ů'],[s+'ům'],[s+'e'],[s+'i'],[s+'ích'],[s+'i']]}),
  'hrad':(w,s,o)=>({s:[[w],[s+'u'],[s+'u'],[w],[voc(s)],[s+'u'],[s+'em']],
                  p:[[s+'y'],[s+'ů'],[s+'ům'],[s+'y'],[s+'y'],[pal6pl(s)],[s+'y']]}),
  'stroj':(w,s,o)=>({s:[[w],[s+'e'],[s+'i'],[w],[s+'i'],[s+'i'],[s+'em']],
                  p:[[s+'e'],[s+'ů'],[s+'ům'],[s+'e'],[s+'e'],[s+'ích'],[s+'i']]}),
  'žena':(w,s,o)=>({s:[[w],[s+'y'],[palE(s)],[s+'u'],[s+'o'],[palE(s)],[s+'ou']],
                  p:[[s+'y'],[s],[s+'ám'],[s+'y'],[s+'y'],[s+'ách'],[s+'ami']]}),
  'růže':(w,s,o)=>{ const e=/ě$/.test(w)?'ě':'e'; return {s:[[w],[s+e],[s+'i'],[s+'i'],[s+e],[s+'i'],[s+'í']],
                  p:[[s+e],[/ic$/.test(s)?s:s+'í'],[s+'ím'],[s+e],[s+e],[s+'ích'],[s+e+'mi']]}; },
  'píseň':(w,s,o)=>({s:[[w],[s+'e'],[s+'i'],[w],[s+'i'],[s+'i'],[s+'í']],
                  p:[[s+'e'],[s+'í'],[s+'ím'],[s+'e'],[s+'e'],[s+'ích'],[s+'emi']]}),
  'kost':(w,s,o)=>({s:[[w],[s+'i'],[s+'i'],[w],[s+'i'],[s+'i'],[s+'í']],
                  p:[[s+'i'],[s+'í'],[s+'em'],[s+'i'],[s+'i'],[s+'ech'],[s+'mi']]}),
  'město':(w,s,o)=>({s:[[w],[s+'a'],[s+'u'],[w],[w],[velar(s)?s+'u':palE(s)],[s+'em']],
                  p:[[s+'a'],[s],[s+'ům'],[s+'a'],[s+'a'],[velar(s)?s+'ách':s+'ech'],[s+'y']]}),
  'moře':(w,s,o)=>{ const e=/ě$/.test(w)?'ě':'e'; return {s:[[w],[s+e],[s+'i'],[w],[w],[s+'i'],[s+e+'m']],
                  p:[[s+e],[s+'í'],[s+'ím'],[s+e],[s+e],[s+'ích'],[s+'i']]}; },
  'kuře':(w,s,o)=>{ const e=/[tdnbpvmf]$/.test(s)?'ě':'e', ps=s.replace(/t$/,'ť').replace(/d$/,'ď').replace(/n$/,'ň');
                  return {s:[[w],[s+e+'te'],[s+e+'ti'],[w],[w],[s+e+'ti'],[s+e+'tem']],
                  p:[[ps+'ata'],[ps+'at'],[ps+'atům'],[ps+'ata'],[ps+'ata'],[ps+'atech'],[ps+'aty']]}; },
  'stavení':(w,s,o)=>({s:[[w],[w],[w],[w],[w],[w],[s+'ím']],
                  p:[[w],[w],[s+'ím'],[w],[w],[s+'ích'],[s+'ími']]})
};
const VROD={'pán':'Ma','muž':'Ma','předseda':'Ma','soudce':'Ma','hrad':'Mi','stroj':'Mi','žena':'F','růže':'F','píseň':'F','kost':'F','město':'N','moře':'N','kuře':'N','stavení':'N'};
function defStem(w,vz){
  if(['předseda','žena','město'].includes(vz)) return w.slice(0,-1);
  if(['soudce','moře','růže'].includes(vz)) return softStem(w);
  if(vz==='kuře') return w.slice(0,-1);
  if(vz==='stavení') return w.slice(0,-1);
  return w;
}
// ── DATA: řádek „lemma sémantika [klíč=hodnota…]“, klíče s=kmen, s1…s7 / p1…p7 = tvary (varianty oddělené |)
const RAW={
'pán':`student o|kamarád o|soused o p1=sousedé p5=sousedé|pán o s5=pane p1=páni|pánové p5=páni|pánové|bratr o|syn o s5=synu p1=synové p5=synové|doktor o|profesor o|inspektor o|kapitán o|pilot o|architekt o|kluk o|vnuk o|žák o|voják o|námořník o|zahradník o|kouzelník o|trpaslík o|obr o|čert o|úředník o|dělník o|básník o|chemik o|technik o|zpěvák o|detektiv o p1=detektivové|detektivi p5=detektivové|detektivi|skřítek o s=skřítk|dědeček o s=dědečk p1=dědečkové|dědečci p5=dědečkové|dědečci|tatínek o s=tatínk p1=tatínkové p5=tatínkové|strýček o s=strýčk p1=strýčkové p5=strýčkové|
pes z s=ps|kocour z|medvěd z|vlk z|holub z|sokol z|orel z s=orl|čáp z|had z|lev z s=lv|osel z s=osl|beran z|býk z|kohout z|pavouk z|brouk z|motýl z|papoušek z s=papoušk|ježek z s=ježk|krtek z s=krtk|ptáček z s=ptáčk|pták z|slon z|delfín z|tygr z|žralok z|skřivan z|havran z|pštros z|jelen z|křeček z s=křečk|králík z|datel z s=datl|kos z|drak z|
spolužák o|číšník o|kominík o|zedník o|strážník o|knihovník o|lékárník o|pošťák o|vodník o|sedlák o|poutník o|mnich o|anděl o p1=andělé p5=andělé s5=anděli|anděle|kosmonaut o|astronaut o|host o p1=hosté p5=hosté|pirát o|loupežník o|šašek o s=šašk p1=šašci|šaškové p5=šašci|šaškové|klaun o|tanečník o|závodník o|pomocník o|kapr z|losos z|pstruh z|rak z|šnek z|brouček z s=broučk|krokodýl z|velbloud z|klokan z|páv z|bažant z|čmelák z|komár z|racek z s=rack|sysel z s=sysl|netopýr z|kanár z|hroch z|šimpanz z p6=šimpanzích|šimpanzech|bobr z|leopard z|gepard z|pejsek z s=pejsk|slavík z|sýček z s=sýčk|medvídek z s=medvídk|zajíček z s=zajíčk|králíček z s=králíčk|beránek z s=beránk|koníček z s=koníčk|tučňák z|lenochod z|chameleon z`,
'muž':`muž o|král o p1=králové p5=králové|rytíř o|lékař o|hasič o|učitel o p1=učitelé p5=učitelé|spisovatel o p1=spisovatelé p5=spisovatelé|cestovatel o p1=cestovatelé p5=cestovatelé|obyvatel o p1=obyvatelé p5=obyvatelé|malíř o|kovář o|pekař o|kuchař o|řidič o|rybář o|zloděj o|čaroděj o|otec o s=otc s5=otče p1=otcové p5=otcové|chlapec o s=chlapc s5=chlapče|herec o s=herc s5=herče|vědec o s=vědc s5=vědče|sportovec o s=sportovc s5=sportovče|strýc o p1=strýcové p5=strýcové s5=strýče|princ o p1=princové p5=princové|lovec o s=lovc s5=lovče|plavec o s=plavc s5=plavče|
zajíc z|mravenec z s=mravenc s5=mravenče|vrabec z s=vrabc s5=vrabče|
farmář o|truhlář o|mlynář o|listonoš o|zubař o|hráč o|vítěz o p1=vítězové p5=vítězové|nosič o|běžec o s=běžc s5=běžče|jezdec o s=jezdc s5=jezdče|bratranec o s=bratranc s5=bratranče|cizinec o s=cizinc s5=cizinče|kovboj o|pastýř o|hlídač o|prodavač o|novinář o|lyžař o|bruslař o|dědic o s5=dědici|slepýš z|hlemýžď z|nosorožec z s=nosorožc s5=nosorožče|kůň z s=koň s3=koni|koňovi s5=koni s6=koni|koňovi p1=koně p5=koně p2=koní p3=koním p4=koně p6=koních p7=koňmi`,
'předseda':`předseda o|hrdina o|starosta o|děda o|táta o|turista o p1=turisté p5=turisté|cyklista o p1=cyklisté p5=cyklisté|houslista o p1=houslisté p5=houslisté|fotbalista o p1=fotbalisté p5=fotbalisté|policista o p1=policisté p5=policisté|kytarista o p1=kytaristé p5=kytaristé|tenista o p1=tenisté p5=tenisté|
sluha o|vévoda o|kolega o|hokejista o p1=hokejisté p5=hokejisté|šachista o p1=šachisté p5=šachisté|pianista o p1=pianisté p5=pianisté|artista o p1=artisté p5=artisté|strejda o`,
'soudce':`soudce o|vůdce o|správce o|zástupce o|průvodce o|dárce o|obránce o|zachránce o|strážce o|
poradce o|vládce o|rádce o|obhájce o|ochránce o|zastánce o`,
'hrad':`hrad m s6=hradě|hradu|most m s6=mostě|mostu|les p s2=lesa s6=lese|lesu p6=lesích|park m|obchod m s6=obchodě|zámek m s=zámk|dům m s=dom s6=domě|domu|domek m s=domk|ostrov m s2=ostrova s6=ostrově|sklep m s2=sklepa s6=sklepě|sklepu|rybník p s2=rybníka|kostel m s2=kostela s6=kostele|tunel m|hotel m|bazén m|byt m s6=bytě|bytu|stadion m|semafor v|chodník m|
plot v s6=plotě|plotu|stůl v s=stol s6=stole|stolu|deštník v|sešit v s6=sešitě|sešitu|batoh v|hrnek v s=hrnk|hrneček v s=hrnečk|vlak v|autobus v s6=autobuse|autobusu|obraz v s6=obraze|obrazu|dárek v s=dárk|zvonek v s=zvonk|balón v|papír v s6=papíře|papíru|telefon v|kufr v|svetr v|kabát v s6=kabátě|kabátu|klobouk v|knoflík v|kapesník v|prsten v|vrtulník v|kamion v|vůz v s=voz s6=voze|traktor v|sáček v s=sáčk|budík v|pohár v|balík v|dopis v s6=dopise|dopisu|lístek v s=lístk|penál v|kompas v|dalekohled v|mikroskop v|magnet v|člun v|parník v|vagón v|kočárek v s=kočárk|klíček v s=klíčk|zub v|vlas v s6=vlase|vlasu|nos v s6=nose|nosu|prst v| s6=prstě|prstu
řízek j s=řízk|dort j|rohlík j|chléb j s=chleb s2=chleba|sýr j s2=sýra|salát j|meloun j|banán j|citron j|knedlík j|bonbon j|ořech j|perník j|jogurt j|koláček j s=koláčk|
strom p s6=stromě|stromu|potok p s2=potoka|mrak p|květ p|list p s6=listě|listu|vrch p|
oběd a s2=oběda s6=obědě|večer a s2=večera|jazyk v s2=jazyka|
smrk p|dub p s6=dubu|dubě|buk p|javor p|písek p s=písk|led p s6=ledě|ledu|sníh p s=sněh pl=0|vítr p s=větr|mráz p s=mraz|oblak p|vodopád p|ostrůvek p s=ostrůvk|pahorek p s=pahork|rybníček p s=rybníčk|potůček p s=potůčk|palouk p|vrchol p|sad p s6=sadě|sadu|záhon p s6=záhonu|záhoně|plod p|tulipán p|šípek p s=šípk|slovník v|atlas v s6=atlase|atlasu|zápisník v|fix v|kelímek v s=kelímk|hrníček v s=hrníčk|talířek v s=talířk|příbor v|ubrus v s6=ubruse|ubrusu|ručník v|zip v|pásek v s=pásk|šátek v s=šátk|rukáv v|šál v|oblek v|kostým v|sandál v|krk v|bok v|nehet v s=neht|kotník v|trolejbus v s6=trolejbuse|trolejbusu|motocykl v|bagr v|kočár v|skútr v|mobil v|šroubovák v|vozík v|kufřík v|zámeček v s=zámečk|věšák v|lék v|obrázek v s=obrázk|míček v s=míčk|vláček v s=vláčk|kamínek v s=kamínk|klacek v s=klack|provaz v s6=provaze|provazu|stan v|spacák v|ruksak v|lustr v|supermarket m|trh m|palouček p s=paloučk|dvůr m s=dvor s2=dvora s6=dvoře|statek m s=statk|kurník m|úl m|přístav m|kanál m|schod m s6=schodě|schodu|výtah m|balkon m s6=balkoně|balkonu|strop m s6=stropě|stropu|komín m s6=komíně|komínu|kout m s6=koutě|koutu|domov m s2=domova s6=domově|záchod m s6=záchodě|záchodu|sál m s6=sále|sálu|vchod m|obchůdek m s=obchůdk|salám j|párek j s=párk|tvaroh j pl=0|med j pl=0|džem j|cukr j pl=0|česnek j pl=0|špenát j pl=0|hrozen j s=hrozn|ananas j|kompot j|oříšek j s=oříšk|preclík j|rybíz j pl=0|výlet a s6=výletě|výletu|závod a s6=závodě|závodu|zápas a s6=zápase|zápasu|úkol a|nápad a|příběh a|sen a s=sn|zvuk a|hlas a s6=hlase|hlasu|čas a s6=čase|času|víkend a|svátek a s=svátk|úsměv a|pozdrav a|příklad a|film a|koncert a s6=koncertě|koncertu|zájezd a|sport a|tenis a pl=0|fotbal a pl=0|pokus a|vtip a|dotaz a|rozhovor a|začátek a s=začátk|čtvrtek a s=čtvrtk|pátek a s=pátk`,
'stroj':`stroj v|míč v|klíč v|nůž v s=nož|koš v|talíř v|počítač v|polštář v|kalendář v|kolotoč v|meč v|pytel v s=pytl|hrnec v s=hrnc|věnec v s=věnc|plášť v|koberec v s=koberc|
pokoj m|kraj m|keř p|kopec p s=kopc|měsíc p|čaj j|koláč j|pomeranč j|cíl a|tanec a s=tanc|konec a s=konc|
gauč v|kartáč v|štětec v s=štětc|límec v s=límc|palec v s=palc|obličej v|háj p|déšť p s=dešť|hokej a pl=0|palác m|kříž v|ovladač v|vysavač v|kotouč v|bič v|vějíř v|zvonec v s=zvonc|kotel v s=kotl`,
'žena':`žena o p2=žen|maminka o p2=maminek|babička o p2=babiček|sestra o p2=sester|holka o p2=holek|teta o p2=tet|kamarádka o p2=kamarádek|učitelka o p2=učitelek|lékařka o p2=lékařek|princezna o p2=princezen|královna o p2=královen|víla o p2=víl|dívka o p2=dívek|hrdinka o p2=hrdinek|zpěvačka o p2=zpěvaček|kuchařka o p2=kuchařek|prodavačka o p2=prodavaček|sousedka o p2=sousedek|dcera o p2=dcer s3=dceři s6=dceři|
kočka z p2=koček|kráva z p2=krav p3=kravám|krávám p6=kravách|krávách p7=kravami|krávami|koza z p2=koz|ryba z p2=ryb|rybka z p2=rybek|sova z p2=sov|liška z p2=lišek|husa z p2=hus|kachna z p2=kachen|žába z p2=žab p3=žábám|žabám p6=žábách|žabách p7=žábami|žabami|včela z p2=včel|veverka z p2=veverek|sýkora z p2=sýkor|vrána z p2=vran p3=vránám|vranám p6=vránách|vranách p7=vránami|vranami|moucha z p2=much|želva z p2=želv|zebra z p2=zeber|žirafa z p2=žiraf|velryba z p2=velryb|myška z p2=myšek|
škola m p2=škol|zahrada m p2=zahrad|louka p p2=luk p3=loukám|lukám p6=loukách|lukách p7=loukami|lukami|řeka p p2=řek|hora p p2=hor|cesta m p2=cest|chata m p2=chat|třída m p2=tříd|knihovna m p2=knihoven|farma m p2=farem|zastávka m p2=zastávek|dílna m p2=dílen|kavárna m p2=kaváren|školka m p2=školek|pyramida m p2=pyramid|brána m p2=bran p3=branám|bránám p6=branách|bránách p7=branami|bránami|chalupa m p2=chalup|továrna m p2=továren|pošta m p2=pošt|banka m p2=bank|lékárna m p2=lékáren|tělocvična m p2=tělocvičen|jídelna m p2=jídelen|koupelna m p2=koupelen|
kniha v p2=knih|tužka v p2=tužek|taška v p2=tašek|lampa v p2=lamp|lampička v p2=lampiček|koruna v p2=korun|panenka v p2=panenek|hračka v p2=hraček|bota v p2=bot|kapsa v p2=kapes|křída v p2=křid|váza v p2=váz|karta v p2=karet|mapa v p2=map|raketa v p2=raket|lopata v p2=lopat|kytara v p2=kytar|aktovka v p2=aktovek|pohovka v p2=pohovek|lednička v p2=ledniček|trubka v p2=trubek|houpačka v p2=houpaček|koloběžka v p2=koloběžek|lžička v p2=lžiček|vidlička v p2=vidliček|deka v p2=dek|šála v p2=šál|bunda v p2=bund|tabulka v p2=tabulek|kostka v p2=kostek|kulička v p2=kuliček|svíčka v p2=svíček|peněženka v p2=peněženek|obálka v p2=obálek|známka v p2=známek|pastelka v p2=pastelek|guma v p2=gum|schránka v p2=schránek|
hruška j p2=hrušek|jahoda j p2=jahod|polévka j p2=polévek|buchta j p2=buchet|houska j p2=housek|brambora j p2=brambor|okurka j p2=okurek|švestka j p2=švestek|meruňka j p2=meruněk|čokoláda j p2=čokolád|zmrzlina j p2=zmrzlin|paprika j p2=paprik|limonáda j p2=limonád|malina j p2=malin|borůvka j p2=borůvek|sušenka j p2=sušenek|palačinka j p2=palačinek|
tráva p p2=trav p3=trávám|travám p6=trávách|travách p7=trávami|travami|skála p p2=skal p3=skalám p6=skalách p7=skalami|hvězda p p2=hvězd|duha p p2=duh|květina p p2=květin|voda p p2=vod|lípa p p2=lip p3=lípám|lipám p6=lípách|lipách p7=lípami|lipami|bříza p p2=bříz|houba p p2=hub|vlna p p2=vln|bouřka p p2=bouřek|
pohádka a p2=pohádek|hra a p2=her|otázka a p2=otázek|hádanka a p2=hádanek|zpráva a p2=zpráv|písnička a p2=písniček|chyba a p2=chyb|úloha a p2=úloh|rada a p2=rad|hodina a p2=hodin|minuta a p2=minut|sobota a p2=sobot|středa a p2=střed|zima a p2=zim|
vnučka o p2=vnuček|malířka o p2=malířek|spisovatelka o p2=spisovatelek|doktorka o p2=doktorek|holčička o p2=holčiček|slečna o p2=slečen|sestřička o p2=sestřiček|čarodějka o p2=čarodějek|rusalka o p2=rusalek|ježibaba o p2=ježibab|policistka o p2=policistek|pekařka o p2=pekařek|kmotra o p2=kmoter|slepička z p2=slepiček|kachnička z p2=kachniček|ovečka z p2=oveček|opička z p2=opiček|srnka z p2=srnek|kuna z p2=kun|vydra z p2=vyder|krysa z p2=krys|žížala z p2=žížal|housenka z p2=housenek|beruška z p2=berušek|vosa z p2=vos|kobylka z p2=kobylek|štika z p2=štik|ropucha z p2=ropuch|ještěrka z p2=ještěrek|užovka z p2=užovek|kobra z p2=kober|straka z p2=strak|kavka z p2=kavek|kukačka z p2=kukaček|vlaštovka z p2=vlaštovek|krůta z p2=krůt|gorila z p2=goril|panda z p2=pand|koala z p2=koal|lama z p2=lam|medúza z p2=medúz|rybička z p2=rybiček|kočička z p2=kočiček|kobyla z p2=kobyl|klisna z p2=klisen|fena z p2=fen|srna z p2=srn|vila m p2=vil|budova m p2=budov|katedrála m p2=katedrál|rozhledna m p2=rozhleden|hospoda m p2=hospod|pekárna m p2=pekáren|cukrárna m p2=cukráren|prodejna m p2=prodejen|výstava a p2=výstav|šatna m p2=šaten|chodba m p2=chodeb|zahrádka m p2=zahrádek|loďka v p2=loděk|planeta p p2=planet|krajina p p2=krajin|studánka p p2=studánek|sopka p p2=sopek|pustina p p2=pustin|obloha p p2=obloh|mlha p p2=mlh|kapka p p2=kapek|vločka p p2=vloček|sněženka p p2=sněženek|pampeliška p p2=pampelišek|kopretina p p2=kopretin|šiška p p2=šišek|větvička p p2=větviček|kytka p p2=kytek|růžička p p2=růžiček|miska v p2=misek|konvička v p2=konviček|plechovka v p2=plechovek|kabelka v p2=kabelek|mikina v p2=mikin|punčocha v p2=punčoch|ponožka v p2=ponožek|bačkora v p2=bačkor|holinka v p2=holinek|knížka v p2=knížek|propiska v p2=propisek|baterka v p2=baterek|pila v p2=pil|sekera v p2=seker|motyka v p2=motyk|kosa v p2=kos|kolébka v p2=kolébek|skládačka v p2=skládaček|píšťalka v p2=píšťalek|flétna v p2=fléten|harmonika v p2=harmonik|trumpeta v p2=trumpet|fotka v p2=fotek|bankovka v p2=bankovek|kasička v p2=kasiček|pokladnička v p2=pokladniček|truhla v p2=truhel|truhlička v p2=truhliček|krabička v p2=krabiček|lupa v p2=lup|buzola v p2=buzol|pračka v p2=praček|trouba v p2=trub|postýlka v p2=postýlek|polička v p2=poliček|skříňka v p2=skříněk|lavička v p2=laviček|klouzačka v p2=klouzaček|prolézačka v p2=prolézaček|lokomotiva v p2=lokomotiv|motorka v p2=motorek|tříkolka v p2=tříkolek|helma v p2=helem|vlajka v p2=vlajek|kotva v p2=kotev|plachta v p2=plachet|bábovka j p2=bábovek|omáčka j p2=omáček|klobása j p2=klobás|šunka j p2=šunek|vánočka j p2=vánoček|mouka j p2=mouk pl=0|ředkvička j p2=ředkviček|čočka j p2=čoček|ostružina j p2=ostružin|brusinka j p2=brusinek|rozinka j p2=rozinek|pomazánka j p2=pomazánek|marmeláda j p2=marmelád|káva j p2=káv|kobliha j p2=koblih|oplatka j p2=oplatek|veka j p2=vek|bageta j p2=baget|svačina j p2=svačin|jízda a p2=jízd|výprava a p2=výprav|návštěva a p2=návštěv|oslava a p2=oslav|odměna a p2=odměn|pochvala a p2=pochval|poznámka a p2=poznámek|věta a p2=vět|slabika a p2=slabik|hláska a p2=hlásek|povídka a p2=povídek|legenda a p2=legend|tajenka a p2=tajenek|záhada a p2=záhad|stopa a p2=stop|značka a p2=značek|šifra a p2=šifer|vteřina a p2=vteřin|doba a p2=dob|chvilka a p2=chvilek|přestávka a p2=přestávek|nálada a p2=nálad|zábava a p2=zábav|pravda a p2=pravd`,
'růže':`růže p|židle v|ulice m|vesnice m|silnice m|lžíce v p2=lžic|košile v p2=košil|tabule v|lavice v|čepice v|rukavice v|sklenice v|krabice v|slepice z|opice z|ovce z|kuchyně m|stanice m|nemocnice m|ložnice m|restaurace m|jeskyně m|lekce a|čarodějnice o|tanečnice o|sukně v|chvíle a p2=chvil|duše a|borovice p|jedle p|louže p|neděle a|
sestřenice o|lvice z|medvědice z|vlčice z|chobotnice z|hvězdice z|dálnice m|radnice m|kaple m|galerie m|ordinace m|země p|džungle p|bouře p|lilie p|kapuce v|stavebnice v|pohlednice v|fotografie v|mince v|baterie v|televize v|lednice v|brusle v|lyže v|šavle v|kaše j|cibule j|dýně j|fazole j|rýže j|číslice a|naděje a|práce a s7=prací p2=prací p3=pracím p6=pracích p7=pracemi|vůně a`,
'píseň':`píseň a s=písň|báseň a s=básň|dlaň v|postel v|tramvaj v|kolej m|skříň v|pláž m|garáž m|kaluž p|labuť z|větev p s=větv|mrkev j s=mrkv|třešeň j s=třešň|jabloň p|broskev j s=broskv|konev v s=konv|věž m|kancelář m|předsíň m|
pánev v s=pánv|soutěž a|síť v|laň z|pláň p|poušť p|tůň p|stráň p|klec v|mříž v|zbraň v|tvář v`,
'kost':`kost a|věc v|řeč a|radost a|starost a|bolest a|rychlost a|část a|zeď m s=zd|
paměť a s=pamět|myš z p3=myším p6=myších|noc a p3=nocím p6=nocích p7=nocemi|nemoc a p7=nemocemi|drobnost a|slavnost a|vlastnost a|povinnost a|hloupost a|zvědavost a|trpělivost a|mast v`,
'město':`město m p2=měst|slovo a p2=slov s6=slově|slovu|kolo v p2=kol|auto v p2=aut s6=autě|autu|okno v p2=oken|jablko j p2=jablek|letadlo v p2=letadel|divadlo m p2=divadel|kino m p2=kin|zrcadlo v p2=zrcadel|hnízdo p p2=hnízd|vajíčko j p2=vajíček|jezero p p2=jezer|křeslo v p2=křesel|sluníčko p p2=sluníček|pero v p2=per s6=peře|peru|těsto j p2=těst s6=těstě|těstu|tričko v p2=triček|místo m p2=míst s6=místě|místu|maso j p2=mas s6=mase|masu|prasátko z p2=prasátek|zvířátko z p2=zvířátek|kuřátko z p2=kuřátek|koťátko z p2=koťátek|štěňátko z p2=štěňátek|kolečko v p2=koleček|autíčko v p2=autíček|mýdlo v p2=mýdel|víko v p2=vík|kladivo v p2=kladiv|pírko v p2=pírek|kopyto v p2=kopyt s6=kopytě|kopytu|lano v p2=lan s6=laně|lanu|sedlo v p2=sedel s6=sedle|sedlu|křídlo v p2=křídel|jídlo j p2=jídel s6=jídle|jídlu|dřevo p p2=dřev s6=dřevě|dřevu|patro m p2=pater s6=patře|patru|vědro v p2=věder|umyvadlo v p2=umyvadel|zrcátko v p2=zrcátek|světlo v p2=světel s6=světle|světlu|srdíčko a p2=srdíček|okénko v p2=okének|jablíčko j p2=jablíček|
jaro a p2=jar|léto a p2=let|pravítko v p2=pravítek|lízátko j p2=lízátek|metro v p2=meter s6=metru pl=0|telátko z p2=telátek|hříbátko z p2=hříbátek|jehňátko z p2=jehňátek|tílko v p2=tílek|peříčko v p2=peříček|sklo v p2=skel|máslo j p2=másel|víno j p2=vín|lepidlo v p2=lepidel|razítko v p2=razítek|číslo a p2=čísel|písmeno a p2=písmen|jméno a p2=jmen|heslo a p2=hesel|kouzlo a p2=kouzel|veslo v p2=vesel|sedadlo v p2=sedadel|lůžko v p2=lůžek|kladívko v p2=kladívek|zrnko p p2=zrnek|semínko p p2=semínek|stéblo p p2=stébel|rameno v p2=ramen|čelo v p2=čel|tělo v p2=těl|mléko j pl=0 s6=mléku|mléce`,
'moře':`moře p|pole p|srdce a|hřiště m p2=hřišť|letiště m p2=letišť|parkoviště m p2=parkovišť|sídliště m p2=sídlišť|vejce j p2=vajec|
slunce p p2=sluncí|nástupiště m p2=nástupišť|schodiště m p2=schodišť|koupaliště m p2=koupališť|kluziště m p2=kluzišť|tábořiště m p2=tábořišť|ohniště m p2=ohnišť|jeviště m p2=jevišť|pastviště m p2=pastvišť`,
'kuře':`kuře z|kotě z|štěně z|prase z|tele z|house z|zvíře z|hříbě z|mládě z|slůně z|lvíče z|káče z|kůzle z|jehně z|ptáče z|rajče j|koště v|poupě p|
medvídě z|vlče z|lišče z|sele z|děvče o|doupě m`,
'stavení':`stavení m|nádraží m|náměstí m|přání a|údolí p|cvičení a|vysvědčení v|obydlí m|pobřeží p|přízemí m|zábradlí v|
nádobí v|pondělí a|tajemství a|přísloví a|povolání a|vyprávění a|dobrodružství a|království m|překvapení a|setkání a|vítězství a|vysvětlení a|nádvoří m|podzemí m|pohoří p|předměstí m|psaní a|čtení a`
};
// Nepravidelná slova: tvary zapsané celé (tvary j. č.;mn. č.), vzor jen pro jednotné číslo, nepoužívají se k určování vzoru
const ZVL=`člověk o pán Ma člověk,člověka,člověku/člověkovi,člověka,člověče,člověku/člověkovi,člověkem;lidé,lidí,lidem,lidi,lidé,lidech,lidmi
dítě o kuře N dítě,dítěte,dítěti,dítě,dítě,dítěti,dítětem;děti,dětí,dětem,děti,děti,dětech,dětmi
oko v město N oko,oka,oku,oko,oko,oku,okem;oči,očí,očím,oči,oči,očích,očima
ucho v město N ucho,ucha,uchu,ucho,ucho,uchu,uchem;uši,uší,uším,uši,uši,uších,ušima
ruka v žena F ruka,ruky,ruce,ruku,ruko,ruce,rukou;ruce,rukou,rukám,ruce,ruce,rukou/rukách,rukama
noha v žena F noha,nohy,noze,nohu,noho,noze,nohou;nohy,nohou,nohám,nohy,nohy,nohou/nohách,nohama
den a hrad Mi den,dne,dni/dnu,den,dni,dni/dnu,dnem;dny/dni,dnů/dní,dnům,dny/dni,dny/dni,dnech,dny
týden a hrad Mi týden,týdne,týdnu,týden,týdne,týdnu/týdni,týdnem;týdny,týdnů,týdnům,týdny,týdny,týdnech,týdny
kámen p hrad Mi kámen,kamene/kamenu,kameni/kamenu,kámen,kameni,kameni/kamenu,kamenem;kameny,kamenů,kamenům,kameny,kameny,kamenech,kameny
loket v hrad Mi loket,lokte,lokti,loket,lokti,lokti/loktu,loktem;lokty,loktů,loktům,lokty,lokty,loktech,lokty
rok a hrad Mi rok,roku,roku,rok,roku,roce/roku,rokem;roky,roků/let,rokům,roky,roky,rocích/letech,roky
pes z pán Ma -`;
const LEX=[];
Object.entries(RAW).forEach(([vz,txt])=>txt.replace(/\n/g,'|').split('|').filter(Boolean).reduce((acc,part)=>{
  // řádky jsou odděleny „|“, ale hodnoty klíčů mohou obsahovat varianty s „|“ → poskládat zpět
  if(/^[a-záčďéěíňóřšťúůýž]+ [ozmvjpa]( |$)/.test(part) || !acc.length) acc.push(part); else acc[acc.length-1]+='|'+part; return acc; },[])
  .forEach(line=>{
    const [w,sem,...kv]=line.trim().split(' ');
    const o={}; kv.forEach(x=>{ const i=x.indexOf('='); o[x.slice(0,i)]=x.slice(i+1); });
    const stem=o.s||defStem(w,vz);
    const f=V[vz](w,stem,o);
    ['s','p'].forEach(n=>{ for(let i=1;i<=7;i++){ const k=n+i; if(o[k]) f[n][i-1]=o[k].split('|'); } });
    if(vz==='předseda' && o.p1) f.p[4]=f.p[0];
    if(o.pl==='0') f.p=f.p.map(()=>[]);
    ['s','p'].forEach(n=>f[n]=f[n].map(a=>[...new Set(a.map(orth))]));
    LEX.push({w, vzor:vz, rod:VROD[vz], sem, stem, f, nopl:o.pl==='0'});
  }));

ZVL.split('\n').forEach(l=>{ const [w,sem,vz,rod,ff]=l.split(' '); if(ff==='-') return;
  const [a,b]=ff.split(';'), sp=x=>x.split(',').map(y=>y.split('/'));
  LEX.push({w, vzor:vz, rod, sem, stem:null, f:{s:sp(a), p:sp(b)}, irr:true});
});

// ── PŘÍDAVNÁ JMÉNA
function palAdj(st){
  if(/sk$/.test(st)) return st.slice(0,-2)+'ští';
  if(/ck$/.test(st)) return st.slice(0,-2)+'čtí';
  if(/ch$/.test(st)) return st.slice(0,-2)+'ší';
  if(/k$/.test(st)) return st.slice(0,-1)+'cí';
  if(/[hg]$/.test(st)) return st.slice(0,-1)+'zí';
  if(/r$/.test(st)) return st.slice(0,-1)+'ří';
  return st+'í';
}
const ADJ_RAW={
 tvrde:`malý velký nový starý hezký krásný ošklivý dobrý zlý hodný veselý smutný zelený červený modrý žlutý bílý černý šedý hnědý růžový fialový oranžový zlatý stříbrný
rychlý pomalý tichý hlasitý silný slabý tlustý hubený vysoký nízký dlouhý krátký široký úzký hluboký mělký těžký lehký měkký tvrdý teplý studený horký mokrý suchý
čistý špinavý plný prázdný hladový sytý mladý chytrý hloupý pilný líný šikovný hravý kulatý hranatý ostrý tupý hladký drsný sladký kyselý slaný hořký čerstvý
statečný bázlivý divoký krotký moudrý veliký drahý levný bohatý chudý zdravý nemocný unavený šťastný milý laskavý přátelský český zimomřivý kamenný dřevěný skleněný papírový
bystrý vlídný zvídavý poctivý upřímný skromný pyšný vzácný obyčejný tajemný záhadný kouzelný pohádkový strašidelný temný světlý tmavý jasný slunečný deštivý mlhavý větrný mrazivý zasněžený kluzký voňavý chutný lahodný výborný skvělý úžasný nádherný ohromný obrovský malinký maličký drobný štíhlý mocný slavný známý neznámý oblíbený starobylý dávný hbitý obratný opatrný pečlivý nedbalý zvědavý ospalý čilý hlučný klidný rozzlobený vyděšený překvapený spokojený radostný zamračený usměvavý ochotný pracovitý spravedlivý krutý mazaný vážný vtipný směšný zábavný nudný zajímavý důležitý potřebný užitečný zbytečný správný chybný přesný jistý pevný křehký pružný mastný pálivý syrový vařený pečený smažený sušený mražený zralý shnilý strmý plochý oválný hrbolatý rovný křivý hustý řídký lesklý průhledný barevný pestrý strakatý pruhovaný puntíkovaný kostkovaný rezavý kovový plastový vlněný bavlněný kožený hedvábný sametový vlhký zaprášený rozbitý ztracený schovaný tajný skrytý podezřelý nebezpečný bezpečný otevřený zavřený zamčený volný celý rodný venkovský městský horský mořský kouzelnický rytířský královský zámecký dětský lidský loňský minulý stejný společný výtvarný filmový ledový sněhový dešťový ohnivý ocelový plechový vlakový autobusový`,
 mekke:`jarní letní zimní podzimní moderní cizí ranní večerní noční první poslední sousední hlavní domácí lesní školní zahradní denní páteční nedělní sobotní dnešní zítřejší včerejší
horní dolní přední zadní vnitřní venkovní polní městský? luční mořský? svatební dětský? kuchyňský? střední levý?
zvláštní legrační říční ptačí psí kočičí medvědí liščí vlčí rybí kuřecí hovězí telecí letošní budoucí vedlejší místní prostřední dřívější pozdější tehdejší zdejší jižní severní východní západní boční krajní velikonoční vánoční sváteční každodenní týdenní měsíční roční polední odpolední dopolední půlnoční sluneční hudební sportovní divadelní knižní vodní pouštní pracovní cestovní nákupní silniční železniční`,
 privl:`otcův:otcov:otci bratrův:bratrov:bratrovi dědův:dědov:dědovi tatínkův:tatínkov:tatínkovi sousedův:sousedov:sousedovi strýcův:strýcov:strýci kamarádův:kamarádov:kamarádovi učitelův:učitelov:učiteli
matčin:matčin:matce sestřin:sestřin:sestře babiččin:babiččin:babičce maminčin:maminčin:mamince tetin:tetin:tetě kamarádčin:kamarádčin:kamarádce učitelčin:učitelčin:učitelce Evin:Evin:Evě Janin:Janin:Janě
dědečkův:dědečkov:dědečkovi králův:králov:králi rytířův:rytířov:rytíři pánův:pánov:pánovi Petrův:Petrov:Petrovi Pavlův:Pavlov:Pavlovi Tomášův:Tomášov:Tomášovi Honzův:Honzov:Honzovi strejdův:strejdov:strejdovi
Petřin:Petřin:Petře Klářin:Klářin:Kláře Lucčin:Lucčin:Lucce Annin:Annin:Anně Mařenčin:Mařenčin:Mařence princeznin:princeznin:princezně královnin:královnin:královně Zuzanin:Zuzanin:Zuzaně Hančin:Hančin:Hance`
};
const AEND={
 mlady:{Ma:{s:['ý','ého','ému','ého','ý','ém','ým'],p:['@í','ých','ým','é','@í','ých','ými']},
        Mi:{s:['ý','ého','ému','ý','ý','ém','ým'],p:['é','ých','ým','é','é','ých','ými']},
        F:{s:['á','é','é','ou','á','é','ou'],p:['é','ých','ým','é','é','ých','ými']},
        N:{s:['é','ého','ému','é','é','ém','ým'],p:['á','ých','ým','á','á','ých','ými']}},
 jarni:{Ma:{s:['í','ího','ímu','ího','í','ím','ím'],p:['í','ích','ím','í','í','ích','ími']},
        Mi:{s:['í','ího','ímu','í','í','ím','ím'],p:['í','ích','ím','í','í','ích','ími']},
        F:{s:['í','í','í','í','í','í','í'],p:['í','ích','ím','í','í','ích','ími']},
        N:{s:['í','ího','ímu','í','í','ím','ím'],p:['í','ích','ím','í','í','ích','ími']}},
 privl:{Ma:{s:['#','a','u','a','#','ě|u','ým'],p:['i','ých','ým','y','i','ých','ými']},
        Mi:{s:['#','a','u','#','#','ě|u','ým'],p:['y','ých','ým','y','y','ých','ými']},
        F:{s:['a','y','ě','u','a','ě','ou'],p:['y','ých','ým','y','y','ých','ými']},
        N:{s:['o','a','u','o','o','ě|u','ým'],p:['a','ých','ým','a','a','ých','ými']}}
};
const ADJ=[];
ADJ_RAW.tvrde.split(/\s+/).filter(Boolean).forEach(w=>ADJ.push({w,druh:'tvrde',vzor:'mladý',stem:w.slice(0,-1),t:'mlady'}));
ADJ_RAW.mekke.split(/\s+/).filter(w=>w&&!w.endsWith('?')).forEach(w=>ADJ.push({w,druh:'mekke',vzor:'jarní',stem:w.slice(0,-1),t:'jarni'}));
ADJ_RAW.privl.split(/\s+/).filter(Boolean).forEach(x=>{ const [w,stem,own]=x.split(':'); ADJ.push({w,druh:'privl',vzor:/ův$/.test(w)?'otcův':'matčin',stem,own,t:'privl'}); });
function adjForms(a){ const E=AEND[a.t], r={};
  for(const g of ['Ma','Mi','F','N']) r[g]={s:E[g].s.map(e=>e.split('|').map(x=>x==='#'?a.w:a.stem+x)), p:E[g].p.map(e=>e.split('|').map(x=>x==='@í'?palAdj(a.stem):a.stem+x))};
  return r; }

// ── SLOVESA (jen nedokonavá, budoucí čas „budu + neurčitek“ je pro ně správně)
// neurčitek | 1. os. j. č. | 3. os. j. č. | 3. os. mn. č. | příčestí (j. č.[/mn. č.]) | rozkaz 2. os. j. č. (– = nepoužívat)
const VERB_RAW=`dělat|dělám|dělá|dělají|dělal|dělej
volat|volám|volá|volají|volal|volej
zpívat|zpívám|zpívá|zpívají|zpíval|zpívej
běhat|běhám|běhá|běhají|běhal|běhej
hrát|hraju/hraji|hraje|hrají|hrál|hraj
psát|píšu/píši|píše|píšou/píší|psal|piš
číst|čtu|čte|čtou|četl|čti
pít|piju/piji|pije|pijí/pijou|pil|pij
kupovat|kupuju/kupuji|kupuje|kupují/kupujou|kupoval|kupuj
malovat|maluju/maluji|maluje|malují/malujou|maloval|maluj
plavat|plavu|plave|plavou|plaval|plav
skákat|skáču|skáče|skáčou|skákal|skákej
jíst|jím|jí|jedí|jedl|jez
cestovat|cestuju/cestuji|cestuje|cestují/cestujou|cestoval|cestuj
pracovat|pracuju/pracuji|pracuje|pracují/pracujou|pracoval|pracuj
tancovat|tancuju/tancuji|tancuje|tancují/tancujou|tancoval|tancuj
čekat|čekám|čeká|čekají|čekal|čekej
poslouchat|poslouchám|poslouchá|poslouchají|poslouchal|poslouchej
plakat|pláču|pláče|pláčou|plakal|plač
studovat|studuju/studuji|studuje|studují/studujou|studoval|studuj
děkovat|děkuju/děkuji|děkuje|děkují/děkujou|děkoval|děkuj
opakovat|opakuju/opakuji|opakuje|opakují/opakujou|opakoval|opakuj
milovat|miluju/miluji|miluje|milují/milujou|miloval|miluj
telefonovat|telefonuju/telefonuji|telefonuje|telefonují/telefonujou|telefonoval|telefonuj
fotografovat|fotografuju/fotografuji|fotografuje|fotografují/fotografujou|fotografoval|fotografuj
hledat|hledám|hledá|hledají|hledal|hledej
létat|létám|létá|létají|létal|létej
sbírat|sbírám|sbírá|sbírají|sbíral|sbírej
pomáhat|pomáhám|pomáhá|pomáhají|pomáhal|pomáhej
odpovídat|odpovídám|odpovídá|odpovídají|odpovídal|odpovídej
chytat|chytám|chytá|chytají|chytal|chytej
zavírat|zavírám|zavírá|zavírají|zavíral|zavírej
otvírat|otvírám|otvírá|otvírají|otvíral|otvírej
trhat|trhám|trhá|trhají|trhal|trhej
skládat|skládám|skládá|skládají|skládal|skládej
počítat|počítám|počítá|počítají|počítal|počítej
vyprávět|vyprávím|vypráví|vyprávějí|vyprávěl|vyprávěj
brát|beru|bere|berou|bral|ber
prát|peru|pere|perou|pral|per
zvát|zvu|zve|zvou|zval|zvi
česat|češu/češi|češe|češou/češí|česal|češ
mazat|mažu/maži|maže|mažou/maží|mazal|maž
mýt|myju/myji|myje|myjí/myjou|myl|myj
šít|šiju/šiji|šije|šijí/šijou|šil|šij
žít|žiju/žiji|žije|žijí/žijou|žil|žij
mluvit|mluvím|mluví|mluví|mluvil|mluv
prosit|prosím|prosí|prosí|prosil|pros
nosit|nosím|nosí|nosí|nosil|nos
chodit|chodím|chodí|chodí|chodil|choď
jezdit|jezdím|jezdí|jezdí|jezdil|jezdi
sedět|sedím|sedí|sedí|seděl|seď
vidět|vidím|vidí|vidí|viděl|–
slyšet|slyším|slyší|slyší|slyšel|–
myslet|myslím|myslí|myslí|myslel|mysli
učit|učím|učí|učí|učil|uč
vařit|vařím|vaří|vaří|vařil|vař
kreslit|kreslím|kreslí|kreslí|kreslil|kresli
věřit|věřím|věří|věří|věřil|věř
bydlet|bydlím|bydlí|bydlí|bydlel|bydli
spát|spím|spí|spí|spal|spi
mlčet|mlčím|mlčí|mlčí|mlčel|mlč
křičet|křičím|křičí|křičí|křičel|křič
ležet|ležím|leží|leží|ležel|lež
držet|držím|drží|drží|držel|drž
platit|platím|platí|platí|platil|plať
čistit|čistím|čistí|čistí|čistil|čisti
hasit|hasím|hasí|hasí|hasil|has
mít|mám|má|mají|měl|měj
chtít|chci|chce|chtějí/chtí|chtěl|–
vědět|vím|ví|vědí|věděl|–
znát|znám|zná|znají|znal|–
stát|stojím|stojí|stojí|stál|stůj
umět|umím|umí|umějí/umí|uměl|–
rozumět|rozumím|rozumí|rozumějí/rozumí|rozuměl|–
večeřet|večeřím|večeří|večeří|večeřel|večeř
snídat|snídám|snídá|snídají|snídal|snídej
obědvat|obědvám|obědvá|obědvají|obědval|obědvej
padat|padám|padá|padají|padal|padej
vstávat|vstávám|vstává|vstávají|vstával|vstávej
zkoumat|zkoumám|zkoumá|zkoumají|zkoumal|zkoumej
sledovat|sleduju/sleduji|sleduje|sledují/sledujou|sledoval|sleduj
vyhrávat|vyhrávám|vyhrává|vyhrávají|vyhrával|vyhrávej
potkávat|potkávám|potkává|potkávají|potkával|potkávej
mávat|mávám|mává|mávají|mával|mávej
zívat|zívám|zívá|zívají|zíval|zívej
budovat|buduju/buduji|buduje|budují/budujou|budoval|buduj
obdivovat|obdivuju/obdivuji|obdivuje|obdivují/obdivujou|obdivoval|obdivuj
potřebovat|potřebuju/potřebuji|potřebuje|potřebují/potřebujou|potřeboval|–
pozorovat|pozoruju/pozoruji|pozoruje|pozorují/pozorujou|pozoroval|pozoruj
kontrolovat|kontroluju/kontroluji|kontroluje|kontrolují/kontrolujou|kontroloval|kontroluj
nakupovat|nakupuju/nakupuji|nakupuje|nakupují/nakupujou|nakupoval|nakupuj
plánovat|plánuju/plánuji|plánuje|plánují/plánujou|plánoval|plánuj
trénovat|trénuju/trénuji|trénuje|trénují/trénujou|trénoval|trénuj
lyžovat|lyžuju/lyžuji|lyžuje|lyžují/lyžujou|lyžoval|lyžuj
opravovat|opravuju/opravuji|opravuje|opravují/opravujou|opravoval|opravuj
vysvětlovat|vysvětluju/vysvětluji|vysvětluje|vysvětlují/vysvětlujou|vysvětloval|vysvětluj
bubnovat|bubnuju/bubnuji|bubnuje|bubnují/bubnujou|bubnoval|bubnuj
rozdávat|rozdávám|rozdává|rozdávají|rozdával|rozdávej
prodávat|prodávám|prodává|prodávají|prodával|prodávej
dávat|dávám|dává|dávají|dával|dávej
umývat|umývám|umývá|umývají|umýval|umývej
oblékat|oblékám|obléká|oblékají|oblékal|oblékej
zalévat|zalévám|zalévá|zalévají|zaléval|zalévej
tahat|tahám|tahá|tahají|tahal|tahej
hlídat|hlídám|hlídá|hlídají|hlídal|hlídej
chovat|chovám|chová|chovají|choval|chovej
stříhat|stříhám|stříhá|stříhají|stříhal|stříhej
tleskat|tleskám|tleská|tleskají|tleskal|tleskej
pískat|pískám|píská|pískají|pískal|pískej
spěchat|spěchám|spěchá|spěchají|spěchal|spěchej
dýchat|dýchám|dýchá|dýchají|dýchal|dýchej
šeptat|šeptám|šeptá|šeptají|šeptal|šeptej
kašlat|kašlu|kašle|kašlou|kašlal|kašli
řezat|řežu/řeži|řeže|řežou/řeží|řezal|řež
péct|peču|peče|pečou|pekl|peč
plést|pletu|plete|pletou|pletl|pleť
mést|metu|mete|metou|metl|meť
krmit|krmím|krmí|krmí|krmil|krm
hladit|hladím|hladí|hladí|hladil|hlaď
chválit|chválím|chválí|chválí|chválil|chval
vozit|vozím|vozí|vozí|vozil|voz
vodit|vodím|vodí|vodí|vodil|voď
honit|honím|honí|honí|honil|hoň
lovit|lovím|loví|loví|lovil|lov
svítit|svítím|svítí|svítí|svítil|–
zářit|zářím|září|září|zářil|–
bruslit|bruslím|bruslí|bruslí|bruslil|brusli
soutěžit|soutěžím|soutěží|soutěží|soutěžil|soutěž
stavět|stavím|staví|stavějí/staví|stavěl|stavěj
hořet|hořím|hoří|hoří|hořel|–
šetřit|šetřím|šetří|šetří|šetřil|šetři
měřit|měřím|měří|měří|měřil|měř
vážit|vážím|váží|váží|vážil|važ
sušit|suším|suší|suší|sušil|suš
zdobit|zdobím|zdobí|zdobí|zdobil|zdob
tvořit|tvořím|tvoří|tvoří|tvořil|tvoř
slavit|slavím|slaví|slaví|slavil|slav
zlobit|zlobím|zlobí|zlobí|zlobil|zlob
bránit|bráním|brání|brání|bránil|braň
pouštět|pouštím|pouští|pouštějí/pouští|pouštěl|pouštěj
cvičit|cvičím|cvičí|cvičí|cvičil|cvič
končit|končím|končí|končí|končil|konči
točit|točím|točí|točí|točil|toč
zvonit|zvoním|zvoní|zvoní|zvonil|zvoň
tlačit|tlačím|tlačí|tlačí|tlačil|tlač
pálit|pálím|pálí|pálí|pálil|pal
zdravit|zdravím|zdraví|zdraví|zdravil|zdrav
lepit|lepím|lepí|lepí|lepil|lep
barvit|barvím|barví|barví|barvil|barvi
zkoušet|zkouším|zkouší|zkoušejí/zkouší|zkoušel|zkoušej
uklízet|uklízím|uklízí|uklízejí/uklízí|uklízel|uklízej
sázet|sázím|sází|sázejí/sází|sázel|sázej
ztrácet|ztrácím|ztrácí|ztrácejí/ztrácí|ztrácel|ztrácej
vracet|vracím|vrací|vracejí/vrací|vracel|vracej`;
const PK=['1s','2s','3s','1p','2p','3p'];
function impPl(i2,suf){ if(/i$/.test(i2)){ const b=i2.slice(0,-1); return b+(/[tdnpbvmf]$/.test(b)?'ě':'e')+suf; } return i2+suf; }
const VERBS=VERB_RAW.split('\n').map(l=>{
  const [inf,p1,p3,p3p,l_,imp]=l.split('|'), lsg=l_.split('/')[0], lpl=l_.split('/')[1]||lsg+'i';
  const f={inf:[inf]};
  const pres=[p1.split('/'), [p3+'š'], [p3], [p3+'me'], [p3+'te'], p3p.split('/')];
  PK.forEach((k,i)=>{ const pl=k[1]==='p', L=pl?lpl:lsg;
    f['pri'+k]=[...new Set(pres[i])];
    f['min'+k]=[[L+' jsem',L+' jsi',L,L+' jsme',L+' jste',L][i]];
    f['bud'+k]=[['budu','budeš','bude','budeme','budete','budou'][i]+' '+inf];
    f['podm'+k]=[[L+' bych',L+' bys',L+' by',L+' bychom',L+' byste',L+' by'][i]];
  });
  if(imp!=='–'){ f['rozk2s']=[imp]; f['rozk1p']=[impPl(imp,'me')]; f['rozk2p']=[impPl(imp,'te')]; }
  return {inf, l:lsg, f, amb3: f.pri3s.some(x=>f.pri3p.includes(x)), noImp: imp==='–'};
});

const API={LEX, ADJ, adjForms, VERBS, PK, orth, palE, voc};
if(typeof module!=='undefined' && module.exports) module.exports=API; else root.FDLEX=API;
})(typeof window!=='undefined'?window:this);
