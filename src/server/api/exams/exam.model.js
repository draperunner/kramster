const mongoose = require('mongoose');
const Question = require('../questions/question.model');

// Schema
const examSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  school: String,
  course: String,
  name: String,
  mode: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Exam', examSchema);
