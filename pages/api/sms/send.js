// pages/api/sms/send.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const {
      to = "",                 // 수신자들 (콤마로 여러 개 가능)
      msg = "",
      msg_type = "AUTO",       // "SMS" | "LMS" | "MMS" | "AUTO"
      title = "",              // LMS/MMS 제목
      testmode_yn = process.env.ALIGO_DEFAULT_TESTMODE || "N",
    } = (req.body || {});

    // 숫자+콤마만 남기기 (하이픈 제거)
    const receiver = String(to).replace(/[^0-9,]/g, "");

    // Aligo는 application/x-www-form-urlencoded를 기대함
    const params = new URLSearchParams();
    params.append("key", process.env.ALIGO_API_KEY);     // ✅ 꼭 'key'
    params.append("user_id", process.env.ALIGO_USER_ID); // ✅ 사용자 아이디
    params.append("sender", process.env.ALIGO_SENDER);   // 발신번호(숫자만)
    params.append("receiver", receiver);                 // 수신번호
    params.append("msg", msg);                           // 메시지
    params.append("msg_type", msg_type);                 // 전송 타입
    if (title) params.append("title", title);            // LMS/MMS만 필요
    params.append("testmode_yn", testmode_yn);           // "Y" or "N"

    // 디버그가 필요하면 주석 해제
    // console.log("aligo-send params =>", Object.fromEntries(params));

    const r = await fetch("https://apis.aligo.in/send/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: params,
    });

    // 응답은 JSON 또는 text일 수 있어 try/catch로 파싱
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(200).json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "SEND_FAILED", detail: String(e) });
  }
}
