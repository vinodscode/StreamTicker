import { useEffect, useState } from "react";
import { Bell, X, VolumeX, Volume2, RefreshCw, ShieldAlert, Settings } from "lucide-react";
import { playAlertSound, unlockAudio } from "@/lib/audio";
import { shouldShowStaleAlert } from "@/lib/marketHours";
import { useSettings } from "@/context/SettingsContext";

interface StaleDataAlertProps {
  lastPriceChangeTime: Date | null;
  isActive: boolean;
  staleDurationMs?: number; // Now optional as we'll use settings
  staleStocks?: Array<{ticker: string, exchange: string}>;
  onSettingsClick?: () => void;
}

export default function StaleDataAlert({ 
  lastPriceChangeTime, 
  isActive,
  staleDurationMs, // This is now optional and used as a fallback
  staleStocks = [], // Default to empty array
  onSettingsClick
}: StaleDataAlertProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Get settings from context
  const { settings } = useSettings();
  
  // Initialize audio system on component mount
  useEffect(() => {
    // Try to initialize audio system
    unlockAudio()
      .then(() => setAudioInitialized(true))
      .catch(err => console.warn('Could not initialize audio on mount:', err));
  }, []);

  // Reset visibility when stocks change
  useEffect(() => {
    if (staleStocks.length > 0) {
      setIsVisible(true);
    }
  }, [staleStocks]);

  // Filter stocks based on market hours, monitoring settings, and exchange-specific alerts
  const filteredStaleStocks = staleStocks.filter(stock => {
    // Check if exchange alerts are enabled for this exchange
    // Default to true if the exchange is not in our settings (allow alerts for unknown exchanges)
    const exchangeKey = stock.exchange as keyof typeof settings.exchangeAlerts;
    const exchangeAlertsEnabled = settings.exchangeAlerts[exchangeKey] !== undefined 
      ? settings.exchangeAlerts[exchangeKey] 
      : true;
    
    // Only include if:
    // 1. Global monitoring is enabled
    // 2. The market for this exchange is open
    // 3. Alerts for this specific exchange are enabled
    return settings.monitoringEnabled && 
           shouldShowStaleAlert(stock.exchange) && 
           exchangeAlertsEnabled;
  });
  
  // Check if we should display the alert based on filtered stocks
  const isDisplayed = filteredStaleStocks.length > 0 && isActive && isVisible;

  // Get the default threshold from settings (fallback to prop if provided)
  const defaultThreshold = staleDurationMs || settings.defaultThreshold;

  return (
    <div className={`w-full z-50 transition-all duration-300 
      ${isDisplayed ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
    >
      {isDisplayed && (
        <div className="bg-monitor-alert border border-monitor-alert-border shadow-lg 
          transition-all duration-300 flex flex-col w-full overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-monitor-alert-header border-b border-monitor-alert-border">
            <div className="font-bold text-sm text-monitor-alert-title flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-monitor-alert-icon" />
              <span>STALE DATA ALERT</span>
            </div>
            
            <div className="flex items-center gap-1">
              {onSettingsClick && (
                <button 
                  onClick={onSettingsClick} 
                  className="p-1 hover:bg-monitor-alert-button hover:bg-opacity-20 rounded-md transition-colors"
                  title="Alert settings"
                >
                  <Settings size={14} className="text-monitor-alert-button-icon" />
                </button>
              )}
              
              <button 
                onClick={() => {
                  // Toggle sound setting
                  setSoundEnabled(!soundEnabled);
                  // Try to unlock audio on click
                  if (!soundEnabled) {
                    unlockAudio().catch(e => console.log('Could not unlock audio:', e));
                  }
                }} 
                className="p-1 hover:bg-monitor-alert-button hover:bg-opacity-20 rounded-md transition-colors"
                title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
              >
                {soundEnabled ? 
                  <Volume2 size={14} className="text-monitor-alert-button-icon" /> : 
                  <VolumeX size={14} className="text-monitor-alert-button-icon" />
                }
              </button>
              
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1 hover:bg-monitor-alert-button hover:bg-opacity-20 rounded-md transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "−" : "+"}
              </button>
              
              <button 
                onClick={() => setIsVisible(false)} 
                className="p-1 hover:bg-monitor-alert-button hover:bg-opacity-20 rounded-md transition-colors"
                title="Close alert"
              >
                <X size={14} className="text-monitor-alert-button-icon" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          {isExpanded && (
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 animate-pulse mt-0.5">
                  <Bell className="text-monitor-alert-icon h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-monitor-alert-text">
                    The following stocks have not updated in more than their threshold time:
                  </p>
                  
                  <div className="font-mono text-xs mt-2 space-y-1">
                    {filteredStaleStocks.map(stock => {
                      // Get specific threshold for this stock or use default
                      const stockThreshold = settings.stockThresholds.find(s => s.ticker === stock.ticker);
                      const thresholdSeconds = stockThreshold 
                        ? stockThreshold.threshold / 1000 
                        : defaultThreshold / 1000;
                        
                      return (
                        <div key={stock.ticker} className="flex items-center justify-between text-monitor-alert-highlight bg-monitor-alert-badge/20 px-2 py-1 rounded">
                          <span>{stock.ticker}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-monitor-alert-muted text-xxs">{thresholdSeconds}s threshold</span>
                            <span className="text-monitor-alert-muted">{stock.exchange}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="text-xs text-monitor-alert-muted mt-2 flex items-center gap-1.5">
                    <RefreshCw size={10} className="animate-spin" />
                    <span>
                      Last price update: {lastPriceChangeTime 
                        ? new Date(lastPriceChangeTime).toLocaleTimeString('en-IN', {
                            hour: "2-digit" as const,
                            minute: "2-digit" as const,
                            second: "2-digit" as const,
                            hour12: true,
                            timeZone: 'Asia/Kolkata'
                          })
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}