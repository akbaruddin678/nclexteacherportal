import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [formData, setFormData] = useState({
    recipientType: '',
    subject: '',
    message: '',
    schedule: '',
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      recipientType: 'teachers',
      subject: 'Course Updates',
      message: 'Important update on your course schedule.',
      city: 'Islamabad',
      institute: 'NEI Main Campus',
      teacher: 'Mr. Thompson',
      createdAt: new Date().toISOString(),
      status: 'Sent',
      readStatus: false,
    },
    {
      id: 2,
      recipientType: 'principals',
      subject: 'Staff Meeting',
      message: 'Reminder: Staff meeting on Friday at 10 AM.',
      city: 'Lahore',
      institute: 'Lahore Allied Campus',
      teacher: 'Mr. Khan',
      createdAt: new Date().toISOString(),
      status: 'Sent',
      readStatus: false,
    },
  ]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Teacher',
      subject: 'Classroom Supplies Request',
      message: 'I need more whiteboard markers for my class.',
      city: 'Karachi',
      institute: 'Karachi Tech Campus',
      createdAt: new Date().toISOString(),
      status: 'Pending',
      readStatus: false,
    },
    {
      id: 2,
      sender: 'Principal',
      subject: 'Classroom Maintenance Request',
      message: 'Requesting maintenance for Room 204.',
      city: 'Islamabad',
      institute: 'Islamabad Science Academy',
      createdAt: new Date().toISOString(),
      status: 'Pending',
      readStatus: false,
    },
  ]);
  const [filter, setFilter] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitNotification = (e) => {
    e.preventDefault();
    if (!formData.recipientType || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const newNotification = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'Sent',
      readStatus: false, // Adding readStatus field
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setFormData({ recipientType: '', subject: '', message: '', schedule: '' });

    alert('Notification sent successfully!');
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    const newMessage = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      sender: formData.recipientType === 'teachers' ? 'Teacher' : 'Principal',
      status: 'Pending',
      readStatus: false,
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    setFormData({ recipientType: '', subject: '', message: '', schedule: '' });

    alert('Message sent successfully!');
  };

  const handleMarkAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id) {
        return { ...notification, readStatus: true }; // Mark as read
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  const handleMessageRead = (id) => {
    const updatedMessages = messages.map((message) => {
      if (message.id === id) {
        return { ...message, readStatus: true }; // Mark as read
      }
      return message;
    });
    setMessages(updatedMessages);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredNotifications = notifications.filter((notification) => {
    return (
      notification.recipientType.includes(filter) ||
      notification.city.includes(filter) ||
      notification.institute.includes(filter) ||
      notification.teacher.includes(filter)
    );
  });

  const filteredMessages = messages.filter((message) => {
    return (
      message.sender.includes(filter) ||
      message.city.includes(filter) ||
      message.institute.includes(filter)
    );
  });

  return (
    <div className="notifications">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Send notifications to teachers, principals, or both</p>
      </div>

      {/* Filter Section */}
      <div className="filters">
        <label>Filter Notifications and Messages by City, Institute, or Teacher</label>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Search by city, institute, or teacher"
        />
      </div>

      {/* Superadmin Notification Form */}
      <div className="notification-form-container">
        <form onSubmit={handleSubmitNotification} className="notification-form">
          <div className="form-group">
            <label>Recipient Type</label>
            <select
              value={formData.recipientType}
              onChange={(e) => handleInputChange('recipientType', e.target.value)}
              required
            >
              <option value="">Select recipient type</option>
              <option value="teachers">Teachers</option>
              <option value="principals">Principals</option>
              <option value="both">Both Teachers and Principals</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter notification subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Enter your message here..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows="6"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="send-btn">
              Send Notification
            </button>
          </div>
        </form>
      </div>

      {/* Teacher/Principal Message Form */}
      <div className="message-form-container">
        <form onSubmit={handleSubmitMessage} className="message-form">
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter your message subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Enter your request here..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows="6"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="send-btn">
              Send Request
            </button>
          </div>
        </form>
      </div>

      {/* Notifications History */}
      {filteredNotifications.length > 0 && (
        <div className="notifications-history">
          <h2>Recent Notifications</h2>
          <div className="notifications-list">
            {filteredNotifications.slice(0, 10).map((notification) => (
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
                {!notification.readStatus && (
                  <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages History */}
      {filteredMessages.length > 0 && (
        <div className="messages-history">
          <h2>Recent Messages</h2>
          <div className="messages-list">
            {filteredMessages.slice(0, 10).map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-header">
                  <h3>{message.subject}</h3>
                  <span className="message-status">{message.status}</span>
                </div>
                <p className="message-sender">From: {message.sender}</p>
                <p className="message-content">{message.message}</p>
                <p className="message-date">{new Date(message.createdAt).toLocaleString()}</p>
                {!message.readStatus && (
                  <button onClick={() => handleMessageRead(message.id)}>Mark as Read</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
