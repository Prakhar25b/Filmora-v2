import { useApp } from "../context/AppContext";
import MovieCard from "../components/MovieCard";

export default function SavedPage() {
  const { favorites, toggleFav } = useApp();

  function clearAll() {
    // toggleFav removes a movie if it's already saved, so calling it on each favorite clears them all
    favorites.forEach(movie => toggleFav(movie));
  }

  return (
    <main className="main">

      {/* Page header */}
      <section className="search-hero minimal">
        <div>
          <p className="search-eyebrow">Your saved films</p>
          <h2 className="section-title" style={{ marginTop: 4 }}>
            {favorites.length} {favorites.length === 1 ? "film" : "films"} saved
          </h2>
        </div>

        {favorites.length > 0 && (
          <button className="clear-all-btn" onClick={clearAll}>
            Clear all
          </button>
        )}
      </section>

      {/* Empty state */}
      {favorites.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">♡</span>
          <p className="empty-title">Nothing saved yet</p>
          <p className="empty-sub">Tap the heart on any film to save it here.</p>
        </div>
      )}

      {/* Favorites grid */}
      {favorites.length > 0 && (
        <div className="movies-grid">
          {favorites.map((movie, index) => (
            <MovieCard key={movie.imdbID} movie={movie} index={index} />
          ))}
        </div>
      )}

    </main>
  );
}
