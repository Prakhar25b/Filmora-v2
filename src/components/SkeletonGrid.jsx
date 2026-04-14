export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-poster" />
          <div className="skeleton-line wide" />
          <div className="skeleton-line short" />
          <div className="skeleton-line med" />
        </div>
      ))}
    </div>
  );
}
