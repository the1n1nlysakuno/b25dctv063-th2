const KEY = "library:favorites";

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set(); // dữ liệu hỏng thì bắt đầu lại
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(KEY, JSON.stringify([...favorites]));
}
