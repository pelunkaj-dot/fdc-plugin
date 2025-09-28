/* fdc-plugin.v1.js — FajnDoučko Chat Bubble (scroll fix, fast)
   - endpoint: https://fdc-gateway.vercel.app  (bez /api/chat)
   - assistant: 'nela'
   - autoscroll + správné overflow i ve flex kontejnerech (min-height:0)
*/
(function () {
  "use strict";

  const DEFAULTS = {
    selector: null,
    endpoint: "https://fdc-gateway.vercel.app", // základ bez /api/chat
    assistant: "nela",
    title: "FajnDoučko · Nela",
    greeting: "Ahoj, jsem Nela. S čím ti dnes pomůžu?",
    placeholder: "Napiš dotaz a stiskni Enter…",
    position: { right: 20, bottom: 20 },
    openOnLoad: false,
    withCredentials: false,
    headers: { "Content-Type": "application/json" },
    theme: { zIndex: 9999, width: 360, height: 520 }
  };

  // ---- CSS (scroll fix: min-height:0; overflow-y:auto; iOS momentum) ----
  function injectCss() {
    if (document.getElementById("fdc-plugin-css")) return;
    const css = `
.fdc-btn{position:fixed;display:flex;align-items:center;justify-content:center;
  width:56px;height:56px;border-radius:50%;box-shadow:0 6px 18px rgba(0,0,0,.2);
  cursor:pointer;font-size:24px;user-select:none;background:#0ea5e9;color:#fff}
.fdc-panel{position:fixed;background:#fff;border-radius:16px;box-shadow:0 18px 40px rgba(0,0,0,.25);
  display:none;flex-direction:column;overflow:hidden}
.fdc-header{padding:12px 16px;background:#0ea5e9;color:#fff;font-weight:600;display:flex;
  align-items:center;justify-content:space-between}
.fdc-close{cursor:pointer;font-size:18px;opacity:.9}
.fdc-body{flex:1;display:flex;flex-direction:column;background:#f8fafc;min-height:0} /* <-- DŮLEŽITÉ */
.fdc-log{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px;min-height:0;
  -webkit-overflow-scrolling:touch;overscroll-behavior:contain;scrollbar-gutter:stable}
.fdc-msg{margin:8px 0;max-width:86%}
.fdc-msg.user{margin-left:auto;background:#e2e8f0}
.fdc-msg.bot{margin-right:auto;background:#ffffff}
.fdc-bubble{padding:10px 12px;border-radius:12px;line-height:1.35;white-space:pre-wrap;word-wrap:break-word;
  border:1px solid #e5e7eb}
.fdc-input{display:flex;gap:8px;padding:12px;border-top:1px solid #e5e7eb;background:#fff}
.fdc-input input{flex:1;padding:10px 12px;border:1px solid #cbd5e1;border-radius:10px;font-size:14px;min-width:0}
.fdc-input button{padding:10px 14px;border:0;background:#0ea5e9;color:#fff;border-radius:10px;cursor:pointer}
.fdc-badge{position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border-radius:10px;font-size:11px;padding:2px 6px}
.fdc-error{color:#b91c1c;white-space:pre-wrap}
`;
    const el = document.createElement("style");
    el.id = "fdc-plugin-css";
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ---- helpers ----
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, txt) { const e=document.createElement(tag); if(cls)e.className=cls; if(txt!=null)e.textContent=txt; return e; }
  function setPos(node, pos) { node.style.right=(pos.right||20)+"px"; node.style.bottom=(pos.bottom||20)+"px"; }
  function scrollToBottom(container) { container.scrollTop = container.scrollHeight; }

  function addMsg(container, who, text, isError) {
    const wrap = el("div", "fdc-msg " + (who === "user" ? "user" : "bot"));
    const bubble = el("div", "fdc-bubble" + (isError ? " fdc-error" : ""));
    bubble.textContent = text;
    wrap.appendChild(bubble);
    container.appendChild(wrap);
    // autoscroll (bez animace – jistota i na slabších zařízeních)
    scrollToBottom(container);
  }

  async function sendMsg(cfg, text) {
    const url = cfg.endpoint.replace(/\/$/, "") + "/api/chat";
    const payload = { assistant: cfg.assistant, message: text };

    const r = await fetch(url, {
      method: "POST",
      headers: cfg.headers || {},
      body: JSON.stringify(payload),
      credentials: cfg.withCredentials ? "include" : "omit"
    });

    const raw = await r.text().catch(() => "");
    if (!r.ok) {
      let msg = r.statusText || "Unknown error";
      try { const j = JSON.parse(raw || "{}"); msg = j.error || j.message || msg; } catch (_) { if (raw) msg = raw; }
      const err = new Error(`Chyba serveru: ${r.status} — ${msg}`);
      err.responseText = raw;
      throw err;
    }
    try { return JSON.parse(raw); } catch (_) { throw new Error("Neplatná JSON odpověď z gateway."); }
  }

  // ---- UI ----
  function mountWidget(userOpts) {
    injectCss();
    const cfg = Object.assign({}, DEFAULTS, userOpts || {});
    const root = cfg.selector ? $(cfg.selector) : document.body;
    if (!root) throw new Error("FDC: Nenalezen cílový element pro widget.");

    const btn = el("div", "fdc-btn", "💬");
    setPos(btn, cfg.position);
    btn.style.zIndex = String(cfg.theme.zIndex);

    const badge = el("div", "fdc-badge", "1");
    btn.appendChild(badge);

    const panel = el("div", "fdc-panel");
    panel.style.width = cfg.theme.width + "px";
    panel.style.height = cfg.theme.height + "px";
    setPos(panel, { right: (cfg.position.right || 20) + 70, bottom: (cfg.position.bottom || 20) });
    panel.style.zIndex = String(cfg.theme.zIndex);

    const header = el("div", "fdc-header");
    header.appendChild(el("div", null, cfg.title));
    const close = el("div", "fdc-close", "×");
    header.appendChild(close);

    const body = el("div", "fdc-body"); // min-height:0 v CSS = klíč ke scrollu
    const log = el("div", "fdc-log");
    const inputWrap = el("div", "fdc-input");
    const input = el("input"); input.type="text"; input.placeholder = cfg.placeholder;
    const btnSend = el("button", null, "Odeslat");

    inputWrap.appendChild(input);
    inputWrap.appendChild(btnSend);

    body.appendChild(log);
    body.appendChild(inputWrap);

    panel.appendChild(header);
    panel.appendChild(body);

    root.appendChild(btn);
    root.appendChild(panel);

    // stav
    let open = false;
    function openPanel() {
      open = true;
      panel.style.display = "flex";
      badge.style.display = "none";
      if (!panel.dataset.greeted) {
        addMsg(log, "bot", cfg.greeting);
        panel.dataset.greeted = "1";
      }
      // jistota scrollu při otevření (když už je v logu víc zpráv)
      requestAnimationFrame(() => scrollToBottom(log));
      input.focus();
    }
    function closePanel() { open = false; panel.style.display = "none"; }

    btn.addEventListener("click", () => open ? closePanel() : openPanel());
    close.addEventListener("click", closePanel);

    async function handleSend() {
      const text = (input.value || "").trim();
      if (!text) return;
      addMsg(log, "user", text);
      input.value = "";
      try {
        const data = await sendMsg(cfg, text);
        const reply = data && data.reply ? data.reply : "(prázdná odpověď)";
        addMsg(log, "bot", reply);
      } catch (e) {
        addMsg(log, "bot", String(e.message || e), true);
        console.error("sendMsg", e);
      }
    }
    input.addEventListener("keydown", (ev) => { if (ev.key === "Enter") handleSend(); });
    btnSend.addEventListener("click", handleSend);

    if (cfg.openOnLoad) openPanel();

    // Public API
    return {
      open: openPanel,
      close: closePanel,
      setAssistant: (slug) => { cfg.assistant = String(slug || "").trim() || "nela"; },
      setEndpoint: (url) => { cfg.endpoint = url; }
    };
  }

  const FDC = {
    init(opts) { try { return mountWidget(opts || {}); } catch (e) { console.error("FDC.init error:", e); } },
    ask({ endpoint = DEFAULTS.endpoint, assistant = DEFAULTS.assistant, message, headers = DEFAULTS.headers, withCredentials = false } = {}) {
      return sendMsg({ endpoint, assistant, headers, withCredentials }, String(message || ""));
    }
  };
  if (!window.FDC) window.FDC = FDC;
})();
