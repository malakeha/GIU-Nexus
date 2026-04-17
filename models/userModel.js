const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePicture: String,
  bio: String,
  skills: [String],
  role: String,
  status: String,
  createdAt: Date
});

module.exports = mongoose.model('User', userSchema);

email: { type: String, required: true, unique: true },

role: {
  type: String,
  enum: ['jobSeeker', 'recruiter', 'admin'],
  default: 'jobSeeker'
},

status: {
  type: String,
  enum: ['pending', 'approved', 'rejected']
}