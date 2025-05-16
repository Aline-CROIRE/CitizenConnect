const Location = require("../models/Location")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (Admin)
exports.createLocation = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to create locations`, 403))
  }

  const location = await Location.create(req.body)

  res.status(201).json({
    success: true,
    data: location,
  })
})

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = asyncHandler(async (req, res, next) => {
  let query = Location.find()

  // If not admin, only show active locations
  if (!req.user || req.user.role !== "admin") {
    query = query.find({ isActive: true })
  }

  const locations = await query.sort("name")

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations,
  })
})

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
exports.getLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id)

  if (!location) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404))
  }

  // If not admin and location is not active
  if ((!req.user || req.user.role !== "admin") && !location.isActive) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: location,
  })
})

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
exports.updateLocation = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to update locations`, 403))
  }

  const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!location) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: location,
  })
})

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
exports.deleteLocation = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to delete locations`, 403))
  }

  const location = await Location.findById(req.params.id)

  if (!location) {
    return next(new ErrorResponse(`Location not found with id of ${req.params.id}`, 404))
  }

  await location.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = exports
