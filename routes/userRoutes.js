const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} = require("../controllers/usercontroller");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;
