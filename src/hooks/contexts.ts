import { createContext, useContext } from "react";

import { HistoryEntry } from "../interfaces";

type HistorySetter = React.Dispatch<React.SetStateAction<HistoryEntry[]>>;

export const HistoryContext = createContext<[HistoryEntry[], HistorySetter]>([
  [],
  (): void => {},
]);

export function useHistory(): [HistoryEntry[], HistorySetter] {
  return useContext(HistoryContext);
}
