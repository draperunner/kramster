var express = require('express');
var router = express.Router();
var controller = require('./reports.controller');

router.get('/', controller.getAllReports);
router.get('/:school', controller.getReportsForSchool);
router.get('/:school/:course', controller.getReportsForCourse);
router.get('/:school/:course/:exam', controller.getReportsForExam);
router.post('/add', controller.addReport);

module.exports = router;
