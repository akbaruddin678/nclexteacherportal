import React from "react";
import "./StudentModal.css";

const StudentModal = ({ students, teacher, onClose }) => {
  return (
    <div className="student-modal-backdrop">
      <div className="student-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Subject Details</h2>
        <p><strong>Teacher:</strong> {teacher}</p>
        <h3>Students Enrolled:</h3>
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              {index + 1}. {student}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentModal;
