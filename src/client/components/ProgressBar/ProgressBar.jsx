import React from 'react';

const ProgressBar = props => (
  <div className="progress">
    { props.history.map(i =>
      <div
        key={i}
        className={`progress-bar progress-bar-${props.progress.type(i)}`}
        aria-valuenow={props.progress.value()}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuetext={`${props.progress.value()}`}
        style={{ width: `${Math.min(props.progress.value(), 100)}%` }}
        role="progressbar"
      />,
    )}
  </div>
);

ProgressBar.propTypes = {
  history: React.PropTypes.arrayOf(React.PropTypes.bool),
  progress: React.PropTypes.shape({
    value: React.PropTypes.func,
    type: React.PropTypes.func,
  }),
};

export default ProgressBar;
