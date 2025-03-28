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
    lastPriceChangeTimestamp,
    connectionStatus, 
    previousPrices
  } = useStockData();

  // Configure stale data alert for 30 seconds of inactivity
  const STALE_DATA_THRESHOLD_MS = 30000;  // 30 seconds

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Stale Data Alert - Integrated into the application's UI */}
      <div className="w-full sticky top-0 z-10">
        <StaleDataAlert 
          lastPriceChangeTime={lastPriceChangeTimestamp}
          isActive={connectionStatus === "connected" && !isLoading && !isError}
          staleDurationMs={STALE_DATA_THRESHOLD_MS}
        />
      </div>
      
      <div className="w-full flex-grow bg-terminal-bg overflow-hidden flex flex-col font-mono relative transition-all duration-300">
        {/* Gradient overlay at the top */}
        <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
        
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
    </div>
  );
}
