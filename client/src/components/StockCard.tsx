import { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Clock, AlertTriangle } from "lucide-react";
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
  isStale?: boolean; // Add isStale property
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
  
  // Generate classes for stale stock cards
  const cardClasses = isStale
    ? "stock-card dark:bg-red-950/30 light:bg-red-50 w-full h-full flex flex-col border-2 dark:border-red-700/50 light:border-red-300/50" 
    : "stock-card dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 light:bg-white w-full h-full flex flex-col";
    
  const headerClasses = isStale
    ? "dark:bg-red-900/30 light:bg-red-100 px-4 py-3 border-b border-terminal-border flex justify-between items-center"
    : "dark:bg-terminal-header/70 light:bg-gray-100 px-4 py-3 border-b border-terminal-border flex justify-between items-center";
  
  return (
    <div className={cardClasses}>
      {/* Card Header */}
      <div className={headerClasses}>
        <div>
          <h3 className="text-xl font-bold dark:text-white light:text-gray-800 font-mono flex items-center gap-1">
            {isStale && <AlertTriangle size={16} className="dark:text-yellow-300 light:text-red-500" />}
            {symbol}
          </h3>
          <div className="flex items-center text-xs dark:text-gray-400 light:text-gray-500">
            <span className="dark:bg-gray-700 light:bg-gray-200 px-2 py-0.5 rounded text-terminal-accent">{exchange}</span>
            {isStale && (
              <span className="ml-2 dark:bg-red-900/50 light:bg-red-200 px-2 py-0.5 rounded dark:text-red-300 light:text-red-700">
                Stale Data
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">
            <span className={
              isStale 
                ? "dark:text-gray-400 light:text-gray-500" 
                : isPriceUp 
                  ? "text-green-500 dark:text-green-400" 
                  : "text-red-500 dark:text-red-400"
            }>
              {currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-end space-x-1">
            {!isStale && (isPriceUp ? (
              <ArrowUpCircle className="text-green-500 dark:text-green-400 w-5 h-5" />
            ) : (
              <ArrowDownCircle className="text-red-500 dark:text-red-400 w-5 h-5" />
            ))}
            <span className={
              isStale 
                ? "text-sm font-bold dark:text-gray-400 light:text-gray-500" 
                : `text-sm font-bold ${isPriceUp ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`
            }>
              {isPriceUp ? "+" : ""}{changeText}
            </span>
          </div>
        </div>
      </div>
      
      {/* Last Update Info */}
      <div className={
        isStale 
          ? "px-4 py-2 dark:bg-red-900/20 light:bg-red-50 flex items-center text-xs dark:text-red-400 light:text-red-600" 
          : "px-4 py-2 dark:bg-gray-900/50 light:bg-gray-50 flex items-center text-xs dark:text-gray-400 light:text-gray-500"
      }>
        <Clock className="w-3 h-3 mr-1" />
        <span>{isStale ? "Last update (stale): " : "Last update: "}{formatTimestamp(timestamp)}</span>
      </div>
      
      {/* Price History Section */}
      <div className="p-4 flex-grow overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium dark:text-gray-300 light:text-gray-700">Price History</h4>
          <span className="text-xs text-terminal-muted">Last 10 Trades</span>
        </div>
        <div className="h-[280px] overflow-y-auto dark:scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
          {priceHistory.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 dark:bg-gray-900/80 light:bg-gray-100 backdrop-blur-sm">
                <tr className="text-terminal-accent">
                  <th className="px-2 py-1 font-medium">#</th>
                  <th className="px-2 py-1 font-medium">Time</th>
                  <th className="px-2 py-1 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory.map((entry, index) => {
                  // Calculate price difference with previous entry
                  const prevEntry = priceHistory[index + 1];
                  const priceDiff = prevEntry ? entry.price - prevEntry.price : 0;
                  const priceChangeClass = priceDiff >= 0 
                    ? "text-green-500 dark:text-green-400" 
                    : "text-red-500 dark:text-red-400";
                  
                  return (
                    <tr 
                      key={index} 
                      className="border-b dark:border-gray-800/50 light:border-gray-200 dark:hover:bg-gray-800/30 light:hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-1.5 dark:text-gray-500 light:text-gray-400">{index + 1}</td>
                      <td className="px-2 py-1.5 dark:text-gray-300 light:text-gray-600">
                        {new Date(entry.timestamp).toLocaleTimeString('en-IN', {
                          hour: "2-digit" as const,
                          minute: "2-digit" as const,
                          second: "2-digit" as const,
                          hour12: true,
                          timeZone: 'Asia/Kolkata'
                        })}
                      </td>
                      <td className={`px-2 py-1.5 text-right font-mono font-medium ${priceChangeClass}`}>
                        {entry.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="dark:text-gray-500 light:text-gray-400 italic">No price history available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}