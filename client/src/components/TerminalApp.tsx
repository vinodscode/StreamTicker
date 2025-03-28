import { useState } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalBody from "./TerminalBody";
import TerminalFooter from "./TerminalFooter";
import StaleDataAlert from "./StaleDataAlert";
import NotificationHistory from "./NotificationHistory";
import { useStockData } from "@/hooks/useStockData";

export default function TerminalApp() {
  const [isNotificationHistoryOpen, setIsNotificationHistoryOpen] = useState(false);
  
  const { 
    data, 
    isLoading, 
    isError, 
    refresh, 
    lastRefreshTime, 
    lastDataTimestamp,
    lastPriceChangeTimestamp,
    connectionStatus, 
    previousPrices,
    staleStocks
  } = useStockData();

  // Configure stale data alert for 30 seconds of inactivity
  const STALE_DATA_THRESHOLD_MS = 30000;  // 30 seconds
  
  // Handle opening notification history
  const handleViewNotifications = () => {
    setIsNotificationHistoryOpen(true);
  };
  
  // Handle closing notification history
  const handleCloseNotifications = () => {
    setIsNotificationHistoryOpen(false);
  };
  
  // Handle clearing notifications
  const handleClearNotifications = () => {
    // Use the global function we exposed in NotificationHistory.tsx
    // @ts-ignore
    if (window.clearAllStockNotifications) {
      // @ts-ignore
      window.clearAllStockNotifications();
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-monitor-body">
      {/* Stale Data Alert - Integrated into the application's UI */}
      <div className="w-full sticky top-0 z-10">
        <StaleDataAlert 
          lastPriceChangeTime={lastPriceChangeTimestamp}
          isActive={connectionStatus === "connected" && !isLoading && !isError}
          staleDurationMs={STALE_DATA_THRESHOLD_MS}
          staleStocks={staleStocks}
        />
      </div>
      
      <div className="w-full flex-grow overflow-hidden flex flex-col relative transition-all duration-300">
        {/* Gradient accent at the top */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500"></div>
        
        <TerminalHeader 
          onRefresh={refresh} 
          onViewNotifications={handleViewNotifications}
          onClearNotifications={handleClearNotifications}
        />
        <TerminalBody 
          data={data} 
          isLoading={isLoading}
          isError={isError}
          previousPrices={previousPrices}
          refresh={refresh}
          staleStocks={staleStocks}
        />
        <TerminalFooter 
          connectionStatus={connectionStatus}
          lastRefreshTime={lastRefreshTime}
        />
      </div>
      
      {/* Notification History Modal */}
      <NotificationHistory 
        isOpen={isNotificationHistoryOpen}
        onClose={handleCloseNotifications}
      />
    </div>
  );
}
