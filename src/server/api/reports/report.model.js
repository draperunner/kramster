const mongoose = require('mongoose')

// Schema
const reportSchema = new mongoose.Schema({
  exam: {
    school: String,
    course: String,
    name: String,
  },
  createdAt: String,
  history: [{
    _id: false, // Prevent mongoose from automatically creating ids for subdocuments
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    givenAnswer: String,
    wasCorrect: Boolean,
  }],
  score: Number,
  numQuestions: Number,
  percentage: Number,
  grade: String,
})

module.exports = mongoose.model('Report', reportSchema)
