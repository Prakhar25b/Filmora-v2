# 🎬 Cinemate — Beginner's Complete Guide

> **Version:** Beginner (simplified code)
> **Stack:** React 19 · Vite · React Router v6 · OMDB API · TMDB API
> **Who this is for:** Anyone learning React, JavaScript, or MERN stack development

---

## Table of Contents

1. [What This App Does](#what-this-app-does)
2. [Tech Stack Explained](#tech-stack-explained)
3. [Project Structure](#project-structure)
4. [How to Run](#how-to-run)
5. [API Keys Setup](#api-keys-setup)
6. [File-by-File Code Walkthrough](#file-by-file-code-walkthrough)
   - [main.jsx](#mainjsx)
   - [App.jsx](#appjsx)
   - [AppContext.jsx](#appcontextjsx)
   - [useSearch.js](#usesearchjs)
   - [Header.jsx](#headerjsx)
   - [MovieCard.jsx](#moviecardjsx)
   - [SkeletonGrid.jsx](#skeletongridjsx)
   - [Pagination.jsx](#paginationjsx)
   - [DiscoverPage.jsx](#discoverpagejsx)
   - [MovieDetailPage.jsx](#moviedetailpagejsx)
   - [SavedPage.jsx](#savedpagejsx)
   - [HistoryPage.jsx](#historypagejsx)
7. [Key Concepts Explained](#key-concepts-explained)
8. [Features Breakdown](#features-breakdown)
9. [Common Errors and Fixes](#common-errors-and-fixes)

---

## What This App Does

Cinemate is a movie discovery and tracking app. Here is everything a user can do:

- **Search** any movie or TV series by typing — results appear automatically after a short pause
- **View trending films** on the home screen before searching anything
- **Open a movie detail page** at its own URL (e.g. `/movie/tt0111161`) with full info, ratings bars, cast, and a trailer
- **Save favourites** by tapping the heart icon — saved films appear on the Saved tab
- **Track watch history** — every detail page you open is automatically logged with a timestamp
- **Toggle light/dark mode** — preference is remembered even after refreshing the page
- **Share a film** — copy its URL to clipboard with one click
- **Browse multiple pages** of results using the pagination controls

---

## Tech Stack Explained

| Tool | What it is | Why we use it |
|---|---|---|
| **React 19** | A JavaScript library for building user interfaces | Lets us break the UI into reusable components instead of writing one giant HTML file |
| **Vite** | A development server and build tool | Starts the app instantly, refreshes the browser automatically when you save a file |
| **React Router v6** | A library for navigation in React apps | Gives each page its own URL so the browser back button works and links are shareable |
| **OMDB API** | A free movie database API | Provides search results, movie details, ratings, plots, and cast info |
| **TMDB API** | The Movie Database API (free) | Provides embedded trailer videos, cast headshot photos, and backdrop images |
| **localStorage** | A built-in browser storage feature | Saves favourites, history, and theme preference so they survive page refreshes |
| **CSS Variables** | A CSS feature for storing reusable values | Powers the light/dark theme switching across the whole app |

---

## Project Structure

```
cinemate/
│
├── public/
│   └── favicon.svg              ← The small icon shown in the browser tab
│
├── src/
│   ├── context/
│   │   └── AppContext.jsx        ← Global shared data: favorites, history, theme, API cache
│   │
│   ├── hooks/
│   │   └── useSearch.js          ← Custom hook: all search logic in one place
│   │
│   ├── components/               ← Reusable UI pieces used across multiple pages
│   │   ├── Header.jsx            ← The sticky top navigation bar
│   │   ├── MovieCard.jsx         ← One movie card in a grid
│   │   ├── Pagination.jsx        ← Page number controls (Prev / 1 2 3 / Next)
│   │   └── SkeletonGrid.jsx      ← Animated placeholder cards shown while loading
│   │
│   ├── pages/                    ← One file per page/route of the app
│   │   ├── DiscoverPage.jsx      ← Home page: search bar + trending section
│   │   ├── MovieDetailPage.jsx   ← Full detail page for one movie
│   │   ├── SavedPage.jsx         ← Shows all saved/favourite films
│   │   └── HistoryPage.jsx       ← Shows recently viewed films grouped by date
│   │
│   ├── App.jsx                   ← Sets up the routes (which URL shows which page)
│   ├── App.css                   ← All the styling for every component
│   ├── index.css                 ← Tiny base reset (removes default browser margin)
│   └── main.jsx                  ← The entry point — where React starts up
│
├── .env.example                  ← Template for your API keys (rename to .env)
├── index.html                    ← The single HTML file the whole app lives inside
├── package.json                  ← Project info and list of dependencies
└── eslint.config.js              ← Code quality rules
```

---

## How to Run

**Step 1 — Extract the ZIP**

Right-click the downloaded file and extract it. Open the extracted folder. You should see `package.json` directly inside (not inside another folder).

**Step 2 — Open a terminal in that folder**

On Windows: hold Shift, right-click inside the folder, choose "Open PowerShell window here"
On Mac: right-click the folder, choose "New Terminal at Folder"

**Step 3 — Install dependencies**

```bash
npm install
```

This downloads React, Vite, React Router and everything else the app needs. It creates a `node_modules` folder — this is normal, do not delete it.

**Step 4 — Add your API keys**

```bash
# On Mac/Linux:
cp .env.example .env

# On Windows (PowerShell):
copy .env.example .env
```

Open `.env` in any text editor and fill in your keys (see API Keys section below).

**Step 5 — Start the app**

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`. The app works without a TMDB key — trailers will fall back to a YouTube search link.

---

## API Keys Setup

### OMDB Key (required)

1. Go to https://www.omdbapi.com/apikey.aspx
2. Choose "FREE! (1,000 daily limit)" and enter your email
3. Check your email for the activation link
4. Copy the key and paste it in `.env`:

```
VITE_OMDB_KEY=abc12345
```

### TMDB Key (optional but recommended)

1. Create a free account at https://www.themoviedb.org
2. Go to Settings → API → click "Request an API Key"
3. Choose "Developer", fill in the short form
4. Copy the "API Key (v3 auth)" value and paste it in `.env`:

```
VITE_TMDB_KEY=your_tmdb_key_here
```

Without TMDB: the trailer button links to a YouTube search instead of playing inline. No cast photos or backdrop images.

With TMDB: trailers play in an embedded popup, cast headshots appear, and movie detail pages show a cinematic backdrop.

---

## File-by-File Code Walkthrough

---

### main.jsx

This is the very first file React reads. Think of it as the "ignition switch" — it starts the engine.

```jsx
import { StrictMode } from "react";
```
`StrictMode` is a React development tool. It runs every component twice in development to help catch bugs. It has no effect in the final build.

```jsx
import { createRoot } from "react-dom/client";
```
`createRoot` is the modern React 18+ way of mounting your app onto the HTML page. It targets the `<div id="root">` in `index.html`.

```jsx
import { BrowserRouter } from "react-router-dom";
```
`BrowserRouter` activates React Router. Without this wrapper, `<Route>` and `<Link>` would not work anywhere in the app. It must wrap everything.

```jsx
import { AppProvider } from "./context/AppContext";
```
`AppProvider` is our custom global state wrapper. It must wrap everything so every component can access shared data like favorites and history.

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
```
Reading from the inside out:
- `App` is our actual application
- `AppProvider` wraps it so all components share the same data
- `BrowserRouter` wraps it so routing works
- `StrictMode` wraps everything to catch bugs in development

---

### App.jsx

This file defines the routes — which URL shows which page component.

```jsx
import { Routes, Route } from "react-router-dom";
```
`Routes` is the container for all your routes. `Route` defines a single URL → component mapping.

```jsx
import Header from "./components/Header";
```
The Header is imported here because it appears on every single page. It lives outside `<Routes>` so it is always visible.

```jsx
<div className="app">
  <div className="grain" aria-hidden="true" />
```
The `grain` div creates a subtle film-grain texture overlay using CSS. `aria-hidden="true"` tells screen readers to ignore it since it is purely decorative.

```jsx
  <Header />
  <Routes>
    <Route path="/"              element={<DiscoverPage />} />
    <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
    <Route path="/saved"         element={<SavedPage />} />
    <Route path="/history"       element={<HistoryPage />} />
  </Routes>
```
- `path="/"` — the home page, shown at `localhost:5173/`
- `path="/movie/:imdbID"` — the colon means `:imdbID` is a variable. When you visit `/movie/tt0111161`, React Router extracts `tt0111161` and passes it to `MovieDetailPage`
- `path="/saved"` — the favourites page
- `path="/history"` — the watch history page

---

### AppContext.jsx

This is the most important file in the project. It is a "global store" — one place where all shared data lives, so any component anywhere in the app can read or update it without passing data through props.

**Why do we need this?**

Without Context, if `MovieCard` needed to toggle a favourite, it would need the `favorites` array passed down from `App` → `DiscoverPage` → `MovieCard`. That is called "prop drilling" and gets messy fast. With Context, `MovieCard` just calls `useApp()` and gets everything directly.

```jsx
import { createContext, useContext, useState, useEffect } from "react";
```
- `createContext` — creates the Context object
- `useContext` — lets a component read from that Context
- `useState` — stores values that cause re-renders when they change
- `useEffect` — runs side effects (like loading from localStorage) after render

```jsx
const AppContext = createContext();
```
Creates an empty Context. Think of it as creating an empty container that we will fill with data.

```jsx
export function AppProvider({ children }) {
```
`AppProvider` is a component that wraps the whole app (see `main.jsx`). The `children` prop means "whatever is nested inside this component" — in our case, that is the entire app.

```jsx
  const [favorites,    setFavorites]    = useState([]);
  const [history,      setHistory]      = useState([]);
  const [detailsCache, setDetailsCache] = useState({});
  const [tmdbCache,    setTmdbCache]    = useState({});
  const [theme,        setTheme]        = useState("dark");
```
These five `useState` calls create the global pieces of data:
- `favorites` — array of saved movie objects
- `history` — array of recently viewed movie objects (each with a `viewedAt` timestamp)
- `detailsCache` — an object used as a dictionary: `{ "tt0111161": { Title: "...", ... } }`. Prevents fetching the same movie twice
- `tmdbCache` — same idea but for TMDB data (trailers, cast, backdrop)
- `theme` — either `"dark"` or `"light"`

```jsx
  const OMDB_KEY = import.meta.env.VITE_OMDB_KEY || "a6d5380b";
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || "";
```
`import.meta.env` is how Vite reads your `.env` file. If the key is not set, OMDB falls back to a default demo key. TMDB falls back to an empty string (which disables TMDB features gracefully).

**Loading from localStorage on startup:**

```jsx
  useEffect(() => {
    const savedFavs    = localStorage.getItem("cm_fav");
    const savedHistory = localStorage.getItem("cm_history");
    const savedTheme   = localStorage.getItem("cm_theme");

    if (savedFavs)    setFavorites(JSON.parse(savedFavs));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme)   setTheme(savedTheme);
  }, []);
```
`useEffect` with an empty `[]` dependency array runs exactly once — right after the app first loads. `localStorage.getItem` reads a string. `JSON.parse` converts that string back into a JavaScript array or object. The `if` checks make sure we only call `setFavorites` if there is actually something saved (otherwise `JSON.parse(null)` would crash).

**Saving to localStorage when data changes:**

```jsx
  useEffect(() => {
    localStorage.setItem("cm_fav", JSON.stringify(favorites));
  }, [favorites]);
```
The `[favorites]` dependency array means "run this effect every time `favorites` changes". `JSON.stringify` converts the array to a string because localStorage can only store strings. This is how data persists after a page refresh.

**fetchDetails function:**

```jsx
  async function fetchDetails(imdbID) {
    if (detailsCache[imdbID]) return detailsCache[imdbID];
```
Before making an API call, check the cache. If we already fetched this movie, return immediately. This is critical because `MovieCard` calls `fetchDetails` for every card in the grid — without the cache, we would fire 10 API calls every time results load.

```jsx
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_KEY}`);
      const data = await response.json();
```
`fetch` makes an HTTP GET request to the OMDB API. `await` pauses execution until the response arrives. `.json()` parses the response body from a string into a JavaScript object. `await` is needed on `.json()` too because it is also asynchronous.

```jsx
      if (data.Response === "True") {
        setDetailsCache(prev => ({ ...prev, [imdbID]: data }));
        return data;
      }
```
OMDB sends back `Response: "True"` or `Response: "False"`. If successful, we update the cache. `prev => ({ ...prev, [imdbID]: data })` is the safe way to update an object in state — spread the old object (`...prev`) and add the new key (`[imdbID]: data`) without losing existing cached entries.

**fetchTmdb function:**

This function does three separate API calls in sequence to get trailer and cast data:

1. Call `/find/{imdbID}` to look up the TMDB id from an IMDB id
2. Call `/{type}/{tmdbId}/videos` to get the trailer YouTube key
3. Call `/{type}/{tmdbId}/credits` to get the cast list

```jsx
      const videosResponse = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${TMDB_KEY}`
      );
      const videosData = await videosResponse.json();
```
Notice how we always `await` the fetch, then `await` the `.json()` on the response. Two separate awaits are always needed.

```jsx
      const trailer = videosData.results?.find(
        v => v.type === "Trailer" && v.site === "YouTube"
      ) || videosData.results?.[0];
```
The `?.` is optional chaining — if `results` is undefined, it returns `undefined` instead of throwing an error. `.find()` searches the array for the first item matching the condition. If no YouTube trailer is found, we fall back to `results[0]` (whatever the first video is).

**toggleFav function:**

```jsx
  function toggleFav(movie) {
    const alreadySaved = favorites.find(m => m.imdbID === movie.imdbID);
    if (alreadySaved) {
      setFavorites(favorites.filter(m => m.imdbID !== movie.imdbID));
    } else {
      setFavorites([movie, ...favorites]);
    }
  }
```
`.find()` searches the array and returns the matching item (or `undefined` if not found). If the movie is already saved, we remove it using `.filter()` which returns a new array with that one item excluded. If not saved, we add it at the front using spread syntax `[movie, ...favorites]`.

**addToHistory function:**

```jsx
  function addToHistory(movie) {
    const withoutDuplicate = history.filter(m => m.imdbID !== movie.imdbID);
    const newEntry = { ...movie, viewedAt: Date.now() };
    setHistory([newEntry, ...withoutDuplicate].slice(0, 30));
  }
```
First remove any existing entry for this movie (so it moves to the top instead of appearing twice). Then create a new entry with `viewedAt: Date.now()` — `Date.now()` returns the current time as a number (milliseconds since Jan 1, 1970). `{ ...movie, viewedAt: ... }` copies all movie properties and adds the new `viewedAt` field. `.slice(0, 30)` keeps only the 30 most recent entries.

**The Provider return:**

```jsx
  return (
    <AppContext.Provider value={{ favorites, toggleFav, isFav, ... }}>
      {children}
    </AppContext.Provider>
  );
```
`AppContext.Provider` makes all the listed values available to every component inside it. `value` is the object that components receive when they call `useApp()`.

```jsx
export function useApp() {
  return useContext(AppContext);
}
```
This is the custom hook. Any component can import `useApp` and call it to get the context values. `const { favorites, toggleFav } = useApp()` — this one line gives you access to everything.

---

### useSearch.js

A custom hook that owns all the state and logic for searching. By putting this in its own file, `DiscoverPage` stays clean and focused on rendering.

**What is a custom hook?**

A hook is just a function that starts with `use` and uses other React hooks inside it. Custom hooks are how you extract and reuse stateful logic. `useSearch` is called inside `DiscoverPage` like this: `const { query, movies, loading } = useSearch()`.

```jsx
const RESULTS_PER_PAGE = 10;
```
OMDB returns 10 results per page. This constant is defined at the top so if OMDB ever changes it, there is only one place to update.

```jsx
  const debounceTimer = useRef(null);
```
`useRef` stores a value that persists between renders but does NOT cause a re-render when it changes. We use it to hold the `setTimeout` timer ID so we can cancel it with `clearTimeout`. If we used `useState` for this, changing the timer ID would trigger a re-render, which would cause an infinite loop.

**searchMovies function:**

```jsx
  async function searchMovies(searchQuery, pageNum, type) {
    if (!searchQuery.trim()) {
```
`searchQuery.trim()` removes whitespace from both ends of the string. `.trim()` returning an empty string is "falsy" in JavaScript, so `!searchQuery.trim()` means "if the query is empty or just spaces".

```jsx
      const typeParam = type ? `&type=${type}` : "";
      const url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&page=${pageNum}&apikey=${OMDB_KEY}${typeParam}`;
```
`encodeURIComponent` converts special characters like spaces into URL-safe codes (spaces become `%20`). `type ? ... : ""` is a ternary — if `type` has a value, add `&type=movie` to the URL; otherwise add nothing.

```jsx
      setTotalResults(parseInt(data.totalResults, 10));
```
`parseInt(data.totalResults, 10)` converts the string `"340"` into the number `340`. The `10` means "parse as base 10 (decimal)" — always include this second argument.

**handleQueryChange function:**

```jsx
  function handleQueryChange(value) {
    setQuery(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
      searchMovies(value, 1, typeFilter);
    }, 500);
  }
```
This is the debounce pattern. Every time the user types a character:
1. Update the displayed text in the input immediately (`setQuery`)
2. Cancel the previous timer (`clearTimeout`)
3. Start a new 500ms timer
4. If the user stops typing for 500ms, the timer fires and `searchMovies` is called

Without debounce, typing "batman" would fire 6 API calls (b, ba, bat, batm, batma, batman). With debounce, only 1 call fires — when the user pauses.

---

### Header.jsx

The sticky navigation bar at the top of every page.

```jsx
import { NavLink } from "react-router-dom";
```
`NavLink` is like `<a>` but for React Router. It automatically knows which route is active and applies an `active` class. We use this to highlight the current tab.

```jsx
  <NavLink
    to="/"
    end
    className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
  >
```
The `className` prop accepts a function that receives `{ isActive }` — React Router tells us if this route is currently active. We use a ternary to add the `"active"` CSS class when it is. The `end` prop on the home route means "only mark as active if the URL is exactly `/`" — without `end`, the home tab would also be active on `/movie/...` because both start with `/`.

---

### MovieCard.jsx

One card in the movie grid. Clicking the poster navigates to the detail page. Clicking the heart saves/unsaves.

```jsx
  const details = detailsCache[movie.imdbID];
```
Looks up the movie's details in the global cache. This may be `undefined` if they haven't loaded yet — the component handles this gracefully by showing skeleton lines.

```jsx
  const poster = movie.Poster !== "N/A" ? movie.Poster : null;
```
OMDB sends the string `"N/A"` when a movie has no poster image. We convert this to `null` so we can easily check `if (poster)` later.

```jsx
  function handleFavClick(e) {
    e.stopPropagation();
    toggleFav(movie);
  }
```
`e.stopPropagation()` is essential here. The heart button is inside the poster div, which has an `onClick` to navigate to the detail page. Without `stopPropagation`, clicking the heart would ALSO trigger the navigation. `stopPropagation` prevents the click event from "bubbling up" to the parent element.

```jsx
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
```
This staggers the card entry animations. Card 0 appears at 0ms, card 1 at 40ms, card 2 at 80ms etc. `Math.min(index, 10)` caps the delay at 400ms so cards far down the list don't wait too long.

---

### SkeletonGrid.jsx

Displays animated placeholder cards while real data is loading.

```jsx
  {Array.from({ length: count }).map((_, i) => (
```
`Array.from({ length: count })` creates an array with `count` empty slots. We use `_` as the variable name for the element value (convention for "I don't need this value") and `i` for the index (used as the `key`).

The CSS class `skeleton-poster`, `skeleton-line` etc. have a CSS `shimmer` animation that pulses opacity to create the loading effect.

---

### Pagination.jsx

```jsx
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end   = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
```
This calculates which page numbers to show. If you are on page 7 of 20 with `maxVisible = 5`, it shows `[5, 6, 7, 8, 9]` — centred around the current page. The third line handles edge cases near the end of the list (e.g. page 19 of 20 shows `[16, 17, 18, 19, 20]`).

```jsx
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
```
Creates an array `[5, 6, 7, 8, 9]` by starting from `start` and adding `i` (0, 1, 2, 3, 4).

---

### DiscoverPage.jsx

The home page. Combines the search bar, filter controls, search results, and the trending section.

```jsx
  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (alreadyFetched.current) return;
    alreadyFetched.current = true;
    loadTrending();
  }, []);
```
React Strict Mode (active in development) intentionally runs every `useEffect` twice to find bugs. Without the `alreadyFetched` ref guard, the trending section would make 16 API calls on startup instead of 8. The ref is set to `true` after the first run, so the second run hits `return` immediately.

**loadTrending function:**

```jsx
    const promises = TRENDING_IDS.map(id =>
      fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDB_KEY}`)
        .then(r => r.json())
        .catch(() => null)
    );
    const results = await Promise.all(promises);
```
`TRENDING_IDS.map(...)` creates an array of 8 fetch promises (one per trending movie). `Promise.all(promises)` runs all 8 fetches at the same time and waits for all of them to finish. This takes roughly the same time as one fetch — much faster than fetching them one by one in a loop. `.catch(() => null)` means if any single fetch fails, it returns `null` instead of crashing the whole list.

**getSortedMovies function:**

```jsx
  function getSortedMovies(movieList) {
    const moviesWithDetails = movieList.map(movie => ({
      ...movie,
      details: detailsCache[movie.imdbID],
    }));
```
The raw `movies` array from OMDB only has `Title`, `Year`, `imdbID`, and `Poster`. To sort by rating we need the full details. This merges them: `{ ...movie, details: detailsCache[movie.imdbID] }`.

```jsx
      case "rating_desc":
        return [...moviesWithDetails].sort((a, b) => {
          const ratingA = parseFloat(a.details?.imdbRating) || 0;
          const ratingB = parseFloat(b.details?.imdbRating) || 0;
          return ratingB - ratingA;
        });
```
`[...moviesWithDetails]` creates a copy before sorting — `Array.sort()` modifies the original array in place, which would mutate React state directly (a React anti-pattern). `parseFloat` converts `"8.3"` to `8.3`. `|| 0` means "if rating is missing, treat it as 0". `.sort((a, b) => ratingB - ratingA)` sorts descending (highest first): if the result is positive, `b` comes first.

---

### MovieDetailPage.jsx

The full detail page for a single movie. Its URL is `/movie/:imdbID`.

```jsx
  const { imdbID } = useParams();
```
`useParams()` from React Router reads the URL parameters. When the user visits `/movie/tt0111161`, `useParams()` returns `{ imdbID: "tt0111161" }`.

```jsx
  useEffect(() => {
    window.scrollTo({ top: 0 });
    loadMovie();
  }, [imdbID]);
```
The `[imdbID]` dependency means this effect re-runs whenever the `imdbID` changes. This handles clicking a cast member link that navigates to a different movie — the page scrolls to the top and loads the new movie's data.

**loadMovie function:**

```jsx
  async function loadMovie() {
    setLoading(true);
    const detail = detailsCache[imdbID] || await fetchDetails(imdbID);
```
Uses the short-circuit `||` operator: if `detailsCache[imdbID]` exists (truthy), use it. If not (undefined/falsy), `await fetchDetails(imdbID)` to fetch it. This avoids a redundant API call when navigating back to a movie you already opened.

**getRatingBars function:**

```jsx
      if (rating.Value.includes("/10")) {
        percent = (parseFloat(rating.Value) / 10) * 100;
```
OMDB Ratings array has inconsistent formats: `"8.3/10"` (IMDb), `"91%"` (Rotten Tomatoes), `"74/100"` (Metacritic). This normalises all three into a 0-100 percentage for the progress bars.

**handleCopyLink function:**

```jsx
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
```
`navigator.clipboard.writeText` copies text to the system clipboard. `window.location.href` is the full current URL. `setCopied(true)` changes the button text to "✓ Copied!". `setTimeout` resets it back to "⎘ Share" after 2 seconds.

---

### SavedPage.jsx

```jsx
  function clearAll() {
    favorites.forEach(movie => toggleFav(movie));
  }
```
Calls `toggleFav` on each saved movie. Since `toggleFav` removes a movie if it is already saved, this effectively clears the entire list. Simple reuse of existing logic.

---

### HistoryPage.jsx

```jsx
  function groupByDate(items) {
    const groups = {};
```
`groups` starts as an empty object. We will build it into something like: `{ "Today": [...], "Yesterday": [...], "Mon Jan 1": [...] }`.

```jsx
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
```
`new Date()` creates a date object for right now. `.setDate(today.getDate() - 1)` subtracts one day. This is the correct way to get "yesterday" in JavaScript.

```jsx
      if (viewedDate.toDateString() === today.toDateString()) {
        dateLabel = "Today";
```
`.toDateString()` converts a Date to a string like `"Wed Mar 26 2026"`. Comparing two dates this way ignores the time, so any movie viewed today — whether at 8am or 11pm — gets grouped under "Today".

```jsx
  {Object.entries(groupedHistory).map(([dateLabel, items]) => (
```
`Object.entries()` converts `{ "Today": [...], "Yesterday": [...] }` into `[["Today", [...]], ["Yesterday", [...]]]`. We destructure each entry into `[dateLabel, items]` in the `.map()` call.

---

## Key Concepts Explained

### What is a React Component?

A component is a JavaScript function that returns JSX (HTML-like syntax). React calls these functions and turns the returned JSX into real HTML on the page.

```jsx
function MovieCard({ movie }) {
  return <div>{movie.Title}</div>;
}
```

### What is useState?

`useState` creates a piece of data that, when changed, causes the component to re-render (update the screen).

```jsx
const [count, setCount] = useState(0);
// count is the current value (0)
// setCount is the function to change it
// 0 is the initial value
```

### What is useEffect?

`useEffect` runs code after the component renders. The dependency array controls when it runs:

```jsx
useEffect(() => { /* runs once on mount */ }, []);
useEffect(() => { /* runs whenever 'query' changes */ }, [query]);
useEffect(() => { /* runs after every render */ });
```

### What is async/await?

`async/await` makes asynchronous code (like API calls) look like normal synchronous code. Without it, you would need to chain `.then()` callbacks which get hard to read.

```jsx
// Old way (Promise chaining)
fetch(url).then(res => res.json()).then(data => setMovies(data));

// Modern way (async/await) — easier to read and debug
async function getMovies() {
  const res = await fetch(url);
  const data = await res.json();
  setMovies(data);
}
```

### What is Context API?

Context is React's built-in way of sharing data across components without passing it through every level as props. Think of it like a global variable, but React-friendly.

### What is a custom hook?

A custom hook is a function starting with `use` that contains React hooks. It is a way to extract and share logic. `useSearch` is a hook because it uses `useState` and `useRef` internally — it cannot be a plain function.

---

## Features Breakdown

| Feature | Where it lives | How it works |
|---|---|---|
| Live search | `useSearch.js` → `handleQueryChange` | Debounce: waits 500ms after last keystroke before calling OMDB |
| Skeleton loading | `SkeletonGrid.jsx` | CSS shimmer animation on placeholder divs shown while `loading === true` |
| Pagination | `useSearch.js` + `Pagination.jsx` | OMDB supports `&page=N`, Pagination renders numbered buttons |
| Sort & filter | `DiscoverPage.jsx` → `getSortedMovies` | Client-side: sorts the already-fetched results array, no new API call |
| Trending | `DiscoverPage.jsx` → `loadTrending` | Fetches 8 hardcoded IMDB IDs with `Promise.all` on page load |
| Watch history | `AppContext.jsx` → `addToHistory` | Called in `MovieDetailPage` on open, stored in localStorage |
| Favourites | `AppContext.jsx` → `toggleFav` / `isFav` | Toggle adds/removes from array, persisted in localStorage |
| Shareable URLs | React Router `<Route path="/movie/:imdbID">` | Each movie gets its own URL, browser back button works |
| TMDB trailers | `AppContext.jsx` → `fetchTmdb` | 3 sequential API calls: find TMDB id → get videos → get credits |
| Ratings bars | `MovieDetailPage.jsx` → `getRatingBars` | Parses OMDB `Ratings` array into percentage widths for CSS bars |
| Light/dark mode | `AppContext.jsx` → `toggleTheme` | Sets `data-theme` attribute on `<html>`, CSS variables switch |
| Share button | `MovieDetailPage.jsx` → `handleCopyLink` | `navigator.clipboard.writeText(window.location.href)` |

---

## Common Errors and Fixes

**`npm install` says "Cannot find package.json"**
You are in the wrong folder. Make sure `package.json` is visible when you run `ls` (Mac) or `dir` (Windows).

**Blank white screen after `npm run dev`**
Open browser developer tools (F12 → Console tab). Read the error message there. It is usually a missing import or a typo in a file path.

**"No results found" for every search**
Your OMDB API key is wrong or not activated. Check your email for the activation link from OMDB.

**Trailers not working / cast photos not showing**
You need to add `VITE_TMDB_KEY` to your `.env` file. Without it, trailers fall back to a YouTube search link — this is expected behaviour.

**Changes not showing in the browser**
Vite automatically refreshes. If it does not, try pressing `Ctrl + Shift + R` (hard refresh) in the browser.

**`useApp()` returns null / "Cannot destructure property of null"**
`AppProvider` is not wrapping the component. Check `main.jsx` — `AppProvider` must wrap `App`.
