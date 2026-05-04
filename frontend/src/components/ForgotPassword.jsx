import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          new_password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || data.message || data.error || "Reset failed");
      }

      toast.success(data.msg || "Password reset successful");
      setEmail("");
      setPassword("");
    } catch (err) {
      const message = err.message || "Reset failed";
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="auth-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">Election Process Education</h1>

        <div className="nav-actions">
          <Link to="/login" className="logo">Back</Link>
        </div>
      </nav>

      {/* RESET CARD */}
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleReset}>
          <h2 className="auth-title">Reset Password</h2>

          <p className="text-sm text-gray-600 -mt-2 mb-1">
            Use your registered Gmail address or phone number.
          </p>

          <div className="text-xs text-gray-500 mb-2 leading-5">
            <p>Email must end with <span className="font-semibold">@gmail.com</span>.</p>
            <p>New password must be at least <span className="font-semibold">8 characters</span>, with 1 uppercase letter, 1 lowercase letter, and 1 number.</p>
          </div>

          {error && (
            <div className="auth-error mb-3">
              {error}
            </div>
          )}

          <input
            className="auth-input"
            placeholder="Email or phone"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="New Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn">Reset</button>

          <div className="auth-link">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}