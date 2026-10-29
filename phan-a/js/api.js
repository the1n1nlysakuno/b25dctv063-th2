// Đổi sang URL mockapi.io của bạn và bật USE_MOCKAPI nếu muốn dùng API thật.
// Ví dụ: "https://xxxxxxxx.mockapi.io/api/books"
export const API_URL = "./books.json";
export const USE_MOCKAPI = false;

export async function fetchBooks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Máy chủ trả về lỗi ${res.status}`);
  const data = await res.json();
  // mockapi trả id dạng chuỗi; chuẩn hóa để so sánh nhất quán
  return data.map((b) => ({ ...b, id: String(b.id), year: Number(b.year) }));
}

export async function postBook(book) {
  if (!USE_MOCKAPI) {
    // Chế độ file books.json: không có server ghi, tạo id tạm ở máy
    return { ...book, id: `local-${Date.now()}` };
  }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(`Không thêm được sách (lỗi ${res.status})`);
  const created = await res.json();
  return { ...created, id: String(created.id), year: Number(created.year) };
}

export async function deleteBook(id) {
  if (!USE_MOCKAPI) return;
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Không xóa được sách (lỗi ${res.status})`);
}
