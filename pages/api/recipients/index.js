// pages/api/recipients/index.js
import { prisma } from '@/lib/prisma';

const onlyDigits = (s) => String(s || '').replace(/\D/g, '');

function normalizeKrPhone(input) {
  let d = onlyDigits(input);

  // +82 / 82 국가번호가 앞에 붙은 경우 0으로 치환 (예: +821012345678 → 01012345678)
  if (d.startsWith('82')) {
    d = d.replace(/^82/, '0');
  }

  // 최종 길이 체크 (국내 일반 10~11자리)
  if (d.length < 10 || d.length > 11) return null;

  return d;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const list = await prisma.recipient.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ ok: true, data: list });
    }

    // pages/api/recipients/index.js (기존 GET/POST 유지, 아래 분기만 추가)
if (req.method === "DELETE") {
  const ids = (req.body?.ids ?? []).map(Number).filter(Boolean);
  try {
    if (ids.length) {
      await prisma.recipient.deleteMany({ where: { id: { in: ids } } });
    } else {
      await prisma.recipient.deleteMany(); // ids 없으면 전체 삭제 (원치 않으면 제거)
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "SERVER_ERROR" });
  }
}
    if (req.method === 'POST') {
      const { phone, label } = req.body || {};
      const normalized = normalizeKrPhone(phone);

      if (!normalized) {
        return res.status(400).json({
          ok: false,
          error: 'NO_VALID_PHONE',
          hint: '숫자 10~11자리(하이픈/공백 허용), +82도 입력 가능',
        });
      }

      // 중복 저장 방지: phone을 unique로 두고 upsert
      const saved = await prisma.recipient.upsert({
        where: { phone: normalized },
        update: { label: label ?? null },
        create: { phone: normalized, label: label ?? null },
      });

      return res.status(200).json({ ok: true, data: saved });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
  }
}
