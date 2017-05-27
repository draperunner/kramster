import React from 'react';
import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const BubbleChart = (props) => {
  const sortedKeys = Object.keys(props.data).sort();

  // Scale data radius
  const maxRadius = props.maxRadius || 2;
  const maxDataRadius = Math.max(...props.data.map(dp => dp.r));
  const scaledData = props.data.map(dp => ({ ...dp, r: (dp.r / maxDataRadius) * maxRadius }));
  const data = {
    labels: sortedKeys,
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
        type: 'time',
        time: {
          unit: 'day',
          min: 1,
          max: 6,
          displayFormats: {
            day: 'dd',
          },
        },
      }],
      yAxes: [{
        type: 'linear',
        beginAtZero: true,
        maxTicksLimit: 24,
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
    x: PropTypes.string,
    y: PropTypes.number,
    r: PropTypes.number,
  })),
};

export default BubbleChart;
