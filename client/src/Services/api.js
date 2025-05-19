import axios from "axios"

// For debugging purposes, we'll use a direct URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"
console.log("Using API URL:", API_URL)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if it exists
const token = localStorage.getItem("token")
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Add request interceptor to ensure token is included in every request
api.interceptors.request.use(
  (config) => {
    // Check if token exists before each request
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Mock API for testing when the real API is not available
export const mockApi = {
  getProvinces: () => {
    return Promise.resolve({
      data: [
        { _id: "p1", name: "Kigali City" },
        { _id: "p2", name: "Northern Province" },
        { _id: "p3", name: "Southern Province" },
        { _id: "p4", name: "Eastern Province" },
        { _id: "p5", name: "Western Province" }
      ]
    })
  },
  getDistricts: (provinceId) => {
    const districts = {
      "p1": [
        { _id: "d1", name: "Nyarugenge" },
        { _id: "d2", name: "Gasabo" },
        { _id: "d3", name: "Kicukiro" }
      ],
      "p2": [
        { _id: "d4", name: "Musanze" },
        { _id: "d5", name: "Burera" },
        { _id: "d6", name: "Gakenke" }
      ],
      "p3": [
        { _id: "d7", name: "Huye" },
        { _id: "d8", name: "Nyamagabe" }
      ],
      "p4": [
        { _id: "d9", name: "Rwamagana" },
        { _id: "d10", name: "Kayonza" }
      ],
      "p5": [
        { _id: "d11", name: "Rubavu" },
        { _id: "d12", name: "Karongi" }
      ]
    }
    return Promise.resolve({ data: districts[provinceId] || [] })
  },
  getSectors: (districtId) => {
    const sectors = {
      "d1": [
        { _id: "s1", name: "Gitega" },
        { _id: "s2", name: "Nyamirambo" },
        { _id: "s3", name: "Muhima" },
        { _id: "s4", name: "Nyarugenge" }
      ],
      "d2": [
        { _id: "s5", name: "Remera" },
        { _id: "s6", name: "Kacyiru" },
        { _id: "s7", name: "Kimironko" },
        { _id: "s8", name: "Gisozi" }
      ],
      "d3": [
        { _id: "s9", name: "Niboye" },
        { _id: "s10", name: "Kagarama" },
        { _id: "s11", name: "Gatenga" },
        { _id: "s12", name: "Gikondo" }
      ],
      "d4": [
        { _id: "s13", name: "Muhoza" },
        { _id: "s14", name: "Cyuve" },
        { _id: "s15", name: "Kimonyi" }
      ],
      "d5": [
        { _id: "s16", name: "Cyanika" },
        { _id: "s17", name: "Butaro" },
        { _id: "s18", name: "Kinoni" }
      ]
    }
    return Promise.resolve({ data: sectors[districtId] || [] })
  },
  getCells: (sectorId) => {
    const cells = {
      "s1": [
        { _id: "c1", name: "Akabahizi" },
        { _id: "c2", name: "Gakinjiro" },
        { _id: "c3", name: "Kigarama" }
      ],
      "s2": [
        { _id: "c4", name: "Cyivugiza" },
        { _id: "c5", name: "Mumena" },
        { _id: "c6", name: "Rugarama" }
      ],
      "s5": [
        { _id: "c7", name: "Nyabisindu" },
        { _id: "c8", name: "Rukiri" },
        { _id: "c9", name: "Gisimenti" }
      ],
      "s6": [
        { _id: "c10", name: "Kamatamu" },
        { _id: "c11", name: "Kamutwa" },
        { _id: "c12", name: "Kibaza" }
      ],
      "s13": [
        { _id: "c13", name: "Ruhengeri" },
        { _id: "c14", name: "Kigombe" }
      ]
    }
    return Promise.resolve({ data: cells[sectorId] || [] })
  },
  getVillages: (cellId) => {
    const villages = {
      "c1": [
        { _id: "v1", name: "Akabahizi" },
        { _id: "v2", name: "Amahoro" }
      ],
      "c4": [
        { _id: "v3", name: "Cyivugiza" },
        { _id: "v4", name: "Gatare" }
      ],
      "c7": [
        { _id: "v5", name: "Amarembo" },
        { _id: "v6", name: "Rebero" }
      ],
      "c10": [
        { _id: "v7", name: "Gasabo" },
        { _id: "v8", name: "Gishushu" }
      ],
      "c13": [
        { _id: "v9", name: "Susa" },
        { _id: "v10", name: "Kabaya" }
      ]
    }
    return Promise.resolve({ data: villages[cellId] || [] })
  }
}

export default api
