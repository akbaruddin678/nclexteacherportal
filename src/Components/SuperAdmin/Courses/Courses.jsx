import React, { useState, useEffect } from 'react';
import './Courses.css';
import { MdSearch } from 'react-icons/md';

// Import the JSON file directly (if it's inside the src folder)
import categoryData from '../Category/categoryData.json';  // Adjust the path if necessary

const CoursesOffered = () => {
  const [cities, setCities] = useState([]); // Stores the list of cities and campus data
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    city: '',
    campus: '',
    program: '',
    name: '',
    description: '',
    teacher: '',
    students: '',
    schedule: '',
  });

  // Fetch data from the imported JSON structure
  useEffect(() => {
  console.log(categoryData);  // Check the data structure
  setCities(categoryData);
  setSelectedCity(categoryData[0]?.name || '');
  setSelectedCampus(categoryData[0]?.campuses[0]?.name || '');
  setSelectedProgram(categoryData[0]?.campuses[0]?.programs[0]?.name || '');
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const updatedCities = cities.map((city) => {
      if (city.name === newCourse.city) {
        return {
          ...city,
          campuses: city.campuses.map((campus) => {
            if (campus.name === newCourse.campus) {
              return {
                ...campus,
                programs: campus.programs.map((program) => {
                  if (program.name === newCourse.program) {
                    return {
                      ...program,
                      subjects: [
                        ...program.subjects,
                        {
                          name: newCourse.name,
                          description: newCourse.description,
                          teacher: newCourse.teacher,
                          students: parseInt(newCourse.students),
                          schedule: newCourse.schedule,
                        },
                      ],
                    };
                  }
                  return program;
                }),
              };
            }
            return campus;
          }),
        };
      }
      return city;
    });

    setCities(updatedCities);
    setNewCourse({
      city: '',
      campus: '',
      program: '',
      name: '',
      description: '',
      teacher: '',
      students: '',
      schedule: '',
    });
    setShowModal(false);
  };

  // Find selected city, campus, and program
  const selectedCityData = cities.find((city) => city.name === selectedCity);
  const selectedCampusData = selectedCityData?.campuses.find((campus) => campus.name === selectedCampus);
  const selectedProgramData = selectedCampusData?.programs.find((program) => program.name === selectedProgram);

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>Program Course Overview</h2>
        <button className="add-course-button" onClick={() => setShowModal(true)}>+ Add New</button>
      </div>

      <div className="sub-header">
        <a href="#" className="manage-link">Manage course offering</a>
        {/* City Selection */}
        <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
          {cities.map((city, idx) => (
            <option key={idx} value={city.name}>{city.name}</option>
          ))}
        </select>
        {/* Campus Selection */}
        <select onChange={(e) => setSelectedCampus(e.target.value)} value={selectedCampus}>
          {selectedCityData?.campuses.map((campus, idx) => (
            <option key={idx} value={campus.name}>{campus.name}</option>
          ))}
        </select>
        {/* Program Selection */}
        <select onChange={(e) => setSelectedProgram(e.target.value)} value={selectedProgram}>
          {selectedCampusData?.programs.map((program, idx) => (
            <option key={idx} value={program.name}>{program.name}</option>
          ))}
        </select>
      </div>

      <div className="courses-table">
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Assigned Teacher</th>
              <th>Enrolled Students</th>
              <th>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {selectedProgramData?.subjects.map((subject, idx) => (
              <tr key={idx}>
                <td>{subject.name}</td>
                <td>{subject.description}</td>
                <td>{subject.teacher}</td>
                <td>{subject.students}</td>
                <td>{subject.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding New Course */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Course</h3>
            <form onSubmit={handleAddCourse}>
              <select name="city" value={newCourse.city} onChange={handleChange} required>
                {cities.map((city, idx) => (
                  <option key={idx} value={city.name}>{city.name}</option>
                ))}
              </select>
              <select name="campus" value={newCourse.campus} onChange={handleChange} required>
                {selectedCityData?.campuses.map((campus, idx) => (
                  <option key={idx} value={campus.name}>{campus.name}</option>
                ))}
              </select>
              <select name="program" value={newCourse.program} onChange={handleChange} required>
                {selectedCampusData?.programs.map((program, idx) => (
                  <option key={idx} value={program.name}>{program.name}</option>
                ))}
              </select>
              <input type="text" name="name" placeholder="Course Name" value={newCourse.name} onChange={handleChange} required />
              <input type="text" name="teacher" placeholder="Assigned Teacher" value={newCourse.teacher} onChange={handleChange} />
              <input type="number" name="students" placeholder="Enrolled Students" value={newCourse.students} onChange={handleChange} required />
              <input type="text" name="schedule" placeholder="Schedule (e.g. Mon, Wed, 9AM–11AM)" value={newCourse.schedule} onChange={handleChange} required />
              <textarea name="description" placeholder="Course Description" value={newCourse.description} onChange={handleChange} required />
              <div className="modal-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesOffered;
