export default function GenreFilter({ genres, selected, onSelect }) {
  const items = [{ value: "", label: "Tất cả" }, ...genres.map((g) => ({ value: g, label: g }))];

  return (
    <ul className="genre-list">
      {items.map(({ value, label }) => (
        <li key={value || "all"}>
          <button
            type="button"
            className={value === selected ? "active" : ""}
            aria-pressed={value === selected}
            onClick={() => onSelect(value)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}
