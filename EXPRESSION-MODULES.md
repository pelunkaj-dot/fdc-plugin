# Rodina modulů Výrazy — stav připraveného vydání

Tři moduly: číselné výrazy (8 oblastí), výrazy s proměnnými (7 oblastí), mnohočleny (9 oblastí). V každé oblasti jsou tři obtížnosti s rozdílnou strukturou úloh. Generátory, krátké lekce a vyřešené vzory jsou v `vyrazy-content.js`; uživatelský postup je v `vyrazy-app.js`.

## Výuka a odpovědi

Výrazy s proměnnými a mnohočleny vyžadují symbolické úpravy, bez dosazování hodnot. Výuka začíná výrazem `3(x+2)+2y-5(x+y)-2x+6y` a vede přes roznásobení a sloučení členů k `-4x+3y+6`. Další oblasti zahrnují více závorek, mocniny, všechny tři základní vzorce, vytýkání a rozklad rozdílu čtverců. Správné mezikroky se zobrazují jako žákův postup. Staré rozpracované úlohy s dosazováním se neobnovují; plné statistiky zůstávají zachovány.

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

- `node tests/algebra.test.cjs`: 72 000 úloh, kontrola výsledků nezávislým interpretem stromu, kontroly koeficientů/stupně, nejméně 262 unikátních variant na oblast/obtížnost ve vzorku. Regresní kontroly přesné aritmetiky, mocnin, znamének, vstupů a požadovaného tvaru.
- `node tests/vyrazy.state.test.cjs`: výukový postup, obnovení vstupu/úlohy, chybové pokusy, nápovědy, přeskočení, heslo, zamítnutí přístupu, reset, limity dem a opětovné otevření.
- `node tests/vyrazy.browser.mjs`: Chromium, 130 řešení, všechny oblasti a obtížnosti, mobil 390 × 844 a desktop 1440 × 1000, Enter, dema a obnovení, přesměrování guardu, rodiče, cílené procvičování, reset, výuka, nápověda, přeskočení, vložení mocniny, vzhled, zvuk, herní přepínač. Bez chyb JavaScriptu a bez vodorovného přetékání. Snímky se ukládají jen pro kontrolu a necommitují se.

Lokální matematické, stavové a prohlížečové testy prošly po přepracování algebraické výuky.
