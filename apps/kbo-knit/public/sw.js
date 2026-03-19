// __BUILD_VERSION__ is replaced at build time by Vite plugin
const CACHE_NAME = "__BUILD_VERSION__";
const PRECACHE_URLS = ["/", "/favicon.svg"];
const isLocalhost =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

function networkFirst(request) {
  return fetch(request)
    .then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      return response;
    })
    .catch(() => caches.match(request));
}

function cacheFirst(request) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response.ok && request.method === "GET") {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      }
      return response;
    });
  });
}

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle http(s) requests
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // localhost: always network-first
  if (isLocalhost) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Network-first for data files (always want fresh game results)
  if (request.url.includes("/data/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets (production only)
  event.respondWith(cacheFirst(request));
});
