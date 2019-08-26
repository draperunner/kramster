import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-flexbox-grid'
import Kitem from '../../components/Kitem'
import { formatPercentage, percentageToGrade, colors } from '../../utils'
import BarChart from '../../components/BarChart'
import PieChart from '../../components/PieChart'
import ResultButton from '../../components/Buttons/ResultButton'
import styles from './Result.css'

function Result(props) {
  const {
    grade,
    colorFromUser,
    colorFromServer,
    score,
    percentage,
    averageGrade,
    averageScore,
    avgPercentage,
    params,
    stats,
    history,
  } = props

  useEffect(() => {
    if (!history.length) {
      browserHistory.push(`/${params.splat}`)
    }
  }, [history.length, params.splat])

  return (
    <div>
      <Row className={styles.row}>
        <Col xs={12}>
          <h1 className={styles.header}>
            Your results
          </h1>
        </Col>

        <Col xs={4} md={4}>
          <Kitem
            head={grade}
            body="Grade"
            clickable={false}
            color={colorFromUser}
          />
        </Col>

        <Col xs={4} md={4}>
          <Kitem
            head={score}
            body="Score"
            clickable={false}
            color={colorFromUser}
          />
        </Col>

        <Col xs={4} md={4}>
          <Kitem
            head={percentage}
            body="%"
            clickable={false}
            color={colorFromUser}
          />
        </Col>
      </Row>

      <Row className={styles.row}>
        <Col xs={12}>
          <h1 className={styles.header}>
            Stats for this exam
          </h1>
        </Col>

        <Col xs={4} md={4}>
          <Kitem
            head={averageGrade}
            body="Average Grade"
            clickable={false}
            color={colorFromServer}
          />
        </Col>
        <Col xs={4} md={4}>
          <Kitem
            head={averageScore}
            body="Average Score"
            clickable={false}
            color={colorFromServer}
          />
        </Col>
        <Col xs={4} md={4}>
          <Kitem
            head={avgPercentage}
            body="Average %"
            clickable={false}
            color={colorFromServer}
          />
        </Col>
      </Row>

      <Row className={styles.row}>
        <Col xs={6} sm={4}>
          { stats.grades ? <PieChart data={stats.grades} /> : null }
        </Col>
        <Col xs={6} sm={4}>
          { stats.grades ? <BarChart data={stats.grades} /> : null }
        </Col>
        <Col xs={12} sm={4}>
          <ResultButton href={`/${params.splat}`}>
            <h4>
              Try again
            </h4>
          </ResultButton>
          <ResultButton href={`/${params.splat.split('/').slice(0, 2).join('/')}`}>
            <h4>
              Try another
            </h4>
          </ResultButton>
        </Col>
      </Row>
    </div>
  )
}

Result.propTypes = {
  colorFromUser: PropTypes.string,
  colorFromServer: PropTypes.string,
  grade: PropTypes.string,
  score: PropTypes.number,
  history: PropTypes.arrayOf(PropTypes.shape({
    questionId: PropTypes.string,
    givenAnswer: PropTypes.string,
    wasCorrect: PropTypes.bool,
  })),
  percentage: PropTypes.number,
  averageGrade: PropTypes.string,
  averageScore: PropTypes.string,
  avgPercentage: PropTypes.number,
  stats: PropTypes.shape({
    grades: PropTypes.shape({
      A: PropTypes.number,
      B: PropTypes.number,
      C: PropTypes.number,
      D: PropTypes.number,
      E: PropTypes.number,
      F: PropTypes.number,
    }),
  }),
}

const mapStateToProps = (state) => {
  const { history, stats } = state.questions
  const totalNumberOfQuestions = stats.numReports * stats.numQuestions
  const avgPercentage = formatPercentage(stats.totalScore, totalNumberOfQuestions)
  const averageGrade = percentageToGrade(avgPercentage)
  const score = history.filter((q) => q.wasCorrect).length
  const percentage = formatPercentage(score, history.length)
  const grade = percentageToGrade(percentage)
  const colorFromUser = colors()[grade]
  const colorFromServer = colors()[averageGrade]

  return {
    averageGrade,
    averageScore: stats.averageScore && stats.averageScore.toFixed(2),
    avgPercentage,
    colorFromUser,
    colorFromServer,
    history,
    grade,
    percentage,
    score,
    stats,
  }
}

export default connect(mapStateToProps)(Result)
