import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const base='http://127.0.0.1:8123/';
const demo=await browser.newPage({viewport:{width:390,height:800}});
try {
 await demo.goto(base+'vyrazy-demo.html',{waitUntil:'load'});
 await demo.locator('#expression').waitFor();
 assert.ok((await demo.locator('#expression').textContent()).length>1);
 const width=await demo.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 assert.ok(width<=1,'mobile horizontal overflow '+width);
 await demo.locator('#parentButton').click();
 assert.match(await demo.locator('#parentData').textContent(),/V plné verzi rodiče/);
 await demo.locator('#parentClose').click();
 for(let i=0;i<12;i++){
  const correct=await demo.evaluate(()=>window.VyrazyTest.getState().problem.answer);
  await demo.locator('#answer').fill(String(correct));
  await demo.locator('#answer').press('Enter');
  assert.equal(await demo.locator('#next').isVisible(),true,'next button missing after correct result');
  await demo.keyboard.press('Enter');
 }
 assert.equal(await demo.locator('#demoEnd').isVisible(),true,'demo limit not enforced');
 await demo.reload();
 assert.equal(await demo.locator('#demoEnd').isVisible(),true,'demo limit reset by reload');
 const full=await browser.newContext();
 await full.addInitScript(()=>sessionStorage.setItem('fdc-guard-ok','1'));
 const page=await full.newPage();
 await page.goto(base+'vyrazy.html',{waitUntil:'load'});
 await page.locator('#parentButton').click();
 await page.locator('#parentPassword').fill('test1234');
 await page.locator('#parentUnlock').click();
 assert.equal(await page.locator('#parentActions').isVisible(),true,'parent password setup failed');
 assert.match(await page.locator('#parentData').textContent(),/Vyřešeno/);
 await page.locator('#parentClose').click();
 await page.locator('#topic').selectOption('2');
 assert.ok((await page.locator('#expression').textContent()).length>0);
 await full.close();
 console.log('PASS: mobile layout, Enter, demo limit/persistence, parent controls and topic selection');
} finally {await demo.close();await browser.close()}
