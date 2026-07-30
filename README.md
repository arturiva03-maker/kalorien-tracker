# Brennwert* — Kalorientagebuch

Simpler Kalorientracker: **Nährwerttabelle abfotografieren → Werte werden erkannt → Portion eintragen → fertig.**

- Etikett-Scan per Kamera, Texterkennung (deutsch) läuft komplett im Browser (Tesseract.js, kein API-Key, keine Server-Verarbeitung)
- Tagesbilanz im Stil einer EU-Nährwerttabelle (Energie, Fett, KH, Zucker, Eiweiß, Salz)
- Gescannte Produkte werden gemerkt und sind mit zwei Taps wieder eintragbar
- Verlauf der letzten 14 Tage, Tagesziel einstellbar
- Alle Daten bleiben lokal im Browser (localStorage), Backup als JSON-Export/-Import

## Hinweise

- Beim allerersten Scan lädt die Texterkennung einmalig ~10 MB Sprachdaten (wird gecacht).
- Etikett möglichst formatfüllend, gerade und bei gutem Licht fotografieren; nicht erkannte Felder sind rot markiert und lassen sich von Hand korrigieren.

## Deployment

Statisches Projekt (eine `index.html`, kein Build). Deployt auf Vercel via GitHub-Integration:
`git push` auf `main` → Vercel deployt automatisch.
