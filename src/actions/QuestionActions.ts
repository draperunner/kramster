import { Question, Stats } from '../interfaces'

export const ANSWER = 'ANSWER'
export const CLEAR = 'CLEAR'
export const LOAD_QUESTIONS = 'LOAD_QUESTIONS'
export const STATS_RECEIVED = 'STATS_RECEIVED'

interface GiveAnswer {
  type: 'ANSWER';
  payload: {
    givenAnswer: string;
  };
}
export const giveAnswer = (givenAnswer: string): GiveAnswer => ({
  type: ANSWER,
  payload: {
    givenAnswer,
  },
})

interface Clear {
  type: 'CLEAR';
}

export const clear = (): Clear => ({
  type: CLEAR,
})

interface LoadQuestions {
  type: 'LOAD_QUESTIONS';
  payload: {
    questions: Question[];
  };
}
export const loadQuestions = (questions: Question[]): LoadQuestions => ({
  type: LOAD_QUESTIONS,
  payload: {
    questions,
  },
})

interface StatsReceived {
  type: 'STATS_RECEIVED';
  payload: {
    stats: Stats;
  };
}

export const statsReceived = (stats: Stats): StatsReceived => ({
  type: STATS_RECEIVED,
  payload: {
    stats,
  },
})

export type QuestionAction = GiveAnswer | Clear | LoadQuestions | StatsReceived
