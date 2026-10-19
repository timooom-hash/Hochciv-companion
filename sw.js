/* Offline-Cache für Hochzeivilization · Einkommen.

   Nach JEDER Änderung an einer Datei VERSION hochzählen – sonst behalten installierte
   Geräte die alte Fassung (es wird zuerst aus dem Cache geliefert).

   Eigener Namensraum: Alle Projektseiten eines GitHub-Kontos liegen auf derselben Adresse
   (<name>.github.io) und teilen sich damit den Cache-Speicher. Dieser Service Worker
   löscht deshalb nur Caches, die mit PREFIX beginnen – nie die des Spiels. */
const PREFIX = 'hzv-einkommen-';
const VERSION = PREFIX + 'v1';
const FILES = [
  './', './index.html', './style.css', './calc.js', './app.js', './manifest.webmanifest',
  './fonts/vollkorn-latin-wght-normal.woff2',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') {
        const page = (await cache.match('./index.html')) || (await cache.match('./'));
        if (page) return page;
      }
      throw err;
    }
  })());
});

/* Selbstheilung: Das Spiel (sw.js bis v86) löscht bei jedem eigenen Update ALLE anderen
   Caches derselben Adresse, also auch diesen. Die Seite meldet sich bei jedem Start mit
   „heal"; fehlt dann etwas, wird es nachgeladen, solange Netz da ist. */
self.addEventListener('message', e => {
  if (e.data !== 'heal') return;
  e.waitUntil(caches.open(VERSION).then(async c => {
    for (const f of FILES) {
      if (await c.match(f)) continue;
      try { await c.add(f); } catch (err) { /* offline – beim nächsten Start wieder */ }
    }
  }));
});
