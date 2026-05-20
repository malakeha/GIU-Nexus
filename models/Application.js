const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
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
      default: '',
    },

    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, createdAt: -1 });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
