# Brennwert* — Kalorientagebuch

Simpler Kalorientracker: **Nährwerttabelle abfotografieren → Werte werden erkannt → Portion eintragen → fertig.**

- Etikett-Scan per Kamera, Texterkennung (deutsch) läuft komplett im Browser (Tesseract.js, kein API-Key, keine Server-Verarbeitung)
- Tagesbilanz im Stil einer EU-Nährwerttabelle (Energie, Fett, KH, Zucker, Eiweiß, Salz)
- Eingebaute Lebensmittel-Datenbank mit über 400 Einträgen — Suche läuft sofort und ohne Netz
- Optionale Online-Suche bei Open Food Facts für Markenprodukte
- Produkte landen nur in der Bibliothek, wenn man „In Produkte speichern" antippt — beim Scan wie beim manuellen Eintrag
- Tageseinträge antippen zeigt alle Nährwerte (Portion und pro 100 g) und übernimmt sie auf Wunsch in die Produkte
- Verlauf der letzten 14 Tage, Tagesziel einstellbar
- Alle Daten bleiben lokal im Browser (localStorage), Backup als JSON-Export/-Import

## Hinweise

- Beim allerersten Scan lädt die Texterkennung einmalig ~10 MB Sprachdaten (wird gecacht).
- Etikett möglichst formatfüllend, gerade und bei gutem Licht fotografieren; nicht erkannte Felder sind rot markiert und lassen sich von Hand korrigieren.

## Lebensmittel-Datenbank

`foods.js` enthält rund 420 Einträge in 18 Kategorien, als kompakte Arrays:
`[Name, kcal, Fett, Kohlenhydrate, Zucker, Eiweiß]` je 100 g, ein optionales
siebtes Element `'ml'` markiert Getränke. Das sind **Durchschnittswerte für
unverarbeitete Lebensmittel**, keine Etikettenangaben — Sorte, Reifegrad und
Zubereitung schwanken deutlich. Für Markenprodukte ist der Etikett-Scan oder
die Online-Suche genauer.

Die Suche normalisiert Umlaute und Akzente, „kase" findet also „Käse". Treffer
werden nach Trefferqualität sortiert (exakt > Präfix > Wortpräfix > enthalten).

### Online-Suche

Open Food Facts über `de.openfoodfacts.org/cgi/search.pl`. Nur diese Domain
liefert die nötigen CORS-Header — über `world.` und die v2-API scheitern
Browser-Anfragen.

Die API erlaubt **10 Suchen pro Minute und IP**, deshalb:

- kein Suchen-beim-Tippen, nur auf Knopfdruck
- mindestens 6,5 s Abstand zwischen zwei Anfragen, Zeitstempel im localStorage
  (nicht nur im Speicher, sonst umgeht ein Reload die Bremse)
- Antworten werden zwischengespeichert, die letzten 60 Suchbegriffe

Daten von [Open Food Facts](https://de.openfoodfacts.org), lizenziert unter
[ODbL](https://opendatacommons.org/licenses/odbl/). Bei Weiterverwendung der
Daten muss diese Nennung erhalten bleiben.

## sw.js

Kein Offline-Cache mehr. Die Datei enthält nur noch einen Abschalt-Worker, der
sich in Browsern, die den früheren Service Worker installiert haben, selbst
abmeldet und dessen Caches löscht. Sie kann gelöscht werden, sobald alle Geräte
die App einmal online aufgerufen haben.

## Deployment

Statisches Projekt (eine `index.html`, kein Build). Deployt auf Vercel via GitHub-Integration:
`git push` auf `main` → Vercel deployt automatisch.
