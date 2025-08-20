// pages/api/reviews/csv.js
import { assertAdmin } from '@/lib/auth';
import { readReviews } from '@/lib/reviewsStore';
import { toCSV } from '@/lib/storeBase';

export default async function handler(req, res) {
  if (!assertAdmin(req, res)) return;
  const rows = await readReviews();
  const headers = ['id','title','author','views','createdAt','content','imageUrl'];
  const csv = toCSV(rows, headers);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="reviews.csv"`);
  res.status(200).send(csv);
}
