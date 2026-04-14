import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function MovieCard({ movie, index }) {
  const { detailsCache, toggleFav, isFav } = useApp();
  const navigate = useNavigate();

  // Get cached details for this movie (rating, genre etc.)
  const details = detailsCache[movie.imdbID];
  const isSaved = isFav(movie.imdbID);
  const poster  = movie.Poster !== "N/A" ? movie.Poster : null;
  const rating  = details?.imdbRating && details.imdbRating !== "N/A" ? details.imdbRating : null;

  // Show up to 2 genres as tags
  const genres = details?.Genre && details.Genre !== "N/A"
    ? details.Genre.split(", ").slice(0, 2)
    : [];

  function handleCardClick() {
    navigate(`/movie/${movie.imdbID}`);
  }

  function handleFavClick(e) {
    e.stopPropagation(); // prevent the card click from firing too
    toggleFav(movie);
  }

  return (
    <div
      className="movie-card"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      {/* Poster area — clicking opens the detail page */}
      <div className="card-poster" onClick={handleCardClick}>
        {poster
          ? <img src={poster} alt={movie.Title} loading="lazy" />
          : (
            <div className="no-poster">
              <span>◈</span>
              <p>No image</p>
            </div>
          )
        }

        {/* Hover overlay with "View details" button */}
        <div className="card-overlay">
          <button className="details-btn">View details</button>
        </div>

        {/* IMDb rating badge (top left of poster) */}
        {rating && (
          <div className="rating-badge">★ {rating}</div>
        )}
      </div>

      {/* Text info below the poster */}
      <div className="card-info">
        <div className="card-title-row">
          <h3 className="card-title" title={movie.Title}>{movie.Title}</h3>

          {/* Heart button to save/unsave */}
          <button
            className={`fav-btn ${isSaved ? "active" : ""}`}
            onClick={handleFavClick}
            title={isSaved ? "Remove from saved" : "Save"}
          >
            {isSaved ? "♥" : "♡"}
          </button>
        </div>

        <p className="card-year">{movie.Year}</p>

        {genres.length > 0 && (
          <div className="card-genres">
            {genres.map(genre => (
              <span key={genre} className="card-genre-tag">{genre}</span>
            ))}
          </div>
        )}

        {/* Show shimmer lines while details are still loading */}
        {!details && (
          <div className="card-loading-row">
            <div className="inline-skeleton" />
            <div className="inline-skeleton short" />
          </div>
        )}
      </div>
    </div>
  );
}
