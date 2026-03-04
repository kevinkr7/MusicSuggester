import { useMemo, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const AddSong = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const completion = useMemo(() => {
    const fields = [title, artist, mood, file];
    const done = fields.filter(Boolean).length;
    return Math.round((done / fields.length) * 100);
  }, [title, artist, mood, file]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("mood", mood);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE}/songs`, {
        method: "POST",
        body: formData, // Fetch automatically sets multipart/form-data headers
      });

      if (response.ok) {
        setIsDone(true);
        // Reset checkmark after 3 seconds
        setTimeout(() => setIsDone(false), 3000);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading song:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div>
        <h3>Post a New Track</h3>
        <p className="section-subtitle">Upload a song and make it discoverable.</p>

        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${completion}%` }} />
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
              type="text"
              placeholder="Song Name"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <input
              type="text"
              placeholder="Artist"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
          />
          <select
              required
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mood-select"
          >
            <option value="" disabled>-- Select a Mood --</option>
            <option value="Happy">Happy</option>
            <option value="Heartbroken">HeartBroken</option>
            <option value="Chill">Chill</option>
            <option value="Workout">Workout</option>
          </select>

          <label className="file-label">
            <span>Upload Audio File</span>
            <input
                type="file"
                accept="audio/*"
                required
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  setFile(selectedFile);
                  setFileName(selectedFile?.name || "No file selected");
                }}
            />
            <small>{fileName}</small>
          </label>

          <div className="button-group">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Song"}
            </button>
            {isDone && <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>✅</span>}
          </div>
        </form>
      </div>
  );
};