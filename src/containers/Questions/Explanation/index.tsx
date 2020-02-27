import React from 'react'
import { MathElement } from '../../../components'
import { sanitize } from '../../../utils'
import styles from './Explanation.css'

/* eslint-disable react/no-danger */

interface Props {
  text?: string
}

const Explanation = (props: Props): JSX.Element | null => {
  if (!props.text) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.header}>Explanation</h3>
      <MathElement>
        <h4
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
        />
      </MathElement>
    </div>
  )
}

export default Explanation
