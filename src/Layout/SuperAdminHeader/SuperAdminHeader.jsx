// src/Components/Layout/SuperAdminHeader/SuperAdminHeader.jsx

import React from 'react';
import './Header.css';
import { FiBell, FiUser, FiMenu } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

const navItems = [
  { id: "/superadmin/dashboard", label: "Dashboard" },
  { id: "/superadmin/manageteachers", label: "Teachers" },
  { id: "/superadmin/managestudents", label: "Students" },
  { id: "/superadmin/courses", label: "Courses" },
  { id: "/superadmin/settings", label: "Settings" },
];

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = window.location.pathname;

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger icon - visible on mobile */}
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <FiMenu size={24} />
        </button>

        <div className="greeting">
          <h1 className="greeting-title">
            Hello Maietry <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="greeting-subtitle">Let's learn something new today!</p>
        </div>
      </div>

      <div className="header-right">
       <nav className="nav-links">
  {navItems.map((item) => (
    <Link
      key={item.id}
      to={item.id}
      className={`nav-link ${location === item.id ? "active" : ""}`}
    >
      {item.label}
    </Link>
  ))}
</nav>

        <button className="icon-button notification-btn" aria-label="Notifications">
          <FiBell size={20} />
          <span className="badge">3</span>
        </button>
        <button className="icon-button avatar-btn" aria-label="Profile">
          <FiUser size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
