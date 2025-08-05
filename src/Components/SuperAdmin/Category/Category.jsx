import React, { useState } from "react";
import "./Category.css";
import data from "./categoryData.json";

const Category = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const cities = [...new Set(data.institutes.map((inst) => inst.city))];
  const institutesInCity = data.institutes.filter(
    (inst) => inst.city === selectedCity
  );

  const handleSelectSubject = (subjectName) => {
    const subj = selectedProgram.subjects.find((s) => s.name === subjectName);
    setSelectedSubject(subj);
  };

  const handleSelectInstitute = (instituteName) => {
    const inst = institutesInCity.find((i) => i.name === instituteName);
    setSelectedInstitute(inst);
    setSelectedProgram(null);
    setSelectedSubject(null);
  };

  const handleSelectProgram = (programName) => {
    const program = selectedInstitute.programs.find(
      (p) => p.name === programName
    );
    setSelectedProgram(program);
    setSelectedSubject(null);
  };

  return (
    <div className="category-container">
      <h2 className="title">Explore Institutes by City</h2>

      <div className="dropdown-section">
        <label>Select City:</label>
        <select
          onChange={(e) => setSelectedCity(e.target.value)}
          value={selectedCity}
        >
          <option value="">-- Choose City --</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div className="panel">
          <h3 className="section-title">Institutes in {selectedCity}</h3>
          <div className="button-grid">
            {institutesInCity.map((inst, idx) => (
              <button
                key={idx}
                className={`styled-btn ${
                  selectedInstitute?.name === inst.name ? "active-btn" : ""
                }`}
                onClick={() => handleSelectInstitute(inst.name)}
              >
                {inst.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedInstitute && (
        <div className="panel">
          <h3 className="section-title">
            Programs Offered by {selectedInstitute.name}
          </h3>
          <div className="button-grid">
            {selectedInstitute.programs.map((prog, idx) => (
              <button
                key={idx}
                className={`styled-btn ${
                  selectedProgram?.name === prog.name ? "active-btn" : ""
                }`}
                onClick={() => handleSelectProgram(prog.name)}
              >
                {prog.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProgram && (
        <div className="panel">
          <h3 className="section-title">Subjects in {selectedProgram.name}</h3>
          <div className="button-grid">
            {selectedProgram.subjects.map((subj, idx) => (
              <button
                key={idx}
                className={`styled-btn ${
                  selectedSubject?.name === subj.name ? "active-btn" : ""
                }`}
                onClick={() => handleSelectSubject(subj.name)}
              >
                {subj.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSubject && (
        <div className="panel">
          <h3 className="section-title">Students for {selectedSubject.name}</h3>
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
