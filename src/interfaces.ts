export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export interface Question {
  id: string;
  question: string;
  options: string[];
  answers: number[];
  explanation?: string;
  stats?: {
    totalAnswers: number;
    totalCorrect: number;
  };
}

export interface HistoryEntry {
  questionId: string;
  givenAnswer: string;
  wasCorrect: boolean;
}
