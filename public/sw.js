// __BUILD_VERSION__ is replaced at build time by Vite plugin
const CACHE_NAME = "__BUILD_VERSION__";
const PRECACHE_URLS = "__PRECACHE_URLS__";
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
    caches.keys().then(keys =>
      Promise.all(
        keys.map(async key => {
          if (key !== CACHE_NAME) return caches.delete(key);
          const cache = await caches.open(key);
          const requests = await cache.keys();
          await Promise.all(
            requests
              .filter(request => {
                const url = new URL(request.url);
                return (
                  url.origin !== self.location.origin ||
                  url.pathname.startsWith("/api/") ||
                  url.pathname.startsWith("/v1/") ||
                  url.pathname.startsWith("/auth") ||
                  url.pathname.startsWith("/account")
                );
              })
              .map(request => cache.delete(request))
          );
        })
      )
    )
  );
  self.clients.claim();
});

function networkFirst(request, fallbackUrl, cacheKey) {
  return fetch(request)
    .then(response => {
      if (!response.ok) return response;
      const clone = response.clone();
      caches
        .open(CACHE_NAME)
        .then(cache => cache.put(cacheKey ?? request, clone));
      return response;
    })
    .catch(() =>
      caches
        .match(cacheKey ?? request)
        .then(
          cached => cached ?? (fallbackUrl ? caches.match(fallbackUrl) : null)
        )
        .then(cached => cached ?? new Response("Offline", { status: 503 }))
    );
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
  if (request.method !== "GET") return;
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/v1/") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/account")
  )
    return;

  // localhost: always network-first
  if (isLocalhost) {
    event.respondWith(
      networkFirst(request, request.mode === "navigate" ? "/" : undefined)
    );
    return;
  }

  // Network-first for app shell and data files (always want fresh content)
  if (request.mode === "navigate") {
    event.respondWith(
      networkFirst(request, request.mode === "navigate" ? "/" : undefined)
    );
    return;
  }

  if (url.pathname.startsWith("/data/")) {
    event.respondWith(networkFirst(request, undefined, url.pathname));
    return;
  }

  // Cache-first for static assets (production only)
  event.respondWith(cacheFirst(request));
});
