"""Doplní fdc-guard.js jako první prvek <head> do *.html (rekurzivně).
Použití: python3 tools/inject_guard.py [soubor.html ...]  (bez argumentů = všechny)"""
import pathlib, re, sys

TAG = '<script src="/fdc-plugin/fdc-guard.js"></script>'
HEAD = re.compile(r'<head\b[^>]*>', re.I)

root = pathlib.Path(__file__).resolve().parent.parent
files = [pathlib.Path(a) for a in sys.argv[1:]] or [
    p for p in root.rglob('*.html') if '.git' not in p.parts]
changed = 0
for p in files:
    s = p.read_text(encoding='utf-8')
    if 'fdc-guard.js' in s:
        continue
    m = HEAD.search(s)
    if not m:
        print(f'bez <head>: {p}')
        continue
    p.write_text(s[:m.end()] + '\n' + TAG + s[m.end():], encoding='utf-8')
    changed += 1
    print(f'doplněno: {p}')
print(f'změněno souborů: {changed}')
