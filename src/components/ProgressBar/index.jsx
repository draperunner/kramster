/* eslint-disable react/no-array-index-key, jsx-a11y/control-has-associated-label */
import React from 'react'
import PropTypes from 'prop-types'
import './ProgressBar.css'

const ProgressBar = (props) => {
  const value = props.questions.length > 0 ? 100 / props.questions.length : 0
  const type = (index) => (props.history[index] ? 'correct' : 'wrong')

  return (
    <div className="wrapper">
      <p className="progressText">
        {`${props.history.length}/${props.questions.length}`}
      </p>
      <div className="progress">
        { props.history.map((answer, i) => (
          <div
            key={i}
            className={`${type(i)}`}
            aria-valuenow={value}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuetext={`${value}`}
            style={{ width: `${value}%` }}
            role="progressbar"
          />
        ))}
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  history: PropTypes.arrayOf(PropTypes.bool),
  questions: PropTypes.arrayOf(PropTypes.object),
}

export default ProgressBar
