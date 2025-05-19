"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import api from "../../../services/api"
import { useAuth } from "../../../context/AuthContext"
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`

const WelcomeSection = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`

const WelcomeTitle = styled.h1`
  margin-bottom: 1rem;
  color: var(--primary);
`

const WelcomeText = styled.p`
  color: var(--gray);
  margin-bottom: 1.5rem;
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

const RecentComplaintsSection = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: var(--primary);
`

const ComplaintsList = styled.div`
  display: grid;
  gap: 1rem;
`

const ComplaintCard = styled(Link)`
  display: block;
  padding: 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--gray-light);
  transition: var(--transition);
  color: var(--neutral-dark);
  
  &:hover {
    background-color: var(--neutral-light);
    border-color: var(--primary);
  }
`

const ComplaintTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const ComplaintMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--gray);
  font-size: 0.9rem;
`

const ComplaintStatus = styled.span`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
`

const CitizenDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch complaint statistics
        const statsResponse = await api.get("/api/complaints/stats")
        setStats(statsResponse.data)

        // Fetch recent complaints
        const complaintsResponse = await api.get("/api/complaints/recent")
        setRecentComplaints(complaintsResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome, {user?.name || "Citizen"}</WelcomeTitle>
        <WelcomeText>Track your complaints and submit new ones through your citizen dashboard.</WelcomeText>
        <ActionButton to="/citizen/submit-complaint">Submit New Complaint</ActionButton>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Total Complaints</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--warning)">{stats.pending}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--info)">{stats.inProgress}</StatNumber>
          <StatLabel>In Progress</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--success)">{stats.resolved}</StatNumber>
          <StatLabel>Resolved</StatLabel>
        </StatCard>
      </StatsGrid>

      <RecentComplaintsSection>
        <SectionTitle>Recent Complaints</SectionTitle>

        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : recentComplaints.length > 0 ? (
          <ComplaintsList>
            {recentComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} to={`/citizen/complaint/${complaint._id}`}>
                <ComplaintTitle>{complaint.title}</ComplaintTitle>
                <ComplaintMeta>
                  <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <ComplaintStatus status={complaint.status}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </ComplaintStatus>
                </ComplaintMeta>
              </ComplaintCard>
            ))}
          </ComplaintsList>
        ) : (
          <EmptyState>
            You haven't submitted any complaints yet.
            <br />
            <Link to="/citizen/submit-complaint">Submit your first complaint</Link>
          </EmptyState>
        )}
      </RecentComplaintsSection>
    </DashboardContainer>
  )
}

export default CitizenDashboard
