import express from 'express'
import controller from './list.controller'

const router = express.Router()

router.get('/schools', controller.getSchools)
router.get('/courses', controller.getCourses)
router.get('/courses/:school', controller.getCoursesAtSchool)
router.get('/exams', controller.getExams)
router.get('/exams/:school', controller.getExamsAtSchool)
router.get('/exams/:school/:course', controller.getExamsForCourseAtSchool)

module.exports = router
