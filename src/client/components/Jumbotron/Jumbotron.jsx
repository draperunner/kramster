import React from 'react';

const Jumbotron = () => {
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

  return (<div className="jumbotron">
    <div id="main-chart" className="container">
      <h1>Kramster!</h1>
      <div id="chart-wrapper">
        {
          /*
        <canvas
          id="bar"
          className="chart chart-bar"
          chart-data="data"
          chart-labels="labels"
          chart-options="options"
          chart-colours="colors"
        />
        */
      }
      </div>
      <h3>{subtitle()}</h3>
    </div>
  </div>);
};

export default Jumbotron;
