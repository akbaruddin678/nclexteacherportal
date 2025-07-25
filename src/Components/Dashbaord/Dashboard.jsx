"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    activeUsers: 0,
  })

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: "Programming Workshop",
      time: "10:00 AM - 11:00 AM",
      icon: "💻",
    },
    {
      id: 2,
      title: "Data Analysis Q&A",
      time: "2:00 PM - 3:00 PM",
      icon: "📊",
    },
    {
      id: 3,
      title: "Project Management Meeting",
      time: "4:00 PM - 5:00 PM",
      icon: "👥",
    },
  ])

  const [courses] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Learn the basics of coding with Python.",
      image: "https://johnthecomputerman.co.uk/storage/2021/05/introtoprogramming-190909184629-thumbnail-4.jpg",
    },
    {
      id: 2,
      title: "Advanced Data Analysis",
      description: "Master data analysis techniques using R.",
      image: "https://d2ms8rpfqc4h24.cloudfront.net/Advanced_Data_Analytics_Techniques_27ef846f26.jpg",
    },
    {
      id: 3,
      title: "Project Management Fundamentals",
      description: "Understand the principles of project management.",
      image: "https://i.ytimg.com/vi/dANtsg4yT9s/maxresdefault.jpg",
    },
  ])

  useEffect(() => {
    // Load stats from localStorage
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]")
    const students = JSON.parse(localStorage.getItem("students") || "[]")

    setStats({
      totalTeachers: teachers.length,
      totalStudents: students.length,
      totalCourses: courses.length,
      activeUsers:
        teachers.filter((t) => t.status === "Active").length + students.filter((s) => s.status === "Active").length,
    })
  }, [courses.length])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, Alex</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalTeachers}</h3>
          <p>Total Teachers</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalStudents}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalCourses}</h3>
          <p>Total Courses</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeUsers}</h3>
          <p>Active Users</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="courses-section">
          <h2>My Courses</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <img src={course.image || "/placeholder.svg"} alt={course.title} />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="events-section">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-item">
                <span className="event-icon">{event.icon}</span>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p>{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
