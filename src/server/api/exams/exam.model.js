const mongoose = require('mongoose');

// Schema
const examSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  school: String,
  course: String,
  name: String,
  mode: String,
  questions: [
    {
      question: String,
      options: [String],
      answers: [Number],
    },
  ],
});

module.exports = mongoose.model('Exam', examSchema);
