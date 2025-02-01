import { createContext, useContext } from "react";

import { Stats, HistoryEntry } from "../interfaces";

type StatsSetter = React.Dispatch<React.SetStateAction<Stats | null>>;

export const StatsContext = createContext<[Stats | null, StatsSetter]>([
  null,
  (): void => {},
]);

export function useStats(): [Stats | null, StatsSetter] {
  return useContext(StatsContext);
}

type HistorySetter = React.Dispatch<React.SetStateAction<HistoryEntry[]>>;

export const HistoryContext = createContext<[HistoryEntry[], HistorySetter]>([
  [],
  (): void => {},
]);

export function useHistory(): [HistoryEntry[], HistorySetter] {
  return useContext(HistoryContext);
}
