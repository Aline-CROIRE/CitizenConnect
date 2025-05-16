"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../../../context/AuthContext"

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`

const LoginCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
`

const LoginTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary);
`

const LoginForm = styled.form`
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

const LoginButton = styled.button`
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

const RegisterLink = styled.div`
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

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("citizen")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const user = await login(email, password)

      // Redirect based on user role
      if (user.role === "citizen") {
        navigate("/citizen/dashboard")
      } else if (user.role === "institution") {
        if (!user.isApproved) {
          setError("Your account is pending approval. Please contact the administrator.")
          setLoading(false)
          return
        }
        navigate("/institution/dashboard")
      } else if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Login to CitizenConnect</LoginTitle>

        <RoleSelector>
          <RoleButton type="button" active={role === "citizen"} onClick={() => setRole("citizen")}>
            Citizen
          </RoleButton>
          <RoleButton type="button" active={role === "institution"} onClick={() => setRole("institution")}>
            Institution
          </RoleButton>
          <RoleButton type="button" active={role === "admin"} onClick={() => setRole("admin")}>
            Admin
          </RoleButton>
        </RoleSelector>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </LoginForm>

        <RegisterLink>
          Don't have an account? <Link to="/register">Register here</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  )
}

export default LoginPage
