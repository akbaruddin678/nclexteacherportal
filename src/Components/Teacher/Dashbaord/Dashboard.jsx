import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

/** Utilities */
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const fetchJSON = async (url, token) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${res.status} ${res.statusText} — ${text || "Request failed"}`
    );
  }
  return res.json();
};

const fmtDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const onlyDateKey = (iso) => new Date(iso).toISOString().slice(0, 10);

/** Calendar component (essential) */
const Calendar = ({ eventDates = [] }) => {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const todayKey = onlyDateKey(new Date().toISOString());

  const info = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth(); // 0-11
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // make Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    // Leading blanks
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    // Month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    // Trailing blanks to complete rows of 7
    while (cells.length % 7 !== 0) cells.push(null);

    return {
      year,
      month,
      label: new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }).format(firstDay),
      cells,
    };
  }, [cursor]);

  const eventSet = useMemo(
    () => new Set(eventDates.map(onlyDateKey)),
    [eventDates]
  );

  const prevMonth = () =>
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="cal">
      <div className="cal-header">
        <button
          className="cal-nav"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h4>{info.label}</h4>
        <button className="cal-nav" onClick={nextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="cal-grid cal-weekdays">
        {weekdays.map((w) => (
          <div key={w} className="cal-weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="cal-grid cal-days">
        {info.cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-cell empty" />;
          const key = onlyDateKey(d.toISOString());
          const isToday = key === todayKey;
          const hasEvent = eventSet.has(key);
          return (
            <div key={i} className={`cal-cell day ${isToday ? "today" : ""}`}>
              <span className="date">{d.getDate()}</span>
              {hasEvent && <span className="dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("You are not signed in. Token missing.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetchJSON(
          `${API_BASE}/api/v1/teacher/dashboard`,
          token
        );
        setData(res?.data || null);
      } catch (e) {
        setErr(e.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = data?.statistics || {};
  const courses = data?.courses || [];
  const assessments = data?.assessments || [];
  const attendance = data?.attendance || [];

  // Build "Upcoming" from assessments sorted by date desc->asc (nearest future first)
  const upcoming = useMemo(() => {
    const now = new Date();
    return assessments
      .filter((a) => (a?.date ? new Date(a.date) : null))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((a) => new Date(a.date) >= now)
      .slice(0, 6);
  }, [assessments]);

  // Dates to dot on calendar (attendance + assessments)
  const calendarDates = useMemo(() => {
    const dates = [];
    for (const a of attendance) if (a?.date) dates.push(a.date);
    for (const e of assessments) if (e?.date) dates.push(e.date);
    return dates;
  }, [attendance, assessments]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card skeleton" />
        <div className="card skeleton" />
        <div className="card skeleton tall" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="dashboard">
        <div className="error-banner">
          <strong>Dashboard error:</strong> {err}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top stats */}
      <section className="stats">
        <div className="stat">
          <span className="stat-label">Courses</span>
          <span className="stat-value">{stats.courses ?? 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Campus Students</span>
          <span className="stat-value">{stats.campusStudents ?? 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Attendance Records</span>
          <span className="stat-value">{stats.attendanceRecords ?? 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Assessments</span>
          <span className="stat-value">{stats.assessments ?? 0}</span>
        </div>
      </section>

      <div className="grid">
        {/* My Courses */}
        <section className="card">
          <h3>My Courses</h3>
          {courses.length === 0 ? (
            <p className="muted">No courses assigned.</p>
          ) : (
            <ul className="course-list">
              {courses.map((c) => (
                <li key={c._id} className="course-itemteacher">
                  <div className="course-title">
                    {c.name || "Untitled Course"}
                  </div>
                  <div className="course-meta">
                    <span>No. Students : {c?.students?.length || 0} </span>

                    {c?.code && <span>• {c.code}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Calendar (essential) */}
        <section className="card">
          <h3>Calendar</h3>
          <Calendar eventDates={calendarDates} />
          <div className="legend">
            <span className="legend-dot" /> Attendance / Assessments
          </div>
        </section>

        {/* Upcoming (derived from assessments) */}
        <section className="card">
          <h3>Upcoming</h3>
          {upcoming.length === 0 ? (
            <p className="muted">No upcoming items.</p>
          ) : (
            <ul className="upcoming-list">
              {upcoming.map((u) => (
                <li key={u._id} className="upcoming-item">
                  <div className="up-title">
                    {u?.type ? u.type.toUpperCase() : "ASSESSMENT"} —{" "}
                    {u?.course?.name || "Course"}
                  </div>
                  <div className="up-meta">
                    <span>{fmtDate(u.date)}</span>
                    {u?.student?.name && <span>• {u.student.name}</span>}
                    {u?.gradedBy?.name && (
                      <span>• Graded by {u.gradedBy.name}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
