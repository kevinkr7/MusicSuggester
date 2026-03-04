import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const resolveAudioUrl = (audioUrl) => {
  if (!audioUrl) return "";
  if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://")) return audioUrl;
  return `${API_BASE}/uploads/${audioUrl}`;
};

export default function SongList({ mood }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({});
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

  useEffect(() => {
    setCurrentlyPlaying(null);
    Object.values(audioRefs.current).forEach((audio) => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    });
  }, [mood]);

  const visibleSongs = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    const filtered = songs.filter((song) => {
      const title = song.title?.toLowerCase() || "";
      const artist = song.artist?.toLowerCase() || "";
      return title.includes(lowered) || artist.includes(lowered);
    });

    return filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [songs, query]);

  const toggleFavorite = (id) => {
    if (!id) return;
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const togglePlayback = async (songKey) => {
    const audio = audioRefs.current[songKey];
    if (!audio) {
      console.error("No audio element found for key:", songKey);
      return;
    }

    // Log the URL to your console to see if it's actually correct
    console.log("Attempting to play:", audio.src);

    if (currentlyPlaying === songKey) {
      audio.pause();
      setCurrentlyPlaying(null);
      return;
    }

    // Reset other playing tracks
    if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
      audioRefs.current[currentlyPlaying].pause();
      audioRefs.current[currentlyPlaying].currentTime = 0;
    }

    try {
      // Crucial: Load the source before playing
      audio.load();
      await audio.play();
      setCurrentlyPlaying(songKey);
    } catch (error) {
      // This will tell you if the file format is wrong or if the file is missing (404)
      console.error("Playback Error:", error.name, error.message);
    }
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
          const songKey = song.id || `${song.title}-${index}`;
          const isFavorite = Boolean(song.id && favorites.includes(song.id));
          const audioUrl = resolveAudioUrl(song.audio_url);
          const isPlaying = currentlyPlaying === songKey;

          return (
            <article key={songKey} className="song-card">
              <div>
                <p className="song-index">#{index + 1}</p>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
                <small>{song.mood}</small>

                {audioUrl ? (
                  <div className="player-row">
                    <audio
                      preload="none"
                      ref={(node) => {
                        audioRefs.current[songKey] = node;
                      }}
                      src={audioUrl}
                      onEnded={() => setCurrentlyPlaying(null)}
                    />
                    <button className="player-btn" onClick={() => togglePlayback(songKey)}>
                      {isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                  </div>
                ) : (
                  <p className="muted">No audio file linked yet.</p>
                )}
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
