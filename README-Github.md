# 🎬 Filmora

A movie discovery and tracking app built with React + Vite. Search any film, watch trailers, save favourites, and track your viewing history — all in a dark cinematic UI.

> **This is the beginner-friendly version.** The code is written to be readable and easy to follow — every pattern is kept simple on purpose. Same features, cleaner code.

---

## ✨ Features

- 🔍 **Live search** — results appear as you type (500ms debounce, no button needed)
- 🔥 **Trending on load** — 8 curated films shown before any search
- 🎬 **Movie detail pages** — each film gets its own shareable URL (`/movie/tt0111161`)
- ▶️ **Trailer player** — embedded YouTube trailer via TMDB (falls back to search if no key)
- 🎭 **Cast row** — headshot photos from TMDB, click an actor to search their films
- ⭐ **Ratings bars** — IMDb, Rotten Tomatoes, and Metacritic side by side
- ❤️ **Favourites** — saved locally, persist after refresh
- 🕓 **Watch history** — auto-logged with timestamps, grouped by Today / Yesterday / date
- ☀️ **Light/dark mode** — toggles and remembers your preference
- 📋 **Share button** — copies the movie URL to clipboard
- 📄 **Pagination** — browse all pages of results

---

## 🛠 Tech Stack

| Tool                  | Purpose                                 |
| --------------------- | --------------------------------------- |
| React 19              | UI components and state management      |
| Vite 8                | Dev server and build tool               |
| React Router v6       | Page routing and shareable URLs         |
| OMDB API              | Movie search, details, ratings, plot    |
| TMDB API              | Trailers, cast photos, backdrop images  |
| localStorage          | Persists favourites, history, and theme |
| CSS Custom Properties | Powers the light/dark theme switch      |

---

## 🚀 Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Add API keys**

```bash
cp .env.example .env
```

Open `.env` and fill in your keys (see below).

**3. Run**

```bash
npm run dev
# Opens at http://localhost:5173
```

---

## 🔑 API Keys

### OMDB (required)

Free at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) — 1,000 requests/day

```
VITE_OMDB_KEY=your_key_here
```

### TMDB (optional but recommended)

Free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

```
VITE_TMDB_KEY=your_key_here
```

Without this: trailers link to YouTube search, no cast photos or backdrops. Everything else works fine.

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx       ← Global state: favorites, history, cache, theme
├── hooks/
│   └── useSearch.js         ← All search logic: debounce, pagination, sort, filter
├── components/
│   ├── Header.jsx           ← Sticky nav with theme toggle
│   ├── MovieCard.jsx        ← One card in the grid
│   ├── Pagination.jsx       ← Page number controls
│   └── SkeletonGrid.jsx     ← Shimmer loading placeholders
└── pages/
    ├── DiscoverPage.jsx     ← Home: search bar + trending section
    ├── MovieDetailPage.jsx  ← Full detail: trailer, cast, ratings, share
    ├── SavedPage.jsx        ← Your favourites
    └── HistoryPage.jsx      ← Watch history grouped by date
```

---

## 🧠 How the Code is Organised

This version keeps things intentionally simple. A few key decisions:

**Global state lives in one place (`AppContext.jsx`)**
Rather than passing data through every component, `AppContext` holds everything shared — favourites, history, the API cache, and the theme. Any component accesses it with one line: `const { favorites, toggleFav } = useApp()`.

**Search logic lives in its own hook (`useSearch.js`)**
All the search state (query, results, page, loading, error) and the functions to change them live in `useSearch.js`. This keeps `DiscoverPage` focused on rendering, not logic. It is a custom hook — a plain function that starts with `use` and uses other React hooks inside it.

**API results are cached to avoid duplicate requests**
When 10 movie cards load, each needs its full details (rating, genre). Without a cache, every card navigation would re-fetch. `detailsCache` in Context stores results by IMDB ID — if the data is already there, no fetch is made.

**Debounce prevents API spam**
Without debounce, typing "batman" would fire 6 requests (one per character). With a 500ms debounce, only 1 request fires — when the user pauses typing. `useRef` stores the timer ID so it can be cancelled on the next keystroke.

---

## 💡 Concepts Used

| Concept       | Where                                     | What it does                                                |
| ------------- | ----------------------------------------- | ----------------------------------------------------------- |
| `useState`    | everywhere                                | Stores values that update the screen when changed           |
| `useEffect`   | AppContext, DiscoverPage, MovieDetailPage | Runs code after render (load from localStorage, fetch data) |
| `useRef`      | useSearch                                 | Stores the debounce timer without causing re-renders        |
| `useContext`  | every component                           | Reads from AppContext without prop drilling                 |
| Custom hook   | useSearch.js                              | Extracts and reuses stateful logic                          |
| `async/await` | all fetch functions                       | Makes API calls readable and easy to follow                 |
| `Promise.all` | loadTrending                              | Fetches 8 movies at once instead of one by one              |
| React Router  | App.jsx, all pages                        | Gives each page its own URL                                 |
| localStorage  | AppContext                                | Saves favourites and history between sessions               |

---

## 🐛 Known Fixes Applied

- **React Strict Mode double-fetch** — in development React runs effects twice. A `useRef` flag (`alreadyFetched`) stops the trending section from firing 16 API calls instead of 8
- **CSS typo** — a Cyrillic character snuck into a hex colour value (`#eeecе8`), breaking light mode silently. Fixed to `#eeecea`

---

## 📸 Pages at a Glance

| Route        | Page     | What you see                              |
| ------------ | -------- | ----------------------------------------- |
| `/`          | Discover | Search bar + trending grid                |
| `/movie/:id` | Detail   | Poster, plot, ratings bars, cast, trailer |
| `/saved`     | Saved    | Your hearted films                        |
| `/history`   | History  | Recently viewed, grouped by date          |

---

_Built with React + Vite · OMDB + TMDB APIs · No UI library, just CSS_
