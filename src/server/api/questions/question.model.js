const mongoose = require('mongoose')

// Schema
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answers: [Number],
  explanation: String,
  history: [{
    _id: false, // Prevent mongoose from automatically creating ids for subdocuments
    givenAnswer: String,
    wasCorrect: Boolean,
  }],
  stats: {
    totalAnswers: Number, // Should equal history.length
    totalCorrect: Number, // Should equal history.filter(q => wasCorrect).length
  },
})

module.exports = mongoose.model('Question', questionSchema)
