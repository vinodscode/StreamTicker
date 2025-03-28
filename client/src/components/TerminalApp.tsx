import TerminalBody from "./TerminalBody";
import StaleDataAlert from "./StaleDataAlert";
import { useStockData } from "@/hooks/useStockData";
import { RefreshCw, Wifi } from "lucide-react";

export default function TerminalApp() {
  const { 
    data, 
    isLoading, 
    isError, 
    refresh, 
    lastDataTimestamp,
    lastPriceChangeTimestamp,
    connectionStatus, 
    previousPrices
  } = useStockData();

  // Configure stale data alert for 30 seconds of inactivity
  const STALE_DATA_THRESHOLD_MS = 30000;  // 30 seconds

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-900 to-purple-900 p-2 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <div className="text-cyan-400 flex items-center space-x-2">
            <span className="font-mono">RealTime Stock Tracker</span>
            <Wifi size={18} className="animate-pulse" />
          </div>
        </div>
        <button 
          onClick={refresh}
          className="text-white hover:text-cyan-300 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-4 overflow-auto">
        {/* Terminal Commands */}
        <div className="mb-4">
          <div className="border-l-2 border-green-500 pl-3 text-green-400 font-mono mb-2">
            root@stock-terminal:~$ connect api-ticks.rvinod.com
          </div>
          <div className="text-green-500 font-mono ml-6 mb-4">
            Connection established. Streaming real-time market data...
          </div>
        </div>
        
        {/* Data Header */}
        <div className="flex justify-between items-center bg-gray-900 p-2 rounded mb-4">
          <span className="text-xs font-bold text-gray-400">
            <span className="bg-green-500 text-black px-2 py-0.5 rounded mr-2">LIVE</span>
            STOCK DATA
          </span>
          <span className="text-xs text-gray-400">
            LAST UPDATED: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}) : 'Loading...'}
          </span>
        </div>
        
        {!isLoading && !isError && data && (
          <TerminalBody 
            data={data} 
            isLoading={isLoading} 
            isError={isError}
            previousPrices={previousPrices}
            refresh={refresh}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 p-2 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
          <Wifi size={14} className="mr-1" />
          <span>API Status: Connected (WebSocket)</span>
        </div>
        <div>
          <span>Last Update: just now</span>
        </div>
        <div>StockTerminal v1.0</div>
      </footer>
      
      <StaleDataAlert 
        lastPriceChangeTime={lastPriceChangeTimestamp}
        isActive={connectionStatus === "connected" && !isLoading && !isError}
        staleDurationMs={STALE_DATA_THRESHOLD_MS}
      />
    </div>
  );
}
