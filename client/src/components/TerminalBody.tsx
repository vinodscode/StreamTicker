import { formatTimestamp, formatDateTime, calculateChange } from "@/lib/utils";
import { ArrowUp, ArrowDown, RefreshCw, AlertCircle, Terminal, Server, Wifi } from "lucide-react";
import StockCard from "./StockCard";

interface StockData {
  timestamp: string;
  data: Record<string, { 
    last_price: number; 
    timestamp: string; 
  }>;
}

interface TerminalBodyProps {
  data: StockData | null;
  isLoading: boolean;
  isError: boolean;
  previousPrices: Record<string, number>;
  refresh: () => void;
}

// Map to store exchange names for each stock symbol
const EXCHANGE_MAP: Record<string, string> = {
  "CRUDEOIL25APRFUT": "MCX",
  "SENSEX25401FUT": "BSE",
  "NIFTY25APRFUT": "NSE",
  "INFY": "NSE",
  "USDINR25APRFUT": "CDS",
  "RELIANCE": "NSE"
};

export default function TerminalBody({ 
  data, 
  isLoading, 
  isError,
  previousPrices, 
  refresh
}: TerminalBodyProps) {
  const handleReconnect = () => {
    refresh();
  };

  return (
    <div className="p-4 overflow-auto h-auto min-h-[600px] terminal-content w-full">
      {/* Welcome Message */}
      <div className="mb-4 border-l-2 border-green-500 pl-3 py-1">
        <div className="flex items-center">
          <Terminal size={16} className="text-green-400 mr-2" />
          <span className="text-green-400 font-semibold">root@stock-terminal</span>
          <span className="text-terminal-text">:</span>
          <span className="text-terminal-accent">~</span>
          <span className="text-terminal-text">$ </span>
          <span className="font-bold bg-gray-800 px-2 py-0.5 rounded ml-1">connect api-ticks.rvinod.com</span>
        </div>
        <div className="mt-1 text-terminal-muted flex items-center gap-2">
          <Server size={14} className="text-terminal-accent" />
          <span>Establishing secure WebSocket connection to stream endpoint...</span>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 border-l-2 border-yellow-500 pl-3 py-2">
          <div className="flex items-center">
            <RefreshCw size={16} className="text-yellow-500 mr-2 animate-spin" />
            <span className="text-terminal-muted mr-2">Fetching real-time market data</span>
            <LoadingDots />
          </div>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="mb-4 border-l-2 border-red-500 pl-3 py-2">
          <div className="text-terminal-negative flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>ERROR: Unable to connect to data stream. Check connection and try again.</span>
          </div>
          <div className="mt-2 bg-gray-900 p-2 rounded-md">
            <div className="flex items-center">
              <Terminal size={14} className="text-green-400 mr-2" />
              <span className="text-green-400">root@stock-terminal</span>
              <span className="text-terminal-text">:</span>
              <span className="text-terminal-accent">~</span>
              <span className="text-terminal-text">$ </span>
              <button 
                onClick={handleReconnect}
                className="font-bold text-terminal-text hover:text-terminal-accent focus:outline-none ml-1 bg-gray-800 px-2 py-0.5 rounded hover:bg-gray-700 transition-colors"
              >
                reconnect
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Data State */}
      {!isLoading && !isError && data && (
        <div className="mb-4">
          <div className="text-terminal-positive mb-2 flex items-center border-l-2 border-green-500 pl-3 py-1">
            <Wifi size={16} className="mr-2 animate-pulse" />
            <span>Connection established. Streaming real-time market data...</span>
          </div>
          
          {/* Data Output Header */}
          <div className="mt-4 mb-3 text-terminal-muted text-xs uppercase tracking-wider flex justify-between items-center bg-gray-900 p-2 rounded">
            <div className="flex items-center">
              <span className="bg-terminal-accent text-black px-2 py-0.5 rounded font-bold mr-2">LIVE</span>
              <span>STOCK DATA</span>
            </div>
            <div>LAST UPDATED: <span className="text-terminal-accent">{formatDateTime(data.timestamp)}</span></div>
          </div>
          
          {/* Data Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            {Object.entries(data.data).map(([ticker, tickerData]) => {
              const lastPrice = tickerData.last_price;
              const prevPrice = previousPrices[ticker] || lastPrice;
              const exchange = EXCHANGE_MAP[ticker] || "Unknown";
              
              return (
                <div className="h-[350px]" key={ticker}>
                  <StockCard 
                    symbol={ticker}
                    exchange={exchange}
                    currentPrice={lastPrice}
                    previousPrice={prevPrice}
                    timestamp={tickerData.timestamp}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Data Table (alternative view) */}
          <div className="overflow-x-auto bg-gray-900 bg-opacity-50 rounded-md p-2 mt-4">
            <div className="text-terminal-muted text-xs uppercase mb-2 flex items-center">
              <Terminal size={14} className="mr-1" />
              <span>Detailed View</span>
            </div>
            <table className="min-w-full text-sm">
              <thead className="text-terminal-muted border-b border-terminal-border">
                <tr>
                  <th className="text-left py-2 pr-4">TICKER</th>
                  <th className="text-left py-2 pr-4">EXCHANGE</th>
                  <th className="text-right py-2 pr-4">PRICE</th>
                  <th className="text-right py-2 pr-4">CHANGE</th>
                  <th className="text-right py-2">UPDATED</th>
                </tr>
              </thead>
              <tbody className="text-terminal-text">
                {Object.entries(data.data).map(([ticker, tickerData]) => {
                  const lastPrice = tickerData.last_price;
                  const prevPrice = previousPrices[ticker] || lastPrice;
                  const change = calculateChange(lastPrice, prevPrice);
                  const isPositive = parseFloat(change) >= 0;
                  const changeClass = isPositive 
                    ? 'text-terminal-positive' 
                    : 'text-terminal-negative';
                  const changePrefix = isPositive ? '+' : '';
                  const exchange = EXCHANGE_MAP[ticker] || "Unknown";
                  
                  return (
                    <tr 
                      key={ticker} 
                      className="border-b border-terminal-border border-opacity-50 hover:bg-terminal-header transition-colors"
                    >
                      <td className="py-2 pr-4 font-bold text-terminal-accent">{ticker}</td>
                      <td className="py-2 pr-4 text-terminal-muted">{exchange}</td>
                      <td className="py-2 pr-4 text-right font-mono">{lastPrice.toFixed(2)}</td>
                      <td className={`py-2 pr-4 text-right ${changeClass} font-bold`}>
                        {changePrefix}{change}%
                      </td>
                      <td className="py-2 text-right text-terminal-muted text-xs">
                        {formatTimestamp(tickerData.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Command History */}
          <div className="mt-6 bg-gray-900 bg-opacity-50 p-2 rounded-md">
            <div className="flex items-center">
              <Terminal size={14} className="text-green-400 mr-2" />
              <span className="text-green-400">root@stock-terminal</span>
              <span className="text-terminal-text">:</span>
              <span className="text-terminal-accent">~</span>
              <span className="text-terminal-text">$ </span>
              <span className="font-bold bg-gray-800 px-2 py-0.5 rounded ml-1">stats --realtime</span>
            </div>
            <div className="mt-2 text-sm grid grid-cols-3 gap-2">
              <div className="text-terminal-muted">Total tickers: <span className="text-terminal-accent font-bold">{Object.keys(data.data).length}</span></div>
              <div className="text-terminal-muted">Connection: <span className="text-terminal-accent font-bold">WebSocket</span></div>
              <div className="text-terminal-muted">Status: <span className="text-terminal-positive font-bold">ACTIVE</span></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Command Input */}
      <div className="mt-4 flex items-center bg-gray-900 bg-opacity-30 p-2 rounded-md">
        <Terminal size={14} className="text-green-400 mr-2" />
        <span className="text-green-400">root@stock-terminal</span>
        <span className="text-terminal-text">:</span>
        <span className="text-terminal-accent">~</span>
        <span className="text-terminal-text">$ </span>
        <span className="ml-1 inline-block w-2 h-5 bg-terminal-accent terminal-cursor"></span>
      </div>
    </div>
  );
}

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: "300ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: "600ms" }}></div>
    </div>
  );
};
