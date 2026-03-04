import { useMemo, useState } from "react";
import MoodDashboard from "./MoodDashboard";
import { AddSong } from "./AddSong";
import ThreeHeroBackground from "./ThreeHeroBackground";

const tabs = [
  { key: "dashboard", label: "Discover" },
  { key: "add", label: "Upload" },
];

export default function HomePage({ user, onLogout }) {
  const [view, setView] = useState("dashboard");

  const subtitle = useMemo(
    () =>
      view === "dashboard"
        ? "Pick your vibe and uncover tracks that match your energy."
        : "Share a new song with the community and fuel the vibe machine.",
    [view]
  );

  return (
    <div className="app-shell">
      <ThreeHeroBackground />
      <main className="container glass-card">
        <header className="hero-copy">
          <p className="kicker">MusicSuggester 2.0</p>
          <div className="hero-title-row">
            <h1>Immersive Mood Studio</h1>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
          <p className="hero-subtitle">{subtitle}</p>
          <p className="muted">Signed in as @{user?.username}</p>
        </header>

        <nav className="tab-row" aria-label="Main views">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${view === tab.key ? "active" : ""}`}
              onClick={() => setView(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="view-panel">{view === "dashboard" ? <MoodDashboard /> : <AddSong />}</section>
      </main>
    </div>
  );
}
