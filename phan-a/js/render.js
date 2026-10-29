function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function iconButton(action, className, symbol, label) {
  const btn = el("button", `btn btn-icon ${className}`, symbol);
  btn.type = "button";
  btn.dataset.action = action;
  btn.setAttribute("aria-label", label);
  btn.title = label;
  return btn;
}

export function createBookCard(book, isFav) {
  const card = el("article", "book-card" + (isFav ? " is-fav" : ""));
  card.dataset.id = book.id;

  const actions = el("div", "card-actions");
  const favBtn = iconButton("favorite", "btn-fav" + (isFav ? " active" : ""), isFav ? "♥" : "♡", isFav ? "Bỏ yêu thích" : "Yêu thích");
  const delBtn = iconButton("delete", "btn-delete", "✕", "Xóa");
  actions.append(favBtn, delBtn);

  card.append(
    el("h3", "", book.title),
    el("p", "book-genre", book.genre),
    el("p", "", book.author),
    el("p", "", String(book.year)),
    actions
  );
  return card;
}

export function renderBooks(container, books, favorites) {
  container.replaceChildren(...books.map((b) => createBookCard(b, favorites.has(b.id))));
}

// Danh sách thể loại tạo bằng Set để loại trùng
export function getGenres(books) {
  return [...new Set(books.map((b) => b.genre))].sort((a, b) => a.localeCompare(b, "vi"));
}

// Danh sách nút thể loại ở sidebar ("" = tất cả)
export function renderGenreList(container, genres, selected) {
  const items = [["", "Tất cả"], ...genres.map((g) => [g, g])];
  container.replaceChildren(
    ...items.map(([value, label]) => {
      const li = el("li");
      const btn = el("button", value === selected ? "active" : "", label);
      btn.type = "button";
      btn.dataset.genre = value;
      btn.setAttribute("aria-pressed", String(value === selected));
      li.append(btn);
      return li;
    })
  );
}

// Dùng cho ô chọn thể loại trong form thêm sách
export function renderGenreOptions(select, genres, firstLabel) {
  const current = select.value;
  select.replaceChildren();
  const first = el("option", "", firstLabel);
  first.value = "";
  select.append(first);
  for (const g of genres) {
    const opt = el("option", "", g);
    opt.value = g;
    select.append(opt);
  }
  select.value = genres.includes(current) ? current : "";
}

export function setStatus(node, message, isError = false) {
  node.textContent = message;
  node.classList.toggle("is-error", isError);
}
