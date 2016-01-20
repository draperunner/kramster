/**
 * Created by mats on 1/18/16.
 */

var express = require('express');
var router = express.Router();

// Model
var Report = require('../models/report');

// Return all documents
router.get('/all', function(req, res) {
    Report.find({}, function(err, docs) {
        res.json(docs);
    });
});

router.post('/add', function(req, res) {
    var report = new Report({
        document: {
            school: req.body.document.school,
            course: req.body.document.course,
            documentName: req.body.document.documentName
        },
        score: req.body.score,
        numQuestions: req.body.numQuestions,
        percentage: req.body.percentage,
        grade: req.body.grade
    });
    report.save(function (err, post) {
        if (err) {
            res.status(500).send("Something went wrong.");
        }
        res.status(201).json(post);
    });
});

module.exports = router;
