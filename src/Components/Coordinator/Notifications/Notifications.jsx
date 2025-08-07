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
  const [messagesFromTeachers, setMessagesFromTeachers] = useState([]);
  const [messagesFromPrincipals, setMessagesFromPrincipals] = useState([]);

  useEffect(() => {
    const shared = JSON.parse(localStorage.getItem("sharedNotifications")) || [];
    setNotifications(shared);

    const teacherMsgs = JSON.parse(localStorage.getItem("teacherNotifications")) || [];
    const principalMsgs = JSON.parse(localStorage.getItem("messagesToAdmin")) || [];
    setMessagesFromTeachers(teacherMsgs);
    setMessagesFromPrincipals(principalMsgs);
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
      from: "Admin",
    };

    const existing = JSON.parse(localStorage.getItem("sharedNotifications")) || [];
    localStorage.setItem("sharedNotifications", JSON.stringify([newNotification, ...existing]));

    setFormData({ recipientType: "", subject: "", message: "", schedule: "" });
    alert("Notification sent successfully!");
  };

  return (
    <div className="notifications">
      <h1>Admin Notifications</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient</label>
          <select
            value={formData.recipientType}
            onChange={(e) => handleInputChange("recipientType", e.target.value)}
            required
          >
            <option value="">Select recipient</option>
            <option value="teachers">Teachers</option>
            <option value="principals">Principals</option>
            <option value="both">Both</option>
            <option value="all">All Users</option>
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

      <h2>Sent Notifications</h2>
      {notifications.map((n) => (
        <div key={n.id}>
          <strong>{n.subject}</strong>
          <p>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
          <hr />
        </div>
      ))}

      <h2>Messages from Teachers</h2>
      {messagesFromTeachers.map((m) => (
        <div key={m.id}>
          <strong>{m.subject}</strong>
          <p>{m.message}</p>
          <small>{new Date(m.createdAt).toLocaleString()}</small>
          <hr />
        </div>
      ))}

      <h2>Messages from Principals</h2>
      {messagesFromPrincipals.map((m) => (
        <div key={m.id}>
          <strong>{m.subject}</strong>
          <p>{m.message}</p>
          <small>{new Date(m.createdAt).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
