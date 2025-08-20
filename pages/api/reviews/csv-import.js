// pages/api/reviews/csv-import.js
import { assertAdmin } from '@/lib/auth';
import { promises as fs } from 'fs';
import formidable from 'formidable';
import { parse } from 'csv-parse/sync';
import { readReviews, writeReviews } from '@/lib/reviewsStore';

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

  const list = await readReviews();
  let created = 0, updated = 0;
  for (const r of records) {
    const id = r.id && String(r.id).trim() !== '' ? String(r.id) : null;
    const payload = {
      title: r.title || '',
      author: r.author || '',
      views: Number(r.views) || 0,
      createdAt: r.createdAt || new Date().toISOString(),
      content: r.content || '',
      imageUrl: r.imageUrl || ''
    };
    const idx = id ? list.findIndex((x)=>String(x.id)===String(id)) : -1;
    if (idx >= 0) { list[idx] = { ...list[idx], ...payload }; updated++; }
    else { list.unshift({ id: Date.now()+Math.floor(Math.random()*1000), ...payload }); created++; }
  }
  await writeReviews(list);
  res.status(200).json({ created, updated });
}
