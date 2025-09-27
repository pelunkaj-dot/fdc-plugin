/* FajnDoučko – Chat Bubble Plugin v1.0
   Jeden soubor, více instancí. Publikuj jako /static/fdc-plugin.v1.js a vkládej 2 řádky:
   <script src="https://tvoje-domena.cz/static/fdc-plugin.v1.js"></script>
   <script>
     fdc.setup({ id:"adele-a1", title:"Adele · A1", assistantName:"Adele",
                 color:"#16a34a", color2:"#ef4444",
                 endpoint:"", // prázdné = DEMO odpovědi
                 placement:"body", // kam se widget přimontuje (CSS selektor)
                 position:{ right:20, bottom:20 }, openOnLoad:false,
                 greeting:"Ahoj, jsem Adele. Jak ti můžu pomoct?",
                 placeholder:"Napiš dotaz a Enter…" });
   </script>
*/
(function(global){
  const d = document;
  function css(strings){ return strings[0]; }
  function h(tag, cls, html){ const el=d.createElement(tag); if(cls) el.className=cls; if(html!=null) el.innerHTML=html; return el; }
  function on(el,ev,fn){ el.addEventListener(ev,fn); }
  function ready(fn){ /complete|interactive|loaded/.test(d.readyState)?fn():d.addEventListener('DOMContentLoaded',fn); }

  const baseStyles = css`
  :root{--fdc-accent:#16a34a;--fdc-accent-2:#ef4444;--fdc-bg:#fff;--fdc-text:#0f172a;--fdc-muted:#64748b;--fdc-shadow:0 10px 25px rgba(2,6,23,.15);--fdc-radius:16px}
  .fdc-hidden{display:none!important}
  .fdc-bubble-btn{position:fixed;z-index:999999;width:60px;height:60px;border-radius:9999px;border:none;cursor:pointer;background:var(--fdc-accent);color:#fff;box-shadow:var(--fdc-shadow);display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .15s ease,box-shadow .2s ease,background .2s ease}
  .fdc-bubble-btn:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(2,6,23,.25)}
  .fdc-badge{position:absolute;top:-6px;right:-6px;background:var(--fdc-accent-2);color:#fff;font-size:11px;padding:2px 6px;border-radius:999px;box-shadow:var(--fdc-shadow)}
  .fdc-panel{position:fixed;z-index:999998;width:360px;max-width:calc(100vw - 40px);height:520px;max-height:calc(100vh - 140px);background:var(--fdc-bg);color:var(--fdc-text);border-radius:var(--fdc-radius);box-shadow:var(--fdc-shadow);display:flex;flex-direction:column;overflow:hidden;border:1px solid #e5e7eb}
  .fdc-header{display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(180deg,#f8fafc,#fff);border-bottom:1px solid #e5e7eb}
  .fdc-avatar{width:28px;height:28px;border-radius:9999px;background:var(--fdc-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}
  .fdc-title{font-weight:700;font-size:14px}
  .fdc-sub{font-size:12px;color:var(--fdc-muted)}
  .fdc-spacer{flex:1}
  .fdc-x{background:transparent;border:none;font-size:18px;cursor:pointer;color:#334155}
  .fdc-messages{flex:1;padding:12px;overflow:auto;background:#f8fafc}
  .fdc-msg{display:flex;margin-bottom:10px;gap:8px}
  .fdc-msg .fdc-bubble{padding:10px 12px;border-radius:14px;max-width:80%;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .fdc-msg.user{justify-content:flex-end}
  .fdc-msg.user .fdc-bubble{background:#dbeafe;border:1px solid #bfdbfe}
  .fdc-msg.bot .fdc-bubble{background:#fff;border:1px solid #e2e8f0}
  .fdc-typing{font-size:12px;color:var(--fdc-muted);padding:0 12px 6px}
  .fdc-input{border-top:1px solid #e5e7eb;padding:8px;background:#fff;display:flex;gap:8px;align-items:center}
  .fdc-textarea{flex:1;min-height:44px;max-height:120px;resize:vertical;padding:10px 12px;border-radius:12px;border:1px solid #e5e7eb;outline:none;font:inherit;background:#fff}
  .fdc-send{flex:0 0 auto;height:44px;padding:0 14px;border:none;border-radius:12px;background:var(--fdc-accent);color:#fff;cursor:pointer;font-weight:600;box-shadow:var(--fdc-shadow)}
  .fdc-send:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
  `;

  function injectStyles(theme){
    const s = h('style');
    s.textContent = baseStyles + (theme?`\n:root{--fdc-accent:${theme.color};--fdc-accent-2:${theme.color2||'#ef4444'};}`:'');
    d.head.appendChild(s);
  }

  function makeWidget(opts){
    const cfg = Object.assign({
      id: 'fdc-'+Math.random().toString(36).slice(2),
      title: 'FajnDoučko · Nela', assistantName: 'Nela',
      greeting: 'Ahoj, jsem Nela. S čím ti dnes pomůžu?', placeholder:'Napiš dotaz a stiskni Enter…',
      endpoint: '', withCredentials:false, headers:{'Content-Type':'application/json'},
      placement: 'body', position:{ right:20, bottom:20 }, openOnLoad:false,
      icon:'💬', badge:'Nové'
    }, opts||{});

    injectStyles({ color: cfg.color || '#16a34a', color2: cfg.color2 || '#ef4444' });

    const mount = (cfg.placement==='body') ? d.body : d.querySelector(cfg.placement);
    if(!mount) return console.warn('[fdc] Nenalezen placement:', cfg.placement);

    // Button
    const btn = h('button','fdc-bubble-btn'); btn.setAttribute('aria-label','Otevřít chat'); btn.innerHTML = cfg.icon;
    btn.style.right = (cfg.position.right||20)+'px'; btn.style.bottom=(cfg.position.bottom||20)+'px';
    const badge = h('span','fdc-badge'); badge.textContent = cfg.badge; btn.appendChild(badge);

    // Panel
    const panel = h('div','fdc-panel fdc-hidden');
    panel.style.right = (cfg.position.right||20)+'px'; panel.style.bottom=((cfg.position.bottom||20)+70)+'px';
    panel.innerHTML = (
      '<div class="fdc-header">'+
      '<div class="fdc-avatar">'+(cfg.assistantName?cfg.assistantName[0].toUpperCase():'N')+'</div>'+
      '<div><div class="fdc-title">'+(cfg.title||'FajnDoučko')+'</div><div class="fdc-sub">online · bezpečný chat</div></div>'+
      '<div class="fdc-spacer"></div><button class="fdc-x" title="Zavřít" aria-label="Zavřít">×</button></div>'+
      '<div class="fdc-messages" role="log" aria-live="polite"></div>'+
      '<div class="fdc-typing fdc-hidden">'+(cfg.assistantName||'Nela')+' píše…</div>'+
      '<div class="fdc-input"><textarea class="fdc-textarea" placeholder="'+cfg.placeholder+'"></textarea><button class="fdc-send" disabled>Odeslat</button></div>'
    );

    (mount.closest('body')||d.body).appendChild(btn);
    (mount.closest('body')||d.body).appendChild(panel);

    const messages=panel.querySelector('.fdc-messages');
    const typing=panel.querySelector('.fdc-typing');
    const closeBtn=panel.querySelector('.fdc-x');
    const ta=panel.querySelector('.fdc-textarea');
    const send=panel.querySelector('.fdc-send');

    let greeted=false; const sidKey='fdc_session_'+cfg.id; let sessionId=localStorage.getItem(sidKey) || (crypto.randomUUID?crypto.randomUUID():String(Date.now())); localStorage.setItem(sidKey,sessionId);

    function add(role,text){ const w=h('div','fdc-msg '+role); const b=h('div','fdc-bubble'); b.textContent=text; w.appendChild(b); messages.appendChild(w); messages.scrollTop=messages.scrollHeight; }
    function typingState(v){ typing.classList.toggle('fdc-hidden',!v); }
    function toggle(open){ panel.classList.toggle('fdc-hidden',!open); if(open){ ta.focus(); badge.classList.add('fdc-hidden'); if(!greeted){ add('bot', cfg.greeting); greeted = true; } } }

    async function sendMsg(text){
      add('user',text); typingState(true); send.disabled=true; ta.disabled=true;
      try{
        if(!cfg.endpoint){ await new Promise(r=>setTimeout(r,350)); add('bot','Demo odpověď: '+text); }
        else{
          const res = await fetch(cfg.endpoint,{ method:'POST', headers:cfg.headers, credentials:cfg.withCredentials?'include':'same-origin', body:JSON.stringify({ message:text, session_id:sessionId, assistant:cfg.id }) });
          if(!res.ok) throw new Error('Chyba serveru: '+res.status); const data = await res.json(); add('bot', data.reply || '[Prázdná odpověď]');
        }
      }catch(e){ console.error(e); add('bot','Jejda, něco se pokazilo. Zkus to prosím znovu.'); }
      finally{ typingState(false); send.disabled=false; ta.disabled=false; ta.value=''; ta.focus(); }
    }

    on(btn,'click',()=>toggle(panel.classList.contains('fdc-hidden')));
    on(closeBtn,'click',()=>toggle(false));
    on(ta,'input',()=>{ send.disabled = ta.value.trim().length===0; });
    on(ta,'keydown',e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); if(ta.value.trim()) sendMsg(ta.value.trim()); }});
    on(send,'click',()=>{ if(ta.value.trim()) sendMsg(ta.value.trim()); });

    if(cfg.openOnLoad){ setTimeout(()=>toggle(true), 400); }

    return { open:()=>toggle(true), close:()=>toggle(false) };
  }

  const api = {
    setup: function(options){ ready(()=> makeWidget(options||{})); },
    // Umožni více instancí na jedné stránce
    create: function(options){ return makeWidget(options||{}); }
  };

  global.fdc = api;
})(window);
