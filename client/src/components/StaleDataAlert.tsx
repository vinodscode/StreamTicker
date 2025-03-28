import { useEffect, useState } from "react";
import { Bell, AlertTriangle, VolumeX, Volume2, RefreshCw, ShieldAlert } from "lucide-react";
import { playAlertSound, unlockAudio } from "@/lib/audio";
import { formatTimestamp } from "@/lib/utils";

interface StaleDataAlertProps {
  lastPriceChangeTime: Date | null;
  isActive: boolean;
  staleDurationMs: number;
  staleStocks?: string[];
}

export default function StaleDataAlert({ 
  lastPriceChangeTime, 
  isActive,
  staleDurationMs = 30000, // Default to 30 seconds
  staleStocks = [] // Default to empty array
}: StaleDataAlertProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Initialize audio system on component mount
  useEffect(() => {
    // Try to initialize audio system
    unlockAudio()
      .then(() => setAudioInitialized(true))
      .catch(err => console.warn('Could not initialize audio on mount:', err));
  }, []);

  // Check if we should display the alert
  const isDisplayed = staleStocks.length > 0 && isActive;

  return (
    <div className={`w-full transition-all duration-300 ${isDisplayed ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
      {isDisplayed && (
        <div className="bg-monitor-alert border-b border-monitor-alert-border shadow-lg transition-all duration-300 flex items-center gap-4 w-full p-4">
          <div className="flex-shrink-0 animate-pulse">
            <ShieldAlert className="text-monitor-alert-icon h-8 w-8" />
          </div>
          
          <div className="flex-1">
            <div className="font-bold text-lg text-monitor-alert-title flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>STALE DATA DETECTED</span>
            </div>
            
            <p className="text-sm my-1.5 text-monitor-alert-text">
              The following stocks have not updated in more than 30 seconds:
              <span className="font-mono font-medium block mt-1.5 text-monitor-alert-highlight bg-monitor-alert-badge/20 px-3 py-1.5 rounded-md overflow-x-auto whitespace-nowrap">
                {staleStocks.join(', ')}
              </span>
            </p>
            
            <div className="text-xs text-monitor-alert-muted mt-2 flex items-center gap-1.5">
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
          
          <div className="flex-shrink-0">
            <button 
              onClick={() => {
                // Toggle sound setting
                setSoundEnabled(!soundEnabled);
                // Try to unlock audio on click
                if (!soundEnabled) {
                  unlockAudio().catch(e => console.log('Could not unlock audio:', e));
                }
              }} 
              className="p-2 bg-monitor-alert-button hover:bg-monitor-alert-button-hover rounded-md transition-colors"
              title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
            >
              {soundEnabled ? <Volume2 size={18} className="text-monitor-alert-button-icon" /> : <VolumeX size={18} className="text-monitor-alert-button-icon" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}