// ============================================================
// userRoutes.js  —  JUDY's file
// All /api/v1/users and /api/v1/admin routes (Admin only).
// ============================================================
const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAdminStats,
} = require('../controllers/userController');

// All routes: must be logged in AND be admin
router.use(protect, authorize('admin'));

router.get('/',            getUsers);
router.get('/:id',         getUserById);
router.patch('/:id/status', updateUserStatus);
router.delete('/:id',      deleteUser);

// Admin stats — mounted at /api/v1/users but spec says /api/v1/admin/stats
// server.js also mounts this router at /api/v1/admin so both paths work
router.get('/stats', getAdminStats);

module.exports = router;