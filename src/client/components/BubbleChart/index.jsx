import React from 'react';
import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const BubbleChart = (props) => {
  // Scale data radius
  const maxRadius = props.maxRadius || 20;
  const maxDataRadius = Math.max(...props.data.map(dp => dp.r));
  const scaledData = props.data.map(dp => ({ ...dp, r: (dp.r / maxDataRadius) * maxRadius }));
  console.log(scaledData);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = {
    datasets: [{
      data: scaledData,
      backgroundColor: '#e74c3c',
      borderColor: '#e74c3c',
      hoverBackgroundColor: '#ed5242',
      hoverBorderColor: '#ed5242',
    }],
  };

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Weekday',
        },
        ticks: {
          min: 0,
          max: 6,
          stepSize: 1,
          callback: value => weekdays[value],
        },
      }],
      yAxes: [{
        beginAtZero: true,
        scaleLabel: {
          display: true,
          labelString: 'Hour',
        },
        ticks: {
          max: 24,
          stepSize: 2,
        },
      }],
    },
  };

  return <Bubble data={data} options={options} />;
};

BubbleChart.propTypes = {
  maxRadius: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    r: PropTypes.number,
  })),
};

export default BubbleChart;
