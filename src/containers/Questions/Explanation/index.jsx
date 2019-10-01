import React from 'react'
import PropTypes from 'prop-types'
import MathElement from '../../../components/MathElement'
import { sanitize } from '../../../utils'
import './Explanation.css'

/* eslint-disable react/no-danger */
const Explanation = (props) => {
  if (!props.text) {
    return null
  }
  return (
    <div className="wrapper">
      <h3 className="header">
        Explanation
      </h3>
      <MathElement>
        <h4
          className="text"
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
