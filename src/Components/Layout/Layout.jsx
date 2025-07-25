// src/Components/Layout/Layout.jsx
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar always visible */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {children} {/* Page-specific content */}
      </div>
    </div>
  );
};

export default Layout;
