import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function HistoryPage() {
  const { history, clearHistory } = useApp();
  const navigate = useNavigate();

  // Group history entries by date label (Today / Yesterday / Mon Jan 1)
  function groupByDate(items) {
    const groups = {};
    const today     = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    items.forEach(item => {
      const viewedDate = new Date(item.viewedAt);
      let dateLabel;

      if (viewedDate.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (viewedDate.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = viewedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }

      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(item);
    });

    return groups;
  }

  const groupedHistory = groupByDate(history);

  return (
    <main className="main">

      {/* Page header */}
      <section className="search-hero minimal">
        <div>
          <p className="search-eyebrow">Your viewing activity</p>
          <h2 className="section-title" style={{ marginTop: 4 }}>Watch history</h2>
        </div>
        {history.length > 0 && (
          <button className="clear-all-btn" onClick={clearHistory}>
            Clear history
          </button>
        )}
      </section>

      {/* Empty state */}
      {history.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">◷</span>
          <p className="empty-title">No history yet</p>
          <p className="empty-sub">Movies you view will appear here automatically.</p>
        </div>
      )}

      {/* History list grouped by date */}
      {Object.entries(groupedHistory).map(([dateLabel, items]) => (
        <div key={dateLabel} className="history-group">
          <p className="history-date-label">{dateLabel}</p>

          <div className="history-list">
            {items.map(movie => (
              <div
                key={movie.imdbID + movie.viewedAt}
                className="history-row"
                onClick={() => navigate(`/movie/${movie.imdbID}`)}
              >
                {/* Thumbnail */}
                <div className="history-thumb">
                  {movie.Poster && movie.Poster !== "N/A"
                    ? <img src={movie.Poster} alt={movie.Title} />
                    : <span className="cast-placeholder">◈</span>
                  }
                </div>

                {/* Title and year */}
                <div className="history-info">
                  <p className="history-title">{movie.Title}</p>
                  <p className="history-meta">{movie.Year} · {movie.Type}</p>
                </div>

                {/* Time viewed */}
                <p className="history-time">
                  {new Date(movie.viewedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

    </main>
  );
}
