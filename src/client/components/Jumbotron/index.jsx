import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../BarChart';
import styles from './Jumbotron.css';

const Jumbotron = (props) => {
  const subtitle = () => {
    const subtitles = [
      'Will you improve the statistics?',
      'Where are you on the chart?',
      "It's OK to fail.",
      'Practice makes perfect.',
      "You'll do great!",
      "Remember, grades aren't everything.",
      'Cram with Kramster!',
    ];

    return subtitles[Math.floor(Math.random() * subtitles.length)];
  };

  return (
    <div className={styles.jumbotron}>
      <h1 className={styles.title}>Kramster!</h1>
      { props.gradesData ? <BarChart data={props.gradesData} /> : null }
      <h3 className={styles.subtitle}>{subtitle()}</h3>
    </div>
  );
};

Jumbotron.propTypes = {
  gradesData: PropTypes.shape({
    A: PropTypes.number,
    B: PropTypes.number,
    C: PropTypes.number,
    D: PropTypes.number,
    E: PropTypes.number,
    F: PropTypes.number,
  }),
};

export default Jumbotron;
