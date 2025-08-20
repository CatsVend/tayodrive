// pages/api/reservations/index.js
import { assertAdmin } from '@/lib/auth';
import { readReservations, addReservation } from '@/lib/reservationsStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const list = await readReservations();
    return res.status(200).json(list);
  }
  if (req.method === 'POST') {
    if (!assertAdmin(req, res)) return;
    const item = await addReservation(req.body || {});
    return res.status(201).json(item);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
