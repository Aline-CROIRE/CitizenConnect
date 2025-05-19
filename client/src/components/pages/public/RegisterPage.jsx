"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../../../context/AuthContext"
import { useLanguage } from "../../../context/LanguageContext"
import api from "../../../services/api"

const RegisterContainer = styled.div`
  max-width: 800px;
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
  padding: 0.75rem;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: var(--radius);
  border-left: 4px solid var(--accent);
`

const SuccessMessage = styled.div`
  color: var(--success);
  margin-bottom: 1rem;
  text-align: center;
  padding: 1rem;
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: var(--radius);
  border-left: 4px solid var(--success);
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
  background-color: ${({ $active }) => ($active ? "var(--primary)" : "white")};
  color: ${({ $active }) => ($active ? "white" : "var(--primary)")};
  border: 1px solid var(--primary);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ $active }) => ($active ? "var(--primary-light)" : "var(--neutral-light)")};
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

const HelpText = styled.small`
  display: block;
  margin-top: 0.25rem;
  color: var(--gray-dark);
  font-size: 0.875rem;
`

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    phone: "",
    nationalId: "",
    address: "",
    department: "",
    institutionType: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [locations, setLocations] = useState({
    provinces: [],
    districts: [],
    sectors: [],
    cells: [],
    villages: [],
  })

  const { register, currentUser } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "citizen") {
        navigate("/citizen/dashboard")
      } else if (currentUser.role === "institution") {
        // Only redirect to dashboard if the institution is approved
        if (currentUser.approvalStatus === "approved") {
          navigate("/institution/dashboard")
        } else {
          // If not approved, show a pending approval message
          navigate("/pending-approval")
        }
      } else if (currentUser.role === "admin") {
        navigate("/admin/dashboard")
      }
    }
  }, [currentUser, navigate])

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await api.get("/api/locations/provinces")
        if (response.data && Array.isArray(response.data.data)) {
          setLocations((prev) => ({
            ...prev,
            provinces: response.data.data,
          }))
        } else if (Array.isArray(response.data)) {
          setLocations((prev) => ({
            ...prev,
            provinces: response.data,
          }))
        } else {
          console.error("Unexpected provinces data format:", response.data)
        }
      } catch (error) {
        console.error("Error fetching provinces:", error)
      }
    }

    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.province) return

      try {
        const response = await api.get(`/api/locations/districts/${formData.province}`)
        if (response.data && Array.isArray(response.data.data)) {
          setLocations((prev) => ({
            ...prev,
            districts: response.data.data,
            sectors: [],
            cells: [],
            villages: [],
          }))
        } else if (Array.isArray(response.data)) {
          setLocations((prev) => ({
            ...prev,
            districts: response.data,
            sectors: [],
            cells: [],
            villages: [],
          }))
        } else {
          console.error("Unexpected districts data format:", response.data)
        }

        setFormData((prev) => ({
          ...prev,
          district: "",
          sector: "",
          cell: "",
          village: "",
        }))
      } catch (error) {
        console.error("Error fetching districts:", error)
      }
    }

    fetchDistricts()
  }, [formData.province])

  // Fetch sectors when district changes
  useEffect(() => {
    const fetchSectors = async () => {
      if (!formData.district) return

      try {
        const response = await api.get(`/api/locations/sectors/${formData.district}`)
        if (response.data && Array.isArray(response.data.data)) {
          setLocations((prev) => ({
            ...prev,
            sectors: response.data.data,
            cells: [],
            villages: [],
          }))
        } else if (Array.isArray(response.data)) {
          setLocations((prev) => ({
            ...prev,
            sectors: response.data,
            cells: [],
            villages: [],
          }))
        } else {
          console.error("Unexpected sectors data format:", response.data)
        }

        setFormData((prev) => ({
          ...prev,
          sector: "",
          cell: "",
          village: "",
        }))
      } catch (error) {
        console.error("Error fetching sectors:", error)
      }
    }

    fetchSectors()
  }, [formData.district])

  // Fetch cells when sector changes
  useEffect(() => {
    const fetchCells = async () => {
      if (!formData.sector) return

      try {
        const response = await api.get(`/api/locations/cells/${formData.sector}`)
        if (response.data && Array.isArray(response.data.data)) {
          setLocations((prev) => ({
            ...prev,
            cells: response.data.data,
            villages: [],
          }))
        } else if (Array.isArray(response.data)) {
          setLocations((prev) => ({
            ...prev,
            cells: response.data,
            villages: [],
          }))
        } else {
          console.error("Unexpected cells data format:", response.data)
        }

        setFormData((prev) => ({
          ...prev,
          cell: "",
          village: "",
        }))
      } catch (error) {
        console.error("Error fetching cells:", error)
      }
    }

    fetchCells()
  }, [formData.sector])

  // Fetch villages when cell changes
  useEffect(() => {
    const fetchVillages = async () => {
      if (!formData.cell) return

      try {
        const response = await api.get(`/api/locations/villages/${formData.cell}`)
        if (response.data && Array.isArray(response.data.data)) {
          setLocations((prev) => ({
            ...prev,
            villages: response.data.data,
          }))
        } else if (Array.isArray(response.data)) {
          setLocations((prev) => ({
            ...prev,
            villages: response.data,
          }))
        } else {
          console.error("Unexpected villages data format:", response.data)
        }

        setFormData((prev) => ({
          ...prev,
          village: "",
        }))
      } catch (error) {
        console.error("Error fetching villages:", error)
      }
    }

    fetchVillages()
  }, [formData.cell])

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
      // Reset institution-specific fields when switching roles
      department: "",
      institutionType: "",
    })
  }

  const validateRwandanPhone = (phone) => {
    // Rwanda phone number format: +250xxxxxxxxx or 07xxxxxxxx
    const phoneRegex = /^(\+?250|0)?7[2389]\d{7}$/
    return phoneRegex.test(phone)
  }

  const validateNationalId = (id) => {
    // Rwanda National ID is 16 digits
    const idRegex = /^\d{16}$/
    return idRegex.test(id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous error
    setError("")
    setSuccess("")

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("register.fillRequiredFields"))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("register.passwordsDoNotMatch"))
      return
    }

    if (formData.password.length < 6) {
      setError(t("register.passwordTooShort"))
      return
    }

    // Validate Rwanda-specific fields
    if (formData.phone && !validateRwandanPhone(formData.phone)) {
      setError(t("register.invalidPhone"))
      return
    }

    if (formData.role === "citizen" && formData.nationalId && !validateNationalId(formData.nationalId)) {
      setError(t("register.invalidNationalId"))
      return
    }

    // Validate location fields
    if (!formData.province || !formData.district || !formData.sector) {
      setError(t("register.locationRequired"))
      return
    }

    // Validate institution-specific fields
    if (formData.role === "institution" && !formData.department) {
      setError(t("register.selectDepartment"))
      return
    }

    if (formData.role === "institution" && !formData.institutionType) {
      setError(t("register.selectInstitutionType"))
      return
    }

    try {
      setLoading(true)

      // Prepare the registration data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        nationalId: formData.nationalId,
        address: formData.address,
        location: {
          province: formData.province,
          district: formData.district,
          sector: formData.sector,
          cell: formData.cell || "",
          village: formData.village || "",
        },
      }

      // Add role-specific fields
      if (formData.role === "institution") {
        userData.department = formData.department
        userData.institutionType = formData.institutionType
      }

      const result = await register(userData)

      if (!result || !result.success) {
        setError(result?.message || t("register.registrationFailed"))
      } else {
        if (formData.role === "institution") {
          // For institutions, show a message about pending approval
          setSuccess(t("register.institutionPendingApproval"))
          setRegistrationComplete(true)
          // Don't automatically redirect - they need to wait for approval
        } else {
          setSuccess(t("register.citizenSuccess"))
          // Redirect to dashboard or login page after a short delay
          setTimeout(() => {
            navigate(result.user.isApproved ? "/citizen/dashboard" : "/login")
          }, 2000)
        }
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.response?.data?.message || t("register.registrationFailed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>{t("register.title")}</RegisterTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {!registrationComplete && (
          <>
            <RoleSelector>
              <RoleButton
                type="button"
                $active={formData.role === "citizen"}
                onClick={() => handleRoleChange("citizen")}
              >
                {t("roles.citizen")}
              </RoleButton>
              <RoleButton
                type="button"
                $active={formData.role === "institution"}
                onClick={() => handleRoleChange("institution")}
              >
                {t("roles.institution")}
              </RoleButton>
            </RoleSelector>

            {formData.role === "institution" && (
              <InfoAlert>
                <strong>{t("register.note")}:</strong> {t("register.institutionApprovalRequired")}
              </InfoAlert>
            )}

            <RegisterForm onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">{t("register.fullName")}*</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("register.fullNamePlaceholder")}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">{t("register.email")}*</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("register.emailPlaceholder")}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="password">{t("register.password")}*</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("register.passwordPlaceholder")}
                    required
                  />
                  <HelpText>{t("register.passwordHelp")}</HelpText>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">{t("register.confirmPassword")}*</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("register.confirmPasswordPlaceholder")}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="phone">{t("register.phone")}*</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("register.phonePlaceholder")}
                    required
                  />
                  <HelpText>{t("register.phoneHelp")}</HelpText>
                </FormGroup>

                {formData.role === "citizen" && (
                  <FormGroup>
                    <Label htmlFor="nationalId">{t("register.nationalId")}*</Label>
                    <Input
                      type="text"
                      id="nationalId"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      placeholder={t("register.nationalIdPlaceholder")}
                      required
                    />
                    <HelpText>{t("register.nationalIdHelp")}</HelpText>
                  </FormGroup>
                )}
              </FormRow>

              <FormGroup>
                <Label htmlFor="address">{t("register.address")}</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t("register.addressPlaceholder")}
                />
              </FormGroup>

              {/* Rwanda Location Fields */}
              <FormGroup>
                <Label htmlFor="province">{t("register.province")}*</Label>
                <Select id="province" name="province" value={formData.province} onChange={handleChange} required>
                  <option value="">{t("register.selectProvince")}</option>
                  {Array.isArray(locations.provinces) &&
                    locations.provinces.map((province) => (
                      <option key={province._id} value={province._id}>
                        {province.name}
                      </option>
                    ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="district">{t("register.district")}*</Label>
                <Select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.province}
                  required
                >
                  <option value="">{t("register.selectDistrict")}</option>
                  {Array.isArray(locations.districts) &&
                    locations.districts.map((district) => (
                      <option key={district._id} value={district._id}>
                        {district.name}
                      </option>
                    ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="sector">{t("register.sector")}*</Label>
                <Select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  disabled={!formData.district}
                  required
                >
                  <option value="">{t("register.selectSector")}</option>
                  {Array.isArray(locations.sectors) &&
                    locations.sectors.map((sector) => (
                      <option key={sector._id} value={sector._id}>
                        {sector.name}
                      </option>
                    ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="cell">{t("register.cell")}</Label>
                <Select id="cell" name="cell" value={formData.cell} onChange={handleChange} disabled={!formData.sector}>
                  <option value="">{t("register.selectCell")}</option>
                  {Array.isArray(locations.cells) &&
                    locations.cells.map((cell) => (
                      <option key={cell._id} value={cell._id}>
                        {cell.name}
                      </option>
                    ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="village">{t("register.village")}</Label>
                <Select
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  disabled={!formData.cell}
                >
                  <option value="">{t("register.selectVillage")}</option>
                  {Array.isArray(locations.villages) &&
                    locations.villages.map((village) => (
                      <option key={village._id} value={village._id}>
                        {village.name}
                      </option>
                    ))}
                </Select>
              </FormGroup>

              {/* Institution-specific fields */}
              {formData.role === "institution" && (
                <>
                  <FormGroup>
                    <Label htmlFor="department">{t("register.department")}*</Label>
                    <Select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t("register.selectDepartment")}</option>
                      <option value="health">{t("departments.health")}</option>
                      <option value="education">{t("departments.education")}</option>
                      <option value="transport">{t("departments.transport")}</option>
                      <option value="housing">{t("departments.housing")}</option>
                      <option value="water">{t("departments.water")}</option>
                      <option value="electricity">{t("departments.electricity")}</option>
                      <option value="roads">{t("departments.roads")}</option>
                      <option value="environment">{t("departments.environment")}</option>
                      <option value="security">{t("departments.security")}</option>
                      <option value="agriculture">{t("departments.agriculture")}</option>
                      <option value="ict">{t("departments.ict")}</option>
                      <option value="other">{t("departments.other")}</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="institutionType">{t("register.institutionType")}*</Label>
                    <Select
                      id="institutionType"
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t("register.selectInstitutionType")}</option>
                      <option value="ministry">{t("institutionTypes.ministry")}</option>
                      <option value="district">{t("institutionTypes.district")}</option>
                      <option value="sector">{t("institutionTypes.sector")}</option>
                      <option value="cell">{t("institutionTypes.cell")}</option>
                      <option value="police">{t("institutionTypes.police")}</option>
                      <option value="healthcare">{t("institutionTypes.healthcare")}</option>
                      <option value="education">{t("institutionTypes.education")}</option>
                      <option value="infrastructure">{t("institutionTypes.infrastructure")}</option>
                      <option value="agriculture">{t("institutionTypes.agriculture")}</option>
                      <option value="other">{t("institutionTypes.other")}</option>
                    </Select>
                  </FormGroup>
                </>
              )}

              <RegisterButton type="submit" disabled={loading}>
                {loading ? t("register.registering") : t("register.registerButton")}
              </RegisterButton>
            </RegisterForm>
          </>
        )}

        {registrationComplete && (
          <div className="text-center">
            {formData.role === "institution" ? (
              <>
                <p>{t("register.institutionRegistrationCompleteMessage")}</p>
                <p>{t("register.institutionApprovalWaitMessage")}</p>
                <p>{t("register.institutionContactAdminMessage")}</p>
              </>
            ) : (
              <p>{t("register.registrationCompleteMessage")}</p>
            )}
            <Link to="/login" className="btn btn-primary mt-4">
              {t("register.goToLogin")}
            </Link>
          </div>
        )}

        <LoginLink>
          {t("register.alreadyHaveAccount")} <Link to="/login">{t("register.loginHere")}</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default RegisterPage
