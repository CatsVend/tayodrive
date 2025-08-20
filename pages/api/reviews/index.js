// pages/api/reviews/index.js
import { assertAdmin } from '@/lib/auth';
import { readReviews, addReview } from '@/lib/reviewsStore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const list = await readReviews();
    return res.status(200).json(list);
  }
  if (req.method === 'POST') {
    if (!assertAdmin(req, res)) return;
    const body = req.body || {};
    if (!body.title) return res.status(400).json({ error: 'title required' });
    const item = await addReview(body);
    return res.status(201).json(item);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
