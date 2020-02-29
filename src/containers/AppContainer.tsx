import React, { ReactNode, useState } from 'react'
import { Grid } from 'react-flexbox-grid'

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
        <Grid>
          <Navbar />

          {props.children}
        </Grid>
      </HistoryContext.Provider>
    </StatsContext.Provider>
  )
}

export default App
