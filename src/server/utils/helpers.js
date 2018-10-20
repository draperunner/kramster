/**
 * @file Provides helper methods for all files
 * @author Mats Byrkjeland
 */

/**
 * Checks if a question's answers are "True" and "False"
 *
 * @param {Object} question - The question object.
 * @returns {boolean} True if the possible answers are only "true" and "false" in either English
 * or Norwegian. Returns false if not.
 */
const questionIsTrueFalse = (question) => {
  if (question.options.length !== 2) return false
  for (let k = 0; k < 2; k++) {
    const o = question.options[k].toLowerCase().replace(/\./g, '')
    if (o !== 'true' && o !== 'false'
        && o !== 'sant' && o !== 'usant'
        && o !== 'rett' && o !== 'galt'
    ) return false
  }

  return true
}

/**
 * Checks if all of the argument exams have only True/False questions.
 *
 * @param {Object[]} exams - An array of Exam objects
 * @param {Object[]} exams.questions - An array of Question objects
 *
 * @returns {boolean} - True if all of the argument exams have only True/False questions.
 */
const examsAreTrueFalse = (exams) => {
  for (let i = 0; i < exams.length; i++) {
    if (exams[i].mode && exams[i].mode.toLowerCase() !== 'tf') return false

    if (!exams[i].mode) {
      for (let j = 0; j < exams[i].questions.length; j++) {
        if (!questionIsTrueFalse(exams[i].questions[j])) return false
      }
    }
  }

  return true
}

/**
 * Shuffles an array.
 *
 * @param {Object[]} array - The array to shuffle.
 * @returns {Object[]} - The shuffled array.
 */
const shuffleArray = (array) => {
  const size = array.length
  for (let i = 0; i < size; i++) {
    const j = Math.round(i + ((size - 1 - i) * Math.random()))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

/** Takes a question and shuffles its answers
 *  If a question's answers are True and False, they will not be shuffled! "True" always first.
 *  Question object is of form {question: String, options: [String], answers: [Integer]}
 */
const shuffleAnswers = (question) => {
  if (questionIsTrueFalse(question)) return
  const numCorrectAnswers = question.answers.length
  const correctAnswers = []
  for (let k = 0; k < numCorrectAnswers; k++) {
    correctAnswers.push(question.options[question.answers[k]])
  }

  question.options = shuffleArray(question.options)
  const correctAnswerIndexes = []
  for (let l = 0; l < numCorrectAnswers; l++) {
    correctAnswerIndexes.push(question.options.indexOf(correctAnswers[l]))
  }

  question.answers = correctAnswerIndexes
}

/**
 * Shuffles a set of exams depending on the shuffle parameter
 * If a question's answers are True and False, they will not be shuffled! "True" always first.
 *
 * @param {Object[]} exams - An array of Exam objects
 * @param {string} param - Comma-separated string of either "q", "a", "mc" or "tf"
 */
const handleShuffle = (exams, param) => {
  if (param === 'none') return

  const undef = typeof param === 'undefined'
  const q = !undef && param.indexOf('q') > -1
  const a = !undef && param.indexOf('a') > -1
  const tf = !undef && param.indexOf('tf') > -1
  const mc = !undef && param.indexOf('mc') > -1

  // Check if all questions in all the exams are True/False. If not, treat them as Multiple Choice.
  const examsAreTF = examsAreTrueFalse(exams)

  // If param is undefined, shuffle questions. (Default behavior)
  // The following counts if param is defined.
  // If 'q' is not set, don't shuffle questions.
  // If 'q' and 'tf' is set, shuffle questions if all exams are True/False.
  // If 'q' and 'mc' is set, shuffle questions if not all exams are True/False.
  // Shuffle if 'q' is set, but neither of 'mc' or 'tf'.
  if (undef || (q && ((tf && examsAreTF) || (mc && !examsAreTF) || (!tf && !mc)))) {
    for (let i = 0; i < exams.length; i++) {
      exams[i].questions = shuffleArray(exams[i].questions)
    }
  }

  // If param is undefined, shuffle answers if NOT examsAreTF. (Default behavior)
  // The following counts if param is defined.
  // If 'a' is not set, don't shuffle answers.
  // If 'a' and 'tf' is set, shuffle answers if all exams are True/False.
  // If 'a' and 'mc' is set, shuffle answers if not all exams are True/False.
  // Shuffle if 'a' is set, but neither of 'mc' or 'tf'.
  if ((undef && !examsAreTF) || (a && ((tf && examsAreTF) || (mc && !examsAreTF) || (!tf && !mc)))) {
    for (let j = 0; j < exams.length; j++) {
      const exam = exams[j]
      for (let k = 0; k < exam.questions.length; k++) {
        shuffleAnswers(exam.questions[k])
      }
    }
  }
}

const isGrade = p => typeof p === 'string' && ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(p.toUpperCase()) > -1

const findSubstringEnclosedInParenthesis = s => /\(([^)]+)\)/.exec(s)

// Example argument: "Norges Teknisk-Naturvitenskaplige Universitet (NTNU)"
// Example return value: "NTNU"
const getSchoolAbbreviationFromFullName = (schoolName) => {
  // Find abbreviation enclosed in parenthesis
  const abb = findSubstringEnclosedInParenthesis(schoolName)
  if (abb) return abb[1]

  // If no abbreviation, make one from the leading letters in each word
  return schoolName.split(' ').map(e => e[0]).join('')
}

// Example argument: "TDT4136 Introduction to Artificial Intelligence"
// Example return value: "TDT4136"
const getCourseCodeFromFullName = (courseName) => {
  const splitName = courseName.split(' ')
  if (splitName.length === 1) return courseName.substring(0, 7)
  return courseName.split(' ')[0].toUpperCase()
}

const ascSort = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

const descSort = (a, b) => {
  if (a < b) return 1
  if (a > b) return -1
  return 0
}

export default {
  handleShuffle,
  isGrade,
  findSubstringEnclosedInParenthesis,
  getSchoolAbbreviationFromFullName,
  getCourseCodeFromFullName,
  ascSort,
  descSort,
}
