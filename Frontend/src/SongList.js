import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function SongList({ mood }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      const cached = localStorage.getItem("music-favorites");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!mood) return;

    setLoading(true);
    fetch(`${API_BASE}/songs/mood/${encodeURIComponent(mood)}`)
      .then((res) => res.json())
      .then((data) => {
        const allSongs = Array.isArray(data) ? data : data.songs || [];
        setSongs(allSongs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [mood]);

  useEffect(() => {
    localStorage.setItem("music-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const visibleSongs = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    const filtered = songs.filter((song) => {
      const title = song.title?.toLowerCase() || "";
      const artist = song.artist?.toLowerCase() || "";
      return title.includes(lowered) || artist.includes(lowered);
    });

    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [songs, query]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="song-section">
      <div className="song-toolbar">
        <h3>{mood ? `${mood} Tracks` : "Select a mood to see songs"}</h3>
        <input
          className="search-input"
          type="search"
          placeholder="Filter by title or artist"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading && <p>Loading tracks...</p>}

      {!loading && visibleSongs.length === 0 && mood && (
        <p className="muted">No songs found for “{mood}”. Try another mood or upload one.</p>
      )}

      <div className="song-grid">
        {visibleSongs.map((song, index) => {
          const key = song.id || `${song.title}-${index}`;
          const isFavorite = favorites.includes(song.id);

          return (
            <article key={key} className="song-card">
              <div>
                <p className="song-index">#{index + 1}</p>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
                <small>{song.mood}</small>
              </div>
              <button className="favorite-btn" onClick={() => toggleFavorite(song.id)}>
                {isFavorite ? "★ Saved" : "☆ Save"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
