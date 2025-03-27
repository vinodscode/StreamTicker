import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockData, StockDataResponse } from "@/lib/api";
import { getTimeSince } from "@/lib/utils";

export const useStockData = () => {
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("never");
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);

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
      setStockData(initialData as StockDataResponse);
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
    connectionStatus,
    previousPrices
  };
};
