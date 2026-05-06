const User = require("../models/userModel");
const JobPost = require("../models/JobPost");
const Application = require("../models/applicationModel");
const bcrypt = require('bcryptjs');
// @desc    Get logged-in user profile
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update logged-in user profile
// @route   PATCH /api/v1/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "bio", "profilePicture"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin platform statistics
// @route   GET /api/v1/admin/stats
// @access  Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const usersByRole = {};
    usersByRoleRaw.forEach((r) => (usersByRole[r._id] = r.count));

    const jobsByStatusRaw = await JobPost.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const jobsByStatus = {};
    jobsByStatusRaw.forEach((r) => (jobsByStatus[r._id] = r.count));

    const appsByStatusRaw = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const appsByStatus = {};
    appsByStatusRaw.forEach((r) => (appsByStatus[r._id] = r.count));

    const topJobs = await Application.aggregate([
      { $group: { _id: "$job", applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobposts",
          localField: "_id",
          foreignField: "_id",
          as: "jobInfo",
        },
      },
      { $unwind: "$jobInfo" },
      {
        $project: {
          _id: 1,
          title: "$jobInfo.title",
          company: "$jobInfo.company",
          applicationCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: { usersByRole, jobsByStatus, appsByStatus, topJobs },
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Change password
// @route   PATCH /api/v1/profile/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};