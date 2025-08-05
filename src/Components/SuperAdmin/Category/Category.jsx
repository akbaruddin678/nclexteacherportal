import React, { useState } from "react";
import "./Category.css";
import data from "./categoryData.json";

const Category = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Get list of cities
  const cities = data.cities.map((city) => city.name);

  // Get campuses in the selected city
  const campusesInCity = selectedCity
    ? data.cities.find((city) => city.name === selectedCity)?.campuses || []
    : [];

  // Handle campus selection
  const handleSelectCampus = (campusName) => {
    const campus = campusesInCity.find((c) => c.name === campusName);
    setSelectedCampus(campus);
    setSelectedProgram(null);
    setSelectedSubject(null);
  };

  // Handle program selection
  const handleSelectProgram = (programName) => {
    const program = selectedCampus?.programs.find((p) => p.name === programName);
    setSelectedProgram(program);
    setSelectedSubject(null);
  };

  // Handle subject selection
  const handleSelectSubject = (subjectName) => {
    const subject = selectedProgram?.subjects.find((s) => s.name === subjectName);
    setSelectedSubject(subject);
  };

  return (
    <div className="category-container">
      <h2 className="title">Explore Programs by City</h2>

      {/* Select City */}
      <div className="dropdown-section">
        <label>Select City:</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedCampus(null);
            setSelectedProgram(null);
            setSelectedSubject(null);
          }}
        >
          <option value="">-- Choose City --</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Select Campus */}
      {selectedCity && (
        <div className="panel">
          <h3 className="section-title">Campuses in {selectedCity}</h3>
          <div className="button-grid">
            {campusesInCity.map((campus, idx) => (
              <button
                key={idx}
                className={`styled-btn ${selectedCampus?.name === campus.name ? "active-btn" : ""}`}
                onClick={() => handleSelectCampus(campus.name)}
              >
                {campus.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select Program */}
      {selectedCampus && (
        <div className="panel">
          <h3 className="section-title">Programs Offered by {selectedCampus.name}</h3>
          <div className="button-grid">
            {selectedCampus.programs.map((prog, idx) => (
              <button
                key={idx}
                className={`styled-btn ${selectedProgram?.name === prog.name ? "active-btn" : ""}`}
                onClick={() => handleSelectProgram(prog.name)}
              >
                {prog.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select Subject */}
      {selectedProgram && (
        <div className="panel">
          <h3 className="section-title">Subjects in {selectedProgram.name}</h3>
          <div className="button-grid">
            {selectedProgram.subjects.map((subj, idx) => (
              <button
                key={idx}
                className={`styled-btn ${selectedSubject?.name === subj.name ? "active-btn" : ""}`}
                onClick={() => handleSelectSubject(subj.name)}
              >
                {subj.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show Teacher & Students */}
      {selectedSubject && (
        <div className="panel">
          <h3 className="section-title">
            Teacher: {selectedSubject.teacher.teacher} - {selectedSubject.name}
          </h3>
          <table className="student-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {selectedSubject.students.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Category;
