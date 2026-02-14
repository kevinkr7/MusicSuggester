import { useState } from "react";
import SongList from "./SongList";

const moods = [
  { label: "Happy", icon: "😊", value: "Happy", color: "#f59e0b" },
  { label: "Heartbroken", icon: "💔", value: "Heartbroken", color: "#fb7185" },
  { label: "Chill", icon: "🌙", value: "Chill", color: "#22d3ee" },
  { label: "Workout", icon: "🔥", value: "Workout & GYM", color: "#34d399" },
];

export default function MoodDashboard() {
  const [mood, setMood] = useState("Happy");

  return (
    <div>
      <h2>How are you feeling right now?</h2>
      <p className="section-subtitle">Choose a mood to unlock a dynamic playlist view.</p>
      <div className="mood-grid">
        {moods.map((m) => (
          <button
            key={m.value}
            className={`mood-chip ${mood === m.value ? "selected" : ""}`}
            style={{ "--chip-color": m.color }}
            onClick={() => setMood(m.value)}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
      <SongList mood={mood} />
    </div>
  );
}
