// UploadLessonsPlans.jsx — Lesson Plan Manager (Updated with dropdowns and filters)

import React, { useState, useEffect } from 'react';
import './UploadLessonsPlans.css';
import lessonPlansData from './lessonPlans.json';

const UploadLessonsPlans = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [formData, setFormData] = useState({
    city: 'Islamabad',
    institute: '',
    program: 'InterTech',
    week: 'Week 1',
    course: '',
    teacher: '',
    title: '',
    objectives: '',
    file: null,
  });

  const teachers = ['Ms. Foster', 'Mr. Thompson', 'Dr. Evans'];
  const courses = ['Computer Science Basics', 'Mathematics 101', 'Science Fundamentals', 'English Literature'];
  const cities = ['Islamabad', 'Lahore', 'Karachi'];
  const institutes = {
    Islamabad: ['NEI Main Campus', 'Islamabad Science Academy'],
    Lahore: ['Lahore Allied Campus', 'Punjab Knowledge Center'],
    Karachi: ['Karachi Tech Campus', 'City Academy'],
  };

  useEffect(() => {
    setLessonPlans(lessonPlansData);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlan = {
      id: `LP${Date.now()}`,
      ...formData,
      uploadDate: new Date().toISOString().slice(0, 10),
      file: formData.file?.name || '',
    };
    setLessonPlans((prev) => [...prev, newPlan]);
    setFormData({
      city: 'Islamabad',
      institute: '',
      program: 'InterTech',
      week: 'Week 1',
      course: '',
      teacher: '',
      title: '',
      objectives: '',
      file: null,
    });
  };

  const groupedByWeek = lessonPlans.reduce((acc, plan) => {
    acc[plan.week] = acc[plan.week] || [];
    acc[plan.week].push(plan);
    return acc;
  }, {});

  return (
    <div className="lesson-plans">
      <h2>Teacher Lesson Plans</h2>

      <form className="lesson-form" onSubmit={handleSubmit}>
        <select name="city" value={formData.city} onChange={handleChange} required>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="institute" value={formData.institute} onChange={handleChange} required>
          <option value="">Select Institute</option>
          {institutes[formData.city]?.map((inst) => <option key={inst}>{inst}</option>)}
        </select>
        <select name="program" value={formData.program} onChange={handleChange} required>
          <option value="InterTech">InterTech</option>
          <option value="Matric Tech">Matric Tech</option>
          <option value="Medical Tech">Medical Tech</option>
        </select>
        <select name="week" value={formData.week} onChange={handleChange} required>
          {[...Array(16)].map((_, i) => (
            <option key={i}>Week {i + 1}</option>
          ))}
        </select>
        <select name="course" value={formData.course} onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select name="teacher" value={formData.teacher} onChange={handleChange} required>
          <option value="">Select Teacher</option>
          {teachers.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input type="text" name="title" placeholder="Lesson Title" value={formData.title} onChange={handleChange} required />
        <textarea name="objectives" placeholder="Lesson Objectives" value={formData.objectives} onChange={handleChange} required />
        <input type="file" name="file" onChange={handleChange} accept=".pdf,.doc,.docx" />
        <button type="submit">Upload</button>
      </form>

      <div className="lesson-plan-list">
        {Object.keys(groupedByWeek).sort().map((week) => (
          <div key={week} className="week-section">
            <h3>{week}</h3>
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Institute</th>
                  <th>Program</th>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Title</th>
                  <th>Objectives</th>
                  <th>File</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {groupedByWeek[week].map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.city}</td>
                    <td>{plan.institute}</td>
                    <td>{plan.program}</td>
                    <td>{plan.course}</td>
                    <td>{plan.teacher}</td>
                    <td>{plan.title}</td>
                    <td>{plan.objectives}</td>
                    <td>{plan.file}</td>
                    <td>{plan.uploadDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadLessonsPlans;
