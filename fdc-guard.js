/* fdc-guard.js – ochrana plných verzí modulů proti sdílení odkazu.
   Vkládá se jako první prvek <head> (viz .github/workflows/fdc-guard.yml). */
(function () {
  var KEY = 'fdc-guard-ok';
  var HOME = 'https://fajndoucko.cz';
  var path = location.pathname;
  var dir = path.slice(0, path.lastIndexOf('/') + 1);
  var file = path.slice(dir.length) || 'index.html';
  var name = file.replace(/\.html?$/i, '');

  if (/-demo$/i.test(name)) return;

  var ok = false;
  try { ok = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  if (!ok) {
    try {
      var host = new URL(document.referrer).hostname;
      ok = host === 'fajndoucko.cz' || /\.fajndoucko\.cz$/.test(host);
    } catch (e) {}
    if (ok) { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  }
  if (ok) return;

  // Moduly s demo/full režimem v jednom souboru: jen zrušit ?mode=full
  if (name === 'fajncisla' || name === 'fajncvicebna_demo_full') {
    var params = new URLSearchParams(location.search);
    if (params.get('mode') === 'full') {
      params.delete('mode');
      var q = params.toString();
      history.replaceState(null, '', path + (q ? '?' + q : '') + location.hash);
    }
    return;
  }

  document.documentElement.style.visibility = 'hidden';
  var demo = dir + name + '-demo.html';
  fetch(demo, { method: 'HEAD', cache: 'no-store' })
    .then(function (r) { location.replace(r.ok ? demo : HOME); })
    .catch(function () { location.replace(HOME); });
})();
