import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const rows = await prisma.review.findMany({ orderBy: { id: "desc" } });
  const header = ["id","title","author","content","views","published","createdAt"];
  const escape = (s) => ('"' + String(s).replace(/"/g,'""') + '"');
  const csv = [header.join(",")].concat(rows.map(r => [
    r.id, r.title, r.author||"", (r.content||"").replace(/\n/g,' '), r.views, r.published, r.createdAt.toISOString()
  ].map(escape).join(","))).join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=reviews.csv");
  res.send("\ufeff" + csv);
}