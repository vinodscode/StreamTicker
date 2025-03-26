import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStockData, StockDataResponse } from "@/lib/api";
import { getTimeSince } from "@/lib/utils";

export const useStockData = () => {
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("never");
  const [refreshTimestamp, setRefreshTimestamp] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");

  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['/api/stock-data'],
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Update previous prices when new data arrives
  useEffect(() => {
    if (data) {
      const newPreviousPrices: Record<string, number> = { ...previousPrices };
      
      Object.entries(data.data).forEach(([ticker, tickerData]) => {
        if (!newPreviousPrices[ticker]) {
          newPreviousPrices[ticker] = tickerData.last_price;
        }
      });
      
      setPreviousPrices(newPreviousPrices);
    }
  }, [data]);

  // Update connection status
  useEffect(() => {
    if (isError) {
      setConnectionStatus("disconnected");
    } else if (data) {
      setConnectionStatus("connected");
    }
  }, [data, isError]);

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
    data: data as StockDataResponse | null,
    isLoading,
    isError,
    refresh,
    lastRefreshTime,
    connectionStatus,
    previousPrices
  };
};
