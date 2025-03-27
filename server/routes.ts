import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import fetch from "node-fetch";
import WebSocket from "ws";

let lastStockData: any = null;

// Helper function to parse SSE data
function parseSSEData(text: string): any | null {
  const dataMatches = text.match(/data: ({.*?})\n/);
  if (!dataMatches || !dataMatches[1]) {
    return null;
  }
  
  try {
    return JSON.parse(dataMatches[1]);
  } catch (e) {
    console.error('Failed to parse SSE data:', e);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch stock data
  app.get("/api/stock-data", async (req, res) => {
    try {
      if (lastStockData) {
        // Return cached data if available
        return res.json(lastStockData);
      }
      
      // If no cached data, fetch a single response from the API
      const response = await fetch("https://api-ticks.rvinod.com/stream");
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      // For SSE, we need to read the text directly, not as JSON
      const text = await response.text();
      const data = parseSSEData(text);
      
      if (!data) {
        throw new Error("No data found in response");
      }
      
      lastStockData = data;
      res.json(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ 
        message: "Failed to fetch stock data",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Set up SSE connection to the API
    setupStockDataStream(ws);
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}

function setupStockDataStream(ws: WebSocket) {
  let isConnected = false;
  
  // Setup a simulated data stream for testing
  const setupSimulatedDataStream = () => {
    console.log('Setting up simulated data stream...');
    
    // Mock data structure
    const mockData = {
      timestamp: new Date().toISOString(),
      data: {
        "AAPL": { last_price: 180.50, timestamp: new Date().toISOString() },
        "MSFT": { last_price: 350.20, timestamp: new Date().toISOString() },
        "GOOG": { last_price: 139.80, timestamp: new Date().toISOString() },
        "AMZN": { last_price: 178.30, timestamp: new Date().toISOString() },
        "META": { last_price: 472.10, timestamp: new Date().toISOString() }
      }
    };
    
    // Send initial data
    lastStockData = mockData;
    if (ws.readyState === WebSocket.OPEN) {
      console.log('Sending mock data to client...');
      ws.send(JSON.stringify(mockData));
    }
    
    // Set up interval to simulate streaming data
    const interval = setInterval(() => {
      // Only continue if the connection is still open
      if (ws.readyState !== WebSocket.OPEN) {
        console.log('WebSocket connection closed, stopping simulation');
        clearInterval(interval);
        return;
      }
      
      // Generate new random price changes
      const newData = {...mockData};
      newData.timestamp = new Date().toISOString();
      
      Object.keys(newData.data).forEach(ticker => {
        // Random price change between -2% and +2%
        const changePercent = (Math.random() * 4) - 2;
        const currentPrice = newData.data[ticker].last_price;
        const newPrice = currentPrice * (1 + (changePercent / 100));
        
        newData.data[ticker] = {
          last_price: parseFloat(newPrice.toFixed(2)),
          timestamp: new Date().toISOString()
        };
      });
      
      // Update last data and send to client
      lastStockData = newData;
      console.log(`Sending updated mock data: ${new Date().toLocaleTimeString()}`);
      ws.send(JSON.stringify(newData));
      
    }, 3000); // Update every 3 seconds
    
    // Clean up interval when connection closes
    ws.on('close', () => {
      console.log('Connection closed, cleaning up interval');
      clearInterval(interval);
    });
  };
  
  const processSSEData = (data: string) => {
    console.log('Received SSE data chunk:', data.substring(0, 50) + '...');
    const lines = data.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6);
        try {
          const data = JSON.parse(jsonStr);
          lastStockData = data;
          
          // Send data to client if connection is still open
          if (ws.readyState === WebSocket.OPEN) {
            console.log('Sending data to client via WebSocket');
            ws.send(JSON.stringify(data));
          }
        } catch (e) {
          console.error('Error parsing JSON from SSE:', e);
        }
      }
    }
  };
  
  const connectToSSE = () => {
    if (isConnected) return;
    isConnected = true;
    
    console.log('Starting SSE connection to stock API...');
    
    fetch("https://api-ticks.rvinod.com/stream")
      .then(response => {
        console.log('API response received:', response.status, response.statusText);
        console.log('Response headers:', JSON.stringify([...response.headers.entries()]));
        
        if (!response.ok || !response.body) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        // Handle the response body as a stream
        const stream = response.body;
        
        stream.on('data', (chunk) => {
          const data = chunk.toString();
          console.log(`Received data chunk of length: ${data.length}`);
          processSSEData(data);
        });
        
        stream.on('end', () => {
          console.log('SSE stream ended');
          isConnected = false;
          
          // Try to reconnect after a delay
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              connectToSSE();
            }
          }, 5000);
        });
        
        stream.on('error', (error) => {
          console.error('SSE stream error:', error);
          isConnected = false;
          
          // Try to reconnect after a delay
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              connectToSSE();
            }
          }, 5000);
        });
      })
      .catch(error => {
        console.error('Error setting up SSE connection:', error);
        isConnected = false;
        
        console.log('Falling back to simulated data stream');
        setupSimulatedDataStream();
      });
  };
  
  // Start the connection
  connectToSSE();
}