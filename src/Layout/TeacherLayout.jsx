// src/Components/Layout/Layout.jsx

import React from 'react';
import TeacherSidebar from './TeacherSidebar/TeacherSidebar.jsx';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <TeacherSidebar />
      <main style={{ flex: 1, marginLeft: '250px', padding: '1rem', overflowX: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
