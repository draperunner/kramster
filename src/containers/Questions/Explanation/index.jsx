import React from 'react'
import PropTypes from 'prop-types'
import MathElement from '../../../components/MathElement'
import { sanitize } from '../../../utils'
import styles from './Explanation.css'

/* eslint-disable react/no-danger */
const Explanation = (props) => {
  if (!props.text) {
    return null
  }
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.header}>
        Explanation
      </h3>
      <MathElement>
        <h4
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
        />
      </MathElement>
    </div>
  )
}

Explanation.propTypes = {
  text: PropTypes.string,
}

export default Explanation
