/* BLSSNVJ21 static GitHub Pages service worker */
const CACHE = "blssnvj21-discharge-v11";
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
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
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
