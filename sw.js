/* Brennwert — Abschalt-Worker
   ────────────────────────────────────────────────────────────────
   Diese Datei ersetzt den früheren Offline-Cache. Sie existiert nur
   noch, um sich selbst zu entfernen: Browser, die den alten Service
   Worker schon installiert haben, holen sich beim nächsten Aufruf
   diese Fassung, löschen ihre Caches und melden die Registrierung ab.

   Sie hat bewusst KEINEN fetch-Handler — jede Anfrage geht direkt
   ans Netz, die App verhält sich also wieder wie vorher.

   Kann gelöscht werden, sobald alle Geräte die App einmal online
   aufgerufen haben. Danach ist ein 404 auf sw.js unproblematisch,
   die Registrierung ist dann bereits weg. */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) await caches.delete(key);
    await self.registration.unregister();
  })());
});
