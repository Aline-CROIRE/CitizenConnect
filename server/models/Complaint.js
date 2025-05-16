const mongoose = require("mongoose")

const ComplaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select a category"],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved", "rejected"],
    default: "pending",
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: {
    type: String,
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["pending", "in-progress", "resolved", "rejected"],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],
  responses: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate complaint ID before saving
ComplaintSchema.pre("save", async function (next) {
  if (!this.complaintId) {
    // Get current year
    const year = new Date().getFullYear().toString().substr(-2)

    // Get the count of complaints in the current year
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lt: new Date(new Date().getFullYear() + 1, 0, 1),
      },
    })

    // Generate complaint ID: CMP-YY-XXXXX (e.g., CMP-23-00001)
    this.complaintId = `CMP-${year}-${(count + 1).toString().padStart(5, "0")}`
  }

  // Add initial status to history if new complaint
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: this.createdAt,
      updatedBy: this.citizen,
      comment: "Complaint submitted",
    })
  }

  next()
})

module.exports = mongoose.model("Complaint", ComplaintSchema)
