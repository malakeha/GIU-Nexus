const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: {
      type: [String],
      required: true,
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'internship'],
    },

    salary: {
      type: Number,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        'Frontend',
        'Backend',
        'AI/ML',
        'DevOps',
        'Data Engineering',
        'Other',
      ],
      default: 'Other',
    },

    totalSlots: {
      type: Number,
      min: 1,
      default: 1,
    },

    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobPost', jobPostSchema);