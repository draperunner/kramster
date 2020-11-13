import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import { formatPercentage, percentageToGrade, COLORS } from '../../utils'
import { BarChart, PieChart, Kitem } from '../../components'
import { useHistory, useStats } from '../../hooks/contexts'
import ResultButton from '../../components/Buttons/ResultButton'
import { HistoryEntry } from '../../interfaces'

import styles from './Result.css'

interface Props {
  params: {
    splat: string
  }
}

function Result(props: Props): JSX.Element {
  const { params } = props

  const [stats] = useStats()
  const [history] = useHistory()

  const score = history.filter((q: HistoryEntry) => q.wasCorrect).length
  const percentage = formatPercentage(score, history.length)
  const grade = percentageToGrade(percentage)
  const colorFromUser = COLORS[grade]

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
        <Col xs={6} sm={4}>
          {stats && stats.grades ? <PieChart data={stats.grades} /> : null}
        </Col>
        <Col xs={6} sm={4}>
          {stats && stats.grades ? <BarChart data={stats.grades} /> : null}
        </Col>
        <Col xs={12} sm={4}>
          <ResultButton href={`/${params.splat}`}>
            <h4>Try again</h4>
          </ResultButton>
          <ResultButton
            href={`/${params.splat.split('/').slice(0, 2).join('/')}`}
          >
            <h4>Try another</h4>
          </ResultButton>
        </Col>
      </Row>
    </div>
  )
}

export default Result
