const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob
} = require("../controllers/jobcontroller");

router.get("/", getJobs);
router.post("/", createJob);
router.get("/:id", getJobById);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;