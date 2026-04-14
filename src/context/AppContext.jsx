import { createContext, useContext, useState, useEffect } from "react";

// This file holds all shared data for the app (favorites, history, theme, cached movie details)
// Any component can access this data using the useApp() hook at the bottom

const AppContext = createContext();

export function AppProvider({ children }) {
  const [favorites,    setFavorites]    = useState([]);
  const [history,      setHistory]      = useState([]);
  const [detailsCache, setDetailsCache] = useState({}); // stores movie details so we don't re-fetch
  const [tmdbCache,    setTmdbCache]    = useState({}); // stores TMDB data (trailers, cast)
  const [theme,        setTheme]        = useState("dark");

  const OMDB_KEY = import.meta.env.VITE_OMDB_KEY || "a6d5380b";
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || "";

  // Load saved data from localStorage when the app first opens
  useEffect(() => {
    const savedFavs    = localStorage.getItem("fl_fav");
    const savedHistory = localStorage.getItem("fl_history");
    const savedTheme   = localStorage.getItem("fl_theme");

    if (savedFavs)    setFavorites(JSON.parse(savedFavs));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme)   setTheme(savedTheme);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fl_fav", JSON.stringify(favorites));
  }, [favorites]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fl_history", JSON.stringify(history));
  }, [history]);

  // Save theme and apply it to the HTML element whenever it changes
  useEffect(() => {
    localStorage.setItem("fl_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch full movie details from OMDB (uses cache to avoid duplicate requests)
  async function fetchDetails(imdbID) {
    // If we already have this movie's details, return them immediately
    if (detailsCache[imdbID]) return detailsCache[imdbID];

    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_KEY}`);
      const data = await response.json();

      if (data.Response === "True") {
        // Save to cache so next time we don't need to fetch again
        setDetailsCache(prev => ({ ...prev, [imdbID]: data }));
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
    }
    return null;
  }

  // Fetch trailer + cast from TMDB (only works if VITE_TMDB_KEY is set in .env)
  async function fetchTmdb(imdbID) {
    if (!TMDB_KEY) return null;
    if (tmdbCache[imdbID]) return tmdbCache[imdbID];

    try {
      // Step 1: find the TMDB id using the IMDB id
      const findResponse = await fetch(
        `https://api.themoviedb.org/3/find/${imdbID}?api_key=${TMDB_KEY}&external_source=imdb_id`
      );
      const findData = await findResponse.json();

      const isMovie = findData.movie_results?.length > 0;
      const item    = isMovie ? findData.movie_results[0] : findData.tv_results?.[0];
      if (!item) return null;

      const type   = isMovie ? "movie" : "tv";
      const tmdbId = item.id;

      // Step 2: fetch videos (trailers)
      const videosResponse = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${TMDB_KEY}`
      );
      const videosData = await videosResponse.json();

      // Step 3: fetch cast
      const creditsResponse = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=${TMDB_KEY}`
      );
      const creditsData = await creditsResponse.json();

      // Find the YouTube trailer
      const trailer = videosData.results?.find(
        v => v.type === "Trailer" && v.site === "YouTube"
      ) || videosData.results?.[0];

      // Get top 8 cast members
      const cast = (creditsData.cast || []).slice(0, 8).map(person => ({
        name:      person.name,
        character: person.character,
        photo:     person.profile_path
          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
          : null,
      }));

      const result = {
        trailerKey: trailer?.key || null,
        backdrop:   item.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
          : null,
        cast,
      };

      setTmdbCache(prev => ({ ...prev, [imdbID]: result }));
      return result;
    } catch (err) {
      console.error("Failed to fetch TMDB data:", err);
      return null;
    }
  }

  // Add or remove a movie from favorites
  function toggleFav(movie) {
    const alreadySaved = favorites.find(m => m.imdbID === movie.imdbID);
    if (alreadySaved) {
      setFavorites(favorites.filter(m => m.imdbID !== movie.imdbID));
    } else {
      setFavorites([movie, ...favorites]);
    }
  }

  // Check if a movie is in favorites
  function isFav(imdbID) {
    return favorites.some(m => m.imdbID === imdbID);
  }

  // Add a movie to watch history (keeps last 30, no duplicates)
  function addToHistory(movie) {
    const withoutDuplicate = history.filter(m => m.imdbID !== movie.imdbID);
    const newEntry = { ...movie, viewedAt: Date.now() };
    setHistory([newEntry, ...withoutDuplicate].slice(0, 30));
  }

  function clearHistory() {
    setHistory([]);
  }

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }

  return (
    <AppContext.Provider value={{
      favorites, toggleFav, isFav,
      history, addToHistory, clearHistory,
      detailsCache, fetchDetails,
      tmdbCache, fetchTmdb,
      theme, toggleTheme,
      OMDB_KEY, TMDB_KEY,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook — lets any component access the context with one line: const { favorites } = useApp()
export function useApp() {
  return useContext(AppContext);
}
