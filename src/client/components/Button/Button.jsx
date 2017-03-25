import React from 'react';
import { Link } from 'react-router';

const Button = props => (
  <Link
    to={props.href}
    className="btn btn-exam"
    role="button"
  >
    {props.children}
  </Link>
);

Button.propTypes = {
  href: React.PropTypes.string,
};

export default Button;
