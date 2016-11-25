var express = require('express');
var mongoose = require('mongoose');
var validator = require('./../../utils/validator');
var statsCtrl = require('./../stats/stats.controller');
var errors = require('./../../utils/errors');
var Report = require('./report.model');

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

  /**
   * @param {string} param - Either 'after' or 'before'.
   */
  var handleDate = function (param) {
    if (validator.isValidDate(reqQuery[param])) {
      if (!queryObject.createdAt) queryObject.createdAt = {};
      queryObject.createdAt[param === 'after' ? '$gt' : '$lt'] = reqQuery[param];
    } else if (typeof reqQuery[param] !== 'undefined') {
      errors.invalidDate(res, reqQuery[param]);
      return false;
    }

    return true;
  };

  // Handle 'after' and 'before' parameters
  if (!handleDate('after') || !handleDate('before')) return;

  // Generate query
  var query = Report.find(queryObject);

  // Sort
  validator.validateReportsSortParameter(reqQuery.sort, function (isValid, sortObject) {
    if (isValid) query = query.sort(sortObject);
  });

  // Limit reports
  if (reqQuery.limit && !isNaN(reqQuery.limit) && Number(reqQuery.limit) > 0) {
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
exports.getAllReports = function (req, res) {
  handleReportsQuery({}, req.query, res);
};

// Return reports for a given school
exports.getReportsForSchool = function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    handleReportsQuery({ 'exam.school': validSchool }, req.query, res);
  });
};

// Return reports for a given course
exports.getReportsForCourse = function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      handleReportsQuery(
        {
          'exam.school': validSchool,
          'exam.course': validCourse,
        }, req.query, res);
    });
};

// Return reports for a given exam
exports.getReportsForExam = function (req, res) {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    function (isValid, validSchool, validCourse, validExam) {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam);
      }

      handleReportsQuery(
        {
          'exam.school': validSchool,
          'exam.course': validCourse,
          'exam.name': validExam,
        }, req.query, res);
    });
};

// Add a new report
exports.addReport = function (req, res) {
  validator.validate(req.body.exam.school, req.body.exam.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam);
      }

      var report = new Report({
        exam: {
          school: validSchool,
          course: validCourse,
          name: req.body.exam.name,
        },
        createdAt: req.body.createdAt,
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

        // Update stats based on this report
        statsCtrl.updateStats(report);

      });

    });
};
