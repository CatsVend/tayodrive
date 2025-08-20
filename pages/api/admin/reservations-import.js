// pages/api/admin/reservations-import.js
import cookie from "cookie";
import { importCsv } from "@/lib/reservationsStore";

export default async function handler(req, res){
  const c = cookie.parse(req.headers.cookie || "");
  const t = c["admin_token"] || "";
  if (!process.env.ADMIN_TOKEN || t !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error:"unauthorized" });
  }
  if (req.method !== "POST") return res.status(405).json({ error:"method" });

  const { csv, mode } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (!csv) return res.status(400).json({ error:"no csv" });
  const count = await importCsv(csv, mode === "replace" ? "replace" : "append");
  return res.json({ ok:true, count });
}
