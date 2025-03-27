import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockData, StockDataResponse } from "@/lib/api";
import { getTimeSince } from "@/lib/utils";

export const useStockData = () => {
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("never");
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date | null>(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState<string | null>(null);
  const [lastUniqueTimestamp, setLastUniqueTimestamp] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const previousDataRef = useRef<string | null>(null);

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
        
        // Check if this is actually new data or the same data repeating
        const dataString = JSON.stringify(data);
        if (dataString !== previousDataRef.current) {
          // This is unique data, update our unique timestamp
          setLastUniqueTimestamp(data.timestamp);
          previousDataRef.current = dataString;
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
  }, []);

  // Set initial data if available
  useEffect(() => {
    if (initialData && !stockData) {
      const typedInitialData = initialData as StockDataResponse;
      setStockData(typedInitialData);
      setLastDataTimestamp(typedInitialData.timestamp);
      setLastUniqueTimestamp(typedInitialData.timestamp);
      previousDataRef.current = JSON.stringify(typedInitialData);
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
    lastUniqueTimestamp,
    connectionStatus,
    previousPrices
  };
};
