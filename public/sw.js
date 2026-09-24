const CACHE = "sae-pwa-4";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.startsWith("/__vite") ||
    url.search.includes("t=")
  ) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }

  if (/\.(png|jpe?g|webp|gif|svg|mp4|mp3|woff2?)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh.ok && fresh.type === "basic") cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return (await cache.match(req)) || new Response("offline", { status: 503, headers: { "content-type": "text/plain" } });
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const fresh = await fetch(req);
  if (fresh.ok && fresh.type === "basic") cache.put(req, fresh.clone());
  return fresh;
}
