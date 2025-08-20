import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const rows = await prisma.reservation.findMany({ orderBy: { id: "desc" } });
  const header = ["id","name","gender","phone","vehicleType","region","status","createdAt","memo"];
  const escape = (s) => ('"' + String(s).replace(/"/g,'""') + '"');
  const csv = [header.join(",")].concat(rows.map(r => [
    r.id, r.name, r.gender||"", r.phone, r.vehicleType||"", r.region||"", r.status||"", r.createdAt.toISOString(), r.memo||""
  ].map(escape).join(","))).join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=reservations.csv");
  res.send("\ufeff" + csv);
}