import { useState, useEffect } from "react";
import { 
  ArrowUp, ArrowDown, Clock, AlertTriangle, 
  BarChart4, Building, Activity, AlertCircle, ExternalLink 
} from "lucide-react";
import { formatTimestamp, calculateChange } from "@/lib/utils";

interface PriceHistory {
  price: number;
  timestamp: string;
}

interface StockCardProps {
  symbol: string;
  exchange: string;
  currentPrice: number;
  previousPrice: number;
  timestamp: string;
  isStale?: boolean;
}

export default function StockCard({
  symbol,
  exchange,
  currentPrice,
  previousPrice,
  timestamp,
  isStale = false
}: StockCardProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  
  const change = currentPrice - previousPrice;
  const isPriceUp = change >= 0;
  const changeText = calculateChange(currentPrice, previousPrice);
  
  // Update price history whenever the price changes
  useEffect(() => {
    // Only add to history if the price is different from the last recorded price
    const lastEntry = priceHistory[0];
    if (!lastEntry || lastEntry.price !== currentPrice) {
      // Add new price to history
      setPriceHistory(prev => {
        const newHistory = [
          { price: currentPrice, timestamp },
          ...prev
        ].slice(0, 10); // Keep only the last 10 entries
        
        return newHistory;
      });
      
      // Check for significant price changes (more than 1%)
      if (lastEntry) {
        const percentChange = ((currentPrice - lastEntry.price) / lastEntry.price) * 100;
        if (Math.abs(percentChange) >= 1) {
          const direction = percentChange > 0 ? 'increased' : 'decreased';
          const message = `${symbol} has ${direction} by ${Math.abs(percentChange).toFixed(2)}% (${lastEntry.price.toFixed(2)} → ${currentPrice.toFixed(2)})`;
          
          // Add notification if the global function exists
          // @ts-ignore
          if (window.addStockNotification) {
            // @ts-ignore
            window.addStockNotification({
              id: Date.now().toString(),
              message,
              symbol,
              exchange,
              timestamp: new Date(),
              type: 'info' as const
            });
          }
        }
      }
    }
  }, [currentPrice, timestamp, priceHistory, symbol, exchange]);
  
  return (
    <div className={`stock-card ${isStale ? 'stale-card' : ''}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="flex items-center gap-1.5">
          {isStale ? (
            <AlertTriangle size={16} className="text-monitor-warning" />
          ) : (
            <Activity size={16} className="text-monitor-accent" />
          )}
          <h3 className="text-monitor-heading text-lg font-semibold">
            {symbol}
          </h3>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Building size={13} className="text-monitor-muted" />
            <span className="badge badge-success">
              {exchange}
            </span>
          </div>
        </div>
      </div>
      
      {/* Price Display */}
      <div className={`p-4 border-b border-monitor`}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start">
            <span className="text-monitor-muted text-xs mb-1">Current Price</span>
            <span className={`text-3xl font-bold tabular-nums ${
              isStale 
                ? "text-monitor-muted" 
                : isPriceUp 
                  ? "text-monitor-positive" 
                  : "text-monitor-negative"
            }`}>
              {currentPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-monitor-muted text-xs mb-1">Change</span>
            <div className={`flex items-center text-lg font-bold ${
              isStale 
                ? "text-monitor-muted" 
                : isPriceUp 
                  ? "text-monitor-positive" 
                  : "text-monitor-negative"
            }`}>
              {!isStale && (isPriceUp ? (
                <ArrowUp className="mr-1" size={18} />
              ) : (
                <ArrowDown className="mr-1" size={18} />
              ))}
              <span>{isPriceUp ? "+" : ""}{changeText}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Last Update Info */}
      <div className={`px-4 py-2 border-b border-monitor flex items-center justify-between ${
        isStale ? "bg-rose-900/10 dark:text-monitor-negative light:text-rose-600" : ""
      }`}>
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span className="text-xs">
            Last update: {formatTimestamp(timestamp)}
          </span>
        </div>
        {isStale && (
          <span className="badge badge-danger">Stale</span>
        )}
      </div>
      
      {/* Price History Section */}
      <div className="flex-grow flex flex-col">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-1.5">
            <BarChart4 size={15} className="text-monitor-accent" />
            <h4 className="text-monitor-heading text-sm">
              Price History
            </h4>
          </div>
          <span className="text-xs text-monitor-muted">
            Last 10 updates
          </span>
        </div>
        
        <div className="flex-grow overflow-hidden px-4 pb-4">
          {priceHistory.length > 0 ? (
            <div className="h-[240px] overflow-y-auto">
              <table className="data-table w-full text-sm">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((entry, index) => {
                    // Calculate price difference with previous entry
                    const prevEntry = priceHistory[index + 1];
                    const priceDiff = prevEntry ? entry.price - prevEntry.price : 0;
                    const priceDiffFormatted = priceDiff.toFixed(2);
                    const priceDiffClass = !prevEntry ? "" : priceDiff > 0 
                      ? "text-monitor-positive" 
                      : priceDiff < 0 
                        ? "text-monitor-negative" 
                        : "text-monitor-muted";
                    
                    return (
                      <tr key={index}>
                        <td className="text-monitor-muted">
                          {new Date(entry.timestamp).toLocaleTimeString('en-IN', {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: 'Asia/Kolkata'
                          })}
                        </td>
                        <td className="text-right tabular-nums font-medium text-monitor-text">
                          {entry.price.toFixed(2)}
                        </td>
                        <td className={`text-right tabular-nums font-medium ${priceDiffClass}`}>
                          {!prevEntry ? "-" : (
                            <span className="flex items-center justify-end gap-1">
                              {priceDiff > 0 ? (
                                <ArrowUp size={12} />
                              ) : priceDiff < 0 ? (
                                <ArrowDown size={12} />
                              ) : null}
                              {priceDiff === 0 ? "-" : (priceDiff > 0 ? "+" : "") + priceDiffFormatted}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-2 text-monitor-muted" size={24} />
                <p className="text-monitor-muted text-sm">No price history available yet</p>
                <p className="text-xs text-monitor-muted/70 mt-1">Updates will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="card-footer flex items-center justify-between text-xs">
        <div className="flex items-center">
          <span className={`status-indicator ${isStale ? 'status-stale stale-pulse' : 'status-active active-pulse'}`}></span>
          <span className="text-monitor-muted">
            {isStale ? 'Data feed stale' : 'Data feed active'}
          </span>
        </div>
        <a href="#" className="text-monitor-accent flex items-center opacity-75 hover:opacity-100 transition-opacity">
          <span className="mr-1">Details</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}