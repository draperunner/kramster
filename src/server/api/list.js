/**
 * Created by mats on 3/28/16.
 */

var express = require('express');
var router = express.Router();
var Validator = require('./Validator');

// Model
var Exam = require('../models/exam');

// Return list of all distinct schools
router.get('/schools', function(req, res) {
    Exam.distinct('school', function(err, docs) {
        if (err) {
            res.status(500).send("Something went wrong.");
            return;
        }
        res.json(docs);
    });
});

// Return list of all courses at a given school
router.get('/courses/:school', function (req, res) {
    Validator.validate(req.params.school, null, null, function (isValid, validSchool) {
        if (!isValid) {
            res.status(404).send('404: No school called "' + req.params.school + '".');
            return;
        }
        Exam.find({school: validSchool}).distinct('course', function(err, docs) {
            if (err) {
                res.status(500).send("Something went wrong.");
                return;
            }
            res.json(docs);
        });
    });
});

// Return list of all exams at a given school and course
router.get('/exams/:school/:course', function (req, res) {
    Validator.validate(req.params.school, req.params.course, null, function (isValid, validSchool, validCourse) {
        if (!isValid) {
            res.status(404).send('404: No course called "' + req.params.course + '" at school "' + req.params.school + '".');
            return;
        }
        Exam.find({school: validSchool, course: validCourse}).distinct('name', function(err, docs) {
            if (err) {
                res.status(500).send("Something went wrong.");
                return;
            }
            res.json(docs);
        });
    });
});

module.exports = router;
