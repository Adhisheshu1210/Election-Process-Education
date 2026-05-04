import React, { createContext, useReducer, useEffect } from 'react';

const APP_STORAGE_KEY = 'electionAppData';

const initialState = {
  profile: {
    name: '',
    email: '',
    phone: '',
    gender: '',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    quizScore: 0,
    totalQuizzes: 0,
    timelineProgress: 0,
    lastActivity: ''
  },
  quizzes: [],
  chatHistory: [],
  timelineProgress: { currentStep: 3, completed: 4, total: 7 },
  activities: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'ADD_QUIZ_RESULT':
      return { 
        ...state, 
        quizzes: [...state.quizzes, action.payload],
        profile: { 
          ...state.profile,
          quizScore: action.payload.scorePercentage,
          totalQuizzes: state.profile.totalQuizzes + 1,
          lastActivity: new Date().toISOString()
        }
      };
    case 'ADD_CHAT_MESSAGE':
      return { 
        ...state, 
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'UPDATE_TIMELINE_PROGRESS':
      return { 
        ...state, 
        timelineProgress: action.payload,
        profile: { ...state.profile, timelineProgress: action.payload.completed / action.payload.total * 100 }
      };
    case 'ADD_ACTIVITY':
      return { 
        ...state, 
        activities: [...state.activities.slice(-9), action.payload], // keep last 10
        profile: { ...state.profile, lastActivity: new Date().toISOString() }
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(APP_STORAGE_KEY);
      if (saved) {
        dispatch({ type: 'LOAD_DATA', payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load app data:', e);
    }
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save app data:', e);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

