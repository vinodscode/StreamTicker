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
  
  const processSSEData = (data: string) => {
    console.log('Received SSE data chunk');
    const lines = data.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6);
        try {
          const data = JSON.parse(jsonStr);
          lastStockData = data;
          
          // Send data to client if connection is still open
          if (ws.readyState === WebSocket.OPEN) {
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
        
        if (!response.ok || !response.body) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        // Handle the response body as a stream
        const stream = response.body;
        
        stream.on('data', (chunk) => {
          const data = chunk.toString();
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
        
        // Try to reconnect after a delay
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            connectToSSE();
          }
        }, 5000);
      });
  };
  
  // Start the connection
  connectToSSE();
}