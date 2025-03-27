import TerminalHeader from "./TerminalHeader";
import TerminalBody from "./TerminalBody";
import TerminalFooter from "./TerminalFooter";
import StaleDataAlert from "./StaleDataAlert";
import { useStockData } from "@/hooks/useStockData";

export default function TerminalApp() {
  const { 
    data, 
    isLoading, 
    isError, 
    refresh, 
    lastRefreshTime, 
    lastDataTimestamp,
    lastUniqueTimestamp,
    connectionStatus, 
    previousPrices
  } = useStockData();

  // Configure stale data alert for 30 seconds of inactivity
  const STALE_DATA_THRESHOLD_MS = 30000;  // 30 seconds

  return (
    <>
      {/* Stale Data Alert */}
      <StaleDataAlert 
        lastUpdateTimestamp={lastUniqueTimestamp}
        isActive={connectionStatus === "connected" && !isLoading && !isError}
        staleDurationMs={STALE_DATA_THRESHOLD_MS}
      />
      
      <div className="w-full max-w-4xl bg-terminal-bg border border-terminal-border rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono relative transition-all duration-300 hover:shadow-cyan-900/30 hover:shadow-2xl">
        {/* Gradient overlay at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
        
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
    </>
  );
}
