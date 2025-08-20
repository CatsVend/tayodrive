// lib/settingsStore.js
import { readJSON, writeJSON } from "./util";
const FILE = "settings.json";
export function readSettings() {
  return readJSON(FILE, {
    kakaoChannelUrl: "https://pf.kakao.com/_hGxgkxj",
    metaTitle: "타요 드라이브 | 방문 운전연수",
    metaDescription: "1:1 방문 운전연수, 전국 어디든 가능! 우수 강사진, 합리적 비용, 최고의 만족도."
  });
}
export function writeSettings(next) {
  writeJSON(FILE, next);
}
