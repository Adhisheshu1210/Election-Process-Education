import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../App';
import {
  LayoutDashboard,
  MessageCircle,
  BarChart3,
  Clock,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(LocationContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/', { replace: true });
  };

  const isDesktop = window.innerWidth > 768;

  // Responsive sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true); // desktop default expanded
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/home' },
    { icon: MessageCircle, label: 'Chatbot', path: '/dashboard/chat' },
    { icon: BarChart3, label: 'Quiz', path: '/dashboard/quiz' },
    { icon: Clock, label: 'Timeline', path: '/dashboard/timeline' },
    { icon: FileText, label: 'Election Details', path: '/dashboard/elections' },
{ icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="sidebar-toggle sidebar-toggle--mobile"
        onClick={() => setMobileMenu(true)}
        style={{ display: isOpen ? 'none' : 'block' }}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {mobileMenu && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-shell ${isOpen ? 'sidebar-shell--open' : 'sidebar-shell--collapsed'} ${mobileMenu ? 'sidebar-shell--mobile-open' : ''}`}
        style={{
          position: mobileMenu ? 'fixed' : 'relative',
          left: mobileMenu ? 0 : undefined,
          top: mobileMenu ? 0 : undefined,
        }}
        onMouseEnter={() => isDesktop && setIsOpen(true)}
        onMouseLeave={() => isDesktop && setIsOpen(false)}
      > 
        {/* Header */}
        <div className="sidebar-header">
          <button
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileMenu(false);
                setIsOpen(false);
              } else {
                setIsOpen(!isOpen);
              }
            }}
            className="sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {isOpen && (
            <span className="sidebar-title">Menu</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path || ''}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                }
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  } else if (window.innerWidth <= 768) {
                    setMobileMenu(false);
                    setIsOpen(false);
                  }
                }}
              >
                <Icon
                  size={18}
                  className="sidebar-link__icon"
                />

                {isOpen && (
                  <span className="sidebar-link__label">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

    </>
  );
};

export default Sidebar;