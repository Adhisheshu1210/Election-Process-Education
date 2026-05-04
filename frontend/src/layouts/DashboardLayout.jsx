import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-shell">
      <TopNavbar />
      <div className="dashboard-shell__body">
        <Sidebar />
        <main className="dashboard-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

