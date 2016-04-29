/**
 * Created by mats on 3/28/16.
 */

var express = require('express');
var router = express.Router();
var validator = require('./../utils/validator');
var errors = require('./../utils/errors');
var helpers = require('./../utils/helpers');

// Model
var Exam = require('../models/exam');

// type is either "schools" or "courses", names is the list of full names
var handleShortParameter = function (type, names) {
  if (type !== 'schools' && type !== 'courses') return names;

  var shorts = [];
  var func = type === 'schools'
    ? helpers.getSchoolAbbreviationFromFullName
    : helpers.getCourseCodeFromFullName;

  for (var i = 0; i < names.length; i++) {
    shorts.push(func(names[i]));
  }

  return shorts;
};

/**
 * Checks the 'sort' parameter and returns the appropriate sorting function for Array.prototype.sort
 *
 * @param {string} sortParam
 * @return {function} sortFunction
 */
var getSortFunction = function (sortParam) {
  if (sortParam === '-alphabetically') return helpers.descSort;
  return helpers.ascSort;
};

// Return list of all distinct schools
router.get('/schools', function (req, res) {
  Exam.distinct('school', function (err, names) {
    if (err) {
      res.status(500).send('Something went wrong.');
      return;
    }

    var resultNames = req.query.short === 'true' ? handleShortParameter('schools', names) : names;
    resultNames.sort(getSortFunction(req.query.sort));
    res.json(resultNames);
  });
});

// Return list of all distinct courses
router.get('/courses', function (req, res) {
  Exam.distinct('course', function (err, names) {
    if (err) {
      res.status(500).send('Something went wrong.');
      return;
    }

    var resultNames = req.query.short === 'true' ? handleShortParameter('courses', names) : names;
    resultNames.sort(getSortFunction(req.query.sort));
    res.json(resultNames);
  });
});

// Return list of all courses at a given school
router.get('/courses/:school', function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.query.school);
    Exam.find({ school: validSchool }).distinct('course', function (err, names) {
      if (err) return errors.somethingWentWrong(res);
      var resultNames = req.query.short === 'true' ? handleShortParameter('courses', names) : names;
      resultNames.sort(getSortFunction(req.query.sort));
      res.json(resultNames);
    });
  });
});

// Return list of all distinct exams
router.get('/exams', function (req, res) {
  Exam.distinct('name', function (err, names) {
    if (err) {
      res.status(500).send('Something went wrong.');
      return;
    }

    names.sort(getSortFunction(req.query.sort));
    res.json(names);
  });
});

// Return list of all exams at a given school
router.get('/exams/:school', function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    Exam.find({ school: validSchool }).distinct('name', function (err, names) {
      if (err) return errors.somethingWentWrong(res);
      names.sort(getSortFunction(req.query.sort));
      res.json(names);
    });
  });
});

// Return list of all exams at a given school and course
router.get('/exams/:school/:course', function (req, res) {
  validator.validate(req.params.school, req.params.course, null,
    function (isValid, validSchool, validCourse) {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course);
      Exam.find({ school: validSchool, course: validCourse }).distinct('name',
        function (err, names) {
          if (err) return errors.somethingWentWrong(res);
          names.sort(getSortFunction(req.query.sort));
          res.json(names);
        });
    });
});

module.exports = router;
