"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import api from "../../../Services/api"

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

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ChartCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
`

const ChartTitle = styled.h2`
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`

const ChartContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  text-align: center;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ color }) => color || "var(--primary)"};
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  color: var(--gray);
  font-weight: 500;
`

const TableCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const TableTitle = styled.h2`
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
`

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
`

// Mock chart component (in a real app, you would use a charting library)
const Chart = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--neutral-light);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray);
  font-weight: 500;
`

const Analytics = () => {
  const [stats, setStats] = useState({
    counts: {
      totalComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      resolvedComplaints: 0,
      rejectedComplaints: 0,
      totalUsers: 0,
      citizenUsers: 0,
      institutionUsers: 0,
      pendingApprovals: 0,
      totalCategories: 0,
    },
    complaintsByCategory: [],
    complaintsByStatus: [],
    complaintsByMonth: [],
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    timeframe: "month", // day, week, month, year, all
    category: "",
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories")
        setCategories(response.data.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    fetchAnalyticsData()
  }, [filters])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      const params = {
        ...filters,
      }

      const response = await api.get("/api/dashboard/admin", { params })
      setStats(response.data.data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
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
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Analytics Dashboard</PageTitle>
        </PageHeader>
        <LoadingState>Loading analytics data...</LoadingState>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Analytics Dashboard</PageTitle>
      </PageHeader>

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel htmlFor="timeframe">Time Frame</FilterLabel>
          <FilterSelect id="timeframe" name="timeframe" value={filters.timeframe} onChange={handleFilterChange}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
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
      </FiltersContainer>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.counts.totalComplaints}</StatNumber>
          <StatLabel>Total Complaints</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--warning)">{stats.counts.pendingComplaints}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--info)">{stats.counts.inProgressComplaints}</StatNumber>
          <StatLabel>In Progress</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--success)">{stats.counts.resolvedComplaints}</StatNumber>
          <StatLabel>Resolved</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Complaints by Status</ChartTitle>
          <ChartContainer>
            <Chart>
              {/* In a real app, you would use a charting library like Chart.js or Recharts */}
              Pie Chart: Complaints by Status
            </Chart>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Complaints by Category</ChartTitle>
          <ChartContainer>
            <Chart>
              {/* In a real app, you would use a charting library like Chart.js or Recharts */}
              Bar Chart: Complaints by Category
            </Chart>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Complaints Over Time</ChartTitle>
          <ChartContainer>
            <Chart>
              {/* In a real app, you would use a charting library like Chart.js or Recharts */}
              Line Chart: Complaints Over Time
            </Chart>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Resolution Time</ChartTitle>
          <ChartContainer>
            <Chart>
              {/* In a real app, you would use a charting library like Chart.js or Recharts */}
              Bar Chart: Average Resolution Time by Category
            </Chart>
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <TableCard>
        <TableTitle>Complaints by Category</TableTitle>
        <Table>
          <TableHead>
            <tr>
              <th>Category</th>
              <th>Total</th>
              <th>Pending</th>
              <th>In Progress</th>
              <th>Resolved</th>
              <th>Rejected</th>
            </tr>
          </TableHead>
          <TableBody>
            {stats.complaintsByCategory && stats.complaintsByCategory.length > 0 ? (
              stats.complaintsByCategory.map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>{category.count}</td>
                  <td>{category.pending || 0}</td>
                  <td>{category.inProgress || 0}</td>
                  <td>{category.resolved || 0}</td>
                  <td>{category.rejected || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState>No data available</EmptyState>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableCard>
    </PageContainer>
  )
}

export default Analytics
