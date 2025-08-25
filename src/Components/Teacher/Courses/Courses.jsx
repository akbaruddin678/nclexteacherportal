import React, { useEffect, useMemo, useState } from "react";
import "./Courses.css";
import {
  MdSearch,
  MdExpandMore,
  MdExpandLess,
  MdAssessment,
  MdArrowBack,
  MdGrade,
  MdPerson,
} from "react-icons/md";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://nclex.ap-south-1.elasticbeanstalk.com";

// Initial dummy data
const initialDummyAssessments = {
  course1: [
    {
      id: 1,
      type: "Final",
      status: "Created",
      title: "Final Exam",
      date: "2023-12-15",
      description: "Comprehensive final examination",
      totalMarks: "100",
      studentMarks: {
        1: { name: "Alice", marks: "85", comments: "Excellent work" },
        2: { name: "Bob", marks: "72", comments: "Good effort" },
      },
    },
    {
      id: 2,
      type: "Midterm",
      status: "Created",
      title: "Midterm Test",
      date: "2023-10-20",
      description: "Midterm examination covering first half of course",
      totalMarks: "50",
      studentMarks: {
        1: { name: "Alice", marks: "45", comments: "Very good" },
        2: { name: "Bob", marks: "38", comments: "Satisfactory" },
      },
    },
    {
      id: 3,
      type: "Quiz",
      status: "Created",
      title: "Quiz 1",
      date: "2023-09-15",
      description: "Basic concepts quiz",
      totalMarks: "20",
      studentMarks: {
        1: { name: "Alice", marks: "18", comments: "Excellent" },
        2: { name: "Bob", marks: "15", comments: "Good" },
      },
    },
  ],
  course2: [
    {
      id: 4,
      type: "Final",
      status: "Created",
      title: "JavaScript Final",
      date: "2023-12-10",
      description: "Final JavaScript examination",
      totalMarks: "100",
      studentMarks: {
        3: { name: "Charlie", marks: "88", comments: "Great job" },
        4: { name: "David", marks: "79", comments: "Well done" },
      },
    },
    { id: 5, type: "Midterm", status: "Not Created" },
    { id: 6, type: "Assignment", status: "Not Created" },
  ],
  course3: [
    { id: 7, type: "Final", status: "Not Created" },
    { id: 8, type: "Project", status: "Not Created" },
  ],
};

const CoursesOffered = () => {
  const [courses, setCourses] = useState([
    {
      _id: "course1",
      name: "React Development",
      code: "REACT101",
      teacher: { name: "John Doe" },
      students: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      schedule: "Mon, Wed, Fri 10:00 - 12:00",
      description:
        "Learn modern React development with hooks, context API, and advanced patterns.",
    },
    {
      _id: "course2",
      name: "JavaScript Basics",
      code: "JS101",
      teacher: { name: "Jane Smith" },
      students: [
        { id: 3, name: "Charlie" },
        { id: 4, name: "David" },
      ],
      schedule: "Tue, Thu 14:00 - 16:00",
      description:
        "Master the fundamentals of JavaScript programming language.",
    },
    {
      _id: "course3",
      name: "Advanced Web Development",
      code: "WEB401",
      teacher: { name: "Michael Johnson" },
      students: [
        { id: 5, name: "Emma" },
        { id: 6, name: "Frank" },
      ],
      schedule: "Mon, Thu 13:00 - 15:00",
      description:
        "Advanced concepts in web development including performance optimization and security.",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [currentAssessmentType, setCurrentAssessmentType] = useState("");
  const [currentCourseId, setCurrentCourseId] = useState("");
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalMarks: "",
  });
  const [studentMarks, setStudentMarks] = useState({});
  const [dummyAssessments, setDummyAssessments] = useState(
    initialDummyAssessments
  );
  const [viewMode, setViewMode] = useState({});
  const [view, setView] = useState("courses"); // 'courses', 'assessmentManagement', 'assessmentView'
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    // Simulate fetching courses
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter((c) => {
      const name = (c?.name || "").toLowerCase();
      const code = (c?.code || "").toLowerCase();
      const teacher = (c?.teacher?.name || "").toLowerCase();
      return name.includes(q) || code.includes(q) || teacher.includes(q);
    });
  }, [courses, query]);

  const handleCourseClick = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  const handleCreateAssessment = (courseId, type) => {
    setCurrentCourseId(courseId);
    setCurrentAssessmentType(type);
    setShowCreateModal(true);
  };

  const handleSubmitAssessment = (e) => {
    e.preventDefault();

    // Update the dummy assessment data
    const newAssessmentData = {
      id: Math.floor(Math.random() * 1000),
      type: currentAssessmentType,
      status: "Created",
      title: newAssessment.title,
      date: newAssessment.dueDate,
      description: newAssessment.description,
      totalMarks: newAssessment.totalMarks,
      studentMarks: {},
    };

    // Initialize empty marks for all students
    const course = courses.find((c) => c._id === currentCourseId);
    if (course) {
      course.students.forEach((student) => {
        newAssessmentData.studentMarks[student.id] = {
          name: student.name,
          marks: "",
          comments: "",
        };
      });
    }

    // Update assessments state
    setDummyAssessments((prev) => {
      const courseAssessments = prev[currentCourseId] || [];
      const updatedAssessments = courseAssessments.map((assessment) =>
        assessment.type === currentAssessmentType
          ? newAssessmentData
          : assessment
      );

      // If assessment type didn't exist, add it
      if (!courseAssessments.some((a) => a.type === currentAssessmentType)) {
        updatedAssessments.push(newAssessmentData);
      }

      return {
        ...prev,
        [currentCourseId]: updatedAssessments,
      };
    });

    setShowCreateModal(false);
    setNewAssessment({
      title: "",
      description: "",
      dueDate: "",
      totalMarks: "",
    });

    // Show success message
    alert("Assessment created successfully!");
  };

  const getAssessmentStatus = (courseId, assessmentType) => {
    const assessments = dummyAssessments[courseId] || [];
    const assessment = assessments.find((a) => a.type === assessmentType);
    return assessment ? assessment.status : "Not Created";
  };

  const getAssessmentDetails = (courseId, assessmentType) => {
    const assessments = dummyAssessments[courseId] || [];
    return assessments.find((a) => a.type === assessmentType);
  };

  const getAllAssessments = (courseId) => {
    return dummyAssessments[courseId] || [];
  };

  const toggleViewMode = (courseId, assessmentType) => {
    setViewMode((prev) => ({
      ...prev,
      [`${courseId}-${assessmentType}`]: !prev[`${courseId}-${assessmentType}`],
    }));
  };

  const handleManageMarks = (courseId, assessment) => {
    setCurrentCourseId(courseId);
    setCurrentAssessment(assessment);
    setStudentMarks({ ...assessment.studentMarks });
    setShowMarksModal(true);
  };

  const handleSubmitMarks = (e) => {
    e.preventDefault();

    // Update assessment with new marks
    setDummyAssessments((prev) => {
      const courseAssessments = prev[currentCourseId] || [];
      const updatedAssessments = courseAssessments.map((assessment) => {
        if (assessment.id === currentAssessment.id) {
          return {
            ...assessment,
            studentMarks: { ...studentMarks },
          };
        }
        return assessment;
      });

      return {
        ...prev,
        [currentCourseId]: updatedAssessments,
      };
    });

    setShowMarksModal(false);
    alert("Marks updated successfully!");
  };

  const handleMarksChange = (studentId, field, value) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleAssessmentManagement = () => {
    setView("assessmentManagement");
    setExpandedCourse(null);
  };

  const handleBackToCourses = () => {
    setView("courses");
  };

  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setView("assessmentView");
  };

  const renderCoursesView = () => (
    <div className="courses-grid">
      {filtered.length === 0 ? (
        <div className="no-courses">
          <MdAssessment size={48} />
          <p>No courses found.</p>
        </div>
      ) : (
        filtered.map((course) => {
          const studentsCount = course.students.length;
          const isExpanded = expandedCourse === course._id;

          return (
            <div
              key={course._id}
              className={`course-card ${isExpanded ? "expanded" : ""}`}
            >
              <div
                className="course-card-header"
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="course-info">
                  <h3>{course.name}</h3>
                  <p>
                    {course.code} • {course.teacher.name}
                  </p>
                </div>
                <div className="course-stats">
                  <span className="students-count">
                    {studentsCount} students
                  </span>
                  {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                </div>
              </div>

              {isExpanded && (
                <div className="course-details">
                  <div className="detail-section">
                    <h4>Course Details</h4>
                    <p>{course.description}</p>
                    <p>
                      <strong>Schedule:</strong> {course.schedule}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h4>Assessments</h4>
                    <div className="assessments-container">
                      {getAllAssessments(course._id).map((assessment) => (
                        <div key={assessment.id} className="assessment-item">
                          <div className="assessment-info">
                            <h5>{assessment.type} Assessment</h5>
                            {assessment.status === "Created" ? (
                              <div>
                                {viewMode[
                                  `${course._id}-${assessment.type}`
                                ] ? (
                                  <div className="assessment-details-expanded">
                                    <p>
                                      <strong>Title:</strong> {assessment.title}
                                    </p>
                                    <p>
                                      <strong>Description:</strong>{" "}
                                      {assessment.description}
                                    </p>
                                    <p>
                                      <strong>Due Date:</strong>{" "}
                                      {assessment.date}
                                    </p>
                                    <p>
                                      <strong>Total Marks:</strong>{" "}
                                      {assessment.totalMarks}
                                    </p>
                                    <button
                                      className="hide-btn"
                                      onClick={() =>
                                        toggleViewMode(
                                          course._id,
                                          assessment.type
                                        )
                                      }
                                    >
                                      Hide Details
                                    </button>
                                  </div>
                                ) : (
                                  <div className="assessment-details">
                                    <span>{assessment.title}</span>
                                    <span className="assessment-date">
                                      Due: {assessment.date}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="not-created">
                                No {assessment.type.toLowerCase()} assessment
                                created yet
                              </p>
                            )}
                          </div>
                          <div className="assessment-actions">
                            {assessment.status === "Created" ? (
                              <>
                                <button
                                  className="view-btn"
                                  onClick={() =>
                                    toggleViewMode(course._id, assessment.type)
                                  }
                                >
                                  {viewMode[`${course._id}-${assessment.type}`]
                                    ? "Hide"
                                    : "View"}{" "}
                                  Details
                                </button>
                                <button
                                  className="marks-btn"
                                  onClick={() =>
                                    handleManageMarks(course._id, assessment)
                                  }
                                >
                                  Manage Marks
                                </button>
                              </>
                            ) : (
                              <button
                                className="create-btn"
                                onClick={() =>
                                  handleCreateAssessment(
                                    course._id,
                                    assessment.type
                                  )
                                }
                              >
                                Create
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderAssessmentManagement = () => {
    return (
      <div className="assessment-management">
        <div className="management-header">
          <button className="back-btn" onClick={handleBackToCourses}>
            <MdArrowBack /> Back to Courses
          </button>
          <h2>Assessment Management</h2>
        </div>

        <div className="courses-list-management">
          {courses.map((course) => (
            <div key={course._id} className="management-course-card">
              <h3>
                {course.name} ({course.code})
              </h3>
              <p>Teacher: {course.teacher.name}</p>
              <p>Students: {course.students.length}</p>

              <div className="assessments-list">
                <h4>Assessments</h4>
                {getAllAssessments(course._id).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="management-assessment-item"
                  >
                    <div className="assessment-summary">
                      <h5>
                        {assessment.type}: {assessment.title || "Not Created"}
                      </h5>
                      {assessment.status === "Created" && (
                        <p>
                          Due: {assessment.date} | Total Marks:{" "}
                          {assessment.totalMarks}
                        </p>
                      )}
                    </div>
                    <div className="management-actions">
                      {assessment.status === "Created" ? (
                        <>
                          <button
                            className="view-btn"
                            onClick={() => handleViewAssessment(assessment)}
                          >
                            View Assessment
                          </button>
                          <button
                            className="marks-btn"
                            onClick={() =>
                              handleManageMarks(course._id, assessment)
                            }
                          >
                            Manage Marks
                          </button>
                        </>
                      ) : (
                        <button
                          className="create-btn"
                          onClick={() =>
                            handleCreateAssessment(course._id, assessment.type)
                          }
                        >
                          Create {assessment.type}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssessmentView = () => {
    if (!selectedAssessment) return null;

    return (
      <div className="assessment-view">
        <div className="view-header">
          <button
            className="back-btn"
            onClick={() => setView("assessmentManagement")}
          >
            <MdArrowBack /> Back to Management
          </button>
          <h2>
            {selectedAssessment.type} Assessment: {selectedAssessment.title}
          </h2>
        </div>

        <div className="assessment-details-view">
          <div className="detail-card">
            <h3>Assessment Information</h3>
            <p>
              <strong>Description:</strong> {selectedAssessment.description}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedAssessment.date}
            </p>
            <p>
              <strong>Total Marks:</strong> {selectedAssessment.totalMarks}
            </p>
          </div>

          <div className="students-marks-card">
            <h3>Student Marks</h3>
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Marks</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(selectedAssessment.studentMarks || {}).map(
                  ([studentId, data]) => (
                    <tr key={studentId}>
                      <td>{data.name}</td>
                      <td>{data.marks || "Not graded"}</td>
                      <td>{data.comments || "-"}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>My Courses</h2>
        {view === "courses" && (
          <button
            className="management-btn"
            onClick={handleAssessmentManagement}
          >
            <MdGrade /> Assessment Management
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading courses…</div>
      ) : err ? (
        <div className="error-banner">
          <strong>Error:</strong> {err}
        </div>
      ) : (
        <>
          {view === "courses" && renderCoursesView()}
          {view === "assessmentManagement" && renderAssessmentManagement()}
          {view === "assessmentView" && renderAssessmentView()}
        </>
      )}

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create {currentAssessmentType} Assessment</h3>
            <form onSubmit={handleSubmitAssessment}>
              <div className="form-group">
                <label htmlFor="title">Assessment Title</label>
                <input
                  type="text"
                  id="title"
                  value={newAssessment.title}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newAssessment.description}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={newAssessment.dueDate}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      dueDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalMarks">Total Marks</label>
                <input
                  type="number"
                  id="totalMarks"
                  value={newAssessment.totalMarks}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      totalMarks: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Marks Modal */}
      {showMarksModal && currentAssessment && (
        <div className="modal-overlay" onClick={() => setShowMarksModal(false)}>
          <div
            className="modal large-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Manage Marks - {currentAssessment.title}</h3>
            <form onSubmit={handleSubmitMarks}>
              <div className="marks-form-container">
                <h4>Student Marks</h4>
                <table className="marks-input-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Marks</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(studentMarks).map(([studentId, data]) => (
                      <tr key={studentId}>
                        <td>{data.name}</td>
                        <td>
                          <input
                            type="number"
                            max={currentAssessment.totalMarks}
                            value={data.marks}
                            onChange={(e) =>
                              handleMarksChange(
                                studentId,
                                "marks",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={data.comments}
                            onChange={(e) =>
                              handleMarksChange(
                                studentId,
                                "comments",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowMarksModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesOffered;