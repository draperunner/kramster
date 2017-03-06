import { ANSWER, CLEAR, LOAD_QUESTIONS, STATS_RECEIVED } from '../actions/QuestionActions';

const EMPTY_QUESTION = { question: '', options: [], answers: [] };

const initialState = {
  answerGiven: false,
  currentQuestion: EMPTY_QUESTION,
  history: [],
  questions: [],
  stats: {},
};

// Returns the current question
/*
const currentQuestion = state =>
  let question;

  // If questions still are being fetched, return an empty question.
  if (state.questions.length <= 0) {
    question = { question: '', options: [], answers: [] };
  } else if (state.answerGiven) {
    question = state.questions[state.history.length - 1];
  } else {
    question = state.questions[state.history.length];
  }

  // Render math
  const domElementsThatMightContainMath = document.getElementsByClassName('math');
  for (let i = 0; i < domElementsThatMightContainMath.length; i++) {
    renderMathInElement(domElementsThatMightContainMath[i]);
  }

   question;

 */

const answerIsCorrect = (givenAnswer, state) => {
  const q = state.currentQuestion;
  return q && q.answers.indexOf(q.options.indexOf(givenAnswer)) >= 0;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ANSWER: {
      let { history, currentQuestion } = state;

      if (!state.answerGiven) {
        history = [...state.history, answerIsCorrect(action.payload.givenAnswer, state)];
      } else {
        currentQuestion = state.questions[state.history.length];
      }

      return {
        ...state,
        answerGiven: !state.answerGiven,
        currentQuestion,
        history,
      };
    }
    case CLEAR: {
      return { ...initialState };
    }
    case LOAD_QUESTIONS: {
      const questions = action.payload.questions;
      const currentQuestion = state.questions.length === 0 ? questions[0] : state.currentQuestion;
      return {
        ...state,
        currentQuestion,
        questions,
      };
    }
    case STATS_RECEIVED: {
      const stats = action.payload.stats;
      return {
        ...state,
        stats,
      };
    }
    default:
      return state;
  }
};
