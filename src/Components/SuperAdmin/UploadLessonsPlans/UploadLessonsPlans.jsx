"use client"

import { useState, useEffect } from "react"
import "./UploadLessonsPlans.css"

const UploadLessonPlans = () => {
  const [lessonPlans, setLessonPlans] = useState([])

  useEffect(() => {
    loadLessonPlans()
  }, [])

  const loadLessonPlans = () => {
    const savedPlans = localStorage.getItem("lessonPlans")
    if (savedPlans) {
      setLessonPlans(JSON.parse(savedPlans))
    } else {
      // Initialize with default weeks
      const defaultPlans = [
        { id: 1, week: 1, title: "", description: "", file: null },
        { id: 2, week: 2, title: "", description: "", file: null },
        { id: 3, week: 3, title: "", description: "", file: null },
      ]
      setLessonPlans(defaultPlans)
      localStorage.setItem("lessonPlans", JSON.stringify(defaultPlans))
    }
  }

  const saveLessonPlans = (updatedPlans) => {
    localStorage.setItem("lessonPlans", JSON.stringify(updatedPlans))
    setLessonPlans(updatedPlans)
  }

  const handleInputChange = (id, field, value) => {
    const updatedPlans = lessonPlans.map((plan) => (plan.id === id ? { ...plan, [field]: value } : plan))
    saveLessonPlans(updatedPlans)
  }

  const handleFileUpload = (id, file) => {
    const updatedPlans = lessonPlans.map((plan) => (plan.id === id ? { ...plan, file: file.name } : plan))
    saveLessonPlans(updatedPlans)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, id) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(id, files[0])
    }
  }

  const addWeek = () => {
    const newWeek = {
      id: Date.now(),
      week: lessonPlans.length + 1,
      title: "",
      description: "",
      file: null,
    }
    const updatedPlans = [...lessonPlans, newWeek]
    saveLessonPlans(updatedPlans)
  }

  return (
    <div className="upload-lesson-plans">
      <div className="page-header">
        <h1>Upload Lesson Plans</h1>
        <button className="add-week-btn" onClick={addWeek}>
          Add Week
        </button>
      </div>

      <div className="lesson-plans-container">
        {lessonPlans.map((plan) => (
          <div key={plan.id} className="week-section">
            <h2>Week {plan.week}</h2>

            <div className="form-group">
              <label>Lesson Plan Title</label>
              <input
                type="text"
                placeholder="Enter lesson plan title"
                value={plan.title}
                onChange={(e) => handleInputChange(plan.id, "title", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter lesson description"
                value={plan.description}
                onChange={(e) => handleInputChange(plan.id, "description", e.target.value)}
                rows="4"
              />
            </div>

            <div className="upload-section">
              <div className="upload-area" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, plan.id)}>
                <div className="upload-content">
                  <div className="upload-icon">📁</div>
                  <p>Drag and drop files here, or</p>
                  <input
                    type="file"
                    id={`file-${plan.id}`}
                    onChange={(e) => e.target.files[0] && handleFileUpload(plan.id, e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <label htmlFor={`file-${plan.id}`} className="browse-btn">
                    Browse Files
                  </label>
                  {plan.file && (
                    <div className="uploaded-file">
                      <span>📄 {plan.file}</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="upload-btn">Upload</button>
            </div>
          </div>
        ))}
      </div>

      <div className="save-section">
        <button className="save-all-btn">Save All Lesson Plans</button>
      </div>
    </div>
  )
}

export default UploadLessonPlans
