import { useState, useEffect } from 'react'

import { Stats, School, Course, Exam } from '../interfaces'

import { getStats, getSchools, getCourses, getExams } from '../api'

export function useStats(): Stats | undefined {
  const [stats, setStats] = useState<Stats | undefined>()

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  return stats
}

export function useSchools(initialSchools: School[]): School[] {
  const [schools, setSchools] = useState<School[]>(initialSchools)

  useEffect(() => {
    getSchools().then(setSchools)
  }, [])

  return schools
}

export function useCourses(schoolId: string): Course[] {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    getCourses(schoolId).then(setCourses)
  }, [schoolId])

  return courses
}

export function useExams(school: string, course: string): Exam[] {
  const [exams, setExams] = useState<Exam[]>([])

  useEffect(() => {
    getExams(school, course).then(setExams)
  }, [course, school])

  return exams
}
