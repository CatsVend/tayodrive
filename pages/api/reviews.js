// pages/api/reviews.js
import reviewsStore from "@/lib/reviewsStore";
export default async function handler(req, res) {
  const list = await reviewsStore.list();
  res.status(200).json(list);
}
