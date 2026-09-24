self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Present so a phone can install. Do not intercept loads — that was stalling the popped-out window.
self.addEventListener("fetch", () => {});
