import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const body = new URLSearchParams({
        username: form.username,
        phone: form.phone,
        email: form.email,
        password: form.password,
        gender: form.gender,
      });

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || data.message || data.error || "Registration failed");
      }

      toast.success(data.msg || "Registered successfully!");
      setForm({
        username: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
      });
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
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

      {/* REGISTER CARD */}
      <div className="auth-container">
        <form className="auth-card" onSubmit={handleRegister}>
          <h2 className="auth-title">Create Account</h2>

          <input
            className="auth-input"
            placeholder="Username"
            value={form.username}
            required
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            className="auth-input"
            placeholder="Phone"
            value={form.phone}
            maxLength={10}
            inputMode="numeric"
            required
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            className="auth-input"
            placeholder="Email"
            type="email"
            value={form.email}
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={form.password}
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="auth-input"
            value={form.gender}
            required
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <div className="auth-link">
            <Link to="/login">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}