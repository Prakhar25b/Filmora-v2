# 🎬 Filmora v2 — Beginner's Upgrade Guide

> **What is this file?**
> This README explains everything that changed between **Filmora v1** (the basic version you published) and **Filmora v2** (this version). It is written for beginners — every concept is explained from scratch.

---

## 📦 What was Filmora v1?

Filmora v1 was a single-page React app where everything lived inside one giant file: `App.jsx`. It could:
- Search for movies using the OMDB API
- Show a grid of movie cards
- Open a pop-up (modal) with movie details
- Save movies to favourites using `localStorage`
- Filter by type (Movie / Series / Episode)
- Sort results
- Paginate results

It worked well — but as an app grows, keeping everything in one file becomes messy and hard to read. That is exactly what v2 fixes.

---

## 🆕 What's New in v2?

Here is a summary before we dive into each upgrade:

| Feature | v1 | v2 |
|---|---|---|
| Code structure | 1 big `App.jsx` | Split into pages, components, context, hooks |
| Navigation | Tab buttons inside App | Real URL routing (`/`, `/movie/:id`, `/saved`, `/history`) |
| Movie detail view | Pop-up modal | Full dedicated page |
| Watch history | ❌ Not present | ✅ Tracks every movie you click |
| Trending section | ❌ Not present | ✅ Shows 8 popular movies on load |
| Dark / Light mode | ❌ Not present | ✅ Toggle button in header |
| State management | All `useState` inside App | React Context (shared across all pages) |
| Custom hook | ❌ Not present | ✅ `useSearch` hook |
| TMDB integration | ❌ Not present | ✅ Real trailers + cast photos |
| Pagination component | Inline in App.jsx | Separate `Pagination.jsx` component |
| Skeleton component | Inline in App.jsx | Separate `SkeletonGrid.jsx` component |

---

## 📁 New Folder Structure

In v1, there were only two components: `App.jsx` and `MovieCard.jsx`.

In v2, the code is **split into layers**:

```
src/
├── App.jsx                  ← Just a router now (very small)
├── context/
│   └── AppContext.jsx        ← Shared data for the whole app
├── hooks/
│   └── useSearch.js          ← All search logic in one place
├── pages/
│   ├── DiscoverPage.jsx      ← The main search page
│   ├── MovieDetailPage.jsx   ← Full movie detail page
│   ├── SavedPage.jsx         ← Favourites page
│   └── HistoryPage.jsx       ← Watch history page
└── components/
    ├── Header.jsx            ← Navigation bar
    ├── MovieCard.jsx         ← Individual movie card
    ├── Pagination.jsx        ← Page number buttons
    └── SkeletonGrid.jsx      ← Loading placeholder cards
```

> **Why split the code?**
> Each file now has one job. If something breaks in pagination, you look in `Pagination.jsx`. If the search is buggy, you look in `useSearch.js`. This is called the **Single Responsibility Principle** — a very important concept in software development.

---

## 🔄 Upgrade 1: React Router DOM (Real Page Navigation)

### What changed
In v1, navigation was fake — clicking "Saved" just changed a variable called `activeTab`. The URL never changed. There was no real "page".

In v2, we added a package called **react-router-dom**. This gives the app real URLs:

| What the user does | URL in browser |
|---|---|
| Opens the app | `/` |
| Clicks on a movie | `/movie/tt0111161` |
| Goes to Saved | `/saved` |
| Goes to History | `/history` |

### Why this matters
- Users can **share links** to specific movies
- Clicking the browser's **Back button** works properly
- Each page is a real separate component — clean and organised

### How it works (beginner explanation)

**`main.jsx`** — wraps the whole app in a `BrowserRouter`:
```jsx
<BrowserRouter>
  <AppProvider>
    <App />
  </AppProvider>
</BrowserRouter>
```

**`App.jsx`** — defines which component shows for each URL:
```jsx
<Routes>
  <Route path="/"              element={<DiscoverPage />} />
  <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
  <Route path="/saved"         element={<SavedPage />} />
  <Route path="/history"       element={<HistoryPage />} />
</Routes>
```

The `:imdbID` part is a **URL parameter** — it means whatever comes after `/movie/` gets captured and passed to `MovieDetailPage` as a variable. So `/movie/tt0111161` means `imdbID = "tt0111161"`.

---

## 🏪 Upgrade 2: React Context (Shared State)

### What changed
In v1, all state (favorites, movie details cache, etc.) lived inside `App.jsx`. Every child component had to receive data through **props** (passing data down like a chain).

In v2, we created `AppContext.jsx`. Think of it as a **global store** — any component anywhere in the app can read from or write to it directly, without needing to pass props through every parent.

### What the context stores

```js
// All of this is available to every component
{
  favorites,      // Array of saved movies
  toggleFav,      // Function to save/unsave a movie
  isFav,          // Function: is this movie saved?

  history,        // Array of viewed movies (max 30)
  addToHistory,   // Called automatically when you open a movie
  clearHistory,   // Clears all history

  detailsCache,   // Object storing fetched movie details (avoids re-fetching)
  fetchDetails,   // Fetches full movie info from OMDB

  fetchTmdb,      // Fetches trailer + cast from TMDB (optional)
  tmdbCache,      // Stores TMDB data

  theme,          // "dark" or "light"
  toggleTheme,    // Switches between dark and light mode
}
```

### How to use it in any component

```jsx
import { useApp } from "../context/AppContext";

function MyComponent() {
  const { favorites, toggleFav } = useApp(); // grab only what you need
  ...
}
```

> This is called a **custom hook** pattern — `useApp()` is a shortcut to `useContext(AppContext)`.

---

## 🪝 Upgrade 3: Custom Hook — `useSearch.js`

### What changed
In v1, all search logic (the API call, debounce timer, pagination, sorting, filtering) was written directly inside `App.jsx`.

In v2, all of that logic was moved into a **custom hook** called `useSearch`. 

### What is a custom hook?
A custom hook is just a function that starts with `use` and can contain `useState`, `useRef`, `useEffect` etc. It lets you reuse logic across components without duplicating code.

### What `useSearch` does

```js
const {
  query, handleQueryChange, clearSearch,   // search input
  movies, loading, error, hasSearched,     // search results
  page, totalPages, totalResults,          // pagination
  handlePageChange,
  sortBy, setSortBy,                       // sorting
  typeFilter, handleTypeChange,            // type filter
} = useSearch();
```

`DiscoverPage` just calls `useSearch()` and gets everything it needs. The page component doesn't need to know *how* searching works — it just uses the values.

> **Analogy:** Think of `useSearch` as a remote control. `DiscoverPage` uses the remote without needing to understand the TV's electronics.

---

## 📽️ Upgrade 4: Movie Detail Page (Instead of a Modal)

### What changed
In v1, clicking a movie card opened a **modal** (a pop-up overlay) with the movie info. The modal code was inside `App.jsx`.

In v2, clicking a movie **navigates to a new URL** — `/movie/tt0111161` — which renders `MovieDetailPage.jsx`.

### What the detail page shows that the modal didn't

| Feature | v1 Modal | v2 Detail Page |
|---|---|---|
| Poster | ✅ | ✅ |
| Title, Year, Plot | ✅ | ✅ |
| Genre tags | ✅ | ✅ |
| IMDB Rating chip | ✅ | ✅ |
| Rating bars (IMDb / RT / Metacritic) | ❌ | ✅ |
| Vote count | ❌ | ✅ |
| Writer credit | ❌ | ✅ |
| Language | ❌ | ✅ |
| Country | ❌ | ✅ |
| TMDB backdrop image | ❌ | ✅ |
| Embedded trailer player | ❌ | ✅ |
| Cast with photos | ❌ | ✅ |
| Share button (copy link) | ❌ | ✅ |
| Saves to watch history automatically | ❌ | ✅ |

### How the rating bars work

OMDB returns a `Ratings` array like:
```json
[
  { "Source": "Internet Movie Database", "Value": "8.3/10" },
  { "Source": "Rotten Tomatoes",         "Value": "91%" },
  { "Source": "Metacritic",              "Value": "74/100" }
]
```

The code converts each value to a percentage (0–100) and draws a coloured bar for each — so you can visually compare all three scores at once.

---

## 📜 Upgrade 5: Watch History

### What changed
v1 had no history feature at all. v2 automatically logs every movie you open.

### How it works
- When `MovieDetailPage` loads, it calls `addToHistory(movie)`.
- `addToHistory` adds the movie to the `history` array in context, stamped with `viewedAt: Date.now()`.
- Duplicate entries are removed (if you open the same movie twice, it moves to the top).
- Only the last **30** movies are kept.
- History is saved to `localStorage` so it persists between browser sessions.

### History page features
- Movies are **grouped by date**: "Today", "Yesterday", or a formatted date like "Monday, Apr 7".
- Each entry shows the poster thumbnail, title, type, and the time you viewed it.
- A "Clear history" button wipes everything.

---

## 🔥 Upgrade 6: Trending Section

### What changed
In v1, before you searched, the page showed a blank welcome message.

In v2, the app **immediately fetches 8 curated movies** (hardcoded IMDb IDs of popular films) and displays them in a "Trending now" grid as soon as the Discover page loads.

### How it works
```js
const TRENDING_IDS = [
  "tt9362722", "tt1630029", "tt15239678", "tt6791350",
  "tt1877830", "tt21807222", "tt0848228", "tt4154796",
];
```
These are all fetched in **parallel** using `Promise.all` — meaning all 8 requests go out at the same time instead of one after another, so the page loads faster.

Once you start typing a search, the trending section disappears and results take over.

---

## 🌗 Upgrade 7: Dark / Light Mode Toggle

### What changed
v1 was dark-mode only.

v2 adds a **☀ / ☽ button** in the header that switches between dark and light themes.

### How it works
- The `theme` state (`"dark"` or `"light"`) is stored in Context and saved to `localStorage`.
- When the theme changes, the code sets an attribute on the root HTML element:
  ```js
  document.documentElement.setAttribute("data-theme", theme);
  ```
- The CSS file uses this attribute to switch colour variables:
  ```css
  [data-theme="light"] {
    --bg: #f5f5f5;
    --surface: #ffffff;
    --text: #111111;
    ...
  }
  ```

---

## 🧩 Upgrade 8: Extracted Components

Three things that were written inline in v1's `App.jsx` are now separate, reusable components:

### `SkeletonGrid.jsx`
Shows placeholder loading cards while data is being fetched.
```jsx
<SkeletonGrid count={8} />
```
Used in both `DiscoverPage` and `MovieDetailPage`.

### `Pagination.jsx`
The page number buttons (Prev / 1 2 3 … / Next).
```jsx
<Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
```
Fully self-contained — give it the current page and total pages, it handles the rest.

### `Header.jsx`
The navigation bar at the top of every page.
- Uses `NavLink` from react-router-dom, which automatically adds an `active` class to the current page's tab.
- Shows live badge counts on "History" and "Saved" tabs.
- Contains the dark/light mode toggle button.

---

## 🎬 Upgrade 9: TMDB Integration (Optional)

### What is TMDB?
[The Movie Database (TMDB)](https://www.themoviedb.org/) is a free API that provides trailers, cast photos, and backdrop images — things OMDB doesn't have.

### How to enable it
1. Sign up at [themoviedb.org](https://www.themoviedb.org/)
2. Get a free API key
3. Add it to your `.env` file:
   ```
   VITE_TMDB_KEY=your_key_here
   ```

### What TMDB adds
- **Backdrop image** — the wide cinematic banner at the top of the detail page
- **Embedded YouTube trailer** — plays directly inside the app (no redirect to YouTube)
- **Cast row** — photos of the top 8 actors with their character names

If no TMDB key is set, the app still works fine — the trailer button falls back to a YouTube search link, and the cast section simply doesn't appear.

---

## 🛠️ How to Run v2

```bash
# 1. Install dependencies
npm install

# 2. Set up your API key
cp .env.example .env
# Open .env and fill in VITE_OMDB_KEY (and optionally VITE_TMDB_KEY)

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 📚 New Concepts Introduced in v2

If you're learning React, here are the new concepts this version demonstrates:

| Concept | Where to find it |
|---|---|
| React Router DOM | `App.jsx`, `Header.jsx`, `MovieDetailPage.jsx` |
| URL parameters (`useParams`) | `MovieDetailPage.jsx` |
| Programmatic navigation (`useNavigate`) | `MovieDetailPage.jsx`, `HistoryPage.jsx` |
| React Context API | `context/AppContext.jsx` |
| Custom hooks | `hooks/useSearch.js`, `context/AppContext.jsx` |
| `Promise.all` (parallel API calls) | `DiscoverPage.jsx` (trending fetch) |
| CSS custom properties for theming | `index.css` |
| `localStorage` persistence | `AppContext.jsx` |
| `useRef` to prevent double-fetch | `DiscoverPage.jsx` |

---

*Filmora v2 — built with React 19, Vite, React Router DOM v6, OMDB API, and TMDB API.*
