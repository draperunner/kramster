import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Row, Col } from 'react-flexbox-grid'

import { Exam } from '../../interfaces'
import CategoryButton from '../../components/Buttons/CategoryButton'
import StandardButton from '../../components/Buttons/StandardButton'
import { LoadingSpinner } from '../../components'

import styles from './Exams.css'

interface Props {
  params: {
    school: string
    course: string
  }
}

export function useExams(school: string, course: string): Exam[] {
  const [exams, setExams] = useState<Exam[]>([])

  useEffect(() => {
    firebase
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
      .then(setExams)
  }, [course, school])

  return exams
}

function Exams(props: Props): JSX.Element {
  const { school, course } = props.params
  const exams = useExams(school, course)

  if (!exams?.length) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.wrapper}>
      <Row className={styles.categoriesRow}>
        <Col xs={4} className={styles.col}>
          <CategoryButton href={`/${school}/${course}/random/10`}>
            10 Random
          </CategoryButton>
        </Col>
        <Col xs={4} className={styles.col}>
          <CategoryButton href={`/${school}/${course}/random/30`}>
            30 Random
          </CategoryButton>
        </Col>
        <Col xs={4} className={styles.col}>
          <CategoryButton href={`/${school}/${course}/hardest/10`}>
            10 Hardest
          </CategoryButton>
        </Col>
      </Row>

      <Row className={styles.examsRow}>
        {exams.map(({ id, name }) => (
          <Col key={id} xs={6} md={4} lg={3} className={styles.col}>
            <StandardButton href={`/${school}/${course}/${name}`}>
              {name}
            </StandardButton>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Exams
