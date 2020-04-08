import { get, post } from './http'

import { Stats, Question, Exam, SendableReport } from '../interfaces'

const BASE_URL = process.env.API_BASE_URL

export function getStats(): Promise<Stats> {
  return get<Stats>(`${BASE_URL}/stats/`)
}

export function getSchools(): Promise<Array<string>> {
  return get<string[]>(`${BASE_URL}/list/schools`)
}

export function getCourses(school: string): Promise<Array<string>> {
  return get<string[]>(`${BASE_URL}/list/courses/${school}`)
}

export function getExams(
  school: string,
  course: string,
): Promise<Array<string>> {
  return get<string[]>(`${BASE_URL}/list/exams/${school}/${course}`, {
    sort: '-alphabetically',
  })
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
