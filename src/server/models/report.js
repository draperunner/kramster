/**
 * Created by mats on 30.04.15.
 */

var mongoose = require('mongoose');

// Schema
var reportSchema = new mongoose.Schema({
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
