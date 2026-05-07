const crypto  = require('crypto');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/userModel');
const { sendResetEmail } = require('../services/emailService');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

// POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Always 200 — do not reveal whether email exists
    if (!user) {
      return res.status(200).json({ success: true, message: 'Password reset email sent' });
    }

    const rawToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken  = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${rawToken}`;

    try {
      await sendResetEmail(user.email, resetUrl);
    } catch (emailErr) {
      user.resetPasswordToken  = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      console.error('Email error:', emailErr.message);
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }

    return res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password            = await bcrypt.hash(password, salt);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = signToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};