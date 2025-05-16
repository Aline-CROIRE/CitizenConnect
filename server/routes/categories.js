const express = require("express")
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/").get(getCategories).post(protect, createCategory)

router.route("/:id").get(getCategory).put(protect, updateCategory).delete(protect, deleteCategory)

module.exports = router
