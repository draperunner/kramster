export const ANSWER = 'ANSWER';
export const LOAD_QUESTIONS = 'LOAD_QUESTIONS';

export const giveAnswer = givenAnswer => ({
  type: ANSWER,
  payload: {
    givenAnswer,
  },
});

export const loadQuestions = questions => ({
  type: LOAD_QUESTIONS,
  payload: {
    questions,
  },
});
