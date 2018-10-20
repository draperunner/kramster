import express from 'express'
import controller from './stats.controller'

const router = express.Router()

router.get('/', controller.getStatsForAll)
router.get('/:school', controller.getStatsForSchool)
router.get('/:school/:course', controller.getStatsForCourse)
router.get('/:school/:course/all', controller.getStatsForAllMode)
router.get('/:school/:course/random', controller.getStatsForRandomMode)
router.get('/:school/:course/hardest', controller.getStatsForHardestMode)
router.get('/:school/:course/:exam', controller.getStatsForExam)

module.exports = router
