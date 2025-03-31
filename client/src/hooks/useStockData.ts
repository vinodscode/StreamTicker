import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockData, StockDataResponse } from "@/lib/api";
import { getTimeSince } from "@/lib/utils";
import { playAlertSound, unlockAudio } from "@/lib/audio";

// Interface for tracking individual stock timestamps
interface StockTimestamps {
  [ticker: string]: {
    priceTimestamp: Date;
    lastPrice: number;
  };
}

export const useStockData = () => {
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("never");
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date | null>(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState<string | null>(null);
  const [lastPriceChangeTimestamp, setLastPriceChangeTimestamp] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  
  // Track per-stock update timestamps
  const [stockTimestamps, setStockTimestamps] = useState<StockTimestamps>({});
  // Track which stocks are currently stale with exchange info
  const [staleStocks, setStaleStocks] = useState<Array<{ticker: string, exchange: string}>>([]);
  
  const socketRef = useRef<WebSocket | null>(null);
  const pricesHistoryRef = useRef<Record<string, number>>({});

  const { 
    data: initialData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['/api/stock-data'],
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Check if any stock price has changed and track per-stock timestamps
  const hasPriceChanged = useCallback((newData: StockDataResponse): boolean => {
    if (!pricesHistoryRef.current || Object.keys(pricesHistoryRef.current).length === 0) {
      return true; // First data load, treat as changed
    }
    
    let changed = false;
    const updatedStockTimestamps = {...stockTimestamps};
    
    // Check each stock for price changes
    Object.entries(newData.data).forEach(([ticker, tickerData]) => {
      const newPrice = tickerData.last_price;
      const oldPrice = pricesHistoryRef.current[ticker];
      
      // If price has changed or we don't have previous data
      if (oldPrice === undefined || newPrice !== oldPrice) {
        changed = true;
        // Update price history
        pricesHistoryRef.current[ticker] = newPrice;
        
        // Update the stock's timestamp
        updatedStockTimestamps[ticker] = {
          priceTimestamp: new Date(),
          lastPrice: newPrice
        };
      }
    });
    
    // Update the stock timestamps
    setStockTimestamps(updatedStockTimestamps);
    
    return changed;
  }, [stockTimestamps]);

  // Check for stale stock data using settings context
  useEffect(() => {
    if (Object.keys(stockTimestamps).length === 0) return;
    
    // Import settings context
    const settingsStorageKey = 'stockMonitorSettings';
    const getSettings = () => {
      try {
        const settingsJson = localStorage.getItem(settingsStorageKey);
        if (settingsJson) {
          return JSON.parse(settingsJson);
        }
      } catch (error) {
        console.warn('Error reading settings from localStorage:', error);
      }
      
      // Default settings if not found
      return {
        stockThresholds: [],
        monitoringEnabled: true,
        defaultThreshold: 30000, // 30 seconds in milliseconds
      };
    };
    
    const checkStaleness = () => {
      const now = new Date();
      const settings = getSettings();
      
      // Skip check if monitoring is disabled
      if (!settings.monitoringEnabled) {
        if (staleStocks.length > 0) {
          setStaleStocks([]);
        }
        return;
      }
      
      const defaultThreshold = settings.defaultThreshold; // default: 30 seconds
      const newStaleStocks: Array<{ticker: string, exchange: string}> = [];
      
      Object.entries(stockTimestamps).forEach(([ticker, data]) => {
        // Check the stock's own timestamp instead of global timestamp
        const stockTime = data.priceTimestamp.getTime();
        const timeDiff = now.getTime() - stockTime;
        
        // Get custom threshold for this stock or use default
        const stockSetting = settings.stockThresholds.find((s: { ticker: string }) => s.ticker === ticker);
        const staleThreshold = stockSetting ? stockSetting.threshold : defaultThreshold;
        
        // Extract exchange from ticker if available
        let exchange = 'NSE'; // Default
        
        // Try to determine exchange based on ticker patterns
        if (ticker.includes('FUT')) {
          if (ticker.includes('NIFTY')) {
            exchange = 'NFO';
          } else if (ticker.includes('SENSEX')) {
            exchange = 'BSE';
          } else if (ticker.includes('USDINR')) {
            exchange = 'CDS';
          } else if (ticker.includes('CRUDEOIL')) {
            exchange = 'MCX';
          }
        } else if (ticker.includes('RELIANCE') || ticker.includes('INFY')) {
          exchange = 'NSE';
        }
        
        if (timeDiff > staleThreshold) {
          newStaleStocks.push({ ticker, exchange });
        }
      });
      
      // If we found new stale stocks, update the state and notify
      if (JSON.stringify(newStaleStocks.map((s: { ticker: string }) => s.ticker)) !== JSON.stringify(staleStocks.map((s: { ticker: string }) => s.ticker))) {
        setStaleStocks(newStaleStocks);
        
        // Create a notification for the stale data
        if (newStaleStocks.length > 0) {
          const staleStocksList = newStaleStocks.map((s: { ticker: string }) => s.ticker).join(', ');
          const thresholdText = newStaleStocks.length === 1 
            ? `${settings.stockThresholds.find((s: { ticker: string }) => s.ticker === newStaleStocks[0].ticker)?.threshold/1000 || defaultThreshold/1000}s` 
            : 'threshold';
            
          const notification = {
            id: Date.now().toString(),
            message: `No price changes for over ${thresholdText} in stocks: ${staleStocksList}`,
            timestamp: new Date(),
            type: 'stale' as const
          };
          
          // Add to notification history if the global function exists
          // @ts-ignore
          if (window.addStockNotification) {
            // @ts-ignore
            window.addStockNotification(notification);
            
            // Play alert sound
            unlockAudio()
              .then(() => playAlertSound(0.5))
              .then(() => console.log("Stale data alert sound played"))
              .catch(err => console.warn("Could not play stale data alert sound:", err));
          }
        }
      }
    };
    
    // Check for stale data every second
    const intervalId = setInterval(checkStaleness, 1000);
    
    return () => clearInterval(intervalId);
  }, [stockTimestamps, staleStocks]);

  // Connect to WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    console.log("Connecting to WebSocket at:", wsUrl);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus("connected");
      setRefreshTimestamp(new Date());
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as StockDataResponse;
        console.log("Received new stock data:", data);
        
        // Always update the received timestamp
        setLastDataTimestamp(data.timestamp);
        
        // Check if any price has changed
        const priceChanged = hasPriceChanged(data);
        
        // Update last price change timestamp if prices changed
        if (priceChanged) {
          console.log("Price change detected, updating timestamp");
          setLastPriceChangeTimestamp(new Date());
        }
        
        setStockData(data);
        setRefreshTimestamp(new Date());
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };
    
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("disconnected");
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("disconnected");
    };
    
    return () => {
      socket.close();
    };
  }, [hasPriceChanged]);

  // Set initial data if available
  useEffect(() => {
    if (initialData && !stockData) {
      const typedInitialData = initialData as StockDataResponse;
      setStockData(typedInitialData);
      setLastDataTimestamp(typedInitialData.timestamp);
      setLastPriceChangeTimestamp(new Date());
      
      // Initialize stock timestamps
      const initialTimestamps: StockTimestamps = {};
      
      // Initialize price history
      Object.entries(typedInitialData.data).forEach(([ticker, tickerData]) => {
        pricesHistoryRef.current[ticker] = tickerData.last_price;
        initialTimestamps[ticker] = {
          priceTimestamp: new Date(),
          lastPrice: tickerData.last_price
        };
      });
      
      setStockTimestamps(initialTimestamps);
    }
  }, [initialData, stockData]);

  // Update previous prices when new data arrives
  useEffect(() => {
    if (stockData) {
      const newPreviousPrices: Record<string, number> = { ...previousPrices };
      
      Object.entries(stockData.data).forEach(([ticker, tickerData]) => {
        if (!newPreviousPrices[ticker]) {
          newPreviousPrices[ticker] = tickerData.last_price;
        }
      });
      
      setPreviousPrices(newPreviousPrices);
    }
  }, [stockData]);

  // Update last refresh time every second
  useEffect(() => {
    if (!refreshTimestamp) return;
    
    const intervalId = setInterval(() => {
      setLastRefreshTime(getTimeSince(refreshTimestamp));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshTimestamp]);

  const refresh = useCallback(() => {
    refetch();
    setRefreshTimestamp(new Date());
  }, [refetch]);

  return {
    data: stockData,
    isLoading: isLoading && !stockData,
    isError: isError && !stockData,
    refresh,
    lastRefreshTime,
    lastDataTimestamp,
    lastPriceChangeTimestamp,
    connectionStatus,
    previousPrices,
    staleStocks
  };
};
