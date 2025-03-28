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
  const [expanded, setExpanded] = useState(false);
  
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
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">{symbol}</h3>
          <p className="text-xs text-gray-400">{exchange}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold">
            <span className={isPriceUp ? "text-green-400" : "text-red-400"}>
              {currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-end space-x-1">
            {isPriceUp ? (
              <ArrowUpCircle className="text-green-400 w-4 h-4" />
            ) : (
              <ArrowDownCircle className="text-red-400 w-4 h-4" />
            )}
            <span className={`text-xs font-medium ${isPriceUp ? "text-green-400" : "text-red-400"}`}>
              {changeText}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTimestamp(timestamp)}</span>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {expanded ? "Hide History" : "Show History"}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-3 border-t border-gray-700 pt-2">
          <h4 className="text-xs font-medium text-gray-300 mb-1">Price History (Last 10 Updates)</h4>
          <div className="max-h-48 overflow-y-auto pr-1 text-xs">
            {priceHistory.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400">
                    <th className="pb-1">Time</th>
                    <th className="pb-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((entry, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-1 text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                      <td className="py-1 text-right font-mono">{entry.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 italic">No price history available yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}