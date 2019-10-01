import React from 'react'
import BaseButton from '../BaseButton'
import './ResultButton.css'

const ResultButton = (props) => (
  <BaseButton {...props} className="result">
    {props.children}
  </BaseButton>
)

export default ResultButton
