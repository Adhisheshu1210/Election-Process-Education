import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, MessageCircle, BarChart3, Clock, CheckCircle } from "lucide-react";
import "./Landing.css";

const features = [
  {
    icon: <MessageCircle className="icon blue" />,
    title: "AI Chatbot",
    desc: "Ask any election-related question and get instant simplified answers."
  },
  {
    icon: <BarChart3 className="icon green" />,
    title: "Quiz System",
    desc: "Test your understanding of the election process interactively."
  },
  {
    icon: <Clock className="icon purple" />,
    title: "Election Timeline",
    desc: "Visual step-by-step election process from start to result."
  },
  {
    icon: <BookOpen className="icon cyan" />,
    title: "Election Knowledge Hub",
    desc: "Learn everything about voting, democracy, and election systems."
  }
];

const steps = [
  "Election Announcement by Election Commission",
  "Candidate Nomination Process",
  "Campaigning Period",
  "Voting Day Preparation",
  "Polling & Voting Process",
  "Vote Counting",
  "Result Declaration"
];

const Landing = () => {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">Election Process Education</h1>

        <div className="nav-actions">
          <Link to="/login" className="btn ghost">Login</Link>
          <Link to="/register" className="btn primary">Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h2>
          Understand Democracy with <span>Clarity & Simplicity</span>
        </h2>

        <p>
          An intelligent assistant that helps you learn the election process,
          timelines, and democratic systems in an interactive and easy way.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn primary lg">Start Learning</Link>
          <Link to="/login" className="btn ghost lg">Login</Link>
        </div>
      </section>

      {/* ABOUT PROJECT */}
      <section className="section">
        <h3>About This Platform</h3>

        <div className="info-box">
          <p>
            The <b>Election Process Education Assistant</b> is designed to help users,
            students, and citizens understand how elections work in a structured and simple way.
          </p>

          <p>
            It provides an interactive learning experience using AI chatbot support,
            quizzes, and visual timelines to make democracy easier to understand.
          </p>

          <p>
            Instead of reading complex documents, users can explore the election process step-by-step.
          </p>
        </div>
      </section>

      {/* ELECTION PROCESS STEPS */}
      <section className="section dark">
        <h3>Election Process Timeline</h3>

        <div className="timeline">
          {steps.map((step, i) => (
            <div key={i} className="timeline-item">
              <CheckCircle className="icon green" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <h3>Platform Features</h3>

        <div className="grid">
          {features.map((f, i) => (
            <div key={i} className="card">
              {f.icon}
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY USE */}
      <section className="section highlight">
        <h3>Why Use This System?</h3>

        <div className="grid">
          <div className="card">
            <h4>📘 Simple Learning</h4>
            <p>Complex election processes explained in easy steps.</p>
          </div>

          <div className="card">
            <h4>🤖 AI Assistance</h4>
            <p>Ask questions anytime and get instant explanations.</p>
          </div>

          <div className="card">
            <h4>📊 Visual Understanding</h4>
            <p>Timelines and structured flow for better clarity.</p>
          </div>

          <div className="card">
            <h4>🎯 Exam Ready</h4>
            <p>Perfect for students preparing for civics or exams.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Start Understanding Democracy Today</h3>
        <Link to="/register" className="btn primary xl">
          Get Started Now
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Election Process Education Assistant</p>
      </footer>
    </div>
  );
};

export default Landing;