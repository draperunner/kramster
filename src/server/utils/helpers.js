/**
 * @file Provides helper methods for all files
 * @author Mats Byrkjeland
 */

var express = require('express');

/**
 * Checks if all of the argument exams have only True/False questions.
 *
 * @param {Object[]} exams - An array of Exam objects
 * @param {Object[]} exams.questions - An array of Question objects
 */
var examsAreTrueFalse = function (exams) {
  for (var i = 0; i < exams.length; i++) {
    if (exams[i].mode && exams[i].mode.toLowerCase() !== 'tf') return false;
    if (exams[i].mode && exams[i].mode.toLowerCase() === 'tf') continue;

    if (!exams[i].mode) {
      for (var j = 0; j < exams[i].questions.length; j++) {
        var q = exams[i].questions[j];
        if (q.options.length !== 2) return false;
        for (var k = 0; k < 2; k++) {
          var o = q.options[k].toLowerCase().replace(/\./g, '');

          // TODO: Find a way to check this that is not hardcoded (especially for random mode)
          if (o !== 'true' && o !== 'false' && o !== 'sant' && o !== 'usant') return false;
        }
      }
    }
  }

  return true;
};

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

/**
 * Shuffles a set of exams depending on the shuffle parameter
 *
 * @param {Object[]} exams - An array of Exam objects
 * @param {string} param - Comma-separated string of either "q", "a", "mc" or "tf"
 */
exports.handleShuffle = function (exams, param) {

  if (param === 'none') return;

  var undef = typeof param === 'undefined';
  var q = !undef && param.indexOf('q') > -1;
  var a = !undef && param.indexOf('a') > -1;
  var tf = !undef && param.indexOf('tf') > -1;
  var mc = !undef && param.indexOf('mc') > -1;

  // Check if all questions in all the exams are True/False. If not, treat them as Multiple Choice.
  var examsAreTF = examsAreTrueFalse(exams);

  // If param is undefined, shuffle questions. (Default behavior)
  // The following counts if param is defined.
  // If 'q' is not set, don't shuffle questions.
  // If 'q' and 'tf' is set, shuffle questions if all exams are True/False.
  // If 'q' and 'mc' is set, shuffle questions if not all exams are True/False.
  // Shuffle if 'q' is set, but neither of 'mc' or 'tf'.
  if (undef || q && (tf && examsAreTF || mc && !examsAreTF || !tf && !mc)) {
    for (var i = 0; i < exams.length; i++) {
      exams[i].questions = shuffleArray(exams[i].questions);
    }
  }

  // If param is undefined, shuffle answers if NOT examsAreTF. (Default behavior)
  // The following counts if param is defined.
  // If 'a' is not set, don't shuffle answers.
  // If 'a' and 'tf' is set, shuffle answers if all exams are True/False.
  // If 'a' and 'mc' is set, shuffle answers if not all exams are True/False.
  // Shuffle if 'a' is set, but neither of 'mc' or 'tf'.
  if (undef && !examsAreTF || a && (tf && examsAreTF || mc && !examsAreTF || !tf && !mc)) {
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

// Example argument: "Norges Teknisk-Naturvitenskaplige Universitet (NTNU)"
// Example return value: "NTNU"
exports.getSchoolAbbreviationFromFullName = function (schoolName) {
  // Find abbreviation enclosed in parenthesis
  const abb = this.findSubstringEnclosedInParenthesis(schoolName);
  if (abb) return abb[1];

  // If no abbreviation, make one from the leading letters in each word
  return schoolName.split(' ').map(function (e) { return e[0]; }).join('');
};

// Example argument: "TDT4136 Introduction to Artificial Intelligence"
// Example return value: "TDT4136"
exports.getCourseCodeFromFullName = function (courseName) {
  var splitName = courseName.split(' ');
  if (splitName.length === 1) return courseName.substring(0, 7);
  return courseName.split(' ')[0].toUpperCase();
};
