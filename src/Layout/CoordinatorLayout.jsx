// src/Components/Layout/Layout.jsx

import React from 'react';
import CoordinatorSidebar from './CoordinatorSidebar/CoordinatorSidebar.jsx';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <CoordinatorSidebar />
      <main style={{ flex: 1, marginLeft: '250px', padding: '1rem', overflowX: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
