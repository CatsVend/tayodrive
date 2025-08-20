// 포인트/잔액 조회
export default async function handler(_req, res) {
  try {
    const form = new FormData();
    form.append('user_id', process.env.ALIGO_USER_ID);
    form.append('key', process.env.ALIGO_API_KEY);

    const resp = await fetch('https://apis.aligo.in/remain/', { method: 'POST', body: form });
    let data;
    try { data = await resp.json(); } catch { data = { raw: await resp.text() }; }

    return res.status(200).json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
