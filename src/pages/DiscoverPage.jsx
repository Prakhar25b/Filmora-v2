import { useEffect, useState, useRef } from "react";
import MovieCard    from "../components/MovieCard";
import SkeletonGrid from "../components/SkeletonGrid";
import Pagination   from "../components/Pagination";
import { useSearch } from "../hooks/useSearch";
import { useApp }    from "../context/AppContext";

const SORT_OPTIONS = [
  { value: "default",     label: "Relevance" },
  { value: "year_desc",   label: "Newest first" },
  { value: "year_asc",    label: "Oldest first" },
  { value: "rating_desc", label: "Highest rated" },
  { value: "title_asc",   label: "A → Z" },
];

const TYPE_OPTIONS = [
  { value: "",        label: "All types" },
  { value: "movie",   label: "Movies" },
  { value: "series",  label: "TV Series" },
  { value: "episode", label: "Episodes" },
];

// These are pre-selected IMDB IDs shown as "Trending" before any search
const TRENDING_IDS = [
  "tt9362722", "tt1630029", "tt15239678", "tt6791350",
  "tt1877830",  "tt21807222", "tt0848228",  "tt4154796",
];

export default function DiscoverPage() {
  const { detailsCache, fetchDetails, OMDB_KEY } = useApp();

  // useSearch hook handles all search state and logic
  const {
    query, handleQueryChange, clearSearch,
    movies, loading, error, hasSearched,
    page, totalPages, totalResults, handlePageChange,
    sortBy, setSortBy, typeFilter, handleTypeChange,
  } = useSearch();

  const [trending,        setTrending]        = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // This ref prevents the trending fetch from running twice in React Strict Mode
  const alreadyFetched = useRef(false);

  // Fetch trending movies once when the page first loads
  useEffect(() => {
    if (alreadyFetched.current) return;
    alreadyFetched.current = true;
    loadTrending();
  }, []);

  async function loadTrending() {
    setTrendingLoading(true);

    // Fetch all trending movies at the same time using Promise.all
    const promises = TRENDING_IDS.map(id =>
      fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDB_KEY}`)
        .then(r => r.json())
        .catch(() => null)
    );
    const results = await Promise.all(promises);

    // Filter out any failed fetches
    const validMovies = results.filter(r => r && r.Response === "True");
    setTrending(validMovies);

    // Pre-fetch details (ratings, genres) for each trending card
    validMovies.forEach(movie => fetchDetails(movie.imdbID));

    setTrendingLoading(false);
  }

  // Sort the current movie results client-side (no extra API call needed)
  function getSortedMovies(movieList) {
    // Attach cached details to each movie so we can sort by rating
    const moviesWithDetails = movieList.map(movie => ({
      ...movie,
      details: detailsCache[movie.imdbID],
    }));

    switch (sortBy) {
      case "year_desc":
        return [...moviesWithDetails].sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      case "year_asc":
        return [...moviesWithDetails].sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
      case "rating_desc":
        return [...moviesWithDetails].sort((a, b) => {
          const ratingA = parseFloat(a.details?.imdbRating) || 0;
          const ratingB = parseFloat(b.details?.imdbRating) || 0;
          return ratingB - ratingA;
        });
      case "title_asc":
        return [...moviesWithDetails].sort((a, b) => a.Title.localeCompare(b.Title));
      default:
        return moviesWithDetails;
    }
  }

  const sortedMovies = getSortedMovies(movies);

  return (
    <main className="main">

      {/* Search bar section */}
      <section className="search-hero">
        <p className="search-eyebrow">Search the universe of cinema</p>

        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            value={query}
            placeholder="Title, director, keyword…"
            onChange={e => handleQueryChange(e.target.value)}
            className="search-input"
            autoFocus
          />
          {query && (
            <button className="clear-btn" onClick={clearSearch}>✕</button>
          )}
        </div>

        {/* Filter pills and sort dropdown */}
        <div className="controls-row">
          <div className="type-pills">
            {TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`type-pill ${typeFilter === option.value ? "active" : ""}`}
                onClick={() => handleTypeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="sort-wrap">
            <label className="sort-label">Sort</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results count */}
      {!loading && hasSearched && !error && totalResults > 0 && (
        <div className="results-meta">
          <span>{totalResults.toLocaleString()} results for <em>"{query}"</em></span>
          <span>Page {page} of {totalPages}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="empty-state">
          <span className="empty-icon">⊘</span>
          <p className="empty-title">{error}</p>
          <p className="empty-sub">Try a different title or check your spelling.</p>
        </div>
      )}

      {/* Skeleton cards while loading */}
      {loading && <SkeletonGrid count={8} />}

      {/* Search results grid */}
      {!loading && sortedMovies.length > 0 && (
        <>
          <div className="movies-grid">
            {sortedMovies.map((movie, index) => (
              <MovieCard key={movie.imdbID} movie={movie} index={index} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {/* Trending section — only shown before the user searches */}
      {!hasSearched && !loading && (
        <>
          <div className="section-header">
            <h2 className="section-title">Trending now</h2>
            <span className="section-sub">Handpicked classics &amp; hits</span>
          </div>

          {trendingLoading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="movies-grid">
              {trending.map((movie, index) => (
                <MovieCard key={movie.imdbID} movie={movie} index={index} />
              ))}
            </div>
          )}
        </>
      )}

    </main>
  );
}
