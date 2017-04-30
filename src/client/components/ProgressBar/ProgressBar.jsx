/* eslint-disable react/no-array-index-key */
import React from 'react';
import styles from './ProgressBar.css';

const ProgressBar = (props) => {
  const value = props.questions.length > 0 ? 100 / props.questions.length : 0;
  const type = index => (props.history[index] ? 'correct' : 'wrong');

  return (
    <div>
      <p className={styles.progressText}>{`${props.history.length}/${props.questions.length}`}</p>
      <div className="progress">
        { props.history.map((answer, i) =>
          <div
            key={i}
            className={`progress-bar ${styles[type(i)]}`}
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
