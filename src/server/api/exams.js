/**
 * Created by mats on 30.04.15.
 */

var express = require('express');
var router = express.Router();

// Model
var Document = require('../models/document');

/**
 * API routing for Kramster!
 */

// TODO: Not hardcode this
var schoolAbbs = {
    ntnu: 'Norges Teknisk-Naturvitenskaplige Universitet (NTNU)',
};

var courseCodes = {
    tdt4136: 'TDT4136 Introduction to Artificial Intelligence',
};

router.get('/documents', function(req, res) {

    console.log(req.query);

    // MongoDB query object
    var query = {};

    if (req.query.school) {
        query.school = (schoolAbbs.hasOwnProperty(req.query.school)) ? schoolAbbs[req.query.school] : req.query.school;
    }
    if (req.query.course) {
        query.course = (courseCodes.hasOwnProperty(req.query.course)) ? courseCodes[req.query.course] : req.query.course;
    }
    if (req.query.document) {
        query.name = req.query.document;
    }

    Document.find(query, function(err, docs) {

        // Return a given number of random questions from given course of given school
        if (req.query.random) {
            var numberOfQuestions = req.query.randomNumber ? req.query.randomNumber : 10;
            var questions = [];

            for (var i = 0; i < docs.length; i++) {
                questions = questions.concat(docs[i]['questions']);
            }

            var n = Math.min(questions.length, parseInt(numberOfQuestions));

            var random_questions = [];
            for (var j = 0; j < n; j++) {
                var random_index = Math.floor(Math.random() * questions.length);
                random_questions.push(questions[random_index]);
                questions.splice(random_index, 1);
            }
            res.json(random_questions);
            return;
        }

        res.json(docs);
    });
});

// Return list of all distinct schools, courses or document names
router.get('/:item/list', function(req, res) {
    var item = req.params.item.substring(0, req.params.item.length - 1);
    if (item === 'document') item = 'name';
    Document.distinct(item, req.query, function(err, docs) {
        res.json(docs);
    });
});

module.exports = router;
