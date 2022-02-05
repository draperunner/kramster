import React, { ReactNode, useState } from 'react'

import { Navbar } from '../components'
import { Stats, HistoryEntry } from '../interfaces'
import { HistoryContext, StatsContext } from '../hooks/contexts'

interface Props {
  children: ReactNode
}

const App = (props: Props): JSX.Element => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  return (
    <StatsContext.Provider value={[stats, setStats]}>
      <HistoryContext.Provider value={[history, setHistory]}>
        <div style={{ margin: 'auto', maxWidth: 1184 }}>
          <Navbar />

          {props.children}
        </div>
      </HistoryContext.Provider>
    </StatsContext.Provider>
  )
}

export default App
