import React from 'react';
import BaseButton from '../BaseButton';
import styles from './StandardButton.css';

const StandardButton = props => (
  <BaseButton {...props} className={styles.standard}>
    {props.children}
  </BaseButton>
);

export default StandardButton;
