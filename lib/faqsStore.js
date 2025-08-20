// lib/faqsStore.js
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'faqs.json');

export async function readFaqs() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const json = JSON.parse(raw);
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function writeFaqs(faqs) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(faqs, null, 2), 'utf8');
}

export function makeId() {
  return `faq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}
