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
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--neutral-dark);
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
  margin-right: 1rem;
  
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

const ApprovalsList = styled.div`
  display: grid;
  gap: 1rem;
`

const ApprovalCard = styled.div`
  padding: 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--gray-light);
  transition: var(--transition);
  
  &:hover {
    background-color: var(--neutral-light);
    border-color: var(--primary);
  }
`

const ApprovalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

const ApprovalTitle = styled.div`
  font-weight: 600;
`

const ApprovalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`

const ApprovalActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ApproveButton = styled.button`
  background-color: var(--success);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--secondary-light);
  }
`

const RejectButton = styled.button`
  background-color: var(--accent);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--accent-light);
  }
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

const AdminDashboard = () => {
  const { user } = useAuth()
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
    recentComplaints: [],
    complaintsByCategory: [],
    complaintsByStatus: [],
    complaintsByMonth: [],
  })
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch admin dashboard stats
        const statsResponse = await api.get("/api/dashboard/admin")
        setStats(statsResponse.data.data)

        // Fetch pending approvals
        const approvalsResponse = await api.get("/api/users/pending-approvals")
        setPendingApprovals(approvalsResponse.data.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleApproveClick = (user) => {
    setSelectedUser(user)
    setModalAction("approve")
    setShowModal(true)
  }

  const handleRejectClick = (user) => {
    setSelectedUser(user)
    setModalAction("reject")
    setRejectionReason("")
    setShowModal(true)
  }

  const handleConfirmAction = async () => {
    try {
      if (modalAction === "approve") {
        await api.put(`/api/users/${selectedUser._id}/approval`, {
          approvalStatus: "approved",
        })
      } else if (modalAction === "reject") {
        if (!rejectionReason) {
          alert("Please provide a reason for rejection")
          return
        }

        await api.put(`/api/users/${selectedUser._id}/approval`, {
          approvalStatus: "rejected",
          rejectionReason,
        })
      }

      // Refresh pending approvals
      const approvalsResponse = await api.get("/api/users/pending-approvals")
      setPendingApprovals(approvalsResponse.data.data)

      // Refresh stats
      const statsResponse = await api.get("/api/dashboard/admin")
      setStats(statsResponse.data.data)

      // Close modal
      setShowModal(false)
    } catch (error) {
      console.error("Error updating approval status:", error)
      alert("Failed to update approval status. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome, {user?.name || "Admin"}</WelcomeTitle>
        <WelcomeText>Manage complaints, users, and system settings from your admin dashboard.</WelcomeText>
        <ActionButton to="/admin/complaints">View All Complaints</ActionButton>
        <ActionButton to="/admin/users">Manage Users</ActionButton>
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

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.counts.totalUsers}</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--primary)">{stats.counts.citizenUsers}</StatNumber>
          <StatLabel>Citizens</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--secondary)">{stats.counts.institutionUsers}</StatNumber>
          <StatLabel>Institutions</StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber color="var(--warning)">{stats.counts.pendingApprovals}</StatNumber>
          <StatLabel>Pending Approvals</StatLabel>
        </StatCard>
      </StatsGrid>

      {stats.counts.pendingApprovals > 0 && (
        <DashboardSection>
          <SectionTitle>Pending Institution Approvals</SectionTitle>

          {loading ? (
            <EmptyState>Loading...</EmptyState>
          ) : pendingApprovals.length > 0 ? (
            <ApprovalsList>
              {pendingApprovals.map((approval) => (
                <ApprovalCard key={approval._id}>
                  <ApprovalHeader>
                    <ApprovalTitle>{approval.name}</ApprovalTitle>
                    <ApprovalActions>
                      <ApproveButton onClick={() => handleApproveClick(approval)}>Approve</ApproveButton>
                      <RejectButton onClick={() => handleRejectClick(approval)}>Reject</RejectButton>
                    </ApprovalActions>
                  </ApprovalHeader>
                  <ApprovalMeta>
                    <span>Email: {approval.email}</span>
                    <span>Department: {approval.department}</span>
                    <span>Registered: {formatDate(approval.createdAt)}</span>
                  </ApprovalMeta>
                </ApprovalCard>
              ))}
            </ApprovalsList>
          ) : (
            <EmptyState>No pending approvals</EmptyState>
          )}
        </DashboardSection>
      )}

      <DashboardSection>
        <SectionTitle>Recent Complaints</SectionTitle>

        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : stats.recentComplaints && stats.recentComplaints.length > 0 ? (
          <RecentComplaintsList>
            {stats.recentComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} to={`/admin/complaints/${complaint._id}`}>
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

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>{modalAction === "approve" ? "Approve Institution" : "Reject Institution"}</ModalTitle>
            <p>
              {modalAction === "approve"
                ? `Are you sure you want to approve ${selectedUser.name} (${selectedUser.department})?`
                : `Are you sure you want to reject ${selectedUser.name} (${selectedUser.department})?`}
            </p>

            {modalAction === "reject" && (
              <div className="mt-3">
                <Label htmlFor="rejectionReason">Reason for Rejection</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection"
                  required
                />
              </div>
            )}

            <ModalButtons>
              <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
              <ConfirmButton variant={modalAction === "reject" ? "danger" : "success"} onClick={handleConfirmAction}>
                {modalAction === "approve" ? "Approve" : "Reject"}
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  )
}

export default AdminDashboard
