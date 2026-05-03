const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} = require("../controllers/usercontroller");

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

module.exports = router;