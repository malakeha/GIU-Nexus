const express = require("express");
const router = express.Router();

const {
  getMyApplications,
  updateApplicationStatus,
  getAllApplications
} = require("../controllers/applicationcontroller");

const { protect, authorize } = require("../middleware/auth");

// GET /api/v1/applications/my
// Job Seeker only
router.get(
  "/my",
  protect,
  authorize("jobSeeker"),
  getMyApplications
);

// PATCH /api/v1/applications/:id/status
// Recruiter only
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);

// GET /api/v1/applications
// Admin only
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllApplications
);

module.exports = router;