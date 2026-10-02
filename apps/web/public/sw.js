// Service worker mínimo: só precisa existir e responder a `fetch` para o
// Chrome/Android considerar o site "instalável" (critério de PWA). Não faz
// cache agressivo pra não servir bundles JS desatualizados depois de deploys.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
