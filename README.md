# Vercel-Übung

Kleines Übungsprojekt: eine statische Seite (`index.html`) und eine Serverfunktion (`api/hallo.js`).
Kein Build-Schritt, keine Pakete nötig.

```
index.html          Testseite, fragt /api/hallo
api/hallo.js        meldet Umgebung, Region, Commit
api/kontakt.js      nimmt das Kontaktformular der Beispielseite an
verein/             Beispielseite: Verein mit Start + 3 Unterseiten
  index.html          Startseite
  verein.html         Über den Verein
  kurse.html          Kurse & Angebote
  kontakt.html        Kontakt & Mitgliedschaft
  stil.css            gemeinsames Stylesheet aller vier Seiten
  bilder/             drei SVG-Illustrationen
```

## Beispielseite `/verein/`
Kompletter Auftritt eines **frei erfundenen** Imkervereins – Inhalte, Namen, Adressen und
Termine sind Platzhalter. Zu erreichen unter `/verein/`.

Das Kontaktformular sendet an `api/kontakt.js`. Die Funktion prüft die Eingaben, weist
Spam über ein verstecktes Feld ab und gibt eine Vorgangsnummer zurück. **Eine E-Mail wird
noch nicht verschickt** – die Anfrage landet nur im Vercel-Log (Dashboard → Projekt → Logs).
Im Quellcode ist markiert, wo ein Versanddienst (z. B. Resend) eingehängt wird; den
API-Schlüssel dann als Umgebungsvariable im Vercel-Projekt hinterlegen, nicht im Code.

## Deployen
1. Neues Repository auf GitHub anlegen (z. B. `vercel-uebung`) und diese Dateien hochladen.
2. Auf vercel.com mit GitHub anmelden → „Add New… → Project“ → Repository importieren.
3. Framework Preset: „Other“, alles andere so lassen → „Deploy“.

## Üben
- Text in `index.html` ändern, committen → Vercel deployt automatisch (Production).
- Neuen Branch anlegen, etwas ändern, pushen → eigene Preview-URL, Umgebung zeigt „preview“.
- Fehler einbauen (z. B. Tippfehler in `api/hallo.js`) → in Vercel unter Deployment → Logs ansehen.
- Formular auf `/verein/kontakt.html` abschicken → Eintrag in den Vercel-Logs suchen.

## Lokal ansehen
```
npx vercel dev      # mit API-Funktionen, http://localhost:3000
python -m http.server 8000   # nur die statischen Seiten, /api/* fehlt dann
```
