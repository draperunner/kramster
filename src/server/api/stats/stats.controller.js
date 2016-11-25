var express = require('express');
var validator = require('./../../utils/validator');
var errors = require('./../../utils/errors');
var Stats = require('./stats.model');

var updateStatsByKey = function (key, report) {
  var query = {
    key: key
  };
  if (key.name === 'random') {
    query.key.numQuestions = report.numQuestions;
  }

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
  Stats.findOne({key: {}}, function (err, stats) {
    buildStats(err, stats, res);
  });
};

// Return aggregated statistics for a given school
exports.getStatsForSchool = function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    Stats.findOne({ 'key.school': validSchool }, function (err, stats) {
      buildStats(err, stats, res);
    });
  });
};

// Return aggregated statistics for a given course
exports.getStatsForCourse = function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      Stats.findOne({ 'key.school': validSchool, 'key.course': validCourse },
        function (err, stats) {
          buildStats(err, stats, res);
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
        'key.school': validSchool,
        'key.course': validCourse,
        'key.name': 'all',
      };
      if (req.query.numQuestions) query.numQuestions = req.query.numQuestions;

      Stats.findOne(query,
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
        'key.school': validSchool,
        'key.course': validCourse,
        'key.name': 'random',
      };

      if (req.query.numQuestions) query['key.numQuestions'] = parseInt(req.query.numQuestions, 10);
      Stats.findOne(query,
        function (err, stats) {
          buildStats(err, stats, res);
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

      Stats.findOne(
        {
          'key.school': validSchool,
          'key.course': validCourse,
          'key.name': validExam,
        },
        function (err, stats) {
          buildStats(err, stats, res);
        }
      );
    });
};

// Function for building stats from an array of reports
var buildStats = function (err, stats, res) {
  const stat = stats.toObject();
  if (err) {
    res.status(500).send('Something went wrong.');
    return;
  }
  console.log('stats.grades');
  console.log(stats);

  if (!stats) {
    res.json({
      totalScore: 0,
      numReports: 0,
      averageScore: 0,
      grades: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
      },
    });
    return;
  }

  stat.grades = {
    A: stat.grades.A || 0,
    B: stat.grades.B || 0,
    C: stat.grades.C || 0,
    D: stat.grades.D || 0,
    E: stat.grades.E || 0,
    F: stat.grades.F || 0,
  }
  const averageScore = stats.numReports > 0 ? stats.totalScore / stats.numReports : 0;
  stat.averageScore = averageScore;
  res.json(stat);
};
