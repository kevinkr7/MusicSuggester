import { useEffect, useState } from "react";

export default function SongList({ mood }) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mood) return;

        setLoading(true);
        fetch("http://172.21.12.191:8080/songs/mood/${mood}")
            .then((res) => res.json())
            .then((data) => {
                console.log("API Data received:", data); // Check your console!

                // 1. Ensure data is an array. If your API wraps it, use data.songs
                const allSongs = Array.isArray(data) ? data : data.songs || [];

                // 2. Flexible filtering
                const filtered = allSongs.filter((s) =>
                    s.mood.toLowerCase().includes(mood.toLowerCase())
                );

                setSongs(filtered);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [mood]);

    return (
        <div>
            <h3>{mood ? `${mood} Tracks` : "Select a mood to see songs"}</h3>

            {loading && <p>Loading tracks...</p>}

            {!loading && songs.length === 0 && mood && (
                <p style={{ color: "#b3b3b3" }}>
                    No songs found for "{mood}". <br/>
                    <small>(Check if the mood names match exactly in your database)</small>
                </p>
            )}

            {songs.map((song) => (
                <div key={song.id || song.title} className="song-card">
                    <h4 style={{ margin: "0 0 5px 0", color: "#1db954" }}>{song.title}</h4>
                    <p style={{ margin: "0", fontWeight: "bold" }}>{song.artist}</p>
                    <p style={{ fontSize: "0.8rem", color: "#b3b3b3" }}>Category: {song.mood}</p>
                </div>
            ))}
        </div>
    );
}