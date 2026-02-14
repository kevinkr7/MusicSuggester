import { useMemo, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const AddSong = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [fileName, setFileName] = useState("No file selected");

  const completion = useMemo(() => {
    const fields = [title, artist, mood, fileName !== "No file selected"];
    const done = fields.filter(Boolean).length;
    return Math.round((done / fields.length) * 100);
  }, [title, artist, mood, fileName]);

  return (
    <div>
      <h3>Post a New Track</h3>
      <p className="section-subtitle">Upload a song and make it discoverable for every mood explorer.</p>
      <div className="progress-wrap" aria-label="Upload form progress">
        <div className="progress-bar" style={{ width: `${completion}%` }} />
      </div>

      <form action={`${API_BASE}/songs`} method="POST" encType="multipart/form-data" className="upload-form">
        <input
          type="text"
          name="title"
          placeholder="Song Name"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          required
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />
        <input
          type="text"
          name="mood"
          placeholder="Mood (Happy, Chill, etc.)"
          required
          value={mood}
          onChange={(event) => setMood(event.target.value)}
        />
        <label className="file-label">
          <span>Upload Audio File</span>
          <input
            type="file"
            name="file"
            accept="audio/*"
            required
            onChange={(event) => setFileName(event.target.files?.[0]?.name || "No file selected")}
          />
          <small>{fileName}</small>
        </label>
        <button type="submit">Upload Song</button>
      </form>
    </div>
  );
};
