/**
 * Created by mats on 30.04.15.
 */

var express = require('express');
var router = express.Router();

// Model
var Document = require('../models/document');


// Return all documents
router.get('/documents', function(req, res) {
    Document.find({}, function(err, docs) {
        res.json(docs);
    });

});

// Return all documents of given school
router.get('/documents/:school', function(req, res) {
    Document.find({"school": req.params.school}, function(err, docs) {
        res.json(docs);
    });
});

// Return list of all distinct schools
router.get('/schools', function(req, res) {
    Document.distinct("school", function(err, docs) {
        res.json(docs);
    });
});

module.exports = router;