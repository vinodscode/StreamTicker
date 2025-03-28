import { useEffect, useState } from "react";
import { Bell, X, VolumeX, Volume2, RefreshCw, ShieldAlert } from "lucide-react";
import { playAlertSound, unlockAudio } from "@/lib/audio";
import { shouldShowStaleAlert } from "@/lib/marketHours";

interface StaleDataAlertProps {
  lastPriceChangeTime: Date | null;
  isActive: boolean;
  staleDurationMs: number;
  staleStocks?: Array<{ticker: string, exchange: string}>;
}

export default function StaleDataAlert({ 
  lastPriceChangeTime, 
  isActive,
  staleDurationMs = 30000, // Default to 30 seconds
  staleStocks = [] // Default to empty array
}: StaleDataAlertProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
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

  // Filter stocks based on market hours
  const filteredStaleStocks = staleStocks.filter(stock => 
    shouldShowStaleAlert(stock.exchange)
  );
  
  // Check if we should display the alert based on filtered stocks
  const isDisplayed = filteredStaleStocks.length > 0 && isActive && isVisible;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 
      ${isDisplayed ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
    >
      {isDisplayed && (
        <div className="bg-monitor-alert border border-monitor-alert-border shadow-2xl rounded-lg 
          transition-all duration-300 flex flex-col w-full overflow-hidden animate-in slide-in-from-top">
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-monitor-alert-header border-b border-monitor-alert-border">
            <div className="font-bold text-base text-monitor-alert-title flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-monitor-alert-icon" />
              <span>STALE DATA ALERT</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  // Toggle sound setting
                  setSoundEnabled(!soundEnabled);
                  // Try to unlock audio on click
                  if (!soundEnabled) {
                    unlockAudio().catch(e => console.log('Could not unlock audio:', e));
                  }
                }} 
                className="p-1.5 hover:bg-monitor-alert-button hover:bg-opacity-20 rounded-md transition-colors"
                title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
              >
                {soundEnabled ? 
                  <Volume2 size={16} className="text-monitor-alert-button-icon" /> : 
                  <VolumeX size={16} className="text-monitor-alert-button-icon" />
                }
              </button>
              
              <button 
                onClick={() => setIsVisible(false)} 
                className="p-1.5 hover:bg-monitor-alert-button hover:bg-opacity-20 rounded-md transition-colors"
                title="Close alert"
              >
                <X size={16} className="text-monitor-alert-button-icon" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 animate-pulse mt-0.5">
                <Bell className="text-monitor-alert-icon h-5 w-5" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-monitor-alert-text">
                  The following stocks have not updated in more than {staleDurationMs/1000} seconds:
                </p>
                
                <div className="font-mono text-xs mt-2 space-y-1.5">
                  {filteredStaleStocks.map(stock => (
                    <div key={stock.ticker} className="flex items-center justify-between text-monitor-alert-highlight bg-monitor-alert-badge/20 px-2 py-1 rounded">
                      <span>{stock.ticker}</span>
                      <span className="text-monitor-alert-muted">{stock.exchange}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-monitor-alert-muted mt-3 flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin" />
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
        </div>
      )}
    </div>
  );
}