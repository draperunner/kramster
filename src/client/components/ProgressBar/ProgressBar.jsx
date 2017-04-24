import React from 'react';

const ProgressBar = (props) => {
  const value = props.questions.length > 0 ? 100 / props.questions.length : 0;
  const type = index => (props.history[index] ? 'correct' : 'wrong');

  return (
    <div>
      <p className="progress-text">{`${props.history.length}/${props.questions.length}`}</p>
      <div className="progress">
        { props.history.map((answer, i) =>
          <div
            key={i}
            className={`progress-bar progress-bar-${type(i)}`}
            aria-valuenow={value}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuetext={`${value}`}
            style={{ width: `${value}%` }}
            role="progressbar"
          />,
    )}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  history: React.PropTypes.arrayOf(React.PropTypes.bool),
  questions: React.PropTypes.arrayOf(React.PropTypes.object),
};

export default ProgressBar;
