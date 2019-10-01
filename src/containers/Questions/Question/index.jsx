import React from 'react'
import PropTypes from 'prop-types'
import MathElement from '../../../components/MathElement'
import { sanitize } from '../../../utils'
import './Question.css'

/* eslint-disable react/no-danger */
const Question = (props) => (
  <MathElement>
    <h3
      className="question"
      dangerouslySetInnerHTML={{ __html: sanitize(props.text) }}
    />
  </MathElement>
)

Question.propTypes = {
  text: PropTypes.string,
}

export default Question
