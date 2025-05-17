"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import api from "../../../Services/api"
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

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: var(--primary);
`

const DashboardSection = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`

const RecentComplaintsList = styled.div`
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

const InstitutionDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    counts: {
      totalComplaints: 0,
      pendingComplaints: 0,
      inProgressComplaints: 0,
      resolvedComplaints: 0,
      rejectedComplaints: 0,
    },
    recentComplaints: [],
    complaintsByCategory: [],
    complaintsByStatus: [],
    responseTimeMetrics: {
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch institution dashboard stats
        const statsResponse = await api.get("/api/dashboard/institution")
        setStats(statsResponse.data.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatResponseTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    } else if (hours < 24) {
      return `${Math.round(hours)} hours`
    } else {
      return `${Math.round(hours / 24)} days`
    }
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome, {user?.name || "Institution"}</WelcomeTitle>
        <WelcomeText>Manage and respond to citizen complaints through your institution dashboard.</WelcomeText>
        <ActionButton to="/institution/complaints">View All Complaints</ActionButton>
      </WelcomeSection>

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

      <DashboardSection>
        <SectionTitle>Response Time Metrics</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatNumber color="var(--primary)">
              {formatResponseTime(stats.responseTimeMetrics.averageResponseTime)}
            </StatNumber>
            <StatLabel>Average Response Time</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber color="var(--success)">
              {formatResponseTime(stats.responseTimeMetrics.minResponseTime)}
            </StatNumber>
            <StatLabel>Fastest Response</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber color="var(--warning)">
              {formatResponseTime(stats.responseTimeMetrics.maxResponseTime)}
            </StatNumber>
            <StatLabel>Slowest Response</StatLabel>
          </StatCard>
        </StatsGrid>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>Recent Complaints</SectionTitle>

        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : stats.recentComplaints && stats.recentComplaints.length > 0 ? (
          <RecentComplaintsList>
            {stats.recentComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} to={`/institution/respond/${complaint._id}`}>
                <ComplaintTitle>{complaint.title}</ComplaintTitle>
                <ComplaintMeta>
                  <span>
                    By: {complaint.citizen.name} | Category: {complaint.category.name} | Submitted:{" "}
                    {formatDate(complaint.createdAt)}
                  </span>
                  <ComplaintStatus status={complaint.status}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </ComplaintStatus>
                </ComplaintMeta>
              </ComplaintCard>
            ))}
          </RecentComplaintsList>
        ) : (
          <EmptyState>No complaints found</EmptyState>
        )}
      </DashboardSection>
    </DashboardContainer>
  )
}

export default InstitutionDashboard
