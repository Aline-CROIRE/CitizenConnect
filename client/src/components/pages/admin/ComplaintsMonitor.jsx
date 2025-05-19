"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
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

const ComplaintsTable = styled.div`
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
  background-color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "rgba(236, 201, 75, 0.2)"
      case "in-progress":
        return "rgba(66, 153, 225, 0.2)"
      case "resolved":
        return "rgba(56, 161, 105, 0.2)"
      case "rejected":
        return "rgba(229, 62, 62, 0.2)"
      default:
        return "rgba(113, 128, 150, 0.2)"
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "var(--warning)"
      case "in-progress":
        return "var(--info)"
      case "resolved":
        return "var(--success)"
      case "rejected":
        return "var(--danger)"
      default:
        return "var(--gray)"
    }
  }};
`

const ViewButton = styled(Link)`
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius);
  font-size: 0.9rem;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
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

const ComplaintsMonitor = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    institution: "",
    search: "",
  })
  const [categories, setCategories] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get("/api/categories")
        setCategories(categoriesResponse.data.data)

        // Fetch institutions
        const institutionsResponse = await api.get("/api/users?role=institution&approvalStatus=approved")
        setInstitutions(institutionsResponse.data.data)
      } catch (error) {
        console.error("Error fetching form data:", error)
      }
    }

    fetchFormData()
  }, [])

  useEffect(() => {
    fetchComplaints()
  }, [filters, pagination.page, pagination.limit])

  const fetchComplaints = async () => {
    try {
      setLoading(true)

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      }

      const response = await api.get("/api/complaints", { params })

      setComplaints(response.data.data)
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: Math.ceil(response.data.pagination.total / pagination.limit),
      })
    } catch (error) {
      console.error("Error fetching complaints:", error)
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Complaints Monitor</PageTitle>
      </PageHeader>

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel htmlFor="status">Status</FilterLabel>
          <FilterSelect id="status" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="category">Category</FilterLabel>
          <FilterSelect id="category" name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="institution">Institution</FilterLabel>
          <FilterSelect id="institution" name="institution" value={filters.institution} onChange={handleFilterChange}>
            <option value="">All Institutions</option>
            {institutions.map((institution) => (
              <option key={institution._id} value={institution._id}>
                {institution.name} ({institution.department})
              </option>
            ))}
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
            placeholder="Search by ID, title, or description"
          />
        </FilterGroup>
      </FiltersContainer>

      <ComplaintsTable>
        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : complaints.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Citizen</th>
                <th>Institution</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>#{complaint.complaintId}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.category.name}</td>
                  <td>{complaint.citizen.name}</td>
                  <td>{complaint.assignedTo ? complaint.assignedTo.name : "Not Assigned"}</td>
                  <td>{formatDate(complaint.createdAt)}</td>
                  <td>
                    <StatusBadge status={complaint.status}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>
                    <ViewButton to={`/admin/complaints/${complaint._id}`}>View</ViewButton>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState>No complaints found</EmptyState>
        )}
      </ComplaintsTable>

      {complaints.length > 0 && pagination.totalPages > 1 && (
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
    </PageContainer>
  )
}

export default ComplaintsMonitor
