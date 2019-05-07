import { useState, useEffect } from 'react'

import {
  getStats, getSchools, getCourses, getExams,
} from '../api'

export function useStats() {
  const [stats, setStats] = useState()

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  return stats
}

export function useSchools(initialSchools) {
  const [schools, setSchools] = useState(initialSchools)

  useEffect(() => {
    getSchools().then(setSchools)
  }, [])

  return schools
}

export function useCourses(school) {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getCourses(school).then(setCourses)
  }, [school])

  return courses
}

export function useExams(school, course) {
  const [exams, setExams] = useState([])

  useEffect(() => {
    getExams(school, course).then(setExams)
  }, [course, school])

  return exams
}
