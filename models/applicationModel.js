const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPost',
    required: true,
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.index({ user: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
