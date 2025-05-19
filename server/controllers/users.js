const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const mongoose = require("mongoose")

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log("Fetching all users with query:", req.query);

    // Build filter object
    const filter = {};

    // Add role filter if provided
    if (req.query.role && ["citizen", "institution", "admin"].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    // Add approval status filter if provided
    if (req.query.approvalStatus && ["pending", "approved", "rejected"].includes(req.query.approvalStatus)) {
      filter.approvalStatus = req.query.approvalStatus;
    }

    console.log("Filter for users query:", filter);

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sort options
    const sortOption = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    // Execute query with pagination and sorting
    const users = await User.find(filter)
      .populate("province", "name")
      .populate("district", "name")
      .populate("sector", "name")
      .populate("handledCategories", "name nameKinyarwanda nameFrench")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    console.log(`Found ${users.length} users out of ${total} total`);

    // Format the response data for better display
    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    }));

    // Calculate pagination info
    const pagination = {};
    if (skip + users.length < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (skip > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      total,
      totalPages: Math.ceil(total / limit),
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return next(new ErrorResponse("Error retrieving users", 500));
  }
})

// @desc    Get all institutions
// @route   GET /api/users/institutions
// @access  Private (Admin)
exports.getInstitutions = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log("Fetching all institutions");

    // Build filter object
    const filter = { role: "institution" };

    // Add approval status filter if provided
    if (req.query.approvalStatus && ["pending", "approved", "rejected"].includes(req.query.approvalStatus)) {
      filter.approvalStatus = req.query.approvalStatus;
    }

    // Add institution type filter if provided
    if (req.query.institutionType) {
      filter.institutionType = req.query.institutionType;
    }

    console.log("Filter for institutions query:", filter);

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sort options
    const sortOption = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    // Execute query with pagination and sorting
    const institutions = await User.find(filter)
      .populate("province", "name")
      .populate("district", "name")
      .populate("sector", "name")
      .populate("handledCategories", "name nameKinyarwanda nameFrench")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    console.log(`Found ${institutions.length} institutions out of ${total} total`);

    // Format the response data for better display
    const formattedInstitutions = institutions.map(institution => ({
      ...institution.toObject(),
      createdAt: new Date(institution.createdAt).toLocaleString(),
    }));

    // Calculate pagination info
    const pagination = {};
    if (skip + institutions.length < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (skip > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: institutions.length,
      pagination,
      total,
      totalPages: Math.ceil(total / limit),
      data: formattedInstitutions,
    });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return next(new ErrorResponse("Error retrieving institutions", 500));
  }
})

// @desc    Get pending institution approvals
// @route   GET /api/users/pending-approvals
// @access  Private (Admin)
exports.getPendingApprovals = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log("Fetching pending institution approvals");

    const pendingUsers = await User.find({
      role: "institution",
      approvalStatus: "pending",
    })
    .populate("province", "name")
    .populate("district", "name")
    .populate("sector", "name")
    .populate("handledCategories", "name nameKinyarwanda nameFrench")
    .sort("-createdAt");

    console.log(`Found ${pendingUsers.length} pending institution approvals`);

    // Format the response data for better display
    const formattedUsers = pendingUsers.map(user => ({
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    }));

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    return next(new ErrorResponse("Error retrieving pending approvals", 500));
  }
})

// @desc    Approve or reject institution
// @route   PUT /api/users/:id/approval
// @access  Private (Admin)
exports.updateApprovalStatus = asyncHandler(async (req, res, next) => {
  try {
    const { approvalStatus, rejectionReason } = req.body
    
    console.log(`Updating approval status for user ${req.params.id} to ${approvalStatus}`);

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
      console.log(`User not found with id of ${req.params.id}`);
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    // Only allow approval updates for institutions
    if (user.role !== "institution") {
      console.log(`Cannot update approval status for non-institution user: ${user.email} (${user.role})`);
      return next(new ErrorResponse(`Only institution accounts can be approved or rejected`, 400))
    }

    // Update user
    user.approvalStatus = approvalStatus
    user.isApproved = approvalStatus === "approved"
    
    if (approvalStatus === "rejected") {
      user.rejectionReason = rejectionReason
      console.log(`Rejected institution ${user.email} with reason: ${rejectionReason}`);
    } else {
      console.log(`Approved institution ${user.email}`);
    }

    await user.save()

    // Format the response data
    const formattedUser = {
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    res.status(200).json({
      success: true,
      message: approvalStatus === "approved" 
        ? `Institution ${user.name} has been approved successfully` 
        : `Institution ${user.name} has been rejected`,
      data: formattedUser,
    });
  } catch (error) {
    console.error(`Error updating approval status for user ${req.params.id}:`, error);
    return next(new ErrorResponse("Error updating institution approval status", 500));
  }
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log(`Fetching user with ID: ${req.params.id}`);

    const user = await User.findById(req.params.id)
      .populate("province", "name")
      .populate("district", "name")
      .populate("sector", "name")
      .populate("handledCategories", "name nameKinyarwanda nameFrench");

    if (!user) {
      console.log(`User not found with ID: ${req.params.id}`);
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    console.log(`Found user: ${user.name} (${user.role})`);

    // Format the response data
    const formattedUser = {
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    };

    res.status(200).json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    return next(new ErrorResponse("Error retrieving user details", 500));
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log(`Admin updating user ${req.params.id}`);
    console.log("Request body:", req.body);

    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password
    }

    // Handle handledCategories separately if it's an array
    let updateData = { ...req.body };
    
    if (updateData.handledCategories && Array.isArray(updateData.handledCategories)) {
      // Validate that all category IDs are valid
      const invalidCategories = updateData.handledCategories.filter(id => !mongoose.Types.ObjectId.isValid(id));
      
      if (invalidCategories.length > 0) {
        return next(new ErrorResponse(`Invalid category IDs: ${invalidCategories.join(', ')}`, 400));
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    // Format the response data
    const formattedUser = {
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    };

    res.status(200).json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error(`Error updating user ${req.params.id}:`, error);
    return next(new ErrorResponse("Error updating user", 500));
  }
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const { name, phone, address, department, handledCategories, institutionType } = req.body

    console.log("Updating user profile:", req.user.id);
    console.log("Request body:", req.body);

    // Find user
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(new ErrorResponse("User not found", 404))
    }

    // Update basic fields
    user.name = name || user.name
    user.phone = phone || user.phone
    user.address = address || user.address

    // Only update institution-specific fields for institution users
    if (user.role === "institution") {
      user.department = department || user.department
      
      // Update institution type if provided
      if (institutionType) {
        user.institutionType = institutionType;
      }
      
      // Update handled categories if provided
      if (handledCategories && Array.isArray(handledCategories)) {
        // Validate that all category IDs are valid
        const invalidCategories = handledCategories.filter(id => !mongoose.Types.ObjectId.isValid(id));
        
        if (invalidCategories.length > 0) {
          return next(new ErrorResponse(`Invalid category IDs: ${invalidCategories.join(', ')}`, 400));
        }
        
        user.handledCategories = handledCategories;
        console.log(`Updated handled categories for institution: ${handledCategories.join(', ')}`);
      }
    }

    await user.save()

    // Format the response data
    const formattedUser = {
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    };

    res.status(200).json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return next(new ErrorResponse("Error updating profile", 500));
  }
})

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse("Please provide current and new password", 400))
    }

    // Find user with password
    const user = await User.findById(req.user.id).select("+password")

    if (!user) {
      return next(new ErrorResponse("User not found", 404))
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword)

    if (!isMatch) {
      return next(new ErrorResponse("Current password is incorrect", 401))
    }

    // Set new password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Error changing password:", error);
    return next(new ErrorResponse("Error changing password", 500));
  }
})

// @desc    Get admin dashboard stats
// @route   GET /api/users/admin-stats
// @access  Private (Admin)
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log("Fetching admin dashboard statistics");

    // Get user counts by role
    const totalUsers = await User.countDocuments();
    const citizenCount = await User.countDocuments({ role: "citizen" });
    const institutionCount = await User.countDocuments({ role: "institution" });
    const adminCount = await User.countDocuments({ role: "admin" });

    // Get institution counts by approval status
    const pendingInstitutions = await User.countDocuments({ 
      role: "institution", 
      approvalStatus: "pending" 
    });
    
    const approvedInstitutions = await User.countDocuments({ 
      role: "institution", 
      approvalStatus: "approved" 
    });
    
    const rejectedInstitutions = await User.countDocuments({ 
      role: "institution", 
      approvalStatus: "rejected" 
    });

    // Get institution counts by type
    const ministryCount = await User.countDocuments({ 
      role: "institution", 
      institutionType: "ministry" 
    });
    
    const districtCount = await User.countDocuments({ 
      role: "institution", 
      institutionType: "district" 
    });
    
    const sectorCount = await User.countDocuments({ 
      role: "institution", 
      institutionType: "sector" 
    });
    
    const otherInstitutionCount = await User.countDocuments({ 
      role: "institution", 
      institutionType: { $nin: ["ministry", "district", "sector"] } 
    });

    // Get recent registrations
    const recentRegistrations = await User.find()
      .sort("-createdAt")
      .limit(5)
      .select("name email role createdAt approvalStatus");

    // Format the response data
    const formattedRegistrations = recentRegistrations.map(user => ({
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    }));

    res.status(200).json({
      success: true,
      data: {
        userCounts: {
          total: totalUsers,
          citizens: citizenCount,
          institutions: institutionCount,
          admins: adminCount
        },
        institutionApproval: {
          pending: pendingInstitutions,
          approved: approvedInstitutions,
          rejected: rejectedInstitutions
        },
        institutionTypes: {
          ministry: ministryCount,
          district: districtCount,
          sector: sectorCount,
          other: otherInstitutionCount
        },
        recentRegistrations: formattedRegistrations
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return next(new ErrorResponse("Error retrieving admin statistics", 500));
  }
})
