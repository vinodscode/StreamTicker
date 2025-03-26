import { formatTimestamp, formatDateTime, calculateChange } from "@/lib/utils";

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
    <div className="p-4 overflow-auto h-96 terminal-content">
      {/* Welcome Message */}
      <div className="mb-4">
        <span className="text-green-400">root@stock-terminal</span>
        <span className="text-terminal-text">:</span>
        <span className="text-terminal-accent">~</span>
        <span className="text-terminal-text">$ </span>
        <span className="font-bold">connect api-ticks.rvinod.com</span>
        <div className="mt-1 text-terminal-muted">Establishing connection to https://api-ticks.rvinod.com/stream...</div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-terminal-muted mr-2">Fetching data</span>
            <LoadingDots />
          </div>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="mb-4">
          <div className="text-terminal-negative">
            <span>ERROR: Unable to connect to data stream. Check connection and try again.</span>
          </div>
          <div className="mt-1">
            <span className="text-green-400">root@stock-terminal</span>
            <span className="text-terminal-text">:</span>
            <span className="text-terminal-accent">~</span>
            <span className="text-terminal-text">$ </span>
            <button 
              onClick={handleReconnect}
              className="font-bold text-terminal-text hover:text-terminal-accent focus:outline-none"
            >
              reconnect
            </button>
          </div>
        </div>
      )}
      
      {/* Data State */}
      {!isLoading && !isError && data && (
        <div className="mb-4">
          <div className="text-terminal-positive mb-2">
            <span>Connection established. Streaming data...</span>
          </div>
          
          {/* Data Output Header */}
          <div className="mt-4 mb-2 text-terminal-muted text-xs uppercase tracking-wider">
            LIVE STOCK DATA - LAST UPDATED: <span>{formatDateTime(data.timestamp)}</span>
          </div>
          
          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-terminal-muted border-b border-terminal-border">
                <tr>
                  <th className="text-left py-2 pr-4">TICKER</th>
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
                  
                  return (
                    <tr 
                      key={ticker} 
                      className="border-b border-terminal-border border-opacity-50 hover:bg-terminal-header"
                    >
                      <td className="py-2 pr-4 font-bold text-terminal-accent">{ticker}</td>
                      <td className="py-2 pr-4 text-right font-mono">{lastPrice.toFixed(2)}</td>
                      <td className={`py-2 pr-4 text-right ${changeClass}`}>
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
          <div className="mt-6">
            <span className="text-green-400">root@stock-terminal</span>
            <span className="text-terminal-text">:</span>
            <span className="text-terminal-accent">~</span>
            <span className="text-terminal-text">$ </span>
            <span className="font-bold">stats --realtime</span>
            <div className="mt-1 text-sm">
              <div>Total tickers: <span className="text-terminal-accent">{Object.keys(data.data).length}</span></div>
              <div>Connection type: <span className="text-terminal-accent">WebSocket (real-time)</span></div>
              <div>Connection status: <span className="text-terminal-positive">ACTIVE</span></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Command Input */}
      <div className="mt-4 flex items-center">
        <span className="text-green-400">root@stock-terminal</span>
        <span className="text-terminal-text">:</span>
        <span className="text-terminal-accent">~</span>
        <span className="text-terminal-text">$ </span>
        <span className="ml-1 inline-block w-2 h-4 bg-terminal-text animate-pulse"></span>
      </div>
    </div>
  );
}

const LoadingDots = () => {
  return <span className="text-terminal-accent animate-pulse">...</span>;
};
