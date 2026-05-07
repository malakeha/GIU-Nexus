const User        = require('../models/userModel');
const JobPost     = require('../models/JobPost');
const Application = require('../models/applicationModel');

// GET /api/v1/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role)   query.role   = role;
    if (status) query.status = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, total, page: Number(page), users });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/users/:id/status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved, rejected, or pending' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id, { status }, { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();
    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const usersByRoleRaw = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
    const usersByRole = {};
    usersByRoleRaw.forEach(r => { usersByRole[r._id] = r.count; });

    const jobsByStatusRaw = await JobPost.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const jobsByStatus = {};
    jobsByStatusRaw.forEach(r => { jobsByStatus[r._id] = r.count; });

    const appsByStatusRaw = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const appsByStatus = {};
    appsByStatusRaw.forEach(r => { appsByStatus[r._id] = r.count; });

    const topJobs = await Application.aggregate([
      { $group: { _id: '$job', applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'jobposts', localField: '_id', foreignField: '_id', as: 'jobInfo' } },
      { $unwind: '$jobInfo' },
      { $project: { _id: '$jobInfo._id', title: '$jobInfo.title', company: '$jobInfo.company', applicationCount: 1 } },
    ]);

    return res.status(200).json({ success: true, stats: { usersByRole, jobsByStatus, appsByStatus, topJobs } });
  } catch (err) {
    next(err);
  }
};
