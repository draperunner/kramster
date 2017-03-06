import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = (props) => {
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
    legend: {
      display: false,
    },
    maintainAspectRatio: true,
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
    tooltips: {
      displayColors: false,
      bodyFontFamily: "'Roboto', sans-serif",
      footerFontFamily: "'Roboto', sans-serif",
      callbacks: {
        title(tooltipItems) {
          return tooltipItems[0].xLabel;
        },
        label(tooltipItems) {
          return `${tooltipItems.yLabel}`;
        },
      },
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
