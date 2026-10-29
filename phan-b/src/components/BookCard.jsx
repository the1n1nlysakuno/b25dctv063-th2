export default function BookCard({ book, isFavorite, onToggleFavorite }) {
  const favLabel = isFavorite ? "Bỏ yêu thích" : "Yêu thích";

  return (
    <article className={"book-card" + (isFavorite ? " is-fav" : "")}>
      <h3>{book.title}</h3>
      <p className="book-genre">{book.genre}</p>
      <p>{book.author}</p>
      <p>{book.year}</p>
      <div className="card-actions">
        <button
          type="button"
          className={"btn btn-icon btn-fav" + (isFavorite ? " active" : "")}
          aria-label={favLabel}
          title={favLabel}
          onClick={() => onToggleFavorite(book.id)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
    </article>
  );
}
