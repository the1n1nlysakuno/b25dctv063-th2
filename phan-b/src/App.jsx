import { useState } from "react";
import { books } from "./data/books.js";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import BookList from "./components/BookList.jsx";
import Footer from "./components/Footer.jsx";

const POPULAR_COUNT = 5;

// Đếm số sách mỗi thể loại, lấy 5 thể loại có nhiều sách nhất
const popularGenres = Object.entries(
  books.reduce((count, b) => ({ ...count, [b.genre]: (count[b.genre] || 0) + 1 }), {})
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, POPULAR_COUNT)
  .map(([genre]) => genre);

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState(""); // "" = tất cả
  const [favoriteIds, setFavoriteIds] = useState([]);

  const visibleBooks =
    selectedGenre === "" ? books : books.filter((b) => b.genre === selectedGenre);

  function toggleFavorite(id) {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <Header />
        <Section title="Yêu thích" className="fav-box">
          <strong>{favoriteIds.length} cuốn</strong>
        </Section>
        <Section title="Thể loại phổ biến">
          <GenreFilter
            genres={popularGenres}
            selected={selectedGenre}
            onSelect={setSelectedGenre}
          />
        </Section>
      </aside>

      <main className="content">
        <p className="status">
          Đang hiển thị {visibleBooks.length} / {books.length} cuốn
        </p>
        <BookList
          books={visibleBooks}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
        <Footer />
      </main>
    </div>
  );
}
