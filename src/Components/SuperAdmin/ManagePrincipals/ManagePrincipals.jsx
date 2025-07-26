"use client"

import { useState, useEffect } from "react"
import "./ManagePrincipals.css"

const ManagePrincipals = () => {
  const [principals, setPrincipals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPrincipal, setEditingPrincipal] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    status: "Active",
  })

  useEffect(() => {
    loadPrincipals()
  }, [])

  const loadPrincipals = () => {
    const savedPrincipals = localStorage.getItem("principals")
    if (savedPrincipals) {
      setPrincipals(JSON.parse(savedPrincipals))
    } else {
      // Initialize with sample data
      const samplePrincipals = [
        {
          id: 1,
          name: "Dr. Michael Johnson",
          email: "michael.johnson@intertech.edu",
          phone: "+1 (555) 123-4567",
          department: "Computer Science",
          status: "Active",
        },
        {
          id: 2,
          name: "Prof. Sarah Williams",
          email: "sarah.williams@intertech.edu",
          phone: "+1 (555) 234-5678",
          department: "Information Technology",
          status: "Active",
        },
        {
          id: 3,
          name: "Dr. Robert Brown",
          email: "robert.brown@intertech.edu",
          phone: "+1 (555) 345-6789",
          department: "Data Science",
          status: "Inactive",
        },
        {
          id: 4,
          name: "Ms. Jennifer Davis",
          email: "jennifer.davis@intertech.edu",
          phone: "+1 (555) 456-7890",
          department: "Cybersecurity",
          status: "Active",
        },
      ]
      setPrincipals(samplePrincipals)
      localStorage.setItem("principals", JSON.stringify(samplePrincipals))
    }
  }

  const savePrincipals = (updatedPrincipals) => {
    localStorage.setItem("principals", JSON.stringify(updatedPrincipals))
    setPrincipals(updatedPrincipals)
  }

  const handleAddPrincipal = () => {
    setFormData({ name: "", email: "", phone: "", department: "", status: "Active" })
    setEditingPrincipal(null)
    setShowAddModal(true)
  }

  const handleEditPrincipal = (principal) => {
    setFormData(principal)
    setEditingPrincipal(principal)
    setShowAddModal(true)
  }

  const handleDeletePrincipal = (id) => {
    if (window.confirm("Are you sure you want to delete this principal?")) {
      const updatedPrincipals = principals.filter((principal) => principal.id !== id)
      savePrincipals(updatedPrincipals)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPrincipal) {
      const updatedPrincipals = principals.map((principal) =>
        principal.id === editingPrincipal.id ? { ...formData, id: editingPrincipal.id } : principal,
      )
      savePrincipals(updatedPrincipals)
    } else {
      const newPrincipal = {
        ...formData,
        id: Date.now(),
      }
      const updatedPrincipals = [...principals, newPrincipal]
      savePrincipals(updatedPrincipals)
    }
    setShowAddModal(false)
  }

  const filteredPrincipals = principals.filter(
    (principal) =>
      principal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      principal.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      principal.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="manage-principals">
      <div className="page-header">
        <h1>Manage Principals</h1>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search principals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="principals-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrincipals.map((principal) => (
              <tr key={principal.id}>
                <td>{principal.name}</td>
                <td>{principal.email}</td>
                <td>{principal.phone}</td>
                <td>{principal.department}</td>
                <td>
                  <span className={`status ${principal.status.toLowerCase()}`}>{principal.status}</span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditPrincipal(principal)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeletePrincipal(principal.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingPrincipal ? "Edit Principal" : "Add New Principal"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit">{editingPrincipal ? "Update" : "Add"} Principal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagePrincipals
