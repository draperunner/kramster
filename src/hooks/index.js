import { useState, useEffect } from 'react'

import { getCourses } from '../api'

export function useCourses(school) {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getCourses(school).then(setCourses)
  }, [school])

  return courses
}
