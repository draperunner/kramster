import React from 'react'
import { Pie } from 'react-chartjs-2'
import PropTypes from 'prop-types'

const PieChart = (props) => {
  const sortedKeys = Object.keys(props.data).sort()

  const data = {
    labels: sortedKeys,
    datasets: [{
      data: sortedKeys.map(k => props.data[k]),
      backgroundColor: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'],
      borderColor: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'],
      hoverBackgroundColor: ['#34d276', '#399de0', '#a05ebb', '#f6c915', '#eb8327', '#ed5242'],
      hoverBorderColor: ['#34d276', '#399de0', '#a05ebb', '#f6c915', '#eb8327', '#ed5242'],
    }],
  }

  const options = {
    legend: {
      display: false,
    },
    maintainAspectRatio: true,
    responsive: true,
    tooltips: {
      displayColors: false,
      titleFontSize: 16,
      bodyFontSize: 16,
    },
  }

  return <Pie data={data} options={options} />
}

PieChart.propTypes = {
  data: PropTypes.shape({
    A: PropTypes.number,
    B: PropTypes.number,
    C: PropTypes.number,
    D: PropTypes.number,
    E: PropTypes.number,
    F: PropTypes.number,
  }),
}

export default PieChart
