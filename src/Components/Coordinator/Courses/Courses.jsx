import React, { useState } from 'react';
import './Courses.css';
import { MdSearch } from 'react-icons/md';

const CoursesOffered = () => {
  const [courses, setCourses] = useState([
    {
      name: 'Mathematics 101',
      description: 'Introduction to basic mathematical concepts.',
      teacher: 'Mr. Thompson',
      students: 35,
      schedule: 'Mon, Wed, Fri 9:00 AM – 10:00 AM',
    },
    {
      name: 'English Literature',
      description: 'A survey of classic English literature.',
      teacher: '',
      students: 28,
      schedule: 'Mon, Wed, Fri 11:00 AM – 1:00 PM',
    },
    {
      name: 'Science Fundamentals',
      description: 'Fundamentals of physics, chemistry, and biology.',
      teacher: 'Dr. Evans',
      students: 42,
      schedule: 'Mon, Wed, Fri 1:00 PM – 3:00 PM',
    },
    {
      name: 'History of Civilization',
      description: 'An overview of world history from ancient times to the present.',
      teacher: '',
      students: 30,
      schedule: 'Mon, Wed, Fri 9:00 AM – 10:00 AM',
    },
    {
      name: 'Computer Science Basics',
      description: 'Introduction to programming and computer science principles.',
      teacher: 'Ms. Foster',
      students: 25,
      schedule: 'Mon, Wed, Fri 11:00 AM – 1:00 PM',
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    teacher: '',
    students: '',
    schedule: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.description || !newCourse.schedule || !newCourse.students) {
      alert("Please fill in all required fields.");
      return;
    }

    setCourses([...courses, { ...newCourse, students: parseInt(newCourse.students) }]);
    setNewCourse({ name: '', description: '', teacher: '', students: '', schedule: '' });
    setShowModal(false);
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>Courses Offered</h2>
        <button className="add-course-button" onClick={() => setShowModal(true)}>
          + Add New
        </button>
      </div>

      <div className="sub-header">
        <a href="#" className="manage-link">Manage courses offering</a>
        <div className="search-bar">
          <MdSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
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
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.teacher || '-'}</td>
                <td>{course.students}</td>
                <td>{course.schedule}</td>
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
