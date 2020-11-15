export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Stats {
  averageScore: number
  grades: { [key in Grade]: number }
  lastUpdated: string
  numReports: number
  totalScore: number
  key: {
    school: string
    course: string
    name: string
  }
  numQuestions: number
}

export interface Question {
  id: string
  question: string
  options: string[]
  answers: number[]
  explanation?: string
  stats?: {
    totalAnswers: number
    totalCorrect: number
  }
}

export interface School {
  id: string
  name: string
  abbreviation: string
}

export interface Course {
  id: string
  name: string
  code: string
}

export interface Exam {
  id: string
  school: string
  course: string
  name: string
  mode: 'TF' | 'MC'
  questions: Question[]
}

export interface HistoryEntry {
  questionId: string
  givenAnswer: string
  wasCorrect: boolean
}

export interface SendableReport {
  exam: {
    school: string
    course: string
    name: string
  }
  createdAt: string
  history: HistoryEntry[]
  score: number
  numQuestions: number
  percentage: number
  grade: Grade
}

export interface Report extends SendableReport {
  _id: string
}
