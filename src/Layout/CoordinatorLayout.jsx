import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CoordinatorSidebar from './CoordinatorSidebar/CoordinatorSidebar.jsx';
import CoordinatorHeader from './CoordinatorHeader/CoordinatorHeader.jsx';
import './Layout.css'; // <- you need styles for overlay and responsive margin

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <CoordinatorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="main-content">
        <CoordinatorHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ padding: '1rem' }}>
          <Outlet />
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
