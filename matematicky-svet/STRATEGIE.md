# Matematický svět

## Záměr

Matematický svět není sbírka příkladů s body. Je to dobrodružná hra, ve které matematika ovládá svět: hráč volbou početní operace mění energii, cestu, stavby a dostupné kraje. Správný výsledek není konec úlohy, ale prostředek k dosažení herního cíle.

První hratelnou kapitolou byl **Ostrov prvních počtů** pro 2. ročník. Herní mechanika se mezitím technicky rozšířila na všech osm dalších ročníků (viz tabulka níže) dřív, než proběhlo dětské testování jednotlivých kapitol — to zůstává dluhem, ne hotovou věcí. Nový obsah pro další ročníky by měl napřed projít stejným ověřením srozumitelnosti a přiměřenosti, jaké mělo dostat samotné 2. ročníkové jádro.

## Herní smyčka

1. Hráč vidí jediný dosažitelný další cíl.
2. Střídá krátké úlohy: chybějící číslo, nakládání beden, volbu výsledku a dvoukrokové brány.
3. Po několika matematických misích získá jednoduchou bonusovou hru.
4. Po úspěchu sleduje animované stavění a nová část ostrova zůstane na mapě.
5. Živý pohyb mapy musí vzniknout z vrstev navržených přímo pro animaci; nesmí být přilepený přes hotovou ilustraci a ujíždět při změně velikosti obrazovky. V prototypu proto zůstávají animace stavění a herních odměn, nikoli nepřesné efekty krajiny.
6. Po desáté misi následuje výrazné finále, titul Strážce prvních počtů a jasná cesta do opakovatelné Hvězdné stezky.
7. Hotové mise lze opakovat s novými zadáními; Hvězdná stezka přidává nové výpravy a další krystaly.

Odměna tedy není jen číslo v tabulce. Hráč vidí, jak se objekt staví, jak přilétají jeho součásti a jak se postupně propojuje celý ostrov.

## Cesta 2.–9. ročníkem

| Ročník | Herní kraj | Matematický obsah | Hlavní herní princip | Stav |
|---|---|---|---|---|
| 2. | Ostrov prvních počtů | postupně sčítání do 10 a sčítání a odčítání do 20 | krátké střídající se mise, stavění a bonusové hry | implementováno, jediné dosud dětmi ověřené |
| 3. | Násobilkové údolí | čísla do 1 000, násobilka, dělení | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |
| 4. | Město velkých čísel | velká čísla, písemné operace, početní strategie | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |
| 5. | Desetinné souostroví | desetinná čísla, pořadí operací, upevnění 1. stupně | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |
| 6. | Podzemí pod nulou | záporná čísla, dělitelnost, zlomky | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |
| 7. | Tržiště poměrů | poměry, procenta, racionální čísla | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |
| 8. | Alchymistická laboratoř | mocniny, odmocniny, výrazy, rovnice, Pythagorova věta | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |
| 9. | Observatoř funkcí | soustavy, funkce, podobnost, finanční matematika | 8 misí sdílející herní smyčku ostrova | implementováno, čeká na ověření s dětmi |

Ročníky 3.–9. zatím nemají samostatnou herní mechaniku slíbenou ve sloupci "Hlavní herní princip" u ročníku 2. — používají stejnou obecnou smyčku (kvíz/vstup/porovnání/řazení/brány) jen s jiným matematickým obsahem. Vlastní herní mechaniky pro zlomky, geometrii, procenta a rovnice (bod 3 v sekci Další vývoj) jsou proto stále otevřený úkol, ne jen u 2. ročníku.

## Pravidla, která projekt odlišují

- Žádné veřejné známky ani žebříček nejslabších dětí.
- Chyba je informace a možnost změnit strategii, ne ostuda.
- Adaptace má měnit čísla, délku trasy, počet nápověd a typ rozhodování.
- Odměny musí být sbíratelné a viditelné ve světě, ne jen body po příkladu.
- Každý větší matematický celek dostane odpovídající herní mechaniku.
- Krátká výprava musí dávat smysl sama o sobě; dlouhodobý postup přidává další motivaci.
- Učitel nebo rodič později uvidí dovednosti a typické chyby, dítě však především vlastní svět a jeho proměnu.

## Další vývoj

Generátor mění zadání při novém vstupu do mise. U strategických bran hlídá právě jednu správnou trasu. Obtížnost první kapitoly je záměrně omezena na malé, snadno představitelné počty.

1. Zavést profil hráče, inventář staveb a návrat do rozehraného světa.
2. Přidat adaptivní obtížnost podle chyb, rychlosti a využitých návratů.
3. Vytvořit samostatné herní mechaniky pro zlomky, geometrii, procenta a rovnice.
4. Přidat nenápadný přehled pro pedagoga: co dítě skutečně umí, kde tápe a jakou výzvu dostane příště.
5. Ověřit hru s dětmi různých úrovní ve **všech** ročnících 2.–9., ne jen v prvním; sledovat, zda chtějí pokračovat i bez pobídky dospělého.

## Technické začlenění

Číselná výprava je samostatná statická webová aplikace. Lze ji otevřít jako vlastní stránku nebo vložit do FajnCvičebny přes `iframe` — zatím na ni ale z portfolia nikde neodkazuje žádná jiná stránka, otevírá se pouze přímou URL. Postup se v prototypu ukládá lokálně v prohlížeči. Původní modul MatikaHra je samostatný a projekt jej nijak nemění.

Barvení mapy je teď vázané na konkrétní matematický okruh (mise), ne na celkový postup zleva doprava: každá mise má na mapě svůj vlastní "výsek", který se probarvuje podle toho, jak daleko je hráč právě v ní, takže je vidět, které téma je hotové a které ještě čeká. `test.cjs` (`node test.cjs`) fuzz-testuje generátory úloh všech 8 misí ve všech 8 ročnících (opakovaně volá `make()` a kontroluje platnost vygenerované úlohy) i pomocnou funkci `opts()`; není to náhrada dětského testování z bodu 5 výše, jen ochrana proti technickým regresím.
