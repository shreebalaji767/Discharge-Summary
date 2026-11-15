/* BLSSNVJ21 static GitHub Pages service worker */
const CACHE = "blssnvj21-discharge-v12";
const CACHE_PREFIX = "blssnvj21-discharge-";
const APP_ROOT = new URL("./", self.registration.scope);
const CORE_ASSETS = [
  APP_ROOT.href,
  new URL("static/style.css", APP_ROOT).href,
  new URL("static/js/core.js", APP_ROOT).href,
  new URL("static/js/app.js", APP_ROOT).href,
  new URL("static/manifest.webmanifest", APP_ROOT).href,
  new URL("static/icons/icon.svg", APP_ROOT).href
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // Cache each resource independently. Cache.addAll() is all-or-nothing:
    // one unavailable URL (often a temporary Pages navigation failure) rejects
    // the entire install and leaves the previous worker active.
    await Promise.allSettled(CORE_ASSETS.map(async assetUrl => {
      try {
        const response = await fetch(assetUrl, {cache: "no-store"});
        if (response && response.ok) {
          await cache.put(assetUrl, response);
        }
      } catch (_) {
        // A single missing/offline asset must not prevent SW installation.
      }
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(APP_ROOT.href)) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(APP_ROOT.href, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(APP_ROOT.href))));
    return;
  }

  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request)));
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
