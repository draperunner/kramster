const mongoose = require('mongoose')

// Schema
const statsSchema = new mongoose.Schema({
  key: {
    school: String,
    course: String,
    name: String,
    numQuestions: Number,
  },
  lastUpdated: Date,
  totalScore: Number,
  numReports: Number,
  grades: {
    A: { type: Number },
    B: { type: Number },
    C: { type: Number },
    D: { type: Number },
    E: { type: Number },
    F: { type: Number },
  },
})


module.exports = mongoose.model('Statistics', statsSchema)
