import validator from './../../utils/validator'
import errors from './../../utils/errors'
import helpers from './../../utils/helpers'
import Exam from './../exams/exam.model'

// type is either "schools" or "courses", names is the list of full names
const handleShortParameter = (type, names) => {
  if (type !== 'schools' && type !== 'courses') return names

  const shorts = []
  const func = type === 'schools'
    ? helpers.getSchoolAbbreviationFromFullName
    : helpers.getCourseCodeFromFullName

  for (let i = 0; i < names.length; i++) {
    shorts.push(func(names[i]))
  }

  return shorts
}

/**
 * Checks the 'sort' parameter and returns the appropriate sorting function for Array.prototype.sort
 *
 * @param {string} sortParam
 * @return {function} sortFunction
 */
const getSortFunction = (sortParam) => {
  if (sortParam === '-alphabetically') return helpers.descSort
  return helpers.ascSort
}

// Return list of all distinct schools
exports.getSchools = (req, res) => {
  Exam.distinct('school', (err, names) => {
    if (err) {
      res.status(500).send('Something went wrong.')
      return
    }

    const resultNames = req.query.short === 'true' ? handleShortParameter('schools', names) : names
    resultNames.sort(getSortFunction(req.query.sort))
    res.json(resultNames)
  })
}

// Return list of all distinct courses
exports.getCourses = (req, res) => {
  Exam.distinct('course', (err, names) => {
    if (err) {
      res.status(500).send('Something went wrong.')
      return
    }

    const resultNames = req.query.short === 'true' ? handleShortParameter('courses', names) : names
    resultNames.sort(getSortFunction(req.query.sort))
    res.json(resultNames)
  })
}

// Return list of all courses at a given school
exports.getCoursesAtSchool = (req, res) => {
  validator.validate(req.params.school, null, null, (isValid, validSchool) => {
    if (!isValid) {
      errors.noSchoolFound(res, req.query.school)
      return
    }
    Exam.find({ school: validSchool }).distinct('course', (err, names) => {
      if (err) {
        errors.somethingWentWrong(res)
        return
      }
      const resultNames = req.query.short === 'true' ? handleShortParameter('courses', names) : names
      resultNames.sort(getSortFunction(req.query.sort))
      res.json(resultNames)
    })
  })
}

// Return list of all distinct exams
exports.getExams = (req, res) => {
  Exam.distinct('name', (err, names) => {
    if (err) {
      res.status(500).send('Something went wrong.')
      return
    }

    names.sort(getSortFunction(req.query.sort))
    res.json(names)
  })
}

// Return list of all exams at a given school
exports.getExamsAtSchool = (req, res) => {
  validator.validate(req.params.school, null, null, (isValid, validSchool) => {
    if (!isValid) {
      errors.noSchoolFound(res, req.params.school)
      return
    }
    Exam.find({ school: validSchool }).distinct('name', (err, names) => {
      if (err) {
        return errors.somethingWentWrong(res)
      }
      return names.sort(getSortFunction(req.query.sort))
    })
  })
}

// Return list of all exams at a given school and course
exports.getExamsForCourseAtSchool = (req, res) => {
  validator.validate(req.params.school, req.params.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) {
        errors.noCourseFound(res, req.params.school, req.params.course)
        return
      }
      Exam.find({ school: validSchool, course: validCourse }).distinct('name',
        (err, names) => {
          if (err) return errors.somethingWentWrong(res)
          names.sort(getSortFunction(req.query.sort))
          return res.json(names)
        })
    })
}
