// pages/api/admin/settings.js
import { requireAdmin } from "../../../lib/util";
import { readSettings, writeSettings } from "../../../lib/settingsStore";

export default function handler(req, res) {
  try { requireAdmin(req); } catch { return res.status(401).json({ error: "UNAUTHORIZED" }); }
  if (req.method === "GET") return res.json(readSettings());

  if (req.method === "PUT") {
    const body = req.body || {};
    const prev = readSettings();
    const next = {
      kakaoChannelUrl: body.kakaoChannelUrl || prev.kakaoChannelUrl,
      metaTitle: body.metaTitle ?? prev.metaTitle,
      metaDescription: body.metaDescription ?? prev.metaDescription
    };
    writeSettings(next);
    return res.json(next);
  }

  return res.status(405).end();
}
