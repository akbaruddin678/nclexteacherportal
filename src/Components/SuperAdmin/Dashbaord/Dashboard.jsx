import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"; 

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [lectureData, setLectureData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const sampleAttendance = [
      { id: 1, course: "Programming", studentName: "Ethan Harper", status: "Present" },
      { id: 2, course: "Data Structures", studentName: "Olivia Bennett", status: "Absent" },
      { id: 3, course: "Web Development", studentName: "Noah Carter", status: "Present" },
    ];

    const sampleLectures = [
      { id: 1, course: "Data Science", topic: "Introduction to Python", date: "2024-03-15", studentsPresent: 25 },
      { id: 2, course: "Machine Learning", topic: "Linear Regression", date: "2024-03-15", studentsPresent: 22 },
      { id: 3, course: "Software Engineering", topic: "Agile Methodology", date: "2024-03-14", studentsPresent: 28 },
    ];

    const sampleNotifications = [
      { id: 1, subject: "Course Update", message: "Introduction to Programming is rescheduled." },
      { id: 2, subject: "Staff Meeting", message: "All teachers to attend the meeting at 10 AM." },
      { id: 3, subject: "Exam Schedule", message: "Exam dates for Data Structures are announced." },
    ];

    setAttendanceData(sampleAttendance);
    setLectureData(sampleLectures);
    setNotifications(sampleNotifications);
  };

  const calculateAttendancePercentage = () => {
    const presentCount = attendanceData.filter((record) => record.status === "Present").length;
    const totalStudents = attendanceData.length;
    return (presentCount / totalStudents) * 100;
  };

  const attendanceChartData = [
    { name: "Present", value: calculateAttendancePercentage() },
    { name: "Absent", value: 100 - calculateAttendancePercentage() },
  ];

  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Admin Dashboard</p>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{attendanceData.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Teachers</h3>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h3>Total Lectures</h3>
          <p>{lectureData.length}</p>
        </div>
        <div className="stat-card">
          <h3>Present Students Today</h3>
          <p>{attendanceData.filter((record) => record.status === "Present").length}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attendanceChartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#4caf50" />
                <Cell fill="#f44336" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-footer">
            <span>Present</span> - <span>Absent</span>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <div className="recent-attendance">
          <h3>Recent Attendance</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.slice(0, 5).map((record) => (
                <tr key={record.id}>
                  <td>{record.course}</td>
                  <td>{record.studentName}</td>
                  <td>
                    <span className={`status ${record.status.toLowerCase()}`}>{record.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recent-lectures">
          <h3>Recent Lectures</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Topic</th>
                <th>Teacher</th>
                <th>Students Present</th>
              </tr>
            </thead>
            <tbody>
              {lectureData.slice(0, 5).map((record) => (
                <tr key={record.id}>
                  <td>{record.course}</td>
                  <td>{record.topic}</td>
                  <td>{record.teacherName}</td>
                  <td>{record.studentsPresent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recent-notifications">
        <h3>Recent Notifications</h3>
        <ul>
          {recentNotifications.map((notification) => (
            <li key={notification.id}>
              <strong>{notification.subject}</strong> - {notification.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
