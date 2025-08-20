import { useState, useEffect } from "react";
import {
  MdSchool,
  MdPeople,
  MdPerson,
  MdUpload,
  MdDownload,
  MdAttachFile,
  MdAdd,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
  MdEdit,
  MdSearch,
} from "react-icons/md";
import * as XLSX from "xlsx";
import {
  createCampus,
  createCoordinator,
  createTeacher,
  createStudent,
  createCourse,
  getStudentsByCity,
  getTeachers,
  getCampuses,
  getUnassignedCourses,
  getStudents,
  getCourses,
  getCoordinators,
  updateCampus,
  updateCoordinator,
  updateTeacher,
  updateStudent,
  updateCourse,
  deleteCampus,
  deleteCoordinator,
  deleteTeacher,
  deleteStudent,
  deleteCourse,
} from "../../../services/api";
import "./Registrations.css";

const Registrations = () => {
  const [activeTab, setActiveTab] = useState("campus");
  const [viewMode, setViewMode] = useState("add"); // 'add' or 'view'
  const [formData, setFormData] = useState({
    // Campus fields
    name: "",
    location: "",
    address: "",
    contactNumber: "",

    // Principal fields (treated as coordinator in backend)
    name: "",
    email: "",
    phone: "",
    password: "",

    // Teacher fields
    name: "",
    email: "",
    phone: "",
    cnic: "",
    password: "",
    subjectSpecialization: "",
    qualifications: "",
    campusId: "",

    // Student fields
    name: "",
    email: "",
    phone: "",
    cnic: "",
    pncNo: "",
    passport: "",
    status: "Active",
    studentExcelFile: null,
    documentstatus: "notverified",

    // Course fields
    name: "",
    code: "",
    description: "",
    creditHours: "",
    startDate: "",
    endDate: "",
    courseContent: [],
    currentContent: {
      title: "",
      duration: "",
      description: "",
      remarks: "",
    },
    courseFile: null,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch data based on active tab and view mode
  useEffect(() => {
    const fetchData = async () => {
      if (viewMode === "view") {
        try {
          setLoading(true);
          let response;
          switch (activeTab) {
            case "campus":
              response = await getCampuses();
              break;
            case "principal":
              response = await getCoordinators();
              break;
            case "teacher":
              response = await getTeachers();
              break;
            case "student":
              response = await getStudents();
              break;
            case "course":
              response = await getCourses();
              break;
            default:
              response = { data: [] };
          }
          setDataList(response.data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setErrorMessage("Failed to fetch data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [viewMode, activeTab]);

  // Fetch campuses when teacher tab is active in add mode
  useEffect(() => {
    if (activeTab === "teacher" && viewMode === "add") {
      const fetchCampuses = async () => {
        try {
          const response = await getCampuses();
          setCampuses(response.data);
        } catch (error) {
          console.error("Failed to fetch campuses:", error);
          setErrorMessage("Failed to fetch campuses. Please try again.");
        }
      };
      fetchCampuses();
    }
  }, [activeTab, viewMode]);

  useEffect(() => {
    // Clear messages after 5 seconds
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentContent: {
        ...prev.currentContent,
        [field]: value,
      },
    }));
  };

  const addContentItem = () => {
    if (!formData.currentContent.title) {
      setErrorMessage("Content title is required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      courseContent: [...prev.courseContent, prev.currentContent],
      currentContent: {
        title: "",
        duration: "",
        description: "",
        remarks: "",
      },
    }));
  };

  const removeContentItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      courseContent: prev.courseContent.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (field, e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      address: "",
      contactNumber: "",
      email: "",
      phone: "",
      cnic: "",
      password: "",
      subjectSpecialization: "",
      qualifications: "",
      campusId: "",
      pncNo: "",
      passport: "",
      status: "Active",
      studentExcelFile: null,
      documentstatus: "notverified",
      code: "",
      description: "",
      creditHours: "",
      startDate: "",
      endDate: "",
      courseContent: [],
      currentContent: {
        title: "",
        duration: "",
        description: "",
        remarks: "",
      },
      courseFile: null,
    });
    setErrorMessage("");
    setSuccessMessage("");
    setShowPassword(false);
    setEditingId(null);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const validateCNIC = (cnic) => {
    const re = /^[0-9]{13}$/;
    return re.test(cnic);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleImport = async () => {
    if (!formData.studentExcelFile) {
      setErrorMessage("Please select an Excel file first");
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Validate imported data
        const validationErrors = [];
        const validStudents = jsonData.map((student, index) => {
          if (!student.name) {
            validationErrors.push(`Row ${index + 2}: Name is required`);
          }
          if (!student.cnic) {
            validationErrors.push(`Row ${index + 2}: CNIC is required`);
          } else if (!validateCNIC(student.cnic)) {
            validationErrors.push(`Row ${index + 2}: CNIC must be 13 digits`);
          }
          if (student.email && !validateEmail(student.email)) {
            validationErrors.push(`Row ${index + 2}: Invalid email format`);
          }
          if (student.phone && !validatePhone(student.phone)) {
            validationErrors.push(`Row ${index + 2}: Invalid phone format`);
          }
          return {
            ...student,
            documentstatus: "notverified",
            status: "Active",
          };
        });

        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join("\n"));
        }

        const response = await Promise.all(
          validStudents.map((student) => createStudent(student))
        );

        setSuccessMessage(`${response.length} students imported successfully!`);
        setFormData((prev) => ({ ...prev, studentExcelFile: null }));
        setLoading(false);
      };
      reader.readAsArrayBuffer(formData.studentExcelFile);
    } catch (error) {
      console.error("Import error:", error);
      setErrorMessage(error.message || "Failed to import students");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let requiredFields = [];
      let validationErrors = [];
      let apiCall;
      let dataToSend = {};

      switch (activeTab) {
        case "campus":
          requiredFields = ["name", "location", "contactNumber"];
          if (!formData.name) validationErrors.push("Campus name is required");
          if (!formData.location) validationErrors.push("Location is required");
          if (!formData.contactNumber) {
            validationErrors.push("Contact number is required");
          } else if (!validatePhone(formData.contactNumber)) {
            validationErrors.push("Invalid contact number format");
          }

          dataToSend = {
            name: formData.name,
            location: formData.location,
            address: formData.address,
            contactNumber: formData.contactNumber,
          };
          apiCall = editingId
            ? (data) => updateCampus(editingId, data)
            : createCampus;
          break;

        case "principal":
          requiredFields = ["name", "email", "password"];
          if (!formData.name) validationErrors.push("Name is required");
          if (!formData.email) {
            validationErrors.push("Email is required");
          } else if (!validateEmail(formData.email)) {
            validationErrors.push("Invalid email format");
          }
          if (!formData.password && !editingId) {
            validationErrors.push("Password is required");
          } else if (
            formData.password &&
            !validatePassword(formData.password)
          ) {
            validationErrors.push("Password must be at least 6 characters");
          }
          if (formData.phone && !validatePhone(formData.phone)) {
            validationErrors.push("Invalid phone number format");
          }

          dataToSend = {
            name: formData.name,
            email: formData.email,
            contactNumber: formData.phone,
          };
          // Only include password if it's being updated or creating new
          if (formData.password) {
            dataToSend.password = formData.password;
          }
          apiCall = editingId
            ? (data) => updateCoordinator(editingId, data)
            : createCoordinator;
          break;

        case "teacher":
          requiredFields = [
            "name",
            "email",
            "subjectSpecialization",
            "qualifications",
            "campusId",
          ];
          if (!formData.name) validationErrors.push("Name is required");
          if (!formData.email) {
            validationErrors.push("Email is required");
          } else if (!validateEmail(formData.email)) {
            validationErrors.push("Invalid email format");
          }
          if (!formData.password && !editingId) {
            validationErrors.push("Password is required");
          } else if (
            formData.password &&
            !validatePassword(formData.password)
          ) {
            validationErrors.push("Password must be at least 6 characters");
          }
          if (!formData.subjectSpecialization) {
            validationErrors.push("Subject specialization is required");
          }
          if (!formData.qualifications) {
            validationErrors.push("Qualifications are required");
          }
          if (!formData.campusId) {
            validationErrors.push("Campus selection is required");
          }
          if (formData.phone && !validatePhone(formData.phone)) {
            validationErrors.push("Invalid phone number format");
          }
          if (formData.cnic && !validateCNIC(formData.cnic)) {
            validationErrors.push("CNIC must be 13 digits");
          }

          dataToSend = {
            name: formData.name,
            email: formData.email,
            contactNumber: formData.phone,
            cnic: formData.cnic,
            subjectSpecialization: formData.subjectSpecialization,
            qualifications: formData.qualifications,
            campusId: formData.campusId,
          };
          // Only include password if it's being updated or creating new
          if (formData.password) {
            dataToSend.password = formData.password;
          }
          apiCall = editingId
            ? (data) => updateTeacher(editingId, data)
            : createTeacher;
          break;

        case "student":
          requiredFields = ["name", "cnic"];
          if (!formData.name) validationErrors.push("Name is required");
          if (!formData.cnic) {
            validationErrors.push("CNIC is required");
          } else if (!validateCNIC(formData.cnic)) {
            validationErrors.push("CNIC must be 13 digits");
          }
          if (formData.email && !validateEmail(formData.email)) {
            validationErrors.push("Invalid email format");
          }
          if (formData.phone && !validatePhone(formData.phone)) {
            validationErrors.push("Invalid phone number format");
          }

          dataToSend = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            cnic: formData.cnic,
            pncNo: formData.pncNo,
            passport: formData.passport,
            status: formData.status,
            documentstatus: formData.documentstatus,
          };
          apiCall = editingId
            ? (data) => updateStudent(editingId, data)
            : createStudent;
          break;

        case "course":
          requiredFields = ["name", "code", "creditHours"];
          if (!formData.name) validationErrors.push("Course name is required");
          if (!formData.code) validationErrors.push("Course code is required");
          if (!formData.creditHours) {
            validationErrors.push("Credit hours are required");
          } else if (isNaN(formData.creditHours)) {
            validationErrors.push("Credit hours must be a number");
          }
          if (
            formData.startDate &&
            formData.endDate &&
            formData.startDate > formData.endDate
          ) {
            validationErrors.push("End date must be after start date");
          }

          dataToSend = {
            name: formData.name,
            code: formData.code,
            description: formData.description,
            creditHours: formData.creditHours,
            startDate: formData.startDate,
            endDate: formData.endDate,
            courseContent: formData.courseContent,
          };
          apiCall = editingId
            ? (data) => updateCourse(editingId, data)
            : createCourse;
          break;
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      const response = await apiCall(dataToSend);
      setSuccessMessage(
        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ${
          editingId ? "updated" : "registered"
        } successfully!`
      );
      resetForm();
      setViewMode("view"); // Switch to view mode after successful submission
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setViewMode("add");

    // Map the item data to formData based on the active tab
    switch (activeTab) {
      case "campus":
        setFormData({
          name: item.name,
          location: item.location,
          address: item.address,
          contactNumber: item.contactNumber,
        });
        break;
      case "principal":
        setFormData({
          name: item.name,
          email: item.user?.email || "",
          phone: item.contactNumber,
          password: "",
          cnic: item.cnic,
        });
        break;
      case "teacher":
        setFormData({
          name: item.name,
          email: item.user?.email || "",
          phone: item.contactNumber,
          cnic: item.cnic,
          password: "",
          subjectSpecialization: item.subjectSpecialization,
          qualifications: item.qualifications,
          campusId: item.campus?._id || "",
        });
        break;
      case "student":
        setFormData({
          name: item.name,
          email: item.email,
          phone: item.phone,
          cnic: item.cnic,
          pncNo: item.pncNo,
          passport: item.passport,
          status: item.status,
          documentstatus: item.documentstatus,
        });
        break;
      case "course":
        setFormData({
          name: item.name,
          code: item.code,
          description: item.description,
          creditHours: item.creditHours,
          startDate: item.startDate,
          endDate: item.endDate,
          courseContent: item.courseContent || [],
          currentContent: {
            title: "",
            duration: "",
            description: "",
            remarks: "",
          },
        });
        break;
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setLoading(true);
      let response;
      switch (activeTab) {
        case "campus":
          response = await deleteCampus(id);
          break;
        case "principal":
          response = await deleteCoordinator(id);
          break;
        case "teacher":
          response = await deleteTeacher(id);
          break;
        case "student":
          response = await deleteStudent(id);
          break;
        case "course":
          response = await deleteCourse(id);
          break;
        default:
          break;
      }

      setSuccessMessage(
        `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } deleted successfully!`
      );
      // Refresh the data list
      const fetchData = async () => {
        let response;
        switch (activeTab) {
          case "campus":
            response = await getCampuses();
            break;
          case "principal":
            response = await getCoordinators();
            break;
          case "teacher":
            response = await getTeachers();
            break;
          case "student":
            response = await getStudents();
            break;
          case "course":
            response = await getCourses();
            break;
          default:
            response = { data: [] };
        }
        setDataList(response.data);
      };
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage("Failed to delete. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = dataList.filter((item) => {
    const searchFields = {
      campus: ["name", "location", "contactNumber"],
      principal: ["name", "user.email", "contactNumber"],
      teacher: ["name", "user.email", "subjectSpecialization"],
      student: ["name", "email", "cnic"],
      course: ["name", "code"],
    };

    const fields = searchFields[activeTab] || [];
    return fields.some((field) => {
      // Handle nested fields (like user.email)
      const value = field.split(".").reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="form-container">
      {activeTab === "campus" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Campus Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                required
                pattern="[0-9]{10,15}"
                title="10-15 digit phone number"
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "principal" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                {editingId ? "New Password" : "Password *"}
                {!editingId && (
                  <small className="hint">Minimum 6 characters</small>
                )}
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required={!editingId}
                  minLength="6"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                pattern="[0-9]{10,15}"
                title="10-15 digit phone number"
                required
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "teacher" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                {editingId ? "New Password" : "Password *"}
                {!editingId && (
                  <small className="hint">Minimum 6 characters</small>
                )}
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required={!editingId}
                  minLength="6"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Campus *</label>
              <select
                value={formData.campusId}
                onChange={(e) => handleInputChange("campusId", e.target.value)}
                required
              >
                <option value="">Select Campus</option>
                {campuses.map((campus) => (
                  <option key={campus._id} value={campus._id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Subject Specialization *</label>
              <input
                type="text"
                value={formData.subjectSpecialization}
                onChange={(e) =>
                  handleInputChange("subjectSpecialization", e.target.value)
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Qualifications *</label>
              <input
                type="text"
                value={formData.qualifications}
                onChange={(e) =>
                  handleInputChange("qualifications", e.target.value)
                }
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                pattern="[0-9]{10,15}"
                title="10-15 digit phone number"
              />
            </div>
            <div className="form-group">
              <label>CNIC</label>
              <input
                type="text"
                value={formData.cnic}
                onChange={(e) => handleInputChange("cnic", e.target.value)}
                pattern="[0-9]{13}"
                title="13 digit CNIC number"
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "student" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>CNIC *</label>
              <input
                type="text"
                value={formData.cnic}
                onChange={(e) => handleInputChange("cnic", e.target.value)}
                required
                pattern="[0-9]{13}"
                title="13 digit CNIC number"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                pattern="[0-9]{10,15}"
                title="10-15 digit phone number"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>PNC No</label>
              <input
                type="text"
                value={formData.pncNo}
                onChange={(e) => handleInputChange("pncNo", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Passport</label>
              <input
                type="text"
                value={formData.passport}
                onChange={(e) => handleInputChange("passport", e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label>Document Status</label>
              <select
                value={formData.documentstatus}
                onChange={(e) =>
                  handleInputChange("documentstatus", e.target.value)
                }
              >
                <option value="notverified">Not Verified</option>
                <option value="verified">Verified</option>
              </select>
            </div>
          </div>
          {!editingId && (
            <div className="form-row">
              <div className="form-group">
                <label>Bulk Import Students (Excel)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="student-excel"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileChange("studentExcelFile", e)}
                  />
                  <label htmlFor="student-excel" className="file-upload-btn">
                    <MdAttachFile />{" "}
                    {formData.studentExcelFile
                      ? formData.studentExcelFile.name
                      : "Choose Excel File"}
                  </label>
                  {formData.studentExcelFile && (
                    <button
                      type="button"
                      onClick={handleImport}
                      className="import-btn"
                      disabled={loading}
                    >
                      {loading ? "Importing..." : "Import Students"}
                    </button>
                  )}
                </div>
                <small className="hint">
                  Excel should contain columns: name, email, phone, cnic, pncNo,
                  passport
                </small>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "course" && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Course Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Course Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Credit Hours *</label>
              <input
                type="number"
                value={formData.creditHours}
                onChange={(e) =>
                  handleInputChange("creditHours", e.target.value)
                }
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows="3"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate}
              />
            </div>
          </div>
          <div className="content-section">
            <h3>Course Content Outline</h3>
            <div className="content-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.currentContent.title}
                    onChange={(e) =>
                      handleContentChange("title", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={formData.currentContent.duration}
                    onChange={(e) =>
                      handleContentChange("duration", e.target.value)
                    }
                    placeholder="e.g., Week 1, Month 2"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.currentContent.description}
                    onChange={(e) =>
                      handleContentChange("description", e.target.value)
                    }
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    value={formData.currentContent.remarks}
                    onChange={(e) =>
                      handleContentChange("remarks", e.target.value)
                    }
                    rows="2"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addContentItem}
                className="add-content-btn"
              >
                <MdAdd /> Add Content Item
              </button>
            </div>
            {formData.courseContent.length > 0 && (
              <div className="content-list">
                <h4>Current Content Items</h4>
                <ul>
                  {formData.courseContent.map((item, index) => (
                    <li key={index}>
                      <div className="content-item">
                        <strong>{item.title}</strong>
                        {item.duration && <span> ({item.duration})</span>}
                        {item.description && <p>{item.description}</p>}
                        {item.remarks && (
                          <p className="remarks">Note: {item.remarks}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => removeContentItem(index)}
                          className="remove-btn"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => {
            setViewMode("view");
            resetForm();
          }}
        >
          Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading
            ? "Processing..."
            : `${editingId ? "Update" : "Save"} ${
                activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
              }`}
        </button>
      </div>
    </form>
  );

  const renderDataTable = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (filteredData.length === 0) {
      return <div className="no-data">No data found</div>;
    }

    const getColumns = () => {
      switch (activeTab) {
        case "campus":
          return [
            { header: "Name", accessor: "name" },
            { header: "Location", accessor: "location" },
            { header: "Contact", accessor: "contactNumber" },
            { header: "Actions", accessor: "actions" },
          ];
        case "principal":
          return [
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "user.email" },
            { header: "Phone", accessor: "contactNumber" },
            { header: "Actions", accessor: "actions" },
          ];
        case "teacher":
          return [
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "user.email" },
            { header: "Specialization", accessor: "subjectSpecialization" },
            { header: "Campus", accessor: "campus.name" },
            { header: "Actions", accessor: "actions" },
          ];
        case "student":
          return [
            { header: "Name", accessor: "name" },
            { header: "CNIC", accessor: "cnic" },
            { header: "Email", accessor: "email" },
            { header: "Status", accessor: "status" },
            { header: "Doc Status", accessor: "documentstatus" },
            { header: "Actions", accessor: "actions" },
          ];
        case "course":
          return [
            { header: "Name", accessor: "name" },
            { header: "Code", accessor: "code" },
            { header: "Credit Hours", accessor: "creditHours" },
            {
              header: "Duration",
              accessor: (item) =>
                `${
                  item.startDate
                    ? new Date(item.startDate).toLocaleDateString()
                    : ""
                } -
                 ${
                   item.endDate
                     ? new Date(item.endDate).toLocaleDateString()
                     : ""
                 }`,
            },
            { header: "Actions", accessor: "actions" },
          ];
        default:
          return [];
      }
    };

    const getNestedValue = (obj, path) => {
      return path
        .split(".")
        .reduce((o, key) => (o && o[key] !== undefined ? o[key] : ""), obj);
    };

    return (
      <div className="data-table-container">
        <div className="search-bar">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="data-table">
          <thead>
            <tr>
              {getColumns().map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                {getColumns().map((column, colIndex) => {
                  if (column.accessor === "actions") {
                    return (
                      <td key={colIndex} className="actions-cell">
                        <button
                          onClick={() => handleEdit(item)}
                          className="edit-btn"
                          title="Edit"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="delete-btn"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    );
                  }

                  const value =
                    typeof column.accessor === "function"
                      ? column.accessor(item)
                      : getNestedValue(item, column.accessor);

                  return <td key={colIndex}>{value || "-"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="registrations-container">
      <div className="header">
        <h2>Registrations</h2>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "add" ? "active" : ""}`}
            onClick={() => {
              setViewMode("add");
              resetForm();
            }}
          >
            <MdAdd /> Add New
          </button>
          <button
            className={`view-btn ${viewMode === "view" ? "active" : ""}`}
            onClick={() => setViewMode("view")}
          >
            <MdPeople /> View All
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "campus" ? "active" : ""}`}
          onClick={() => handleTabChange("campus")}
        >
          <MdSchool /> Campuses
        </button>
        <button
          className={`tab-btn ${activeTab === "principal" ? "active" : ""}`}
          onClick={() => handleTabChange("principal")}
        >
          <MdPerson /> Principals
        </button>
        <button
          className={`tab-btn ${activeTab === "teacher" ? "active" : ""}`}
          onClick={() => handleTabChange("teacher")}
        >
          <MdPerson /> Teachers
        </button>
        <button
          className={`tab-btn ${activeTab === "student" ? "active" : ""}`}
          onClick={() => handleTabChange("student")}
        >
          <MdPeople /> Students
        </button>
        <button
          className={`tab-btn ${activeTab === "course" ? "active" : ""}`}
          onClick={() => handleTabChange("course")}
        >
          <MdSchool /> Courses
        </button>
      </div>

      {successMessage && <div className="alert success">{successMessage}</div>}
      {errorMessage && <div className="alert error">{errorMessage}</div>}

      <div className="content-area">
        {viewMode === "add" ? renderForm() : renderDataTable()}
      </div>
    </div>
  );
};

export default Registrations;
