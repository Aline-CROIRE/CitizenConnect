const express = require("express")
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locations")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/").get(getLocations).post(protect, createLocation)

router.route("/:id").get(getLocation).put(protect, updateLocation).delete(protect, deleteLocation)

module.exports = router
