const path = require("path")
const fs = require("fs")
const Complaint = require("../models/Complaint")
const User = require("../models/User")
const Category = require("../models/Category")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
exports.createComplaint = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.citizen = req.user.id

  // Check if user is citizen
  if (req.user.role !== "citizen") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to create a complaint`, 403))
  }

  // Handle file upload
  let imageUrl = null

  if (req.files && req.files.image) {
    const file = req.files.image

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse("Please upload an image file", 400))
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400))
    }

    // Create custom filename
    file.name = `photo_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`

    // Move file to upload path
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err)
        return next(new ErrorResponse("Problem with file upload", 500))
      }

      imageUrl = `/uploads/${file.name}`
    })
  }

  // Create complaint
  const complaint = await Complaint.create({
    ...req.body,
    imageUrl,
  })

  res.status(201).json({
    success: true,
    data: complaint,
  })
})

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin, Institution)
exports.getComplaints = asyncHandler(async (req, res, next) => {
  // Check if user is admin or institution
  if (req.user.role !== "admin" && req.user.role !== "institution") {
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
  query = Complaint.find(JSON.parse(queryStr))
    .populate("citizen", "name email")
    .populate("category", "name")
    .populate("location", "name")
    .populate("assignedTo", "name department")

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
  const total = await Complaint.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const complaints = await query

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
    count: complaints.length,
    pagination,
    data: complaints,
  })
})

// @desc    Get complaints for logged in citizen
// @route   GET /api/complaints/my-complaints
// @access  Private (Citizen)
exports.getMyComplaints = asyncHandler(async (req, res, next) => {
  // Check if user is citizen
  if (req.user.role !== "citizen") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  let query

  // Copy req.query
  const reqQuery = { ...req.query, citizen: req.user.id }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = Complaint.find(JSON.parse(queryStr)).populate("category", "name").populate("location", "name")

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
  const total = await Complaint.countDocuments(JSON.parse(queryStr))

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const complaints = await query

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
    count: complaints.length,
    pagination,
    total,
    totalPages: Math.ceil(total / limit),
    complaints,
  })
})

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = asyncHandler(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("citizen", "name email")
    .populate("category", "name")
    .populate("location", "name")
    .populate("assignedTo", "name department")
    .populate("responses.from", "name department")

  if (!complaint) {
    return next(new ErrorResponse(`Complaint not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is complaint owner or admin or institution
  if (req.user.role !== "admin" && req.user.role !== "institution" && complaint.citizen.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this complaint`, 403))
  }

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin, Institution)
exports.updateComplaintStatus = asyncHandler(async (req, res, next) => {
  const { status, comment } = req.body

  // Check if user is admin or institution
  if (req.user.role !== "admin" && req.user.role !== "institution") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to update complaint status`, 403))
  }

  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorResponse(`Complaint not found with id of ${req.params.id}`, 404))
  }

  // Update status
  complaint.status = status
  complaint.updatedAt = Date.now()

  // Add to status history
  complaint.statusHistory.push({
    status,
    timestamp: Date.now(),
    updatedBy: req.user.id,
    comment,
  })

  await complaint.save()

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Add response to complaint
// @route   POST /api/complaints/:id/responses
// @access  Private (Admin, Institution)
exports.addResponse = asyncHandler(async (req, res, next) => {
  const { message } = req.body

  // Check if user is admin or institution
  if (req.user.role !== "admin" && req.user.role !== "institution") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to add responses`, 403))
  }

  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorResponse(`Complaint not found with id of ${req.params.id}`, 404))
  }

  // Add response
  complaint.responses.push({
    from: req.user.id,
    message,
    createdAt: Date.now(),
  })

  complaint.updatedAt = Date.now()

  await complaint.save()

  res.status(200).json({
    success: true,
    data: complaint,
  })
})

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats
// @access  Private
exports.getComplaintStats = asyncHandler(async (req, res, next) => {
  const query = {}

  // If user is citizen, only get their complaints
  if (req.user.role === "citizen") {
    query.citizen = req.user.id
  }

  // If user is institution, only get complaints assigned to them
  if (req.user.role === "institution") {
    query.assignedTo = req.user.id
  }

  const total = await Complaint.countDocuments(query)
  const pending = await Complaint.countDocuments({ ...query, status: "pending" })
  const inProgress = await Complaint.countDocuments({ ...query, status: "in-progress" })
  const resolved = await Complaint.countDocuments({ ...query, status: "resolved" })
  const rejected = await Complaint.countDocuments({ ...query, status: "rejected" })

  res.status(200).json({
    success: true,
    total,
    pending,
    inProgress,
    resolved,
    rejected,
  })
})

// @desc    Get recent complaints
// @route   GET /api/complaints/recent
// @access  Private
exports.getRecentComplaints = asyncHandler(async (req, res, next) => {
  const query = {}

  // If user is citizen, only get their complaints
  if (req.user.role === "citizen") {
    query.citizen = req.user.id
  }

  // If user is institution, only get complaints assigned to them
  if (req.user.role === "institution") {
    query.assignedTo = req.user.id
  }

  const complaints = await Complaint.find(query)
    .sort("-createdAt")
    .limit(5)
    .populate("category", "name")
    .populate("location", "name")

  res.status(200).json({
    success: true,
    count: complaints.length,
    data: complaints,
  })
})

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
exports.deleteComplaint = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to delete complaints`, 403))
  }

  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorResponse(`Complaint not found with id of ${req.params.id}`, 404))
  }

  // Delete image if exists
  if (complaint.imageUrl) {
    const imagePath = path.join(__dirname, "..", complaint.imageUrl)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
  }

  await complaint.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// Add this function to the complaints controller

// @desc    Assign complaint to institution
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
exports.assignComplaint = asyncHandler(async (req, res, next) => {
  const { institutionId } = req.body

  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to assign complaints`, 403))
  }

  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorResponse(`Complaint not found with id of ${req.params.id}`, 404))
  }

  // If institutionId is null, unassign the complaint
  if (!institutionId) {
    complaint.assignedTo = null
  } else {
    // Check if institution exists and is approved
    const institution = await User.findOne({
      _id: institutionId,
      role: "institution",
      isApproved: true,
    })

    if (!institution) {
      return next(new ErrorResponse(`Institution not found or not approved`, 404))
    }

    complaint.assignedTo = institutionId
  }

  complaint.updatedAt = Date.now()

  await complaint.save()

  res.status(200).json({
    success: true,
    data: complaint,
  })
})
