import { useEffect, useState } from "react";
import { Bell, AlertTriangle, VolumeX, Volume2, RefreshCw } from "lucide-react";
import { playAlertSound, unlockAudio } from "@/lib/audio";
import { formatTimestamp } from "@/lib/utils";

interface StaleDataAlertProps {
  lastPriceChangeTime: Date | null;
  isActive: boolean;
  staleDurationMs: number;
  staleStocks?: string[]; // Add the stale stocks list
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
    <div className={`w-full transition-all duration-300 ${isDisplayed ? 'opacity-100' : 'opacity-0 h-0'}`}>
      {isDisplayed && (
        <div className="dark:bg-gradient-to-r dark:from-red-900 dark:to-red-800 dark:border-red-700 light:bg-gradient-to-r light:from-red-100 light:to-red-200 light:border-red-300 border-b dark:text-white light:text-red-900 py-3 px-4 shadow-lg transition-all duration-300 flex items-center gap-3 w-full">
          <div className="animate-pulse">
            <AlertTriangle className="dark:text-yellow-300 light:text-red-500 h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg dark:text-yellow-300 light:text-red-600 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>DATA FEED ALERT</span>
            </div>
            <p className="text-sm my-1">
              The following stocks have not updated for more than 30 seconds and may be stale:
              <span className="font-mono font-bold block mt-1 dark:text-yellow-200 light:text-red-600">
                {staleStocks.join(', ')}
              </span>
            </p>
            <div className="text-xs dark:text-gray-300 light:text-red-700 mt-1 flex items-center gap-1">
              <RefreshCw size={12} className="animate-spin" />
              <span>
                Last global price change: {lastPriceChangeTime 
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
          <button 
            onClick={() => {
              // Toggle sound setting
              setSoundEnabled(!soundEnabled);
              // Try to unlock audio on click
              if (!soundEnabled) {
                unlockAudio().catch(e => console.log('Could not unlock audio:', e));
              }
            }} 
            className="p-2 dark:hover:bg-red-950 dark:bg-red-950/50 light:hover:bg-red-300 light:bg-red-200 rounded-full transition-colors"
            title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      )}
    </div>
  );
}