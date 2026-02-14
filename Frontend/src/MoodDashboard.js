import { useState } from "react";
import SongList from "./SongList";

export default function MoodDashboard() {
    const [mood, setMood] = useState("");

    const moods = [
        { label: "😊 Happy", value: "Happy" },
        { label: "💔 Sad", value: "Heartbroken" },
        { label: "🌙 Chill", value: "Chill" },
        { label: "🔥 Workout", value: "Workout & GYM" },
    ];

    return (
        <div>
            <h2>How are you feeling?</h2>
            <div style={{ marginBottom: "20px" }}>
                {moods.map((m) => (
                    <button key={m.value} onClick={() => setMood(m.value)}>
                        {m.label}
                    </button>
                ))}
            </div>
            <SongList mood={mood} />
        </div>
    );
}