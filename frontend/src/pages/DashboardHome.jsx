
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageCircle, BarChart3, Clock, Sparkles, ArrowRight, TrendingUp, Award, CalendarDays, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './DashboardHome.css';

const DashboardHome = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Quiz Score',
      value: `${state.profile.quizScore}%`,
      change: '+12%',
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-600',
      progress: state.profile.quizScore
    },
    {
      title: 'Quizzes Attempted',
      value: state.profile.totalQuizzes,
      change: '+3',
      icon: Award,
      color: 'from-blue-500 to-indigo-600',
      progress: 75
    },
    {
      title: 'Timeline Progress',
      value: `${Math.round(state.profile.timelineProgress)}%`,
      change: '+8%',
      icon: Clock,
      color: 'from-purple-500 to-pink-600',
      progress: state.profile.timelineProgress
    },
    {
      title: 'Last Activity',
      value: state.profile.lastActivity ? new Date(state.profile.lastActivity).toLocaleDateString() : 'Today',
      change: '',
      icon: CalendarDays,
      color: 'from-orange-500 to-red-600',
      progress: 100
    }
  ];

  const CircularProgress = ({ percentage, color = 'stroke-indigo-500' }) => (
    <svg className="w-16 h-16" viewBox="0 0 36 36">
      <path className="text-gray-200/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path className={`origin-center transition-all duration-1000 ${color}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={`${100 - percentage}`} />
    </svg>
  );

  return (
    <div className="dashboard-home">
      <section className="dashboard-hero">
        <div className="dashboard-hero__badge">
          <Sparkles size={14} />
          Election Learning Dashboard
        </div>
        <h1>Welcome Back!</h1>
        <p>
          Track your learning progress and explore interactive election process tools.
        </p>
      </section>

      {/* Stats Summary */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-stats mb-10"
      >
        <h2 className="stats-title mb-6">Your Progress</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="stat-card"
              >
                <div className="stat-icon" style={{ '--color': stat.color }}>
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title-small">{stat.title}</div>
                  <div className="stat-change">{stat.change}</div>
                </div>
                <CircularProgress percentage={stat.progress} />
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <div className="dashboard-grid">
        {/* AI Chatbot Card */}
        <div className="dashboard-card dashboard-card--blue">
          <div className="dashboard-card__glow">
            <MessageCircle className="dashboard-card__glow-icon dashboard-card__glow-icon--blue" />
          </div>
          <div className="dashboard-card__icon dashboard-card__icon--blue">
            <MessageCircle size={24} />
          </div>
          <h3>AI Chatbot</h3>
          <p>Ask questions about the election process with an intelligent assistant.</p>
          <button 
            onClick={() => navigate('/dashboard/chat')} 
            className="dashboard-card__link dashboard-card__link--blue"
          >
            Start Chat <ArrowRight size={16} />
          </button>
        </div>

        {/* Quiz Card */}
        <div className="dashboard-card dashboard-card--green">
          <div className="dashboard-card__glow">
            <BarChart3 className="dashboard-card__glow-icon dashboard-card__glow-icon--green" />
          </div>
          <div className="dashboard-card__icon dashboard-card__icon--green">
            <BarChart3 size={24} />
          </div>
          <h3>Interactive Quiz</h3>
          <p>Test your knowledge and track your progress with focused practice.</p>
          <button 
            onClick={() => navigate('/dashboard/quiz')} 
            className="dashboard-card__link dashboard-card__link--green"
          >
            Take Quiz <ArrowRight size={16} />
          </button>
        </div>

        {/* Timeline Card */}
        <div className="dashboard-card dashboard-card--purple">
          <div className="dashboard-card__glow">
            <Clock className="dashboard-card__glow-icon dashboard-card__glow-icon--purple" />
          </div>
          <div className="dashboard-card__icon dashboard-card__icon--purple">
            <Clock size={24} />
          </div>
          <h3>Election Timeline</h3>
          <p>Visual timeline of the complete election process from start to result.</p>
          <button 
            onClick={() => navigate('/dashboard/timeline')} 
            className="dashboard-card__link dashboard-card__link--purple"
          >
            View Timeline <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

