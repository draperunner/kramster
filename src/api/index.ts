import firebase from 'firebase/app'
import 'firebase/firestore'

import {
  Stats,
  Question,
  Exam,
  SendableReport,
  School,
  Course,
} from '../interfaces'
import { get, post } from './http'

const BASE_URL = process.env.API_BASE_URL

export function getStats(): Promise<Stats> {
  return get<Stats>(`${BASE_URL}/stats/`)
}

export function getSchools(): Promise<School[]> {
  return firebase
    .firestore()
    .collection('schools')
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => ({
        ...(doc.data() as School),
        id: doc.id,
      })),
    )
}

export function getCourses(school: string): Promise<Course[]> {
  return firebase
    .firestore()
    .collection('courses')
    .where('school', '==', school)
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => ({
        ...(doc.data() as Course),
        id: doc.id,
      })),
    )
}

export function getExams(school: string, course: string): Promise<Exam[]> {
  return firebase
    .firestore()
    .collection('exams')
    .where('school', '==', school)
    .where('course', '==', course)
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => {
        const exam = doc.data() as Exam
        return {
          ...exam,
          id: doc.id,
          questions: exam.questions || [],
        }
      }),
    )
}

export async function getExam(
  school: string,
  course: string,
  examName: string,
): Promise<Exam | null> {
  try {
    const snapshot = await firebase
      .firestore()
      .collection('exams')
      .where('name', '==', examName)
      .where('school', '==', school)
      .where('course', '==', course)
      .limit(1)
      .get()

    const exam = snapshot.docs.map((doc) => ({
      ...(doc.data() as Exam),
      id: doc.id,
    }))[0]

    if (!exam) return null

    const questionsSnapshot = await firebase
      .firestore()
      .collection('exams')
      .doc(exam.id)
      .collection('questions')
      .get()

    const questions = questionsSnapshot.docs.map(
      (doc) => doc.data() as Question,
    )

    return {
      ...exam,
      questions,
    }
  } catch (error) {
    return null
  }
}

interface GetQuestionsOptions {
  exam?: string
  limit?: number
  mode?: 'random' | 'hardest' | 'exam' | 'all'
}

export function getQuestions(
  school: string,
  course: string,
  options: GetQuestionsOptions,
): Promise<Question[]> {
  const { exam, limit, mode } = options

  if (exam) {
    return getExam(school, course, exam).then(
      (examWithQuestions) => examWithQuestions?.questions || [],
    )
  }

  const url = `${BASE_URL}/exams/${school}/${course}${
    exam ? `/${options.exam}` : ''
  }`

  return get<Question[] | Exam[]>(url, {
    random: mode === 'random',
    hardest: mode === 'hardest',
    limit,
  }).then((data) => {
    // @ts-ignore
    if (exam) return data[0].questions
    return data
  })
}

export async function sendReport(report: SendableReport): Promise<Stats> {
  await post(`${BASE_URL}/reports/add`, report)

  // Fetch aggregated statistics from server
  const { school, course, name } = report.exam
  const url = `${BASE_URL}/stats/${school}/${course}/${name}`

  const params: { numQuestions?: number } = {}
  if (name === 'random') {
    params.numQuestions = report.numQuestions
  }

  return get<Stats>(url, params)
}
