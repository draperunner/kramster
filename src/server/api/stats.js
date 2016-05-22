var express = require('express');
var router = express.Router();

var validator = require('./../utils/validator');
var errors = require('./../utils/errors');
var Report = require('../models/report');

// Return aggregated statistics for all reports
router.get('/', function (req, res) {
  Report.find({}, function (err, reports) {
    buildStats(err, reports, res);
  });
});

// Return aggregated statistics for a given school
router.get('/:school', function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    Report.find({ 'exam.school': validSchool }, function (err, reports) {
      buildStats(err, reports, res);
    });
  });
});

// Return aggregated statistics for a given course
router.get('/:school/:course', function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      Report.find({ 'exam.school': validSchool, 'exam.course': validCourse, },
        function (err, reports) {
          buildStats(err, reports, res);
        }
      );
    });
});

// Return aggregated statistics 'all' mode.
router.get('/:school/:course/all', function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      validator.validateNumber(req.query.numQuestions, function (isValid) {
        if (!isValid) return errors.invalidParam(res, 'numQuestions', req.query.numQuestions);
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
    });
});

// Return aggregated statistics for 'random' mode
router.get('/:school/:course/random', function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      validator.validateNumber(req.query.numQuestions, function (isValid) {
        if (!isValid) return errors.invalidParam(res, 'numQuestions', req.query.numQuestions);
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
    });
});

// Return aggregated statistics for a given exam
router.get('/:school/:course/:exam', function (req, res) {
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
});

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

module.exports = router;
