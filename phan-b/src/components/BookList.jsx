import BookCard from "./BookCard.jsx";

export default function BookList({ books, favoriteIds, onToggleFavorite }) {
  if (books.length === 0) return <p>Không có sách phù hợp.</p>;

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favoriteIds.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
