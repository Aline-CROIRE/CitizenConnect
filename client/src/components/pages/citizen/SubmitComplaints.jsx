"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import api, { mockApi } from "../../../services/api"
import { useLanguage } from "../../../context/LanguageContext"

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: var(--primary);
`

const FormCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
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

const FileInput = styled.div`
  margin-top: 0.5rem;
`

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
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

const CancelButton = styled.button`
  background-color: white;
  color: var(--neutral-dark);
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-right: 1rem;
  
  &:hover {
    background-color: var(--neutral-light);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ErrorMessage = styled.div`
  color: var(--accent);
  margin-bottom: 1rem;
`

const HelpText = styled.div`
  font-size: 0.9rem;
  color: var(--gray);
  margin-top: 0.5rem;
`

const ImagePreview = styled.div`
  margin-top: 1rem;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: var(--radius);
  }
`

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 0.5rem;
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

const SubmitComplaint = () => {
  const { t, language } = useLanguage()
  
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    nationalId: "",
    phone: "",
    priority: "medium",
    image: null,
  })
  
  // Log initial form state
  console.log("Initial form state:", formData)

  // Default categories in case API fails
  const defaultCategories = [
    { _id: "c1", name: "Infrastructure", nameKinyarwanda: "Ibikorwa remezo", nameFrench: "Infrastructure" },
    { _id: "c2", name: "Public Services", nameKinyarwanda: "Serivisi rusange", nameFrench: "Services publics" },
    { _id: "c3", name: "Security", nameKinyarwanda: "Umutekano", nameFrench: "Sécurité" }
  ]
  const [categories, setCategories] = useState(defaultCategories)
  // Default location data in case API fails
  const defaultProvinces = [
    { _id: "p1", name: "Kigali City" },
    { _id: "p2", name: "Northern Province" },
    { _id: "p3", name: "Southern Province" },
    { _id: "p4", name: "Eastern Province" },
    { _id: "p5", name: "Western Province" }
  ]
  
  const defaultDistricts = {
    "p1": [
      { _id: "d1", name: "Nyarugenge" },
      { _id: "d2", name: "Gasabo" },
      { _id: "d3", name: "Kicukiro" }
    ],
    "p2": [
      { _id: "d4", name: "Musanze" },
      { _id: "d5", name: "Burera" },
      { _id: "d6", name: "Gakenke" },
      { _id: "d7", name: "Gicumbi" },
      { _id: "d8", name: "Rulindo" }
    ],
    "p3": [
      { _id: "d9", name: "Gisagara" },
      { _id: "d10", name: "Huye" },
      { _id: "d11", name: "Kamonyi" },
      { _id: "d12", name: "Muhanga" },
      { _id: "d13", name: "Nyamagabe" },
      { _id: "d14", name: "Nyanza" },
      { _id: "d15", name: "Nyaruguru" },
      { _id: "d16", name: "Ruhango" }
    ],
    "p4": [
      { _id: "d17", name: "Bugesera" },
      { _id: "d18", name: "Gatsibo" },
      { _id: "d19", name: "Kayonza" },
      { _id: "d20", name: "Kirehe" },
      { _id: "d21", name: "Ngoma" },
      { _id: "d22", name: "Nyagatare" },
      { _id: "d23", name: "Rwamagana" }
    ],
    "p5": [
      { _id: "d24", name: "Karongi" },
      { _id: "d25", name: "Ngororero" },
      { _id: "d26", name: "Nyabihu" },
      { _id: "d27", name: "Nyamasheke" },
      { _id: "d28", name: "Rubavu" },
      { _id: "d29", name: "Rusizi" },
      { _id: "d30", name: "Rutsiro" }
    ]
  }
  
  const defaultSectors = {
    "d1": [
      { _id: "s1", name: "Gitega" },
      { _id: "s2", name: "Nyamirambo" },
      { _id: "s3", name: "Nyarugenge" },
      { _id: "s4", name: "Kimisagara" },
      { _id: "s5", name: "Muhima" },
      { _id: "s6", name: "Rwezamenyo" },
      { _id: "s7", name: "Nyakabanda" },
      { _id: "s8", name: "Mageragere" },
      { _id: "s9", name: "Kanyinya" },
      { _id: "s10", name: "Kigali" }
    ],
    "d2": [
      { _id: "s11", name: "Remera" },
      { _id: "s12", name: "Kacyiru" },
      { _id: "s13", name: "Kimironko" },
      { _id: "s14", name: "Gisozi" },
      { _id: "s15", name: "Kinyinya" },
      { _id: "s16", name: "Ndera" },
      { _id: "s17", name: "Nduba" },
      { _id: "s18", name: "Rusororo" },
      { _id: "s19", name: "Rutunga" },
      { _id: "s20", name: "Bumbogo" },
      { _id: "s21", name: "Gatsata" },
      { _id: "s22", name: "Gikomero" },
      { _id: "s23", name: "Jabana" },
      { _id: "s24", name: "Jali" },
      { _id: "s25", name: "Masaka" }
    ],
    "d3": [
      { _id: "s26", name: "Gahanga" },
      { _id: "s27", name: "Gatenga" },
      { _id: "s28", name: "Gikondo" },
      { _id: "s29", name: "Kagarama" },
      { _id: "s30", name: "Kanombe" },
      { _id: "s31", name: "Kicukiro" },
      { _id: "s32", name: "Kigarama" },
      { _id: "s33", name: "Masaka" },
      { _id: "s34", name: "Niboye" },
      { _id: "s35", name: "Nyarugunga" }
    ],
    "d4": [
      { _id: "s36", name: "Busogo" },
      { _id: "s37", name: "Cyuve" },
      { _id: "s38", name: "Gacaca" },
      { _id: "s39", name: "Gataraga" },
      { _id: "s40", name: "Kimonyi" },
      { _id: "s41", name: "Kinigi" },
      { _id: "s42", name: "Muhoza" },
      { _id: "s43", name: "Muko" },
      { _id: "s44", name: "Musanze" },
      { _id: "s45", name: "Nkotsi" },
      { _id: "s46", name: "Nyange" },
      { _id: "s47", name: "Remera" },
      { _id: "s48", name: "Rwaza" },
      { _id: "s49", name: "Shingiro" },
      { _id: "s50", name: "Gashaki" }
    ]
  }
  
  const defaultCells = {
    "s1": [
      { _id: "c1", name: "Akabahizi" },
      { _id: "c2", name: "Gakinjiro" },
      { _id: "c3", name: "Kigarama" },
      { _id: "c4", name: "Kinyange" },
      { _id: "c5", name: "Kora" }
    ],
    "s2": [
      { _id: "c6", name: "Cyivugiza" },
      { _id: "c7", name: "Mumena" },
      { _id: "c8", name: "Mpazi" },
      { _id: "c9", name: "Rugarama" }
    ],
    "s11": [
      { _id: "c10", name: "Nyabisindu" },
      { _id: "c11", name: "Rukiri I" },
      { _id: "c12", name: "Rukiri II" },
      { _id: "c13", name: "Gisimenti" },
      { _id: "c14", name: "Nyarutarama" }
    ],
    "s12": [
      { _id: "c15", name: "Kamatamu" },
      { _id: "c16", name: "Kamutwa" },
      { _id: "c17", name: "Kibaza" },
      { _id: "c18", name: "Kabarondo" }
    ]
  }
  
  const defaultVillages = {
    "c1": [
      { _id: "v1", name: "Akabahizi" },
      { _id: "v2", name: "Amahoro" },
      { _id: "v3", name: "Inyarurembo" },
      { _id: "v4", name: "Umurava" }
    ],
    "c6": [
      { _id: "v5", name: "Cyivugiza" },
      { _id: "v6", name: "Gatare" },
      { _id: "v7", name: "Kamuhoza" },
      { _id: "v8", name: "Nyagakoki" }
    ],
    "c10": [
      { _id: "v9", name: "Amarembo" },
      { _id: "v10", name: "Rebero" },
      { _id: "v11", name: "Ruturusu I" },
      { _id: "v12", name: "Ruturusu II" }
    ],
    "c15": [
      { _id: "v13", name: "Gasabo" },
      { _id: "v14", name: "Gishushu" },
      { _id: "v15", name: "Kabarondo" },
      { _id: "v16", name: "Kamutwa" }
    ]
  }
  
  // Initialize with default values to ensure we always have data
  const [provinces, setProvinces] = useState(defaultProvinces)
  
  // Initialize districts with default values for the first province
  const [districts, setDistricts] = useState(
    defaultDistricts["p1"] || [
      { _id: "d_init_1", name: "District 1" },
      { _id: "d_init_2", name: "District 2" },
      { _id: "d_init_3", name: "District 3" }
    ]
  )
  
  // Initialize sectors with default values for the first district
  const [sectors, setSectors] = useState(
    defaultSectors["d1"] || [
      { _id: "s_init_1", name: "Sector 1" },
      { _id: "s_init_2", name: "Sector 2" },
      { _id: "s_init_3", name: "Sector 3" }
    ]
  )
  
  // Initialize cells with default values for the first sector
  const [cells, setCells] = useState(
    defaultCells["s1"] || [
      { _id: "c_init_1", name: "Cell 1" },
      { _id: "c_init_2", name: "Cell 2" },
      { _id: "c_init_3", name: "Cell 3" }
    ]
  )
  
  // Initialize villages with default values for the first cell
  const [villages, setVillages] = useState(
    defaultVillages["c1"] || [
      { _id: "v_init_1", name: "Village 1" },
      { _id: "v_init_2", name: "Village 2" },
      { _id: "v_init_3", name: "Village 3" }
    ]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const navigate = useNavigate()

  // Check if API is reachable
  const checkApiConnection = async () => {
    try {
      console.log("Checking API connection...")
      const response = await api.get("/api/health")
      console.log("API health check response:", response)
      return true
    } catch (error) {
      console.error("API connection error:", error)
      setError("Could not connect to the server. Using default data.")
      return false
    }
  }

  useEffect(() => {
    // Check authentication token
    const token = localStorage.getItem("token")
    console.log("Authentication token available:", !!token)
    if (!token) {
      setError("You must be logged in to submit a complaint. Please log in and try again.")
    }
    
    const fetchFormData = async () => {
      try {
        // Check API connection first
        const isApiReachable = await checkApiConnection()
        
        // Fetch categories
        if (isApiReachable) {
          const categoriesResponse = await api.get("/api/categories")
          // Handle both cases: direct array or nested in data property
          const categoriesData = Array.isArray(categoriesResponse.data) 
            ? categoriesResponse.data 
            : (categoriesResponse.data?.data || [])
          
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData)
          }
        }

        // Fetch provinces
        try {
          console.log("Fetching provinces...")
          let provincesData = []
          
          try {
            // Try the real API first with the correct endpoint
            const provincesResponse = await api.get("/api/locations/provinces")
            console.log("Provinces response from real API:", provincesResponse)
            
            // Handle both cases: direct array or nested in data property
            provincesData = Array.isArray(provincesResponse.data) 
              ? provincesResponse.data 
              : (provincesResponse.data?.data || [])
          } catch (realApiError) {
            console.error("Error fetching provinces from real API:", realApiError)
            
            // Try the mock API as fallback
            console.log("Trying mock API for provinces...")
            const mockResponse = await mockApi.getProvinces()
            console.log("Provinces response from mock API:", mockResponse)
            provincesData = mockResponse.data || []
          }
          
          if (provincesData && provincesData.length > 0) {
            console.log("Setting provinces:", provincesData)
            setProvinces(provincesData)
          } else {
            console.log("Using default provinces")
            // Use default provinces if they exist
            if (defaultProvinces && defaultProvinces.length > 0) {
              setProvinces(defaultProvinces)
            } else {
              // If somehow default provinces are missing, create generic ones
              setProvinces([
                { _id: "p_generic_1", name: "Province 1" },
                { _id: "p_generic_2", name: "Province 2" },
                { _id: "p_generic_3", name: "Province 3" },
                { _id: "p_generic_4", name: "Province 4" },
                { _id: "p_generic_5", name: "Province 5" }
              ])
            }
          }
        } catch (provinceError) {
          console.error("Error fetching provinces:", provinceError)
          // Ensure we always have provinces even if everything fails
          if (defaultProvinces && defaultProvinces.length > 0) {
            setProvinces(defaultProvinces)
          } else {
            setProvinces([
              { _id: "p_fallback_1", name: "Province 1" },
              { _id: "p_fallback_2", name: "Province 2" },
              { _id: "p_fallback_3", name: "Province 3" }
            ])
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error)
        setError("Failed to load form data. Please try again.")
      }
    }

    fetchFormData()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province) {
      const fetchDistricts = async () => {
        try {
          console.log("Fetching districts for province:", formData.province)
          let districtsData = []
          
          try {
            // Try the real API first with the correct endpoint
            const response = await api.get(`/api/locations/districts/${formData.province}`)
            console.log("Districts response from real API:", response)
            
            // Handle both cases: direct array or nested in data property
            districtsData = Array.isArray(response.data) 
              ? response.data 
              : (response.data?.data || [])
          } catch (realApiError) {
            console.error("Error fetching districts from real API:", realApiError)
            
            // Try the mock API as fallback
            console.log("Trying mock API for districts...")
            try {
              const mockResponse = await mockApi.getDistricts(formData.province)
              console.log("Districts response from mock API:", mockResponse)
              districtsData = mockResponse.data || []
            } catch (mockApiError) {
              console.error("Error fetching districts from mock API:", mockApiError)
            }
          }
          
          if (districtsData && districtsData.length > 0) {
            console.log("Setting districts:", districtsData)
            setDistricts(districtsData)
          } else {
            console.log("Using default districts if available")
            // Use default districts if available for this province
            const defaultDistrictsForProvince = defaultDistricts[formData.province] || []
            
            if (defaultDistrictsForProvince.length > 0) {
              setDistricts(defaultDistrictsForProvince)
            } else {
              // If no default districts for this specific province, use a generic set
              // This ensures users always have some districts to choose from
              setDistricts([
                { _id: "d_generic_1", name: "District 1" },
                { _id: "d_generic_2", name: "District 2" },
                { _id: "d_generic_3", name: "District 3" },
                { _id: "d_generic_4", name: "District 4" },
                { _id: "d_generic_5", name: "District 5" }
              ])
            }
          }
          // Reset dependent fields
          setFormData((prev) => ({
            ...prev,
            district: "",
            sector: "",
            cell: "",
            village: "",
          }))
          setSectors([])
          setCells([])
          setVillages([])
        } catch (error) {
          console.error("Error fetching districts:", error)
          // Even if everything fails, provide some default districts
          setDistricts([
            { _id: "d_fallback_1", name: "District 1" },
            { _id: "d_fallback_2", name: "District 2" },
            { _id: "d_fallback_3", name: "District 3" }
          ])
        }
      }
      fetchDistricts()
    }
  }, [formData.province])

  // Fetch sectors when district changes
  useEffect(() => {
    if (formData.district) {
      const fetchSectors = async () => {
        try {
          console.log("Fetching sectors for district:", formData.district)
          let sectorsData = []
          
          try {
            // Try the real API first with the correct endpoint
            const response = await api.get(`/api/locations/sectors/${formData.district}`)
            console.log("Sectors response from real API:", response)
            
            // Handle both cases: direct array or nested in data property
            sectorsData = Array.isArray(response.data) 
              ? response.data 
              : (response.data?.data || [])
          } catch (realApiError) {
            console.error("Error fetching sectors from real API:", realApiError)
            
            // Try the mock API as fallback
            console.log("Trying mock API for sectors...")
            try {
              const mockResponse = await mockApi.getSectors(formData.district)
              console.log("Sectors response from mock API:", mockResponse)
              sectorsData = mockResponse.data || []
            } catch (mockApiError) {
              console.error("Error fetching sectors from mock API:", mockApiError)
            }
          }
          
          if (sectorsData && sectorsData.length > 0) {
            console.log("Setting sectors:", sectorsData)
            setSectors(sectorsData)
          } else {
            console.log("Using default sectors if available")
            // Use default sectors if available for this district
            const defaultSectorsForDistrict = defaultSectors[formData.district] || []
            
            if (defaultSectorsForDistrict.length > 0) {
              setSectors(defaultSectorsForDistrict)
            } else {
              // If no default sectors for this specific district, use a generic set
              // This ensures users always have some sectors to choose from
              setSectors([
                { _id: "s_generic_1", name: "Sector 1" },
                { _id: "s_generic_2", name: "Sector 2" },
                { _id: "s_generic_3", name: "Sector 3" },
                { _id: "s_generic_4", name: "Sector 4" },
                { _id: "s_generic_5", name: "Sector 5" }
              ])
            }
          }
          
          // Reset dependent fields
          setFormData((prev) => ({
            ...prev,
            sector: "",
            cell: "",
            village: "",
          }))
          setCells([])
          setVillages([])
        } catch (error) {
          console.error("Error fetching sectors:", error)
          // Even if everything fails, provide some default sectors
          setSectors([
            { _id: "s_fallback_1", name: "Sector 1" },
            { _id: "s_fallback_2", name: "Sector 2" },
            { _id: "s_fallback_3", name: "Sector 3" }
          ])
        }
      }
      fetchSectors()
    }
  }, [formData.district])

  // Fetch cells when sector changes
  useEffect(() => {
    if (formData.sector) {
      const fetchCells = async () => {
        try {
          console.log("Fetching cells for sector:", formData.sector)
          let cellsData = []
          
          try {
            // Try the real API first with the correct endpoint
            const response = await api.get(`/api/locations/cells/${formData.sector}`)
            console.log("Cells response from real API:", response)
            
            // Handle both cases: direct array or nested in data property
            cellsData = Array.isArray(response.data) 
              ? response.data 
              : (response.data?.data || [])
          } catch (realApiError) {
            console.error("Error fetching cells from real API:", realApiError)
            
            // Try the mock API as fallback
            console.log("Trying mock API for cells...")
            try {
              const mockResponse = await mockApi.getCells(formData.sector)
              console.log("Cells response from mock API:", mockResponse)
              cellsData = mockResponse.data || []
            } catch (mockApiError) {
              console.error("Error fetching cells from mock API:", mockApiError)
            }
          }
          
          if (cellsData && cellsData.length > 0) {
            console.log("Setting cells:", cellsData)
            setCells(cellsData)
          } else {
            console.log("Using default cells if available")
            // Use default cells if available for this sector
            const defaultCellsForSector = defaultCells[formData.sector] || []
            
            if (defaultCellsForSector.length > 0) {
              setCells(defaultCellsForSector)
            } else {
              // If no default cells for this specific sector, use a generic set
              // This ensures users always have some cells to choose from
              setCells([
                { _id: "c_generic_1", name: "Cell 1" },
                { _id: "c_generic_2", name: "Cell 2" },
                { _id: "c_generic_3", name: "Cell 3" },
                { _id: "c_generic_4", name: "Cell 4" },
                { _id: "c_generic_5", name: "Cell 5" }
              ])
            }
          }
          // Reset dependent fields
          setFormData((prev) => ({
            ...prev,
            cell: "",
            village: "",
          }))
          setVillages([])
        } catch (error) {
          console.error("Error fetching cells:", error)
          // Even if everything fails, provide some default cells
          setCells([
            { _id: "c_fallback_1", name: "Cell 1" },
            { _id: "c_fallback_2", name: "Cell 2" },
            { _id: "c_fallback_3", name: "Cell 3" }
          ])
        }
      }
      fetchCells()
    }
  }, [formData.sector])

  // Fetch villages when cell changes
  useEffect(() => {
    if (formData.cell) {
      const fetchVillages = async () => {
        try {
          console.log("Fetching villages for cell:", formData.cell)
          let villagesData = []
          
          try {
            // Try the real API first with the correct endpoint
            const response = await api.get(`/api/locations/villages/${formData.cell}`)
            console.log("Villages response from real API:", response)
            
            // Handle both cases: direct array or nested in data property
            villagesData = Array.isArray(response.data) 
              ? response.data 
              : (response.data?.data || [])
          } catch (realApiError) {
            console.error("Error fetching villages from real API:", realApiError)
            
            // Try the mock API as fallback
            console.log("Trying mock API for villages...")
            try {
              const mockResponse = await mockApi.getVillages(formData.cell)
              console.log("Villages response from mock API:", mockResponse)
              villagesData = mockResponse.data || []
            } catch (mockApiError) {
              console.error("Error fetching villages from mock API:", mockApiError)
            }
          }
          
          if (villagesData && villagesData.length > 0) {
            console.log("Setting villages:", villagesData)
            setVillages(villagesData)
          } else {
            console.log("Using default villages if available")
            // Use default villages if available for this cell
            const defaultVillagesForCell = defaultVillages[formData.cell] || []
            
            if (defaultVillagesForCell.length > 0) {
              setVillages(defaultVillagesForCell)
            } else {
              // If no default villages for this specific cell, use a generic set
              // This ensures users always have some villages to choose from
              setVillages([
                { _id: "v_generic_1", name: "Village 1" },
                { _id: "v_generic_2", name: "Village 2" },
                { _id: "v_generic_3", name: "Village 3" },
                { _id: "v_generic_4", name: "Village 4" },
                { _id: "v_generic_5", name: "Village 5" }
              ])
            }
          }
          // Reset dependent field
          setFormData((prev) => ({
            ...prev,
            village: "",
          }))
        } catch (error) {
          console.error("Error fetching villages:", error)
          // Even if everything fails, provide some default villages
          setVillages([
            { _id: "v_fallback_1", name: "Village 1" },
            { _id: "v_fallback_2", name: "Village 2" },
            { _id: "v_fallback_3", name: "Village 3" }
          ])
        }
      }
      fetchVillages()
    }
  }, [formData.cell])

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Log the updated form data after a short delay to ensure state has updated
    setTimeout(() => {
      console.log("Updated form data:", formData);
    }, 100);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      // Create image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    // Validate required fields
    if (!formData.title || formData.title.trim() === '') {
      setError("Please provide a title")
      return false
    }
    
    if (!formData.description || formData.description.trim() === '') {
      setError("Please provide a description")
      return false
    }
    
    if (!formData.category) {
      setError("Please select a category")
      return false
    }

    // Validate location fields - at least province, district and sector should be selected
    if (!formData.province || !formData.district || !formData.sector) {
      setError(t("errors.location_required"))
      return false
    }

    // Validate National ID if provided
    if (formData.nationalId && !/^\d{16}$/.test(formData.nationalId)) {
      setError(t("errors.invalid_national_id"))
      return false
    }

    // Validate phone number if provided
    if (formData.phone && !/^(\+?250|0)?7[2389]\d{7}$/.test(formData.phone)) {
      setError(t("errors.invalid_phone"))
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError("")

      // Get the token to ensure we're authenticated
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You must be logged in to submit a complaint. Please log in and try again.")
        setLoading(false)
        return
      }

      // Create FormData object
      const submitData = new FormData()
      
      // Log form data before submission
      console.log("Form data before submission:", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        province: formData.province,
        district: formData.district,
        sector: formData.sector
      });
      
      // Ensure required fields are properly trimmed and not empty
      submitData.append("title", formData.title ? formData.title.trim() : "")
      submitData.append("description", formData.description ? formData.description.trim() : "")
      submitData.append("category", formData.category || "")
      submitData.append("priority", formData.priority || "medium")

      // Append location data
      if (formData.province) submitData.append("province", formData.province)
      if (formData.district) submitData.append("district", formData.district)
      if (formData.sector) submitData.append("sector", formData.sector)
      if (formData.cell) submitData.append("cell", formData.cell)
      if (formData.village) submitData.append("village", formData.village)

      // Append additional fields
      if (formData.nationalId) submitData.append("nationalId", formData.nationalId)
      if (formData.phone) submitData.append("phone", formData.phone)

      if (formData.image) {
        submitData.append("image", formData.image)
      }
      
      // Log FormData entries
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      console.log("Submitting complaint with data:", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      });

      // Log the final form data before submission
      console.log("Final form data before submission:", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        province: formData.province,
        district: formData.district,
        sector: formData.sector,
        cell: formData.cell,
        village: formData.village,
        priority: formData.priority,
        nationalId: formData.nationalId,
        phone: formData.phone,
        hasImage: !!formData.image
      });
      
      // Explicitly set the Authorization header for this request
      const response = await api.post("/api/complaints", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      
      console.log("Complaint submission response:", response);

      // Redirect to complaints list
      navigate("/citizen/my-complaints", {
        state: { message: "Complaint submitted successfully!" },
      })
    } catch (err) {
      console.error("Complaint submission error:", err);
      
      // More detailed error handling
      if (err.response) {
        console.log("Error response data:", err.response.data);
        console.log("Error response status:", err.response.status);
        
        if (err.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to submit complaint. Please check all required fields and try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection and try again.");
      } else {
        // Something happened in setting up the request
        setError("An error occurred while submitting your complaint. Please try again.");
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/citizen/dashboard")
  }

  return (
    <PageContainer>
      <PageTitle>{t("submit_complaint.title")}</PageTitle>

      <FormCard>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">{t("submit_complaint.complaintTitle")}*</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t("submit_complaint.titlePlaceholder")}
              required
              aria-required="true"
            />
            <HelpText>Keep your title clear and concise</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">{t("submit_complaint.category")}*</Label>
            <Select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              aria-required="true"
            >
              <option value="">{t("submit_complaint.selectCategory")}</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {getCategoryName(category)}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="priority">{t("submit_complaint.priority")}</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={formData.priority === "low"}
                  onChange={handleChange}
                />
                {t("submit_complaint.priority_low")}
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={formData.priority === "medium"}
                  onChange={handleChange}
                />
                {t("submit_complaint.priority_medium")}
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={formData.priority === "high"}
                  onChange={handleChange}
                />
                {t("submit_complaint.priority_high")}
              </RadioLabel>
            </RadioGroup>
            <HelpText>Select the urgency level of your complaint</HelpText>
          </FormGroup>

          {/* Rwanda-specific location fields */}
          <FormGroup>
            <Label htmlFor="province">{t("submit_complaint.location")}*</Label>
            <Select 
              id="province" 
              name="province" 
              value={formData.province} 
              onChange={handleChange}
              required
            >
              <option value="">{t("submit_complaint.selectProvince")}</option>
              {provinces.map((province) => (
                <option key={province._id} value={province._id}>
                  {province.name}
                </option>
              ))}
            </Select>
            <HelpText>Province, district and sector are required</HelpText>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="district">{t("register.selectDistrict")}*</Label>
              <Select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.province}
                required
              >
                <option value="">{t("submit_complaint.selectDistrict")}</option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="sector">{t("register.selectSector")}*</Label>
              <Select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                disabled={!formData.district}
                required
              >
                <option value="">{t("submit_complaint.selectSector")}</option>
                {sectors.map((sector) => (
                  <option key={sector._id} value={sector._id}>
                    {sector.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="cell">{t("register.selectCell")}</Label>
              <Select id="cell" name="cell" value={formData.cell} onChange={handleChange} disabled={!formData.sector}>
                <option value="">{t("submit_complaint.selectCell")}</option>
                {cells.map((cell) => (
                  <option key={cell._id} value={cell._id}>
                    {cell.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="village">{t("register.selectVillage")}</Label>
              <Select
                id="village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={!formData.cell}
              >
                <option value="">{t("submit_complaint.selectVillage")}</option>
                {villages.map((village) => (
                  <option key={village._id} value={village._id}>
                    {village.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="nationalId">{t("register.nationalId")}</Label>
              <Input
                type="text"
                id="nationalId"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder={t("register.nationalIdPlaceholder")}
                maxLength={16}
              />
              <HelpText>{t("register.nationalIdFormat")}</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">{t("register.phone")}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("register.phonePlaceholder")}
              />
              <HelpText>{t("register.phoneFormat")}</HelpText>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="description">{t("submit_complaint.description")}*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("submit_complaint.descriptionPlaceholder")}
              required
              aria-required="true"
            />
            <HelpText>Provide as much detail as possible</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="image">{t("submit_complaint.attachments")}</Label>
            <FileInput>
              <Input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
            </FileInput>
            <HelpText>{t("submit_complaint.fileTypes")}</HelpText>

            {imagePreview && (
              <ImagePreview>
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
              </ImagePreview>
            )}
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              {t("admin.cancel")}
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? t("submit_complaint.submitting") : t("submit_complaint.submit")}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormCard>
    </PageContainer>
  )
}

export default SubmitComplaint
