const mongoose = require('mongoose')
require('../questions/question.model')

// Schema
const examSchema = new mongoose.Schema({
  school: String,
  course: String,
  name: String,
  mode: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
})

module.exports = mongoose.model('Exam', examSchema)
