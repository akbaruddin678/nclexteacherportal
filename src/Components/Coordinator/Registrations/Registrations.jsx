import { useState, useEffect } from "react";
import "./Registrations.css";
import { MdSchool, MdPeople } from "react-icons/md";
import data from "../../SuperAdmin/Category/categoryData.json"; // Import your category data

const Registration = ({ initialTab = "teacher" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Islamabad", // Hardcoded for Islamabad
    campus: "Islamabad Campus 1", // Default to Islamabad Campus 1
    department: "",
    cnic: "",
    salary: "",
    courses: "",
    subject: "",
    qualification: "",
    experience: "",
    course: "",
    program: "",
    studentId: "",
    dateOfBirth: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    studentCnic: "",
    fees: "",
    status: "Active"
  });

  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    // Filter to get only the "Islamabad" city and set the campus to "Islamabad Campus 1"
    const islamabadCity = data.cities.find((city) => city.name === "Islamabad");
    
    if (islamabadCity) {
      // Setting the campus to only "Islamabad Campus 1" in the formData state
      setCampuses(["Islamabad Campus 1"]);  // Only display "Islamabad Campus 1"
    }
  }, []);

  const generateStudentId = () => `STD${Date.now().toString().slice(-6)}`;

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "Islamabad", // Retaining Islamabad as the default city
      campus: "Islamabad Campus 1", // Retaining "Islamabad Campus 1" as the default campus
      department: "",
      cnic: "",
      salary: "",
      courses: "",
      subject: "",
      qualification: "",
      experience: "",
      course: "",
      program: "",
      studentId: generateStudentId(),
      dateOfBirth: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      studentCnic: "",
      fees: "",
      status: "Active"
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["name", "email", "city", "campus"];

    if (activeTab === "teacher") requiredFields.push("courses", "subject", "qualification", "salary", "cnic", "phone");
    if (activeTab === "student") requiredFields.push("course", "program", "dateOfBirth", "guardianName", "guardianPhone", "studentCnic");

    const missing = requiredFields.filter((f) => !formData[f]);
    if (missing.length) return alert("Please fill: " + missing.join(", "));

    const record = { id: Date.now(), ...formData, createdAt: new Date().toISOString() };
    const key = activeTab + "s";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([...prev, record]));

    alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} registered successfully!`);
    resetForm();
  };

  return (
    <div className="registration">
      <div className="page-header">
        <h1>User Registration</h1>
        <p>Register teachers and students</p>
      </div>

      <div className="registration-tabs">
        <button className={`tab-btn ${activeTab === "teacher" ? "active" : ""}`} onClick={() => handleTabChange("teacher")}><MdSchool /> Teacher</button>
        <button className={`tab-btn ${activeTab === "student" ? "active" : ""}`} onClick={() => handleTabChange("student")}><MdPeople /> Student</button>
      </div>

      <form onSubmit={handleSubmit} className="registration-form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <select value={formData.city} onChange={() => {}} disabled>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>
          <div className="form-group">
            <label>Campus *</label>
            <select value={formData.campus} onChange={(e) => handleInputChange("campus", e.target.value)} required>
              <option value="Islamabad Campus 1">Islamabad Campus 1</option> {/* Only show Islamabad Campus 1 */}
            </select>
          </div>
        </div>

        {activeTab === "teacher" && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>CNIC *</label>
                <input type="text" value={formData.cnic} onChange={(e) => handleInputChange("cnic", e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Subjects *</label>
                <select value={formData.subject} onChange={(e) => handleInputChange("subject", e.target.value)} required>
                  <option value="">Select Subject</option>
                  <option value="Math">Math</option>
                  <option value="English">English</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer">Computer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Qualification *</label>
                <input type="text" value={formData.qualification} onChange={(e) => handleInputChange("qualification", e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" value={formData.experience} onChange={(e) => handleInputChange("experience", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Salary *</label>
                <input type="number" value={formData.salary} onChange={(e) => handleInputChange("salary", e.target.value)} required />
              </div>
            </div>
          </>
        )}

        {activeTab === "student" && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Student ID (Auto)</label>
                <input type="text" value={formData.studentId} disabled />
              </div>
              <div className="form-group">
                <label>Program *</label>
                <select value={formData.program} onChange={(e) => handleInputChange("program", e.target.value)} required>
                  <option value="">Select Program</option>
                  <option value="InterTech">InterTech</option>
                  <option value="MatricTech">MatricTech</option>
                  <option value="MedicalTech">MedicalTech</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Course *</label>
                <input type="text" value={formData.course} onChange={(e) => handleInputChange("course", e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Student CNIC *</label>
                <input type="text" value={formData.studentCnic} onChange={(e) => handleInputChange("studentCnic", e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Guardian Name *</label>
                <input type="text" value={formData.guardianName} onChange={(e) => handleInputChange("guardianName", e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Guardian Phone *</label>
                <input type="text" value={formData.guardianPhone} onChange={(e) => handleInputChange("guardianPhone", e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Course Fees</label>
                <input type="number" value={formData.fees} onChange={(e) => handleInputChange("fees", e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <textarea value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} rows="3" />
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="button" onClick={resetForm} className="reset-btn">Reset</button>
          <button type="submit" className="submit-btn">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
