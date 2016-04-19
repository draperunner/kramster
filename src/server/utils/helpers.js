/**
 * Created by mats on 3/29/16.
 */

var express = require('express');

// Shuffles an array
var shuffleArray = function (array) {
  var size = array.length;
  for (var i = 0; i < size; i++) {
    var j = Math.round(i + (size - 1 - i) * Math.random());
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

// Takes a question and shuffles its answers
// Question object is of form {question: String, options: [String], answers: [Integer]}
var shuffleAnswers = function (question) {
  var numCorrectAnswers = question.answers.length;
  var correctAnswers = [];
  for (var k = 0; k < numCorrectAnswers; k++) {
    correctAnswers.push(question.options[question.answers[k]]);
  }

  question.options = shuffleArray(question.options);
  var correctAnswerIndexes = [];
  for (var l = 0; l < numCorrectAnswers; l++) {
    correctAnswerIndexes.push(question.options.indexOf(correctAnswers[l]));
  }

  question.answers = correctAnswerIndexes;
};

exports.handleShuffle = function (exams, shuffleParameter) {

  if (shuffleParameter === 'none') return;

  // Shuffle questions
  if (!shuffleParameter
      || shuffleParameter === 'q'
      || (shuffleParameter.split(',').length === 2
      && shuffleParameter.split(',').indexOf('q') > -1)) {
    for (var i = 0; i < exams.length; i++) {
      exams[i].questions = shuffleArray(exams[i].questions);
    }
  }

  // Shuffle answers
  if (!shuffleParameter
      || shuffleParameter === 'a'
      || (shuffleParameter.split(',').length === 2
      && shuffleParameter.split(',').indexOf('a') > -1)) {
    for (var j = 0; j < exams.length; j++) {
      var exam = exams[j];
      for (var k = 0; k < exam.questions.length; k++) {
        shuffleAnswers(exam.questions[k]);
      }
    }
  }
};

exports.isGrade = function (p) {
  return typeof p === 'string' && ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(p.toUpperCase()) > -1;
};

exports.findSubstringEnclosedInParenthesis = function (s) {
  const regExp = /\(([^)]+)\)/;
  return regExp.exec(s);
};
