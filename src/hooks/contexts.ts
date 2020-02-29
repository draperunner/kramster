import { createContext, useContext } from 'react'

import { Stats, HistoryEntry } from '../interfaces'

type StatsSetter = React.Dispatch<React.SetStateAction<Stats | null>>

export const StatsContext = createContext<[Stats | null, StatsSetter]>([
  null,
  (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
])

export function useStats() {
  return useContext(StatsContext)
}

type HistorySetter = React.Dispatch<React.SetStateAction<HistoryEntry[]>>

export const HistoryContext = createContext<[HistoryEntry[], HistorySetter]>([
  [],
  (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
])

export function useHistory() {
  return useContext(HistoryContext)
}
