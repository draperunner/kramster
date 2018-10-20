import wilson from 'wilson-score'
import validator from './../../utils/validator'
import helpers from './../../utils/helpers'
import errors from './../../utils/errors'
import Exam from './../exams/exam.model'

const getRandomQuestionsFromExams = (exams, numberOfQuestions) => {
  // Merge all questions from resulting exams to one array
  let questions = []
  for (let i = 0; i < exams.length; i++) {
    questions = questions.concat(exams[i].questions)
  }

  const n = Math.min(questions.length, numberOfQuestions)

  // Randomly pick questions from questions array and put in random_questions array.
  const randomQuestions = []
  for (let j = 0; j < n; j++) {
    const randomIndex = Math.floor(Math.random() * questions.length)
    randomQuestions.push(questions[randomIndex])
    questions.splice(randomIndex, 1)
  }

  return randomQuestions
}

/**
 * Return the numberOfQuestions hardest questions from argument exams
 * @param  {Object[]} exams             Exams to fetch hardest questions from
 * @param  {Number} numberOfQuestions   Maximum number of questions to fetch.
 * @return {Object[]}                   The hardest questions from given exam
 */
const getHardestQuestionsFromExams = (exams, numberOfQuestions) => {
  // Merge all questions from resulting exams to one array
  let questions = []
  for (let i = 0; i < exams.length; i++) {
    questions = questions.concat(exams[i].questions)
  }

  /**
   * Calculate difficulty. A score of 0 is the easiest. A score of 1 is the hardest.
   * @param  {Object} question A question object to calculate difficulty for
   * @return {Number}          The difficulty value
   */
  const calculateDifficulty = (question) => {
    if (!question.stats || !question.stats.totalAnswers) {
      return 0
    }
    return wilson(question.stats.totalAnswers - question.stats.totalCorrect, question.stats.totalAnswers)
  }

  // Sort by decreasing difficulty
  const sortedQuestions = questions.slice().sort((q1, q2) => calculateDifficulty(q2) - calculateDifficulty(q1))

  // Return the numberOfQuestions hardest questions
  return sortedQuestions.slice(0, numberOfQuestions)
}

/**
 * Handles query parameters for any Exams API endpoint. Validates parameters and executes query.
 *
 * @param {Object} queryObject - The selector object for MongoDB's find method.
 * @param {Object} reqQuery - The query parameters from the HTTP request.
 * @param {Object} res - The Express response object.
 */
const handleExamsQuery = (queryObject, reqQuery, res) => {
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

  // Generate query
  let query = Exam.find(queryObject)

  // Sort
  validator.validateExamsSortParameter(reqQuery.sort, (isValid, sortObject) => {
    if (isValid) query = query.sort(sortObject)
  })

  // Limit exams (if not random=true)
  if (reqQuery.random !== 'true' && reqQuery.hardest !== 'true' && reqQuery.limit && Number(reqQuery.limit) > 0) {
    query = query.limit(Number(reqQuery.limit))
  }

  // Populate question objects
  query = query.populate('questions')

  // Execute query
  query.exec((err, exams) => {
    if (err) return errors.somethingWentWrong(res)

    if (reqQuery.random === 'true') {
      const numberOfQuestions = reqQuery.limit ? Number(reqQuery.limit) : 10
      const questions = getRandomQuestionsFromExams(exams, numberOfQuestions)
      helpers.handleShuffle([{ questions }], reqQuery.shuffle)
      res.json(questions)
    }
    else if (reqQuery.hardest === 'true') {
      const numberOfQuestions = reqQuery.limit ? Number(reqQuery.limit) : 10
      const questions = getHardestQuestionsFromExams(exams, numberOfQuestions)
      helpers.handleShuffle([{ questions }], reqQuery.shuffle)
      res.json(questions)
    }
    else {
      helpers.handleShuffle(exams, reqQuery.shuffle)
      res.json(exams)
    }

    return null
  })
}

/**
 * Returns all exams.
 */
exports.getAllExams = (req, res) => {
  handleExamsQuery({}, req.query, res)
}

/**
 * Returns all exams for the given school.
 */
exports.getExamsBySchool = (req, res) => {
  validator.validate(req.params.school, null, null, (isValid, validSchool) => {
    if (!isValid) return errors.noSchoolFound(res, req.params.school)
    return handleExamsQuery({ school: validSchool }, req.query, res)
  })
}

/**
 * Returns all exams for the given school and course.
 */
exports.getExamsByCourse = (req, res) => {
  validator.validate(req.params.school, req.params.course, null,
    (isValid, validSchool, validCourse) => {
      if (!isValid) return errors.noCourseFound(res, req.params.school, req.params.course)
      return handleExamsQuery({ school: validSchool, course: validCourse }, req.query, res)
    })
}

/**
 * Returns specific exam for the given school and course and with given name.
 */
exports.getExam = (req, res) => {
  validator.validate(req.params.school, req.params.course, req.params.exam,
    (isValid, validSchool, validCourse, validExam) => {
      if (!isValid) {
        return errors.noExamFound(res, req.params.school, req.params.course, req.params.exam)
      }

      return handleExamsQuery(
        {
          school: validSchool,
          course: validCourse,
          name: validExam,
        },
        req.query, res)
    })
}
