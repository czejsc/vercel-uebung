// Serverless-Funktion: läuft bei Vercel unter /api/hallo
export default function handler(req, res) {
  const umgebung = process.env.VERCEL_ENV || 'lokal';
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    nachricht: 'Hallo vom Server!',
    zeit: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
    umgebung, // production, preview oder development
    region: process.env.VERCEL_REGION || 'unbekannt',
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || 'kein Git',
    branch: process.env.VERCEL_GIT_COMMIT_REF || 'kein Git'
  });
}
