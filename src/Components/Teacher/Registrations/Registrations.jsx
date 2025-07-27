"use client"

import { useState, useEffect } from "react"
import "./Registrations.css"
import { useNavigate, useLocation } from "react-router-dom";
// Import Material icons (Md)
import {
  MdSchool,
  MdPeople,
  MdPerson
} from "react-icons/md";

const Registration = ({ initialTab = "student" }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [formData, setFormData] = useState({
    // Principal fields
    name: "",
    email: "",
    phone: "",
    department: "",
    campus: "",
    // Teacher fields
    courses: "",
    qualification: "",
    experience: "",
    // Student fields
    course: "",
    studentId: "",
    dateOfBirth: "",
    address: "",
    // Common fields
    status: "Active",
  })

  useEffect(() => {
    setActiveTab(initialTab)
    resetForm()
  }, [initialTab])

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      campus: "",
      courses: "",
      qualification: "",
      experience: "",
      course: "",
      studentId: "",
      dateOfBirth: "",
      address: "",
      status: "Active",
    })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    resetForm()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields based on active tab
    const requiredFields = ["name", "email", "campus"]
    if (activeTab === "student") {
     requiredFields.push("course", "studentId", "dateOfBirth")
    } 

    const missingFields = requiredFields.filter((field) => !formData[field])
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    // Create new record
    const newRecord = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    }

    // Save to appropriate localStorage key
    const storageKey = activeTab === "students"
    const existingData = JSON.parse(localStorage.getItem(storageKey) || "[]")
    const updatedData = [...existingData, newRecord]
    localStorage.setItem(storageKey, JSON.stringify(updatedData))

    alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} registered successfully!`)
    resetForm()
  }

  return (
    <div className="registration">
      <div className="page-header">
        <h1>User Registration</h1>
        <p>Register new students</p>
      </div>

      <div className="registration-tabs">
        <button
          className={`tab-btn ${activeTab === "student" ? "active" : ""}`}
          onClick={() => handleTabChange("student")}
        >
          <MdPeople /> Student
        </button>
      </div>

      <div className="registration-form-container">
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>


          {activeTab === "student" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Student ID *</label>
                  <input
                    type="text"
                    placeholder="Enter student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Campus *</label>
                  <select
                    value={formData.campus}
                    onChange={(e) => handleInputChange("campus", e.target.value)}
                    required
                  >
                    <option value="">Select Campus</option>
                    <option value="Main campus">Main campus</option>
                    <option value="North campus">North campus</option>
                    <option value="South campus">South campus</option>
                    <option value="West campus">West campus</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Course/Program *</label>
                  <select
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="Data Science Fundamentals">Data Science Fundamentals</option>
                    <option value="Machine Learning Applications">Machine Learning Applications</option>
                    <option value="Software Engineering Principles">Software Engineering Principles</option>
                    <option value="Cybersecurity Essentials">Cybersecurity Essentials</option>
                    <option value="Web Development Bootcamp">Web Development Bootcamp</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="reset-btn">
              Reset Form
            </button>
            <button type="submit" className="submit-btn">
              Register {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registration
