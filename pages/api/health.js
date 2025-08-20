import { JsonDB } from "../../lib/jsonDb";

export default async function handler(req, res) {
  const info = await JsonDB._health();
  res.status(200).json({ ok: true, ...info });
}
