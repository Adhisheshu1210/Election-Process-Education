import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Quiz.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Quiz() {
  const { mode } = useParams(); // "practice" or "exam"
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch questions based on mode
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const endpoint = mode === "practice" ? "/quiz/practice" : "/quiz/exam";
        const res = await fetch(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load questions");

        const data = await res.json();
        setQuestions(data.questions);
        
        // Set timer for exam mode (60 minutes)
        if (mode === "exam") {
          setTimeLeft(60 * 60); // 60 minutes in seconds
        }
      } catch (err) {
        toast.error(err.message || "Failed to load quiz");
        navigate("/dashboard/quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [mode, token, navigate]);

  // Exam timer
  useEffect(() => {
    if (mode !== "exam" || timeLeft === null || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz(); // Auto-submit when time ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, timeLeft, submitted]);

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (optionIndex) => {
    if (submitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));

    // Show explanation for practice mode immediately
    if (mode === "practice") {
      setShowExplanation(true);
    }
  };

  const handleNext = async () => {
    if (mode === "practice" && showExplanation) {
      // Move to next question after seeing explanation
      setShowExplanation(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleSubmitQuiz();
      }
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitted(true);
      const res = await fetch(`${API_URL}/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode,
          selectedAnswers, // Send all answers for backend validation
          total: questions.length,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");

      const data = await res.json();
      toast.success("Quiz submitted successfully!");
      
      // Navigate to results with score data
      navigate("/dashboard/quiz-results", {
        state: {
          mode,
          score: data.score,
          total: data.total_questions,
          percentage: data.percentage,
          stats: {
            practice: data.practice_score,
            exam: data.exam_score,
            total: data.total_quizzes,
          },
        },
      });
    } catch (err) {
      toast.error(err.message || "Failed to submit quiz");
      setSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return <div className="quiz-container"><p>Loading questions...</p></div>;
  }

  if (questions.length === 0) {
    return <div className="quiz-container"><p>No questions available</p></div>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="quiz-container">
      {/* HEADER */}
      <div className="quiz-header">
        <h2>{mode === "practice" ? "Practice Quiz" : "Exam Quiz"}</h2>
        {mode === "exam" && timeLeft !== null && (
          <div className={`quiz-timer ${timeLeft < 300 ? "timer-warning" : ""}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div className="quiz-progress">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <p className="progress-text">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>

      {/* QUESTION CARD */}
      <div className="quiz-card">
        <div className="quiz-topic">📚 {currentQuestion.topic}</div>
        <h3 className="quiz-question">{currentQuestion.question}</h3>

        {/* OPTIONS */}
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${
                selectedAnswers[currentQuestion.id] === index ? "selected" : ""
              }`}
              onClick={() => handleSelectAnswer(index)}
              disabled={submitted}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {/* EXPLANATION (Practice Mode) */}
        {mode === "practice" && showExplanation && isAnswered && (
          <div className="quiz-explanation">
            <p>✓ Explanation: {currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="quiz-navigation">
        <button
          className="quiz-btn-secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            className="quiz-btn-primary"
            onClick={handleSubmitQuiz}
            disabled={submitted}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            className="quiz-btn-primary"
            onClick={handleNext}
            disabled={!isAnswered || (mode === "practice" && !showExplanation)}
          >
            {mode === "practice" ? "Next →" : "Next →"}
          </button>
        )}
      </div>

      {/* ANSWER STATUS */}
      <div className="quiz-footer">
        <p>
          Answered: {Object.keys(selectedAnswers).length} / {questions.length}
        </p>
      </div>
    </div>
  );
}
