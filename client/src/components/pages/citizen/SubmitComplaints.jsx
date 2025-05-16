"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import api from "../../../Services/api"

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

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image: null,
  })

  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const categoriesResponse = await api.get("/api/categories")
        const locationsResponse = await api.get("/api/locations")

        // Debugging: check response shape
        console.log("Categories response:", categoriesResponse.data)
        console.log("Locations response:", locationsResponse.data)

        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [])
        setLocations(Array.isArray(locationsResponse.data) ? locationsResponse.data : [])
      } catch (error) {
        console.error("Error fetching form data:", error)
        setError("Failed to load form data. Please try again.")
      }
    }

    fetchFormData()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("description", formData.description)
      submitData.append("category", formData.category)
      submitData.append("location", formData.location)

      if (formData.image) {
        submitData.append("image", formData.image)
      }

      await api.post("/api/complaints", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/citizen/my-complaints", {
        state: { message: "Complaint submitted successfully!" },
      })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/citizen/dashboard")
  }

  return (
    <PageContainer>
      <PageTitle>Submit a Complaint</PageTitle>

      <FormCard>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title*</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a brief title for your complaint"
              required
            />
            <HelpText>Be clear and specific about the issue</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">Category*</Label>
            <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" value={formData.location} onChange={handleChange}>
              <option value="">Select a location</option>
              {Array.isArray(locations) &&
                locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about your complaint"
              required
            />
            <HelpText>Include relevant details such as when and where the issue occurred</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="image">Attach Image (Optional)</Label>
            <FileInput>
              <Input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
            </FileInput>
            <HelpText>Upload an image related to your complaint (max 5MB)</HelpText>

            {imagePreview && (
              <ImagePreview>
                <img src={imagePreview} alt="Preview" />
              </ImagePreview>
            )}
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormCard>
    </PageContainer>
  )
}

export default SubmitComplaint
