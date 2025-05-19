const mongoose = require("mongoose")

const LocationSchema = new mongoose.Schema({
  province: {
    type: String,
    required: [true, "Please add a province"],
  },
  district: {
    type: String,
    required: [true, "Please add a district"],
  },
  sector: {
    type: String,
    required: [true, "Please add a sector"],
  },
  cell: {
    type: String,
    required: [true, "Please add a cell"],
  },
  village: {
    type: String,
    required: [true, "Please add a village"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Location", LocationSchema)
