import { Action } from '../actions'

import {
  ANSWER, CLEAR, LOAD_QUESTIONS, STATS_RECEIVED,
} from '../actions/QuestionActions'

import { Question, HistoryEntry, Stats } from '../interfaces'

const EMPTY_QUESTION = {
  _id: 'dummy', question: '', options: [], answers: [],
}

export interface State {
  answerGiven: boolean;
  currentQuestion: Question;
  history: HistoryEntry[];
  questions: Question[];
  stats: Stats | undefined;
}

const initialState: State = {
  answerGiven: false,
  currentQuestion: EMPTY_QUESTION,
  history: [],
  questions: [],
  stats: undefined,
}

const answerIsCorrect = (givenAnswer: string, currentQuestion: Question): boolean => {
  const q = currentQuestion
  return q && q.answers.indexOf(q.options.indexOf(givenAnswer)) >= 0
}

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ANSWER: {
      let { history, currentQuestion } = state

      if (!state.answerGiven) {
        history = [
          ...state.history,
          {
            questionId: currentQuestion._id,
            givenAnswer: action.payload.givenAnswer,
            wasCorrect: answerIsCorrect(action.payload.givenAnswer, state.currentQuestion),
          },
        ]
      }
      else {
        currentQuestion = state.questions[state.history.length]
      }

      return {
        ...state,
        answerGiven: !state.answerGiven,
        currentQuestion,
        history,
      }
    }
    case CLEAR: {
      return {
        ...initialState,
      }
    }
    case LOAD_QUESTIONS: {
      const { questions } = action.payload
      const currentQuestion = state.questions.length === 0 ? questions[0] : state.currentQuestion
      return {
        ...state,
        currentQuestion,
        questions,
      }
    }
    case STATS_RECEIVED: {
      const { stats } = action.payload
      console.log('stats received:', stats)

      return {
        ...state,
        stats,
      }
    }
    default:
      return state
  }
}
