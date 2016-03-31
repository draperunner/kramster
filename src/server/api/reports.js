/**
 * Created by mats on 1/18/16.
 */

var express = require('express');
var router = express.Router();

// Model
var Report = require('../models/report');

// Return all reports
router.get('/', function (req, res) {
  Report.find({}, function (err, reports) {
    res.json(reports);
  });
});

// Return reports for a given school
router.get('/:school', function (req, res) {
  Report.find({ 'document.school': req.params.school.replace(/_/g, ' ') }, function (err, reports) {
    res.json(reports);
  });
});

// Return reports for a given course
router.get('/:school/:course', function (req, res) {
  Report.find({
    'document.school': req.params.school.replace(/_/g, ' '),
    'document.course': req.params.course.replace(/_/g, ' '),
  },
        function (err, reports) {
          res.json(reports);
        }
    );
});

// Return reports for a given document
router.get('/:school/:course/:document', function (req, res) {
  Report.find({
    'document.school': req.params.school.replace(/_/g, ' '),
    'document.course': req.params.course.replace(/_/g, ' '),
    'document.documentName': req.params.document.replace(/_/g, ' '),
  },
        function (err, reports) {
          res.json(reports);
        }
    );
});

// Add a new report
router.post('/add', function (req, res) {
  var report = new Report({
    document: {
      school: req.body.document.school,
      course: req.body.document.course,
      documentName: req.body.document.documentName,
    },
    score: req.body.score,
    numQuestions: req.body.numQuestions,
    percentage: req.body.percentage,
    grade: req.body.grade,
  });
  report.save(function (err, post) {
    if (err) {
      res.status(500).send('Something went wrong.');
    }

    res.status(201).json(post);
  });
});

module.exports = router;
