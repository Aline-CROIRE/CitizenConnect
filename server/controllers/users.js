const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = User.find(JSON.parse(queryStr))

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await User.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const users = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    total,
    totalPages: Math.ceil(total / limit),
    data: users,
  })
})

// @desc    Get pending institution approvals
// @route   GET /api/users/pending-approvals
// @access  Private (Admin)
exports.getPendingApprovals = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  const pendingUsers = await User.find({
    role: "institution",
    approvalStatus: "pending",
  }).sort("-createdAt")

  res.status(200).json({
    success: true,
    count: pendingUsers.length,
    data: pendingUsers,
  })
})

// @desc    Approve or reject institution
// @route   PUT /api/users/:id/approval
// @access  Private (Admin)
exports.updateApprovalStatus = asyncHandler(async (req, res, next) => {
  const { approvalStatus, rejectionReason } = req.body

  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  // Validate input
  if (!approvalStatus || !["approved", "rejected"].includes(approvalStatus)) {
    return next(new ErrorResponse("Please provide a valid approval status (approved or rejected)", 400))
  }

  // If rejecting, require a reason
  if (approvalStatus === "rejected" && !rejectionReason) {
    return next(new ErrorResponse("Please provide a rejection reason", 400))
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  // Only allow approval updates for institutions
  if (user.role !== "institution") {
    return next(new ErrorResponse(`Only institution accounts can be approved or rejected`, 400))
  }

  // Update user
  user.approvalStatus = approvalStatus
  user.isApproved = approvalStatus === "approved"
  if (approvalStatus === "rejected") {
    user.rejectionReason = rejectionReason
  }

  await user.save()

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  // Don't allow password updates through this route
  if (req.body.password) {
    delete req.body.password
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user.id) {
    return next(new ErrorResponse(`You cannot delete your own account`, 400))
  }

  await user.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
