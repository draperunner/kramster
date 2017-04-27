import React from 'react';
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
    <div className={`jumbotron ${styles.jumbotron}`}>
      <div className="container">
        <h1 className={styles.title}>Kramster!</h1>
        { props.gradesData ? <BarChart data={props.gradesData} /> : null }
        <h3>{subtitle()}</h3>
      </div>
    </div>
  );
};

Jumbotron.propTypes = {
  gradesData: React.PropTypes.shape({
    A: React.PropTypes.number,
    B: React.PropTypes.number,
    C: React.PropTypes.number,
    D: React.PropTypes.number,
    E: React.PropTypes.number,
    F: React.PropTypes.number,
  }),
};

export default Jumbotron;
