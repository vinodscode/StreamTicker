import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to fetch stock data
  app.get("/api/stock-data", async (req, res) => {
    try {
      // Fetch data from the external API
      const response = await fetch("https://api-ticks.rvinod.com/stream", {
        timeout: 5000, // 5 seconds timeout
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
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

  return httpServer;
}
