import { useEffect } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalBody from "./TerminalBody";
import TerminalFooter from "./TerminalFooter";
import { useStockData } from "@/hooks/useStockData";

export default function TerminalApp() {
  const { 
    data, 
    isLoading, 
    isError, 
    refresh, 
    lastRefreshTime, 
    connectionStatus, 
    previousPrices
  } = useStockData();

  // No need for auto-refresh interval with WebSockets
  // The data will automatically update when new data is received
  // We'll keep the refresh function for manual refreshes

  return (
    <div className="w-full max-w-4xl bg-terminal-bg border border-terminal-border rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono">
      <TerminalHeader onRefresh={refresh} />
      <TerminalBody 
        data={data} 
        isLoading={isLoading}
        isError={isError}
        previousPrices={previousPrices}
        refresh={refresh}
      />
      <TerminalFooter 
        connectionStatus={connectionStatus}
        lastRefreshTime={lastRefreshTime}
      />
    </div>
  );
}
