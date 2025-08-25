import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

/** Utilities */
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://nclex.ap-south-1.elasticbeanstalk.com";

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

/** Simple Modal */
const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

/** Calendar (unchanged except it now receives notif dates too) */
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
    const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    return {
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
          const isToday = key === onlyDateKey(new Date().toISOString());
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

  // NEW: notifications + modal state
  const [notifications, setNotifications] = useState([]);
  const [notifErr, setNotifErr] = useState("");
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("You are not signed in. Token missing.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          fetchJSON(`${API_BASE}/api/v1/teacher/dashboard`, token),
          fetchJSON(`${API_BASE}/api/v1/notifications`, token),
        ]);
        setData(dashRes?.data || null);
        setNotifications(notifRes?.data || []);
      } catch (e) {
        // If notifications fail, still show dashboard
        if (String(e.message || "").includes("/notifications")) {
          setNotifErr(e.message);
        } else {
          setErr(e.message || "Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = data?.statistics || {};
  const courses = data?.courses || [];
  const assessments = data?.assessments || [];
  const attendance = data?.attendance || [];

  // Dates to dot on calendar (attendance + assessments + notifications)
  const calendarDates = useMemo(() => {
    const dates = [];
    for (const a of attendance) if (a?.date) dates.push(a.date);
    for (const e of assessments) if (e?.date) dates.push(e.date);
    for (const n of notifications) if (n?.schedule) dates.push(n.schedule);
    return dates;
  }, [attendance, assessments, notifications]);

  // Upcoming = next assessments + scheduled notifications (soonest first)
  const upcoming = useMemo(() => {
    const now = new Date();

    const upAssess = (assessments || [])
      .filter((a) => a?.date)
      .map((a) => ({
        _id: `assess-${a._id}`,
        kind: "assessment",
        when: new Date(a.date),
        title: `${a?.type ? a.type.toUpperCase() : "ASSESSMENT"} — ${
          a?.course?.name || "Course"
        }`,
        meta: [
          fmtDate(a.date),
          a?.student?.name ? `• ${a.student.name}` : "",
          a?.gradedBy?.name ? `• Graded by ${a.gradedBy.name}` : "",
        ]
          .filter(Boolean)
          .join(" "),
      }))
      .filter((x) => x.when >= now);

    const upNotifs = (notifications || [])
      .filter((n) => n?.schedule)
      .map((n) => ({
        _id: `notif-${n._id}`,
        kind: "notification",
        when: new Date(n.schedule),
        title: `Notification — ${n.subject || "(No subject)"}`,
        meta: [
          fmtDate(n.schedule),
          n?.recipientType ? `• To: ${n.recipientType}` : "",
          n?.createdBy?.name ? `• From: ${n.createdBy.name}` : "",
        ]
          .filter(Boolean)
          .join(" "),
      }))
      .filter((x) => x.when >= now);

    return [...upAssess, ...upNotifs]
      .sort((a, b) => a.when - b.when)
      .slice(0, 6);
  }, [assessments, notifications]);

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

        {/* Calendar */}
        <section className="card">
          <h3>Calendar</h3>
          <Calendar eventDates={calendarDates} />
          <div className="legend">
            <span className="legend-dot" /> Attendance / Assessments /
            Notifications
          </div>
        </section>

        {/* Upcoming (assessments + notifications) */}
        <section className="card">
          <div className="card-head-row">
            <h3>Upcoming</h3>
            <button
              className="link-btn"
              onClick={() => setNotifModalOpen(true)}
              title="View all notifications"
            >
              View all notifications
            </button>
          </div>

          {upcoming.length === 0 ? (
            <p className="muted">No upcoming items.</p>
          ) : (
            <ul className="upcoming-list">
              {upcoming.map((u) => (
                <li
                  key={u._id}
                  className={`upcoming-item ${u.kind}`}
                  onClick={() => {
                    if (u.kind === "notification") setNotifModalOpen(true);
                  }}
                  style={{
                    cursor: u.kind === "notification" ? "pointer" : "default",
                  }}
                  title={
                    u.kind === "notification" ? "Open notifications" : undefined
                  }
                >
                  <div className="up-title">{u.title}</div>
                  <div className="up-meta">{u.meta}</div>
                </li>
              ))}
            </ul>
          )}

          {notifErr && (
            <p className="muted" style={{ marginTop: 8 }}>
              Notifications: {notifErr}
            </p>
          )}
        </section>
      </div>

      {/* Modal: All notifications */}
      <Modal
        open={notifModalOpen}
        title="All Notifications"
        onClose={() => setNotifModalOpen(false)}
      >
        {notifications.length === 0 ? (
          <p className="muted">No notifications available.</p>
        ) : (
          <ul className="notif-list">
            {notifications
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
              )
              .map((n) => (
                <li key={n._id} className="notif-row">
                  <div className="notif-subject">
                    {n.subject || "(No subject)"}
                  </div>
                  <div className="notif-meta">
                    {n.createdAt ? fmtDate(n.createdAt) : ""}
                    {n.recipientType ? ` • To: ${n.recipientType}` : ""}
                    {n?.createdBy?.name ? ` • From: ${n.createdBy.name}` : ""}
                    {n.schedule ? ` • Scheduled: ${fmtDate(n.schedule)}` : ""}
                  </div>
                  {n.message && (
                    <div className="notif-message">{n.message}</div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
