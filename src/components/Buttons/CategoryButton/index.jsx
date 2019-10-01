import React from 'react'
import BaseButton from '../BaseButton'
import './CategoryButton.css'

const StandardButton = (props) => (
  <BaseButton {...props} className="category">
    {props.children}
  </BaseButton>
)

export default StandardButton
