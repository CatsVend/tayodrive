// pages/api/reservations/csv.js
import { assertAdmin } from '@/lib/auth';
import { readReservations } from '@/lib/reservationsStore';
import { toCSV } from '@/lib/storeBase';

export default async function handler(req, res) {
  if (!assertAdmin(req, res)) return;
  const rows = await readReservations();
  const headers = ['id','name','gender','phone','vehicle','city','status','stateChange','createdAt','note'];
  const csv = toCSV(rows, headers);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="reservations.csv"`);
  res.status(200).send(csv);
}
