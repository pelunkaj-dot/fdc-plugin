const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync(require('node:path').join(__dirname,'../vyrazy-core.js'),'utf8');
const ids=new Map();
const el=id=>{if(!ids.has(id)){ids.set(id,{value:'',textContent:'',innerHTML:'',hidden:false,disabled:false,style:{},className:'',classList:{toggle(){}},addEventListener(){},focus(){}})}return ids.get(id)};
const store=new Map();
const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const ctx={console,Math,JSON,Date,Number,String,Array,Object,RegExp,TextEncoder,localStorage,location:{pathname:'/fdc-plugin/vyrazy.html'},window:{},document:{body:{dataset:{}},getElementById:el,addEventListener(){}},confirm:()=>true};
vm.createContext(ctx);vm.runInContext(src,ctx);
const api=ctx.window.VyrazyTest;
assert.ok(api,'Testing API is reachable');
function independent(n){if(n.t==='n')return n.v;if(n.t==='neg')return -independent(n.a);const a=independent(n.a),b=independent(n.b);switch(n.op){case '+':return a+b;case '−':return a-b;case '×':return a*b;case '÷':assert.notEqual(b,0);return a/b;default:throw Error('Unknown operator')}}
const seen=new Set();
for(let t=0;t<api.topics.length;t++)for(let l=0;l<api.levels.length;l++)for(let i=0;i<350;i++){
const p=api.generator(t,l,i%3);
assert.equal(p.answer,independent(p.root),'Incorrect answer for '+p.text);
assert.ok(Number.isFinite(p.answer));
assert.ok(!p.text.includes('undefined'));
assert.equal(api.value(p.root),p.answer);
seen.add(t+'/'+l+'/'+p.text)
}
assert.ok(seen.size>500,'Insufficient exercise variety: '+seen.size);
console.log('PASS: 6 topics, 3 difficulties, 6300 generated exercises, independent AST calculation and variation ('+seen.size+' unique)');

const first=api.getState().problem;
assert.ok(first.text.length>0);
assert.equal(api.getState().mode,'teach');
el('answer').value=String(first.answer);
api.check();
assert.equal(api.getState().stage,'finished','final answer accepted in guided mode');
assert.equal(api.getState().stats.done,1);
assert.equal(api.getState().stats.right,1);
api.next();
const second=api.getState().problem;
el('answer').value='9999999';api.check();
assert.equal(api.getState().attempt,1);
el('answer').value='9999999';api.check();
assert.equal(api.getState().attempt,2);
api.hint();
assert.equal(api.getState().stats.hints,1);
el('answer').value=String(second.answer);api.check();
assert.equal(api.getState().stats.done,2);
assert.equal(api.getState().stats.incorrectAttempts,2);
assert.ok(store.has('fdc-vyrazy-v3'),'Progress persisted locally');
api.next();
api.finish(false,true);
assert.equal(api.getState().stats.skips,1);
console.log('PASS: guided final answer, retries, hints, skip and persisted progress');
