import { Routes, Route } from "react-router-dom";
import Header          from "./components/Header";
import DiscoverPage    from "./pages/DiscoverPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import SavedPage       from "./pages/SavedPage";
import HistoryPage     from "./pages/HistoryPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />
      <Header />
      <Routes>
        <Route path="/"              element={<DiscoverPage />} />
        <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
        <Route path="/saved"         element={<SavedPage />} />
        <Route path="/history"       element={<HistoryPage />} />
      </Routes>
    </div>
  );
}
