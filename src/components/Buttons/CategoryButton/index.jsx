import React from 'react';
import BaseButton from '../BaseButton';
import styles from './CategoryButton.css';

const StandardButton = props => (
  <BaseButton {...props} className={styles.category}>
    {props.children}
  </BaseButton>
);

export default StandardButton;
