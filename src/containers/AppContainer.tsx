import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Navbar } from '../components'
import { Stats, HistoryEntry } from '../interfaces'
import { HistoryContext, StatsContext } from '../hooks/contexts'

const App = (): JSX.Element => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  return (
    <StatsContext.Provider value={[stats, setStats]}>
      <HistoryContext.Provider value={[history, setHistory]}>
        <div style={{ margin: 'auto', maxWidth: 1184 }}>
          <Navbar />
          <Outlet />
        </div>
      </HistoryContext.Provider>
    </StatsContext.Provider>
  )
}

export default App
