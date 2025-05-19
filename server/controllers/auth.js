const User = require("../models/User")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const mongoose = require("mongoose")

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      nationalId,
      address,
      department,
      institutionType,
      province,
      district,
      sector,
    } = req.body

    console.log("Registration attempt:", { email, role });

    // Validate required fields
    if (!name || !email || !password) {
      return next(new ErrorResponse("Please provide name, email and password", 400));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse("Email already registered", 400));
    }

    // Validate role
    if (role && !["citizen", "institution", "admin"].includes(role)) {
      return next(new ErrorResponse("Invalid role selected", 400));
    }

    // Validate institution-specific fields
    if (role === "institution") {
      if (!department) {
        return next(new ErrorResponse("Please provide department for institution account", 400));
      }
      if (!institutionType) {
        return next(new ErrorResponse("Please provide institution type", 400));
      }
    }

    // Validate Rwanda-specific fields
    if (nationalId && !/^\d{16}$/.test(nationalId)) {
      return next(new ErrorResponse("Please provide a valid 16-digit National ID number", 400));
    }

    if (phone && !/^(\+?250|0)?7[2389]\d{7}$/.test(phone)) {
      return next(new ErrorResponse("Please provide a valid Rwandan phone number", 400));
    }

    // Extract handledCategories if provided for institutions
    const { handledCategories } = req.body;
    
    // Validate handledCategories if provided
    if (role === "institution" && handledCategories && Array.isArray(handledCategories)) {
      // Validate that all category IDs are valid
      const invalidCategories = handledCategories.filter(id => !mongoose.Types.ObjectId.isValid(id));
      
      if (invalidCategories.length > 0) {
        return next(new ErrorResponse(`Invalid category IDs: ${invalidCategories.join(', ')}`, 400));
      }
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "citizen",
      phone,
      nationalId,
      address,
      department,
      institutionType,
      province,
      district,
      sector,
      // Add handledCategories for institutions if provided
      ...(role === "institution" && handledCategories ? { handledCategories } : {}),
      // Institution accounts require approval
      isApproved: role === "institution" ? false : true,
      approvalStatus: role === "institution" ? "pending" : "approved",
    });

    console.log(`User registered successfully: ${email} (${role || "citizen"})`);
    
    if (role === "institution") {
      console.log(`Institution account pending approval: ${email}`);
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return next(new ErrorResponse('Email already registered', 400));
    }
    
    return next(new ErrorResponse('Error during registration', 500));
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    
    console.log("Login attempt:", { email, role });

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse("Please provide both email and password", 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log(`Login failed: User not found - ${email}`);
      return next(new ErrorResponse("Invalid email or password", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login failed: Incorrect password - ${email}`);
      return next(new ErrorResponse("Invalid email or password", 401));
    }

    // Check if the role matches
    if (role && user.role !== role) {
      console.log(`Login failed: Role mismatch - ${email} (${user.role} vs ${role})`);
      return next(new ErrorResponse(`This account is registered as a ${user.role}, not as a ${role}. Please select the correct role.`, 403));
    }

    // Check if institution is approved
    if (user.role === "institution" && !user.isApproved) {
      console.log(`Login failed: Institution not approved - ${email}`);
      if (user.approvalStatus === "rejected") {
        return next(new ErrorResponse(`Your institution account has been rejected. Reason: ${user.rejectionReason || "Not specified"}`, 403));
      } else {
        return next(new ErrorResponse("Your institution account is pending approval. Please contact the administrator.", 403));
      }
    }

    console.log(`Login successful: ${email} (${user.role})`);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    return next(new ErrorResponse("Error during login. Please try again.", 500));
  }
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("province", "name")
      .populate("district", "name")
      .populate("sector", "name")
      .populate("handledCategories", "name nameKinyarwanda nameFrench");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Format dates for better display
    const formattedUser = {
      ...user.toObject(),
      createdAt: new Date(user.createdAt).toLocaleString(),
    };

    res.status(200).json({
      success: true,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return next(new ErrorResponse("Error retrieving user profile", 500));
  }
})

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
exports.getUserStats = asyncHandler(async (req, res, next) => {
  try {
    // Get user data
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Get statistics based on user role
    let stats = {};
    
    if (user.role === "citizen") {
      // Get complaint statistics for citizens
      const Complaint = require("../models/Complaint");
      
      const totalComplaints = await Complaint.countDocuments({ citizen: req.user.id });
      const pendingComplaints = await Complaint.countDocuments({ 
        citizen: req.user.id,
        status: "pending"
      });
      const inProgressComplaints = await Complaint.countDocuments({ 
        citizen: req.user.id,
        status: "in-progress"
      });
      const resolvedComplaints = await Complaint.countDocuments({ 
        citizen: req.user.id,
        status: "resolved"
      });
      const rejectedComplaints = await Complaint.countDocuments({ 
        citizen: req.user.id,
        status: "rejected"
      });
      
      stats = {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints
        }
      };
    } else if (user.role === "institution") {
      // Get complaint statistics for institutions
      const Complaint = require("../models/Complaint");
      
      const assignedComplaints = await Complaint.countDocuments({ 
        assignedTo: req.user.id 
      });
      const pendingComplaints = await Complaint.countDocuments({ 
        assignedTo: req.user.id,
        status: "pending"
      });
      const inProgressComplaints = await Complaint.countDocuments({ 
        assignedTo: req.user.id,
        status: "in-progress"
      });
      const resolvedComplaints = await Complaint.countDocuments({ 
        assignedTo: req.user.id,
        status: "resolved"
      });
      
      stats = {
        complaints: {
          assigned: assignedComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints
        }
      };
    } else if (user.role === "admin") {
      // Get system-wide statistics for admins
      const Complaint = require("../models/Complaint");
      const User = require("../models/User");
      
      const totalComplaints = await Complaint.countDocuments();
      const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
      const inProgressComplaints = await Complaint.countDocuments({ status: "in-progress" });
      const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });
      const rejectedComplaints = await Complaint.countDocuments({ status: "rejected" });
      
      const totalUsers = await User.countDocuments();
      const citizenCount = await User.countDocuments({ role: "citizen" });
      const institutionCount = await User.countDocuments({ role: "institution" });
      const pendingInstitutions = await User.countDocuments({ 
        role: "institution", 
        approvalStatus: "pending" 
      });
      
      stats = {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints
        },
        users: {
          total: totalUsers,
          citizens: citizenCount,
          institutions: institutionCount,
          pendingInstitutions: pendingInstitutions
        }
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return next(new ErrorResponse("Error retrieving user statistics", 500));
  }
})

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {},
  })
})

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === "production") {
    options.secure = true
  }

  // Remove password from output
  user.password = undefined

  // Format dates for better display
  const formattedUser = {
    ...user.toObject(),
    createdAt: new Date(user.createdAt).toLocaleString(),
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: formattedUser,
  })
}
