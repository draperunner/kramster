var express = require('express');
var router = express.Router();
var controller = require('./exams.controller');

router.get('/', controller.getAllExams);
router.get('/:school', controller.getExamsBySchool);
router.get('/:school/:course', controller.getExamsByCourse);
router.get('/:school/:course/:exam', controller.getExam);

module.exports = router;
