"use client"

import { useState, useEffect } from "react"
import "./Notifications.css"

const Notifications = () => {
  const [formData, setFormData] = useState({
    recipientType: "admin",
    subject: "",
    message: "",
    schedule: "",
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const shared = JSON.parse(localStorage.getItem('sharedNotifications')) || [];
    const filtered = shared.filter(n =>
      n.recipientType === 'principals' ||
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

    if (!formData.subject || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    const newMessage = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: "Sent",
      from: "Principal",
    };

    const existing = JSON.parse(localStorage.getItem('messagesToAdmin')) || [];
    localStorage.setItem('messagesToAdmin', JSON.stringify([newMessage, ...existing]));

    setFormData({
      recipientType: "admin",
      subject: "",
      message: "",
      schedule: "",
    });

    alert("Message sent to admin successfully!");
  };

  return (
    <div className="notifications">
      <h1>Principal Notifications</h1>

      <form onSubmit={handleSubmit}>
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
        <button type="submit">Send to Admin</button>
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
