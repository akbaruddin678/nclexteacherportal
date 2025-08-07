"use client";

import { useState, useEffect } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [formData, setFormData] = useState({
    recipientType: "",
    subject: "",
    message: "",
    schedule: "",
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const shared = JSON.parse(localStorage.getItem('sharedNotifications')) || [];
    const filtered = shared.filter(n =>
      n.recipientType === 'teachers' ||
      n.recipientType === 'both' ||
      n.recipientType === 'all'
    );
    setNotifications(filtered);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.recipientType || !formData.subject || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    const newNotification = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: "Sent",
      from: "Teacher",
    };

    // Save teacher's message to sharedNotifications if for principal or both
    if (formData.recipientType === "principals" || formData.recipientType === "both") {
      const shared = JSON.parse(localStorage.getItem("sharedNotifications")) || [];
      localStorage.setItem("sharedNotifications", JSON.stringify([newNotification, ...shared]));
    }

    // Always store in teacherNotifications (local only)
    const existing = JSON.parse(localStorage.getItem("teacherNotifications")) || [];
    localStorage.setItem("teacherNotifications", JSON.stringify([newNotification, ...existing]));

    setFormData({ recipientType: "", subject: "", message: "", schedule: "" });

    alert("Message sent successfully!");
  };

  return (
    <div className="notifications">
      <h1>Teacher Notifications</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient</label>
          <select
            value={formData.recipientType}
            onChange={(e) => handleInputChange("recipientType", e.target.value)}
            required
          >
            <option value="">Select recipient</option>
            <option value="principals">Principal</option>
            <option value="admin">Admin</option>
            <option value="both">Both Admin and Principal</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          required
        />
        <textarea
          placeholder="Enter your message..."
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          rows="4"
          required
        />
        <button type="submit">Send Notification</button>
      </form>

      <h2>Notifications for You</h2>
      {notifications.map((n) => (
        <div key={n.id}>
          <strong>{n.subject}</strong>
          <p>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
