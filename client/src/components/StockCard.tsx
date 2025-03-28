import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

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
  const changeValue = isPriceUp ? `+${change.toFixed(2)}` : change.toFixed(2);
  
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
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-md w-full h-full flex flex-col">
      <div className="p-4 pb-2">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-lg font-bold text-white">{symbol}</h3>
            <p className="text-xs text-gray-500">{exchange}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-bold text-green-400">
              {currentPrice.toFixed(2)}
            </div>
            <div className="flex items-center justify-end">
              <span className={`text-xs font-medium ${isPriceUp ? "text-green-400" : "text-red-400"}`}>
                {changeValue}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <Clock className="w-3 h-3 mr-1" />
          <span>Last update: {formatTimestamp(timestamp)}</span>
        </div>
      </div>
      
      <div className="px-4 pt-2 pb-4 border-t border-gray-800 flex-grow">
        <h4 className="text-xs font-medium text-gray-400 mb-2">Last 10 Trades</h4>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-500">
              <th className="pb-1">Time</th>
              <th className="pb-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {priceHistory.length > 0 ? (
              priceHistory.map((entry, index) => (
                <tr key={index}>
                  <td className="py-1 text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false})}
                  </td>
                  <td className="py-1 text-right font-mono text-white">{entry.price.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-1 text-gray-500 italic">Loading trade history...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}