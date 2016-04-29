/**
 * Created by mats on 30.04.15.
 */

var mongoose = require('mongoose');

// Schema
var examSchema = new mongoose.Schema({
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
