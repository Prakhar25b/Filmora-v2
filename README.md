# 🎬 Filmora v2

A movie discovery and tracking app built with **React + Vite**. Search any film, watch trailers, save favourites, and track your viewing history — all wrapped in a cinematic dark/light UI.

> **Upgrade from v1:** This version completely restructures the codebase — from a single `App.jsx` file into a proper multi-page app with routing, global state, custom hooks, a dedicated detail page, watch history, trending section, and optional TMDB integration.

[🔗 Live Demo]( https://prakhar25b.github.io/Filmora-v2/) , [🔗 Vercel]([https://filmora-v2.vercel.app/)

---
## ✨ Features

- 🔍 **Live search** — results appear as you type (500ms debounce, no button)
- 🔥 **Trending on load** — 8 curated films shown on the home screen before any search
- 🎬 **Movie detail pages** — each film gets its own shareable URL (`/movie/tt0111161`)
- ▶️ **Trailer player** — embedded YouTube trailer via TMDB (falls back to YouTube search)
- 🎭 **Cast row** — headshot photos from TMDB, click an actor to search their films
- ⭐ **Multi-source ratings** — IMDb, Rotten Tomatoes, and Metacritic displayed as visual bars
- ❤️ **Favourites** — saved to `localStorage`, persist across sessions
- 🕓 **Watch history** — auto-logged on every movie opened, grouped by Today / Yesterday / date
- ☀️ **Light/dark mode** — toggle button in header, preference saved to `localStorage`
- 📋 **Share button** — copies the movie's URL to clipboard
- 🔢 **Pagination** — navigate all pages of search results
- 🧩 **Filter + sort** — filter by type (Movies / TV / Episodes), sort by rating, year, or title

---

## 🆕 What's New vs v1

| | v1 | v2 |
|---|---|---|
| Architecture | Single `App.jsx` file | Pages, components, context, hooks |
| Navigation | `activeTab` state variable | React Router DOM (real URLs) |
| Movie details | Pop-up modal | Full dedicated page at `/movie/:id` |
| Watch history | ❌ | ✅ Auto-logged, grouped by date |
| Trending section | ❌ | ✅ 8 curated films on load |
| Dark / light mode | ❌ | ✅ Toggle with persistence |
| Global state | Props passed down | React Context API |
| Search logic | Inline in App | `useSearch` custom hook |
| TMDB (trailers + cast) | ❌ | ✅ Optional |

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI and component state |
| Vite 8 | Dev server and bundler |
| React Router v6 | Multi-page routing |
| OMDB API | Movie search, details, ratings, plot |
| TMDB API | Trailers, cast photos, backdrop images |
| localStorage | Persist favourites, history, and theme |
| CSS Custom Properties | Light/dark theme switching |

---

## 🚀 Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/filmora-v2.git
cd filmora-v2
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your API keys**
```bash
cp .env.example .env
```
Then open `.env` and fill in:
```
VITE_OMDB_KEY=your_omdb_key_here
VITE_TMDB_KEY=your_tmdb_key_here   # optional
```

**4. Start the dev server**
```bash
npm run dev
# Opens at http://localhost:5173
```

---

## 🔑 API Keys

### OMDB (required)
Free at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) — 1,000 requests/day on the free plan.

### TMDB (optional but recommended)
Free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
Without it: trailer button opens YouTube search, no cast photos or backdrop banners. All other features work normally.

---

## 📁 Project Structure

```
src/
├── App.jsx                      ← Router only — mounts pages based on URL
├── context/
│   └── AppContext.jsx            ← Global state: favorites, history, cache, theme
├── hooks/
│   └── useSearch.js              ← All search logic: debounce, pagination, filter, sort
├── components/
│   ├── Header.jsx                ← Sticky nav with theme toggle and badge counts
│   ├── MovieCard.jsx             ← Individual card in the grid
│   ├── Pagination.jsx            ← Page number controls
│   └── SkeletonGrid.jsx          ← Shimmer loading placeholders
└── pages/
    ├── DiscoverPage.jsx          ← Home: search bar + trending grid
    ├── MovieDetailPage.jsx       ← Full detail: trailer, cast, ratings bars, share
    ├── SavedPage.jsx             ← Saved favourites
    └── HistoryPage.jsx           ← Watch history grouped by date
```

---

## 📸 Pages

| Route | Page | What's on it |
|---|---|---|
| `/` | Discover | Search bar, filters, sort, trending grid |
| `/movie/:imdbID` | Detail | Poster, plot, ratings bars, cast, trailer, share |
| `/saved` | Saved | All hearted films |
| `/history` | History | Recently viewed, grouped by date with timestamps |

---

## 🏗 Architecture Notes

**Context over prop drilling**
All shared state (favourites, history, cache, theme) lives in `AppContext.jsx`. Any component reads it with `const { favorites } = useApp()` — no props needed.

**Custom hook for search**
`useSearch.js` owns the entire search flow: query, debouncing, API call, result state, pagination, filter, and sort. `DiscoverPage` just calls the hook and renders — keeping UI and logic cleanly separated.

**API caching**
Movie details are stored in `detailsCache` inside Context. If a detail was already fetched, it's returned instantly — no duplicate network requests.

**Debounce**
A 500ms debounce on the search input means only 1 API call fires per pause in typing, not one per keystroke.

**React Strict Mode fix**
A `useRef` flag in `DiscoverPage` prevents the trending section from firing 16 API calls instead of 8 in development (React Strict Mode intentionally runs effects twice in dev).

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The output goes into `dist/` and can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

For GitHub Pages specifically, add `"homepage"` to `package.json` and a `deploy` script using `gh-pages`:
```json
"homepage": "https://YOUR_USERNAME.github.io/filmora-v2",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
Then run `npm run deploy`.

---

*Built with React + Vite · OMDB + TMDB APIs · No UI library — custom CSS only*
