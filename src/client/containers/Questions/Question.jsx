import React from 'react';
import PropTypes from 'prop-types';
import MathElement from '../../components/MathElement';
import Helpers from '../../utils/Helpers';

/* eslint-disable react/no-danger */
const Question = props => (
  <MathElement>
    <h3
      className="question math"
      dangerouslySetInnerHTML={{ __html: Helpers.sanitize(props.text) }}
    />
  </MathElement>
);

Question.propTypes = {
  text: PropTypes.string,
};

export default Question;
