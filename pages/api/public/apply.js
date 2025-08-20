// pages/api/public/apply.js
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  const { name, phone, gender, carType, region, content, agreed } = req.body || {};
  // 매우 간단한 유효성 (프론트에서 이미 검증했다는 가정)
  if (!name || !phone || agreed !== true) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }
  try {
    const saved = await prisma.inquiry.create({
      data: { name, phone, gender: gender || null, carType: carType || null, region: region || null, content: content || null, agreed: true },
    });
    res.status(200).json({ ok: true, item: saved });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Failed to save inquiry' });
  }
}
