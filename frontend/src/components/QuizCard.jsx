import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuizCard.css";

export default function QuizCard() {
  const navigate = useNavigate();

  return (
    <div className="quiz-card-container">
      {/* HEADER */}
      <div className="quiz-card-header">
        <h2>📚 Election Quiz</h2>
        <p>Test your knowledge on election processes, voting systems, and more!</p>
      </div>

      {/* QUIZ MODES */}
      <div className="quiz-modes">
        {/* PRACTICE MODE */}
        <div className="quiz-mode-card practice">
          <div className="mode-icon">🎯</div>
          <h3>Practice Quiz</h3>
          <p>20 questions with instant feedback and explanations</p>
          <ul className="mode-features">
            <li>✓ Immediate feedback</li>
            <li>✓ See explanations</li>
            <li>✓ Learn as you go</li>
            <li>✓ No time limit</li>
          </ul>
          <button
            className="mode-btn practice-btn"
            onClick={() => navigate("/dashboard/quiz/practice")}
          >
            Start Practice Quiz
          </button>
        </div>

        {/* EXAM MODE */}
        <div className="quiz-mode-card exam">
          <div className="mode-icon">🏆</div>
          <h3>Exam Quiz</h3>
          <p>20 questions with 60-minute timer - full exam experience</p>
          <ul className="mode-features">
            <li>✓ Timed test (60 min)</li>
            <li>✓ No instant feedback</li>
            <li>✓ Final score & results</li>
            <li>✓ Track progress</li>
          </ul>
          <button
            className="mode-btn exam-btn"
            onClick={() => navigate("/dashboard/quiz/exam")}
          >
            Start Exam Quiz
          </button>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="quiz-info">
        <h4>📖 Quiz Topics</h4>
        <div className="quiz-topics">
          <span className="topic-badge">Election Process</span>
          <span className="topic-badge">Voting System</span>
          <span className="topic-badge">Voter Registration</span>
          <span className="topic-badge">Election Timeline</span>
          <span className="topic-badge">Government Formation</span>
        </div>
      </div>
    </div>
  );
}