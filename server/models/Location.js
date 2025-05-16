const mongoose = require("mongoose")

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a location name"],
    trim: true,
    unique: true,
    maxlength: [100, "Location name cannot be more than 100 characters"],
  },
  type: {
    type: String,
    enum: ["city", "district", "neighborhood", "other"],
    default: "city",
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

module.exports = mongoose.model("Location", LocationSchema)
