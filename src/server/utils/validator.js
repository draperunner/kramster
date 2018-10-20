/**
 * @file Provides validation methods
 * @author Mats Byrkjeland
 */

import Exam from './../api/exams/exam.model'
import helpers from './helpers'

const getCourseCode = courseName => courseName.split(' ')[0].toUpperCase()

const validateSchool = (school, callback) => {
  const lower = school.toLowerCase()
  Exam.distinct('school', (err, schoolNames) => {
    // Check if param is valid full name
    const validFull = schoolNames.some(element => element.toLowerCase() === lower)

    if (validFull) {
      callback(true, school)
      return
    }

    // Check if param is valid abbreviation/code
    for (let i = 0; i < schoolNames.length; i++) {
      const abb = helpers.getSchoolAbbreviationFromFullName(schoolNames[i])
      if (abb && abb.toLowerCase() === lower) {
        callback(true, schoolNames[i])
        return
      }
    }

    callback(false)
  })
}

const validateCourse = (school, course, callback) => {
  validateSchool(school, (isValid, validSchool) => {
    // Invalid school
    if (!isValid) {
      callback(false)
      return
    }

    const lower = course.toLowerCase()
    Exam.find({ school: validSchool }).distinct('course', (err, courseNames) => {
      // Server error
      if (err) {
        callback(false)
        return
      }

      // Check if course param is valid full name
      const validFull = courseNames.some(element => element.toLowerCase() === lower)

      if (validFull) {
        callback(true, validSchool, course)
        return
      }

      // Check if param is valid abbreviation/code
      for (let i = 0; i < courseNames.length; i++) {
        const code = getCourseCode(courseNames[i])
        if (code && code.toLowerCase() === lower) {
          callback(true, validSchool, courseNames[i])
          return
        }
      }

      callback(false)
    })
  })
}

const validateExam = (school, course, exam, callback) => {
  validateCourse(school, course, (isValid, validSchool, validCourse) => {
    // Invalid school or course
    if (!isValid) {
      callback(false)
      return
    }

    const lower = exam.toLowerCase()
    Exam.find({ school: validSchool, course: validCourse }).distinct('name',
      (err, examNames) => {
        // Server error
        if (err) {
          callback(false)
          return
        }

        // Check if exam param is valid full name
        const validFull = examNames.some(element => element.toLowerCase() === lower)

        if (validFull) {
          callback(true, validSchool, validCourse, exam)
          return
        }

        callback(false)
      })
  })
}

const validateSortParameter = (validParams, sortParameter, callback) => {
  if (!sortParameter) {
    callback(true, { _id: 1 })
    return
  }

  const sortObject = {}
  let isValid = true

  const sortItems = sortParameter.split(',')

  for (let i = 0; i < sortItems.length; i++) {
    if (validParams.indexOf(sortItems[i]) > -1) {
      sortObject[sortItems[i]] = 1
    }
    else if (sortItems[i][0] === '-' && validParams.indexOf(sortItems[i].substring(1)) > -1) {
      sortObject[sortItems[i].substring(1) === 'created' ? '_id' : sortItems[i].substring(1)] = -1
    }
    else {
      isValid = false
    }
  }

  callback(isValid, sortObject)
}

exports.validate = (school, course, exam, callback) => {
  if (school && course && exam) {
    validateExam(school, course, exam, callback)
  }
  else if (school && course) {
    validateCourse(school, course, callback)
  }
  else if (school) {
    validateSchool(school, callback)
  }
}

exports.validateExamsSortParameter = (sortParameter, callback) => {
  const valids = ['created', 'school', 'course', 'name']
  validateSortParameter(valids, sortParameter, callback)
}

exports.validateReportsSortParameter = (sortParameter, callback) => {
  const val = ['created', 'school', 'course', 'name', 'score', 'numQuestions', 'percentage', 'grade']
  validateSortParameter(val, sortParameter, callback)
}

exports.isValidDate = dateParameter => dateParameter && !isNaN(Date.parse(dateParameter))

exports.validateRangeBasedParameter = (paramName, param, callback) => {
  const objectToReturn = {}

  // Check for multiple values (an interval)
  const params = param.split(',')

  for (let i = 0; i < params.length; i++) {
    const p = params[i]
    const operator = (p[0] === '>' || p[0] === '<') ? p[0] : '='
    let paramValue = (operator === '=') ? p : p.substring(1)

    const isInvalidGrade = paramName === 'grade' && !helpers.isGrade(paramValue)
    const isInvalidNumber = paramName !== 'grade' && isNaN(paramValue)

    if (isInvalidGrade || isInvalidNumber) {
      callback(false)
      return
    }

    if (paramName === 'grade') paramValue = paramValue.toUpperCase()

    // If an exact value is given (no lead operator), only this is considered.
    if (operator === '=') {
      callback(true, paramValue)
      return
    }

    // If same operator appears multiple times, only first is considered.
    if (operator === '<' && !objectToReturn.$lt) objectToReturn.$lt = paramValue
    else if (operator === '>' && !objectToReturn.$gt) objectToReturn.$gt = paramValue
  }

  callback(true, objectToReturn)
}
