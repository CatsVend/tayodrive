// pages/api/faqs.js
import { readFaqs } from '@/lib/faqsStore';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const faqs = await readFaqs();
  // 유저 페이지 안전 노출: 필요한 필드만
  res.status(200).json(faqs.map(({ id, icon, q, a }) => ({ id, icon, q, a })));
}
