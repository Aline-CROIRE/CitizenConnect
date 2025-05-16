const express = require("express")
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaintStatus,
  addResponse,
  getComplaintStats,
  getRecentComplaints,
  getMyComplaints,
  deleteComplaint,
  assignComplaint,
} = require("../controllers/complaints")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/").get(protect, getComplaints).post(protect, createComplaint)

router.route("/my-complaints").get(protect, getMyComplaints)
router.route("/stats").get(protect, getComplaintStats)
router.route("/recent").get(protect, getRecentComplaints)

router.route("/:id").get(protect, getComplaint).delete(protect, deleteComplaint)

router.route("/:id/status").put(protect, updateComplaintStatus)
router.route("/:id/responses").post(protect, addResponse)
router.route("/:id/assign").put(protect, assignComplaint)

module.exports = router
