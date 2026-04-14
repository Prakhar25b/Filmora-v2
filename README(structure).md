# Cinemate v2 🎬

A cinematic movie search app — React 19 + Vite + React Router + OMDB + TMDB.

## What's new in v2
- React Router — every movie has its own shareable URL (/movie/tt0111161)
- Watch history — automatically tracks every film you open, grouped by date
- Trending section — curated picks shown on the home screen before any search
- TMDB integration — embedded trailer player, cast photos with headshots, backdrop images
- Ratings bars — IMDb / Rotten Tomatoes / Metacritic visualised side by side
- Share button — copies the movie URL to clipboard in one click
- Light / dark mode toggle — persists your preference
- Context API — clean global state, no prop drilling
- Custom useSearch hook — all search logic separated from UI

## Setup

1. Install dependencies
   npm install

2. Add your API keys
   cp .env.example .env

   Edit .env:
   VITE_OMDB_KEY=your_key   ← free at https://www.omdbapi.com/apikey.aspx
   VITE_TMDB_KEY=your_key   ← free at https://www.themoviedb.org/settings/api

   The app works without TMDB key — trailers fall back to YouTube search.

3. Start dev server
   npm run dev

4. Build for production
   npm run build

## Project structure

cinemate/
├── public/
│   └── favicon.svg
├── src/
│   ├── context/
│   │   └── AppContext.jsx      # Global state: favorites, history, cache, theme
│   ├── hooks/
│   │   └── useSearch.js        # Search logic: debounce, pagination, sort, filter
│   ├── components/
│   │   ├── Header.jsx          # Sticky nav with theme toggle
│   │   ├── MovieCard.jsx       # Card — navigates to /movie/:id on click
│   │   ├── Pagination.jsx      # Page controls
│   │   └── SkeletonGrid.jsx    # Shimmer loading placeholders
│   ├── pages/
│   │   ├── DiscoverPage.jsx    # Home: search + trending on load
│   │   ├── MovieDetailPage.jsx # Full detail: trailer, cast, ratings, share
│   │   ├── SavedPage.jsx       # Favorites
│   │   └── HistoryPage.jsx     # Watch history grouped by date
│   ├── App.jsx                 # Route definitions
│   ├── App.css                 # All styles
│   ├── index.css               # Base reset
│   └── main.jsx                # Entry: BrowserRouter + AppProvider
├── .env.example
├── index.html
├── package.json
└── eslint.config.js
