const mongoose = require('mongoose');

// Schema
const reportSchema = new mongoose.Schema({
  exam: {
    school: String,
    course: String,
    name: String,
  },
  createdAt: String,
  score: Number,
  numQuestions: Number,
  percentage: Number,
  grade: String,
});

module.exports = mongoose.model('Report', reportSchema);
