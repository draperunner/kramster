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

// Example argument: "Norges Teknisk-Naturvitenskaplige Universitet (NTNU)"
// Example return value: "NTNU"
var getSchoolAbbreviationFromFullName = function (schoolName) {
  // Find abbreviation enclosed in parenthesis
  const abb = helpers.findSubstringEnclosedInParenthesis(schoolName);
  if (abb) return abb[1];

  // If no abbreviation, make one from the leading letters in each word
  return schoolName.split(' ').map(function (e) { return e[0]; }).join('');
};

// Example argument: "TDT4136 Introduction to Artificial Intelligence"
// Example return value: "TDT4136"
var getCourseCodeFromFullName = function (courseName) {
  var splitName = courseName.split(' ');
  if (splitName.length === 1) return courseName.substring(0, 7);
  return courseName.split(' ')[0].toUpperCase();
};

// type is either "schools" or "courses", names is the list of full names
var handleShortParameter = function (type, names) {
  var shorts = [];
  if (type === 'schools') {
    for (var i = 0; i < names.length; i++) {
      shorts.push(getSchoolAbbreviationFromFullName(names[i]));
    }
  } else if (type === 'courses') {
    for (var i = 0; i < names.length; i++) {
      shorts.push(getCourseCodeFromFullName(names[i]));
    }
  }

  return shorts;
};

// Return list of all distinct schools
router.get('/schools', function (req, res) {
  Exam.distinct('school', function (err, names) {
    if (err) {
      res.status(500).send('Something went wrong.');
      return;
    }

    res.json(req.query.short === 'true' ? handleShortParameter('schools', names) : names);
  });
});

// Return list of all distinct courses
router.get('/courses', function (req, res) {
  Exam.distinct('course', function (err, names) {
    if (err) {
      res.status(500).send('Something went wrong.');
      return;
    }

    res.json(req.query.short === 'true' ? handleShortParameter('courses', names) : names);
  });
});

// Return list of all courses at a given school
router.get('/courses/:school', function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.query.school);
    Exam.find({ school: validSchool }).distinct('course', function (err, names) {
      if (err) return errors.somethingWentWrong(res);
      res.json(req.query.short === 'true' ? handleShortParameter('courses', names) : names);
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

    res.json(names);
  });
});

// Return list of all exams at a given school
router.get('/exams/:school', function (req, res) {
  validator.validate(req.params.school, null, null, function (isValid, validSchool) {
    if (!isValid) return errors.noSchoolFound(res, req.params.school);
    Exam.find({ school: validSchool }).distinct('name', function (err, names) {
      if (err) return errors.somethingWentWrong(res);
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
          res.json(names);
        });
    });
});

module.exports = router;
