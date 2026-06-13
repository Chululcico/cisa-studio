var CACHE = 'cisa-v1';
var URLS = ['admin.html', 'barberia.html', 'manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(URLS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) { return Promise.all(ks.map(function(k) { if (k !== CACHE) return caches.delete(k); })); }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.startsWith('file://')) return;
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request).catch(function() { return caches.match('admin.html'); }); })
  );
});
