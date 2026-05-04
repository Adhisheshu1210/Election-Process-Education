import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./QuizResults.css";

export default function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, score, total, percentage, stats } = location.state || {};

  if (!mode) {
    return (
      <div className="results-container">
        <p>No results to display</p>
        <button onClick={() => navigate("/dashboard/quiz")}>Back to Quiz</button>
      </div>
    );
  }

  const isPassed = percentage >= 60;
  const performanceLevel =
    percentage >= 90
      ? "Excellent"
      : percentage >= 75
      ? "Good"
      : percentage >= 60
      ? "Passed"
      : "Needs Improvement";

  return (
    <div className="results-container">
      {/* RESULT CARD */}
      <div className={`results-card ${isPassed ? "passed" : "failed"}`}>
        {/* TROPHY/STATUS ICON */}
        <div className="results-icon">
          {isPassed ? "🏆" : "📚"}
        </div>

        {/* SCORE DISPLAY */}
        <h2 className="results-title">
          {isPassed ? "Congratulations!" : "Keep Learning!"}
        </h2>

        <div className="results-score">
          <div className="score-display">{score}/{total}</div>
          <div className="score-percentage">{percentage}%</div>
        </div>

        {/* PERFORMANCE LEVEL */}
        <p className={`performance-level ${performanceLevel.toLowerCase()}`}>
          {performanceLevel}
        </p>

        {/* FEEDBACK */}
        <p className="results-feedback">
          {isPassed
            ? "Great job! You have a good understanding of election processes."
            : "Don't worry! Review the topics and try again to improve your score."}
        </p>
      </div>

      {/* STATS SECTION */}
      {stats && (
        <div className="results-stats">
          <h3>📊 Your Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Practice Score</span>
              <span className="stat-value">{stats.practice || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Exam Score</span>
              <span className="stat-value">{stats.exam || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Quizzes</span>
              <span className="stat-value">{stats.total || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="results-actions">
        <button
          className="results-btn primary"
          onClick={() =>
            navigate(`/dashboard/quiz/${mode}`)
          }
        >
          {mode === "practice" ? "Retake Practice Quiz" : "Retake Exam"}
        </button>

        {mode === "practice" && (
          <button
            className="results-btn secondary"
            onClick={() => navigate("/dashboard/quiz/exam")}
          >
            Take Exam Quiz
          </button>
        )}

        <button
          className="results-btn secondary"
          onClick={() => navigate("/dashboard/home")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* TIPS SECTION */}
      <div className="results-tips">
        <h4>💡 Tips for Better Performance</h4>
        <ul>
          <li>Review the election process topics regularly</li>
          <li>Take practice quizzes before attempting exams</li>
          <li>Focus on areas where you scored lower</li>
          <li>Understand the explanations for each question</li>
        </ul>
      </div>
    </div>
  );
}
