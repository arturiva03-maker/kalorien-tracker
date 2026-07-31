# Brennwert* — Kalorientagebuch

Simpler Kalorientracker: **Nährwerttabelle abfotografieren → Werte werden erkannt → Portion eintragen → fertig.**

- Etikett-Scan per Kamera, Texterkennung (deutsch) läuft komplett im Browser (Tesseract.js, kein API-Key, keine Server-Verarbeitung)
- Tagesbilanz im Stil einer EU-Nährwerttabelle (Energie, Fett, KH, Zucker, Eiweiß, Salz)
- Produkte landen nur in der Bibliothek, wenn man „In Produkte speichern" antippt — beim Scan wie beim manuellen Eintrag
- Tageseinträge antippen zeigt alle Nährwerte (Portion und pro 100 g) und übernimmt sie auf Wunsch in die Produkte
- Verlauf der letzten 14 Tage, Tagesziel einstellbar
- Alle Daten bleiben lokal im Browser (localStorage), Backup als JSON-Export/-Import
- Installierbar als PWA, läuft nach dem ersten Aufruf offline

## Hinweise

- Beim allerersten Scan lädt die Texterkennung einmalig ~10 MB Sprachdaten (wird gecacht).
- Etikett möglichst formatfüllend, gerade und bei gutem Licht fotografieren; nicht erkannte Felder sind rot markiert und lassen sich von Hand korrigieren.

## Offline / Service Worker

`sw.js` cacht die App-Shell. Navigationen laufen Netz-zuerst (Updates kommen also
sofort an), alles andere Cache-zuerst mit Hintergrund-Aktualisierung. Schriften und
Tesseract werden beim ersten Besuch vom CDN in den Runtime-Cache übernommen.

Ändert sich die Shell, **`VERSION` in `sw.js` hochzählen** — beim Aktivieren werden
alle Caches mit abweichender Version gelöscht. Die neue Fassung übernimmt nicht
von selbst, sondern meldet sich als Banner; erst ein Klick auf „Neu laden" schaltet um.

Zum lokalen Testen braucht es echtes HTTP, unter `file://` gibt es keine Service Worker:

```
python -m http.server 8080
```

Festhängender Cache lässt sich in den DevTools unter Application → Service Workers
mit „Unregister" plus „Clear storage" auflösen.

## Deployment

Statisches Projekt (eine `index.html`, kein Build). Deployt auf Vercel via GitHub-Integration:
`git push` auf `main` → Vercel deployt automatisch.
