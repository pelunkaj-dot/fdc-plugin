# Rodina modulů Výrazy — stav připraveného vydání

Tři moduly: číselné výrazy (8 oblastí), výrazy s proměnnými (8 oblastí), mnohočleny (9 oblastí). V každé oblasti jsou tři obtížnosti s rozdílnou strukturou úloh. Generátory, krátké lekce a vyřešené vzory jsou v `vyrazy-content.js`; uživatelský postup je v `vyrazy-app.js`.

## Výuka a odpovědi

Lekce postupuje od pravidla a vyřešeného vzoru přes vedený úkol a samostatný úkol k ověření principu. K postupu lekcí se počítají úlohy vyřešené bez chyby a nápovědy; jinak dostane žák další variantu pro upevnění. Procvičování je samostatný režim bez vedení. Téma i obtížnost jsou volně přístupné.

`vyrazy-math.js` parsuje vstup do stromu a převádí jej na přesný mnohočlen s racionálními koeficienty (BigInt). Algebraická ekvivalence se rozhoduje porovnáním těchto koeficientů, nikoli vzorkováním. Nevykonává se žákovský kód. Podporovány jsou x a y, implicitní násobení, desetinná čárka/tečka, zlomky, znaménka a závorky. Exponent je celé číslo 0–12, celkový stupeň výsledku nejvýše 24; dělení pouze konstantou, nikoli proměnnou. Délka vstupu je omezena na 400 znaků. Mocniny x², x^2, x**2 a jednoznačné x2 jsou rovnocenné.

Kontrola odděluje chybnou odpověď, neplatný zápis, přepsané zadání, ekvivalentní mezikrok a dokončený tvar. Vytýkání vyžaduje největší společný činitel a upravený obsah závorky. U číselných úloh se přijímá konečné číslo nebo zkrácený zlomek; ekvivalentní nedopočítaný výraz je mezikrok. Rozpracovaná úloha, vstup, pokusy i výukový postup se obnovují po otevření stránky.

## Město a dema

Vektorové město bez externích obrázků: řeka, domy, elektrárna, osvětlení, most, tramvaj, nádraží, knihovna, laboratoř, observatoř, park, solární věže, kulturní centrum, přístav, technologická čtvrť, vzducholoď a festival. Každá správná úloha rozsvítí další okna; po 10 úlohách se zprovozní stavba. Po 150 bodech následuje etapa rozšiřování, již obnovené stavby zůstávají funkční a panorama se zvětšuje. Město je sdílené mezi třemi moduly, dema mají vlastní společné město. Zvuk, animace a herní zobrazení lze omezit; chyby neodebírají body.

Každé demo má limit 18 dokončených úloh, zachovává postup a nabízí všechny oblasti i obtížnosti. Staré statistiky se jednorázově převádějí na počitadla nové verze. Plné stránky zachovávají `fdc-guard.js`; neautorizovaný přímý vstup se přesměruje na demo. Veřejný rozcestník je `vyrazy-rozcestnik-demo.html`.

## Rodičovská sekce a technické meze

Společné rodičovské heslo: náhodná sůl + PBKDF2/SHA-256, 180 000 iterací. Neukládá se čitelný text hesla. Přehled obsahuje dokončené/správné úlohy, úspěšnost bez přeskočených, řešení napoprvé, chybné pokusy, nápovědy, přeskočené úlohy, buňky podle témat/obtížností, doporučení k upevnění, aktivitu po dnech a poslední úlohy. Cílené procvičování spouští konkrétní oblast a obtížnost. Reset se potvrzuje a nemaže město.

Všechny statistiky jsou místní; neprobíhá synchronizace mezi zařízeními. Správce zařízení může místní data změnit nebo smazat. Stávající fdc-guard kontroluje odkazující doménu a sessionStorage; není serverovým ověřením placeného členství a zdrojové soubory ve veřejném repozitáři jsou dostupné. Silný paywall vyžaduje samostatné serverové ověřování, které tento repozitář nemá. Globální guard a nesouvisející moduly nebyly měněny.

## Ověření

- `node tests/algebra.test.cjs`: 75 000 úloh, kontrola výsledků nezávislým interpretem stromu, kontroly koeficientů/stupně, nejméně 262 unikátních variant na oblast/obtížnost ve vzorku. Regresní kontroly přesné aritmetiky, mocnin, znamének, vstupů a požadovaného tvaru.
- `node tests/vyrazy.state.test.cjs`: výukový postup, obnovení vstupu/úlohy, chybové pokusy, nápovědy, přeskočení, heslo, zamítnutí přístupu, reset, limity dem a opětovné otevření.
- `node tests/vyrazy.browser.mjs`: Chromium, 132 řešení, všechny oblasti a obtížnosti, mobil 390 × 844 a desktop 1440 × 1000, Enter, dema a obnovení, přesměrování guardu, rodiče, cílené procvičování, reset, výuka, nápověda, přeskočení, vložení mocniny, vzhled, zvuk, herní přepínač. Bez chyb JavaScriptu a bez vodorovného přetékání. Snímky se ukládají jen pro kontrolu a necommitují se.

Lokální testy prošly. Připravené změny byly se souhlasem uživatele nahrány do main jako commit b868b8a3cfd982576add816e05cf06a306c36041 (obsah je totožný s lokálními commity 2d0716f a b08fa9b). V GitHub Actions prošly matematické testy, stavové testy, 132 prohlížečových řešení, vložení guardu i sestavení a nasazení Pages. Všech osm veřejných adres modulů, dem a rozcestníků vrací HTTP 200 s novým obsahem.
