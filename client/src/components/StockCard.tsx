import { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
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
}

export default function StockCard({
  symbol,
  exchange,
  currentPrice,
  previousPrice,
  timestamp
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
    }
  }, [currentPrice, timestamp, priceHistory]);
  
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 w-full h-full flex flex-col hover:shadow-cyan-900/20 hover:border-gray-600">
      {/* Card Header */}
      <div className="bg-terminal-header/70 px-4 py-3 border-b border-terminal-border flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white font-mono">{symbol}</h3>
          <div className="flex items-center text-xs text-gray-400">
            <span className="bg-gray-700 px-2 py-0.5 rounded text-terminal-accent">{exchange}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">
            <span className={isPriceUp ? "text-green-400" : "text-red-400"}>
              {currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-end space-x-1">
            {isPriceUp ? (
              <ArrowUpCircle className="text-green-400 w-5 h-5" />
            ) : (
              <ArrowDownCircle className="text-red-400 w-5 h-5" />
            )}
            <span className={`text-sm font-bold ${isPriceUp ? "text-green-400" : "text-red-400"}`}>
              {isPriceUp ? "+" : ""}{changeText}
            </span>
          </div>
        </div>
      </div>
      
      {/* Last Update Info */}
      <div className="px-4 py-2 bg-gray-900/50 flex items-center text-xs text-gray-400">
        <Clock className="w-3 h-3 mr-1" />
        <span>Last update: {formatTimestamp(timestamp)}</span>
      </div>
      
      {/* Price History Section */}
      <div className="p-4 flex-grow overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-300">Price History</h4>
          <span className="text-xs text-terminal-muted">Last 10 Trades</span>
        </div>
        <div className="h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {priceHistory.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-gray-900/80 backdrop-blur-sm">
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
                  const priceChangeClass = priceDiff >= 0 ? "text-green-400" : "text-red-400";
                  
                  return (
                    <tr 
                      key={index} 
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-2 py-1.5 text-gray-500">{index + 1}</td>
                      <td className="px-2 py-1.5 text-gray-300">{new Date(entry.timestamp).toLocaleTimeString()}</td>
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
              <p className="text-gray-500 italic">No price history available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}