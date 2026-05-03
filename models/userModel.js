const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      trim: true,
      default: '',
    },

    bio: {
      type: String,
      trim: true,
      default: '',
    },

    skills: {
      type: [String],
      default: [],
    },

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost',
      },
    ],

    role: {
      type: String,
      enum: ['jobSeeker', 'recruiter', 'admin'],
      default: 'jobSeeker',
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);