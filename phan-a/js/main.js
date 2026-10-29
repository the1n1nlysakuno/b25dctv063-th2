import { fetchBooks, postBook, deleteBook } from "./api.js";
import { loadFavorites, saveFavorites } from "./storage.js";
import { validators } from "./validate.js";
import { renderBooks, getGenres, renderGenreList, renderGenreOptions, setStatus } from "./render.js";

const $ = (sel) => document.querySelector(sel);
const listEl = $("#book-list");
const statusEl = $("#status");
const searchEl = $("#search");
const genreListEl = $("#genre-list");
const favCountEl = $("#fav-count");
const formEl = $("#book-form");
const formGenreEl = $("#f-genre");

const state = {
  books: [],
  favorites: loadFavorites(),
  search: "",
  genre: "",
};

function getVisibleBooks() {
  const q = state.search.trim().toLowerCase();
  return state.books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) &&
      (state.genre === "" || b.genre === state.genre)
  );
}

function render() {
  const visible = getVisibleBooks();
  renderGenreList(genreListEl, getGenres(state.books), state.genre);
  renderBooks(listEl, visible, state.favorites);
  favCountEl.textContent = state.favorites.size;
  if (visible.length === 0) {
    setStatus(statusEl, `Không có sách phù hợp. Đang hiển thị 0 / ${state.books.length} cuốn`);
  } else {
    setStatus(statusEl, `Đang hiển thị ${visible.length} / ${state.books.length} cuốn`);
  }
}

function refreshGenres() {
  const genres = getGenres(state.books);
  renderGenreOptions(formGenreEl, genres, "-- Chọn thể loại --");
  if (!genres.includes(state.genre)) state.genre = ""; // thể loại đang lọc không còn sách
}

/* ---------- Tải dữ liệu ---------- */
async function init() {
  setStatus(statusEl, "Đang tải...");
  try {
    state.books = await fetchBooks();
    refreshGenres();
    render();
  } catch (err) {
    setStatus(statusEl, `Không tải được danh sách sách: ${err.message}`, true);
  }
}

/* ---------- Tìm kiếm và lọc ---------- */
searchEl.addEventListener("input", () => {
  state.search = searchEl.value;
  render();
});
genreListEl.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-genre]");
  if (!btn) return;
  state.genre = btn.dataset.genre;
  render();
});

/* ---------- Event delegation: Yêu thích / Xóa ---------- */
listEl.addEventListener("click", async (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.closest(".book-card").dataset.id;

  if (btn.dataset.action === "favorite") {
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    saveFavorites(state.favorites);
    render();
  }

  if (btn.dataset.action === "delete") {
    const book = state.books.find((b) => b.id === id);
    if (!confirm(`Bạn có chắc muốn xóa "${book.title}"?`)) return;
    try {
      await deleteBook(id);
      state.books = state.books.filter((b) => b.id !== id);
      if (state.favorites.delete(id)) saveFavorites(state.favorites);
      refreshGenres();
      render();
    } catch (err) {
      setStatus(statusEl, err.message, true);
    }
  }
});

/* ---------- Form thêm sách ---------- */
function showError(name, message) {
  const field = formEl.elements[name];
  formEl.querySelector(`[data-error-for="${name}"]`).textContent = message;
  field.classList.toggle("invalid", Boolean(message));
}

function validateField(name) {
  const message = validators[name](formEl.elements[name].value);
  showError(name, message);
  return message === "";
}

// Báo lỗi ngay khi gõ / đổi giá trị
formEl.addEventListener("input", (e) => {
  if (e.target.name in validators) validateField(e.target.name);
});
formEl.addEventListener("change", (e) => {
  if (e.target.name in validators) validateField(e.target.name);
});

// Báo lỗi khi gửi
formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const results = Object.keys(validators).map(validateField);
  if (results.includes(false)) return;

  const data = {
    title: formEl.elements.title.value.trim(),
    author: formEl.elements.author.value.trim(),
    genre: formEl.elements.genre.value,
    year: Number(formEl.elements.year.value),
  };

  try {
    const created = await postBook(data);
    state.books.unshift(created); // hiển thị ở đầu danh sách
    formEl.reset();
    Object.keys(validators).forEach((n) => showError(n, ""));
    refreshGenres();
    render();
  } catch (err) {
    setStatus(statusEl, err.message, true);
  }
});

init();
