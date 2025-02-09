export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export interface Question {
  question: string;
  options: string[];
  answers: number[];
}

export interface HistoryEntry {
  givenAnswer: string;
  wasCorrect: boolean;
}
