export const ANSWER = 'ANSWER'
export const CLEAR = 'CLEAR'
export const LOAD_QUESTIONS = 'LOAD_QUESTIONS'
export const STATS_RECEIVED = 'STATS_RECEIVED'

export const giveAnswer = (givenAnswer) => ({
  type: ANSWER,
  payload: {
    givenAnswer,
  },
})

export const clear = () => ({
  type: CLEAR,
})

export const loadQuestions = (questions) => ({
  type: LOAD_QUESTIONS,
  payload: {
    questions,
  },
})

export const statsReceived = (stats) => ({
  type: STATS_RECEIVED,
  payload: {
    stats,
  },
})
