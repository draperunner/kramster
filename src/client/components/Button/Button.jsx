import React from 'react';
import { Link } from 'react-router';
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
  href: React.PropTypes.string,
  type: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default Button;
