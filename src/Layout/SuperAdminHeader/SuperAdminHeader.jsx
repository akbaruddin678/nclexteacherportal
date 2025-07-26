// src/Components/Layout/Header/Header.jsx

import React, { useState } from 'react';
import './Header.css';
import userAvatar from '../../../public/vite.svg'; // Replace with actual path

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <p className="logo">Super Admin Panel</p>
      </div>
      <div
        className="header-right"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <span className="username">Alex</span>
        <img src={userAvatar} alt="User Avatar" className="avatar" />
        {showDropdown && (
          <div className="dropdown-menu">
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
