import { formatTimestamp, formatDateTime, calculateChange } from "@/lib/utils";
import { 
  ArrowUp, ArrowDown, RefreshCw, AlertCircle, 
  BarChart3, Server, Wifi, AlertTriangle, 
  LayoutDashboard, Table2, TrendingUp, Activity 
} from "lucide-react";
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
  staleStocks?: Array<{ticker: string, exchange: string}>;
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
  refresh,
  staleStocks = []
}: TerminalBodyProps) {
  const handleReconnect = () => {
    refresh();
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      {/* Loading State */}
      {isLoading && (
        <div className="h-full flex items-center justify-center">
          <div className="bg-monitor-card p-6 rounded-lg shadow-lg border border-monitor flex items-center gap-4 max-w-lg">
            <div className="text-monitor-accent">
              <RefreshCw size={32} className="animate-spin" />
            </div>
            <div>
              <div className="text-lg font-medium text-monitor-heading mb-2">Connecting to Market Feed</div>
              <div className="text-monitor-muted mb-2 flex items-center">
                <span className="mr-2">Establishing secure connection</span>
                <LoadingDots />
              </div>
              <div className="text-xs text-monitor-muted">Please wait while we connect to the live financial data stream...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="h-full flex items-center justify-center">
          <div className="bg-rose-900/10 border-rose-800/30 p-6 rounded-lg shadow-lg max-w-xl">
            <div className="text-rose-400 flex items-center mb-3">
              <AlertCircle size={28} className="mr-3" />
              <h2 className="text-xl font-medium">Connection Error</h2>
            </div>
            <p className="text-monitor-text pl-10 mb-5">
              Unable to connect to the market data API. This could be due to network issues or the server may be experiencing problems.
            </p>
            <div className="pl-10">
              <button 
                onClick={handleReconnect}
                className="bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw size={18} />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Data State */}
      {!isLoading && !isError && data && (
        <div>
          {/* Connection Status */}
          <div className="mb-6 bg-emerald-900/10 border border-emerald-900/20 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-900/40 p-2 rounded-full">
                <Wifi className="text-emerald-400" size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="status-indicator status-active active-pulse"></span>
                  <span className="font-medium text-emerald-400">Live Connection</span>
                </div>
                <div className="text-sm text-monitor-muted mt-0.5">
                  Receiving real-time market data from ticks.rvinod.com
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-monitor-muted">
              <div>Last update: <span className="text-monitor-text font-medium tabular-nums">{formatDateTime(data.timestamp)}</span></div>
              <div>Tracking <span className="text-monitor-accent">{Object.keys(data.data).length}</span> stocks from <span className="text-monitor-accent">5</span> exchanges</div>
            </div>
          </div>
          
          {/* Data Cards Grid */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-monitor-heading flex items-center gap-2">
                <LayoutDashboard size={18} className="text-monitor-accent" />
                Market Overview
              </h2>
              <div className="text-sm text-monitor-muted">
                Real-time price updates with <span className="text-monitor-accent font-medium">30-second</span> stale data detection
              </div>
            </div>
            
            <div className="dashboard-grid">
              {Object.entries(data.data).map(([ticker, tickerData]) => {
                const lastPrice = tickerData.last_price;
                const prevPrice = previousPrices[ticker] || lastPrice;
                const exchange = EXCHANGE_MAP[ticker] || "Unknown";
                
                return (
                  <StockCard 
                    key={ticker}
                    symbol={ticker}
                    exchange={exchange}
                    currentPrice={lastPrice}
                    previousPrice={prevPrice}
                    timestamp={tickerData.timestamp}
                    isStale={staleStocks.some(stock => stock.ticker === ticker)}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Data Table */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-monitor-heading flex items-center gap-2">
                <Table2 size={18} className="text-monitor-accent" />
                Detailed Market Data
              </h2>
              <div className="text-sm text-monitor-muted">
                Consolidated view of all stock prices
              </div>
            </div>
            
            <div className="bg-monitor-card rounded-lg border border-monitor overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Exchange</th>
                      <th className="text-right">Current Price</th>
                      <th className="text-right">Change</th>
                      <th className="text-center">Status</th>
                      <th className="text-right">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.data).map(([ticker, tickerData]) => {
                      const lastPrice = tickerData.last_price;
                      const prevPrice = previousPrices[ticker] || lastPrice;
                      const change = calculateChange(lastPrice, prevPrice);
                      const isPositive = parseFloat(change) >= 0;
                      const changeClass = isPositive 
                        ? 'text-monitor-positive' 
                        : 'text-monitor-negative';
                      const changePrefix = isPositive ? '+' : '';
                      const exchange = EXCHANGE_MAP[ticker] || "Unknown";
                      const isStale = staleStocks.some(stock => stock.ticker === ticker);
                      
                      return (
                        <tr 
                          key={ticker} 
                          className={isStale ? "row-stale" : ""}
                        >
                          <td>
                            <div className="flex items-center gap-1.5">
                              {isStale ? 
                                <AlertTriangle size={15} className="text-monitor-warning" /> : 
                                <Activity size={15} className="text-monitor-accent/70" />
                              }
                              <span className="font-medium">{ticker}</span>
                            </div>
                          </td>
                          <td className="text-monitor-muted">{exchange}</td>
                          <td className="text-right tabular-nums font-medium">
                            {lastPrice.toFixed(2)}
                          </td>
                          <td className={`text-right tabular-nums font-medium ${changeClass}`}>
                            <div className="flex items-center justify-end gap-1">
                              {isPositive ? 
                                <TrendingUp size={14} /> : 
                                <ArrowDown size={14} />
                              }
                              {changePrefix}{change}%
                            </div>
                          </td>
                          <td className="text-center">
                            {isStale ? (
                              <span className="badge badge-danger">Stale</span>
                            ) : (
                              <span className="badge badge-success">Active</span>
                            )}
                          </td>
                          <td className="text-right tabular-nums text-monitor-muted">
                            {formatTimestamp(tickerData.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Market Summary */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-monitor-heading flex items-center gap-2">
                <BarChart3 size={18} className="text-monitor-accent" />
                Market Summary
              </h2>
              <div className="text-sm text-monitor-muted">
                Connection status and monitoring metrics
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-monitor-card border border-monitor rounded-lg p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-monitor-accent/10">
                  <Server size={24} className="text-monitor-accent" />
                </div>
                <div>
                  <div className="text-sm text-monitor-muted mb-1">Connection Type</div>
                  <div className="text-xl font-medium text-monitor-text">WebSocket</div>
                </div>
              </div>
              
              <div className="bg-monitor-card border border-monitor rounded-lg p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <Wifi size={24} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm text-monitor-muted mb-1">Connection Status</div>
                  <div className="text-xl font-medium text-emerald-500 flex items-center gap-2">
                    <span className="status-indicator status-active active-pulse"></span>
                    Active
                  </div>
                </div>
              </div>
              
              <div className="bg-monitor-card border border-monitor rounded-lg p-4 flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <AlertTriangle size={24} className="text-amber-500" />
                </div>
                <div>
                  <div className="text-sm text-monitor-muted mb-1">Stale Feeds</div>
                  <div className="text-xl font-medium text-amber-500">
                    {staleStocks.length} of {Object.keys(data.data).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: "300ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: "600ms" }}></div>
    </div>
  );
};
