const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  extractSkills
} = require("../controllers/profilecontroller");

router.get("/", getProfile);
router.patch("/", updateProfile);
router.patch("/change-password", changePassword);
router.post("/extract-skills", extractSkills);

module.exports = router;
