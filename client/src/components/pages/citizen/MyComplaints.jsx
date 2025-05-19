"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"
import api from "../../../services/api"
import { useLanguage } from "../../../context/LanguageContext"

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

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
  }
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
  background-color: white;
  
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
  background-color: ${({ $status }) => {
    switch ($status) {
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
  color: ${({ $status }) => {
    switch ($status) {
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
  border: 1px solid ${({ $active }) => ($active ? "var(--primary)" : "var(--gray-light)")};
  background-color: ${({ $active }) => ($active ? "var(--primary)" : "white")};
  color: ${({ $active }) => ($active ? "white" : "var(--neutral-dark)")};
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ $active }) => ($active ? "var(--primary-light)" : "var(--neutral-light)")};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SuccessMessage = styled.div`
  background-color: rgba(56, 161, 105, 0.1);
  color: var(--success);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--success);
`

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    date: "",
    search: ""
  })
  // Default categories in case API fails
  const defaultCategories = [
    { _id: "c1", name: "Infrastructure", nameKinyarwanda: "Ibikorwa remezo", nameFrench: "Infrastructure" },
    { _id: "c2", name: "Public Services", nameKinyarwanda: "Serivisi rusange", nameFrench: "Services publics" },
    { _id: "c3", name: "Security", nameKinyarwanda: "Umutekano", nameFrench: "Sécurité" }
  ]
  const [categories, setCategories] = useState(defaultCategories)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const location = useLocation()
  const successMessage = location.state?.message
  const { language, t } = useLanguage()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories")
        // Handle both cases: direct array or nested in data property
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || [])
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)

        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        }

        console.log("Fetching complaints with params:", params);
        const response = await api.get("/api/complaints/my-complaints", { params })
        console.log("Complaints response:", response.data);

        setComplaints(response.data.complaints || [])
        
        // Only update total and totalPages, not the entire pagination object
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 1,
        }))
      } catch (error) {
        console.error("Error fetching complaints:", error)
        setComplaints([])
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
    // Remove 'pagination' from the dependency array to prevent infinite loop
  }, [filters, pagination.page, pagination.limit])

  // Add a debounce function for search
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  // Client-side search function
  const performLocalSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredComplaints(complaints);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = complaints.filter(complaint => 
      complaint.title?.toLowerCase().includes(term) || 
      complaint.description?.toLowerCase().includes(term) ||
      complaint.complaintId?.toString().includes(term) ||
      complaint.status?.toLowerCase().includes(term)
    );
    
    setFilteredComplaints(filtered);
  };

  // Update filtered complaints whenever complaints or search term changes
  useEffect(() => {
    performLocalSearch(localSearch);
  }, [complaints, localSearch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    // For search input, use client-side filtering
    if (name === 'search') {
      // Clear any existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // Update the local search state for UI feedback
      setLocalSearch(value);
      
      // But debounce the actual filtering
      const timeoutId = setTimeout(() => {
        console.log("Search debounce completed with value:", value);
        performLocalSearch(value);
      }, 300); // 300ms debounce
      
      setSearchTimeout(timeoutId);
    } else {
      // For other filters, update immediately
      setFilters({
        ...filters,
        [name]: value,
      });
      
      // Reset to first page when filters change
      setPagination({
        ...pagination,
        page: 1,
      });
    }
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

  // Get category name based on current language
  const getCategoryName = (category) => {
    if (!category) return ""
    
    // If category is just an ID string, find the category object
    if (typeof category === 'string') {
      const foundCategory = categories.find(c => c._id === category)
      if (!foundCategory) return category // Return the ID if category not found
      category = foundCategory
    }

    if (language === "rw" && category.nameKinyarwanda) {
      return category.nameKinyarwanda
    } else if (language === "fr" && category.nameFrench) {
      return category.nameFrench
    }

    return category.name || ""
  }

  // Translate status
  const getStatusTranslation = (status) => {
    // Handle the hyphenated key "in-progress" by replacing it with "in_progress"
    const statusKey = status.replace("-", "_")
    return t(`status.${statusKey}`)
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t("myComplaints.title")}</PageTitle>
        <ActionButton to="/citizen/submit-complaint">{t("myComplaints.submitNew")}</ActionButton>
      </PageHeader>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel htmlFor="search">{t("myComplaints.search")}</FilterLabel>
          <FilterInput 
            id="search" 
            name="search" 
            type="text" 
            value={filters.search} 
            onChange={handleFilterChange} 
            placeholder={t("myComplaints.search")}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="status">{t("myComplaints.status")}</FilterLabel>
          <FilterSelect id="status" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">{t("myComplaints.allStatuses")}</option>
            <option value="pending">{t("status.pending")}</option>
            <option value="in-progress">{t("status.in-progress")}</option>
            <option value="resolved">{t("status.resolved")}</option>
            <option value="rejected">{t("status.rejected")}</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="category">{t("myComplaints.category")}</FilterLabel>
          <FilterSelect id="category" name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">{t("myComplaints.allCategories")}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {getCategoryName(category)}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="date">{t("myComplaints.date")}</FilterLabel>
          <FilterSelect id="date" name="date" value={filters.date} onChange={handleFilterChange}>
            <option value="">{t("myComplaints.allTime")}</option>
            <option value="today">{t("myComplaints.today")}</option>
            <option value="thisweek">{t("myComplaints.thisWeek")}</option>
            <option value="thismonth">{t("myComplaints.thisMonth")}</option>
            <option value="thisyear">{t("myComplaints.thisYear")}</option>
          </FilterSelect>
        </FilterGroup>
      </FiltersContainer>

      <ComplaintsTable>
        {loading ? (
          <EmptyState>{t("common.loading")}</EmptyState>
        ) : complaints.length > 0 ? (
          <Table>
            <TableHead>
              <tr>
                <th>{t("myComplaints.id")}</th>
                <th>{t("myComplaints.title")}</th>
                <th>{t("myComplaints.category")}</th>
                <th>{t("myComplaints.submittedOn")}</th>
                <th>{t("myComplaints.status")}</th>
                <th>{t("myComplaints.action")}</th>
              </tr>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>#{complaint.complaintId}</td>
                  <td>{complaint.title}</td>
                  <td>{getCategoryName(complaint.category)}</td>
                  <td>{formatDate(complaint.createdAt)}</td>
                  <td>
                    <StatusBadge $status={complaint.status}>{getStatusTranslation(complaint.status)}</StatusBadge>
                  </td>
                  <td>
                    <ViewButton to={`/citizen/complaint/${complaint._id}`}>{t("myComplaints.view")}</ViewButton>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState>
            {t("myComplaints.noComplaints")}
            <br />
            <Link to="/citizen/submit-complaint">{t("myComplaints.submitFirst")}</Link>
          </EmptyState>
        )}
      </ComplaintsTable>

      {complaints.length > 0 && pagination.totalPages > 1 && (
        <Pagination>
          <PageButton onClick={() => handlePageChange(1)} disabled={pagination.page === 1}>
            {t("pagination.first")}
          </PageButton>

          <PageButton onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
            {t("pagination.prev")}
          </PageButton>

          {[...Array(pagination.totalPages).keys()].map((page) => (
            <PageButton key={page + 1} $active={pagination.page === page + 1} onClick={() => handlePageChange(page + 1)}>
              {page + 1}
            </PageButton>
          ))}

          <PageButton
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            {t("pagination.next")}
          </PageButton>

          <PageButton
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
          >
            {t("pagination.last")}
          </PageButton>
        </Pagination>
      )}
    </PageContainer>
  )
}

export default MyComplaints
