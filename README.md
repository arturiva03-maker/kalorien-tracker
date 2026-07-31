# Brennwert* — Kalorientagebuch

Simpler Kalorientracker: **Nährwerttabelle abfotografieren → Werte werden erkannt → Portion eintragen → fertig.**

- Etikett-Scan per Kamera, Texterkennung (deutsch) läuft komplett im Browser (Tesseract.js, kein API-Key, keine Server-Verarbeitung)
- Tagesbilanz im Stil einer EU-Nährwerttabelle (Energie, Fett, KH, Zucker, Eiweiß, Salz)
- Produkte landen nur in der Bibliothek, wenn man „In Produkte speichern" antippt — beim Scan wie beim manuellen Eintrag
- Tageseinträge antippen zeigt alle Nährwerte (Portion und pro 100 g) und übernimmt sie auf Wunsch in die Produkte
- Verlauf der letzten 14 Tage, Tagesziel einstellbar
- Alle Daten bleiben lokal im Browser (localStorage), Backup als JSON-Export/-Import

## Hinweise

- Beim allerersten Scan lädt die Texterkennung einmalig ~10 MB Sprachdaten (wird gecacht).
- Etikett möglichst formatfüllend, gerade und bei gutem Licht fotografieren; nicht erkannte Felder sind rot markiert und lassen sich von Hand korrigieren.

## sw.js

Kein Offline-Cache mehr. Die Datei enthält nur noch einen Abschalt-Worker, der
sich in Browsern, die den früheren Service Worker installiert haben, selbst
abmeldet und dessen Caches löscht. Sie kann gelöscht werden, sobald alle Geräte
die App einmal online aufgerufen haben.

## Deployment

Statisches Projekt (eine `index.html`, kein Build). Deployt auf Vercel via GitHub-Integration:
`git push` auf `main` → Vercel deployt automatisch.
