import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

// This hook handles everything related to searching movies:
// the search query, fetching results, pagination, sorting, and filtering

const RESULTS_PER_PAGE = 10;

export function useSearch() {
  const { OMDB_KEY, fetchDetails } = useApp();

  const [query,        setQuery]        = useState("");
  const [movies,       setMovies]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [hasSearched,  setHasSearched]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy,       setSortBy]       = useState("default");
  const [typeFilter,   setTypeFilter]   = useState("");

  // useRef stores the debounce timer between renders without causing re-renders
  const debounceTimer = useRef(null);

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  // Main search function — called with the search term, page number, and type filter
  async function searchMovies(searchQuery, pageNum, type) {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const typeParam = type ? `&type=${type}` : "";
      const url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&page=${pageNum}&apikey=${OMDB_KEY}${typeParam}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "False") {
        setError(data.Error || "No results found.");
        setMovies([]);
        setTotalResults(0);
      } else {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults, 10));
        // Pre-fetch details for each movie card (rating, genre etc.)
        data.Search.forEach(movie => fetchDetails(movie.imdbID));
      }
    } catch (err) {
      setError("Network error — please check your connection.");
      console.error(err);
    }

    setLoading(false);
  }

  // Called every time the user types — waits 500ms before searching
  function handleQueryChange(value) {
    setQuery(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
      searchMovies(value, 1, typeFilter);
    }, 500);
  }

  // Called when the user picks a type filter (Movies / Series / Episodes)
  function handleTypeChange(type) {
    setTypeFilter(type);
    setPage(1);
    searchMovies(query, 1, type);
  }

  // Called when user clicks a page number
  function handlePageChange(newPage) {
    setPage(newPage);
    searchMovies(query, newPage, typeFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Called when user clicks the X button in the search bar
  function clearSearch() {
    setQuery("");
    setMovies([]);
    setHasSearched(false);
    setError("");
    setPage(1);
  }

  return {
    query, handleQueryChange, clearSearch,
    movies, loading, error, hasSearched,
    page, totalPages, totalResults, handlePageChange,
    sortBy, setSortBy,
    typeFilter, handleTypeChange,
  };
}
