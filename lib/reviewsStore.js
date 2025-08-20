// lib/reviewsStore.js
import createJsonStore from "./storeBase";
const store = createJsonStore("reviews.json", "id");
export default store;
