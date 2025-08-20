// pages/api/recipients/[id].js
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ ok: false, message: "METHOD_NOT_ALLOWED" });
  }

  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ ok: false, message: "INVALID_ID" });

  try {
    await prisma.recipient.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("recipient.delete", e);
    return res.status(500).json({ ok: false, message: "SERVER_ERROR" });
  }
}
