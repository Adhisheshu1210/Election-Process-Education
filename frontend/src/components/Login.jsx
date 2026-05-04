import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./auth.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Login({ setToken }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const trimmedIdentifier = identifier.trim();
    const isEmail = trimmedIdentifier.includes("@");
    const email = isEmail ? trimmedIdentifier.toLowerCase() : "";
    const phone = isEmail ? "" : trimmedIdentifier;

    if (!trimmedIdentifier) {
      setError("Email or phone is required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, phone, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || data.message || data.error || "Invalid credentials");
      }

      if (!data.access_token) {
        throw new Error("Login failed. No token returned.");
      }

      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      toast.success("Login successful!");
      navigate("/dashboard/home", { replace: true });
    } catch (err) {
      const msg =
        err?.message?.includes("Failed to fetch")
          ? `Cannot connect to backend at ${API_URL}. Start FastAPI server and try again.`
          : (err?.message || "Login failed");
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="auth-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">Election Process Education</h1>

      </nav>

      {/* LOGIN CARD */}
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2 className="auth-title">Welcome Back</h2>

          {error && <div className="auth-error">{error}</div>}

          <input
            className="auth-input"
            placeholder="Email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />


          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn">Login</button>

          <div className="auth-link">
            <Link to="/register">Create account</Link> |{" "}
            <Link to="/forgot">Forgot password?</Link>
          </div>
          <Link to="/" className="logo">Back</Link>
        </form>
      </div>
    </div>
  );
}