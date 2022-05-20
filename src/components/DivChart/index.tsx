import React from 'react'
import styles from './DivChart.css'

const DivChart: React.FC<Props> = ({ height, data }) => {
  // Make data percentages of max value
  const normalizeData = React.useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.value))

    if (maxValue === 0) return data

    return data.map((d) => ({
      ...d,
      value: d.value / maxValue,
    }))
  }, [data])

  return (
    <div className={styles.divChart} style={{ height }}>
      {normalizeData.map(({ label, value }) => (
        <div
          key={label}
          className={styles.divChartBar}
          style={{
            height: 100 * value + '%',
          }}
        >
          <div className={styles.divChartLabel}>{label}</div>
        </div>
      ))}
    </div>
  )
}

type Props = {
  height: number
  data: Array<{
    label: string
    value: number
  }>
}

export default DivChart
