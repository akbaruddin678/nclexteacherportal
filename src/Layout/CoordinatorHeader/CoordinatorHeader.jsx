import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

// const navItems = [
//   { id: "/coordinator/dashboard", label: "Dashboard" },
//   { id: "/coordinator/manageteachers", label: "Teachers" },
//   { id: "/coordinator/managestudents", label: "Students" },
//   { id: "/coordinator/courses", label: "Courses" },
//   { id: "/coordinator/settings", label: "Settings" },
// ];

const CoordinatorHeader = ({ onToggleSidebar }) => {
  // const location = window.location.pathname;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <FiMenu size={24} />
        </button>

        <div className="greeting">
          <h1 className="greeting-title">
            Hello Maietry{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p className="greeting-subtitle">Let's learn something new today!</p>
        </div>
      </div>

      <div className="header-right">
        {/* <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={`nav-link ${location === item.id ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav> */}

        <button
          className="icon-button notification-btn"
          aria-label="Notifications"
        >
          <FiBell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="profile-container">
          <button
            className="icon-button avatar-btn"
            aria-label="Profile"
            onClick={() => setShowModal(!showModal)}
          >
            <FiUser size={24} />
          </button>

          {showModal && (
            <div className="profile-modal" ref={modalRef}>
              <div className="user-info">
                <strong>Maietry</strong>
                <span>Coordinator</span>
              </div>

              <button
                className="modal-btn"
                onClick={() => {
                  setShowModal(false);
                  navigate("/profile");
                }}
              >
                View Profile
              </button>

              <button
                className="modal-btn"
                onClick={() => navigate("/coordinator/settings")}
              >
                Account Settings
              </button>

              <hr className="modal-divider" />
              <button className="modal-btn logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CoordinatorHeader;
