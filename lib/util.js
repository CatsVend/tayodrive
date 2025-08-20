import fs from "fs";
import path from "path";

export const dataDir = path.join(process.cwd(), "data");
export function ensureDataDir() { if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir); }
export function readJSON(file, fallback) {
  ensureDataDir();
  try { return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8")); }
  catch { return fallback; }
}
export function writeJSON(file, data) {
  ensureDataDir();
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
}

export function parseCookie(str = "") {
  return Object.fromEntries(
    (str || "").split(/; */).filter(Boolean).map(v => {
      const i = v.indexOf("="); return [decodeURIComponent(v.slice(0, i)), decodeURIComponent(v.slice(i + 1))];
    })
  );
}
export function requireAdmin(req) {
  const c = parseCookie(req.headers.cookie || "");
  const token = c["admin_token"];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    const e = new Error("UNAUTHORIZED"); e.statusCode = 401; throw e;
  }
}
