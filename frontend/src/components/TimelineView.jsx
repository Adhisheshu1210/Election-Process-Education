import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

function TimelineView() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeStep] = useState(0);
  const [expandedStep, setExpandedStep] = useState(null);

  const completedCount = state.timelineProgress.completed;
  const totalCount = state.timelineProgress.total;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const isStepCompleted = (stepId) => state.timelineProgress.completed >= stepId;

  const timelineData = [
    {
      id: 1,
      title: "Election Notification",
      date: "T - 6 Months",
      description: "Election Commission announces schedule, issues notification",
      icon: Calendar,
      completed: false,
      content: "Election Commission of India (ECI) announces election schedule 6 months in advance. Issues official notification specifying key dates, constituencies, and voter info. Reference: ECI website section on election schedules."
    },
    {
      id: 2,
      title: "Voter Registration Drive",
      date: "T - 4 Months",
      description: "Voter registration camps organized",
      icon: Users,
      completed: false,
      content: "SVEEP program runs camps, door-to-door campaigns, student enrollment. Special camps for new voters, migrants, disabled. Reference: ECI SVEEP portal."
    },
    {
      id: 3,
      title: "Nomination Filing",
      date: "T - 30 Days",
      description: "Candidates file nominations and scrutiny",
      icon: CheckCircle,
      completed: true
    },
    {
      id: 4,
      title: "Campaign Period",
      date: "T - 30 to T - 2 Days",
      description: "Political campaigns and rallies",
      icon: TrendingUp,
      completed: true
    },
    {
      id: 5,
      title: "Silent Period",
      date: "T - 48 Hours",
      description: "No campaigning allowed",
      icon: MapPin,
      completed: true
    },
    {
      id: 6,
      title: "Polling Day",
      date: "Election Day",
      description: "Voting at polling stations",
      icon: Calendar,
      completed: false
    },
    {
      id: 7,
      title: "Counting & Results",
      date: "T + 1 Day",
      description: "Votes counted and results declared",
      icon: Award,
      completed: false
    }
  ];

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Election Process Timeline</h1>
        <p style={styles.subtitle}>
          Complete journey from notification to government formation
        </p>
      </div>

      {/* TIMELINE */}
      <div style={styles.timelineWrapper}>
        <div style={styles.line}></div>

        {timelineData.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isCompleted = isStepCompleted(step.id);
          const isExpanded = expandedStep === step.id;

          const handleReferClick = () => {
            if (!isCompleted) {
              dispatch({
                type: 'UPDATE_TIMELINE_PROGRESS',
                payload: {
                  completed: Math.min(state.timelineProgress.completed + 1, totalCount),
                  total: totalCount
                }
              });
            }
            setExpandedStep(isExpanded ? null : step.id);
          };

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={styles.item}
            >

              {/* ICON */}
              <div
                style={{
                  ...styles.icon,
                  ...(isCompleted ? styles.completed : {}),
                  ...(isActive ? styles.active : {})
                }}
              >
                <Icon size={20} />
              </div>

              {/* CONTENT */}
              <div style={styles.card}>
                <div style={styles.topRow}>
                  <h3 
                    style={styles.heading}
                    onClick={() => window.open('https://eci.gov.in/', '_blank')}
                  >{step.title}</h3>
                  <span style={styles.date}>{step.date}</span>
                </div>

                <p style={styles.desc}>{step.description}</p>

                <div style={styles.tag}>Key Milestone</div>
                {!isStepCompleted(step.id) && (
                  <button
                    onClick={handleReferClick}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    📖 Refer Details
                  </button>
                )}
                {isExpanded && step.content && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#475569'
                  }}>
                    {step.content}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PROGRESS */}
      <div style={styles.progressBox}>
        <h3>Learning Progress</h3>

        <div style={styles.progressRow}>
          <div>
            <h2 style={{ color: "#16a34a" }}>{completedCount}/{totalCount}</h2>
            <p>Completed</p>
          </div>

          <div style={styles.bar}>
            <div style={styles.fill}></div>
          </div>

          <div>
            <h2 style={{ color: "#4f46e5" }}>{progressPercent}%</h2>
            <p>Overall</p>
          </div>
        </div>
      </div>

      {/* QUIZ BUTTON */}
      <div style={styles.progressBox}>
        <h3>Ready to Test Knowledge?</h3>
        <button
          onClick={() => navigate('/dashboard/quiz')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'linear-gradient(to right, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          🎯 Start Interactive Quiz
        </button>
      </div>

      {/* CSS (INLINE STYLE OBJECTS) */}
      <style>{`
        body {
          margin: 0;
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}

export default TimelineView;

/* ================= INLINE STYLES ================= */

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "auto",
    padding: "40px 20px",
    fontFamily: "Arial"
  },

  header: {
    textAlign: "center",
    marginBottom: "60px"
  },

  title: {
    fontSize: "40px",
    fontWeight: "800",
    background: "linear-gradient(to right, #111827, #4f46e5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "18px",
    marginTop: "10px"
  },

  timelineWrapper: {
    position: "relative",
    paddingLeft: "50px"
  },

  line: {
    position: "absolute",
    left: "22px",
    top: 0,
    bottom: 0,
    width: "3px",
    background: "linear-gradient(to bottom, #e5e7eb, #6366f1)",
    borderRadius: "10px"
  },

  item: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px"
  },

  icon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    border: "2px solid #d1d5db"
  },

  completed: {
    background: "#dcfce7",
    borderColor: "#22c55e",
    color: "#16a34a"
  },

  active: {
    background: "#dbeafe",
    borderColor: "#3b82f6",
    color: "#2563eb"
  },

  card: {
    background: "#fff",
    padding: "18px 22px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    width: "100%"
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  heading: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827"
  },

  date: {
    fontSize: "13px",
    background: "#f3f4f6",
    padding: "5px 10px",
    borderRadius: "20px"
  },

  desc: {
    marginTop: "8px",
    color: "#6b7280"
  },

  tag: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#4f46e5",
    fontWeight: "600"
  },

  progressBox: {
    marginTop: "70px",
    padding: "25px",
    background: "linear-gradient(to right, #eef2ff, #f0f9ff)",
    borderRadius: "18px",
    textAlign: "center"
  },

  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  },

  bar: {
    flex: 1,
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden"
  },

  fill: {
    width: "71%",
    height: "100%",
    background: "linear-gradient(to right, #22c55e, #4f46e5)"
  }
};