// lib/reservationsStore.js

// 개발 중 HMR(핫 리로드)에도 데이터가 유지되도록 전역 캐시에 저장
const KEY = '__TAYO_RES_STORE__';
if (!globalThis[KEY]) globalThis[KEY] = [];
let store = globalThis[KEY];

// 공용: 목록 조회
export async function listReservations() {
  return store;
}

// 공용: 추가(유저 POST, 관리자 수동추가 둘 다 사용)
export async function addReservation(rec = {}) {
  const row = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    name:   rec.name   ?? rec.이름 ?? '',
    phone:  rec.phone  ?? rec.전화 ?? rec.전화번호 ?? '',
    gender: rec.gender ?? rec.성별 ?? '',
    carType:rec.carType?? rec.car ?? rec.차종 ?? '',
    region: rec.region ?? rec.area ?? rec.지역 ?? '',
    memo:   rec.memo   ?? rec.content ?? rec.문의내용 ?? ''
  };
  store.unshift(row);
  return row;
}

// 관리자: 부분 수정
export async function updateReservation(id, patch = {}) {
  const i = store.findIndex(r => r.id === id);
  if (i === -1) return null;
  store[i] = { ...store[i], ...patch };
  return store[i];
}

// 관리자: 삭제
export async function deleteReservation(id) {
  store = store.filter(r => r.id !== id);
  globalThis[KEY] = store; // 전역 참조도 업데이트
}

// 관리자: CSV 불러오기(추가/대체는 페이지에서 제어)
export async function bulkImportReservations(rows = []) {
  const map = (r = {}) => ({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    name:   r.name   ?? r.이름 ?? '',
    phone:  r.phone  ?? r.전화 ?? r.전화번호 ?? '',
    gender: r.gender ?? r.성별 ?? '',
    carType:r.carType?? r.car ?? r.차종 ?? '',
    region: r.region ?? r.area ?? r.지역 ?? '',
    memo:   r.memo   ?? r.content ?? r.문의내용 ?? ''
  });
  const saved = rows.map(map);
  store = [...saved, ...store];
  globalThis[KEY] = store;
  return saved;
}

// (선택) 개발 편의용 리셋
export function _resetReservationsForDev() {
  store = [];
  globalThis[KEY] = store;
}
