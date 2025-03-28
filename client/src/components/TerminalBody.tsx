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
  if (!data) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          />
        );
      })}
    </div>
  );
}
