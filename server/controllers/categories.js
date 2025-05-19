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
  try {
    let query = Category.find();
    
    // Add department filter if provided
    if (req.query.department) {
      query = query.find({ department: req.query.department });
    }

    // If not admin, only show active categories
    if (!req.user || req.user.role !== "admin") {
      query = query.find({ isActive: true });
    }

    // Sort by name or other field if specified
    const sortField = req.query.sort || "name";
    query = query.sort(sortField);

    const categories = await query;
    
    console.log(`Found ${categories.length} categories`);

    // Format the response data
    const formattedCategories = categories.map(category => ({
      ...category.toObject(),
      createdAt: new Date(category.createdAt).toLocaleString(),
    }));

    res.status(200).json({
      success: true,
      count: categories.length,
      data: formattedCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return next(new ErrorResponse("Error retrieving categories", 500));
  }
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
  try {
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
    });
  } catch (error) {
    console.error(`Error deleting category ${req.params.id}:`, error);
    return next(new ErrorResponse("Error deleting category", 500));
  }
})

// @desc    Get categories by department
// @route   GET /api/categories/department/:department
// @access  Public
exports.getCategoriesByDepartment = asyncHandler(async (req, res, next) => {
  try {
    const { department } = req.params;
    
    console.log(`Fetching categories for department: ${department}`);
    
    let query = Category.find({ department });
    
    // If not admin, only show active categories
    if (!req.user || req.user.role !== "admin") {
      query = query.find({ isActive: true });
    }
    
    const categories = await query.sort("name");
    
    console.log(`Found ${categories.length} categories for department: ${department}`);
    
    // Format the response data
    const formattedCategories = categories.map(category => ({
      ...category.toObject(),
      createdAt: new Date(category.createdAt).toLocaleString(),
    }));
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: formattedCategories,
    });
  } catch (error) {
    console.error(`Error fetching categories for department ${req.params.department}:`, error);
    return next(new ErrorResponse("Error retrieving categories", 500));
  }
})

// @desc    Get categories by institution type
// @route   GET /api/categories/institution-type/:type
// @access  Public
exports.getCategoriesByInstitutionType = asyncHandler(async (req, res, next) => {
  try {
    const { type } = req.params;
    
    console.log(`Fetching categories for institution type: ${type}`);
    
    // Map institution types to relevant departments or keywords
    const typeToKeywords = {
      "ministry": ["Ministry", "Government", "National"],
      "district": ["District", "Local Government", "Regional"],
      "sector": ["Sector", "Community", "Local"],
      "cell": ["Cell", "Community", "Local"],
      "police": ["Security", "Police", "Crime", "Emergency"],
      "healthcare": ["Health", "Medical", "Hospital", "Clinic", "Sanitation"],
      "education": ["Education", "School", "University", "Learning"],
      "infrastructure": ["Infrastructure", "Roads", "Construction", "Utilities", "Water", "Electricity"],
      "agriculture": ["Agriculture", "Farming", "Land", "Crops", "Livestock"],
      "other": []
    };
    
    let query;
    
    if (type && typeToKeywords[type] && typeToKeywords[type].length > 0) {
      // Create a regex pattern to match any of the keywords in name or description
      const keywordPattern = typeToKeywords[type].join("|");
      query = Category.find({
        $or: [
          { name: { $regex: keywordPattern, $options: 'i' } },
          { description: { $regex: keywordPattern, $options: 'i' } },
          { department: { $regex: keywordPattern, $options: 'i' } }
        ]
      });
    } else {
      // If no mapping or unknown type, return all categories
      query = Category.find();
    }
    
    // If not admin, only show active categories
    if (!req.user || req.user.role !== "admin") {
      query = query.find({ isActive: true });
    }
    
    const categories = await query.sort("name");
    
    console.log(`Found ${categories.length} categories for institution type: ${type}`);
    
    // Format the response data
    const formattedCategories = categories.map(category => ({
      ...category.toObject(),
      createdAt: new Date(category.createdAt).toLocaleString(),
    }));
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: formattedCategories,
    });
  } catch (error) {
    console.error(`Error fetching categories for institution type ${req.params.type}:`, error);
    return next(new ErrorResponse("Error retrieving categories", 500));
  }
})

module.exports = exports
