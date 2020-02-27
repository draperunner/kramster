import React from 'react'
import styles from './ProgressBar.css'
import { Question } from '../../interfaces'

interface Props {
  history: boolean[]
  questions: Question[]
}

const ProgressBar = (props: Props): JSX.Element => {
  const value = props.questions.length > 0 ? 100 / props.questions.length : 0
  const type = (index: number): 'correct' | 'wrong' =>
    props.history[index] ? 'correct' : 'wrong'

  return (
    <div className={styles.wrapper}>
      <p className={styles.progressText}>
        {`${props.history.length}/${props.questions.length}`}
      </p>
      <div className={styles.progress}>
        {props.history.map((answer, i) => (
          <div
            key={i}
            className={styles[type(i)]}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${value}`}
            style={{ width: `${value}%` }}
            role="progressbar"
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressBar
