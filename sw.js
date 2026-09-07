// Eigener Cache-Name: Test und Produktiv liegen auf derselben Origin
// (markusesser167.github.io) und teilen sich den Cache-Speicher.
const CACHE = 'wego-unfallapp-test-v3';
const CACHE_PREFIX = 'wego-unfallapp-test-';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './ndl.json',
  './stapler.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      // Nur eigene Altbestaende loeschen - sonst nimmt diese App der
      // Produktivversion auf demselben Geraet die Offlinefaehigkeit.
      Promise.all(keys.filter(k => k.indexOf(CACHE_PREFIX) === 0 && k !== CACHE)
                      .map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Stammdaten immer zuerst aus dem Netz holen, damit Aenderungen an
  // ndl.json und stapler.json ohne neue App-Version ankommen; offline
  // aus dem Cache.
  // In der TESTVERSION zusaetzlich die App selbst netzwerk-zuerst holen:
  // sonst liefert der Cache nach jeder Aenderung weiter den alten Stand
  // und man testet unbemerkt gegen eine veraltete Fassung. Offline
  // greift wie gehabt der Cache. In der Produktivfassung bleibt es bei
  // Cache-zuerst - dort zaehlt Startgeschwindigkeit und Offlinebetrieb.
  const netzZuerst =
        e.request.mode === 'navigate'
     || e.request.url.indexOf('index.html') !== -1
     || e.request.url.indexOf('ndl.json') !== -1
     || e.request.url.indexOf('stapler.json') !== -1;
  if (netzZuerst) {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
