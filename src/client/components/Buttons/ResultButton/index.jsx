import React from 'react';
import BaseButton from '../BaseButton';
import styles from './ResultButton.css';

const ResultButton = props => (
  <BaseButton {...props} className={styles.result}>{props.children}</BaseButton>
);

export default ResultButton;
