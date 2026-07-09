const CACHE_NAME = 'gmp-checklist-cache-v1';
const assetsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'
];

// Install Service Worker dan simpan file utama ke cache internal browser
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(assetsToCache);
    })
    .then(() => self.skipWaiting())
  );
});

// Aktivasi Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi Cache: Coba ambil data dari network, jika offline langsung alihkan ke cache lokal
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
