
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdHome, MdHowToReg , MdPeople, MdPerson, MdAssignment,
  MdLibraryBooks, MdNotifications, MdBarChart, MdSettings, MdMenuBook , MdHelp
} from "react-icons/md";

const TeacherSidebar= ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeComponent = location.pathname;

  const menuItems = [
    { id: "/teacher/dashboard", label: "Dashboard", icon: <MdHome /> },
    { id: "/teacher/managestudents", label: "Students", icon: <MdPeople /> },
    { id: "/teacher/registrations", label: "Registrations", icon: <MdAssignment /> },
    { id: "/teacher/courses", label: "Courses", icon: <MdMenuBook  /> },
    { id: "/teacher/uploadlessonsplans", label: "Lesson Plans", icon: <MdLibraryBooks /> },
    { id: "/teacher/notifications", label: "Notifications", icon: <MdNotifications /> },
    { id: "/teacher/reports", label: "Reports", icon: <MdBarChart /> },
    { id: "/teacher/settings", label: "Settings", icon: <MdSettings /> },
    { id: "/teacher/attendance", label: "Attendance", icon: <MdHowToReg  /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          InterTech LMS
        </h2>
      </div>
      <nav className="sidebar-nav" role="navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeComponent === item.id ? "active" : ""}`}
            onClick={() => {
              navigate(item.id);
              setIsOpen?.(false); // Close on mobile after navigation
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
   {/* Bottom item */}
       <div className="sidebar-footer">
         <button
           className={`nav-item ${activeComponent === "/teacher/help" ? "active" : ""}`}
           onClick={() => {
             navigate("/teacher/help");
             setIsOpen?.(false);
           }}
         >
           <span className="nav-icon"><MdHelp /></span>
           <span className="nav-label">Help and Docs</span>
         </button>
       </div>
     </div>
   );
 };
 
export default TeacherSidebar
