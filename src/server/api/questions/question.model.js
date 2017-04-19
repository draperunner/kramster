const mongoose = require('mongoose');

// Schema
const questionSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  question: String,
  options: [String],
  answers: [Number],
});

module.exports = mongoose.model('Question', questionSchema);
