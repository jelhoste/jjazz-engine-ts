// Service worker : met en cache l'application pour un fonctionnement hors ligne (toutes les données sont dans app.js)
const CACHE = 'jjswing-722d42e1d2';
const FILES = ['./', 'index.html', 'app.js', 'manifest.webmanifest', 'icon.svg', 'spessa.js', 'spessasynth_processor.min.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
// Les requêtes vers d'autres sites (la SoundFont sur GitHub Pages, conservée dans IndexedDB par la page) ne passent pas par ce cache
self.addEventListener('fetch', (e) => { if (new URL(e.request.url).origin !== self.location.origin) return; e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))); });
