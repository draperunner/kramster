const mongoose = require('mongoose');

// Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answers: [Number],
  history: [{
    _id: false, // Prevent mongoose from automatically creating ids for subdocuments
    givenAnswer: String,
    wasCorrect: Boolean,
  }],
});

module.exports = mongoose.model('Question', questionSchema);
