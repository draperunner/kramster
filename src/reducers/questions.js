import {
  ANSWER, CLEAR, LOAD_QUESTIONS, STATS_RECEIVED,
} from '../actions/QuestionActions';

const EMPTY_QUESTION = { question: '', options: [], answers: [] };

const initialState = {
  answerGiven: false,
  currentQuestion: EMPTY_QUESTION,
  history: [],
  questions: [],
  stats: {},
};

const answerIsCorrect = (givenAnswer, state) => {
  const q = state.currentQuestion;
  return q && q.answers.indexOf(q.options.indexOf(givenAnswer)) >= 0;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ANSWER: {
      let { history, currentQuestion } = state;

      if (!state.answerGiven) {
        history = [
          ...state.history,
          {
            questionId: currentQuestion._id,
            givenAnswer: action.payload.givenAnswer,
            wasCorrect: answerIsCorrect(action.payload.givenAnswer, state),
          },
        ];
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
      return {
        ...initialState,
      };
    }
    case LOAD_QUESTIONS: {
      const { questions } = action.payload;
      const currentQuestion = state.questions.length === 0 ? questions[0] : state.currentQuestion;
      return {
        ...state,
        currentQuestion,
        questions,
      };
    }
    case STATS_RECEIVED: {
      const { stats } = action.payload;
      return {
        ...state,
        stats,
      };
    }
    default:
      return state;
  }
};
