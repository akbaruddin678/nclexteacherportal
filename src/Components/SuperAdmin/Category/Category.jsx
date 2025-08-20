import React, { useState, useEffect, useCallback } from "react";
import * as api from "../../../services/api";
import "./Category.css";

const Category = () => {
  const [data, setData] = useState({
    campuses: [],
    coordinators: [],
    students: [],
    courses: [],
    teachers: [],
  });
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCoordinatorForm, setShowCoordinatorForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [availableCoordinators, setAvailableCoordinators] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [coordinatorForm, setCoordinatorForm] = useState({ coordinatorId: "" });
  const [courseForm, setCourseForm] = useState({ courseId: "" });
  const [teacherForm, setTeacherForm] = useState({ teacherId: "" });
  const [studentForm, setStudentForm] = useState({ studentIds: [] });
  const [city, setCity] = useState("");
  const [activeTab, setActiveTab] = useState("campus");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        campusesRes,
        coordinatorsRes,
        studentsRes,
        coursesRes,
        teachersRes,
      ] = await Promise.all([
        api.getCampuses(),
        api.getCoordinators(),
        api.getStudents(),
        api.getCourses(),
        api.getTeachers(),
      ]);
      setData({
        campuses: campusesRes.data,
        coordinators: coordinatorsRes.data,
        students: studentsRes.data,
        courses: coursesRes.data,
        teachers: teachersRes.data,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCampusSelect = (campus) => {
    setSelectedCampus(campus);
    setSelectedCourse(null);
    setActiveTab("campus");

    setAvailableCoordinators(
      data.coordinators.filter(
        (coordinator) =>
          !campus.coordinators?.some(
            (assigned) => assigned._id === coordinator._id
          )
      )
    );

    setAvailableStudents(
      data.students.filter(
        (student) =>
          !campus.students?.some((assigned) => assigned._id === student._id)
      )
    );
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setActiveTab("course");

    setAvailableTeachers(
      data.teachers.filter(
        (teacher) =>
          !course.teachers?.some((assigned) => assigned._id === teacher._id)
      )
    );
  };

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);

    try {
      const response = await api.getStudentsByCity(selectedCity);
      setAvailableStudents(
        response.data.filter(
          (student) =>
            !selectedCampus.students?.some(
              (assigned) => assigned._id === student._id
            )
        )
      );
    } catch {
      setError("Failed to fetch students by city");
    }
  };

  const handleAssignCoordinator = async () => {
    if (!coordinatorForm.coordinatorId) {
      setError("Please select a coordinator");
      return;
    }
    try {
      await api.assignCoordinatorToCampus(
        coordinatorForm.coordinatorId,
        selectedCampus._id
      );
      await fetchData();
      setShowCoordinatorForm(false);
      setCoordinatorForm({ coordinatorId: "" });
      setError(null);
    } catch {
      setError("Failed to assign coordinator");
    }
  };

  const handleAssignTeacher = async () => {
    if (!teacherForm.teacherId) {
      setError("Please select a teacher");
      return;
    }
    try {
      // Correct arg order: (courseId, teacherId)
      await api.assignTeacherToCourse(
        selectedCourse._id,
        teacherForm.teacherId
      );
      await fetchData();
      setShowTeacherForm(false);
      setTeacherForm({ teacherId: "" });
      setError(null);
    } catch {
      setError("Failed to assign teacher");
    }
  };

  const handleAssignStudentsToCampus = async () => {
    if (studentForm.studentIds.length === 0) {
      setError("Please select at least one student");
      return;
    }
    try {
      await api.assignStudentsToCampus(
        studentForm.studentIds,
        selectedCampus._id
      );
      await fetchData();
      setShowStudentForm(false);
      setStudentForm({ studentIds: [] });
      setError(null);
    } catch {
      setError("Failed to assign students");
    }
  };

  // FIXED: use the namespaced export (api.assignCoursesToCampus)
  const handleAssignCourse = async () => {
    if (!courseForm.courseId) {
      setError("Please select a course");
      return;
    }
    console.log(data.courses);
    try {
      await api.assignCoursesToCampus(
        [courseForm.courseId],
        selectedCampus._id
      );
      await fetchData();
      setShowCourseForm(false);
      setCourseForm({ courseId: "" });
      setError(null);
    } catch (err) {
      console.error("Assignment error:", err.response?.data || err.message);
      setError(
        "Failed to assign course: " +
          (err.response?.data?.message || "Please try again")
      );
    }
  };

  const handleRemoveCoordinator = async () => {
    if (
      !selectedCampus.coordinators ||
      selectedCampus.coordinators.length === 0
    ) {
      setError("No coordinator assigned to remove");
      return;
    }
    try {
      await api.removeCoordinatorFromCampus(
        selectedCampus.coordinators[0]._id,
        selectedCampus._id
      );
      await fetchData();
      setError(null);
    } catch {
      setError("Failed to remove coordinator");
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    try {
      await api.removeTeacherFromCourse(teacherId, selectedCourse._id);
      await fetchData();
      setError(null);
    } catch {
      setError("Failed to remove teacher");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await api.removeStudentFromCampus(studentId, selectedCampus._id);
      await fetchData();
      setError(null);
    } catch {
      setError("Failed to remove student");
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      await api.removeCourseFromCampus(courseId, selectedCampus._id);
      await fetchData();
      setError(null);
    } catch {
      setError("Failed to remove course");
    }
  };

  const CampusDetail = () => (
    <div className="detail-container">
      <div className="detail-header">
        <h2>{selectedCampus.name}</h2>
        <div className="detail-stats">
          <span>
            <strong>Coordinators:</strong>{" "}
            {selectedCampus.coordinators?.length || 0}
          </span>
          <span>
            <strong>Students:</strong> {selectedCampus.students?.length || 0}
          </span>
          <span>
            <strong>Courses:</strong> {selectedCampus.courses?.length || 0}
          </span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "campus" ? "active" : ""}`}
          onClick={() => setActiveTab("campus")}
        >
          Campus Details
        </button>
        <button
          className={`tab-btn ${activeTab === "course" ? "active" : ""}`}
          onClick={() => setActiveTab("course")}
        >
          Courses
        </button>
      </div>

      {activeTab === "campus" && (
        <div className="tab-content">
          <div className="action-buttons">
            <button
              className="action-btn assign"
              onClick={() => setShowCoordinatorForm(true)}
            >
              Assign Coordinator
            </button>
            <button
              className="action-btn assign"
              onClick={() => setShowStudentForm(true)}
            >
              Assign Students
            </button>
            <button
              className="action-btn assign"
              onClick={() => setShowCourseForm(true)}
            >
              Assign Course
            </button>
          </div>

          <div className="detail-section">
            <h3>Assigned Coordinators</h3>
            {selectedCampus.coordinators?.length > 0 ? (
              <ul className="assigned-list">
                {selectedCampus.coordinators.map((coordinator) => (
                  <li key={coordinator._id} className="assigned-item">
                    <span>{coordinator.name}</span>
                    <button
                      className="remove-btn"
                      onClick={handleRemoveCoordinator}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No coordinators assigned</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Assigned Students</h3>
            {selectedCampus.students?.length > 0 ? (
              <ul className="assigned-list">
                {selectedCampus.students.map((student) => (
                  <li key={student._id} className="assigned-item">
                    <span>
                      {student.name} ({student.city})
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveStudent(student._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students assigned</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "course" && (
        <div className="tab-content">
          <div className="courses-list">
            {selectedCampus.courses?.length > 0 ? (
              selectedCampus.courses.map((course) => (
                <div
                  key={course._id}
                  className={`course-card ${
                    selectedCourse?._id === course._id ? "selected" : ""
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <h4>{course.name}</h4>
                  <p>
                    <strong>Teachers:</strong> {course.teachers?.length || 0}
                  </p>
                  {selectedCourse?._id === course._id && (
                    <div className="course-details">
                      <div className="action-buttons">
                        <button
                          className="action-btn assign"
                          onClick={() => setShowTeacherForm(true)}
                        >
                          Assign Teacher
                        </button>
                        <button
                          className="action-btn remove"
                          onClick={() => handleRemoveCourse(course._id)}
                        >
                          Remove Course
                        </button>
                      </div>
                      <h5>Assigned Teachers</h5>
                      {course.teachers?.length > 0 ? (
                        <ul className="assigned-list">
                          {course.teachers.map((teacher) => (
                            <li key={teacher._id} className="assigned-item">
                              <span>{teacher.name}</span>
                              <button
                                className="remove-btn"
                                onClick={() => handleRemoveTeacher(teacher._id)}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No teachers assigned</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No courses assigned to this campus</p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showCoordinatorForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Coordinator</h3>
            <div className="form-group">
              <label>Select Coordinator</label>
              <select
                value={coordinatorForm.coordinatorId}
                onChange={(e) =>
                  setCoordinatorForm({ coordinatorId: e.target.value })
                }
              >
                <option value="">-- Select Coordinator --</option>
                {availableCoordinators.map((coordinator) => (
                  <option key={coordinator._id} value={coordinator._id}>
                    {coordinator.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="confirm-btn" onClick={handleAssignCoordinator}>
                Assign
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowCoordinatorForm(false)}
              >
                Cancel
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {showCourseForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Course</h3>
            <div className="form-group">
              <label>Select Course</label>
              <select
                value={courseForm.courseId}
                onChange={(e) => setCourseForm({ courseId: e.target.value })}
              >
                <option value="">-- Select Course --</option>
                {data.courses
                  .filter(
                    (course) =>
                      !selectedCampus.courses?.some((c) => c._id === course._id)
                  )
                  .map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="confirm-btn" onClick={handleAssignCourse}>
                Assign
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowCourseForm(false)}
              >
                Cancel
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {showTeacherForm && selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Teacher to {selectedCourse.name}</h3>
            <div className="form-group">
              <label>Select Teacher</label>
              <select
                value={teacherForm.teacherId}
                onChange={(e) => setTeacherForm({ teacherId: e.target.value })}
              >
                <option value="">-- Select Teacher --</option>
                {availableTeachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="confirm-btn" onClick={handleAssignTeacher}>
                Assign
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowTeacherForm(false)}
              >
                Cancel
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {showStudentForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Students</h3>
            <div className="form-group">
              <label>Filter by City</label>
              <select value={city} onChange={handleCityChange}>
                <option value="">-- All Cities --</option>
                <option value="Lahore">Lahore</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Karachi">Karachi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Swat">Swat</option>
                <option value="Mardan">Mardan</option>
                <option value="Kohat">Kohat</option>
                <option value="Swabi">Swabi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
            </div>

            {availableStudents.length > 0 ? (
              <div className="students-list">
                <div className="select-all">
                  <input
                    type="checkbox"
                    checked={
                      studentForm.studentIds.length === availableStudents.length
                    }
                    onChange={() => {
                      if (
                        studentForm.studentIds.length ===
                        availableStudents.length
                      ) {
                        setStudentForm({ studentIds: [] });
                      } else {
                        setStudentForm({
                          studentIds: availableStudents.map((s) => s._id),
                        });
                      }
                    }}
                  />
                  <span>Select All</span>
                </div>
                {availableStudents.map((student) => (
                  <div key={student._id} className="student-item">
                    <input
                      type="checkbox"
                      checked={studentForm.studentIds.includes(student._id)}
                      onChange={() =>
                        setStudentForm((prev) => ({
                          studentIds: prev.studentIds.includes(student._id)
                            ? prev.studentIds.filter((id) => id !== student._id)
                            : [...prev.studentIds, student._id],
                        }))
                      }
                    />
                    <span>
                      {student.name} ({student.city})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No students available</p>
            )}

            <div className="form-actions">
              <button
                className="confirm-btn"
                onClick={handleAssignStudentsToCampus}
                disabled={studentForm.studentIds.length === 0}
              >
                Assign Selected Students
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowStudentForm(false)}
              >
                Cancel
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      <button className="back-btn" onClick={() => setSelectedCampus(null)}>
        Back to All Campuses
      </button>
    </div>
  );

  return (
    <div className="category-container">
      <div className="header">
        <h1>Campus Management</h1>
        <p>Manage campuses, coordinators, students, courses, and teachers</p>
      </div>

      {error &&
        !showCoordinatorForm &&
        !showCourseForm &&
        !showTeacherForm &&
        !showStudentForm && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : !selectedCampus ? (
        <div className="campuses-grid">
          {data.campuses.map((campus) => (
            <div
              key={campus._id}
              className="campus-card"
              onClick={() => handleCampusSelect(campus)}
            >
              <h3>{campus.name}</h3>
              <div className="campus-stats">
                <div>
                  <span>{campus.coordinators?.length || 0}</span>
                  <small>Coordinators</small>
                </div>
                <div>
                  <span>{campus.students?.length || 0}</span>
                  <small>Students</small>
                </div>
                <div>
                  <span>{campus.courses?.length || 0}</span>
                  <small>Courses</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CampusDetail />
      )}
    </div>
  );
};

export default Category;
