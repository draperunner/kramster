import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-flexbox-grid'
import { useCourses } from '../../hooks'
import {
  Kitem,
  LoadingSpinner,
} from '../../components'
import styles from './Courses.css'

// Returns a pretty header for the course (the course code)
function getCourseHeader(course: string): string {
  return course.split(' ')[0].toUpperCase()
}

// Returns the full name of the course. Removes course code
function getCourseName(course: string): string {
  return course.replace(course.split(' ')[0], '').trim()
}

interface Props {
  params: {
    school: string;
  };
}

function Courses(props: Props): JSX.Element {
  const { school } = props.params
  const courses = useCourses(school)

  if (!courses || !courses.length) {
    return <LoadingSpinner />
  }

  const availableColors = ['orange', 'green', 'red', 'blue', 'purple', 'yellow']
  const assignedColors: {[depCode: string]: string} = {}
  let colorIndex = 0

  // Assign different colors to each department
  const assignColor = (courseCode: string): string => {
    const firstDigitMatch = courseCode.match(/\d/)
    const indexOfFirstDigit = firstDigitMatch ? firstDigitMatch.index || courseCode.length : courseCode.length
    const departmentCode = courseCode.slice(0, indexOfFirstDigit)
    if (assignedColors[departmentCode]) return assignedColors[departmentCode]
    assignedColors[departmentCode] = availableColors[colorIndex % availableColors.length]
    colorIndex += 1
    return assignedColors[departmentCode]
  }

  return (
    <Row className={styles.coursesRow}>
      { courses.map((course) => {
        const header = getCourseHeader(course)
        const name = getCourseName(course)
        return (
          <Col key={course} xs={12} sm={6} md={4} lg={3}>
            <Kitem
              head={header}
              body={name}
              color={assignColor(header)}
              minHeight
              onClick={(): void => browserHistory.push(`/${school}/${header}`)}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default Courses
