import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styles from './Button.css';

const Button = props => (
  <Link
    to={props.href}
    className={styles[props.type || 'standard']}
    onClick={props.onClick}
    role="button"
    type="button"
  >
    {props.children}
  </Link>
);

Button.propTypes = {
  href: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
