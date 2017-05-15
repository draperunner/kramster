import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import MathElement from '../../components/MathElement';
import Helpers from '../../utils/Helpers';

/* eslint-disable react/no-danger */
const Alternative = (props) => {
  const text = Helpers.sanitize(props.text);

  return (
    <Button
      type={props.type}
      onClick={props.onClick}
    >
      <MathElement dangerouslySetInnerHTML={{ __html: text }} />
    </Button>
  );
};

Alternative.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Alternative;
