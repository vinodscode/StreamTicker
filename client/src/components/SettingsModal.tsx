import React, { useState } from 'react';
import { X, Info, Clock, AlertTriangle, Settings as SettingsIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStocks: Array<{ ticker: string; exchange: string }>;
}

export default function SettingsModal({ isOpen, onClose, availableStocks }: SettingsModalProps) {
  const { 
    settings, 
    updateStockThreshold, 
    removeStockThreshold, 
    toggleMonitoring,
    updateDefaultThreshold 
  } = useSettings();
  
  const [editingThreshold, setEditingThreshold] = useState<{
    ticker: string;
    seconds: number;
  } | null>(null);
  
  const [defaultThresholdInput, setDefaultThresholdInput] = useState(settings.defaultThreshold / 1000);

  // Handle threshold change for a stock
  const handleThresholdChange = (ticker: string, exchange: string) => {
    if (editingThreshold && editingThreshold.ticker === ticker) {
      // Save the edited threshold
      updateStockThreshold(ticker, exchange, editingThreshold.seconds);
      setEditingThreshold(null);
    } else {
      // Start editing this stock's threshold
      const existingThreshold = settings.stockThresholds.find(s => s.ticker === ticker);
      setEditingThreshold({
        ticker,
        seconds: existingThreshold ? existingThreshold.threshold / 1000 : settings.defaultThreshold / 1000
      });
    }
  };

  // Handle removing a custom threshold
  const handleRemoveThreshold = (ticker: string) => {
    removeStockThreshold(ticker);
    if (editingThreshold && editingThreshold.ticker === ticker) {
      setEditingThreshold(null);
    }
  };

  // Handle default threshold change
  const handleDefaultThresholdChange = () => {
    updateDefaultThreshold(defaultThresholdInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-monitor-card border border-monitor rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-monitor-card-header border-b border-monitor">
          <div className="font-bold text-lg text-monitor-heading flex items-center gap-2">
            <SettingsIcon size={18} className="text-monitor-accent" />
            <span>Alert Settings</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-monitor-card-hover"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Global Monitoring Toggle */}
          <div className="mb-6 bg-monitor-card-accent p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className={settings.monitoringEnabled ? "text-green-500" : "text-monitor-muted"} />
                <span className="font-medium">Enable Monitoring Today</span>
              </div>
              <button 
                onClick={toggleMonitoring}
                className="text-monitor-accent p-1"
                aria-label={settings.monitoringEnabled ? "Disable monitoring" : "Enable monitoring"}
              >
                {settings.monitoringEnabled ? (
                  <ToggleRight size={24} className="text-green-500" />
                ) : (
                  <ToggleLeft size={24} className="text-monitor-muted" />
                )}
              </button>
            </div>
            <p className="text-xs text-monitor-muted mt-2">
              {settings.monitoringEnabled 
                ? "Monitoring is active. You will receive alerts for stale data." 
                : "Monitoring is disabled. You won't receive any alerts until tomorrow."}
            </p>
          </div>
          
          {/* Default Threshold */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-sm flex items-center gap-1.5">
                <Clock size={16} className="text-monitor-accent" />
                Default Alert Threshold
              </label>
              
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="5"
                  max="300"
                  value={defaultThresholdInput}
                  onChange={(e) => setDefaultThresholdInput(Number(e.target.value))}
                  onBlur={handleDefaultThresholdChange}
                  className="w-16 p-1 text-right bg-monitor-input border border-monitor rounded-md"
                />
                <span className="text-sm text-monitor-muted">seconds</span>
              </div>
            </div>
            <p className="text-xs text-monitor-muted">
              Applied to all instruments without a custom threshold
            </p>
          </div>
          
          {/* Stock-specific thresholds */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Per-Instrument Thresholds</h3>
            </div>
            
            <div className="border border-monitor rounded-md overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {availableStocks.length === 0 ? (
                  <div className="p-3 text-sm text-monitor-muted italic">
                    No stock data available
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-monitor-card-header text-xs">
                      <tr>
                        <th className="text-left p-2">Stock</th>
                        <th className="text-left p-2">Exchange</th>
                        <th className="text-right p-2">Threshold</th>
                        <th className="p-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-monitor">
                      {availableStocks.map((stock) => {
                        const customThreshold = settings.stockThresholds.find(
                          (s) => s.ticker === stock.ticker
                        );
                        
                        const isEditing = editingThreshold && editingThreshold.ticker === stock.ticker;
                        
                        return (
                          <tr key={stock.ticker} className="hover:bg-monitor-card-hover">
                            <td className="p-2 text-sm font-mono">{stock.ticker}</td>
                            <td className="p-2 text-sm text-monitor-muted">{stock.exchange}</td>
                            <td className="p-2 text-right text-sm">
                              {isEditing ? (
                                <input 
                                  type="number"
                                  min="5"
                                  max="300" 
                                  value={editingThreshold.seconds}
                                  onChange={(e) => setEditingThreshold({
                                    ...editingThreshold,
                                    seconds: Number(e.target.value)
                                  })}
                                  className="w-16 p-1 text-right bg-monitor-input border border-monitor rounded-md"
                                  autoFocus
                                />
                              ) : (
                                <span>
                                  {customThreshold 
                                    ? `${customThreshold.threshold / 1000}s` 
                                    : `${settings.defaultThreshold / 1000}s (default)`}
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              {customThreshold ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleThresholdChange(stock.ticker, stock.exchange)}
                                    className="p-1 text-monitor-accent hover:bg-monitor/20 rounded"
                                    title={isEditing ? "Save" : "Edit"}
                                  >
                                    {isEditing ? "✓" : "✎"}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveThreshold(stock.ticker)}
                                    className="p-1 text-monitor-warning hover:bg-monitor-warning/20 rounded"
                                    title="Reset to default"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleThresholdChange(stock.ticker, stock.exchange)}
                                  className="p-1 text-monitor-accent hover:bg-monitor/20 rounded"
                                  title="Set custom threshold"
                                >
                                  ✎
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 mt-2 text-xs text-monitor-muted">
              <Info size={12} />
              <span>Custom thresholds are saved across sessions</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-monitor p-3 bg-monitor-card-footer flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-monitor-accent text-white rounded-md hover:bg-monitor-accent/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}