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

var validateSchoolOrCourse = function (itemType, item, callback) {
    var lower = item.toLowerCase();
    Exam.distinct(itemType, function(err, names) {
        // Check if param is valid full name
        var validFull = names.some(function (element) {
            if (element.toLowerCase() === lower) {
                return true;
            }
        });
        if (validFull) {
            callback(true, item);
            return;
        }
        // Check if param is valid abbreviation/code
        for (var i = 0; i < names.length; i++) {
            var abb = (itemType === 'school') ? getSchoolAbbreviation(names[i]) : getCourseCode(names[i]);
            if (abb && abb.toLowerCase() === lower) {
                callback(true, names[i]);
                return;
            }
        }
        callback(false);
    });
};

exports.school = function (school, callback) {
    validateSchoolOrCourse('school', school, callback);
};

exports.course = function (course, callback) {
    validateSchoolOrCourse('course', course, callback);
};
