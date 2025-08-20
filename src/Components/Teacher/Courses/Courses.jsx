import React, { useEffect, useMemo, useState } from "react";
import "./Courses.css";
import { MdSearch } from "react-icons/md";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CoursesOffered = () => {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Not signed in: missing token.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/teacher/courses`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // IMPORTANT: if you’re using Authorization header (JWT), do NOT include credentials
          // credentials: "omit",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${text}`);
        }

        const json = await res.json();
        // Controller returns { success, count, data: courses }
        const list = json?.data ?? [];
        setCourses(Array.isArray(list) ? list : []);
      } catch (e) {
        setErr(e.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    })();
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

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>My Courses</h2>
      </div>

      <div className="sub-header">
        <span className="manage-link" aria-hidden>
          Assigned to you
        </span>
        <div className="search-bar">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by course, code, or teacher"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading courses…</div>
      ) : err ? (
        <div className="error-banner">
          <strong>Error:</strong> {err}
        </div>
      ) : (
        <div className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Code</th>
                <th>Assigned Teacher</th>
                <th>Enrolled Students</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", color: "#6b7280" }}
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                filtered.map((course) => {
                  const studentsCount = Array.isArray(course?.students)
                    ? course.students.length
                    : course?.studentsCount ?? 0; // fallback if you store a count
                  return (
                    <tr key={course._id}>
                      <td>{course?.name || "—"}</td>
                      <td>{course?.code || "—"}</td>
                      <td>{course?.teacher?.name || "—"}</td>
                      <td>{studentsCount}</td>
                      {/* Many schemas don’t store schedule on Course; show “—” when absent */}
                      <td>{course?.schedule || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoursesOffered;
