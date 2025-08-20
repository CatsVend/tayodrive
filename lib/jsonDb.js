// /lib/jsonDb.js
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const DATA_DIR = process.env.TAYO_DATA_DIR
  ? path.resolve(process.env.TAYO_DATA_DIR)
  : path.join(ROOT, "data");

// HMR 중복 선언 방지: 전역 싱글톤
const STATE = globalThis.__TAYO_DB__ || (globalThis.__TAYO_DB__ = {
  cache: {},     // { [col]: Array }
  memOnly: false // 파일쓰기 실패시 true
});

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn("[jsonDb] mkdir fail => memOnly mode ON", e?.message);
    STATE.memOnly = true;
  }
}

function fileOf(col) {
  return path.join(DATA_DIR, `${col}.json`);
}

async function read(col) {
  await ensureDir();
  if (STATE.cache[col]) return STATE.cache[col];

  if (!STATE.memOnly) {
    try {
      const p = fileOf(col);
      const txt = await fs.readFile(p, "utf-8");
      const arr = JSON.parse(txt);
      if (Array.isArray(arr)) {
        STATE.cache[col] = arr;
        return arr;
      }
    } catch (e) {
      // 파일 없거나 파싱 실패 → 빈 배열
    }
  }
  STATE.cache[col] = [];
  return STATE.cache[col];
}

async function write(col, data) {
  STATE.cache[col] = data;
  if (STATE.memOnly) return; // 파일쓰기 불가 → 메모리만 유지

  const p = fileOf(col);
  const tmp = p + ".tmp";
  try {
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmp, p);
  } catch (e) {
    console.error("[jsonDb] write fail => memOnly mode ON", e?.message);
    STATE.memOnly = true;
  }
}

function newid() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
}

export const JsonDB = {
  async list(col) {
    return read(col);
  },
  async add(col, row) {
    const list = await read(col);
    const now = new Date().toISOString();
    const doc = { id: newid(), createdAt: now, ...row };
    list.unshift(doc);
    await write(col, list);
    return doc;
  },
  async update(col, id, patch) {
    const list = await read(col);
    const i = list.findIndex((x) => x.id === id);
    if (i < 0) return null;
    const now = new Date().toISOString();
    list[i] = { ...list[i], ...patch, updatedAt: now };
    await write(col, list);
    return list[i];
  },
  async remove(col, id) {
    const list = await read(col);
    await write(col, list.filter((x) => x.id !== id));
    return { ok: true };
  },
  // 헬스체크용
  async _health() {
    await ensureDir();
    return {
      root: ROOT,
      dir: DATA_DIR,
      memOnly: STATE.memOnly,
      cols: Object.keys(STATE.cache)
    };
  }
};
