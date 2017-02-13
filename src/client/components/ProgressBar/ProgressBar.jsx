import React from 'react';

const ProgressBar = (props) => {
  const value = () => (props.questions.length > 0 ? Math.floor(10000 / props.questions.length) / 100 : 0);
  const type = index => (props.history[index] ? 'correct' : 'wrong');

  return (
    <div className="progress">
      { props.history.map((answer, i) =>
        <div
          key={i}
          className={`progress-bar progress-bar-${type(i)}`}
          aria-valuenow={value()}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext={`${value()}`}
          style={{ width: `${Math.min(value(), 100)}%` }}
          role="progressbar"
        />,
    )}
    </div>
  );
};

ProgressBar.propTypes = {
  history: React.PropTypes.arrayOf(React.PropTypes.bool),
};

export default ProgressBar;
