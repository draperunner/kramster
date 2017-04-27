import React from 'react';
import { Link } from 'react-router';
import styles from './Button.css';

const Button = props => (
  <Link
    to={props.href}
    className={styles.button}
    role="button"
  >
    {props.children}
  </Link>
);

Button.propTypes = {
  href: React.PropTypes.string,
};

export default Button;
