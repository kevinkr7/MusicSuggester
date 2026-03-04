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
      <div className="app-shell auth-shell">
        <main className="container glass-card auth-card">
          <header className="hero-copy auth-header">
            <p className="kicker">MusicSuggester 2.0</p>
            <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="hero-subtitle">
              {mode === "login"
                  ? "Sign in to access your mood studio."
                  : "Register to start discovering and uploading tracks."}
            </p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                      placeholder="Email address"
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

            {error && <div className="auth-error-box"><p className="auth-error">{error}</p></div>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
              type="button"
              className="auth-toggle-link"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
          >
            {mode === "login" ? "New user? Create an account" : "Already have an account? Sign in"}
          </button>
        </main>
      </div>
  );
}