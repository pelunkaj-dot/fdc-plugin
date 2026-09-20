// Fuzz-tests the pure game-logic slice of index.html (generators, WORLDS, opts()).
// No DOM/browser needed: this slice (rand..WORLDS) never touches document/localStorage.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const start = html.indexOf('const rand=');
const end = html.indexOf('const WORLD_ART=');
assert.ok(start !== -1 && end !== -1 && end > start, 'could not locate the pure-logic slice in index.html');
const slice = html.slice(start, end);

const sandbox = { module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(
  slice + '\nmodule.exports={WORLDS,opts,quiz,input,compare,sorting,route,countRouteSolutions,applyOp,fmt,clean,rand,pick,shuffle,eq};',
  sandbox
);
const { WORLDS, opts, countRouteSolutions, eq } = sandbox.module.exports;

// --- opts(): must always terminate with exactly 3 unique options ---
for (let i = 0; i < 3000; i++) {
  const answer = Math.floor(Math.random() * 400) - 50;
  const spread = [0, 1, 2, 5, 10, 40][i % 6];
  const result = opts(answer, spread, i % 2 === 0);
  assert.strictEqual(result.length, 3, `opts(${answer},${spread}) did not return 3 options`);
  assert.strictEqual(new Set(result).size, 3, `opts(${answer},${spread}) returned duplicate options`);
  assert.ok(result.some(n => eq(n, answer)), `opts(${answer},${spread}) options do not include the answer`);
}
console.log('PASS: opts() always terminates and returns 3 unique options including the answer.');

// --- every mission across every grade: make() must never throw and must produce a valid task ---
const grades = Object.keys(WORLDS).map(Number).sort((a, b) => a - b);
assert.deepStrictEqual(grades, [2, 3, 4, 5, 6, 7, 8, 9], 'unexpected set of grades in WORLDS');

let totalChecked = 0;
for (const g of grades) {
  const world = WORLDS[g];
  assert.strictEqual(world.missions.length, 8, `grade ${g} does not have 8 missions`);
  world.missions.forEach((m, i) => {
    assert.ok(Number.isInteger(m.rounds) && m.rounds % 10 === 0, `grade ${g} mission ${i} (${m.title}) has a non-multiple-of-10 rounds value`);
    const runs = m.skill === 'Bonusová hra' ? 5 : 150;
    for (let r = 0; r < runs; r++) {
      let t;
      assert.doesNotThrow(() => { t = m.make(); }, `grade ${g} mission ${i} (${m.title}) threw while generating a task`);
      totalChecked++;
      if (t.kind === 'quiz') {
        assert.strictEqual(new Set(t.options).size, t.options.length, `grade ${g} "${m.title}": quiz options are not unique`);
        assert.ok(t.options.some(o => String(o) === String(t.answer)), `grade ${g} "${m.title}": quiz options do not include the answer (${t.answer})`);
        if (t.hint !== undefined) assert.strictEqual(typeof t.hint, 'string', `grade ${g} "${m.title}": hint must be a string`);
      } else if (t.kind === 'input') {
        assert.ok(Number.isFinite(t.answer), `grade ${g} "${m.title}": input answer is not a finite number`);
        if (t.hint !== undefined) assert.strictEqual(typeof t.hint, 'string', `grade ${g} "${m.title}": hint must be a string`);
      } else if (t.kind === 'compare') {
        assert.ok(['<', '=', '>'].includes(t.answer), `grade ${g} "${m.title}": compare answer is not <, = or >`);
      } else if (t.kind === 'sort') {
        assert.strictEqual(t.answer.length, t.values.length, `grade ${g} "${m.title}": sort answer/values length mismatch`);
      } else if (t.kind === 'route') {
        assert.strictEqual(countRouteSolutions(t), 1, `grade ${g} "${m.title}": route puzzle does not have exactly one solution`);
      } else if (t.kind === 'bonus') {
        assert.ok(Number.isFinite(t.goal) && t.goal > 0, `grade ${g} "${m.title}": bonus goal is not a positive number`);
      } else {
        assert.fail(`grade ${g} "${m.title}": unknown task kind ${t.kind}`);
      }
    }
  });
}
console.log(`PASS: every mission in grades 2-9 (${totalChecked} generated tasks) produced a valid, well-formed task with no exceptions.`);

// --- grade 6 mission 8 and grade 7 mission 7 used to be a literal duplicate cuboid-volume generator ---
const g6cuboid = WORLDS[6].missions[7], g7cuboid = WORLDS[7].missions[6];
assert.strictEqual(g6cuboid.title, 'Srdce pevnosti');
assert.strictEqual(g7cuboid.title, 'Krystalový hranol');
let g7HasDecimal = false;
for (let i = 0; i < 40; i++) {
  const t6 = g6cuboid.make(), t7 = g7cuboid.make();
  assert.ok(!/[.,]/.test(t6.display), 'grade 6 cuboid mission unexpectedly produced a decimal dimension');
  if (/[.,]/.test(t7.display)) g7HasDecimal = true;
}
assert.ok(g7HasDecimal, 'grade 7 cuboid mission should use a decimal dimension to differentiate it from grade 6');
console.log('PASS: grade 6 and grade 7 cuboid-volume missions are no longer a literal duplicate.');

// --- "Alchymie zlomků" (grade 7 general-fraction addition) must always show already-reduced
// input fractions, e.g. never "2/6" (which looks like a mistake even though the sum is correct) ---
const gcd = (x, y) => (y ? gcd(y, x % y) : x);
const alchymie = WORLDS[7].missions[0];
assert.strictEqual(alchymie.title, 'Alchymie zlomků');
for (let i = 0; i < 500; i++) {
  const t = alchymie.make();
  const m = t.display.match(/^(\d+)\/(\d+) \+ (\d+)\/(\d+) = \?$/);
  assert.ok(m, `unexpected fraction display format: ${t.display}`);
  const [, a, d1, b, d2] = m.map(Number);
  assert.strictEqual(gcd(a, d1), 1, `grade 7 "Alchymie zlomků" showed an unreduced input fraction ${a}/${d1} (in "${t.display}")`);
  assert.strictEqual(gcd(b, d2), 1, `grade 7 "Alchymie zlomků" showed an unreduced input fraction ${b}/${d2} (in "${t.display}")`);
}
console.log('PASS: "Alchymie zlomků" always shows already-reduced input fractions.');

console.log('\nAll matematicky-svet logic tests passed.');
