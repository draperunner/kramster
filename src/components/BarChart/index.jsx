import React from 'react'
import { Bar } from 'react-chartjs-2'
import PropTypes from 'prop-types'

const BarChart = (props) => {
  const sortedKeys = Object.keys(props.data).sort()

  const data = {
    labels: sortedKeys,
    datasets: [{
      data: sortedKeys.map((k) => props.data[k]),
      backgroundColor: '#e74c3c',
      borderColor: '#e74c3c',
      hoverBackgroundColor: '#ed5242',
      hoverBorderColor: '#ed5242',
    }],
  }

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
      titleFontSize: 16,
      bodyFontSize: 16,
      callbacks: {
        title(tooltipItems) {
          return tooltipItems[0].xLabel
        },
        label(tooltipItems) {
          return `${tooltipItems.yLabel}`
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

BarChart.propTypes = {
  data: PropTypes.shape({
    A: PropTypes.number,
    B: PropTypes.number,
    C: PropTypes.number,
    D: PropTypes.number,
    E: PropTypes.number,
    F: PropTypes.number,
  }),
}

export default BarChart
