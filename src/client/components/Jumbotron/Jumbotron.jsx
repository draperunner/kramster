import React from 'react';
import BarChart from '../BarChart';

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
    <div className="jumbotron">
      <div id="main-chart" className="container">
        <h1>Kramster!</h1>
        <BarChart data={props.gradesData} />
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
