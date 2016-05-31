/**
 * @file Provides validation methods
 * @author Mats Byrkjeland
 */

var express = require('express');
var mongoose = require('mongoose');
var Exam = require('./../api/exams/exam.model');
var helpers = require('./helpers');

var getCourseCode = function (courseName) {
  return courseName.split(' ')[0].toUpperCase();
};

var validateSchool = function (school, callback) {
  var lower = school.toLowerCase();
  Exam.distinct('school', function (err, schoolNames) {
    // Check if param is valid full name
    var validFull = schoolNames.some(function (element) {
      if (element.toLowerCase() === lower) {
        return true;
      }
    });

    if (validFull) {
      callback(true, school);
      return;
    }

    // Check if param is valid abbreviation/code
    for (var i = 0; i < schoolNames.length; i++) {
      var abb = helpers.getSchoolAbbreviationFromFullName(schoolNames[i]);
      if (abb && abb.toLowerCase() === lower) {
        callback(true, schoolNames[i]);
        return;
      }
    }

    callback(false);
  });
};

var validateCourse = function (school, course, callback) {
  validateSchool(school, function (isValid, validSchool) {

    // Invalid school
    if (!isValid) {
      callback(false);
      return;
    }

    var lower = course.toLowerCase();
    Exam.find({ school: validSchool }).distinct('course', function (err, courseNames) {
      // Server error
      if (err) {
        callback(false);
        return;
      }

      // Check if course param is valid full name
      var validFull = courseNames.some(function (element) {
        if (element.toLowerCase() === lower) {
          return true;
        }
      });

      if (validFull) {
        callback(true, validSchool, course);
        return;
      }

      // Check if param is valid abbreviation/code
      for (var i = 0; i < courseNames.length; i++) {
        var code = getCourseCode(courseNames[i]);
        if (code && code.toLowerCase() === lower) {
          callback(true, validSchool, courseNames[i]);
          return;
        }
      }

      callback(false);
    });
  });
};

var validateExam = function (school, course, exam, callback) {
  validateCourse(school, course, function (isValid, validSchool, validCourse) {

    // Invalid school or course
    if (!isValid) {
      callback(false);
      return;
    }

    var lower = exam.toLowerCase();
    Exam.find({ school: validSchool, course: validCourse }).distinct('name',
      function (err, examNames) {
        // Server error
        if (err) {
          callback(false);
          return;
        }

        // Check if exam param is valid full name
        var validFull = examNames.some(function (element) {
          if (element.toLowerCase() === lower) {
            return true;
          }
        });

        if (validFull) {
          callback(true, validSchool, validCourse, exam);
          return;
        }

        callback(false);
      });
  });
};

var validateSortParameter = function (validParams, sortParameter, callback) {
  if (!sortParameter) {
    callback(true, { _id: 1 });
    return;
  }

  var sortObject = {};
  var isValid = true;

  var sortItems = sortParameter.split(',');

  for (var i = 0; i < sortItems.length; i++) {
    if (validParams.indexOf(sortItems[i]) > -1) {
      sortObject[sortItems[i]] = 1;
    } else if (sortItems[i][0] === '-' && validParams.indexOf(sortItems[i].substring(1)) > -1) {
      sortObject[sortItems[i].substring(1) === 'created' ? '_id' : sortItems[i].substring(1)] = -1;
    } else {
      isValid = false;
    }
  }

  callback(isValid, sortObject);
};

exports.validate = function (school, course, exam, callback) {
  if (school && course && exam) {
    validateExam(school, course, exam, callback);
  }  else if (school && course) {
    validateCourse(school, course, callback);
  }  else if (school) {
    validateSchool(school, callback);
  }
};

exports.validateExamsSortParameter = function (sortParameter, callback) {
  var valids = ['created', 'school', 'course', 'name'];
  validateSortParameter(valids, sortParameter, callback);
};

exports.validateReportsSortParameter = function (sortParameter, callback) {
  var val = ['created', 'school', 'course', 'name', 'score', 'numQuestions', 'percentage', 'grade'];
  validateSortParameter(val, sortParameter, callback);
};

exports.isValidDate = function (dateParameter) {
  return dateParameter && !isNaN(Date.parse(dateParameter));
};

exports.validateRangeBasedParameter = function (paramName, param, callback) {
  var objectToReturn = {};

  // Check for multiple values (an interval)
  var params = param.split(',');

  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    var operator = (p[0] === '>' || p[0] === '<') ? p[0] : '=';
    var paramValue = (operator === '=') ? p : p.substring(1);

    var isInvalidGrade = paramName === 'grade' && !helpers.isGrade(paramValue);
    var isInvalidNumber = paramName !== 'grade' && isNaN(paramValue);

    if (isInvalidGrade || isInvalidNumber) {
      callback(false);
      return;
    }

    if (paramName === 'grade') paramValue = paramValue.toUpperCase();

    // If an exact value is given (no lead operator), only this is considered.
    if (operator === '=') {
      callback(true, paramValue);
      return;
    }

    // If same operator appears multiple times, only first is considered.
    if (operator === '<' && !objectToReturn.$lt) objectToReturn.$lt = paramValue;
    else if (operator === '>'  && !objectToReturn.$gt) objectToReturn.$gt = paramValue;

  }

  callback(true, objectToReturn);
};
