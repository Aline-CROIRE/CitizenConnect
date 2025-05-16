const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    trim: true,
    unique: true,
    maxlength: [50, "Category name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Category", CategorySchema)
