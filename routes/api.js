/**
 * Created by mats on 30.04.15.
 */

var express = require('express');
var router = express.Router();

// Model
var Document = require('../models/document');

/**
 * API routing for Kramster!
 *
 * All underscores in url are replaced with spaces.
 *
 */

// Return all documents
router.get('/documents', function(req, res) {
    Document.find({}, function(err, docs) {
        res.json(docs);
    });
});

// Return all documents of given school
router.get('/documents/:school', function(req, res) {
    Document.find({
        "school": req.params.school.replace(/_/g, " ")},
        function(err, docs) {
            res.json(docs);
    });
});

// Return all documents of given course of given school
router.get('/documents/:school/:course', function(req, res) {
    Document.find({
        "school": req.params.school.replace(/_/g, " "),
        "course": req.params.course.replace(/_/g, " ")},
        function(err, docs) {
            res.json(docs);
    });
});

// Return (one) document by school,course and document name.
router.get('/documents/:school/:course/:document', function(req, res) {
    Document.findOne({
        "school": req.params.school.replace(/_/g, " "),
        "course": req.params.course.replace(/_/g, " "),
        "name": req.params.document.replace(/_/g, " ")},
        function(err, docs) {
            res.json(docs);
    });
});

// Return list of all distinct schools
router.get('/schools', function(req, res) {
    Document.distinct("school", function(err, docs) {
        res.json(docs);
    });
});

// Return list of all distinct courses at given school
router.get('/courses/:school', function(req, res) {
    Document.distinct("course",{school: req.params.school.replace(/_/g, " ")}, function(err, docs) {
        res.json(docs);
    });
});

module.exports = router;
