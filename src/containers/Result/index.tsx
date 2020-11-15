import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-flexbox-grid'
import firebase from 'firebase/app'

import { formatPercentage, percentageToGrade, COLORS } from '../../utils'
import { BarChart, PieChart, Kitem } from '../../components'
import { useHistory } from '../../hooks/contexts'
import ResultButton from '../../components/Buttons/ResultButton'
import { HistoryEntry, Stats } from '../../interfaces'

import styles from './Result.css'

interface Props {
  params: {
    splat: string
  }
}

function Result(props: Props): JSX.Element {
  const { splat } = props.params

  const [school, course, exam, number] = splat.split('/')

  const [examStats, setExamStats] = useState<Stats>()
  const [history] = useHistory()

  const examName =
    exam === 'random' || exam === 'hardest' ? `${exam}${number}` : exam

  useEffect(() => {
    firebase
      .firestore()
      .collection('stats')
      .where('school', '==', school)
      .where('course', '==', course)
      .where('exam', '==', examName)
      .limit(1)
      .get()
      .then((snap) => {
        if (snap.empty) return

        const stats = snap.docs[0].data() as Stats | null

        if (stats) {
          setExamStats(stats)
        }
      })
  }, [school, course, examName])

  const score = history.filter((q: HistoryEntry) => q.wasCorrect).length
  const percentage = formatPercentage(score, history.length)
  const grade = percentageToGrade(percentage)

  const totalScore = (examStats?.totalScore || 0) + score
  const numReports = (examStats?.numReports || 0) + 1

  const avgPercentage = formatPercentage(
    totalScore,
    numReports * history.length,
  )

  const averageGrade = percentageToGrade(avgPercentage)
  const averageScore = totalScore / numReports

  const colorFromUser = COLORS[grade]
  const colorFromServer = COLORS[averageGrade]

  return (
    <div>
      <Row className={styles.row}>
        <Col xs={12}>
          <h1 className={styles.header}>Your results</h1>
        </Col>

        <Col xs={4} md={4}>
          <Kitem head={grade} body="Grade" color={colorFromUser} />
        </Col>

        <Col xs={4} md={4}>
          <Kitem head={score} body="Score" color={colorFromUser} />
        </Col>

        <Col xs={4} md={4}>
          <Kitem head={percentage} body="%" color={colorFromUser} />
        </Col>
      </Row>

      <Row className={styles.row}>
        <Col xs={12}>
          <h1 className={styles.header}>Stats for this exam</h1>
        </Col>

        <Col xs={4} md={4}>
          <Kitem
            head={averageGrade}
            body="Average Grade"
            color={colorFromServer}
          />
        </Col>
        <Col xs={4} md={4}>
          <Kitem
            head={averageScore}
            body="Average Score"
            color={colorFromServer}
          />
        </Col>
        <Col xs={4} md={4}>
          <Kitem
            head={avgPercentage}
            body="Average %"
            color={colorFromServer}
          />
        </Col>
      </Row>

      <Row className={styles.row}>
        <Col xs={6} sm={4}>
          {examStats?.grades ? <PieChart data={examStats.grades} /> : null}
        </Col>
        <Col xs={6} sm={4}>
          {examStats?.grades ? <BarChart data={examStats.grades} /> : null}
        </Col>
        <Col xs={12} sm={4}>
          <ResultButton href={`/${splat}`}>
            <h4>Try again</h4>
          </ResultButton>
          <ResultButton href={`/${splat.split('/').slice(0, 2).join('/')}`}>
            <h4>Try another</h4>
          </ResultButton>
        </Col>
      </Row>
    </div>
  )
}

export default Result
