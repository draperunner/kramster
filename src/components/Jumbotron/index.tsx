import React from 'react'
import BarChart from '../BarChart'
import styles from './Jumbotron.css'

import { Grade } from '../../interfaces'

interface Props {
  gradesData:
    | null
    | {
        [grade in Grade]: number
      }
}

const Jumbotron = (props: Props): JSX.Element => {
  const subtitle = (): string => {
    const subtitles = [
      'Will you improve the statistics?',
      'Where are you on the chart?',
      "It's OK to fail.",
      'Practice makes perfect.',
      "You'll do great!",
      "Remember, grades aren't everything.",
      'Cram with Kramster!',
    ]

    return subtitles[Math.floor(Math.random() * subtitles.length)]
  }

  return (
    <div className={styles.jumbotron}>
      <h1 className={styles.title}>Kramster!</h1>
      {props.gradesData ? <BarChart data={props.gradesData} /> : null}
      <h3 className={styles.subtitle}>{subtitle()}</h3>
    </div>
  )
}

export default Jumbotron
