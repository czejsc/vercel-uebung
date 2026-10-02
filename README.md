# Vercel-Übung

Kleines Übungsprojekt: eine statische Seite (`index.html`) und eine Serverfunktion (`api/hallo.js`).
Kein Build-Schritt, keine Pakete nötig.

## Deployen
1. Neues Repository auf GitHub anlegen (z. B. `vercel-uebung`) und diese Dateien hochladen.
2. Auf vercel.com mit GitHub anmelden → „Add New… → Project“ → Repository importieren.
3. Framework Preset: „Other“, alles andere so lassen → „Deploy“.

## Üben
- Text in `index.html` ändern, committen → Vercel deployt automatisch (Production).
- Neuen Branch anlegen, etwas ändern, pushen → eigene Preview-URL, Umgebung zeigt „preview“.
- Fehler einbauen (z. B. Tippfehler in `api/hallo.js`) → in Vercel unter Deployment → Logs ansehen.
