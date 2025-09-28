// === FajnDoucko Amy: bundle (plugin + init + voice) ===
(function(){
  var PLUGIN_URL = "https://pelunkaj-dot.github.io/fdc-plugin/fdc-plugin.v1.js?v=8";
  function load(src, cb){
    var s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = cb; s.onerror = function(){ console.error("Nepodařilo se načíst", src); };
    document.head.appendChild(s);
  }

  function ensureCSS(cssText){
    var st = document.createElement('style');
    st.textContent = cssText;
    document.head.appendChild(st);
  }

  function initAmy(){
    try {
      // 1) Spusť bublinu Amy
      if (!window.FDC || !window.FDC.init) { console.error("FDC.init není k dispozici"); return; }
      var GREETINGS = [
        "Hi! Need quick help? Ask me anything. 👋",
        "Let’s make this easy — what do you want to practice?",
        "Say the first sentence and I’ll take it from there.",
        "Short question → clear answer. Fire away!",
        "Ready when you are. What’s tricky today?",
        "Practice makes progress. Tell me what to focus on."
      ];
      var greeting = GREETINGS[Math.floor(Math.random()*GREETINGS.length)];
      window.FDC_WIDGET = FDC.init({
        endpoint: "https://fdc-gateway.vercel.app",
        assistant: "amy",
        title: "Amy · English Tutor",
        greeting: greeting,
        openOnLoad: false
      });

      // 2) Lehké „zvětšení“ tlačítka bubliny (ať vypadá moderně)
      ensureCSS(
        ".fdc-btn{position:fixed;right:20px;bottom:20px;width:76px;height:76px;border-radius:50%;z-index:2147483647;background:linear-gradient(135deg,#00c853,#27e0a5);box-shadow:0 10px 28px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center}" +
        ".fdc-btn svg,.fdc-btn img{width:28px;height:28px}" +
        "@media(max-width:600px){.fdc-btn{right:12px;bottom:12px;width:64px;height:64px}.fdc-btn svg,.fdc-btn img{width:24px;height:24px}}"
      );

      // 3) Voice (STT + TTS) – jednoduché MVP v prohlížeči (Chrome/Edge)
      window.addEventListener('load', function(){
        try {
          var btn = document.createElement('button');
          btn.id = 'fdc-voice-btn';
          btn.setAttribute('aria-label','Hold to talk');
          btn.textContent = '🎙️';
          document.body.appendChild(btn);

          ensureCSS(
            "#fdc-voice-btn{position:fixed;right:100px;bottom:14px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;font-size:24px;background:#111;color:#fff;box-shadow:0 10px 28px rgba(0,0,0,.28);z-index:2147483647;display:flex;align-items:center;justify-content:center;transition:transform .15s ease,background .2s ease}" +
            "#fdc-voice-btn:hover{transform:translateY(-2px) scale(1.03)}" +
            "#fdc-voice-btn.rec{background:#d32f2f}" +
            "@media(max-width:600px){#fdc-voice-btn{right:88px;bottom:10px;width:50px;height:50px;font-size:22px}}"
          );

          function trySendToWidget(text){
            if(!text) return false;
            if (window.FDC_WIDGET && typeof window.FDC_WIDGET.send === 'function'){
              window.FDC_WIDGET.send(text);
              return true;
            }
            var root = document.querySelector('.fdc-widget') || document;
            var ta = root.querySelector('textarea, input[type=text]');
            if (ta){
              ta.focus(); ta.value = text;
              ta.dispatchEvent(new Event('input',{bubbles:true}));
              var form = ta.closest('form');
              if (form){
                var evt = new KeyboardEvent('keydown',{key:'Enter',code:'Enter',which:13,keyCode:13,bubbles:true});
                ta.dispatchEvent(evt);
              } else {
                var sendBtn = root.querySelector('button[type=submit],button[data-send],.fdc-send,.send');
                if (sendBtn) sendBtn.click();
              }
              return true;
            }
            alert('Mikrofon běží, ale nenašel jsem vstup v chatu. Napiš mi a doladíme selektor.');
            return false;
          }

          function pickVoice(lang){
            var voices = speechSynthesis.getVoices();
            return voices.find(function(v){return v.lang===lang && /Google|Microsoft|Apple|Samantha|Jenny|Guy|Aria/i.test(v.name);})
                || voices.find(function(v){return v.lang===lang;})
                || voices[0];
          }
          function speak(text, lang){
            if (!('speechSynthesis' in window) || !text) return;
            lang = lang || "en-US";
            var u = new SpeechSynthesisUtterance(text);
            u.lang = lang;
            var v = pickVoice(lang);
            if (v) u.voice = v;
            u.rate = 1.0; u.pitch = 1.0; u.volume = 1.0;
            speechSynthesis.cancel();
            speechSynthesis.speak(u);
          }
          function readLastAssistantMessage(){
            var root = document.querySelector('.fdc-widget') || document;
            var sel = [
              '.fdc-message.assistant','.fdc-msg.bot','.message.bot',
              '.assistant','[data-role="assistant"]','.ai','.reply'
            ].join(',');
            var nodes = root.querySelectorAll(sel);
            var last = nodes[nodes.length-1];
            var text = last ? (last.textContent||"").trim() : '';
            if (text) speak(text, "en-US");
          }

          var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          var rec = null, listening = false, finalText = '';

          function startRec(){
            if (!SR){ alert('Rozpoznávání řeči není v tomhle prohlížeči dostupné. Zkus Chrome/Edge přes HTTPS.'); return; }
            rec = new SR();
            rec.lang = "en-US";
            rec.interimResults = true;
            rec.continuous = false;
            listening = true; btn.classList.add('rec'); finalText = '';
            rec.onresult = function(e){
              for (var i=e.resultIndex; i<e.results.length; i++){
                var t = e.results[i][0].transcript;
                if (e.results[i].isFinal) finalText += t;
              }
            };
            rec.onerror = function(){ listening=false; btn.classList.remove('rec'); };
            rec.onend = function(){
              btn.classList.remove('rec'); listening=false;
              if ((finalText||"").trim()){
                trySendToWidget(finalText.trim());
                setTimeout(readLastAssistantMessage, 2200);
              }
            };
            rec.start();
          }
          function stopRec(){ try{ rec && rec.stop(); }catch(e){} }

          var pressTimer=null, isHolding=false;
          btn.addEventListener('mousedown', function(){
            isHolding=true;
            pressTimer = setTimeout(function(){ if (isHolding) startRec(); }, 120);
          });
          ['mouseup','mouseleave','touchend','touchcancel'].forEach(function(ev){
            btn.addEventListener(ev, function(){
              isHolding=false; clearTimeout(pressTimer);
              if (listening) stopRec();
            });
          });
          btn.addEventListener('click', function(e){
            e.preventDefault(); if (!listening) startRec(); else stopRec();
          });
          btn.addEventListener('dblclick', function(e){
            e.preventDefault(); readLastAssistantMessage();
          });
        } catch(e){ console.error("Voice init error:", e); }
      });
    } catch(e){ console.error("Amy init error:", e); }
  }

  if (!window.FDC){ load(PLUGIN_URL, initAmy); } else { initAmy(); }
})();
