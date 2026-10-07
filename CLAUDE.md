# FajnDoučko moduly (fdc-plugin) – zásady pro práci

## Didaktika je nejvyšší priorita
Odlišujeme se od komerčních školních modulů: ty mají skvělou didaktiku, ale omezený herní režim
a ne zcela dokonalou zpětnou vazbu pro školy a rodiče. My chceme obojí: **silnou didaktiku i plnohodnotnou hru**.
Didaktiku nikdy neobětovat kvůli efektu, rychlosti ani zjednodušení kódu.

- **Opravné pokusy (povinné ve všech úlohách):**
  1. chyba → krátká, proměnlivá hláška („To není ono.“) + „Zkus to znovu.“
  2. chyba → dítě volí: „Zkusím to znovu“, nebo „Chci nápovědu“.
  3. chyba → nápověda (vede k postupu, **neprozradí řešení**).
  4. chyba → teprve teď správná odpověď + vysvětlení postupu; ve statistice se počítá jako špatně.
  Špatně zvolená možnost se vyřadí, časový limit se po první chybě zastaví.
- **Učíme postup, ne odhad:** vysvětlení ukazuje kroky tak, jak se učí ve škole
  (např. pádová otázka dosazená do věty, ten/ta/to, 2. pád u vzorů).
- **Body a hodnocení:** napoprvé 100 %, napodruhé 60 %, po nápovědě 35 %; série jen za odpovědi napoprvé.
- **Adaptivita:** chyby se v kole vracejí a příště chodí častěji; statistika po kategoriích.
- **Náročnost:** každá mise má přepínač Lehká / Střední / Těžká; vyšší náročnost nesmí být zamčená
  za nižší (jen doporučení), v demu jen Lehká.
- **Správnost obsahu:** jazykový/matematický obsah musí být bezchybný; data ověřovat automaticky,
  kde to jde (např. FajnDetektiv: postup ze školy = zapsaný vzor u každého slova).
- **Zpětná vazba pro rodiče/školy:** cíl je lepší než u konkurence. Každý modul má tlačítko **„Pro rodiče“**
  chráněné heslem (min. 4 znaky, solený SHA-256 hash v localStorage; „Zapomněl(a) jsem heslo“ s kontrolou
  dospělého, obnova nesmaže statistiky; změna hesla; vynulování výsledků jen odtud).
  Obsah (vzor: FajnDetektiv): napoprvé / s pomocí / neúspěšně, čas hraní, aktivita po dnech,
  zvládnutí po dovednostech, typické záměny s radou pro rodiče, doporučení co hrát dál,
  problémová slova, poslední výsledky, popis didaktiky, tisk.

## Hra a vzhled
- Hratelnost a zábava: příběh, postavy, sbírání, hodnosti, odznaky, mapy – ne jen kvíz.
- Přepínač témat jako v ostatních modulech: světlé ☀️ / tmavé 🌙 / dívčí 🌸 (`data-theme`, ukládat do localStorage).
- Zvuky měkké a proměnlivé (žádné ostré pípání, neopakovat stále stejný zvuk), vždy vypínatelné.
- Pozadí připravené na fotku (`--scene-photo`), logo FajnDoučka doplníme později.
- Funguje na mobilu (bez vodorovného posouvání).

## Technické konvence
- Ochrana plných verzí: `fdc-guard.js` jako první prvek `<head>`; workflow `fdc-guard.yml` ho doplní sám.
  Demo = `<nazev>-demo.html` ve stejné složce.
- FajnDetektiv (`slovni_detektiv.html`): demo je kopie plné verze (režim podle názvu souboru) –
  po každé změně přegenerovat `slovni_detektiv-demo.html`.
  Data jsou ve složce `fajndetektiv/` (lexikon.js = slovník + tvarotvorba podle vzorů s výjimkami,
  vety.js = rámce vět pro Výslech, pribehy.js, cviceni.js). Nová slova zapisovat se vzorem a výjimkami,
  tvary vždy vypsat a zkontrolovat; jen nedokonavá slovesa (budu + neurčitek).
- FajnZahrada (`vyjmenovana_slova.html`): vyjmenovaná slova; stejné jádro jako FajnDetektiv (pokusy, rodiče, odměny).
  Data `zahrada/slova.js` (vyjmenovaná / příbuzná / slova s i, texty s rozhodujícím písmenem v závorce, např. b(y)t,
  sporný základ slova zapsat jako m(y:mýt)jeme), logika `zahrada/hra.js`, scéna `zahrada/scena.js`.
  U volby ze dvou možností (i/y) nesmí jít uhodnout napodruhé – po chybě následuje krok postupu.
  Demo = kopie s titulkem „FajnZahrada – demo“, přegenerovat po každé změně.
- Soubory upravovat Pythonem, ne sedem. Šetřit tokeny.
- Před pushem vyzkoušet v prohlížeči (Playwright), ideálně i šířku mobilu.
