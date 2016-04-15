/**
 * Created by mats on 1/18/16.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var validator = require('./../utils/validator');
var errors = require('./../utils/errors');
var Report = require('../models/report');

var handleReportsQuery = function (queryObject, reqQuery, res) {

  // Handle mode parameter
  if (reqQuery.mode) {
    var lower = reqQuery.mode.toLowerCase();
    if (lower === 'tf') {
      queryObject.mode = 'TF';
    } else if (lower === 'mc') {
      queryObject.mode = 'MC';
    }
  }

  // Handle score parameter
  validator.validateScore(reqQuery.score, function (isValid, validScoreObject) {
    if (!isValid) return errors.invalidParam('score', reqQuery.score);
    if (operator === '=') queryObject.score = validScore;
    else if (operator === '<') queryObject.score = { $lt: validScore };
    else if (operator === '>') queryObject.score = { $gt: validScore };
  });

  // Handle numQuestions parameter
  validator.validateNumQuestions(reqQuery.numQuestions, function (isValid, operator, validNumQ) {
    if (!isValid) return errors.invalidParam('numQuestions', reqQuery.numQuestions);
    if (operator === '=') queryObject.numQuestions = validNumQ;
    else if (operator === '<') queryObject.numQuestions = { $lt: validNumQ };
    else if (operator === '>') queryObject.numQuestions = { $gt: validNumQ };
  });

  // Handle percentage parameter
  validator.validatePercentage(reqQuery.percentage, function (isValid, operator, validPercentage) {
    if (!isValid) return errors.invalidParam('percentage', reqQuery.percentage);
    if (operator === '=') queryObject.percentage = validPercentage;
    else if (operator === '<') queryObject.percentage = { $lt: validPercentage };
    else if (operator === '>') queryObject.percentage = { $gt: validPercentage };
  });

  // Handle grade parameter
  validator.validateGrade(reqQuery.grade, function (isValid, operator, validGrade) {
    if (!isValid) return errors.invalidParam('grade', reqQuery.grade);
    if (operator === '=') queryObject.grade = validGrade;
    else if (operator === '<') queryObject.grade = { $lt: validGrade };
    else if (operator === '>') queryObject.grade = { $gt: validGrade };
  });

  // After
  var afterParamIsValid = false;
  validator.validateDate(reqQuery.after, function (isValid, validDateAsObjectId) {
    if (!isValid) return;
    if (!queryObject._id) queryObject._id = {};
    queryObject._id.$gt = validDateAsObjectId;
    afterParamIsValid = true;
  });

  if (!afterParamIsValid && typeof reqQuery.after !== 'undefined') {
    return errors.invalidDate(res, reqQuery.after);
  }

  // Before
  var beforeParamIsValid = false;
  validator.validateDate(reqQuery.before, function (isValid, validDateAsObjectId) {
    if (!isValid) return;
    if (!queryObject._id) queryObject._id = {};
    queryObject._id.$lt = validDateAsObjectId;
    beforeParamIsValid = true;
  });

  if (!beforeParamIsValid && typeof reqQuery.before !== 'undefined') {
    return errors.invalidDate(res, reqQuery.before);
  }

  // Generate query
  var query = Report.find(queryObject);

  // Sort
  validator.validateReportsSortParameter(reqQuery.sort, function (isValid, sortObject) {
    if (isValid) query = query.sort(sortObject);
  });

  // Limit reports
  if (reqQuery.limit && Number(reqQuery.limit) > 0) {
    query = query.limit(Number(reqQuery.limit));
  }

  // Execute query
  query.exec(function (err, reports) {
    if (err) return errors.somethingWentWrong(res);
    res.json(reports);
  });

};

// Return all reports
router.get('/', function (req, res) {
  console.log(req.query);
  handleReportsQuery({}, req.query, res);
});

// Return reports for a given school
router.get('/:school', function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    handleReportsQuery({ 'document.school': validSchool }, req.query, res);
  });
});

// Return reports for a given course
router.get('/:school/:course', function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      handleReportsQuery(
        {
          'document.school': validSchool,
          'document.course': validCourse,
        }, req.query, res);
    });
});

// Return reports for a given document
router.get('/:school/:course/:exam', function (req, res) {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    function (isValid, validSchool, validCourse, validExam) {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.school);
      }

      handleReportsQuery(
        {
          'document.school': validSchool,
          'document.course': validCourse,
          'document.name': validExam,
        }, req.query, res);
    });
});

// Add a new report
router.post('/add', function (req, res) {
  var report = new Report({
    document: {
      school: req.body.document.school,
      course: req.body.document.course,
      documentName: req.body.document.documentName,
    },
    score: req.body.score,
    numQuestions: req.body.numQuestions,
    percentage: req.body.percentage,
    grade: req.body.grade,
  });
  report.save(function (err, post) {
    if (err) {
      res.status(500).send('Something went wrong.');
    }

    res.status(201).json(post);
  });
});

module.exports = router;
