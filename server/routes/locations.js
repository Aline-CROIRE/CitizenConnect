const express = require("express")
const router = express.Router()
const { getProvinces, getDistricts, getSectors, getCells, getVillages } = require("../controllers/locations")

// Get all provinces
router.get("/provinces", getProvinces)

// Get districts by province
router.get("/districts/:provinceId", getDistricts)

// Get sectors by district
router.get("/sectors/:districtId", getSectors)

// Get cells by sector
router.get("/cells/:sectorId", getCells)

// Get villages by cell
router.get("/villages/:cellId", getVillages)

module.exports = router
