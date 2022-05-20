const firebase = require('@firebase/testing')

const PROJECT_ID = 'kramsterapp'

const anonymousUser = { uid: 'anonymous_1' }

function setupDb(auth) {
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}

const VALID_REPORT = {
  exam: {
    school: 'ntnu',
    course: 'tdt4160',
    name: 'random',
  },
  createdAt: '2022-05-01T12:00:00+02:00',
  history: [
    { givenAnswer: 'A', questionId: '0', wasCorrect: true },
    { givenAnswer: 'A', questionId: '1', wasCorrect: true },
    { givenAnswer: 'A', questionId: '2', wasCorrect: true },
    { givenAnswer: 'A', questionId: '3', wasCorrect: true },
    { givenAnswer: 'A', questionId: '4', wasCorrect: true },
    { givenAnswer: 'A', questionId: '5', wasCorrect: true },
    { givenAnswer: 'A', questionId: '6', wasCorrect: true },
    { givenAnswer: 'A', questionId: '7', wasCorrect: true },
    { givenAnswer: 'A', questionId: '8', wasCorrect: true },
    { givenAnswer: 'A', questionId: '9', wasCorrect: false },
  ],
  score: 9,
  numQuestions: 10,
  percentage: 90,
  grade: 'A',
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID })
})

describe('Read exams', () => {
  it('Can read exams if logged in as anonymous', async () => {
    const db = setupDb(anonymousUser)
    const testDoc = db.collection('exams')
    await firebase.assertSucceeds(testDoc.get())
  })

  it('Cannot read exams if not logged in', async () => {
    const db = setupDb()
    const testDoc = db.collection('exams')
    await firebase.assertFails(testDoc.get())
  })
})

describe('Reports', () => {
  it('Cannot read reports', async () => {
    const reports = setupDb(anonymousUser).collection('reports')
    await firebase.assertFails(reports.get())
  })

  it('Can create valid report', async () => {
    const reports = setupDb(anonymousUser).collection('reports')
    await firebase.assertSucceeds(reports.add(VALID_REPORT))
  })

  it('Cannot have additional fields', async () => {
    const reports = setupDb(anonymousUser).collection('reports')
    const report = { ...VALID_REPORT, fake: true }
    await firebase.assertFails(reports.add(report))
  })

  it('Cannot have missing fields', async () => {
    const reports = setupDb(anonymousUser).collection('reports')
    const { createdAt, ...partialReport } = VALID_REPORT
    await firebase.assertFails(reports.add(partialReport))
  })

  it('Score cannot be negative', async () => {
    const reports = setupDb(anonymousUser).collection('reports')
    const report = { ...VALID_REPORT, score: -10 }
    await firebase.assertFails(reports.add(report))
  })
})

after(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID })
})
