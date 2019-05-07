import { useState, useEffect } from 'react'

import { getCourses, getExams } from '../api'

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
