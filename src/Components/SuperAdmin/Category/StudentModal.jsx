// src/components/StudentModal.jsx
import React from "react";
import "./StudentModal.css";

const StudentModal = ({ students, onClose }) => {
  return (
    <div className="student-modal-backdrop">
      <div className="student-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Students</h2>
        <ul>
          {students.map((student, index) => (
            <li key={index}>{student}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentModal;
