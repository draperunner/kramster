import React from 'react';
import PropTypes from 'prop-types';
import BaseButton from '../BaseButton';
import MathElement from '../../MathElement';
import Helpers from '../../../utils/Helpers';
import styles from './Alternative.css';

/* eslint-disable react/no-danger */
const Alternative = (props) => {
  const text = Helpers.sanitize(props.text);

  return (
    <BaseButton
      className={styles[props.type]}
      onClick={props.onClick}
    >
      <MathElement dangerouslySetInnerHTML={{ __html: text }} />
    </BaseButton>
  );
};

Alternative.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Alternative;
