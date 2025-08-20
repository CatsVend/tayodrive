import { JsonDB } from "../../lib/jsonDb";
export const config = { api: { bodyParser: true } };

const COL = "reservations";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const list = await JsonDB.list(COL);
      return res.status(200).json({ reservations: list, items: list });
    }

    if (req.method === "POST") {
      const { name, phone, gender, carType, region, memo, status } = req.body || {};
      if (!name || !phone) {
        return res.status(400).json({ error: "name, phone are required" });
      }
      const doc = await JsonDB.add(COL, {
        name, phone,
        gender: gender || "",
        carType: carType || "",
        region: region || "",
        memo: memo || "",
        status: status || "상담신청중"
      });
      return res.status(201).json(doc);
    }

    if (req.method === "PUT") {
      const { id, ...patch } = req.body || {};
      if (!id) return res.status(400).json({ error: "id is required" });
      const updated = await JsonDB.update(COL, id, patch);
      if (!updated) return res.status(404).json({ error: "not found" });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ error: "id is required" });
      await JsonDB.remove(COL, id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    console.error("api/reservations error:", e);
    return res.status(500).json({ error: "internal_error" });
  }
}
