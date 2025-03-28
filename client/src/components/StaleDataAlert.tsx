import { useEffect, useState } from "react";
import { Bell, AlertTriangle, VolumeX, Volume2, RefreshCw } from "lucide-react";
import { playAlertSound, unlockAudio } from "@/lib/audio";

interface StaleDataAlertProps {
  lastPriceChangeTime: Date | null;
  isActive: boolean;
  staleDurationMs: number;
}

export default function StaleDataAlert({ 
  lastPriceChangeTime, 
  isActive,
  staleDurationMs = 30000 // Default to 30 seconds
}: StaleDataAlertProps) {
  const [isStale, setIsStale] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasTriggeredSound, setHasTriggeredSound] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // For testing purposes: Uncomment to force stale data regardless of timestamp
  // const forceStaleForTesting = true;
  const forceStaleForTesting = false;
  
  // Initialize audio system on component mount
  useEffect(() => {
    // Try to initialize audio system
    unlockAudio()
      .then(() => setAudioInitialized(true))
      .catch(err => console.warn('Could not initialize audio on mount:', err));
  }, []);

  useEffect(() => {
    // Reset stale status when we get a new price change
    if (lastPriceChangeTime && isActive && !forceStaleForTesting) {
      setIsStale(false);
      setHasTriggeredSound(false);
    }
  }, [lastPriceChangeTime, isActive, forceStaleForTesting]);

  // Check data staleness periodically
  useEffect(() => {
    // Skip checks when inactive
    if (!isActive && !forceStaleForTesting) return;
    
    const checkInterval = setInterval(() => {
      if (!lastPriceChangeTime && !forceStaleForTesting) return;
      
      const lastUpdate = lastPriceChangeTime 
        ? lastPriceChangeTime.getTime() 
        : Date.now() - staleDurationMs - 1000; // For testing
      
      const now = Date.now();
      const elapsed = now - lastUpdate;
      
      setTimeSinceUpdate(elapsed);
      
      // Determine if data is stale (no price changes for 30 seconds)
      const shouldBeStale = elapsed > staleDurationMs || forceStaleForTesting;
      
      if (shouldBeStale && !isStale) {
        setIsStale(true);
        
        // Add to notification history
        const message = `No price changes detected in ${(elapsed / 1000).toFixed(0)} seconds. Data may be stale.`;
        const notification = {
          id: Date.now().toString(),
          message,
          timestamp: new Date(),
          type: 'stale' as const
        };
        
        // Add to notification history if the global function exists
        // @ts-ignore
        if (window.addStockNotification) {
          // @ts-ignore
          window.addStockNotification(notification);
        }
        
        // Play sound if enabled and not already played for this stale event
        if (soundEnabled && !hasTriggeredSound) {
          // Try to unlock audio first, then play the sound
          unlockAudio()
            .then(() => playAlertSound(0.5))
            .then(() => console.log("Alert sound played successfully"))
            .catch(() => console.warn("Could not play alert sound"));
          
          setHasTriggeredSound(true);
        }
      }
    }, 1000); // Check every second
    
    return () => clearInterval(checkInterval);
  }, [lastPriceChangeTime, isActive, isStale, staleDurationMs, soundEnabled, hasTriggeredSound, forceStaleForTesting]);

  // Create an empty element when no alert to preserve layout
  const isDisplayed = (lastPriceChangeTime && isStale) || forceStaleForTesting;

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
              <span className="font-mono font-bold">{(timeSinceUpdate / 1000).toFixed(0)}</span> seconds since last price change.
              The stock prices have not updated for more than 30 seconds and may be stale.
            </p>
            <div className="text-xs dark:text-gray-300 light:text-red-700 mt-1 flex items-center gap-1">
              <RefreshCw size={12} className="animate-spin" />
              <span>
                Last price change: {lastPriceChangeTime 
                  ? lastPriceChangeTime.toLocaleTimeString() 
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