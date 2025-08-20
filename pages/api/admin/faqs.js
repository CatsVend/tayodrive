// pages/api/admin/faqs.js
import { readFaqs, writeFaqs, makeId } from '@/lib/faqsStore';
import cookie from 'cookie';

function auth(req) {
  const hdr = req.headers['x-admin-token'];
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = hdr || cookies['admin_token'];
  return token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
}

export default async function handler(req, res) {
  if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const faqs = await readFaqs();
    return res.status(200).json(faqs);
  }

  if (req.method === 'POST') {
    const { icon = '❓', q, a } = req.body || {};
    if (!q || !a) return res.status(400).json({ error: 'q and a are required' });
    const faqs = await readFaqs();
    const item = { id: makeId(), icon: String(icon), q: String(q), a: String(a) };
    faqs.unshift(item);
    await writeFaqs(faqs);
    return res.status(201).json(item);
  }

  if (req.method === 'PUT') {
    const { id, icon, q, a } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required' });
    const faqs = await readFaqs();
    const idx = faqs.findIndex(f => f.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    faqs[idx] = {
      ...faqs[idx],
      ...(icon !== undefined ? { icon: String(icon) } : {}),
      ...(q !== undefined ? { q: String(q) } : {}),
      ...(a !== undefined ? { a: String(a) } : {}),
    };
    await writeFaqs(faqs);
    return res.status(200).json(faqs[idx]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id query is required' });
    const faqs = await readFaqs();
    const next = faqs.filter(f => f.id !== id);
    if (next.length === faqs.length) return res.status(404).json({ error: 'Not found' });
    await writeFaqs(next);
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
