import { useEffect, useState } from "react";
import { Bell, AlertTriangle, VolumeX, Volume2, RefreshCw } from "lucide-react";
import { playAlertSound } from "@/lib/audio";

interface StaleDataAlertProps {
  lastUpdateTimestamp: string | null;
  isActive: boolean;
  staleDurationMs: number;
}

export default function StaleDataAlert({ 
  lastUpdateTimestamp, 
  isActive,
  staleDurationMs = 20000 // Default to 20 seconds
}: StaleDataAlertProps) {
  const [isStale, setIsStale] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasTriggeredSound, setHasTriggeredSound] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  // For testing purposes: Uncomment to force stale data regardless of timestamp
  const forceStaleForTesting = true;
  // const forceStaleForTesting = false;

  useEffect(() => {
    // Reset stale status when we get a new update
    if (lastUpdateTimestamp && isActive && !forceStaleForTesting) {
      setIsStale(false);
      setHasTriggeredSound(false);
    }
  }, [lastUpdateTimestamp, isActive, forceStaleForTesting]);

  // Check data staleness periodically
  useEffect(() => {
    // Skip checks when inactive
    if (!isActive && !forceStaleForTesting) return;
    
    const checkInterval = setInterval(() => {
      if (!lastUpdateTimestamp && !forceStaleForTesting) return;
      
      const lastUpdate = lastUpdateTimestamp 
        ? new Date(lastUpdateTimestamp).getTime() 
        : Date.now() - staleDurationMs - 1000; // For testing
      
      const now = Date.now();
      const elapsed = now - lastUpdate;
      
      setTimeSinceUpdate(elapsed);
      
      // Determine if data is stale
      const shouldBeStale = elapsed > staleDurationMs || forceStaleForTesting;
      
      if (shouldBeStale && !isStale) {
        setIsStale(true);
        
        // Play sound if enabled and not already played for this stale event
        if (soundEnabled && !hasTriggeredSound) {
          playAlertSound(0.5).catch(err => 
            console.error("Failed to play alert sound:", err)
          );
          setHasTriggeredSound(true);
        }
      }
    }, 1000); // Check every second
    
    return () => clearInterval(checkInterval);
  }, [lastUpdateTimestamp, isActive, isStale, staleDurationMs, soundEnabled, hasTriggeredSound, forceStaleForTesting]);

  // No alert when there's no data or it's not stale (unless we're forcing for testing)
  if ((!lastUpdateTimestamp || !isStale) && !forceStaleForTesting) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-red-900 border border-red-700 text-white p-4 rounded-md shadow-lg animate-pulse max-w-md transition-all duration-300 flex items-center gap-3">
        <AlertTriangle className="text-yellow-300" />
        <div className="flex-1">
          <div className="font-bold mb-1 text-yellow-300">Data Feed Alert</div>
          <p className="text-sm">
            No updates received in over {(timeSinceUpdate / 1000).toFixed(0)} seconds. 
            The stock data may be stale or the connection might be interrupted.
          </p>
          <div className="text-xs text-gray-300 mt-2 flex items-center gap-1">
            <RefreshCw size={12} className="animate-spin" />
            <span>
              Last update: {lastUpdateTimestamp 
                ? new Date(lastUpdateTimestamp).toLocaleTimeString() 
                : "Unknown"}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className="p-2 hover:bg-red-800 rounded-full"
          title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </div>
  );
}