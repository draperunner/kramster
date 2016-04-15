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

  // Handle range based parameters. They start with =, < or > followed by a number or string.
  var rangeParams = ['score', 'numQuestions', 'percentage', 'grade'];
  for (var i = 0; i < rangeParams.length; i++) {
    var paramName = rangeParams[i];
    if (!handleRangeBasedParameter(res, queryObject, paramName, reqQuery[paramName])) return;
  }

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

var handleRangeBasedParameter = function (res, queryObject, paramName, rawParam) {
  if (typeof rawParam === 'undefined') return true;
  var success = false;
  validator.validateRangeBasedParameter(paramName, rawParam, function (isValid, validParamObject) {
    if (!isValid) return errors.invalidParam(res, paramName, rawParam);
    queryObject[paramName] = validParamObject;
    success = true;
  });

  return success;
};

// Return all reports
router.get('/', function (req, res) {
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
