import React, { useContext, useEffect, useMemo, useState } from "react";
import { User, Image, Edit3, Save, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Profile() {
  const { state, dispatch } = useContext(AppContext);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profilePic: "",
    practiceScore: 0,
    examScore: 0,
    totalQuizzes: 0,
  });

  const token = localStorage.getItem("token");

  const quizPercent = useMemo(() => {
    const bestScore = Math.max(profile.practiceScore || 0, profile.examScore || 0);
    return Math.round((bestScore / 20) * 100);
  }, [profile.practiceScore, profile.examScore]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();

        const mappedProfile = {
          name: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          profilePic:
            data.profile_pic ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          practiceScore: Number(data.quiz_practice_score || 0),
          examScore: Number(data.quiz_exam_score || 0),
          totalQuizzes: Number(data.total_quizzes || 0),
        };

        setProfile(mappedProfile);

        dispatch({
          type: "SET_PROFILE",
          payload: {
            name: mappedProfile.name,
            email: mappedProfile.email,
            phone: mappedProfile.phone,
            gender: mappedProfile.gender,
            profilePic: mappedProfile.profilePic,
            totalQuizzes: mappedProfile.totalQuizzes,
            quizScore: Math.round((Math.max(mappedProfile.practiceScore, mappedProfile.examScore) / 20) * 100),
          },
        });
      } catch (err) {
        toast.error(err.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const imageData = evt.target?.result;
      if (typeof imageData === "string") {
        setProfile((prev) => ({ ...prev, profilePic: imageData }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profile.name || "");
      formData.append("gender", profile.gender || "");
      formData.append("profile_pic", profile.profilePic || "");

      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      dispatch({
        type: "SET_PROFILE",
        payload: {
          name: profile.name,
          gender: profile.gender,
          profilePic: profile.profilePic,
        },
      });

      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img src={profile.profilePic} alt="Profile" className="profile-avatar" />

          {editing && (
            <label className="profile-img-edit" title="Upload profile image">
              <Image size={18} />
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </label>
          )}
        </div>

        <h1 className="profile-name">{profile.name || "New User"}</h1>
        <p className="profile-sub">Election Assistant Member</p>

        <div className="profile-stats">
          <span>
            Best Quiz Score: <b>{quizPercent}%</b>
          </span>
          <span>Total Quizzes: {profile.totalQuizzes}</span>
        </div>
      </div>

      <div className="profile-actions">
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary">
            <Edit3 size={18} /> Edit Profile
          </button>
        ) : (
          <button onClick={handleSave} className="btn-primary">
            <Save size={18} /> Save Profile
          </button>
        )}
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>
            <User size={20} /> Personal Info
          </h2>

          <input
            disabled={!editing}
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Name"
          />

          <input disabled value={profile.email} placeholder="Email" />

          <input disabled value={profile.phone} placeholder="Phone" />

          <select
            disabled={!editing}
            value={profile.gender}
            onChange={(e) => setProfile((prev) => ({ ...prev, gender: e.target.value }))}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="profile-card">
          <h2>
            <BarChart3 size={20} /> Quiz History
          </h2>

          <div className="quiz-item">
            <span>Practice Quiz (out of 20)</span>
            <b>{profile.practiceScore}</b>
          </div>

          <div className="quiz-item">
            <span>Exam Quiz (out of 20)</span>
            <b>{profile.examScore}</b>
          </div>

          <div className="quiz-item">
            <span>Total Attempts</span>
            <b>{profile.totalQuizzes}</b>
          </div>
        </div>

        <div className="profile-card">
          <h2>
            <BarChart3 size={20} /> Timeline Progress
          </h2>
          <div className="quiz-item">
            <span>Timeline Milestones</span>
            <b>{state.timelineProgress.completed}/{state.timelineProgress.total}</b>
          </div>
          <div className="quiz-item">
            <span>Overall Progress</span>
            <b>{Math.round(state.profile.timelineProgress)}%</b>
          </div>
        </div>
      </div>
    </div>
  );
}
