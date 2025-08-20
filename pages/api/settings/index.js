// pages/api/settings/index.js
import { assertAdmin } from '@/lib/auth';
import { readSettings, writeSettings } from '@/lib/settingsStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const s = await readSettings();
    return res.status(200).json(s);
  }
  if (req.method === 'PUT') {
    if (!assertAdmin(req, res)) return;
    await writeSettings(req.body || {});
    return res.status(200).json({ ok: true });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
