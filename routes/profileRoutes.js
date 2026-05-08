
const express  = require('express');
const router   = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  extractSkills,
} = require('../controllers/profileController');


router.use(protect);

router.get('/',               getProfile);
router.patch('/',             updateProfile);
router.patch('/change-password', changePassword);
router.post('/extract-skills', authorize('jobSeeker'), extractSkills);

module.exports = router;