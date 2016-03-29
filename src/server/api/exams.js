/**
 * Created by mats on 30.04.15.
 */

var express = require('express');
var router = express.Router();

var Validator = require('./Validator');
var Exam = require('../models/exam');

var getRandomQuestionsFromExams = function (exams, numberOfQuestions) {
    // Merge all questions from resulting exams to one array
    var questions = [];
    for (var i = 0; i < exams.length; i++) {
        questions = questions.concat(exams[i]['questions']);
    }

    var n = Math.min(questions.length, numberOfQuestions);

    // Randomly pick questions from questions array and put in random_questions array.
    var random_questions = [];
    for (var j = 0; j < n; j++) {
        var random_index = Math.floor(Math.random() * questions.length);
        random_questions.push(questions[random_index]);
        questions.splice(random_index, 1);
    }
    return random_questions;
};

var handleExamsQuery = function (queryObject, reqQuery, res) {

    // Handle mode parameter
    if (reqQuery.mode) {
        var lower = reqQuery.mode.toLowerCase();
        if (lower === 'tf') {
            queryObject.mode = 'TF';
        }
        else if (lower === 'mc') {
            queryObject.mode = 'MC';
        }
    }

    // Generate query
    var query = Exam.find(queryObject);

    /*
    // TODO: Sort
    if (req.query.sort) {
        query = query.sort();
    }
    */

    // Limit exams (if not random=true)
    if (reqQuery.random !== 'true' && reqQuery.limit && Number(reqQuery.limit) > 0) {
        query = query.limit(Number(reqQuery.limit));
    }

    // Execute query
    query.exec(function (err, exams) {
        if (err) {
            res.status(500).send("500: Something went wrong.");
            return;
        }

        if (reqQuery.random !== true) {
            // TODO: Shuffle
            console.log(queryObject);
            res.json(exams);
        }

        else if (reqQuery.random === 'true') {
            var numberOfQuestions = reqQuery.limit ? Number(reqQuery.limit) : 10;
            res.json(getRandomQuestionsFromExams(exams, numberOfQuestions));
        }
    });

};

router.get('/exams', function(req, res) {
    handleExamsQuery({}, req.query, res);
});

router.get('/exams/:school', function(req, res) {
    Validator.validate(req.params.school, null, null, function (isValid, validSchool) {
        if (!isValid) {
            res.status(404).send('404: No school called "' + req.params.school + '".');
            return;
        }
        handleExamsQuery({school: validSchool}, req.query, res);
    });
});

router.get('/exams/:school/:course', function(req, res) {
    Validator.validate(req.params.school, req.params.course, null, function (isValid, validSchool, validCourse) {
        if (!isValid) {
            res.status(404).send('404: No course called "' + req.params.course + '" at school "' + req.params.school + '".');
            return;
        }
        handleExamsQuery({school: validSchool, course: validCourse}, req.query, res);
    });
});

router.get('/exams/:school/:course/:exam', function(req, res) {
    Validator.validate(req.params.school, req.params.course, req.params.exam, function (isValid, validSchool, validCourse, validExam) {
        if (!isValid) {
            res.status(404).send('404: No exam called "' + req.params.exam + '" for course "' + req.params.course + '" at school "' + req.params.school + '".');
            return;
        }
        handleExamsQuery({school: validSchool, course: validCourse, name: validExam}, req.query, res);
    });
});

module.exports = router;
