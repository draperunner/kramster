var express = require('express');
var router = express.Router();
var controller = require('./list.controller');

router.get('/schools', controller.getSchools);
router.get('/courses', controller.getCourses);
router.get('/courses/:school', controller.getCoursesAtSchool);
router.get('/exams', controller.getExams);
router.get('/exams/:school', controller.getExamsAtSchool);
router.get('/exams/:school/:course', controller.getExamsForCourseAtSchool);

module.exports = router;
