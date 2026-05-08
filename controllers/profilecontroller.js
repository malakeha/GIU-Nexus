
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const { extractSkillsFromBio } = require('./hfController');


exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'profilePicture'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};


exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Provide currentPassword and newPassword' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const match = await user.matchPassword(currentPassword);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};


exports.extractSkills = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.bio || user.bio.trim() === '') {
      return res.status(400).json({ success: false, message: 'Bio is empty. Update your profile first.' });
    }

    const extracted = await extractSkillsFromBio(user.bio);

    if (extracted === null) {
     
      return res.status(200).json({ success: true, skills: user.skills, extracted: user.skills });
    }

    user.skills = extracted;
    await user.save();

    return res.status(200).json({ success: true, skills: user.skills, extracted });
  } catch (err) {
    next(err);
  }
};