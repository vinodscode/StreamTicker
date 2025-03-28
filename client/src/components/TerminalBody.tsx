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
    <div className="flex-1 overflow-auto min-h-[calc(100vh-10rem)] terminal-content w-full">
      {/* Welcome Message */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-900/80 border-b border-terminal-border">
        <div className="flex items-center">
          <Terminal size={20} className="text-green-400 mr-3" />
          <span className="text-green-400 font-mono font-bold text-lg">root@stock-terminal</span>
          <span className="text-terminal-text">:</span>
          <span className="text-terminal-accent">~</span>
          <span className="text-terminal-text">$ </span>
          <span className="font-bold bg-terminal-header px-3 py-1 rounded ml-2 text-white">connect api-ticks.rvinod.com</span>
        </div>
        <div className="mt-2 text-terminal-muted flex items-center gap-2 text-sm pl-9">
          <Server size={16} className="text-terminal-accent" />
          <span>Establishing secure WebSocket connection to financial data stream...</span>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="p-8 flex items-center justify-center">
          <div className="bg-gray-900/80 p-8 rounded-lg shadow-xl border border-terminal-border flex items-center gap-6">
            <div className="text-yellow-500">
              <RefreshCw size={40} className="animate-spin" />
            </div>
            <div className="text-terminal-text">
              <div className="text-lg font-bold text-terminal-accent mb-2">Establishing Connection</div>
              <div className="text-terminal-muted mb-3 flex items-center">
                <span className="mr-2">Fetching real-time financial data</span>
                <LoadingDots />
              </div>
              <div className="text-xs text-terminal-muted">Please wait while we connect to the live market feed...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="p-8 flex items-center justify-center">
          <div className="bg-red-900/20 border border-red-700 text-white p-6 rounded-lg shadow-lg max-w-2xl">
            <div className="text-red-400 flex items-center">
              <AlertCircle size={24} className="mr-3" />
              <h2 className="text-xl font-bold">CONNECTION ERROR</h2>
            </div>
            <p className="mt-3 text-gray-300 pl-9">
              Unable to connect to the stock data API. The server may be experiencing issues or your network connection may be disrupted.
            </p>
            <button 
              onClick={handleReconnect}
              className="mt-4 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center ml-9"
            >
              <RefreshCw size={18} className="mr-2" />
              Retry Connection
            </button>
          </div>
        </div>
      )}
      
      {/* Data State */}
      {!isLoading && !isError && data && (
        <div>
          <div className="p-4 bg-gradient-to-r from-green-900/20 to-transparent border-b border-green-900/30">
            <div className="text-terminal-positive flex items-center">
              <div className="flex h-3 w-3 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="font-medium">LIVE CONNECTION ESTABLISHED</span>
            </div>
            <div className="text-terminal-muted text-sm mt-1 pl-5 flex items-center gap-2">
              <Wifi size={14} className="text-green-400" />
              <span>Streaming real-time market data via secure WebSocket connection</span>
            </div>
          </div>
          
          {/* Data Output Header */}
          <div className="px-6 py-3 text-terminal-muted text-sm uppercase tracking-wider flex justify-between items-center bg-gray-900/70 border-b border-terminal-border">
            <div className="flex items-center">
              <div className="bg-terminal-accent text-black px-2 py-1 rounded font-bold mr-2 animate-pulse">LIVE</div>
              <span>REAL-TIME FINANCIAL MARKET DATA</span>
            </div>
            <div className="font-mono">UPDATED: <span className="text-terminal-accent">{formatDateTime(data.timestamp)}</span></div>
          </div>
          
          {/* Data Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6 w-full">
            {Object.entries(data.data).map(([ticker, tickerData]) => {
              const lastPrice = tickerData.last_price;
              const prevPrice = previousPrices[ticker] || lastPrice;
              const exchange = EXCHANGE_MAP[ticker] || "Unknown";
              
              return (
                <div className="h-[420px]" key={ticker}>
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
          <div className="mx-6 mb-6 overflow-hidden rounded-lg border border-terminal-border shadow-lg">
            <div className="bg-terminal-header px-4 py-3 flex items-center border-b border-terminal-border">
              <Terminal size={16} className="text-terminal-accent mr-2" />
              <span className="font-bold text-terminal-accent">DETAILED MARKET VIEW</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/70 text-terminal-muted border-b border-terminal-border text-sm">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">TICKER</th>
                    <th className="text-left py-3 px-4 font-medium">EXCHANGE</th>
                    <th className="text-right py-3 px-4 font-medium">PRICE</th>
                    <th className="text-right py-3 px-4 font-medium">CHANGE</th>
                    <th className="text-right py-3 px-4 font-medium">UPDATED</th>
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
                        className="border-b border-terminal-border/30 hover:bg-terminal-header/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-terminal-accent">{ticker}</td>
                        <td className="py-3 px-4 text-terminal-muted">{exchange}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">{lastPrice.toFixed(2)}</td>
                        <td className={`py-3 px-4 text-right ${changeClass} font-bold`}>
                          {changePrefix}{change}%
                        </td>
                        <td className="py-3 px-4 text-right text-terminal-muted">
                          {formatTimestamp(tickerData.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Command History */}
          <div className="mx-6 mb-6 bg-gray-900/80 rounded-lg border border-terminal-border overflow-hidden shadow-lg">
            <div className="border-b border-terminal-border px-4 py-3 bg-terminal-header/50">
              <div className="flex items-center">
                <Terminal size={16} className="text-green-400 mr-2" />
                <span className="text-green-400 font-mono">root@stock-terminal</span>
                <span className="text-terminal-text">:</span>
                <span className="text-terminal-accent">~</span>
                <span className="text-terminal-text">$ </span>
                <span className="font-bold bg-gray-800 px-3 py-1 rounded ml-1 text-white">stats --realtime</span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-md border border-terminal-border/30">
                  <div className="text-xs text-terminal-muted mb-1">TOTAL TICKERS</div>
                  <div className="text-terminal-accent font-bold text-2xl">{Object.keys(data.data).length}</div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-md border border-terminal-border/30">
                  <div className="text-xs text-terminal-muted mb-1">CONNECTION</div>
                  <div className="text-terminal-accent font-bold text-2xl flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    WebSocket
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-md border border-terminal-border/30">
                  <div className="text-xs text-terminal-muted mb-1">STATUS</div>
                  <div className="text-terminal-positive font-bold text-2xl">ACTIVE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Command Input */}
      <div className="mx-6 mb-6 flex items-center bg-terminal-header/70 p-3 rounded-md border border-terminal-border shadow-lg">
        <Terminal size={16} className="text-green-400 mr-2" />
        <span className="text-green-400 font-mono">root@stock-terminal</span>
        <span className="text-terminal-text">:</span>
        <span className="text-terminal-accent">~</span>
        <span className="text-terminal-text">$ </span>
        <span className="ml-1 inline-block w-2 h-6 bg-terminal-accent terminal-cursor"></span>
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
