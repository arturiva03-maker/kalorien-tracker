/* Brennwert — Service Worker
   App-Shell offline verfügbar halten, ohne dabei Updates zu blockieren.

   Strategie:
   · Navigation  → Netz zuerst, bei Fehler die gecachte index.html
   · eigene Dateien → Cache zuerst, im Hintergrund aktualisieren
   · CDN (Fonts, Tesseract) → Cache zuerst, die URLs sind versioniert

   VERSION hochzählen, wenn sich die Shell ändert — beim Aktivieren
   werden alle Caches mit abweichender Version gelöscht. */

const VERSION = 'v1';
const SHELL   = `brennwert-shell-${VERSION}`;
const RUNTIME = `brennwert-runtime-${VERSION}`;

const SHELL_ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

/* Fremd-Hosts, deren Antworten dauerhaft gecacht werden dürfen.
   Alle liefern versionierte bzw. unveränderliche URLs aus. */
const CDN_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'tessdata.projectnaptha.com',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL).then(c => c.addAll(SHELL_ASSETS))
  );
  // kein skipWaiting: die neue Version wartet, bis der Nutzer im
  // Update-Banner zustimmt — sonst tauscht sich die App unter
  // laufender Eingabe aus.
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

/* ── Strategien ───────────────────────────── */

async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(SHELL);
      cache.put('./index.html', fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match('./index.html', {ignoreSearch: true});
    return cached || new Response(
      '<meta charset="utf-8"><p style="font:16px system-ui;padding:2rem">Offline und nichts im Cache.</p>',
      {status: 503, headers: {'Content-Type': 'text/html; charset=utf-8'}}
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then(res => {
    // opaque (no-cors) Antworten haben status 0 — trotzdem brauchbar
    if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
    return res;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;   // chrome-extension: etc.

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, SHELL));
    return;
  }
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME));
  }
});
