// amy-bundle.v1.js — self-loading init for Amy (safe against load order)
(function () {
  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Failed to load " + src)); };
      document.head.appendChild(s);
    });
  }

  function initAmy() {
    if (typeof window.initBubble !== "function") {
      console.error("[Amy] initBubble not available even after plugin load.");
      return;
    }
    window.initBubble({
      gatewayUrl: "https://fdc-gateway.vercel.app/api/chat",
      assistant: "amy",
      title: "Amy — angličtina",
      welcome: "Hi! Need quick help? Ask me anything.",
      voice: { enabled: false } // hlas vypneme, doladíme později
    });
  }

  onReady(async function () {
    try {
      if (typeof window.initBubble !== "function") {
        await loadScript("https://pelunkaj-dot.github.io/fdc-plugin/fdc-plugin.v1.js?v=8");
      }
      initAmy();
    } catch (e) {
      console.error("[Amy] Loader error:", e);
    }
  });
})();
