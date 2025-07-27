import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <h3>Status</h3>
        <ul className="status-list">
          <li>Help</li>
          <li>Settings</li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>My Courses</h3>
        <div className="course-item">
          <p>Course Name:</p>
          <div className="course-status">
            <span>Completed</span>
            <span>Started</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Web Design: Form Figmo to we...</h3>
        <ul className="course-topics">
          <li>Firmi Basics</li>
          <li>Data with python</li>
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Status</h3>
        <div className="calendar">
          <div className="weekdays">
            <span>No</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>
          <div className="days">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[8, 9, 10, 11, 12, 13, 14].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[15, 16, 17, 18, 19, 20, 21].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[22, 24, 25, 26, 27, 28].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[29, 30, 1, 2, 3, 4, 5].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Upcoming</h3>
        <div className="upcoming-items">
          <div className="upcoming-item">
            <p>Practical theory</p>
            <span>Assignments</span>
          </div>
          <div className="upcoming-item">
            <p>Practical theory I</p>
            <span>Test</span>
          </div>
          <div className="upcoming-item">
            <p>Practical theory 2</p>
            <span>Lessons</span>
          </div>
          <div className="upcoming-item">
            <p>Practical theory 3</p>
            <span>Assignments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;