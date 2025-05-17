"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import api from "../../../Services/api"
import { useAuth } from "../../../context/AuthContext"

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: var(--primary);
`

const ProfileCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`

const ProfileInfo = styled.div`
  flex: 1;
`

const ProfileName = styled.h2`
  margin-bottom: 0.5rem;
  color: var(--primary);
`

const ProfileRole = styled.div`
  font-size: 1.1rem;
  color: var(--gray);
  margin-bottom: 0.5rem;
`

const ProfileDepartment = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`

const FormTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--primary);
  border-bottom: 1px solid var(--gray-light);
  padding-bottom: 0.5rem;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const SaveButton = styled(Button)`
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

const PasswordCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`

const InstitutionProfile = () => {
  const { user, logout } = useAuth()
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    department: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const response = await api.get("/api/auth/me")

        setProfileData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
          department: response.data.user.department || "",
        })
      } catch (error) {
        console.error("Error fetching profile data:", error)
        setProfileError("Failed to load profile data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setProfileError(null)

      await api.put("/api/users/profile", profileData)

      setProfileSuccess("Profile updated successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setProfileError(error.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    try {
      setChangingPassword(true)
      setPasswordError(null)

      await api.put("/api/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setPasswordSuccess("Password changed successfully. Please log in again.")

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Log out after 3 seconds
      setTimeout(() => {
        logout()
      }, 3000)
    } catch (error) {
      console.error("Error changing password:", error)
      setPasswordError(error.response?.data?.message || "Failed to change password. Please try again.")
    } finally {
      setChangingPassword(false)
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <PageContainer>
      <PageTitle>Institution Profile</PageTitle>

      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>{user && user.name ? getInitials(user.name) : "IN"}</ProfileAvatar>
          <ProfileInfo>
            <ProfileName>{user?.name}</ProfileName>
            <ProfileRole>Institution Account</ProfileRole>
            <ProfileDepartment>{user?.department}</ProfileDepartment>
          </ProfileInfo>
        </ProfileHeader>

        <FormTitle>Profile Information</FormTitle>

        {profileSuccess && <SuccessMessage>{profileSuccess}</SuccessMessage>}
        {profileError && <ErrorMessage>{profileError}</ErrorMessage>}

        <form onSubmit={handleProfileSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Full Name*</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
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
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                required
                disabled // Email cannot be changed
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
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="department">Department*</Label>
              <Input
                type="text"
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleProfileChange}
                placeholder="Enter your department"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              placeholder="Enter your address"
            />
          </FormGroup>

          <ButtonGroup>
            <SaveButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </SaveButton>
          </ButtonGroup>
        </form>
      </ProfileCard>

      <PasswordCard>
        <FormTitle>Change Password</FormTitle>

        {passwordSuccess && <SuccessMessage>{passwordSuccess}</SuccessMessage>}
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

        <form onSubmit={handlePasswordSubmit}>
          <FormGroup>
            <Label htmlFor="currentPassword">Current Password*</Label>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your current password"
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="newPassword">New Password*</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password*</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
              />
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <SaveButton type="submit" disabled={changingPassword}>
              {changingPassword ? "Changing Password..." : "Change Password"}
            </SaveButton>
          </ButtonGroup>
        </form>
      </PasswordCard>
    </PageContainer>
  )
}

export default InstitutionProfile
