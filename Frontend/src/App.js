import { useEffect, useState } from "react";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import "./App.css";

const API_BASE = "http://localhost:8080";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/session`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser({ username: data.username });
        }
      } catch (e) {
        // ignore and show auth page
      } finally {
        setCheckingSession(false);
      }
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  };

  if (checkingSession) {
    return <div className="loading-state">Loading session...</div>;
  }

  return <div className="App">{user ? <HomePage user={user} onLogout={handleLogout} /> : <AuthPage onAuthSuccess={setUser} />}</div>;
}

export default App;
