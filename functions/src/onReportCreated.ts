import * as functions from 'firebase-functions'
import { firestore, initializeApp } from 'firebase-admin'
import createBatcher, {
  createOperation,
  updateOperation,
} from 'firestore-batcher'

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface HistoryEntry {
  questionId: string
  givenAnswer: string
  wasCorrect: boolean
}

export interface Report {
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

export interface Exam {
  id: string
  school: string
  course: string
  name: string
  mode: 'TF' | 'MC'
  questions: Question[]
}

initializeApp()

const db = firestore()

const batcher = createBatcher(db, {
  onBatchCommited: (stats) =>
    console.log(
      `Batch committed ${stats.batchSize}. Num processed: ${stats.numberOfOperationsProcessed}`,
    ),
})

export const onReportCreated = functions.firestore
  .document('reports/{docId}')
  .onCreate(async (snap) => {
    try {
      const report = snap.data() as Report
      const { school, name, course } = report.exam

      const examRes = await db
        .collection('exams')
        .where('school', '==', school)
        .where('course', '==', course)
        .where('name', '==', name)
        .limit(1)
        .get()

      if (examRes.empty) {
        throw new Error(
          `Found no exam matching this report: ${school}, ${course}, ${name}`,
        )
      }

      report.history.forEach(({ questionId, ...questionStat }) => {
        const questionStatRef = examRes.docs[0].ref
          .collection('questions')
          .doc(questionId)
          .collection('history')
          .doc()
        batcher.add(createOperation(questionStatRef, questionStat))
      })

      const statsRef = db.collection('stats').doc('global')

      batcher.add(
        updateOperation(statsRef, {
          numReports: firestore.FieldValue.increment(1),
          totalScore: firestore.FieldValue.increment(report.score),
          [`grades.${report.grade}`]: firestore.FieldValue.increment(1),
          lastUpdated: firestore.Timestamp.now(),
        }),
      )

      await batcher.commit()
    } catch (error) {
      console.error(error)
    }
  })
