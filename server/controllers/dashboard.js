const Complaint = require("../models/Complaint")
const User = require("../models/User")
const Category = require("../models/Category")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  // Get counts
  const totalComplaints = await Complaint.countDocuments()
  const pendingComplaints = await Complaint.countDocuments({ status: "pending" })
  const inProgressComplaints = await Complaint.countDocuments({ status: "in-progress" })
  const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" })
  const rejectedComplaints = await Complaint.countDocuments({ status: "rejected" })

  const totalUsers = await User.countDocuments()
  const citizenUsers = await User.countDocuments({ role: "citizen" })
  const institutionUsers = await User.countDocuments({ role: "institution" })
  const pendingApprovals = await User.countDocuments({ role: "institution", approvalStatus: "pending" })

  const totalCategories = await Category.countDocuments()

  // Get recent complaints
  const recentComplaints = await Complaint.find()
    .sort("-createdAt")
    .limit(5)
    .populate("citizen", "name")
    .populate("category", "name")
    .populate("assignedTo", "name department")

  // Get complaints by category
  const complaintsByCategory = await Complaint.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        name: "$category.name",
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  // Get complaints by status
  const complaintsByStatus = [
    { status: "pending", count: pendingComplaints },
    { status: "in-progress", count: inProgressComplaints },
    { status: "resolved", count: resolvedComplaints },
    { status: "rejected", count: rejectedComplaints },
  ]

  // Get complaints by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const complaintsByMonth = await Complaint.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ])

  // Format complaints by month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const formattedComplaintsByMonth = complaintsByMonth.map((item) => ({
    month: monthNames[item._id.month - 1],
    year: item._id.year,
    count: item.count,
  }))

  res.status(200).json({
    success: true,
    data: {
      counts: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        totalUsers,
        citizenUsers,
        institutionUsers,
        pendingApprovals,
        totalCategories,
      },
      recentComplaints,
      complaintsByCategory,
      complaintsByStatus,
      complaintsByMonth: formattedComplaintsByMonth,
    },
  })
})

// @desc    Get institution dashboard stats
// @route   GET /api/dashboard/institution
// @access  Private (Institution)
exports.getInstitutionStats = asyncHandler(async (req, res, next) => {
  // Check if user is institution
  if (req.user.role !== "institution") {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  }

  // Get counts for complaints assigned to this institution
  const totalComplaints = await Complaint.countDocuments({ assignedTo: req.user.id })
  const pendingComplaints = await Complaint.countDocuments({ assignedTo: req.user.id, status: "pending" })
  const inProgressComplaints = await Complaint.countDocuments({ assignedTo: req.user.id, status: "in-progress" })
  const resolvedComplaints = await Complaint.countDocuments({ assignedTo: req.user.id, status: "resolved" })
  const rejectedComplaints = await Complaint.countDocuments({ assignedTo: req.user.id, status: "rejected" })

  // Get recent complaints
  const recentComplaints = await Complaint.find({ assignedTo: req.user.id })
    .sort("-createdAt")
    .limit(5)
    .populate("citizen", "name")
    .populate("category", "name")

  // Get complaints by category
  const complaintsByCategory = await Complaint.aggregate([
    {
      $match: { assignedTo: req.user._id },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        name: "$category.name",
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  // Get complaints by status
  const complaintsByStatus = [
    { status: "pending", count: pendingComplaints },
    { status: "in-progress", count: inProgressComplaints },
    { status: "resolved", count: resolvedComplaints },
    { status: "rejected", count: rejectedComplaints },
  ]

  // Get response time metrics
  const responseTimeMetrics = await Complaint.aggregate([
    {
      $match: {
        assignedTo: req.user._id,
        status: { $in: ["resolved", "in-progress"] },
      },
    },
    {
      $project: {
        responseTime: {
          $divide: [
            { $subtract: ["$updatedAt", "$createdAt"] },
            1000 * 60 * 60, // Convert to hours
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        averageResponseTime: { $avg: "$responseTime" },
        minResponseTime: { $min: "$responseTime" },
        maxResponseTime: { $max: "$responseTime" },
      },
    },
  ])

  res.status(200).json({
    success: true,
    data: {
      counts: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
      },
      recentComplaints,
      complaintsByCategory,
      complaintsByStatus,
      responseTimeMetrics:
        responseTimeMetrics.length > 0
          ? responseTimeMetrics[0]
          : {
              averageResponseTime: 0,
              minResponseTime: 0,
              maxResponseTime: 0,
            },
    },
  })
})

module.exports = exports
