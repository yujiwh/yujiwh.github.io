const CACHE = 'spklu-v1';
const URLS = [
  '/spklu/',
  '/spklu/index.html',
  '/spklu/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://a.basemaps.cartocdn.com/dark_all/10/841/511.png',
  'https://b.basemaps.cartocdn.com/dark_all/10/842/511.png',
  'https://c.basemaps.cartocdn.com/dark_all/10/843/511.png',
  'https://d.basemaps.cartocdn.com/dark_all/10/841/512.png',
  'https://a.basemaps.cartocdn.com/dark_all/10/842/512.png'
];

// Install - cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(r => {
        // Cache successful responses
        if (r.ok) {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
