chrome.runtime.onMessage.addListener((message) => {
  if (message.target !== "offscreen" || message.action !== "playChime") return;

  const audio = new Audio(chrome.runtime.getURL("sounds/notify.wav"));
  audio.volume = 0.85;
  audio.play().catch((error) => {
    console.warn("Zil sesi çalınamadı:", error?.message || error);
  });
});
