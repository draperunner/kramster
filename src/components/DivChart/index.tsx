import React from 'react'

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
    <div
      style={{
        height,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
      }}
    >
      {normalizeData.map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            flex: 1,
            margin: '0 1rem',
            height: 100 * value + '%',
            backgroundColor: '#e74c3c',
            justifyContent: 'center',
            borderRadius: 2,
          }}
        >
          <div style={{ padding: '1rem' }}>{label}</div>
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
