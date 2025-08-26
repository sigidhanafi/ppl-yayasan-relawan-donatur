// DotSeparatedList.jsx
export default function DotSeparatedList({
  text,
  ordered = false,
  keepDot = false,
  className = '',
}) {
  const items = String(text)
    .split('.') // pisah di titik
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean); // buang yang kosong

  const ListTag = ordered ? 'ol' : 'ul';
  const listStyle = ordered ? 'list-decimal' : 'list-disc';

  return (
    <ListTag className={`${listStyle} pl-6 space-y-1 ${className}`}>
      {items.map((it, i) => (
        <li key={i}>{keepDot ? `${it}.` : it}</li>
      ))}
    </ListTag>
  );
}
