// amy-bundle.v1.js — čistá init konfigurace pro Amy (bez voice)
(function () {
  // Počkej, než je plugin načtený
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    if (typeof window.initBubble !== "function") {
      console.error("[Amy] fdc-plugin není načten (initBubble nenalezen).");
      return;
    }

    // Inicializace AMY
    window.initBubble({
      gatewayUrl: "https://fdc-gateway.vercel.app/api/chat",
      assistant: "amy",
      title: "Amy — angličtina",
      welcome: "Hi! Need quick help? Ask me anything.",
      voice: { enabled: false } // hlas vypnutý – doladíme později
    });
  });
})();
