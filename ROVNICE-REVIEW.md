# Rovnice: přesná kontrola a výuková cesta

Plná verze a demo zachovávají adresy a všech 30 témat / čtyři ukázkové oblasti. `rovnice-engine.js` používá parser a BigInt zlomky z `vyrazy-math.js`, přesné polynomy a racionální funkce. Studentův vstup se nevykonává. Kontroluje množinu řešení v podporovaných lineárních a racionálních úpravách, včetně podmínek jmenovatelů. Úpravy vedoucí k nelineární rovnici se odmítají s konkrétní instrukcí; modul není řešič obecných kvadratických rovnic.

Výklad mají všechna témata. V režimu Nauč mě to se další operace odvozuje z posledního správného zápisu. Procvičování nedává automatickou úvodní nápovědu. Tlačítko nápovědy popisuje operaci, ne výslednou rovnici. Vyřešený vzor používá jiný příklad; vysvětlení aktuálního řešení se eviduje zvlášť. Postup odděluje odstranění jmenovatelů, roznásobení, přesun pomocí stejné operace na obou stranách a dělení nenulovým koeficientem. Závěr doplňuje zkouška dosazením nebo vysvětlení sporu/totožnosti.

Správné kroky zůstávají v historii, nový vstup se vyprázdní a zaměří. Chybný i nerozpoznaný zápis zůstává k opravě. Série, aktuální vstup, chyby a nápovědy se obnoví. Demo a plná verze mají oddělené klíče v2; ve full se jednorázově zachovají staré souhrny a původní heslo, které se po úspěšném přihlášení převede na PBKDF2/SHA-256, 180 000 iterací. Nové heslo má nejméně osm znaků a potvrzení. Změna hesla a reset jsou dostupné po přihlášení; neověřený reset hesla byl odstraněn z používaného rozhraní. Statistiky i přístupový guard zůstávají místními funkcemi prohlížeče, nikoli serverovou autentizací.

Demo má čtyři reprezentativní témata a trvalý limit 12 dokončených nebo vysvětlených rovnic; nová série se zkrátí podle zbývajícího limitu. Přeskočení vymění rovnici stejného typu a nepočítá se jako chyba. Generované úlohy projdou přesnou kontrolou, která vyřadí i staré chybné návraty generátorů s totožností místo jediné hodnoty x.

## Ověření

- `node tests/rovnice.test.cjs`: 990 vysvětlených řešení a regresní testy druhého kořene, sporu/totožnosti, zakázaných hodnot, desetinných a zlomkových odpovědí, neplatných a škodlivých vstupů.
- `node tests/rovnice.browser.mjs`: 1 800 generovaných úloh všech témat a jejich vysvětlené kroky; plná výuková cesta, nápověda po mezikroku, zachovaný chybný vstup, obnovení série, Enter, vysvětlení všech témat, rodičovské přihlášení/zamítnutí/reset, oddělení statistik dema, limit po opětovném otevření, přesměrování neautorizovaného vstupu, mobilní i desktopové rozložení. Bez chyb JavaScriptu a vodorovného přetékání.
- Snímky mobilních mezikroků a vysvětlení i desktopového vysvětlení byly vizuálně zkontrolovány; snímky se necommitují.
- GitHub Actions `Test rovnice` tyto kontroly opakuje při změně modulů.
