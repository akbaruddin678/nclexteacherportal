// src/Components/Sidebar/Sidebar.jsx
import "./Sidebar.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeComponent = location.pathname;

  const menuItems = [
    { id: "/dashboard", label: "Home", icon: "🏠" },
    { id: "/manageprincipals", label: "Principals", icon: "👔" },
    { id: "/manageteachers", label: "Teachers", icon: "👨‍🏫" },
    { id: "/managestudents", label: "Students", icon: "👨‍🎓" },
    {
      id: "registration",
      label: "Registration",
      icon: "📝",
      hasDropdown: true,
      subItems: [
        { id: "/registrations/principal", label: "Principal Registration", icon: "👔" },
        { id: "/registrations/teacher", label: "Teacher Registration", icon: "👨‍🏫" },
        { id: "/registrations/student", label: "Student Registration", icon: "👨‍🎓" },
      ],
    },
    { id: "/uploadlessonsplans", label: "Lesson Plans", icon: "📚" },
    { id: "/notifications", label: "Notifications", icon: "🔔" },
    { id: "/reports", label: "Reports", icon: "📊" },
    { id: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          InterTech LMS
        </h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              className={`nav-item ${
                activeComponent === item.id ||
                (item.subItems && item.subItems.some((sub) => activeComponent === sub.id))
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                item.hasDropdown ? handleDropdownToggle(item.id) : navigate(item.id)
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.hasDropdown && (
                <span className={`dropdown-arrow ${openDropdown === item.id ? "open" : ""}`}>
                  ▼
                </span>
              )}
            </button>

            {item.hasDropdown && openDropdown === item.id && (
              <div className="dropdown-menu">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`dropdown-item ${activeComponent === subItem.id ? "active" : ""}`}
                    onClick={() => navigate(subItem.id)}
                  >
                    <span className="nav-icon">{subItem.icon}</span>
                    <span className="nav-label">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
