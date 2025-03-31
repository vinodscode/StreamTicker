import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define interfaces for our settings
export interface StockThreshold {
  ticker: string;
  exchange: string;
  threshold: number; // in milliseconds
}

export interface SettingsState {
  // Per-instrument thresholds (in milliseconds)
  stockThresholds: StockThreshold[];
  // Master toggle to disable all alerts
  monitoringEnabled: boolean;
  // Default threshold for stocks without a custom setting (in milliseconds)
  defaultThreshold: number;
}

interface SettingsContextType {
  settings: SettingsState;
  updateStockThreshold: (ticker: string, exchange: string, thresholdSeconds: number) => void;
  removeStockThreshold: (ticker: string) => void;
  toggleMonitoring: () => void;
  updateDefaultThreshold: (thresholdSeconds: number) => void;
  getThresholdForStock: (ticker: string) => number;
}

// Default settings
const defaultSettings: SettingsState = {
  stockThresholds: [],
  monitoringEnabled: true,
  defaultThreshold: 30000, // 30 seconds in milliseconds
};

// Local storage key
const SETTINGS_STORAGE_KEY = 'stockMonitorSettings';

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Initialize state from local storage or default
  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Update local storage when settings change
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Check if a new day has started to reset monitoring if needed
  useEffect(() => {
    // Get current date
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check if we have a saved date
    const lastDate = localStorage.getItem('lastMonitoringDate');
    
    // If date changed and monitoring was off, enable it again
    if (lastDate && lastDate !== today && !settings.monitoringEnabled) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        monitoringEnabled: true,
      }));
    }
    
    // Save today's date
    localStorage.setItem('lastMonitoringDate', today);
  }, [settings.monitoringEnabled]);

  // Update threshold for a specific stock
  const updateStockThreshold = (ticker: string, exchange: string, thresholdSeconds: number) => {
    setSettings((prevSettings) => {
      // Remove any existing threshold for this ticker
      const filteredThresholds = prevSettings.stockThresholds.filter(
        (item) => item.ticker !== ticker
      );
      
      // Add the new threshold
      return {
        ...prevSettings,
        stockThresholds: [
          ...filteredThresholds,
          { ticker, exchange, threshold: thresholdSeconds * 1000 },
        ],
      };
    });
  };

  // Remove threshold for a stock (revert to default)
  const removeStockThreshold = (ticker: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      stockThresholds: prevSettings.stockThresholds.filter((item) => item.ticker !== ticker),
    }));
  };

  // Toggle global monitoring (on/off)
  const toggleMonitoring = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      monitoringEnabled: !prevSettings.monitoringEnabled,
    }));
  };

  // Update default threshold
  const updateDefaultThreshold = (thresholdSeconds: number) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      defaultThreshold: thresholdSeconds * 1000,
    }));
  };

  // Get threshold for a specific stock (custom or default)
  const getThresholdForStock = (ticker: string): number => {
    const stockThreshold = settings.stockThresholds.find((item) => item.ticker === ticker);
    return stockThreshold ? stockThreshold.threshold : settings.defaultThreshold;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateStockThreshold,
        removeStockThreshold,
        toggleMonitoring,
        updateDefaultThreshold,
        getThresholdForStock,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}