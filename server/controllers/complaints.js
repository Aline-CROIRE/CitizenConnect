const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const Complaint = require("../models/Complaint")
const User = require("../models/User")
const Category = require("../models/Category")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
exports.createComplaint = asyncHandler(async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    console.log("Received complaint submission:", {
      title: req.body.title,
      description: req.body.description ? req.body.description.substring(0, 30) + "..." : "undefined...",
      category: req.body.category,
      hasImage: !!req.file
    });

    // Add user to req.body
    req.body.citizen = req.user.id

    // Check if user is citizen
    if (req.user.role !== "citizen") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to create a complaint`, 403))
    }

    // Log all form fields for debugging
    console.log("All form fields:", {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      province: req.body.province,
      district: req.body.district,
      sector: req.body.sector,
      cell: req.body.cell,
      village: req.body.village,
      priority: req.body.priority,
      nationalId: req.body.nationalId,
      phone: req.body.phone
    });
    
    // Validate required fields
    if (!req.body.title || req.body.title.trim() === '') {
      console.log("Title validation failed:", req.body.title);
      return next(new ErrorResponse("Please provide a title", 400))
    }

    if (!req.body.description || req.body.description.trim() === '') {
      console.log("Description validation failed:", req.body.description);
      return next(new ErrorResponse("Please provide a description", 400))
    }

    if (!req.body.category) {
      console.log("Category validation failed:", req.body.category);
      return next(new ErrorResponse("Please select a category", 400))
    }

    // Validate location fields
    if (!req.body.province) {
      console.log("Province validation failed:", req.body.province);
      return next(new ErrorResponse("Please select a province", 400))
    }

    if (!req.body.district) {
      console.log("District validation failed:", req.body.district);
      return next(new ErrorResponse("Please select a district", 400))
    }

    if (!req.body.sector) {
      console.log("Sector validation failed:", req.body.sector);
      return next(new ErrorResponse("Please select a sector", 400))
    }

    // Handle file upload with multer
    let imageUrl = null

    if (req.file) {
      console.log("File uploaded:", req.file);
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Prepare complaint data
    const complaintData = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category,  // This should be a valid ObjectId
      province: req.body.province,
      district: req.body.district,
      sector: req.body.sector,
      cell: req.body.cell || null,
      village: req.body.village || null,
      priority: req.body.priority || "medium",
      citizen: req.user.id,
      imageUrl,
    };
    
    // Validate that category is a valid ObjectId
    if (complaintData.category && !mongoose.Types.ObjectId.isValid(complaintData.category)) {
      console.error("Invalid category ID:", complaintData.category);
      return next(new ErrorResponse("Invalid category ID. Please select a valid category.", 400));
    }

    // Add optional fields if provided
    if (req.body.nationalId) {
      complaintData.nationalId = req.body.nationalId;
    }
    
    if (req.body.phone) {
      complaintData.phone = req.body.phone;
    }

    console.log("Creating complaint with data:", {
      title: complaintData.title,
      category: complaintData.category,
      province: complaintData.province,
      district: complaintData.district,
      sector: complaintData.sector
    });

    // Create complaint
    const complaint = await Complaint.create(complaintData);

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return next(new ErrorResponse('Duplicate field value entered', 400));
    }
    
    return next(new ErrorResponse('Server error while creating complaint', 500));
  }
})

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin, Institution)
exports.getComplaints = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is admin or institution
    if (req.user.role !== "admin" && req.user.role !== "institution") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log("Original query parameters:", req.query);

    // Build filter object
    const filter = {};

    // Add status filter if provided and not empty
    if (req.query.status && req.query.status !== '') {
      filter.status = req.query.status;
    }

    // Add category filter if provided and not empty
    if (req.query.category && req.query.category !== '') {
      filter.category = req.query.category;
    }

    // Add date filter if provided and not empty
    if (req.query.date && req.query.date !== '') {
      let dateObj;
      
      // Handle special date values
      if (req.query.date.toLowerCase() === 'today') {
        dateObj = new Date();
        dateObj.setHours(0, 0, 0, 0); // Start of today
      } else if (req.query.date.toLowerCase() === 'yesterday') {
        dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - 1);
        dateObj.setHours(0, 0, 0, 0); // Start of yesterday
      } else if (req.query.date.toLowerCase() === 'thisweek') {
        dateObj = new Date();
        const day = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
        dateObj = new Date(dateObj.setDate(diff));
        dateObj.setHours(0, 0, 0, 0); // Start of this week (Monday)
      } else if (req.query.date.toLowerCase() === 'thismonth') {
        dateObj = new Date();
        dateObj.setDate(1); // First day of current month
        dateObj.setHours(0, 0, 0, 0);
      } else {
        // Try to parse as YYYY-MM-DD format
        dateObj = new Date(req.query.date);
      }
      
      // Check if date is valid before adding to filter
      if (!isNaN(dateObj.getTime())) {
        console.log(`Valid date filter: ${dateObj.toISOString()}`);
        
        let endDate;
        
        // Set appropriate end date based on filter type
        if (req.query.date.toLowerCase() === 'today' || req.query.date.toLowerCase() === 'yesterday') {
          // End of the day (next day at 00:00:00)
          endDate = new Date(dateObj);
          endDate.setDate(endDate.getDate() + 1);
        } else if (req.query.date.toLowerCase() === 'thisweek') {
          // End of the week (next Monday at 00:00:00)
          endDate = new Date(dateObj);
          endDate.setDate(endDate.getDate() + 7);
        } else if (req.query.date.toLowerCase() === 'thismonth') {
          // End of the month (first day of next month at 00:00:00)
          endDate = new Date(dateObj);
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          // For specific date, end is next day
          endDate = new Date(dateObj);
          endDate.setDate(endDate.getDate() + 1);
        }
        
        filter.createdAt = {
          $gte: dateObj,
          $lt: endDate
        };
        
        console.log(`Date filter range: ${dateObj.toISOString()} to ${endDate.toISOString()}`);
      } else {
        console.log(`Invalid date format: ${req.query.date}`);
        // Don't add invalid date to filter
      }
    }

    // Add assignedTo filter if provided
    if (req.query.assignedTo && req.query.assignedTo !== '') {
      // Handle special case when assignedTo is "true" (show all assigned complaints)
      if (req.query.assignedTo === 'true') {
        filter.assignedTo = { $exists: true, $ne: null };
      } 
      // Handle special case when assignedTo is "false" (show all unassigned complaints)
      else if (req.query.assignedTo === 'false') {
        filter.assignedTo = { $exists: false };
        // Also include null values
        filter.$or = [
          { assignedTo: { $exists: false } },
          { assignedTo: null }
        ];
      }
      // Otherwise, treat as a specific user ID
      else if (mongoose.Types.ObjectId.isValid(req.query.assignedTo)) {
        filter.assignedTo = req.query.assignedTo;
      }
      else {
        console.log(`Invalid assignedTo value: ${req.query.assignedTo}`);
        // Don't add invalid assignedTo to filter
      }
    }

    // For institution users, filter complaints based on their department and handled categories
    if (req.user.role === "institution") {
      // If the institution has specific categories they handle
      if (req.user.handledCategories && req.user.handledCategories.length > 0) {
        filter.category = { $in: req.user.handledCategories };
      } 
      // If the institution has a department, also filter by department
      else if (req.user.department) {
        // Try to find categories related to this department
        const Category = require("../models/Category");
        const departmentCategories = await Category.find({ 
          department: req.user.department 
        }).select('_id');
        
        if (departmentCategories && departmentCategories.length > 0) {
          // If we found categories for this department, filter by them
          filter.category = { 
            $in: departmentCategories.map(cat => cat._id) 
          };
        } else {
          // Fallback to filtering by institution type if it matches certain categories
          // This is a simplified mapping - you may need to adjust based on your actual categories
          const typeToCategory = {
            "police": ["Security", "Crime", "Emergency"],
            "healthcare": ["Health", "Medical", "Sanitation"],
            "education": ["Education", "School", "Learning"],
            "infrastructure": ["Roads", "Construction", "Utilities"],
            "agriculture": ["Farming", "Agriculture", "Land"]
          };
          
          if (req.user.institutionType && typeToCategory[req.user.institutionType]) {
            const categoryNames = typeToCategory[req.user.institutionType];
            const matchingCategories = await Category.find({
              name: { $in: categoryNames }
            }).select('_id');
            
            if (matchingCategories && matchingCategories.length > 0) {
              filter.category = { 
                $in: matchingCategories.map(cat => cat._id) 
              };
            }
          }
        }
      }
      
      // Also include complaints specifically assigned to this institution
      if (filter.category) {
        filter.$or = [
          { category: filter.category },
          { assignedTo: req.user._id }
        ];
        delete filter.category; // Remove the category filter as it's now in $or
      } else {
        filter.assignedTo = req.user._id;
      }
    }

    console.log("Filter for complaints query:", filter);

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sort options
    const sortOption = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    // Execute query with pagination and sorting
    const query = Complaint.find(filter)
      .populate("citizen", "name email")
      .populate("category", "name")
      .populate("assignedTo", "name department")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Complaint.countDocuments(filter);

  // Executing query
  const complaints = await query;

  // Format complaints to ensure all fields are defined
  const formattedComplaints = complaints.map(complaint => {
    const complaintObj = complaint.toObject();
    return {
      ...complaintObj,
      _id: complaintObj._id,
      title: complaintObj.title || "",
      description: complaintObj.description || "",
      status: complaintObj.status || "pending",
      priority: complaintObj.priority || "medium",
      createdAt: complaintObj.createdAt ? new Date(complaintObj.createdAt).toLocaleString() : "",
      
      // Handle populated fields that might be null
      citizen: complaintObj.citizen || { name: "Unknown", email: "" },
      category: complaintObj.category || { name: "Uncategorized" },
      assignedTo: complaintObj.assignedTo || null
    };
  });

  // Calculate pagination info
  const pagination = {};
  if (skip + complaints.length < total) {
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

  // Add cache headers to prevent duplicate requests
  res.set('Cache-Control', 'private, max-age=10'); // Cache for 10 seconds
  res.set('ETag', `W/"complaints-${total}-${page}-${limit}"`);
  
  // Send response
  res.status(200).json({
    success: true,
    count: complaints.length,
    pagination,
    total,
    totalPages: Math.ceil(total / limit),
    data: formattedComplaints
  });
  } catch (error) {
    console.error("Error in getComplaints:", error);
    return next(new ErrorResponse("Error retrieving complaints", 500));
  }
})

// @desc    Get complaint statistics for logged in citizen
// @route   GET /api/complaints/stats
// @access  Private (Citizen)
exports.getComplaintStats = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is citizen
    if (req.user.role !== "citizen") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    // Get total count
    const total = await Complaint.countDocuments({ citizen: req.user.id });
    
    // Get pending count
    const pending = await Complaint.countDocuments({ 
      citizen: req.user.id,
      status: "pending"
    });
    
    // Get in-progress count
    const inProgress = await Complaint.countDocuments({ 
      citizen: req.user.id,
      status: "in-progress"
    });
    
    // Get resolved count
    const resolved = await Complaint.countDocuments({ 
      citizen: req.user.id,
      status: "resolved"
    });
    
    // Get rejected count
    const rejected = await Complaint.countDocuments({ 
      citizen: req.user.id,
      status: "rejected"
    });

    // Add cache headers to prevent duplicate requests
    res.set('Cache-Control', 'private, max-age=60'); // Cache for 60 seconds
    res.set('ETag', `W/"complaint-stats-${req.user.id}"`);
    
    res.status(200).json({
      total,
      pending,
      inProgress,
      resolved,
      rejected
    });
  } catch (error) {
    console.error("Error retrieving complaint statistics:", error);
    return next(new ErrorResponse("Error retrieving complaint statistics", 500));
  }
});

// @desc    Get recent complaints for logged in citizen
// @route   GET /api/complaints/recent
// @access  Private (Citizen)
exports.getRecentComplaints = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is citizen
    if (req.user.role !== "citizen") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    // Get 5 most recent complaints for this citizen
    const complaints = await Complaint.find({ citizen: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category", "name nameKinyarwanda nameFrench")
      .populate("assignedTo", "name department")

    // Format complaints to ensure all fields are defined
    const formattedComplaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject();
      return {
        ...complaintObj,
        category: complaintObj.category || {},
        assignedTo: complaintObj.assignedTo || null,
        responses: complaintObj.responses || []
      };
    });

    // Add cache headers to prevent duplicate requests
    res.set('Cache-Control', 'private, max-age=60'); // Cache for 60 seconds
    res.set('ETag', `W/"recent-complaints-${req.user.id}"`);
    
    res.status(200).json(formattedComplaints);
  } catch (error) {
    console.error("Error retrieving recent complaints:", error);
    return next(new ErrorResponse("Error retrieving recent complaints", 500));
  }
});

// @desc    Get complaints for logged in citizen
// @route   GET /api/complaints/my-complaints
// @access  Private (Citizen)
exports.getMyComplaints = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is citizen
    if (req.user.role !== "citizen") {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    console.log("Original query parameters:", req.query);

    // Build filter object
    const filter = { citizen: req.user.id };

    // Add status filter if provided and not empty
    if (req.query.status && req.query.status !== '') {
      filter.status = req.query.status;
    }

    // Add category filter if provided and not empty
    if (req.query.category && req.query.category !== '') {
      filter.category = req.query.category;
    }

    // Add date filter if provided and not empty
    if (req.query.date && req.query.date !== '') {
      let dateObj;
      
      // Handle special date values
      if (req.query.date.toLowerCase() === 'today') {
        dateObj = new Date();
        dateObj.setHours(0, 0, 0, 0); // Start of today
      } else if (req.query.date.toLowerCase() === 'yesterday') {
        dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - 1);
        dateObj.setHours(0, 0, 0, 0); // Start of yesterday
      } else if (req.query.date.toLowerCase() === 'thisweek') {
        dateObj = new Date();
        const day = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
        dateObj = new Date(dateObj.setDate(diff));
        dateObj.setHours(0, 0, 0, 0); // Start of this week (Monday)
      } else if (req.query.date.toLowerCase() === 'thismonth') {
        dateObj = new Date();
        dateObj.setDate(1); // First day of current month
        dateObj.setHours(0, 0, 0, 0);
      } else {
        // Try to parse as YYYY-MM-DD format
        dateObj = new Date(req.query.date);
      }
      
      // Check if date is valid before adding to filter
      if (!isNaN(dateObj.getTime())) {
        console.log(`Valid date filter: ${dateObj.toISOString()}`);
        
        let endDate;
        
        // Set appropriate end date based on filter type
        if (req.query.date.toLowerCase() === 'today' || req.query.date.toLowerCase() === 'yesterday') {
          // End of the day (next day at 00:00:00)
          endDate = new Date(dateObj);
          endDate.setDate(endDate.getDate() + 1);
        } else if (req.query.date.toLowerCase() === 'thisweek') {
          // End of the week (next Monday at 00:00:00)
          endDate = new Date(dateObj);
          endDate.setDate(endDate.getDate() + 7);
        } else if (req.query.date.toLowerCase() === 'thismonth') {
          // End of the month (first day of next month at 00:00:00)
          endDate = new Date(dateObj);
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          // For specific date, end is next day
          endDate = new Date(dateObj);
          endDate.setDate(endDate.getDate() + 1);
        }
        
        filter.createdAt = {
          $gte: dateObj,
          $lt: endDate
        };
        
        console.log(`Date filter range: ${dateObj.toISOString()} to ${endDate.toISOString()}`);
      } else {
        console.log(`Invalid date format: ${req.query.date}`);
        // Don't add invalid date to filter
      }
    }

    console.log("Filter for complaints query:", filter);

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sort options
    const sortOption = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    // Execute query with pagination and sorting
    const complaints = await Complaint.find(filter)
      .populate("category", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Complaint.countDocuments(filter);

    // Format complaints to ensure all fields are defined
    const formattedComplaints = complaints.map(complaint => {
      const complaintObj = complaint.toObject();
      return {
        ...complaintObj,
        _id: complaintObj._id,
        title: complaintObj.title || "",
        description: complaintObj.description || "",
        status: complaintObj.status || "pending",
        priority: complaintObj.priority || "medium",
        createdAt: complaintObj.createdAt ? new Date(complaintObj.createdAt).toLocaleString() : "",
        
        // Handle populated fields that might be null
        category: complaintObj.category || { name: "Uncategorized" },
        
        // Include location information from individual fields
        location: {
          province: complaintObj.province || "",
          district: complaintObj.district || "",
          sector: complaintObj.sector || "",
          cell: complaintObj.cell || "",
          village: complaintObj.village || ""
        }
      };
    });

    // Calculate pagination info
    const pagination = {};
    if (skip + complaints.length < total) {
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

    // Add cache headers to prevent duplicate requests
    res.set('Cache-Control', 'private, max-age=10'); // Cache for 10 seconds
    res.set('ETag', `W/"complaints-${total}-${page}-${limit}"`);

    
    // Send response
    res.status(200).json({
      success: true,
      count: complaints.length,
      pagination,
      total,
      totalPages: Math.ceil(total / limit),
      complaints: formattedComplaints
    });
  } catch (error) {
    console.error("Error in getMyComplaints:", error);
    return next(new ErrorResponse("Error retrieving complaints", 500));
  }
})

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = asyncHandler(async (req, res, next) => {
  try {
    console.log(`Fetching complaint with ID: ${req.params.id}`);
    
    const complaint = await Complaint.findById(req.params.id)
      .populate("citizen", "name email phone nationalId")
      .populate("category", "name")
      .populate("assignedTo", "name department")
      .populate("responses.from", "name department")
    
    if (!complaint) {
      console.log(`Complaint not found with ID: ${req.params.id}`);
      return next(new ErrorResponse(`Complaint not found with id of ${req.params.id}`, 404));
    }
    
    console.log(`Found complaint: ${complaint.title}`);
    
    // Make sure user is complaint owner or admin or institution
    if (req.user.role !== "admin" && req.user.role !== "institution" && 
        complaint.citizen && complaint.citizen._id && complaint.citizen._id.toString() !== req.user.id) {
      console.log(`User ${req.user.id} is not authorized to access complaint ${req.params.id}`);
      return next(new ErrorResponse(`You are not authorized to access this complaint`, 403));
    }
    
    // Format the response data for better display and ensure all fields are defined
    const complaintObj = complaint.toObject();
    
    // Ensure all required fields are defined to prevent frontend errors
    const formattedComplaint = {
      ...complaintObj,
      title: complaintObj.title || "",
      description: complaintObj.description || "",
      status: complaintObj.status || "pending",
      priority: complaintObj.priority || "medium",
      createdAt: complaintObj.createdAt ? new Date(complaintObj.createdAt).toLocaleString() : "",
      updatedAt: complaintObj.updatedAt ? new Date(complaintObj.updatedAt).toLocaleString() : "",
      
      // Handle populated fields that might be null
      citizen: complaintObj.citizen || { name: "Unknown", email: "" },
      category: complaintObj.category || { name: "Uncategorized" },
      assignedTo: complaintObj.assignedTo || null,
      
      // Ensure responses array is defined and properly formatted
      responses: Array.isArray(complaintObj.responses) 
        ? complaintObj.responses.map(response => ({
            ...response,
            message: response.message || "",
            from: response.from || { name: "Unknown" },
            createdAt: response.createdAt ? new Date(response.createdAt).toLocaleString() : ""
          }))
        : []
    };
    
    // Add cache headers to prevent duplicate requests
    res.set('Cache-Control', 'private, max-age=10'); // Cache for 10 seconds
    res.set('ETag', `W/"complaint-${complaint._id}-${complaint.updatedAt}"`);
    
    res.status(200).json({
      success: true,
      data: formattedComplaint,
    });
  } catch (error) {
    console.error(`Error fetching complaint ${req.params.id}:`, error);
    return next(new ErrorResponse("Error retrieving complaint details", 500));
  }
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
