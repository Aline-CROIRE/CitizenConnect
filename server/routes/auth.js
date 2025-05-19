const express = require("express")
const { 
  register, 
  login, 
  getMe, 
  logout,
  getUserStats
} = require("../controllers/auth")

const router = express.Router()

const { protect } = require("../middleware/auth")

// Auth routes
router.post("/register", register)
router.post("/login", login)
router.get("/logout", protect, logout)

// User profile routes
router.get("/me", protect, getMe)
router.get("/stats", protect, getUserStats)

module.exports = router
