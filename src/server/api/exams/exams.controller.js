var express = require('express');
var validator = require('./../../utils/validator');
var helpers = require('./../../utils/helpers');
var errors = require('./../../utils/errors');
var Exam = require('./../exams/exam.model');

var getRandomQuestionsFromExams = function (exams, numberOfQuestions) {
  // Merge all questions from resulting exams to one array
  var questions = [];
  for (var i = 0; i < exams.length; i++) {
    questions = questions.concat(exams[i].questions);
  }

  var n = Math.min(questions.length, numberOfQuestions);

  // Randomly pick questions from questions array and put in random_questions array.
  var randomQuestions = [];
  for (var j = 0; j < n; j++) {
    var randomIndex = Math.floor(Math.random() * questions.length);
    randomQuestions.push(questions[randomIndex]);
    questions.splice(randomIndex, 1);
  }

  return randomQuestions;
};

/**
 * Handles query parameters for any Exams API endpoint. Validates parameters and executes query.
 *
 * @param {Object} queryObject - The selector object for MongoDB's find method.
 * @param {Object} reqQuery - The query parameters from the HTTP request.
 * @param {Object} res - The Express response object.
 */
var handleExamsQuery = function (queryObject, reqQuery, res) {

  // Handle mode parameter
  if (reqQuery.mode) {
    var lower = reqQuery.mode.toLowerCase();
    if (lower === 'tf') {
      queryObject.mode = 'TF';
    } else if (lower === 'mc') {
      queryObject.mode = 'MC';
    }
  }

  // Generate query
  var query = Exam.find(queryObject);

  // Sort
  validator.validateExamsSortParameter(reqQuery.sort, function (isValid, sortObject) {
    if (isValid) query = query.sort(sortObject);
  });

  // Limit exams (if not random=true)
  if (reqQuery.random !== 'true' && reqQuery.limit && Number(reqQuery.limit) > 0) {
    query = query.limit(Number(reqQuery.limit));
  }

  // Execute query
  query.exec(function (err, exams) {
    if (err) return errors.somethingWentWrong(res);

    if (reqQuery.random !== 'true') {
      helpers.handleShuffle(exams, reqQuery.shuffle);
      res.json(exams);
    } else if (reqQuery.random === 'true') {
      var numberOfQuestions = reqQuery.limit ? Number(reqQuery.limit) : 10;
      var questions = getRandomQuestionsFromExams(exams, numberOfQuestions);
      helpers.handleShuffle([{ questions: questions }], reqQuery.shuffle);
      res.json(questions);
    }
  });

};

/**
 * Returns all exams.
 */
exports.getAllExams = function (req, res) {
  handleExamsQuery({}, req.query, res);
};

/**
 * Returns all exams for the given school.
 */
exports.getExamsBySchool = function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    handleExamsQuery({ school: validSchool }, req.query, res);
  });
};

/**
 * Returns all exams for the given school and course.
 */
exports.getExamsByCourse = function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      handleExamsQuery({ school: validSchool, course: validCourse }, req.query, res);
    });
};

/**
 * Returns specific exam for the given school and course and with given name.
 */
exports.getExam = function (req, res) {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    function (isValid, validSchool, validCourse, validExam) {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam);
      }

      handleExamsQuery(
        {
          school: validSchool,
          course: validCourse,
          name: validExam,
        },
        req.query, res);
    });
};
