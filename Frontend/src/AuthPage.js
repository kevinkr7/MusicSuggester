import { useState } from "react";

const API_BASE = "http://localhost:8080";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", identifier: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
    const payload =
      mode === "register"
        ? { username: form.username, email: form.email, password: form.password }
        : { identifier: form.identifier, password: form.password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Authentication failed.");
      } else {
        onAuthSuccess(data);
      }
    } catch (err) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <main className="container glass-card auth-card">
        <header className="hero-copy">
          <p className="kicker">MusicSuggester 2.0</p>
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="hero-subtitle">
            {mode === "login"
              ? "Sign in to access your mood studio."
              : "Register to start discovering and uploading tracks."}
          </p>
        </header>

        <form className="upload-form auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </>
          )}

          {mode === "login" && (
            <input
              type="text"
              placeholder="Username or Email"
              value={form.identifier}
              onChange={(e) => updateField("identifier", e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <button className="auth-toggle" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "New user? Register here" : "Already have an account? Login"}
        </button>
      </main>
    </div>
  );
}
