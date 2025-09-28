// amy-bundle.v1.js — komplet Amy i s pluginem
(async function () {
  function loadScript(src) {
    return new Promise((ok, err) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = ok;
      s.onerror = err;
      document.head.appendChild(s);
    });
  }

  // 1) načti plugin
  await loadScript("https://pelunkaj-dot.github.io/fdc-plugin/fdc-plugin.v1.js?v=8");

  // 2) inicializuj bublinu Amy
  if (typeof window.initBubble === "function") {
    window.initBubble({
      gatewayUrl: "https://fdc-gateway.vercel.app/api/chat",
      assistant: "amy",
      title: "Amy — angličtina",
      welcome: "Hi! Need quick help? Ask me anything.",
      voice: { enabled: false }
    });
    console.log("[Amy] Bubble launched");
  } else {
    console.error("[Amy] initBubble not found");
  }
})();
