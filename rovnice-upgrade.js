(() => {
  "use strict";

  const LEVELS = {
    1: { name: "1 · Základ", desc: "Úplné základy, malé počty a jasný postup." },
    2: { name: "2 · Školní", desc: "Běžné rovnice se znaménky, závorkami a jednoduššími zlomky." },
    3: { name: "3 · Pokročilá", desc: "Více kroků, x na obou stranách, desetinná čísla a složitější zlomky." },
    4: { name: "4 · Mistr", desc: "Kombinace zlomků, závorek, záporných koeficientů a náročných úprav." }
  };

  const topicMeta = [
    { level:1, keys:["přímé","zaklad","ax=b","x+b=c"] },
    { level:1, keys:["ax+b=c","dva kroky","jednoduche"] },
    { level:2, keys:["x na obou stranach","obě strany","presouvani"] },
    { level:2, keys:["zavorka","jedna zavorka","roznasobeni"] },
    { level:3, keys:["slozite zavorky","zavorky na obou stranach","koeficient uvnitr"] },
    { level:2, keys:["desetinna cisla","desetinne koeficienty","desetiny"] },
    { level:3, keys:["desetinna cisla","x na obou stranach","pokrocile desetinne"] },
    { level:1, keys:["zlomky","x v citateli","x/a=b","jednoduche zlomky"] },
    { level:3, keys:["zlomky","nsj","soucet zlomku","ax/b=c"] },
    { level:2, keys:["zlomek","x v citateli","(x+a)/b=c"] },
    { level:3, keys:["zlomek","vyraz v citateli","(ax+b)/c=d"] },
    { level:4, keys:["zlomek rovna se zlomku","krizove nasobeni","zlomky na obou stranach"] },
    { level:3, keys:["neznámá ve jmenovateli","neznama ve jmenovateli","x ve jmenovateli","a/x=b"] },
    { level:4, keys:["neznámá ve jmenovateli","neznama ve jmenovateli","proporce","a/x+c=d"] },
    { level:4, keys:["neznámá ve jmenovateli","neznama ve jmenovateli","soucet zlomku","a/x+b/x=c"] },
    { level:3, keys:["mix","nahodny mix","vse dohromady"] }
  ];

  TOPICS.forEach((t,i) => {
    const m = topicMeta[i] || {level:2,keys:[]};
    t.level = m.level;
    t.keywords = [...m.keys, t.name, t.desc, t.section].join(" ").toLowerCase();
  });

  const nonZero = (min,max) => {
    let n = 0;
    while (n === 0) n = ri(min,max);
    return n;
  };

  function gen_hardNegBrackets() {
    for (let tries=0; tries<100; tries++) {
      const x = nonZero(-9,9);
      const a = rFrom([2,3,4,5,6]);
      const b = nonZero(-7,7);
      const c = nonZero(-9,9);
      const d = rFrom([2,3,4,5]);
      const e = nonZero(-6,6);
      const left = -a*(x+b)+c;
      const f = left - d*(x+e);
      if (Math.abs(f)>35) continue;
      const bs = b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const es = e>=0?`+ ${e}`:`− ${Math.abs(e)}`;
      const cs = c>=0?`+ ${c}`:`− ${Math.abs(c)}`;
      const fs = f>=0?`+ ${f}`:`− ${Math.abs(f)}`;
      return {
        display:`−${a}(${X} ${bs}) ${cs} = ${d}(${X} ${es}) ${fs}`,
        solution:x, category:"mistr",
        hint:"Pozor na znaménko před závorkou. Nejprve správně roznásob obě závorky."
      };
    }
    return gen_axObouStr();
  }

  function gen_hardFractionBrackets() {
    for (let tries=0; tries<160; tries++) {
      const x = nonZero(-8,8);
      const a = rFrom([2,3,4,5]);
      const b = nonZero(-8,8);
      const c = rFrom([1,2,3,4]);
      const d = nonZero(-8,8);
      const m = rFrom([2,3,4,5]);
      const n = rFrom([2,3,4,5,6].filter(v=>v!==m));
      const left = (a*x+b)/m - (c*x+d)/n;
      if (!Number.isInteger(left) || Math.abs(left)>16) continue;
      const bStr=b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const dStr=d>=0?`+ ${d}`:`− ${Math.abs(d)}`;
      return {
        display:`${fracInline(`${a}${X} ${bStr}`,m)} − ${fracInline(`${c}${X} ${dStr}`,n)} = ${left}`,
        solution:x, category:"mistr",
        hint:`Najdi společný násobek ${m} a ${n} a odstraň oba jmenovatele.`
      };
    }
    return gen_crossMult();
  }

  TOPICS.splice(TOPICS.length-1, 0, {
    name:"Kombinované rovnice",
    eq:"−2(x−3)+…",
    desc:"Zlomky, závorky a znaménka v jedné rovnici",
    section:"Mistrovská úroveň",
    gen:[gen_hardNegBrackets, gen_hardFractionBrackets],
    level:4,
    keywords:"mistr těžké tezke kombinované kombinovane závorky zavorky zlomky záporná zaporna znaménka znamenka přechod přes nulu",
    help:{
      title:"Kombinované rovnice",
      steps:[
        "Nejdřív si rozmysli pořadí úprav. Není nutné dělat všechny kroky stejně jako ve vzoru.",
        "Pozor na <strong>znaménko před závorkou</strong> a na změnu znamének při roznásobení.",
        "U zlomků je často nejrychlejší odstranit jmenovatele společným násobkem.",
        "Můžeš napsat další krok, ale pokud výsledek vidíš, klidně napiš rovnou <strong>x = …</strong>."
      ],
      example:[
        {text:"−2(x − 3) + 5 = 3(x + 1) − 7",type:"eq"},
        {text:"−2x + 11 = 3x − 4",type:"ok"},
        {text:"15 = 5x",type:"ok"},
        {text:"x = 3 ✓",type:"done"}
      ]
    }
  });

  // ---- Bohatší obsah všech čtyř úrovní ----------------------------------
  function nzFrom(arr){ return rFrom(arr.filter(v=>v!==0)); }

  function gen_l1_addSub() {
    const x = ri(1,12);
    const b = ri(1,9);
    const plus = Math.random()<0.5;
    const c = plus ? x+b : x-b;
    return {
      display: plus ? `${X} + ${b} = ${c}` : `${X} − ${b} = ${c}`,
      solution:x, category:"l1"
    };
  }

  function gen_l1_mul() {
    const x = ri(1,10);
    const a = rFrom([2,3,4,5,6,7,8,9]);
    return { display:`${a}${X} = ${a*x}`, solution:x, category:"l1" };
  }

  function gen_l1_twoStep() {
    const x = ri(1,10);
    const a = rFrom([2,3,4,5]);
    const b = ri(1,9);
    const signPlus = Math.random()<0.5;
    const c = signPlus ? a*x+b : a*x-b;
    return {
      display: signPlus ? `${a}${X} + ${b} = ${c}` : `${a}${X} − ${b} = ${c}`,
      solution:x, category:"l1"
    };
  }

  function gen_l2_negativeResult() {
    const x = rFrom([-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1]);
    const a = rFrom([2,3,4,5,6]);
    const b = nzFrom([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]);
    const c = a*x+b;
    const bs = b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
    return {display:`${a}${X} ${bs} = ${c}`,solution:x,category:"l2"};
  }

  function gen_l2_crossZero() {
    const x = rFrom([-9,-8,-7,-6,-5,-4,-3,-2,-1]);
    const b = rFrom([5,6,7,8,9,10,11,12]);
    const c = x+b;
    return {display:`${X} + ${b} = ${c}`,solution:x,category:"l2"};
  }

  function gen_l2_bracket() {
    const x = rFrom([-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8]);
    const a = rFrom([2,3,4,5]);
    const b = nzFrom([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
    const c = a*(x+b);
    const bs = b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
    return {display:`${a}(${X} ${bs}) = ${c}`,solution:x,category:"l2"};
  }

  function gen_l3_bothSides() {
    for(let t=0;t<100;t++){
      const x = rFrom([-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10,11,12]);
      const a = rFrom([2,3,4,5,6,7]);
      const c = rFrom([1,2,3,4,5,6].filter(v=>v!==a));
      const b = nzFrom([-12,-10,-8,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,8,10,12]);
      const d = a*x+b-c*x;
      if(Math.abs(d)>30) continue;
      const bs=b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const ds=d>=0?`+ ${d}`:`− ${Math.abs(d)}`;
      return {display:`${a}${X} ${bs} = ${c}${X} ${ds}`,solution:x,category:"l3"};
    }
    return gen_axObouStr();
  }

  function gen_l3_twoBrackets() {
    for(let t=0;t<120;t++){
      const x = rFrom([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]);
      const a = rFrom([2,3,4,5]);
      const c = rFrom([2,3,4,5].filter(v=>v!==a));
      const b = nzFrom([-6,-5,-4,-3,-2,-1,1,2,3,4,5,6]);
      const d = (a*(x+b)/c)-x;
      if(!Number.isInteger(d) || d===0 || Math.abs(d)>10) continue;
      const bs=b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const ds=d>=0?`+ ${d}`:`− ${Math.abs(d)}`;
      return {display:`${a}(${X} ${bs}) = ${c}(${X} ${ds})`,solution:x,category:"l3"};
    }
    return gen_azavorkou_obou();
  }

  function gen_l3_fractionSum() {
    for(let t=0;t<120;t++){
      const a = rFrom([2,3,4]);
      const b = rFrom([3,4,5,6].filter(v=>v!==a));
      const x = rFrom([-12,-10,-8,-6,-4,-3,-2,2,3,4,6,8,10,12]);
      const c = x/a + x/b;
      if(!Number.isInteger(c)) continue;
      return {display:`${fracInline("x",a)} + ${fracInline("x",b)} = ${c}`,solution:x,category:"l3"};
    }
    return gen_xDaPxDb();
  }

  function gen_l4_negBeforeBoth() {
    for(let t=0;t<160;t++){
      const x = rFrom([-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10,11,12]);
      const a = rFrom([2,3,4,5,6]);
      const c = rFrom([2,3,4,5]);
      const b = nzFrom([-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8]);
      const d = nzFrom([-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8]);
      const left = -a*(x+b);
      const k = left - c*(x+d);
      if(Math.abs(k)>40) continue;
      const bs=b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const ds=d>=0?`+ ${d}`:`− ${Math.abs(d)}`;
      const ks=k>=0?`+ ${k}`:`− ${Math.abs(k)}`;
      return {display:`−${a}(${X} ${bs}) = ${c}(${X} ${ds}) ${ks}`,solution:x,category:"l4"};
    }
    return gen_hardNegBrackets();
  }

  function gen_l4_fractionBothSides() {
    for(let t=0;t<200;t++){
      const x = rFrom([-12,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10,12]);
      const a = rFrom([2,3,4,5]);
      const b = nzFrom([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]);
      const c = rFrom([1,2,3,4]);
      const d = nzFrom([-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9]);
      const m = rFrom([2,3,4,5]);
      const n = rFrom([2,3,4,5,6].filter(v=>v!==m));
      const rhs = (a*x+b)/m - (c*x+d)/n;
      if(!Number.isInteger(rhs) || Math.abs(rhs)>18) continue;
      const bs=b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const ds=d>=0?`+ ${d}`:`− ${Math.abs(d)}`;
      return {display:`${fracInline(`${a}${X} ${bs}`,m)} − ${fracInline(`${c}${X} ${ds}`,n)} = ${rhs}`,solution:x,category:"l4"};
    }
    return gen_hardFractionBrackets();
  }

  function gen_l4_decimalNegative() {
    for(let t=0;t<120;t++){
      const x = rFrom([-12,-10,-8,-6,-4,-2,2,4,6,8,10,12]);
      const a = rFrom([0.5,1.5,2.5,0.25,0.75,1.25]);
      const c = rFrom([0.5,1.5,2.5,0.25,0.75,1.25].filter(v=>v!==a));
      const b = nzFrom([-8,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,8]);
      const d = a*x+b-c*x;
      if(!Number.isInteger(d) || Math.abs(d)>20) continue;
      const bs=b>=0?`+ ${b}`:`− ${Math.abs(b)}`;
      const ds=d>=0?`+ ${d}`:`− ${Math.abs(d)}`;
      return {display:`${toDec(a)}${X} ${bs} = ${toDec(c)}${X} ${ds}`,solution:x,category:"l4"};
    }
    return gen_decAxPbEcxPd();
  }

  const mixIndex = TOPICS.length-1;
  const extraTopics = [
    {
      name:"Sčítání a odčítání s x", eq:"x+5=12",
      desc:"Jedna jednoduchá úprava, bez záludností", section:"Úroveň 1 · Základ",
      gen:[gen_l1_addSub], level:1,
      keywords:"základ zaklad úplné základy scitani odcitani x plus minus jedna operace"
    },
    {
      name:"Násobení a dělení", eq:"4x=20",
      desc:"Jedna násobná vazba — najdi x dělením", section:"Úroveň 1 · Základ",
      gen:[gen_l1_mul], level:1,
      keywords:"základ zaklad nasobeni deleni ax=b přímé rovnice"
    },
    {
      name:"Dva kroky", eq:"3x+4=19",
      desc:"Nejdřív člen bez x, potom koeficient", section:"Úroveň 1 · Základ",
      gen:[gen_l1_twoStep], level:1,
      keywords:"základ zaklad dva kroky ax+b=c jednoduché"
    },
    {
      name:"Záporný výsledek", eq:"3x+4=−11",
      desc:"Řešení leží v záporných číslech", section:"Úroveň 2 · Školní",
      gen:[gen_l2_negativeResult], level:2,
      keywords:"zaporne záporné výsledek přechod přes nulu cela cisla"
    },
    {
      name:"Přechod přes nulu", eq:"x+8=3",
      desc:"Pracuj jistě s kladnými i zápornými čísly", section:"Úroveň 2 · Školní",
      gen:[gen_l2_crossZero], level:2,
      keywords:"prechod přes nulu zaporna cisla odcitani"
    },
    {
      name:"Jedna závorka", eq:"3(x−2)=15",
      desc:"Roznásob závorku a pokračuj jako u běžné rovnice", section:"Úroveň 2 · Školní",
      gen:[gen_l2_bracket], level:2,
      keywords:"závorka zavorka roznasobeni jedna závorka"
    },
    {
      name:"x na obou stranách — náročnější", eq:"5x−7=2x+11",
      desc:"Více kroků a práce se znaménky", section:"Úroveň 3 · Pokročilá",
      gen:[gen_l3_bothSides], level:3,
      keywords:"x na obou stranach více kroků znamenka pokrocile"
    },
    {
      name:"Závorky na obou stranách", eq:"3(x−2)=2(x+4)",
      desc:"Rozbal obě závorky a potom porovnej členy", section:"Úroveň 3 · Pokročilá",
      gen:[gen_l3_twoBrackets], level:3,
      keywords:"závorky na obou stranach dvě zavorky roznasobeni"
    },
    {
      name:"Součet zlomků s x", eq:"x/3+x/4=7",
      desc:"Najdi společný jmenovatel a odstraň zlomky", section:"Úroveň 3 · Pokročilá",
      gen:[gen_l3_fractionSum], level:3,
      keywords:"zlomky soucet zlomku nsj spolecny jmenovatel"
    },
    {
      name:"Znaménko před závorkou", eq:"−3(x−4)=…",
      desc:"Mínus před závorkou a x na obou stranách", section:"Úroveň 4 · Mistr",
      gen:[gen_l4_negBeforeBoth], level:4,
      keywords:"mistr znamenko před zavorkou minus závorky zaporne"
    },
    {
      name:"Zlomky a závorky", eq:"(2x−3)/4−…",
      desc:"Více zlomků, více členů a nutnost zvolit správné pořadí", section:"Úroveň 4 · Mistr",
      gen:[gen_l4_fractionBothSides], level:4,
      keywords:"mistr zlomky závorky kombinace jmenovatele více kroků"
    },
    {
      name:"Desetinná čísla a záporné hodnoty", eq:"1,5x−4=0,5x−12",
      desc:"Desetinné koeficienty, obě strany a práce přes nulu", section:"Úroveň 4 · Mistr",
      gen:[gen_l4_decimalNegative], level:4,
      keywords:"mistr desetinna cisla zaporne hodnoty x na obou stranach"
    }
  ];
  TOPICS.splice(mixIndex,0,...extraTopics);

  const mixTopic = TOPICS[TOPICS.length-1];
  mixTopic.level = 3;
  mixTopic.keywords = (mixTopic.keywords || "") + " mix vše vse dohromady";

  function plainDisplay(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    return (d.textContent || "").replace(/\s+/g," ").trim();
  }

  function isSuitable(eq, level, topic) {
    if (!eq || !Number.isFinite(eq.solution)) return false;
    const txt = plainDisplay(eq.display);
    if (!/x/i.test(txt)) return false;
    if (/\+\s*0\b|−\s*0\b|-\s*0\b/.test(txt)) return false;
    if (eq.solution === 0 && level <= 3) return false;

    const abs = Math.abs(eq.solution);
    if (level === 1 && abs > 12) return false;
    if (level === 2 && abs > 18) return false;
    if (level === 3 && abs > 35) return false;
    if (level === 4 && abs > 60) return false;

    if (topic?.name?.includes("(x + a)/b") && !/[+\-−]\s*\d/.test(txt)) return false;
    if (topic?.name?.includes("(ax + b)/c") && !/[+\-−]\s*\d/.test(txt)) return false;
    return true;
  }

  function buildEqListForTopic(topic) {
    const eqs = [];
    let guard = 0;
    while (eqs.length < EQS_PER_SESSION && guard++ < 500) {
      const gen = rFrom(topic.gen);
      try {
        const candidate = gen();
        if (!isSuitable(candidate, topic.level, topic)) continue;
        const sig = plainDisplay(candidate.display);
        if (eqs.some(e => plainDisplay(e.display) === sig)) continue;
        eqs.push(candidate);
      } catch(e) {}
    }
    while (eqs.length < EQS_PER_SESSION) {
      const candidate = rFrom(topic.gen)();
      if (candidate && Number.isFinite(candidate.solution)) eqs.push(candidate);
    }
    return eqs;
  }

  const originalCheckStep = checkStep;
  checkStep = function(studentInput, solution) {
    const input = studentInput.trim();
    const direct = input.match(/^\s*x\s*=\s*(-?\d+(?:[.,]\d+)?)\s*$/i) ||
                   input.match(/^\s*(-?\d+(?:[.,]\d+)?)\s*=\s*x\s*$/i);
    if (direct) return originalCheckStep(studentInput, solution);
    if (!/x/i.test(input)) return "wrong";
    return originalCheckStep(studentInput, solution);
  };

  if (!ST.stats) ST.stats = {};
  if (!Number.isFinite(ST.stats.skipped)) ST.stats.skipped = 0;
  if (!Number.isFinite(ST.stats.revealed)) ST.stats.revealed = 0;
  if (!Number.isFinite(ST.stats.solved)) ST.stats.solved = 0;
  if (!ST.topicStats) ST.topicStats = {};
  if (!ST.level) ST.level = 1;

  function bumpTopicStat(topicIdx,key) {
    if (!ST.topicStats[topicIdx]) ST.topicStats[topicIdx] = {skipped:0,revealed:0,solved:0};
    ST.topicStats[topicIdx][key] = (ST.topicStats[topicIdx][key] || 0) + 1;
  }

  startSession = function(topicIdx) {
    SEL = { topicIdx };
    const topic = TOPICS[topicIdx];
    ST.level = topic.level || ST.level || 1;
    saveST();
    _currentHelp = topic.help || null;
    const hBtn = document.getElementById("ex-help-btn");
    if (hBtn) hBtn.style.display = _currentHelp ? "flex" : "none";
    SES = {
      topicIdx,
      eqs: buildEqListForTopic(topic),
      cur:0, solved:0, skipped:0, revealed:0, xpGained:0,
      steps:[], wrongCount:0, done:false
    };
    showScreen("screen-exercise");
    renderEquation();
  };

  const oldRenderEquation = renderEquation;
  renderEquation = function() {
    oldRenderEquation();
    const note = document.querySelector(".paper-note");
    if (note) note.innerHTML = "✏️ Napiš další krok nebo rovnou výsledek.";
    const inp = document.getElementById("eq-input");
    if (inp) inp.placeholder = "napiš další krok nebo výsledek…";

    const oldSkip = document.getElementById("btn-skip");
    if (oldSkip) {
      oldSkip.textContent = "Přeskočit – na tu si netroufám";
      oldSkip.style.textDecoration = "none";
      oldSkip.style.border = "1.5px solid var(--border)";
      oldSkip.style.borderRadius = "9px";
      oldSkip.style.padding = "9px 12px";
      oldSkip.style.marginTop = "10px";
      oldSkip.style.marginRight = "8px";

      const reveal = document.createElement("button");
      reveal.type = "button";
      reveal.id = "btn-reveal";
      reveal.className = "btn-skip";
      reveal.textContent = "Zobrazit řešení";
      reveal.style.textDecoration = "none";
      reveal.style.border = "1.5px solid var(--border)";
      reveal.style.borderRadius = "9px";
      reveal.style.padding = "9px 12px";
      reveal.addEventListener("click", revealSolution);
      oldSkip.after(reveal);
    }
  };

  skipEquation = function() {
    if (!SES || SES.done) return;
    SES.skipped++;
    ST.stats.skipped++;
    bumpTopicStat(SES.topicIdx,"skipped");
    ST.streak = 0;
    saveST();

    const topic = TOPICS[SES.topicIdx];
    let replacement = null;
    for (let i=0;i<80;i++) {
      try {
        const c = rFrom(topic.gen)();
        if (isSuitable(c, topic.level, topic) &&
            plainDisplay(c.display) !== plainDisplay(SES.eqs[SES.cur].display)) {
          replacement = c; break;
        }
      } catch(e) {}
    }
    if (replacement) SES.eqs[SES.cur] = replacement;
    renderEquation();
  };

  window.revealSolution = function() {
    if (!SES || SES.done) return;
    SES.revealed = (SES.revealed || 0) + 1;
    ST.stats.revealed++;
    bumpTopicStat(SES.topicIdx,"revealed");
    ST.streak = 0;
    saveST();

    const eq = SES.eqs[SES.cur];
    showStepItem("valid", `x = ${eq.solution}`, "← řešení");
    const ia = document.getElementById("input-area");
    if (ia) ia.style.display = "none";
    SES.done = true;

    const body = document.getElementById("ex-body");
    const banner = document.createElement("div");
    banner.className = "done-banner";
    banner.style.borderColor = "var(--warn)";
    banner.style.background = "var(--warn-bg)";
    const isLast = SES.cur >= SES.eqs.length - 1;
    banner.innerHTML = `
      <div class="done-banner-title" style="color:var(--warn)">Řešení zobrazeno</div>
      <div class="done-banner-sub">Zkus si všimnout, který krok ti chyběl.</div>
      <button class="btn-next-eq" onclick="nextEquation()">${isLast?"Zobrazit výsledky →":"Další rovnice →"}</button>`;
    body.appendChild(banner);

    if (_enterHandler) document.removeEventListener("keydown", _enterHandler);
    _enterHandler = e => { if (e.key==="Enter") { e.preventDefault(); nextEquation(); } };
    setTimeout(()=>document.addEventListener("keydown", _enterHandler),150);
  };

  const oldProcessStep = processStep;
  processStep = function(raw) {
    const wasDone = SES?.done;
    const beforeSolved = SES?.solved || 0;
    const beforeWrong = SES?.wrongCount || 0;
    oldProcessStep(raw);

    if (!wasDone && SES?.done && (SES?.solved || 0) > beforeSolved) {
      ST.stats.solved++;
      bumpTopicStat(SES.topicIdx,"solved");
      saveST();
    }
    if ((SES?.wrongCount || 0) > beforeWrong && SES.wrongCount >= 2) {
      const hints = document.querySelectorAll(".step-item.step-wrong .step-hint");
      const last = hints[hints.length-1];
      if (last && /řešení je x/i.test(last.textContent)) {
        last.textContent = "Zkus určit, jakou stejnou operaci provést na obou stranách.";
      }
    }
  };

  const oldFinishSession = finishSession;
  finishSession = function() {
    const total=SES.eqs.length;
    const solved=SES.solved;
    const ratio=solved/total;
    const stars=ratio>=1?3:ratio>=0.75?2:ratio>=0.5?1:0;
    setStars(SEL.topicIdx,stars);
    sndComplete();
    document.getElementById("res-eq").textContent = solved+"/"+total+" vyřešeno";
    document.getElementById("res-stars").textContent = "★".repeat(stars)+"☆".repeat(3-stars);
    document.getElementById("res-title").textContent =
      ["Zkus to znovu!","Už se do toho dostáváš!","Dobře!","Perfektní!"][stars];
    document.getElementById("res-score").textContent =
      solved+" vyřešeno · "+(SES.revealed||0)+" řešení zobrazeno · "+(SES.skipped||0)+" přeskočeno";
    document.getElementById("res-xp").textContent = "+"+SES.xpGained;
    showScreen("screen-result");
  };

  let activeLevel = Number(ST.level) || 1;
  let searchQuery = "";

  function normalize(s) {
    return (s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  function injectHomeControls() {
    let controls = document.getElementById("rovnice-controls");
    if (controls) return controls;
    controls = document.createElement("div");
    controls.id = "rovnice-controls";
    controls.innerHTML = `
      <div class="rv-level-title">Vyber obtížnost</div>
      <div class="rv-levels">
        ${Object.entries(LEVELS).map(([n,l]) =>
          `<button type="button" class="rv-level-btn" data-level="${n}">${l.name}</button>`).join("")}
      </div>
      <div class="rv-level-desc" id="rv-level-desc"></div>
      <div class="rv-search-wrap">
        <input id="rv-search" type="search" autocomplete="off"
          placeholder="Co chceš procvičovat? třeba: neznámá ve jmenovateli">
      </div>`;
    const wrap = document.getElementById("cats-wrap");
    wrap.parentNode.insertBefore(controls,wrap);

    controls.querySelectorAll(".rv-level-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeLevel = Number(btn.dataset.level);
        ST.level = activeLevel; saveST();
        searchQuery = "";
        const inp = document.getElementById("rv-search");
        if (inp) inp.value = "";
        renderHome();
      });
    });
    controls.querySelector("#rv-search").addEventListener("input", e => {
      searchQuery = e.target.value;
      renderTopicCardsOnly();
    });
    return controls;
  }

  function renderTopicCardsOnly() {
    const wrap = document.getElementById("cats-wrap");
    wrap.innerHTML = "";
    const q = normalize(searchQuery.trim());
    const visible = TOPICS.map((t,idx)=>({t,idx})).filter(({t}) => {
      if (q) return normalize(t.keywords).includes(q) || normalize(t.name).includes(q) ||
                    normalize(t.desc).includes(q) || normalize(t.section).includes(q);
      return (t.level || 1) === activeLevel;
    });

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.style.cssText="padding:26px 12px;text-align:center;color:var(--ink2);font-size:.9rem";
      empty.textContent = "Takový typ jsem nenašla. Zkus kratší název, třeba „zlomky“, „závorky“ nebo „jmenovatel“.";
      wrap.appendChild(empty);
      return;
    }

    let lastSection = null;
    visible.forEach(({t:topic,idx}) => {
      if (topic.section !== lastSection) {
        lastSection = topic.section;
        const div = document.createElement("div");
        div.style.cssText='font-family:"JetBrains Mono",monospace;font-size:.62rem;color:var(--ink3);letter-spacing:2.5px;text-transform:uppercase;padding:10px 4px 4px;margin-top:4px';
        div.textContent = topic.section;
        wrap.appendChild(div);
      }
      const stars = getStars(idx);
      const starStr = stars>0 ? "★".repeat(stars)+"☆".repeat(3-stars) : "";
      const card = document.createElement("div");
      card.className = `topic-card${topic.eq==="∼"?" all":""}`;
      card.innerHTML = `
        <div class="tc-eq">${topic.eq}</div>
        <div class="tc-left">
          <div class="tc-name">${topic.name} <span class="rv-topic-level">L${topic.level||1}</span></div>
          <div class="tc-desc">${topic.desc}</div>
        </div>
        <div class="tc-right">
          ${starStr?`<span style="color:var(--warn);font-size:.82rem">${starStr}</span>`:""}
          ${topic.help?`<button class="topic-help-btn">?</button>`:""}
          <span style="color:var(--ink3);font-size:.9rem">→</span>
        </div>`;
      if (topic.help) card.querySelector(".topic-help-btn").addEventListener("click",e=>{
        e.stopPropagation(); openHelp(topic.help);
      });
      card.addEventListener("click",()=>startSession(idx));
      wrap.appendChild(card);
    });
  }

  renderHome = function() {
    document.getElementById("hdr-xp").textContent = ST.xp;
    document.getElementById("hdr-streak").textContent = ST.streak;
    const controls = injectHomeControls();
    controls.querySelectorAll(".rv-level-btn").forEach(b =>
      b.classList.toggle("active",Number(b.dataset.level)===activeLevel && !searchQuery.trim()));
    const desc = document.getElementById("rv-level-desc");
    if (desc) desc.textContent = searchQuery.trim()
      ? "Vyhledávám ve všech čtyřech úrovních."
      : LEVELS[activeLevel].desc;
    renderTopicCardsOnly();
  };

  const style = document.createElement("style");
  style.textContent = `
    #rovnice-controls{max-width:500px;margin:14px auto 0;padding:0 18px;width:100%}
    .rv-level-title{font-weight:800;font-size:.82rem;margin-bottom:8px;color:var(--ink)}
    .rv-levels{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
    .rv-level-btn{border:1.5px solid var(--border);background:var(--paper);color:var(--ink2);
      border-radius:11px;padding:10px 8px;font-family:'Nunito',sans-serif;font-weight:800;
      cursor:pointer;box-shadow:var(--shadow)}
    .rv-level-btn.active{border-color:var(--accent);color:var(--accent);background:#eef2ff}
    .rv-level-desc{font-size:.76rem;color:var(--ink2);line-height:1.45;padding:8px 2px 10px}
    .rv-search-wrap input{width:100%;border:2px solid var(--border);background:var(--paper);
      border-radius:12px;padding:12px 14px;font-family:'Nunito',sans-serif;font-size:.86rem;
      outline:none;box-shadow:var(--shadow)}
    .rv-search-wrap input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(33,69,200,.1)}
    .rv-topic-level{font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--accent);
      border:1px solid #cbd5ff;border-radius:10px;padding:1px 5px;margin-left:4px;vertical-align:1px}
    @media(min-width:520px){.rv-levels{grid-template-columns:repeat(4,1fr)}}
  `;
  document.head.appendChild(style);

  renderHome();
})();