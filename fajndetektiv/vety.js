/* FajnDetektiv – rámce vět pro Výslech (určování pádu).
   Řádek: úroveň | pád | číslo (s/p) | slova (@skupina nebo výčet) | věta
   [] = místo pro vyšetřované slovo (tvar se vytvoří ze slovníku), {předložka} = předložka, která k němu patří.
   {v~} {s~} {k~} {z~} = předložka se upraví podle slova (v / ve, s / se, k / ke, z / ze); slova s nejistou podobou se vynechají.
   Každý rámec se naplní několika slovy ze skupiny – věty jsou vždy stejné (kvůli statistikám), jen jich je hodně. */
const FD_SKUPINY = {
  budovy:'škola školka kino divadlo knihovna obchod banka lékárna nemocnice cukrárna pekárna kavárna restaurace hotel tělocvična jídelna galerie kostel továrna supermarket obchůdek prodejna',
  venku:'park les zahrada sad zahrádka',
  venkuna:'hřiště louka náměstí pláž koupaliště stadion kluziště farma statek palouk tábořiště dvůr',
  domaci:'pes kočka kráva koza ovce kůň prase kuře slepice husa kachna králík křeček papoušek osel beran kohout tele štěně kotě hříbě jehně pejsek kočička koníček',
  lesni:'liška zajíc jelen srnka medvěd vlk ježek veverka sova datel krtek kos sýkora vrána straka žába ještěrka netopýr čáp srna',
  zoo:'slon žirafa zebra lev tygr opice hroch velbloud klokan krokodýl tučňák gorila panda nosorožec lama leopard gepard pštros lenochod koala',
  lide:'kamarád kamarádka soused sousedka učitel učitelka babička děda dědeček maminka tatínek táta teta strýc bratr sestra syn dcera doktor lékař lékařka policista hasič kuchař kuchařka pekař prodavač prodavačka řidič pilot zahradník listonoš spolužák starosta kouzelník klaun zpěvák zpěvačka herec malíř král královna princ princezna rytíř',
  rodina:'kamarád kamarádka soused sousedka babička děda dědeček maminka tatínek táta teta strýc bratr sestra spolužák',
  profese:'hasič učitel lékař pilot kuchař pekař policista zahradník malíř zpěvák herec kouzelník řidič kominík zubař kosmonaut doktor truhlář',
  veci:'klíč míč kniha tužka sešit taška batoh deštník telefon mobil hrnek lžíce talíř panenka hračka kostka autíčko pastelka pravítko propiska penál dopis obálka balík dárek krabice krabička svíčka baterka peněženka mince klobouk čepice šála bunda svetr tričko kabát ponožka bota kufr kompas dalekohled lupa mapa fotka obrázek kytara flétna píšťalka trumpeta knížka kabelka',
  hracky:'míč panenka hračka kostka autíčko kytara flétna píšťalka kolo koloběžka stavebnice skládačka vláček',
  jidlo:'rohlík chléb houska koláč buchta jablko hruška banán pomeranč citron meloun sýr salám párek vejce sušenka čokoláda bonbon lízátko perník kobliha okurka paprika rajče mrkev',
  pocitatelne:'rohlík houska jablko hruška banán pomeranč citron vejce okurka paprika rajče brambora cibule koláč buchta párek bonbon lízátko kobliha sušenka',
  sladke:'koláč buchta bábovka dort perník čokoláda palačinka vánočka kobliha oplatka',
  doprava:'vlak autobus tramvaj trolejbus auto letadlo vrtulník raketa metro kamion traktor',
  jizda:'vlak autobus tramvaj auto kolo letadlo vrtulník parník koloběžka motorka trolejbus metro',
  mhd:'vlak autobus tramvaj trolejbus',
  nabytek:'stůl židle postel gauč pohovka křeslo skříň polička lavice lavička koberec lednička pračka',
  mistnosti:'kuchyně pokoj koupelna ložnice předsíň sklep garáž šatna jídelna tělocvična dílna kancelář',
  priroda:'strom keř kámen skála kopec',
  sedatko:'strom keř kámen skála plot komín balkon',
  voda:'řeka potok rybník jezero moře',
  nebe:'hvězda slunce měsíc',
  akce:'výlet oslava návštěva koncert zápas závod výstava soutěž přestávka oběd',
  dny:'pondělí středa čtvrtek pátek sobota neděle'
};
const FD_RAMCE = `
1|1|s|@domaci|[] spí na dvoře.
1|1|s|@lesni|V lese žije [].
1|1|s|@rodina|Na návštěvu k nám jede [].
1|1|s|@lide|[] dnes vaří oběd.
1|1|s|@mhd|Na zastávku přijíždí [].
1|1|s|@jidlo|Na stole leží [].
1|1|s|@veci|Pod postelí leží [].
1|1|s|@nebe|Na nebi svítí [].
2|1|p|@zoo|V zoo spí [].
2|1|p|kamarád kamarádka spolužák kluk holka dívka žák bratr sestra|Na hřišti se honí [].
2|1|p|kráva koza ovce kůň beran osel tele jehně hříbě|Na louce se pasou [].
2|1|p|dárek svíčka baterka peněženka mince klobouk čepice šála ponožka hračka kostka pastelka|V krabici leží [].
2|1|s|@zoo|Ve výběhu odpočívá [].
2|1|p|@lesni|V noci se v lese probouzejí [].
1|2|s|@budovy|Ráno jsme šli {do} [].
1|2|s|@budovy|Vracíme se {z~} [].
1|2|s|@lide|Dostal jsem dopis {od} [].
1|2|s|@lide|Sešli jsme se {u} [].
1|2|s|klíč deštník telefon mobil batoh taška čepice šála bunda peněženka mapa kompas baterka penál svačina|{Bez} [] nikam nechodím.
1|2|s|@budovy|Stojíme {vedle} [].
1|2|s|@venku|{Kolem} [] vede cesta.
1|2|s|@venkuna|{Kolem} [] vede cesta.
1|2|s|@mistnosti|Vyběhl jsem {z~} [].
1|2|s|@doprava|Vystoupili jsme {z~} [].
1|2|s|@akce|{Během} [] jsme se hodně nasmáli.
1|2|s|@voda|Šli jsme {podél} [].
1|2|s|@dny|Úkol musíš odevzdat {do} [].
2|2|s|@lesni|Bojím se [].
2|2|s|@zoo|Bojím se [].
2|2|s|@sladke|Dej mi kousek [].
2|2|p|@pocitatelne|Na trhu jsme koupili pět [].
2|2|p|@veci|V krabici je deset [].
2|2|p|@lide|Na oslavu přišlo hodně [].
2|2|s|@lide|Zeptali jsme se [].
2|2|p|@zoo|V zoo jsme napočítali šest [].
2|2|p|@domaci|Na farmě chovají spoustu [].
1|3|s|@lide|Běžím {k~} [].
1|3|s|@budovy|Pojďme {k~} [].
1|3|s|@lide|{Díky} [] jsme to stihli.
1|3|s|@priroda|Došli jsme {k~} [].
1|3|s|@voda|Došli jsme {k~} [].
1|3|s|@budovy|Bydlíme {naproti} [].
1|3|s|@akce|{Kvůli} [] jsme nešli ven.
2|3|s|@lide|Napsal jsem dopis [].
2|3|s|@domaci|Dal jsem napít [].
2|3|p|@lide|Poděkovali jsme všem [].
2|3|p|@domaci|Farmář dal žrát všem [].
2|3|s|@rodina|Přinesli jsme dárek [].
2|3|s|@lide|Musíme pomoct [].
2|3|p|@rodina|Zamávali jsme [].
1|4|s|@veci|Hledám [].
1|4|s|@lide|Vidím [].
1|4|s|@domaci|Na zahradě jsme viděli [].
1|4|s|@lesni|Na procházce jsme potkali [].
1|4|s|@jidlo|Na svačinu mám [].
1|4|s|@mhd|Čekáme {na} [].
1|4|s|@akce|Těším se {na} [].
1|4|s|@dny|{V~} [] jedeme k babičce.
1|4|s|@venku|Jdeme {přes} [].
1|4|s|@venkuna|Jdeme {přes} [].
1|4|s|@nabytek|Kočka skočila {na} [].
2|4|s|@nabytek|Míč se zakutálel {pod} [].
2|4|p|tužka sešit kniha knížka pastelka propiska ponožka sušenka|Do batohu jsem si dal [].
2|4|p|@rodina|Pozvali jsme na oslavu [].
2|4|s|@zoo|V zoo jsme fotili [].
2|4|s|@rodina|Pozdravuj ode mě [].
2|4|s|@hracky|Ztratil jsem [].
2|4|p|@zoo|Na výletě jsme pozorovali [].
2|4|s|@lide|Na ulici jsem potkal [].
1|5|s|@lide|[], pojď se podívat!
1|5|s|@domaci|[], kde jsi?
1|5|s|@rodina|Ahoj, []!
2|5|s|@lesni|Neboj se, [], nic ti neuděláme!
2|5|s|@zoo|Neboj se, [], nic ti neuděláme!
2|5|s|@rodina|Děkuju ti, []!
1|6|s|@budovy|Byli jsme {v~} [].
1|6|s|@lide|Mluvili jsme {o} [].
1|6|s|@nabytek|Kočka spí {na} [].
1|6|s|@mistnosti|Maminka je {v~} [].
1|6|s|@doprava|Sedíme {v~} [].
1|6|s|@sedatko|{Na} [] sedí ptáček.
1|6|s|@akce|{Na} [] jsme si to užili.
1|6|s|@venkuna|Hráli jsme si {na} [].
1|6|s|@venku|Hráli jsme si {v~} [].
2|6|p|@zoo|V knížce jsme četli {o} [].
2|6|p|@lide|Babička vyprávěla {o} [].
2|6|p|@domaci|Děti si povídaly {o} [].
2|6|s|@voda|Plavali jsme {v~} [].
1|7|s|@rodina|Šel jsem do kina {s~} [].
1|7|s|@domaci|Chodím na procházky {s~} [].
1|7|s|@hracky|Hraju si {s~} [].
1|7|s|@priroda|Stáli jsme schovaní {za} [].
1|7|s|@budovy|Sejdeme se {před} [].
1|7|s|@nabytek|Kočka spí {pod} [].
1|7|s|@sladke|Babička nás pohostila [].
2|7|s|@jizda|Jedeme na výlet [].
2|7|p|@rodina|Na výlet jedu {s~} [].
2|7|s|@profese|Chtěl bych být [].
2|7|p|mince bankovka|Zaplatili jsme [].
2|7|s|@voda|{Nad} [] létají vážky.
`;
