// pages/api/reservations/[id].js
import { assertAdmin } from '@/lib/auth';
import { readReservations, writeReservations } from '@/lib/reservationsStore';

export default async function handler(req, res) {
  if (!['PUT','DELETE'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  if (!assertAdmin(req, res)) return;

  const { id } = req.query;
  const list = await readReservations();
  const idx = list.findIndex((r) => String(r.id) === String(id));
  if (idx < 0) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'PUT') {
    list[idx] = { ...list[idx], ...req.body };
    await writeReservations(list);
    return res.status(200).json(list[idx]);
  }
  if (req.method === 'DELETE') {
    list.splice(idx, 1);
    await writeReservations(list);
    return res.status(204).end();
  }
}
