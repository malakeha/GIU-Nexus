// ============================================================
// authController.js  —  register / login / logout
// Used by authRoutes.js (Ali's file)
// ============================================================
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // FIXED: userModel.js instead of User

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { // FIXED: using id instead of _id for auth middleware compatibility
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

/**
 * POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['jobSeeker', 'recruiter'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be jobSeeker or recruiter' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // FIXED: Set status correctly based on role
    const status = role === 'recruiter' ? 'pending' : 'approved';

    // FIXED: Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role, status });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id:    user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // FIXED: manually check password with bcrypt since matchPassword doesn't exist
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: {
        _id:            user._id,
        name:           user.name,
        email:          user.email,
        role:           user.role,
        status:         user.status,
        profilePicture: user.profilePicture,
        skills:         user.skills,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 * Stateless — client discards token.
 */
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
