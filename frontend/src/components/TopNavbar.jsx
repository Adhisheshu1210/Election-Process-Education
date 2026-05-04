import React, { useContext, useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { LocationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import './TopNavbar.css';

const TopNavbar = () => {
  const { token } = useContext(LocationContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="topbar">
      {/* Brand */}
      <div className="topbar__brand">
        <div className="topbar__logo">
          <span>E</span>
        </div>
        <h1>Election Process Assistant</h1>
      </div>

      {/* Actions */}
      <div className="topbar__actions">
        <div className="topbar__profile" ref={dropdownRef}>
          
          {/* Profile Button */}
          <button
            className="topbar__profile-btn"
            onClick={() => setOpen(!open)}
          >
            <User size={18} />
            <span>Profile</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="topbar__dropdown">
              <button
                onClick={handleProfileClick}
                className="topbar__dropdown-item"
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              {token && (
                <button
                  onClick={handleLogout}
                  className="topbar__logout"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;