import { useState } from "react";
import MoodDashboard from "./MoodDashboard";
import { AddSong } from "./AddSong";

export default function HomePage() {
    const [view, setView] = useState("dashboard");

    return (
        <div className="container">
            <nav>
                <button onClick={() => setView("dashboard")}>🎵 Dashboard</button>
                <button onClick={() => setView("add")}>➕ Add New Song</button>
            </nav>

            <hr style={{ borderColor: "#333", margin: "30px 0" }} />

            {view === "dashboard" ? <MoodDashboard /> : <AddSong />}
        </div>
    );
}