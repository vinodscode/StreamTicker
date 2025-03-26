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

  useEffect(() => {
    // Set up auto-refresh every 10 seconds
    const intervalId = setInterval(() => {
      refresh();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [refresh]);

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
