const express = require("express")
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByDepartment,
  getCategoriesByInstitutionType
} = require("../controllers/categories")

const router = express.Router()

const { protect } = require("../middleware/auth")

// Basic category routes
router.route("/").get(getCategories).post(protect, createCategory)
router.route("/:id").get(getCategory).put(protect, updateCategory).delete(protect, deleteCategory)

// Special category routes for institutions
router.route("/department/:department").get(getCategoriesByDepartment)
router.route("/institution-type/:type").get(getCategoriesByInstitutionType)

module.exports = router
