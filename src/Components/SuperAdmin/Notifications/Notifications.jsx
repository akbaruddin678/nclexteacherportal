import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [formData, setFormData] = useState({
    recipientType: '',
    subject: '',
    message: '',
    schedule: '',
  });

  const [notifications, setNotifications] = useState([]);
  const [messagesFromPrincipals, setMessagesFromPrincipals] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const shared = JSON.parse(localStorage.getItem('sharedNotifications')) || [];
    setNotifications(shared);

    const messages = JSON.parse(localStorage.getItem('messagesToAdmin')) || [];
    setMessagesFromPrincipals(messages);
  }, []);

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
      readStatus: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem('sharedNotifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    setFormData({ recipientType: '', subject: '', message: '', schedule: '' });
    alert('Notification sent successfully!');
  };

  const filteredNotifications = notifications.filter((n) =>
    n.recipientType.includes(filter)
  );

  const filteredMessages = messagesFromPrincipals.filter((m) =>
    m.recipientType.includes('admin') || m.recipientType.includes('all')
  );

  return (
    <div className="notifications">
      <h1>Admin Notifications</h1>

      <form onSubmit={handleSubmitNotification}>
        <select
          value={formData.recipientType}
          onChange={(e) => handleInputChange('recipientType', e.target.value)}
          required
        >
          <option value="">Select recipient</option>
          <option value="principals">Principals</option>
          <option value="teachers">Teachers</option>
          <option value="both">Both</option>
          <option value="all">All</option>
        </select>
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          required
        />
        <button type="submit">Send Notification</button>
      </form>

      <h2>Sent Notifications</h2>
      {filteredNotifications.map((n) => (
        <div key={n.id}>
          <strong>{n.subject}</strong>
          <p>{n.message}</p>
          <small>{n.recipientType}</small>
          <hr />
        </div>
      ))}

      <h2>Messages from Principals</h2>
      {filteredMessages.map((m) => (
        <div key={m.id}>
          <strong>{m.subject}</strong>
          <p>{m.message}</p>
          <small>{m.createdAt}</small>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Notifications;
