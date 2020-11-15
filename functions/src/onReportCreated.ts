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
    successRate: number
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
  .document('reports/{reportId}')
  .onCreate(async (snap) => {
    try {
      const report = snap.data() as Report
      const { history, grade, score, numQuestions, exam } = report

      const questionIds = history.map((entry) => entry.questionId)

      const questionsSnap = await db
        .collection('questions')
        .where(firestore.FieldPath.documentId(), 'in', questionIds)
        .get()

      await Promise.all(
        questionsSnap.docs.map(async (questionDoc) => {
          const question = questionDoc.data() as Question
          const { id, ref } = questionDoc

          const stat = report.history.find(
            ({ questionId }) => questionId === id,
          )
          const totalAnswers = (question.stats?.totalAnswers || 0) + 1
          const totalCorrect =
            (question.stats?.totalCorrect || 0) + (stat?.wasCorrect ? 1 : 0)

          batcher.add(
            updateOperation(ref, {
              stats: {
                totalAnswers,
                totalCorrect,
                successRate: totalCorrect / totalAnswers,
              },
              random: Math.floor(Math.random() * 10000),
            }),
          )

          batcher.add(createOperation(ref.collection('history').doc(), stat))
        }),
      )

      const now = firestore.Timestamp.now()
      const globalStatsRef = db.collection('stats').doc('global')

      batcher.add(
        updateOperation(globalStatsRef, {
          numReports: firestore.FieldValue.increment(1),
          totalScore: firestore.FieldValue.increment(score),
          [`grades.${grade}`]: firestore.FieldValue.increment(1),
          lastUpdated: now,
        }),
      )

      const examName =
        exam.name === 'random' || exam.name === 'hardest'
          ? `${exam.name}${numQuestions}`
          : exam.name

      const examStatsSnap = await db
        .collection('stats')
        .where('school', '==', exam.school)
        .where('course', '==', exam.course)
        .where('exam', '==', examName)
        .limit(1)
        .get()

      if (examStatsSnap.empty) {
        batcher.add(
          createOperation(db.collection('stats').doc(), {
            grades: {
              A: 0,
              B: 0,
              C: 0,
              D: 0,
              E: 0,
              F: 0,
              [grade]: 1,
            },
            numReports: 1,
            totalScore: score,
            lastUpdated: now,
            school: report.exam.school,
            course: report.exam.course,
            exam: examName,
          }),
        )
      } else {
        const examStats = examStatsSnap.docs[0]
        batcher.add(
          updateOperation(examStats.ref, {
            numReports: firestore.FieldValue.increment(1),
            totalScore: firestore.FieldValue.increment(report.score),
            [`grades.${report.grade}`]: firestore.FieldValue.increment(1),
            lastUpdated: now,
          }),
        )
      }

      await batcher.commit()
    } catch (error) {
      console.error(error)
    }
  })
