import { MongoClient, ObjectId } from 'mongodb'
import * as admin from 'firebase-admin'
import createBatcher, { createOperation } from 'firestore-batcher'
import { firestore } from 'firebase-admin'

const USE_EMULATOR = false
const MIGRATE_HISTORY = false // reports, question answer stats, etc.

const MONGODB_URL = 'mongodb://localhost:27017/kramster'
const FIREBASE_SERVICE_ACCOUNT = process.env.KRAMSTER_SERVICE_ACCOUNT || ''
const PROJECT = 'kramster'

interface Question {
  _id: ObjectId
  question: string
  answers: number[]
  options: string[]
  history: Array<{
    givenAnswer: string
    wasCorrect: boolean
  }>
  stats: {
    totalCorrect: number
    totalAnswers: number
  }
}

interface Exam {
  _id: ObjectId
  questions: ObjectId[]
  school: string
  course: string
  name: string
  mode: string
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

interface Report {
  _id: ObjectId
  exam: {
    school: string
    course: string
    name: string
  }
  createdAt: string
  history?: Array<{
    questionId: ObjectId
    givenAnswer: string
    wasCorrect: boolean
  }>
  score: number
  numQuestions: number
  percentage: number
  grade: Grade
}

interface Stats {
  grades: Record<Grade, number>
  numReports: number
  totalScore: number
  lastUpdated: firestore.Timestamp
  school?: string
  course?: string
  exam?: string
}

const app = admin.initializeApp({
  projectId: PROJECT,
  credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
})
const dbFirestore = app.firestore()
const batcher = createBatcher(dbFirestore, {
  onBatchCommited: ({
    numberOfOperationsProcessed,
    numberOfOperationsQueued,
  }) =>
    console.log(
      `Batch completed. Processed: ${numberOfOperationsProcessed}. Queued: ${numberOfOperationsQueued}: ${
        (100 * numberOfOperationsProcessed) /
        (numberOfOperationsProcessed + numberOfOperationsQueued)
      } %`,
    ),
})

if (USE_EMULATOR) {
  dbFirestore.settings({
    host: 'localhost:8080',
    ssl: false,
  })
}

function getLatestTimestamp(
  a: firestore.Timestamp,
  b: firestore.Timestamp,
): firestore.Timestamp {
  return a.valueOf() > b.valueOf() ? a : b
}

function updateStats(stats: Stats, report: Report): Stats {
  try {
    firestore.Timestamp.fromDate(new Date(report.createdAt))
  } catch (error) {
    console.log('report:')
    console.log(report)
    throw error
  }
  return {
    ...stats,
    numReports: stats.numReports + 1,
    totalScore: stats.totalScore + report.score,
    lastUpdated: getLatestTimestamp(
      stats.lastUpdated,
      firestore.Timestamp.fromDate(new Date(report.createdAt)),
    ),
  }
}

function isNotNull<T>(thing: T | null): thing is T {
  return thing !== null
}

MongoClient.connect(MONGODB_URL, async (err, client) => {
  if (err) {
    console.error(err)
    client.close()
    app.delete()
    return
  }

  try {
    console.log('Connected successfully to server')

    const mongo = client.db()

    const exams = await mongo.collection<Exam>('exams').find().toArray()

    const schools: Array<{ abbreviation: string; name: string }> = []
    const courses: Array<{ code: string; school: string; name: string }> = []

    for (const exam of exams) {
      const { _id, course, mode = 'MC', name, school } = exam

      const questions = (
        await Promise.all(
          exam.questions.map((qId) =>
            mongo.collection<Question>('questions').findOne({ _id: qId }),
          ),
        )
      ).filter(isNotNull)

      const examRef = dbFirestore.collection('exams').doc(_id.toHexString())
      const [courseCode, ...courseName] = course.split(' ')

      const schoolCode = school.match(/\((.+)\)/)?.[1] || ''
      const schoolName = school.slice(0, school.indexOf('(')).trim()

      if (!schools.some(({ abbreviation }) => abbreviation === schoolCode)) {
        schools.push({ abbreviation: schoolCode, name: schoolName })
      }
      if (
        !courses.some(
          ({ code, school }) =>
            code === courseCode.toLowerCase() &&
            school === schoolCode.toLowerCase(),
        )
      ) {
        courses.push({
          code: courseCode.toLowerCase(),
          school: schoolCode.toLowerCase(),
          name: courseName.join(' '),
        })
      }

      batcher.add(
        createOperation(examRef, {
          course: courseCode.toLowerCase(),
          courseName: courseName.join(' '),
          mode,
          name,
          school: schoolCode.toLowerCase(),
          schoolName,
        }),
      )

      for (const question of questions) {
        const {
          _id,
          question: text,
          answers,
          options,
          stats,
          history,
        } = question
        const questionRef = dbFirestore
          .collection('questions')
          .doc(_id.toHexString())

        batcher.add(
          createOperation(questionRef, {
            question: text,
            answers,
            options,
            stats: {
              ...stats,
              successRate: stats.totalCorrect / stats.totalAnswers,
            },
            random: Math.floor(Math.random() * 10000),
            school: schoolCode.toLowerCase(),
            course: courseCode.toLowerCase(),
            exam: name,
          }),
        )

        if (MIGRATE_HISTORY) {
          for (const historyEntry of history) {
            const historyEntryRef = questionRef.collection('history').doc()

            batcher.add(createOperation(historyEntryRef, historyEntry))
          }
        }
      }

      await batcher.commit()
    }

    schools.forEach((school) => {
      batcher.add(
        createOperation(
          dbFirestore
            .collection('schools')
            .doc(school.abbreviation.toLocaleLowerCase()),
          school,
        ),
      )
    })

    courses.forEach((course) => {
      batcher.add(
        createOperation(
          dbFirestore
            .collection('courses')
            .doc(course.code.toLocaleLowerCase()),
          course,
        ),
      )
    })

    const reports: Report[] = MIGRATE_HISTORY
      ? await mongo.collection<Report>('reports').find().toArray()
      : []

    let globalStats: Stats = {
      grades: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
      },
      numReports: 0,
      totalScore: 0,
      lastUpdated: firestore.Timestamp.now(),
    }

    let examStats: Stats[] = []

    for (const report of reports) {
      const { _id, ...reportContent } = report

      batcher.add(
        createOperation(
          dbFirestore.collection('reports').doc(_id.toHexString()),
          {
            ...reportContent,
            history: (reportContent.history || []).map((entry) => ({
              ...entry,
              questionId: entry.questionId.toHexString(),
            })),
          },
        ),
      )

      globalStats = updateStats(globalStats, report)

      const examStat = examStats.find(
        (stat) =>
          stat.school === report.exam.school &&
          stat.course === report.exam.course &&
          stat.exam === report.exam.name,
      )

      const examName =
        report.exam.name === 'random' || report.exam.name === 'hardest'
          ? report.exam.name + report.numQuestions
          : report.exam.name

      if (!examStat) {
        examStats.push({
          grades: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
          },
          numReports: 0,
          totalScore: 0,
          lastUpdated: firestore.Timestamp.now(),
          school: report.exam.school,
          course: report.exam.course,
          exam: examName,
        })
      } else {
        examStats = examStats.map((stat) =>
          stat === examStat ? updateStats(examStat, report) : stat,
        )
      }
    }

    batcher.add(
      createOperation(
        dbFirestore.collection('stats').doc('global'),
        globalStats,
      ),
    )

    for (const examStat of examStats) {
      batcher.add(
        createOperation(dbFirestore.collection('stats').doc(), examStat),
      )
    }

    await batcher.commit()
  } catch (error) {
    console.error(error)
  }
  client.close()
  app.delete()
})
