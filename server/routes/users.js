const express = require("express")
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getPendingApprovals,
  updateApprovalStatus,
  updateProfile,
  changePassword,
  getInstitutions,
  getAdminStats,
} = require("../controllers/users")

const router = express.Router()

const { protect } = require("../middleware/auth")

// User routes
router.route("/").get(protect, getUsers)
router.route("/institutions").get(protect, getInstitutions)
router.route("/pending-approvals").get(protect, getPendingApprovals)
router.route("/admin-stats").get(protect, getAdminStats)
router.route("/:id").get(protect, getUser).put(protect, updateUser).delete(protect, deleteUser)
router.route("/:id/approval").put(protect, updateApprovalStatus)

// Profile routes
router.route("/profile").put(protect, updateProfile)
router.route("/change-password").put(protect, changePassword)

module.exports = router
