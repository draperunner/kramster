import mongoose from 'mongoose'
import validator from './../../utils/validator'
import errors from './../../utils/errors'
import Question from '../questions/question.model'
import Report from './report.model'
import * as statsCtrl from './../stats/stats.controller'

const handleRangeBasedParameter = (res, queryObject, paramName, rawParam) => {
  if (typeof rawParam === 'undefined') return true
  let success = false
  validator.validateRangeBasedParameter(paramName, rawParam, (isValid, validParamObject) => {
    if (!isValid) return errors.invalidParam(res, paramName, rawParam)
    queryObject[paramName] = validParamObject
    success = true
    return true
  })

  return success
}

const handleReportsQuery = (queryObject, reqQuery, res) => {
  // Handle mode parameter
  if (reqQuery.mode) {
    const lower = reqQuery.mode.toLowerCase()
    if (lower === 'tf') {
      queryObject.mode = 'TF'
    }
    else if (lower === 'mc') {
      queryObject.mode = 'MC'
    }
  }

  // Handle range based parameters. They start with =, < or > followed by a number or string.
  const rangeParams = ['score', 'numQuestions', 'percentage', 'grade']
  for (let i = 0; i < rangeParams.length; i++) {
    const paramName = rangeParams[i]
    if (!handleRangeBasedParameter(res, queryObject, paramName, reqQuery[paramName])) return
  }

  /**
   * @param {string} param - Either 'after' or 'before'.
   */
  const handleDate = (param) => {
    if (validator.isValidDate(reqQuery[param])) {
      if (!queryObject.createdAt) queryObject.createdAt = {}
      queryObject.createdAt[param === 'after' ? '$gt' : '$lt'] = reqQuery[param]
    }
    else if (typeof reqQuery[param] !== 'undefined') {
      errors.invalidDate(res, reqQuery[param])
      return false
    }

    return true
  }

  // Handle 'after' and 'before' parameters
  if (!handleDate('after') || !handleDate('before')) return

  // Generate query
  let query = Report.find(queryObject)

  // Sort
  validator.validateReportsSortParameter(reqQuery.sort, (isValid, sortObject) => {
    if (isValid) query = query.sort(sortObject)
  })

  // Limit reports
  if (reqQuery.limit && !isNaN(reqQuery.limit) && Number(reqQuery.limit) > 0) {
    query = query.limit(Number(reqQuery.limit))
  }

  // Execute query
  query.exec((err, reports) => {
    if (err) {
      errors.somethingWentWrong(res)
    }
    else {
      res.json(reports)
    }
  })
}

// Return all reports
exports.getAllReports = (req, res) => {
  handleReportsQuery({}, req.query, res)
}

// Return reports for a given school
exports.getReportsForSchool = (req, res) => {
  validator.validate(req.params.school, null, null, (isValid, validSchool) => {
    if (!isValid) return errors.noSchoolFound(res, req.params.school)
    return handleReportsQuery({ 'exam.school': validSchool }, req.query, res)
  })
}

// Return reports for a given course
exports.getReportsForCourse = (req, res) => {
  validator.validate(req.params.school, req.params.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course)
      return handleReportsQuery(
        {
          'exam.school': validSchool,
          'exam.course': validCourse,
        }, req.query, res)
    })
}

// Return reports for a given exam
exports.getReportsForExam = (req, res) => {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    (isValid, validSchool, validCourse, validExam) => {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam)
      }

      return handleReportsQuery(
        {
          'exam.school': validSchool,
          'exam.course': validCourse,
          'exam.name': validExam,
        }, req.query, res)
    })
}

// Add a new report
exports.addReport = (req, res) => {
  validator.validate(req.body.exam.school, req.body.exam.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam)
      }

      const report = new Report({
        exam: {
          school: validSchool,
          course: validCourse,
          name: req.body.exam.name,
        },
        createdAt: req.body.createdAt,
        history: req.body.history.map(q => ({ ...q, questionId: mongoose.Types.ObjectId(q.questionId) })),
        score: req.body.score,
        numQuestions: req.body.numQuestions,
        percentage: req.body.percentage,
        grade: req.body.grade,
      })

      report.save((err, post) => {
        if (err) {
          res.status(500).send('Something went wrong.')
        }
        res.status(201).json(post)

        // Update stats based on this report
        statsCtrl.updateStats(report)
      })

      // Update each question with respective answer history
      report.history.forEach((question) => {
        const { givenAnswer, wasCorrect } = question
        Question.findOneAndUpdate(
          { _id: question.questionId },
          {
            $push: { history: { givenAnswer, wasCorrect } },
            $inc: { 'stats.totalAnswers': 1, 'stats.totalCorrect': wasCorrect ? 1 : 0 },
          }).exec()
      })

      return null
    })
}
