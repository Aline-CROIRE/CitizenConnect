const Category = require("../models/Category")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to create categories`, 403))
  }

  const category = await Category.create(req.body)

  res.status(201).json({
    success: true,
    data: category,
  })
})

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  let query = Category.find()

  // If not admin, only show active categories
  if (!req.user || req.user.role !== "admin") {
    query = query.find({ isActive: true })
  }

  const categories = await query.sort("name")

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  })
})

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
  }

  // If not admin and category is not active
  if ((!req.user || req.user.role !== "admin") && !category.isActive) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: category,
  })
})

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to update categories`, 403))
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: category,
  })
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to delete categories`, 403))
  }

  const category = await Category.findById(req.params.id)

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
  }

  await category.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = exports
