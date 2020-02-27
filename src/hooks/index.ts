import { useState, useEffect } from 'react'

import { Stats, Exam } from '../interfaces'

import {
  getStats, getSchools, getCourses, getExams,
} from '../api'

export function useStats(): Stats {
  const [stats, setStats] = useState()

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  return stats
}

export function useSchools(initialSchools: string[]): string[] {
  const [schools, setSchools] = useState<string[]>(initialSchools)

  useEffect(() => {
    getSchools().then(setSchools)
  }, [])

  return schools
}

export function useCourses(school: string): string[] {
  const [courses, setCourses] = useState<string[]>([])

  useEffect(() => {
    getCourses(school).then(setCourses)
  }, [school])

  return courses
}

export function useExams(school: string, course: string): string[] {
  const [exams, setExams] = useState<string[]>([])

  useEffect(() => {
    getExams(school, course).then(setExams)
  }, [course, school])

  return exams
}
