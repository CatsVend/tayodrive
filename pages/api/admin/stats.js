import { requireAdmin } from "../../../lib/util";
import { readSettings } from "../../../lib/settingsStore";
export default function handler(req, res) {
  try { requireAdmin(req); }
  catch { return res.status(401).json({ error: "UNAUTHORIZED" }); }
  const s = readSettings();
  res.json({ sms: s.sms.sms, lms: s.sms.lms, mms: s.sms.mms });
}
