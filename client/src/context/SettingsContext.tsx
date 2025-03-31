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
  // Per-exchange segment alert toggles
  exchangeAlerts: {
    NSE: boolean;
    BSE: boolean;
    MCX: boolean;
    NFO: boolean;
    CDS: boolean;
    BFO: boolean;
    [key: string]: boolean; // Allow for any other exchanges
  };
}

interface SettingsContextType {
  settings: SettingsState;
  updateStockThreshold: (ticker: string, exchange: string, thresholdSeconds: number) => void;
  removeStockThreshold: (ticker: string) => void;
  toggleMonitoring: () => void;
  toggleExchangeAlert: (exchange: string) => void;
  updateDefaultThreshold: (thresholdSeconds: number) => void;
  getThresholdForStock: (ticker: string) => number;
}

// Default settings
const defaultSettings: SettingsState = {
  stockThresholds: [],
  monitoringEnabled: true,
  defaultThreshold: 30000, // 30 seconds in milliseconds
  exchangeAlerts: {
    NSE: true,
    BSE: true,
    MCX: true,
    NFO: true,
    CDS: true,
    BFO: true
  }
};

// Local storage key
const SETTINGS_STORAGE_KEY = 'stockMonitorSettings';

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Initialize state from local storage or default
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      
      // If there are saved settings, parse them
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Check if exchangeAlerts property exists - if not, this is an old settings format
        // that needs to be migrated to the new format
        if (!parsedSettings.exchangeAlerts) {
          return {
            ...parsedSettings,
            exchangeAlerts: defaultSettings.exchangeAlerts
          };
        }
        
        return parsedSettings;
      }
      
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
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

  // Toggle alerts for a specific exchange
  const toggleExchangeAlert = (exchange: string) => {
    setSettings((prevSettings) => {
      if (exchange in prevSettings.exchangeAlerts) {
        const exchangeAlerts = { ...prevSettings.exchangeAlerts };
        // Use string indexing now that we've added [key: string]: boolean
        exchangeAlerts[exchange] = !exchangeAlerts[exchange];
        
        return {
          ...prevSettings,
          exchangeAlerts
        };
      } else {
        // If the exchange doesn't exist in our alerts, add it with true as default
        return {
          ...prevSettings,
          exchangeAlerts: {
            ...prevSettings.exchangeAlerts,
            [exchange]: true
          }
        };
      }
    });
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
        toggleExchangeAlert,
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