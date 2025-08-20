import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body || {};
  const ok = password && password === (process.env.ADMIN_PASSWORD || "tayo2025!");
  if (!ok) return res.status(401).json({ ok: false });
  res.setHeader("Set-Cookie", cookie.serialize("admin", "true", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  }));
  res.json({ ok: true });
}