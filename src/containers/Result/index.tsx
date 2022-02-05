import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'

import { formatPercentage, percentageToGrade, COLORS } from '../../utils'
import { Kitem } from '../../components'
import { useHistory } from '../../hooks/contexts'
import ResultButton from '../../components/Buttons/ResultButton'
import { Grade, HistoryEntry, Stats } from '../../interfaces'

import styles from './Result.css'
import DivChart from '../../components/DivChart'

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
      <h1 className={styles.header}>Your results</h1>
      <div className={styles.row}>
        <div>
          <Kitem head={grade} body="Grade" color={colorFromUser} />
        </div>

        <div>
          <Kitem head={score} body="Score" color={colorFromUser} />
        </div>

        <div>
          <Kitem head={percentage} body="%" color={colorFromUser} />
        </div>
      </div>

      <h1 className={styles.header}>Stats for this exam</h1>
      <div className={styles.row}>
        <div>
          <Kitem
            head={averageGrade}
            body="Average Grade"
            color={colorFromServer}
          />
        </div>
        <div>
          <Kitem
            head={averageScore}
            body="Average Score"
            color={colorFromServer}
          />
        </div>
        <div>
          <Kitem
            head={avgPercentage}
            body="Average %"
            color={colorFromServer}
          />
        </div>
      </div>

      <div className={styles.row}>
        {examStats?.grades ? (
          <DivChart
            height={200}
            data={Object.keys(examStats?.grades)
              .sort()
              .reverse()
              .map((label) => ({
                label,
                value: examStats.grades[label as Grade] || 0,
              }))}
          />
        ) : null}
        <div>
          <ResultButton href={`/${splat}`}>
            <h4>Try again</h4>
          </ResultButton>
          <ResultButton href={`/${splat.split('/').slice(0, 2).join('/')}`}>
            <h4>Try another</h4>
          </ResultButton>
        </div>
      </div>
    </div>
  )
}

export default Result
