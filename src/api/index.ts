import firebase from 'firebase/app'
import 'firebase/firestore'

import { Question, SendableReport } from '../interfaces'

const db = firebase.firestore()

if (process.env.NODE_ENV !== 'production') {
  db.useEmulator('localhost', 8080)
}

async function getExam(
  school: string,
  course: string,
  examName: string,
): Promise<Question[]> {
  try {
    const snapshot = await db
      .collection('questions')
      .where('exam', '==', examName)
      .where('school', '==', school)
      .where('course', '==', course)
      .get()

    const questions = snapshot.docs.map((doc) => ({
      ...(doc.data() as Question),
      id: doc.id,
    }))

    return questions
  } catch (error) {
    return []
  }
}

async function getRandom(
  school: string,
  course: string,
  limit: number,
): Promise<Question[]> {
  const random = Math.floor(Math.random() * 10000)

  const snap = await db
    .collection('questions')
    .where('school', '==', school)
    .where('course', '==', course)
    .where('random', '>=', random)
    .orderBy('random')
    .limit(limit)
    .get()

  let questions: Question[] = snap.docs.map((doc) => ({
    ...(doc.data() as Question),
    id: doc.id,
  }))

  if (snap.size < limit) {
    const remainingSnap = await db
      .collection('questions')
      .where('school', '==', school)
      .where('course', '==', course)
      .where('random', '<=', random)
      .orderBy('random', 'desc')
      .limit(limit - snap.size)
      .get()

    questions = [
      ...questions,
      ...remainingSnap.docs.map((doc) => ({
        ...(doc.data() as Question),
        id: doc.id,
      })),
    ]
  }

  return questions
}

async function getHardest(
  school: string,
  course: string,
  limit: number,
): Promise<Question[]> {
  const snap = await db
    .collection('questions')
    .where('school', '==', school)
    .where('course', '==', course)
    .orderBy('stats.successRate')
    .limit(limit)
    .get()

  return snap.docs.map((doc) => ({
    ...(doc.data() as Question),
    id: doc.id,
  }))
}

interface GetQuestionsOptions {
  exam?: string
  limit?: number
  mode?: 'random' | 'hardest' | 'exam' | 'all'
}

export async function getQuestions(
  school: string,
  course: string,
  options: GetQuestionsOptions,
): Promise<Question[]> {
  const { exam, limit, mode } = options

  if (exam) {
    return getExam(school, course, exam)
  }

  if (mode === 'random') {
    return getRandom(school, course, limit || 10)
  }

  if (mode === 'hardest') {
    return getHardest(school, course, limit || 10)
  }

  return []
}

export async function sendReport(report: SendableReport): Promise<void> {
  await db.collection('reports').add(report)
}
