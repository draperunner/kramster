import React from 'react';
import { Bar, defaults } from 'react-chartjs-2';

const BarChart = (props) => {
  defaults.global.legend.display = false;
  defaults.global.tooltips.displayColors = false;

  const sortedKeys = Object.keys(props.data).sort();

  const data = {
    labels: sortedKeys,
    datasets: [{
      data: sortedKeys.map(k => props.data[k]),
      backgroundColor: '#e74c3c',
      borderColor: '#e74c3c',
      hoverBackgroundColor: '#ed5242',
      hoverBorderColor: '#ed5242',
    }],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 1.1,
      }],
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };

  return <Bar data={data} options={options} />;
};

BarChart.propTypes = {
  data: React.PropTypes.shape({
    A: React.PropTypes.number,
    B: React.PropTypes.number,
    C: React.PropTypes.number,
    D: React.PropTypes.number,
    E: React.PropTypes.number,
    F: React.PropTypes.number,
  }),
};

export default BarChart;
