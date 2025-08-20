// pages/api/settings-public.js
import { readSettings } from "../../lib/settingsStore";

export default function handler(_req, res) {
  const s = readSettings();
  // 공개 가능한 항목만 반환
  res.json({
    kakaoChannelUrl: s.kakaoChannelUrl || "",
    metaTitle: s.metaTitle || "",
    metaDescription: s.metaDescription || ""
  });
}
