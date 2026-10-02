// Serverless-Funktion fuer das Kontaktformular der Vereinsseite (/verein/kontakt.html).
// Laeuft bei Vercel unter /api/kontakt.
//
// WICHTIG: Diese Funktion versendet noch keine E-Mail. Sie prueft die Eingaben,
// schreibt die Anfrage in das Vercel-Log und gibt eine Vorgangsnummer zurueck.
// Zum echten Versand einen Dienst wie Resend, Postmark oder Brevo einbinden -
// die Stelle dafuer ist unten markiert.

const THEMEN = {
  mitgliedschaft: 'Mitglied werden',
  imkerkurs: 'Imkerkurs im Jahreslauf',
  patenschaft: 'Bienenpatenschaft',
  honig: 'Honig kaufen',
  schule: 'Termin fuer Schule oder Kita',
  schwarm: 'Schwarm melden',
  sonstiges: 'Etwas anderes'
};

const GRENZEN = { name: 80, email: 120, nachricht: 2000 };

// Bewusst einfach gehalten: faengt Tippfehler, ersetzt keine Zustellpruefung.
const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function alsText(wert, maximum) {
  return typeof wert === 'string' ? wert.trim().slice(0, maximum) : '';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ fehler: ['Nur POST ist erlaubt.'] });
  }

  // Vercel parst JSON-Koerper selbst; bei Formular-POST ohne JavaScript kommt ein String an.
  let eingabe = req.body;
  if (typeof eingabe === 'string') {
    try {
      eingabe = JSON.parse(eingabe);
    } catch {
      eingabe = Object.fromEntries(new URLSearchParams(eingabe));
    }
  }
  if (!eingabe || typeof eingabe !== 'object') {
    return res.status(400).json({ fehler: ['Die Anfrage enthielt keine Daten.'] });
  }

  // Honigfalle: ausgefuellt heisst Bot. Wir antworten freundlich, speichern aber nichts.
  if (alsText(eingabe.webseite, 200)) {
    return res.status(200).json({ vorgang: 'IV-000000', bestaetigtAn: 'deine Adresse' });
  }

  const name = alsText(eingabe.name, GRENZEN.name);
  const email = alsText(eingabe.email, GRENZEN.email);
  const nachricht = alsText(eingabe.nachricht, GRENZEN.nachricht);
  const thema = Object.prototype.hasOwnProperty.call(THEMEN, eingabe.thema) ? eingabe.thema : '';
  const einwilligung = eingabe.einwilligung === 'ja' || eingabe.einwilligung === true || eingabe.einwilligung === 'on';

  const fehler = [];
  if (name.length < 2) fehler.push('Bitte einen Namen mit mindestens zwei Zeichen angeben.');
  if (!EMAIL_MUSTER.test(email)) fehler.push('Die E-Mail-Adresse sieht nicht vollstaendig aus.');
  if (!thema) fehler.push('Bitte ein Thema aus der Liste waehlen.');
  if (nachricht.length < 10) fehler.push('Die Nachricht sollte mindestens zehn Zeichen lang sein.');
  if (!einwilligung) fehler.push('Ohne Einwilligung zur Speicherung koennen wir nicht antworten.');

  if (fehler.length) {
    return res.status(400).json({ fehler });
  }

  const vorgang = 'IV-' + Date.now().toString(36).slice(-4).toUpperCase() +
                  Math.random().toString(36).slice(2, 5).toUpperCase();

  // Landet in den Vercel-Logs (Dashboard > Projekt > Logs).
  console.log('Neue Vereinsanfrage', {
    vorgang,
    thema: THEMEN[thema],
    name,
    email,
    zeichen: nachricht.length,
    umgebung: process.env.VERCEL_ENV || 'lokal'
  });

  // --- Hier spaeter den E-Mail-Versand einhaengen, zum Beispiel:
  //
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'webseite@beispielverein.example',
  //     to: 'vorstand@beispielverein.example',
  //     reply_to: email,
  //     subject: `[${vorgang}] ${THEMEN[thema]} - ${name}`,
  //     text: nachricht
  //   })
  // });
  //
  // Den Schluessel als Umgebungsvariable RESEND_API_KEY im Vercel-Projekt hinterlegen,
  // nicht in den Quellcode schreiben.

  return res.status(200).json({
    vorgang,
    bestaetigtAn: email,
    thema: THEMEN[thema],
    eingegangen: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
  });
}
