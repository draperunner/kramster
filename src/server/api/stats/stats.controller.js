var express = require('express');
var validator = require('./../../utils/validator');
var errors = require('./../../utils/errors');
var Report = require('./../reports/report.model');
var Stats = require('./stats.model');

var updateStatsByKey = function (key, report) {
  var query = {
    key: key
  };
  var updateObject = {
    $inc: {
      numReports: 1,
      totalScore: report.score
    },
    $set: {
      lastUpdated: report.createdAt
    }
  };
  updateObject.$inc['grades.' + report.grade] = 1;

  var options = {
    upsert: true
  };

  console.log(updateObject);
  Stats.findOneAndUpdate(query, updateObject, options,
    function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
      }
    }
  );
};

// This is called when a new Report is inserted
exports.updateStats = function (report) {
  updateStatsByKey({}, report);
  updateStatsByKey({ school: report.exam.school }, report);
  updateStatsByKey({ school: report.exam.school, course: report.exam.course }, report);
  updateStatsByKey({ school: report.exam.school, course: report.exam.course, name: report.exam.name }, report);
};

// Return aggregated statistics for all reports
exports.getStatsForAll = function (req, res) {
  Report.find({}, function (err, reports) {
    buildStats(err, reports, res);
  });
};

// Return aggregated statistics for a given school
exports.getStatsForSchool = function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    Report.find({ 'exam.school': validSchool }, function (err, reports) {
      buildStats(err, reports, res);
    });
  });
};

// Return aggregated statistics for a given course
exports.getStatsForCourse = function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      Report.find({ 'exam.school': validSchool, 'exam.course': validCourse, },
        function (err, reports) {
          buildStats(err, reports, res);
        }
      );
    });
};

// Return aggregated statistics 'all' mode.
exports.getStatsForAllMode =  function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      if (typeof req.query.numQuestions !== 'undefined' && isNaN(req.query.numQuestions)) {
        return errors.invalidParam(res, 'numQuestions', req.query.numQuestions);
      }

      var query = {
        'exam.school': validSchool,
        'exam.course': validCourse,
        'exam.name': 'all',
      };
      if (req.query.numQuestions) query.numQuestions = req.query.numQuestions;

      Report.find(query,
        function (err, reports) {
          buildStats(err, reports, res);
        }
      );
    });
};

// Return aggregated statistics for 'random' mode
exports.getStatsForRandomMode = function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      if (typeof req.query.numQuestions !== 'undefined' && isNaN(req.query.numQuestions)) {
        return errors.invalidParam(res, 'numQuestions', req.query.numQuestions);
      }

      var query = {
        'exam.school': validSchool,
        'exam.course': validCourse,
        'exam.name': 'random',
      };

      if (req.query.numQuestions) query.numQuestions = req.query.numQuestions;
      Report.find(query,
        function (err, reports) {
          buildStats(err, reports, res);
        }
      );
    });
};

// Return aggregated statistics for a given exam
exports.getStatsForExam = function (req, res) {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    function (isValid, validSchool, validCourse, validExam) {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam);
      }

      Report.find(
        {
          'exam.school': validSchool,
          'exam.course': validCourse,
          'exam.name': validExam,
        },
        function (err, reports) {
          buildStats(err, reports, res);
        }
      );
    });
};

// Function for building stats from an array of reports
var buildStats = function (err, reports, res) {
  if (err) res.status(500).send('Something went wrong.');

  var grades = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  var totalScore = 0;

  for (var i = 0; i < reports.length; i++) {
    var doc = reports[i].toObject();
    grades[doc.grade]++;
    totalScore += doc.score;
  }

  // Resulting JSON stats object to return
  var stats = {
    numReports: reports.length,
    grades: grades,
    totalScore: totalScore,
    averageScore: reports.length > 0 ? totalScore / reports.length : 0,
  };
  res.json(stats);
};
