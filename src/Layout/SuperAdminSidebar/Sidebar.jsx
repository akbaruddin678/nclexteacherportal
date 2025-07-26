// src/Components/Sidebar/Sidebar.jsx

import "./Sidebar.css";
import { useState } from "react";
import Logo from '../../../public/logo.svg'
import { useNavigate, useLocation } from "react-router-dom";

// Import Material icons (Md)
import {
  MdHome,
  MdSchool,
  MdPeople,
  MdPerson,
  MdAssignment,
  MdLibraryBooks,
  MdNotifications,
  MdBarChart,
  MdSettings,
} from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeComponent = location.pathname;

  const [isOpen, setIsOpen] = useState(false); // Mobile toggle

  const menuItems = [
    { id: "/superadmin/dashboard", label: "Home", icon: <MdHome /> },
  { id: "/superadmin/manageprincipals", label: "Principals", icon: <MdPerson /> },
  { id: "/superadmin/manageteachers", label: "Teachers", icon: <MdSchool /> },
  { id: "/superadmin/managestudents", label: "Students", icon: <MdPeople /> },
  { id: "/superadmin/registrations", label: "Registrations", icon: <MdAssignment /> },
  { id: "/superadmin/uploadlessonsplans", label: "Lesson Plans", icon: <MdLibraryBooks /> },
  { id: "/superadmin/notifications", label: "Notifications", icon: <MdNotifications /> },
  { id: "/superadmin/reports", label: "Reports", icon: <MdBarChart /> },
  { id: "/superadmin/settings", label: "Settings", icon: <MdSettings /> },
  ];

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
           {/* <img src={Logo} alt="" /> */}
            InterTech LMS
          </h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeComponent === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
