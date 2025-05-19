"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import api from "../../../services/api"

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const PageTitle = styled.h1`
  color: var(--primary);
`

const AddButton = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
  }
`

const CategoriesTable = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`

const TableHead = styled.thead`
  background-color: var(--neutral-light);
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--primary);
  }
`

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: var(--neutral-light);
    }
  }
  
  td {
    padding: 1rem;
  }
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ active }) => (active ? "rgba(56, 161, 105, 0.2)" : "rgba(229, 62, 62, 0.2)")};
  color: ${({ active }) => (active ? "var(--success)" : "var(--danger)")};
`

const ActionButton = styled.button`
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background-color: ${({ variant }) => {
    switch (variant) {
      case "primary":
        return "var(--primary)"
      case "danger":
        return "var(--accent)"
      case "success":
        return "var(--success)"
      default:
        return "var(--primary)"
    }
  }};
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ variant }) => {
      switch (variant) {
        case "primary":
          return "var(--primary-light)"
        case "danger":
          return "var(--accent-light)"
        case "success":
          return "var(--secondary-light)"
        default:
          return "var(--primary-light)"
      }
    }};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`

const ModalTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--primary);
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input {
    width: auto;
  }
`

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`

const CancelButton = styled.button`
  background-color: var(--gray-light);
  color: var(--neutral-dark);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--gray);
  }
`

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ConfirmButton = styled.button`
  background-color: var(--accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--accent-light);
  }
`

const ManageCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") // add, edit, delete
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    isActive: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/categories")
      setCategories(response.data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setModalMode("add")
    setFormData({
      name: "",
      description: "",
      department: "",
      isActive: true,
    })
    setShowModal(true)
  }

  const handleEditClick = (category) => {
    setModalMode("edit")
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      department: category.department || "",
      isActive: category.isActive,
    })
    setShowModal(true)
  }

  const handleDeleteClick = (category) => {
    setModalMode("delete")
    setSelectedCategory(category)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (modalMode === "add") {
        await api.post("/api/categories", formData)
      } else if (modalMode === "edit") {
        await api.put(`/api/categories/${selectedCategory._id}`, formData)
      }

      // Refresh categories
      fetchCategories()

      // Close modal
      setShowModal(false)
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Failed to save category. Please try again.")
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/categories/${selectedCategory._id}`)

      // Refresh categories
      fetchCategories()

      // Close modal
      setShowModal(false)
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category. Please try again.")
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manage Categories</PageTitle>
        <AddButton onClick={handleAddClick}>Add Category</AddButton>
      </PageHeader>

      <CategoriesTable>
        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : categories.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.department || "-"}</td>
                  <td>{category.description || "-"}</td>
                  <td>
                    <StatusBadge active={category.isActive}>{category.isActive ? "Active" : "Inactive"}</StatusBadge>
                  </td>
                  <td>
                    <ActionButton variant="primary" onClick={() => handleEditClick(category)}>
                      Edit
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDeleteClick(category)}>
                      Delete
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState>No categories found</EmptyState>
        )}
      </CategoriesTable>

      {showModal && (
        <Modal>
          <ModalContent>
            {modalMode === "delete" ? (
              <>
                <ModalTitle>Delete Category</ModalTitle>
                <p>
                  Are you sure you want to delete the category "{selectedCategory.name}"? This action cannot be undone.
                </p>
                <ModalButtons>
                  <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
                  <ConfirmButton onClick={handleDelete}>Delete</ConfirmButton>
                </ModalButtons>
              </>
            ) : (
              <>
                <ModalTitle>{modalMode === "add" ? "Add Category" : "Edit Category"}</ModalTitle>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="name">Name*</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter category name"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="department">Department</Label>
                    <Select id="department" name="department" value={formData.department} onChange={handleInputChange}>
                      <option value="">Select Department</option>
                      <option value="health">Ministry of Health</option>
                      <option value="education">Ministry of Education</option>
                      <option value="transport">Ministry of Transport</option>
                      <option value="housing">Ministry of Housing</option>
                      <option value="water">Water & Sanitation</option>
                      <option value="electricity">Electricity</option>
                      <option value="roads">Roads & Infrastructure</option>
                      <option value="environment">Environment & Waste Management</option>
                      <option value="security">Security & Police</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter category description"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Checkbox>
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <Label htmlFor="isActive" style={{ marginBottom: 0 }}>
                        Active
                      </Label>
                    </Checkbox>
                  </FormGroup>

                  <ModalButtons>
                    <CancelButton type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </CancelButton>
                    <SubmitButton type="submit">{modalMode === "add" ? "Add Category" : "Save Changes"}</SubmitButton>
                  </ModalButtons>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  )
}

export default ManageCategories
