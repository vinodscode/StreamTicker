import { apiRequest } from "./queryClient";

export interface StockDataResponse {
  timestamp: string;
  data: Record<string, {
    last_price: number;
    timestamp: string;
  }>;
}

export async function fetchStockData(): Promise<StockDataResponse> {
  const response = await apiRequest("GET", "/api/stock-data", undefined);
  return await response.json();
}
