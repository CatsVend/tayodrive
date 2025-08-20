// lib/storeBase.js
import fs from "fs/promises";
import path from "path";

function dataPath(file) {
  return path.join(process.cwd(), "data", file);
}

async function ensureFile(file) {
  try {
    await fs.access(file);
  } catch (e) {
    if (e.code === "ENOENT") {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, "[]\n", "utf8");
    } else {
      throw e;
    }
  }
}

async function safeRead(file) {
  await ensureFile(file);
  let raw = (await fs.readFile(file, "utf8")).trim();
  if (!raw) return [];

  // 1차 시도: 그대로 파싱
  const parse = (txt) => {
    const j = JSON.parse(txt);
    if (Array.isArray(j)) return j;
    if (Array.isArray(j?.reviews)) return j.reviews;
    if (Array.isArray(j?.items)) return j.items;
    return [];
  };

  try {
    return parse(raw);
  } catch {
    // 2차 시도: "}{" 를 "},{" 로 바꾸고 []로 감싸서 복구
    try {
      const fixed = "[" + raw.replace(/}\s*{/g, "},{") + "]";
      return parse(fixed);
    } catch (e2) {
      console.error("JSON parse failed:", file, e2);
      throw new Error(
        `Bad JSON in ${path.basename(file)} — 파일 내용을 배열 형태로 고쳐주세요.`
      );
    }
  }
}

async function safeWrite(file, arr) {
  await ensureFile(file);
  await fs.writeFile(file, JSON.stringify(arr, null, 2) + "\n", "utf8");
}

export default function createJsonStore(filename, key = "id") {
  const file = dataPath(filename);

  return {
    async list() {
      return await safeRead(file);
    },
    async add(item) {
      const list = await safeRead(file);
      if (!item[key]) item[key] = String(Date.now());
      list.push(item);
      await safeWrite(file, list);
      return item;
    },
    async update(id, patch) {
      const list = await safeRead(file);
      const idx = list.findIndex((x) => String(x[key]) === String(id));
      if (idx < 0) throw new Error("not found");
      list[idx] = { ...list[idx], ...patch };
      await safeWrite(file, list);
      return list[idx];
    },
    async remove(id) {
      const list = await safeRead(file);
      const next = list.filter((x) => String(x[key]) !== String(id));
      await safeWrite(file, next);
    },
    async replace(rows) {
      await safeWrite(file, Array.isArray(rows) ? rows : []);
    },
  };
}
