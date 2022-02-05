import React, { useState, useEffect } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { Course } from '../../interfaces'
import { Kitem, LoadingSpinner } from '../../components'
import styles from './Courses.css'

interface Props {
  params: {
    school: string
  }
}

const db = firebase.firestore()

function useCourses(schoolId: string): Course[] {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    db.collection('courses')
      .where('school', '==', schoolId)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({
          ...(doc.data() as Course),
          id: doc.id,
        })),
      )
      .then(setCourses)
  }, [schoolId])

  return courses
}

function Courses(props: Props): JSX.Element {
  const { school } = props.params
  const courses = useCourses(school)

  if (!courses || !courses.length) {
    return <LoadingSpinner />
  }

  const availableColors = ['orange', 'green', 'red', 'blue', 'purple', 'yellow']
  const assignedColors: { [depCode: string]: string } = {}
  let colorIndex = 0

  // Assign different colors to each department
  const assignColor = (courseCode: string): string => {
    const firstDigitMatch = courseCode.match(/\d/)
    const indexOfFirstDigit = firstDigitMatch
      ? firstDigitMatch.index || courseCode.length
      : courseCode.length
    const departmentCode = courseCode.slice(0, indexOfFirstDigit)
    if (assignedColors[departmentCode]) return assignedColors[departmentCode]
    assignedColors[departmentCode] =
      availableColors[colorIndex % availableColors.length]
    colorIndex += 1
    return assignedColors[departmentCode]
  }

  return (
    <div className={styles.coursesGrid}>
      {courses.map(({ id, code, name }) => (
        <div key={id}>
          <Kitem
            head={code.toUpperCase()}
            body={name}
            color={assignColor(code)}
            minHeight
            onClick={(): void => browserHistory.push(`/${school}/${id}`)}
          />
        </div>
      ))}
    </div>
  )
}

export default Courses
