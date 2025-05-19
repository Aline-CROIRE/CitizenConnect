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

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const UsersTable = styled.div`
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

const RoleBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ role }) => {
    switch (role) {
      case "citizen":
        return "rgba(66, 153, 225, 0.2)"
      case "institution":
        return "rgba(56, 161, 105, 0.2)"
      case "admin":
        return "rgba(236, 201, 75, 0.2)"
      default:
        return "rgba(113, 128, 150, 0.2)"
    }
  }};
  color: ${({ role }) => {
    switch (role) {
      case "citizen":
        return "var(--info)"
      case "institution":
        return "var(--success)"
      case "admin":
        return "var(--warning)"
      default:
        return "var(--gray)"
    }
  }};
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ status }) => {
    switch (status) {
      case "approved":
        return "rgba(56, 161, 105, 0.2)"
      case "pending":
        return "rgba(236, 201, 75, 0.2)"
      case "rejected":
        return "rgba(229, 62, 62, 0.2)"
      default:
        return "rgba(113, 128, 150, 0.2)"
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case "approved":
        return "var(--success)"
      case "pending":
        return "var(--warning)"
      case "rejected":
        return "var(--danger)"
      default:
        return "var(--gray)"
    }
  }};
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ active }) => (active ? "var(--primary)" : "var(--gray-light)")};
  background-color: ${({ active }) => (active ? "var(--primary)" : "white")};
  color: ${({ active }) => (active ? "white" : "var(--neutral-dark)")};
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ active }) => (active ? "var(--primary-light)" : "var(--neutral-light)")};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const ConfirmButton = styled.button`
  background-color: ${({ variant }) => (variant === "danger" ? "var(--accent)" : "var(--success)")};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ variant }) => (variant === "danger" ? "var(--accent-light)" : "var(--secondary-light)")};
  }
`

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    role: "",
    approvalStatus: "",
    search: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [filters, pagination.page, pagination.limit])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      }

      const response = await api.get("/api/users", { params })

      setUsers(response.data.data)
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.totalPages,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilters({
      ...filters,
      [name]: value,
    })

    // Reset to first page when filters change
    setPagination({
      ...pagination,
      page: 1,
    })
  }

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page,
    })
  }

  const handleApproveClick = (user) => {
    setSelectedUser(user)
    setModalAction("approve")
    setShowModal(true)
  }

  const handleRejectClick = (user) => {
    setSelectedUser(user)
    setModalAction("reject")
    setShowModal(true)
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setModalAction("delete")
    setShowModal(true)
  }

  const handleConfirmAction = async () => {
    try {
      if (modalAction === "approve") {
        // Send approval notification to the user
        await api.put(`/api/users/${selectedUser._id}/approval`, {
          approvalStatus: "approved",
          notifyUser: true,
          message: "Your account has been approved. You can now log in to the system."
        })
      } else if (modalAction === "reject") {
        // Get the rejection reason from the modal
        const rejectionReason = document.getElementById("rejectionReason")?.value || "Rejected by administrator"
        
        await api.put(`/api/users/${selectedUser._id}/approval`, {
          approvalStatus: "rejected",
          rejectionReason: rejectionReason,
          notifyUser: true,
          message: `Your account registration has been rejected. Reason: ${rejectionReason}`
        })
      } else if (modalAction === "delete") {
        await api.delete(`/api/users/${selectedUser._id}`)
      }

      // Refresh users
      fetchUsers()

      // Close modal
      setShowModal(false)
    } catch (error) {
      console.error("Error performing action:", error)
      alert("Failed to perform action. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manage Users</PageTitle>
      </PageHeader>

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel htmlFor="role">Role</FilterLabel>
          <FilterSelect id="role" name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="institution">Institution</option>
            <option value="admin">Admin</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="approvalStatus">Status</FilterLabel>
          <FilterSelect
            id="approvalStatus"
            name="approvalStatus"
            value={filters.approvalStatus}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="search">Search</FilterLabel>
          <FilterInput
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name or email"
          />
        </FilterGroup>
      </FiltersContainer>

      <UsersTable>
        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : users.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <RoleBadge role={user.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</RoleBadge>
                  </td>
                  <td>
                    <StatusBadge status={user.approvalStatus}>
                      {user.approvalStatus.charAt(0).toUpperCase() + user.approvalStatus.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    {user.role === "institution" && user.approvalStatus === "pending" && (
                      <>
                        <ActionButton variant="success" onClick={() => handleApproveClick(user)}>
                          Approve
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => handleRejectClick(user)}>
                          Reject
                        </ActionButton>
                      </>
                    )}
                    {user.role !== "admin" && (
                      <ActionButton variant="danger" onClick={() => handleDeleteClick(user)}>
                        Delete
                      </ActionButton>
                    )}
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState>No users found</EmptyState>
        )}
      </UsersTable>

      {users.length > 0 && pagination.totalPages > 1 && (
        <Pagination>
          <PageButton onClick={() => handlePageChange(1)} disabled={pagination.page === 1}>
            First
          </PageButton>

          <PageButton onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
            Prev
          </PageButton>

          {[...Array(pagination.totalPages).keys()].map((page) => (
            <PageButton key={page + 1} active={pagination.page === page + 1} onClick={() => handlePageChange(page + 1)}>
              {page + 1}
            </PageButton>
          ))}

          <PageButton
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </PageButton>

          <PageButton
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
          >
            Last
          </PageButton>
        </Pagination>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>
              {modalAction === "approve"
                ? "Approve Institution"
                : modalAction === "reject"
                  ? "Reject Institution"
                  : "Delete User"}
            </ModalTitle>
            <p>
              {modalAction === "approve"
                ? `Are you sure you want to approve ${selectedUser.name}?`
                : modalAction === "reject"
                  ? `Are you sure you want to reject ${selectedUser.name}?`
                  : `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
            </p>

            {modalAction === "reject" && (
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <label htmlFor="rejectionReason" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Rejection Reason:
                </label>
                <textarea
                  id="rejectionReason"
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--gray-light)"
                  }}
                  placeholder="Please provide a reason for rejection"
                />
              </div>
            )}

            <ModalButtons>
              <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
              <ConfirmButton
                variant={modalAction === "delete" || modalAction === "reject" ? "danger" : "success"}
                onClick={handleConfirmAction}
              >
                {modalAction === "approve" ? "Approve" : modalAction === "reject" ? "Reject" : "Delete"}
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  )
}

export default ManageUsers
