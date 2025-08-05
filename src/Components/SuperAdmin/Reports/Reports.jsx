"use client";

import { useState, useEffect } from "react";
import "./Reports.css";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [filters, setFilters] = useState({
    course: "",
    teacher: "",
    dateRange: "",
    city: "",
    institute: "",
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [lectureData, setLectureData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // Store the selected class
  const [selectedStudentStatus, setSelectedStudentStatus] = useState(null); // To store student status

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = () => {
    const sampleAttendance = [
      {
        id: 1,
        studentName: "Ethan Harper",
        course: "Introduction to Programming",
        date: "2024-03-15",
        status: "Present",
        teacher: "Dr. Eleanor Harper",
        city: "Islamabad",
        institute: "NEI Main Campus",
      },
      {
        id: 2,
        studentName: "Olivia Bennett",
        course: "Data Structures and Algorithms",
        date: "2024-03-15",
        status: "Absent",
        teacher: "Dr. Eleanor Harper",
        city: "Lahore",
        institute: "Lahore Allied Campus",
      },
      {
        id: 3,
        studentName: "Noah Carter",
        course: "Web Development Fundamentals",
        date: "2024-03-15",
        status: "Present",
        teacher: "Ms. Olivia Carter",
        city: "Karachi",
        institute: "Karachi Tech Campus",
      },
      {
        id: 4,
        studentName: "Ava Mitchell",
        course: "Database Management Systems",
        date: "2024-03-15",
        status: "Present",
        teacher: "Prof. Samuel Bennett",
        city: "Islamabad",
        institute: "NEI Main Campus",
      },
      {
        id: 5,
        studentName: "Liam Foster",
        course: "Software Engineering Principles",
        date: "2024-03-15",
        status: "Present",
        teacher: "Ms. Olivia Carter",
        city: "Lahore",
        institute: "Lahore Allied Campus",
      },
    ];

    const sampleLectures = [
      {
        id: 1,
        teacherName: "Dr. Eleanor Harper",
        course: "Data Science Fundamentals",
        topic: "Introduction to Python",
        date: "2024-03-15",
        duration: "2 hours",
        studentsPresent: 25,
        totalStudents: 30,
        city: "Islamabad",
        institute: "NEI Main Campus",
      },
      {
        id: 2,
        teacherName: "Prof. Samuel Bennett",
        course: "Machine Learning Applications",
        topic: "Linear Regression",
        date: "2024-03-15",
        duration: "1.5 hours",
        studentsPresent: 22,
        totalStudents: 30,
        city: "Lahore",
        institute: "Lahore Allied Campus",
      },
      {
        id: 3,
        teacherName: "Ms. Olivia Carter",
        course: "Software Engineering Principles",
        topic: "Agile Methodology",
        date: "2024-03-14",
        duration: "2 hours",
        studentsPresent: 28,
        totalStudents: 30,
        city: "Karachi",
        institute: "Karachi Tech Campus",
      },
    ];

    setAttendanceData(sampleAttendance);
    setLectureData(sampleLectures);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClassClick = (courseName) => {
    // Filter attendance data by course
    const classAttendance = attendanceData.filter(
      (record) => record.course === courseName
    );
    setSelectedClass(classAttendance);
  };

  const handleStudentStatusClick = (status) => {
    // Filter students based on their attendance status (present or absent)
    const filtered = selectedClass.filter((record) => record.status === status);
    setSelectedStudentStatus(filtered);
  };

  const filteredAttendanceData = attendanceData.filter((record) => {
    if (filters.course && !record.course.toLowerCase().includes(filters.course.toLowerCase())) {
      return false;
    }
    if (filters.city && !record.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.institute && !record.institute.toLowerCase().includes(filters.institute.toLowerCase())) {
      return false;
    }
    if (filters.dateRange && record.date !== filters.dateRange) {
      return false;
    }
    return true;
  });

  const filteredLectureData = lectureData.filter((record) => {
    if (filters.course && !record.course.toLowerCase().includes(filters.course.toLowerCase())) {
      return false;
    }
    if (filters.teacher && !record.teacherName.toLowerCase().includes(filters.teacher.toLowerCase())) {
      return false;
    }
    if (filters.city && !record.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.institute && !record.institute.toLowerCase().includes(filters.institute.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="reports">
      <div className="page-header">
        <h1>Reports</h1>
        <p>View and analyze attendance and lecture activity reports</p>
      </div>

      <div className="reports-tabs">
        <button
          className={`tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === "lecture" ? "active" : ""}`}
          onClick={() => setActiveTab("lecture")}
        >
          Lecture Activity
        </button>
      </div>

      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <select
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
            >
              <option value="">Select Course</option>
              <option value="Introduction to Programming">Introduction to Programming</option>
              <option value="Data Science Fundamentals">Data Science Fundamentals</option>
              <option value="Web Development">Web Development</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </div>

          {activeTab === "lecture" && (
            <div className="filter-group">
              <select
                value={filters.teacher}
                onChange={(e) => handleFilterChange("teacher", e.target.value)}
              >
                <option value="">Select Teacher</option>
                <option value="Dr. Eleanor Harper">Dr. Eleanor Harper</option>
                <option value="Prof. Samuel Bennett">Prof. Samuel Bennett</option>
                <option value="Ms. Olivia Carter">Ms. Olivia Carter</option>
              </select>
            </div>
          )}

          <div className="filter-group">
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            >
              <option value="">Select City</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filters.institute}
              onChange={(e) => handleFilterChange("institute", e.target.value)}
            >
              <option value="">Select Institute</option>
              <option value="NEI Main Campus">NEI Main Campus</option>
              <option value="Lahore Allied Campus">Lahore Allied Campus</option>
              <option value="Karachi Tech Campus">Karachi Tech Campus</option>
            </select>
          </div>

          <div className="filter-group">
            <input
              type="date"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="reports-content">
        {activeTab === "attendance" && (
          <div className="attendance-report">
            <h2>Attendance Report</h2>
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Teacher</th>
                    <th>Date</th>
                    <th>City</th>
                    <th>Institute</th>
                    <th>Present Students</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLectureData.map((record) => {
                    const attendancePercentage =
                      (record.studentsPresent / record.totalStudents) * 100;
                    return (
                      <tr key={record.id} onClick={() => handleClassClick(record.course)}>
                        <td>{record.course}</td>
                        <td>{record.teacherName}</td>
                        <td>{record.date}</td>
                        <td>{record.city}</td>
                        <td>{record.institute}</td>
                        <td>{record.studentsPresent}</td>
                        <td>{attendancePercentage.toFixed(2)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Display selected class details */}
            {selectedClass && (
              <div className="class-details">
                <h3>Class Attendance Details for {selectedClass[0]?.course}</h3>
                <button onClick={() => handleStudentStatusClick("Present")}>
                  Show Present Students
                </button>
                <button onClick={() => handleStudentStatusClick("Absent")}>
                  Show Absent Students
                </button>
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedStudentStatus || selectedClass).map((record) => (
                      <tr key={record.id}>
                        <td>{record.studentName}</td>
                        <td>{record.course}</td>
                        <td>{record.date}</td>
                        <td>
                          <span className={`status ${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "lecture" && (
          <div className="lecture-report">
            <h2>Lecture Activity Report</h2>
            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Course</th>
                    <th>Topic</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>City</th>
                    <th>Institute</th>
                    <th>Students Present</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLectureData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.teacherName}</td>
                      <td>{record.course}</td>
                      <td>{record.topic}</td>
                      <td>{record.date}</td>
                      <td>{record.duration}</td>
                      <td>{record.city}</td>
                      <td>{record.institute}</td>
                      <td>{record.studentsPresent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
