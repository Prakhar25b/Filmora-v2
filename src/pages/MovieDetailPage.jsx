import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function MovieDetailPage() {
  // useParams reads the :imdbID from the URL e.g. /movie/tt0111161
  const { imdbID } = useParams();
  const navigate   = useNavigate();
  const { fetchDetails, fetchTmdb, detailsCache, toggleFav, isFav, addToHistory } = useApp();

  const [loading,     setLoading]     = useState(true);
  const [movie,       setMovie]       = useState(null);
  const [tmdb,        setTmdb]        = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  // Load movie data when the page opens or when the URL changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
    loadMovie();
  }, [imdbID]);

  async function loadMovie() {
    setLoading(true);

    // Use cached details if available, otherwise fetch from OMDB
    const detail = detailsCache[imdbID] || await fetchDetails(imdbID);

    if (detail) {
      setMovie(detail);
      addToHistory(detail); // log to watch history
      const tmdbData = await fetchTmdb(imdbID);
      setTmdb(tmdbData);
    }

    setLoading(false);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Convert OMDB Ratings array into percentage values for the rating bars
  function getRatingBars() {
    if (!movie || !movie.Ratings) return [];

    return movie.Ratings.map(rating => {
      let percent = 0;

      if (rating.Value.includes("/10")) {
        // e.g. "8.3/10" → 83%
        percent = (parseFloat(rating.Value) / 10) * 100;
      } else if (rating.Value.includes("/100")) {
        // e.g. "74/100" → 74%
        percent = parseFloat(rating.Value);
      } else if (rating.Value.includes("%")) {
        // e.g. "91%" → 91
        percent = parseFloat(rating.Value);
      }

      // Shorten the source name
      let label = rating.Source;
      if (rating.Source === "Internet Movie Database") label = "IMDb";
      if (rating.Source === "Rotten Tomatoes")         label = "Rotten Tomatoes";
      if (rating.Source === "Metacritic")               label = "Metacritic";

      return { label, value: rating.Value, percent: Math.round(percent) };
    });
  }

  // --- Loading state ---
  if (loading) {
    return (
      <main className="main detail-loading">
        <div className="detail-skeleton">
          <div className="skeleton-backdrop" />
          <div className="skeleton-detail-body">
            <div className="skeleton-line wide"  style={{ height: 28, marginBottom: 12 }} />
            <div className="skeleton-line med"   style={{ height: 16, marginBottom: 8 }} />
            <div className="skeleton-line short" />
          </div>
        </div>
      </main>
    );
  }

  // --- Not found state ---
  if (!movie) {
    return (
      <main className="main">
        <div className="empty-state">
          <span className="empty-icon">⊘</span>
          <p className="empty-title">Movie not found</p>
          <button className="page-btn" onClick={() => navigate(-1)}>← Go back</button>
        </div>
      </main>
    );
  }

  const ratingBars = getRatingBars();
  const poster     = movie.Poster !== "N/A" ? movie.Poster : null;
  const fav        = isFav(movie.imdbID);

  return (
    <main className="main detail-main">

      {/* Backdrop image (from TMDB) */}
      {tmdb?.backdrop && (
        <div className="detail-backdrop" style={{ backgroundImage: `url(${tmdb.backdrop})` }}>
          <div className="detail-backdrop-fade" />
        </div>
      )}

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-layout">

        {/* Left column: poster */}
        <div className="detail-poster-col">
          {poster
            ? <img src={poster} alt={movie.Title} className="detail-poster-img" />
            : <div className="detail-no-poster"><span>◈</span></div>
          }
        </div>

        {/* Right column: all info */}
        <div className="detail-info-col">

          {/* Year / type / country */}
          <p className="modal-eyebrow">
            {movie.Year} · {movie.Type}
            {movie.Country && movie.Country !== "N/A" ? ` · ${movie.Country}` : ""}
          </p>

          <h1 className="detail-title">{movie.Title}</h1>

          {/* Rating / runtime / age rating chips */}
          <div className="modal-meta">
            {movie.imdbRating !== "N/A" && (
              <span className="meta-chip rating">★ {movie.imdbRating}</span>
            )}
            {movie.Runtime !== "N/A" && (
              <span className="meta-chip">{movie.Runtime}</span>
            )}
            {movie.Rated !== "N/A" && (
              <span className="meta-chip">{movie.Rated}</span>
            )}
            {movie.imdbVotes !== "N/A" && (
              <span className="meta-chip">
                {parseInt(movie.imdbVotes.replace(/,/g, "")).toLocaleString()} votes
              </span>
            )}
          </div>

          {/* Genre tags */}
          {movie.Genre && movie.Genre !== "N/A" && (
            <div className="modal-genres">
              {movie.Genre.split(", ").map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== "N/A" && (
            <p className="modal-plot">{movie.Plot}</p>
          )}

          {/* Ratings bars (IMDb / RT / Metacritic) */}
          {ratingBars.length > 0 && (
            <div className="ratings-section">
              {ratingBars.map(r => (
                <div key={r.label} className="rating-bar-row">
                  <span className="rating-bar-label">{r.label}</span>
                  <div className="rating-bar-track">
                    <div className="rating-bar-fill" style={{ width: `${r.percent}%` }} />
                  </div>
                  <span className="rating-bar-value">{r.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Director / cast / awards */}
          <div className="modal-credits">
            {movie.Director !== "N/A" && (
              <p><span className="credit-label">Director</span>{movie.Director}</p>
            )}
            {movie.Writer !== "N/A" && (
              <p><span className="credit-label">Writer</span>{movie.Writer}</p>
            )}
            {movie.Actors !== "N/A" && (
              <p><span className="credit-label">Cast</span>{movie.Actors}</p>
            )}
            {movie.Awards !== "N/A" && (
              <p><span className="credit-label">Awards</span>{movie.Awards}</p>
            )}
            {movie.Language !== "N/A" && (
              <p><span className="credit-label">Language</span>{movie.Language}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="modal-actions">

            {/* Trailer button — embedded player if TMDB key exists, else YouTube search */}
            {tmdb?.trailerKey ? (
              <button className="trailer-link" onClick={() => setShowTrailer(true)}>
                ▶ Watch trailer
              </button>
            ) : (
              <a
                className="trailer-link"
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " trailer")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                ▶ Watch trailer
              </a>
            )}

            <a
              className="imdb-link"
              href={`https://www.imdb.com/title/${movie.imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              IMDb →
            </a>

            <button className={`share-btn ${copied ? "copied" : ""}`} onClick={handleCopyLink}>
              {copied ? "✓ Copied!" : "⎘ Share"}
            </button>

            <button className={`fav-btn-lg ${fav ? "active" : ""}`} onClick={() => toggleFav(movie)}>
              {fav ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Cast row (from TMDB) */}
      {tmdb?.cast?.length > 0 && (
        <section className="cast-section">
          <h2 className="section-title" style={{ marginBottom: "16px" }}>Cast</h2>
          <div className="cast-row">
            {tmdb.cast.map(person => (
              <Link
                key={person.name}
                to={`/?actor=${encodeURIComponent(person.name)}`}
                className="cast-card"
              >
                <div className="cast-photo">
                  {person.photo
                    ? <img src={person.photo} alt={person.name} loading="lazy" />
                    : <span className="cast-placeholder">◈</span>
                  }
                </div>
                <p className="cast-name">{person.name}</p>
                <p className="cast-char">{person.character}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trailer overlay modal */}
      {showTrailer && tmdb?.trailerKey && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${tmdb.trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </main>
  );
}
