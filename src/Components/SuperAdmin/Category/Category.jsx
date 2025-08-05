// src/components/Category.jsx

import React, { useState, useEffect } from "react";
import "./Category.css";
import data from "./categoryData.json";
import { FaDownload } from "react-icons/fa";

const Category = () => {
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const result = data.institutes.find(
      (institute) => institute.name === selectedInstitute
    );
    setFilteredData(result || null);
    setSelectedCourse(null);
  }, [selectedInstitute]);

  const handleDownloadCSV = () => {
    if (!selectedCourse) return;
    const headers = ["#", "Name"];
    const rows = selectedCourse.students.map((student, index) => [
      index + 1,
      student.name,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedCourse.name}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="category-container">
      <div className="top-filter">
        <input
          type="text"
          placeholder="Search institute..."
          value={selectedInstitute}
          onChange={(e) => setSelectedInstitute(e.target.value)}
        />
        <select
          onChange={(e) => setSelectedInstitute(e.target.value)}
          value={selectedInstitute}
        >
          <option value="">Select Institute</option>
          {data.institutes.map((institute, index) => (
            <option key={index} value={institute.name}>
              {institute.name}
            </option>
          ))}
        </select>
      </div>

      {filteredData && (
        <>
          <div className="principal-card">
            <div className="principal-info">
              <h3>Dr. {filteredData.principal.name}</h3>
              <p>Email: {filteredData.principal.email}</p>
              <p>Phone: {filteredData.principal.phone}</p>
              <p>City: {filteredData.principal.city}</p>
              <p>Total Students: {filteredData.principal.totalStudents}</p>
              <p>Total Teachers: {filteredData.principal.totalTeachers}</p>
            </div>
          </div>

          <div className="courses-section">
            <h4>Courses Offered</h4>
            <div className="course-buttons">
              {filteredData.courses.map((course, index) => (
                <button
                  key={index}
                  className="course-btn"
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.name} ({course.students.length})
                </button>
              ))}
            </div>
          </div>

          {selectedCourse && (
            <div className="student-table-wrapper">
              <h5>Students in {selectedCourse.name}</h5>
              <table className="student-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourse.students.map((student, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="btn-actions">
                <button onClick={handleDownloadCSV} className="csv-btn">
                  <FaDownload /> Download CSV
                </button>
                <button
                  className="back-btn"
                  onClick={() => setSelectedCourse(null)}
                >
                  Back to Courses
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
