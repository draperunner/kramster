import { useState } from "react";
import { Outlet } from "react-router";

import { Navbar } from "../components";
import { HistoryEntry } from "../interfaces";
import { HistoryContext } from "../hooks/contexts";

const App = (): JSX.Element => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  return (
    <HistoryContext.Provider value={[history, setHistory]}>
      <div style={{ margin: "auto", maxWidth: 1184, padding: 16 }}>
        <Navbar />
        <Outlet />
      </div>
    </HistoryContext.Provider>
  );
};

export default App;
