// pages/api/reservations/csv-import.js
import { assertAdmin } from '@/lib/auth';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { readReservations, writeReservations } from '@/lib/reservationsStore';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!assertAdmin(req, res)) return;

  const form = formidable({ multiples: false });
  const { files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => err ? reject(err) : resolve({ fields, files }));
  });

  const file = files.file;
  if (!file) return res.status(400).json({ error: 'file field required' });

  const text = await fs.readFile(file.filepath, 'utf8');
  const records = parse(text, { columns: true, skip_empty_lines: true });

  const list = await readReservations();
  let created = 0, updated = 0;
  for (const r of records) {
    const id = r.id && String(r.id).trim() !== '' ? String(r.id) : null;
    const payload = {
      name: r.name || '', gender: r.gender || '', phone: r.phone || '',
      vehicle: r.vehicle || '', city: r.city || '', status: r.status || '',
      stateChange: r.stateChange || '', createdAt: r.createdAt || new Date().toISOString(),
      note: r.note || ''
    };
    const idx = id ? list.findIndex((x)=>String(x.id)===String(id)) : -1;
    if (idx >= 0) { list[idx] = { ...list[idx], ...payload }; updated++; }
    else { list.unshift({ id: Date.now()+Math.floor(Math.random()*1000), ...payload }); created++; }
  }
  await writeReservations(list);
  res.status(200).json({ created, updated });
}
