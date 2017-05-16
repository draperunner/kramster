import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const BaseButton = props => (
  <Link
    to={props.href}
    className={props.className}
    onClick={props.onClick}
    role="button"
    type="button"
  >
    {props.children}
  </Link>
);

BaseButton.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

export default BaseButton;
