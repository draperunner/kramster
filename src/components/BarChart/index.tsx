import React from 'react'
import { Bar } from 'react-chartjs-2'

import { Grade } from '../../interfaces'

interface Props {
  data: {
    [grade in Grade]: number
  }
}

const BarChart = (props: Props): JSX.Element => {
  const sortedKeys: Grade[] = ['A', 'B', 'C', 'D', 'E', 'F']

  const data = {
    labels: sortedKeys,
    datasets: [
      {
        data: sortedKeys.map(k => props.data[k]),
        backgroundColor: '#e74c3c',
        borderColor: '#e74c3c',
        hoverBackgroundColor: '#ed5242',
        hoverBorderColor: '#ed5242',
      },
    ],
  }

  const options = {
    legend: {
      display: false,
    },
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      xAxes: [
        {
          display: false,
          barPercentage: 1.1,
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    tooltips: {
      displayColors: false,
      titleFontSize: 16,
      bodyFontSize: 16,
      callbacks: {
        title(tooltipItems: { xLabel: string }[]): string {
          return tooltipItems[0].xLabel
        },
        label(tooltipItems: { yLabel: string }): string {
          return `${tooltipItems.yLabel}`
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}

export default BarChart
