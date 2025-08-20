// lib/reviewsStore.js
// Vercel(서버리스) 배포용: 읽기 전용 스텁
// data/reviews.json 을 정적으로 읽어서 반환합니다.

import reviews from "../data/reviews.json";

export async function readReviews() {
  return Array.isArray(reviews) ? reviews : [];
}

export async function writeReviews(/* item */) {
  // 서버리스 파일쓰기 불가 → DB로 교체 전까지 read-only
  return { ok: false, reason: "read-only" };
}

export async function addReview(/* item */) {
  // 서버리스 파일쓰기 불가 → DB로 교체 전까지 read-only
  return { ok: false, reason: "read-only" };
}

// default 형태로도 필요할 수 있어 둘 다 제공
const store = {
  read: readReviews,
  write: writeReviews,
  add: addReview,
};
export default store;
