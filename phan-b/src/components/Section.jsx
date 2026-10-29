export default function Section({ title, className = "", children }) {
  return (
    <section className={`box ${className}`.trim()}>
      <span>{title}</span>
      {children}
    </section>
  );
}
