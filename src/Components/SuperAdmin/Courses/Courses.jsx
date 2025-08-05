import React, { useState } from 'react';
import './Courses.css';
import { MdSearch } from 'react-icons/md';

const CoursesOffered = () => {
  const [programs, setPrograms] = useState([
    {
      name: 'InterTech',
      subjects: [
        {
          name: 'Mathematics 101',
          teacher: 'Mr. Thompson',
          schedule: 'Mon, Wed, Fri 9:00 AM – 10:00 AM',
        },
        {
          name: 'Computer Science Basics',
          teacher: 'Ms. Foster',
          schedule: 'Mon, Wed, Fri 11:00 AM – 1:00 PM',
        },
      ],
    },
    {
      name: 'Matric Tech',
      subjects: [
        {
          name: 'English Literature',
          teacher: '',
          schedule: 'Mon, Wed, Fri 11:00 AM – 1:00 PM',
        },
        {
          name: 'History of Civilization',
          teacher: '',
          schedule: 'Mon, Wed, Fri 9:00 AM – 10:00 AM',
        },
      ],
    },
    {
      name: 'Medical Tech',
      subjects: [
        {
          name: 'Science Fundamentals',
          teacher: 'Dr. Evans',
          schedule: 'Mon, Wed, Fri 1:00 PM – 3:00 PM',
        },
      ],
    },
  ]);

  const [selectedProgram, setSelectedProgram] = useState('InterTech');

  const [newCourse, setNewCourse] = useState({
    program: 'InterTech',
    name: '',
    teacher: '',
    schedule: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const updatedPrograms = programs.map((p) => {
      if (p.name === newCourse.program) {
        return {
          ...p,
          subjects: [
            ...p.subjects,
            {
              name: newCourse.name,
              teacher: newCourse.teacher,
              schedule: newCourse.schedule,
            },
          ],
        };
      }
      return p;
    });

    setPrograms(updatedPrograms);
    setNewCourse({ program: 'InterTech', name: '', teacher: '', schedule: '' });
    setShowModal(false);
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>Program Course Overview</h2>
        <button className="add-course-button" onClick={() => setShowModal(true)}>+ Add New</button>
      </div>

      <div className="sub-header">
        <a href="#" className="manage-link">Manage course offering</a>
        <select onChange={(e) => setSelectedProgram(e.target.value)} value={selectedProgram}>
          {programs.map((prog, idx) => (
            <option key={idx} value={prog.name}>{prog.name}</option>
          ))}
        </select>
      </div>

      <div className="courses-table">
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Assigned Teacher</th>
              <th>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {programs.find((p) => p.name === selectedProgram)?.subjects.map((subject, idx) => (
              <tr key={idx}>
                <td>{subject.name}</td>
                <td>{subject.teacher || '-'}</td>
                <td>{subject.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Course</h3>
            <form onSubmit={handleAddCourse}>
              <select name="program" value={newCourse.program} onChange={handleChange} required>
                {programs.map((p, idx) => (
                  <option key={idx} value={p.name}>{p.name}</option>
                ))}
              </select>
              <input type="text" name="name" placeholder="Course Name" value={newCourse.name} onChange={handleChange} required />
              <input type="text" name="teacher" placeholder="Assigned Teacher" value={newCourse.teacher} onChange={handleChange} />
              <input type="text" name="schedule" placeholder="Schedule (e.g. Mon, Wed, 9AM–11AM)" value={newCourse.schedule} onChange={handleChange} required />
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
