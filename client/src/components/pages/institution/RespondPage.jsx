"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import api from "../../../Services/api"
import { useAuth } from "../../../context/AuthContext"

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: var(--primary);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:before {
    content: '←';
    margin-right: 0.5rem;
  }
`

const ComplaintCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`

const ComplaintHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const ComplaintTitle = styled.h1`
  color: var(--primary);
  margin: 0;
  font-size: 1.75rem;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
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

const ComplaintBody = styled.div`
  padding: 1.5rem;
`

const ComplaintMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`

const MetaLabel = styled.span`
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 0.25rem;
`

const MetaValue = styled.span`
  font-weight: 500;
`

const ComplaintDescription = styled.div`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const ComplaintImage = styled.div`
  margin-top: 1.5rem;
  
  img {
    max-width: 100%;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
`

const ResponsesCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const ResponsesTitle = styled.h2`
  color: var(--primary);
  margin-bottom: 1.5rem;
`

const Response = styled.div`
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const ResponseFrom = styled.span`
  font-weight: 600;
`

const ResponseDate = styled.span`
  color: var(--gray);
  font-size: 0.9rem;
`

const ResponseText = styled.p`
  margin: 0;
`

const RespondForm = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const FormTitle = styled.h2`
  color: var(--primary);
  margin-bottom: 1.5rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  min-height: 150px;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SubmitButton = styled(Button)`
  background-color: var(--primary);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--primary-light);
  }
`

const CancelButton = styled(Button)`
  background-color: white;
  color: var(--neutral-dark);
  border: 1px solid var(--gray-light);
  
  &:hover {
    background-color: var(--neutral-light);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
`

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
`

const SuccessMessage = styled.div`
  background-color: rgba(56, 161, 105, 0.1);
  color: var(--success);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--success);
`

const ErrorMessage = styled.div`
  background-color: rgba(229, 62, 62, 0.1);
  color: var(--accent);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--accent);
`

const RespondPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    message: "",
    status: "",
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        setLoading(true)

        const response = await api.get(`/api/complaints/${id}`)
        setComplaint(response.data.data)

        // Set initial status to current complaint status
        setFormData((prev) => ({
          ...prev,
          status: response.data.data.status,
        }))
      } catch (err) {
        console.error("Error fetching complaint details:", err)
        setError("Failed to load complaint details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchComplaintDetails()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.message.trim()) {
      setError("Please enter a response message")
      return
    }

    if (formData.status !== complaint.status && !formData.comment.trim()) {
      setError("Please provide a comment for the status change")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      // Add response
      await api.post(`/api/complaints/${id}/responses`, {
        message: formData.message,
      })

      // Update status if changed
      if (formData.status !== complaint.status) {
        await api.put(`/api/complaints/${id}/status`, {
          status: formData.status,
          comment: formData.comment,
        })
      }

      // Refresh complaint data
      const response = await api.get(`/api/complaints/${id}`)
      setComplaint(response.data.data)

      // Reset form
      setFormData({
        message: "",
        status: response.data.data.status,
        comment: "",
      })

      setSuccess("Response submitted successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Error submitting response:", err)
      setError(err.response?.data?.message || "Failed to submit response. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading complaint details...</LoadingState>
      </PageContainer>
    )
  }

  if (error && !complaint) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackLink to="/institution/complaints">Back to Complaints</BackLink>
      </PageContainer>
    )
  }

  if (!complaint) {
    return (
      <PageContainer>
        <EmptyState>Complaint not found</EmptyState>
        <BackLink to="/institution/complaints">Back to Complaints</BackLink>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <BackLink to="/institution/complaints">Back to Complaints</BackLink>

      <ComplaintCard>
        <ComplaintHeader>
          <ComplaintTitle>{complaint.title}</ComplaintTitle>
          <StatusBadge status={complaint.status}>
            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
          </StatusBadge>
        </ComplaintHeader>

        <ComplaintBody>
          <ComplaintMeta>
            <MetaItem>
              <MetaLabel>Complaint ID</MetaLabel>
              <MetaValue>#{complaint.complaintId}</MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaLabel>Submitted On</MetaLabel>
              <MetaValue>{formatDate(complaint.createdAt)}</MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaLabel>Category</MetaLabel>
              <MetaValue>{complaint.category.name}</MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaLabel>Submitted By</MetaLabel>
              <MetaValue>{complaint.citizen.name}</MetaValue>
            </MetaItem>
          </ComplaintMeta>

          <ComplaintDescription>
            <h3>Description</h3>
            <p>{complaint.description}</p>
          </ComplaintDescription>

          {complaint.imageUrl && (
            <ComplaintImage>
              <h3>Attached Image</h3>
              <img src={complaint.imageUrl || "/placeholder.svg"} alt="Complaint" />
            </ComplaintImage>
          )}
        </ComplaintBody>
      </ComplaintCard>

      <ResponsesCard>
        <ResponsesTitle>Previous Responses</ResponsesTitle>

        {complaint.responses && complaint.responses.length > 0 ? (
          complaint.responses.map((response, index) => (
            <Response key={index}>
              <ResponseHeader>
                <ResponseFrom>
                  {response.from.name} ({response.from.department})
                </ResponseFrom>
                <ResponseDate>{formatDate(response.createdAt)}</ResponseDate>
              </ResponseHeader>
              <ResponseText>{response.message}</ResponseText>
            </Response>
          ))
        ) : (
          <EmptyState>No responses yet</EmptyState>
        )}
      </ResponsesCard>

      <RespondForm>
        <FormTitle>Respond to Complaint</FormTitle>

        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="message">Response Message*</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your response to the citizen"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Update Status</Label>
            <Select id="status" name="status" value={formData.status} onChange={handleInputChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </FormGroup>

          {formData.status !== complaint.status && (
            <FormGroup>
              <Label htmlFor="comment">Status Change Comment*</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Provide a reason for changing the status"
                required
              />
            </FormGroup>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate("/institution/complaints")}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Response"}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </RespondForm>
    </PageContainer>
  )
}

export default RespondPage
