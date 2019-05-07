import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const BaseButton = props => (
  <Link
    to={props.href}
    className={props.className}
    onClick={props.onClick}
    onKeyDown={e => e.which === 13 && props.onClick && props.onClick(e)}
    role="button"
    type="button"
    focusable
    tabIndex={0}
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
