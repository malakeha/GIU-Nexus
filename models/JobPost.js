const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobPostSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['full-time', 'part-time', 'internship'] },
  salary: { type: Number },
  category: { type: String, enum: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"], default: "Other" },
  totalSlots: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('JobPost', jobPostSchema);
