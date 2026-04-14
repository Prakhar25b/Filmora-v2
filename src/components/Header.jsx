import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Header() {
  const { favorites, history, theme, toggleTheme } = useApp();

  return (
    <header className="header">
      <div className="header-inner">

        {/* Logo — clicking takes you back to home */}
        <NavLink to="/" className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Filmora</span>
        </NavLink>

        {/* Navigation tabs */}
        <nav className="nav-tabs">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
          >
            Discover
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
          >
            History
            {history.length > 0 && (
              <span className="badge">{history.length}</span>
            )}
          </NavLink>

          <NavLink
            to="/saved"
            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
          >
            Saved
            {favorites.length > 0 && (
              <span className="badge">{favorites.length}</span>
            )}
          </NavLink>
        </nav>

        {/* Light / dark mode toggle */}
        <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀" : "☽"}
        </button>

      </div>
    </header>
  );
}
