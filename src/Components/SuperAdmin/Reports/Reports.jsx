"use client"

import { useState, useEffect } from "react"
import "./Reports.css"

const Reports = () => {
  const [activeTab, setActiveTab] = useState("attendance")
  const [filters, setFilters] = useState({
    course: "",
    teacher: "",
    dateRange: "",
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [lectureData, setLectureData] = useState([])

  useEffect(() => {
    loadReportsData()
  }, [])

  const loadReportsData = () => {
    // Load sample attendance data
    const sampleAttendance = [
      {
        id: 1,
        studentName: "Ethan Harper",
        course: "Introduction to Programming",
        date: "2024-03-15",
        status: "Present",
      },
      {
        id: 2,
        studentName: "Olivia Bennett",
        course: "Data Structures and Algorithms",
        date: "2024-03-15",
        status: "Absent",
      },
      {
        id: 3,
        studentName: "Noah Carter",
        course: "Web Development Fundamentals",
        date: "2024-03-15",
        status: "Present",
      },
      {
        id: 4,
        studentName: "Ava Mitchell",
        course: "Database Management Systems",
        date: "2024-03-15",
        status: "Present",
      },
      {
        id: 5,
        studentName: "Liam Foster",
        course: "Software Engineering Principles",
        date: "2024-03-15",
        status: "Present",
      },
    ]

    // Load sample lecture activity data
    const sampleLectures = [
      {
        id: 1,
        teacherName: "Dr. Eleanor Harper",
        course: "Data Science Fundamentals",
        topic: "Introduction to Python",
        date: "2024-03-15",
        duration: "2 hours",
        studentsPresent: 25,
      },
      {
        id: 2,
        teacherName: "Prof. Samuel Bennett",
        course: "Machine Learning Applications",
        topic: "Linear Regression",
        date: "2024-03-15",
        duration: "1.5 hours",
        studentsPresent: 22,
      },
      {
        id: 3,
        teacherName: "Ms. Olivia Carter",
        course: "Software Engineering Principles",
        topic: "Agile Methodology",
        date: "2024-03-14",
        duration: "2 hours",
        studentsPresent: 28,
      },
    ]

    setAttendanceData(sampleAttendance)
    setLectureData(sampleLectures)
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const filteredAttendanceData = attendanceData.filter((record) => {
    if (filters.course && !record.course.toLowerCase().includes(filters.course.toLowerCase())) {
      return false
    }
    return true
  })

  const filteredLectureData = lectureData.filter((record) => {
    if (filters.course && !record.course.toLowerCase().includes(filters.course.toLowerCase())) {
      return false
    }
    if (filters.teacher && !record.teacherName.toLowerCase().includes(filters.teacher.toLowerCase())) {
      return false
    }
    return true
  })

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
            <select value={filters.course} onChange={(e) => handleFilterChange("course", e.target.value)}>
              <option value="">Select Course</option>
              <option value="Introduction to Programming">Introduction to Programming</option>
              <option value="Data Science Fundamentals">Data Science Fundamentals</option>
              <option value="Web Development">Web Development</option>
              <option value="Machine Learning">Machine Learning</option>
            </select>
          </div>

          {activeTab === "lecture" && (
            <div className="filter-group">
              <select value={filters.teacher} onChange={(e) => handleFilterChange("teacher", e.target.value)}>
                <option value="">Select Teacher</option>
                <option value="Dr. Eleanor Harper">Dr. Eleanor Harper</option>
                <option value="Prof. Samuel Bennett">Prof. Samuel Bennett</option>
                <option value="Ms. Olivia Carter">Ms. Olivia Carter</option>
              </select>
            </div>
          )}

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
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendanceData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.studentName}</td>
                      <td>{record.course}</td>
                      <td>{record.date}</td>
                      <td>
                        <span className={`status ${record.status.toLowerCase()}`}>{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  )
}

export default Reports
