// pages/api/admin/reviews.js
import reviewsStore from "@/lib/reviewsStore";

function norm(body = {}) {
  const v = (s) => (typeof s === "string" ? s.trim() : "");
  return {
    title: v(body.title),
    author: v(body.author),
    email: v(body.email),
    image: v(body.image || body.imageUrl),
    content: v(body.content || body.body),
    rating: Number(body.rating) || 5,
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const list = await reviewsStore.list();
      return res.status(200).json(list);
    }

    if (req.method === "POST") {
      if (req.query.mode === "append" || req.query.mode === "replace") {
        const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
        if (req.query.mode === "replace") await reviewsStore.replace(rows);
        else for (const r of rows) await reviewsStore.add(r);
        return res.status(200).json(await reviewsStore.list());
      }

      const n = norm(req.body || {});
      if (!n.title || !n.author)
        return res.status(400).json({ error: "title/author required" });
      const now = new Date().toISOString();
      const item = { id: String(Date.now()), ...n, createdAt: now, updatedAt: now };
      await reviewsStore.add(item);
      return res.status(201).json(item);
    }

    if (req.method === "PUT") {
      const { id, ...patch } = req.body || {};
      if (!id) return res.status(400).json({ error: "id required" });
      const saved = await reviewsStore.update(id, {
        ...norm(patch),
        updatedAt: new Date().toISOString(),
      });
      return res.status(200).json(saved);
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: "id required" });
      await reviewsStore.remove(id);
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end("Method Not Allowed");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
}
