const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
  },
  role: {
    type: String,
    enum: ["citizen", "institution", "admin"],
    default: "citizen",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  // Rwanda-specific fields
  nationalId: {
    type: String,
    match: [/^\d{16}$/, "Please provide a valid 16-digit National ID number"],
    sparse: true,
  },
  phone: {
    type: String,
    match: [/^(\+?250|0)?7[2389]\d{7}$/, "Please provide a valid Rwandan phone number"],
  },
  // Institution-specific fields
  department: {
    type: String,
    trim: true,
  },
  institutionType: {
    type: String,
    enum: [
      "ministry",
      "district",
      "sector",
      "cell",
      "police",
      "healthcare",
      "education",
      "infrastructure",
      "agriculture",
      "other",
    ],
  },
  // Categories that this institution can handle
  handledCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "institution" // Only institutions need approval
    },
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      return this.role === "institution" ? "pending" : "approved"
    },
  },
  rejectionReason: {
    type: String,
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
