const express = require("express")
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getPendingApprovals,
  updateApprovalStatus,
} = require("../controllers/users")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/").get(protect, getUsers)

router.route("/pending-approvals").get(protect, getPendingApprovals)

router.route("/:id").get(protect, getUser).put(protect, updateUser).delete(protect, deleteUser)

router.route("/:id/approval").put(protect, updateApprovalStatus)

module.exports = router
