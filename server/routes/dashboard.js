const express = require("express")
const { getAdminStats, getInstitutionStats } = require("../controllers/dashboard")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/admin").get(protect, getAdminStats)

router.route("/institution").get(protect, getInstitutionStats)

module.exports = router
