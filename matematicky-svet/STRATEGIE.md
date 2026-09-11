# Matematický svět

## Záměr

Matematický svět není sbírka příkladů s body. Je to dobrodružná hra, ve které matematika ovládá svět: hráč volbou početní operace mění energii, cestu, stavby a dostupné kraje. Správný výsledek není konec úlohy, ale prostředek k dosažení herního cíle.

První hratelný modul se jmenuje **Číselná výprava**. Začíná na úrovni 2. ročníku, provede dítě základními početními operacemi a končí dokončením 5. ročníku. Atlas už nyní ukazuje návaznost až do 9. ročníku.

## Herní smyčka

1. Hráč vidí jediný dosažitelný další cíl.
2. Vstoupí do kraje a vede energii sérií početních bran.
3. Volí mezi dvěma operacemi; každá volba okamžitě mění další stav hry.
4. Má omezený počet návratů v čase, takže může experimentovat bez trestu za jedinou chybu.
5. Po úspěchu získá viditelnou stavbu, úlomky a animované rozsvícení mapy.
6. Odemkne se další kraj. Po dokončení majáku se otevře další ročník.

Odměna tedy není jen číslo v tabulce: na mapě trvale zůstane výheň, přístav, mlýn, hvězdárna a nakonec maják.

## Cesta 2.–9. ročníkem

| Ročník | Herní kraj | Matematický obsah | Hlavní herní princip | Stav |
|---|---|---|---|---|
| 2. | Početní ostrovy | čísla do 100, sčítání, odčítání, první násobení a dělení | vedení energie početními branami | hratelné |
| 3. | Násobilkové údolí | čísla do 1 000, násobilka, dělení, vícekrokové výpočty | delší trasy a plánování kombinací | hratelné |
| 4. | Město velkých čísel | velká čísla, písemné operace, početní strategie | zásobování a stavba města | hratelné |
| 5. | Desetinné souostroví | desetinná čísla, pořadí operací, upevnění 1. stupně | přesné dávkování zdrojů a závěrečná expedice | hratelné |
| 6. | Podzemí pod nulou | záporná čísla, dělitelnost, zlomky | pohyb nad a pod nulou, skládání fragmentů | návrh další etapy |
| 7. | Tržiště poměrů | poměry, procenta, racionální čísla | obchod, směna a správa omezených zdrojů | návrh další etapy |
| 8. | Alchymistická laboratoř | mocniny, odmocniny, výrazy, rovnice, Pythagorova věta | výroba receptů a opravování strojů | návrh další etapy |
| 9. | Observatoř funkcí | soustavy, funkce, podobnost, finanční matematika | objevování vztahů, grafů a predikcí | návrh další etapy |

## Pravidla, která projekt odlišují

- Žádné veřejné známky ani žebříček nejslabších dětí.
- Chyba je informace a možnost změnit strategii, ne ostuda.
- Adaptace má měnit čísla, délku trasy, počet nápověd a typ rozhodování.
- Odměny musí být sbíratelné a viditelné ve světě, ne jen body po příkladu.
- Každý větší matematický celek dostane odpovídající herní mechaniku.
- Krátká výprava musí dávat smysl sama o sobě; dlouhodobý postup přidává další motivaci.
- Učitel nebo rodič později uvidí dovednosti a typické chyby, dítě však především vlastní svět a jeho proměnu.

## Další vývoj

Kontrolovaný generátor variant je hotový: při každém novém vstupu mění start, cíl, správnou cestu i slepé brány a hlídá právě jednu správnou trasu. Při opravě neúspěšného pokusu zadání zachová.

1. Zavést profil hráče, inventář staveb a návrat do rozehraného světa.
2. Přidat adaptivní obtížnost podle chyb, rychlosti a využitých návratů.
3. Vytvořit samostatné herní mechaniky pro zlomky, geometrii, procenta a rovnice.
4. Přidat nenápadný přehled pro pedagoga: co dítě skutečně umí, kde tápe a jakou výzvu dostane příště.
5. Ověřit hru s dětmi různých úrovní; sledovat, zda chtějí pokračovat i bez pobídky dospělého.

## Technické začlenění

Číselná výprava je samostatná statická webová aplikace. Lze ji otevřít jako vlastní stránku nebo vložit do FajnCvičebny přes `iframe`. Postup se v prototypu ukládá lokálně v prohlížeči. Původní modul MatikaHra je samostatný a projekt jej nijak nemění.
