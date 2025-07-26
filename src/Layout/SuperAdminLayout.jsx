// src/Components/Layout/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // 👈 important for nested routing
import SuperAdminSidebar from './SuperAdminSidebar/Sidebar';
import Header from './SuperAdminHeader/SuperAdminHeader';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <SuperAdminSidebar />
      <main style={{ flex: 1, marginLeft: '250px', overflowX: 'auto' }}>
        <Header />
        <div style={{ padding: '1rem' }}>
          <Outlet /> {/* 👈 this renders nested route components */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
