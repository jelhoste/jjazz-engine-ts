// Service worker : met en cache l'application pour un fonctionnement hors ligne (toutes les données sont dans app.js)
const CACHE = 'jjswing-4c6972df06';
const FILES = ['./', 'index.html', 'app.js', 'manifest.webmanifest', 'icon.svg', 'spessa.js', 'spessasynth_processor.min.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
// Les requêtes vers d'autres sites (la SoundFont sur GitHub Pages, conservée dans IndexedDB par la page) ne passent pas par ce cache.
// Pour le reste : le réseau d'abord (revalidé, 4 s maximum) pour qu'une version mise en ligne apparaisse au rechargement suivant ; sans réseau, le cache.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  const fresh = new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('lent')), 4000);
    fetch(e.request.url, { cache: 'no-cache' }).then((r) => { clearTimeout(t); res(r); }, (err) => { clearTimeout(t); rej(err); });
  });
  e.respondWith(fresh.then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((ch) => ch.put(e.request, c)).catch(() => undefined); } return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
