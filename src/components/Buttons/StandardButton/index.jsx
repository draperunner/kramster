import React from 'react'
import BaseButton from '../BaseButton'
import './StandardButton.css'

const StandardButton = (props) => (
  <BaseButton {...props} className="standard">
    {props.children}
  </BaseButton>
)

export default StandardButton
