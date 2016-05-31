var express = require('express');
var router = express.Router();
var controller = require('./stats.controller');

router.get('/', controller.getStatsForAll);
router.get('/:school', controller.getStatsForSchool);
router.get('/:school/:course', controller.getStatsForCourse);
router.get('/:school/:course/all', controller.getStatsForAllMode);
router.get('/:school/:course/random', controller.getStatsForRandomMode);
router.get('/:school/:course/:exam', controller.getStatsForExam);

module.exports = router;
