const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaintStatus,
  addResponse,
  getComplaintStats,
  getRecentComplaints,
  getMyComplaints,
  deleteComplaint,
  assignComplaint,
} = require("../controllers/complaints")

const router = express.Router()

const { protect } = require("../middleware/auth")

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory for complaints");
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : 'unknown';
    cb(null, `photo_${userId}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

router.route("/")
  .get(protect, getComplaints)
  .post(protect, upload.single('image'), createComplaint)

router.route("/my-complaints").get(protect, getMyComplaints)
router.route("/stats").get(protect, getComplaintStats)
router.route("/recent").get(protect, getRecentComplaints)

router.route("/:id").get(protect, getComplaint).delete(protect, deleteComplaint)

router.route("/:id/status").put(protect, updateComplaintStatus)
router.route("/:id/responses").post(protect, addResponse)
router.route("/:id/assign").put(protect, assignComplaint)

module.exports = router
