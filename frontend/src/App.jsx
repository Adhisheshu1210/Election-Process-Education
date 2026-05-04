// import React, { useState, createContext } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import ForgotPassword from "./components/ForgotPassword";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import DashboardLayout from "./layouts/DashboardLayout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import DashboardHome from "./pages/DashboardHome";
// import Profile from "./pages/Profile";
// import ElectionDetails from "./pages/ElectionDetails";
// import ChatBox from "./components/ChatBox";
// import QuizCard from "./components/QuizCard";
// import TimelineView from "./components/TimelineView";
// import Landing from "./components/Landing";
// //import LocationForm from "./components/LocationForm";   // ✅ FIXED IMPORT

// import "./App.css";

// export const LocationContext = createContext();

// function LocationForm({ setLocation }) {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ country: "", state: "", district: "" });

//   function handleSubmit(event) {
//     event.preventDefault();
//     setLocation({
//       country: form.country.trim(),
//       state: form.state.trim(),
//       district: form.district.trim(),
//     });
//     navigate("/dashboard", { replace: true });
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-4">
//         <h2 className="text-2xl font-bold text-gray-900">Set Your Location</h2>
//         <p className="text-sm text-gray-600">Enter your location to continue to the dashboard.</p>

//         <input
//           className="auth-input w-full"
//           placeholder="Country"
//           value={form.country}
//           onChange={(event) => setForm({ ...form, country: event.target.value })}
//           required
//         />
//         <input
//           className="auth-input w-full"
//           placeholder="State"
//           value={form.state}
//           onChange={(event) => setForm({ ...form, state: event.target.value })}
//           required
//         />
//         <input
//           className="auth-input w-full"
//           placeholder="District"
//           value={form.district}
//           onChange={(event) => setForm({ ...form, district: event.target.value })}
//           required
//         />

//         <button className="auth-btn w-full" type="submit">
//           Continue
//         </button>
//       </form>
//     </div>
//   );
// }

// function App() {
//   const [location, setLocation] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   return (
//     <LocationContext.Provider value={{ location, setLocation, token }}>
//       <Routes>

//         {/* Public routes */}
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot" element={<ForgotPassword />} />

//         {/* Location setup */}
//         <Route
//           path="/setup"
//           element={
//             token && !location ? (
//               <LocationForm setLocation={setLocation} />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />

//         {/* Protected Dashboard Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<DashboardHome />} />
//           <Route path="home" element={<DashboardHome />} />
//           <Route path="chat" element={<ChatBox />} />
//           <Route path="quiz" element={<QuizCard />} />
//           <Route path="timeline" element={<TimelineView />} />
//           <Route path="elections" element={<ElectionDetails />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </LocationContext.Provider>
//   );
// }

// export default App;   // ✅ FIXED EXPORT



import React, { useState, createContext } from "react";
import { AppProvider } from "./context/AppContext";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ForgotPassword from "./components/ForgotPassword";
import Login from "./components/Login";
import Register from "./components/Register";
import Landing from "./components/Landing";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardHome from "./pages/DashboardHome";
import Profile from "./pages/Profile";
import ElectionDetails from "./pages/ElectionDetails";

import ChatBox from "./components/ChatBox";
import QuizCard from "./components/QuizCard";
import Quiz from "./components/Quiz";
import QuizResults from "./components/QuizResults";
import Settings from "./pages/Settings";
import TimelineView from "./components/TimelineView";

import "./App.css";

export const LocationContext = createContext();

/* ---------------- LOCATION FORM ---------------- */
function LocationForm({ setLocation }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    country: "",
    state: "",
    district: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    const locationData = {
      country: form.country.trim(),
      state: form.state.trim(),
      district: form.district.trim(),
    };

    setLocation(locationData);

    // optional persist
    localStorage.setItem("location", JSON.stringify(locationData));

    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold">Set Your Location</h2>

        <input
          className="auth-input w-full"
          placeholder="Country"
          value={form.country}
          onChange={(e) =>
            setForm({ ...form, country: e.target.value })
          }
          required
        />

        <input
          className="auth-input w-full"
          placeholder="State"
          value={form.state}
          onChange={(e) =>
            setForm({ ...form, state: e.target.value })
          }
          required
        />

        <input
          className="auth-input w-full"
          placeholder="District"
          value={form.district}
          onChange={(e) =>
            setForm({ ...form, district: e.target.value })
          }
          required
        />

        <button className="auth-btn w-full" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}

/* ---------------- APP ---------------- */
function App() {
  const [location, setLocation] = useState(
    JSON.parse(localStorage.getItem("location")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  return (
    <AppProvider>
      <LocationContext.Provider
        value={{ location, setLocation, token, setToken }}
      >
        <Routes>


        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* LOCATION SETUP */}
        <Route
          path="/setup"
          element={
            token ? (
              !location ? (
                <LocationForm setLocation={setLocation} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* DASHBOARD (PROTECTED) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="chat" element={<ChatBox />} />
          <Route path="quiz" element={<QuizCard />} />
          <Route path="quiz/:mode" element={<Quiz />} />
          <Route path="quiz-results" element={<QuizResults />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="elections" element={<ElectionDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      </LocationContext.Provider>
    </AppProvider>
  );
}

export default App;
