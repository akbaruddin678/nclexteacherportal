"use client"

import { useState, useEffect } from "react"
import "./Notifications.css"

const Notifications = () => {
  const [formData, setFormData] = useState({
    recipientType: "",
    subject: "",
    message: "",
    schedule: "",
  })
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }

  const saveNotifications = (updatedNotifications) => {
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    setNotifications(updatedNotifications)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.recipientType || !formData.subject || !formData.message) {
      alert("Please fill in all required fields")
      return
    }

    const newNotification = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: "Sent",
    }

    const updatedNotifications = [newNotification, ...notifications]
    saveNotifications(updatedNotifications)

    // Reset form
    setFormData({
      recipientType: "",
      subject: "",
      message: "",
      schedule: "",
    })

    alert("Notification sent successfully!")
  }

  return (
    <div className="notifications">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Send notifications to teachers, principals, or both</p>
      </div>

      <div className="notification-form-container">
        <form onSubmit={handleSubmit} className="notification-form">
          <div className="form-group">
            <label>Recipient Type</label>
            <select
              value={formData.recipientType}
              onChange={(e) => handleInputChange("recipientType", e.target.value)}
              required
            >
              <option value="">Select recipient type</option>
              <option value="teachers">Teachers</option>
              <option value="principals">Principals</option>
              <option value="both">Both Teachers and Principals</option>
              <option value="students">Students</option>
              <option value="all">All Users</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter notification subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Enter your message here..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Schedule (Optional)</label>
            <input
              type="datetime-local"
              value={formData.schedule}
              onChange={(e) => handleInputChange("schedule", e.target.value)}
            />
            <small>Leave empty to send immediately</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="send-btn">
              Send Notification
            </button>
          </div>
        </form>
      </div>

      {notifications.length > 0 && (
        <div className="notifications-history">
          <h2>Recent Notifications</h2>
          <div className="notifications-list">
            {notifications.slice(0, 10).map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-header">
                  <h3>{notification.subject}</h3>
                  <span className="notification-status">{notification.status}</span>
                </div>
                <p className="notification-recipient">
                  To: {notification.recipientType.charAt(0).toUpperCase() + notification.recipientType.slice(1)}
                </p>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-date">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications
