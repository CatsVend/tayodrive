// pages/api/public/faq.js
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  try {
    const items = await prisma.fAQ.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    res.status(200).json({ ok: true, items });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Failed to fetch FAQ' });
  }
}
