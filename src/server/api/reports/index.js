import express from 'express'
import controller from './reports.controller'

const router = express.Router()

router.get('/', controller.getAllReports)
router.get('/:school', controller.getReportsForSchool)
router.get('/:school/:course', controller.getReportsForCourse)
router.get('/:school/:course/:exam', controller.getReportsForExam)
router.post('/add', controller.addReport)

module.exports = router
