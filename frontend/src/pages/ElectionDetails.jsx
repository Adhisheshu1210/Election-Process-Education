import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  CheckCircle,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";

const styles = `
.election-container {
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
}

.election-title {
  font-size: 42px;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(to right, #111827, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.election-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 60px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: 0.3s;
  text-align: center;
}

.card:hover {
  transform: translateY(-6px);
}

.icon-box {
  width: 70px;
  height: 70px;
  margin: auto;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  white-space: pre-line;
}

.stats {
  margin-top: 15px;
  font-weight: bold;
  color: #4f46e5;
}

.quiz-btn {
  margin-top: 50px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 30px;
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.quiz-btn:hover {
  transform: translateY(-3px);
}
`;

const sections = [
  {
    icon: BookOpen,
    title: "What is an Election?",
    description:
      "Election is a formal decision-making process by which a population chooses an individual to hold public office. It is fundamental to democracy where power resides with the people.",
    color: "#2563eb",
    stats: "Every 5 years",
  },
  {
    icon: Users,
    title: "Types of Elections",
    description:
      "General Elections: Form governments\nBy-elections: Fill vacancies\nLocal Elections: Municipal governance\nReferendums: Direct democracy",
    color: "#10b981",
    stats: "4 Types",
  },
  {
    icon: CheckCircle,
    title: "Voting Process",
    description:
      "1. Voter Registration → 2. Candidate Nomination → 3. Campaigning → 4. Voting → 5. Counting → 6. Results → 7. Government Formation",
    color: "#8b5cf6",
    stats: "7 Steps",
  },
  {
    icon: Calendar,
    title: "Key Timeline",
    description:
      "Notification: 6 months before\nNomination: 30 days before\nCampaign: 2 weeks silence\nCounting: Next day\nResults: 24 hours",
    color: "#f97316",
    stats: "6 Months",
  },
  {
    icon: Award,
    title: "Election Commission",
    description:
      "Independent constitutional body responsible for free and fair elections, enforcing rules and model code of conduct.",
    color: "#eab308",
    stats: "Independent",
  },
];

export default function ElectionDetails() {
  const navigate = useNavigate();
  return (
    <div className="election-container">
      {/* Inject CSS */}
      <style>{styles}</style>

      <h1 className="election-title">Complete Election Guide</h1>
      <p className="election-subtitle">
        Understand democracy from registration to results
      </p>

      <div className="grid">
        {sections.map((item, i) => {
          const Icon = item.icon;

          return (
            <div className="card" key={i}>
              <div
                className="icon-box"
                style={{ background: item.color }}
              >
                <Icon size={30} />
              </div>

              <div className="title">{item.title}</div>

              <div className="desc">{item.description}</div>

              <div className="stats">{item.stats}</div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <div 
          className="quiz-btn"
          style={{cursor: 'pointer'}}
          onClick={() => navigate('/dashboard/quiz')}
        >
          <span>Start Interactive Quiz</span>
          <BarChart3 />
        </div>
      </div>
    </div>
  );
}
