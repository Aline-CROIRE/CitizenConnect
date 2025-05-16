"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../../../context/AuthContext"

const RegisterContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`

const RegisterCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
`

const RegisterTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary);
`

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
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

const RegisterButton = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
  }
  
  &:disabled {
    background-color: var(--gray);
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: var(--accent);
  margin-bottom: 1rem;
  text-align: center;
`

const SuccessMessage = styled.div`
  color: var(--success);
  margin-bottom: 1rem;
  text-align: center;
  padding: 1rem;
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: var(--radius);
`

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`

const RoleSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`

const RoleButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  background-color: ${({ active }) => (active ? "var(--primary)" : "white")};
  color: ${({ active }) => (active ? "white" : "var(--primary)")};
  border: 1px solid var(--primary);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ active }) => (active ? "var(--primary-light)" : "var(--neutral-light)")};
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const InfoAlert = styled.div`
  background-color: rgba(66, 153, 225, 0.1);
  color: var(--info);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--info);
`

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    phone: "",
    address: "",
    department: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (formData.role === "institution" && !formData.department) {
      setError("Please select a department")
      return
    }

    try {
      setLoading(true)
      setError("")

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        department: formData.department,
      }

      const user = await register(userData)

      // If institution, show pending approval message
      if (user.role === "institution") {
        setSuccess(
          "Your institution account has been registered and is pending approval. You will be notified once approved.",
        )
        setRegistrationComplete(true)
      } else if (user.role === "citizen") {
        // Redirect to citizen dashboard
        navigate("/citizen/dashboard")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (registrationComplete) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <RegisterTitle>Registration Complete</RegisterTitle>
          <SuccessMessage>{success}</SuccessMessage>
          <p className="text-center">
            Your account has been registered successfully. An administrator will review your application and approve it
            shortly.
          </p>
          <p className="text-center mt-4">
            <Link to="/login" className="btn btn-primary">
              Return to Login
            </Link>
          </p>
        </RegisterCard>
      </RegisterContainer>
    )
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>Create an Account</RegisterTitle>

        <RoleSelector>
          <RoleButton type="button" active={formData.role === "citizen"} onClick={() => handleRoleChange("citizen")}>
            Citizen
          </RoleButton>
          <RoleButton
            type="button"
            active={formData.role === "institution"}
            onClick={() => handleRoleChange("institution")}
          >
            Institution
          </RoleButton>
        </RoleSelector>

        {formData.role === "institution" && (
          <InfoAlert>
            <strong>Note:</strong> Institution accounts require approval from an administrator before they can be used.
          </InfoAlert>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <RegisterForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Full Name*</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email*</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password*</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </FormGroup>
          </FormRow>

          {formData.role === "institution" && (
            <FormGroup>
              <Label htmlFor="department">Department*</Label>
              <Select id="department" name="department" value={formData.department} onChange={handleChange} required>
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
          )}

          <RegisterButton type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </RegisterButton>
        </RegisterForm>

        <LoginLink>
          Already have an account? <Link to="/login">Login here</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default RegisterPage
