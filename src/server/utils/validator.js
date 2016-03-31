/**
 * Created by mats on 3/28/16.
 */

var express = require('express');
var Exam = require('../models/exam');

var getSchoolAbbreviation = function (schoolName) {
    const regExp = /\(([^)]+)\)/;
    const result = regExp.exec(schoolName);
    if (result) return result[1];
};

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
            var abb = getSchoolAbbreviation(schoolNames[i]);
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
        Exam.find({school: validSchool}).distinct('course', function (err, courseNames) {
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
        Exam.find({school: validSchool, course: validCourse}).distinct('name', function (err, examNames) {
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

exports.validate = function (school, course, exam, callback) {
    if (school && course && exam) {
        validateExam(school, course, exam, callback);
    }
    else if (school && course) {
        validateCourse(school, course, callback);
    }
    else if (school) {
        validateSchool(school, callback);
    }
};
