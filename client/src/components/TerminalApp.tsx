import { useState } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalBody from "./TerminalBody";
import TerminalFooter from "./TerminalFooter";
import StaleDataAlert from "./StaleDataAlert";
import NotificationHistory from "./NotificationHistory";
import SettingsModal from "./SettingsModal";
import { useStockData } from "@/hooks/useStockData";

export default function TerminalApp() {
  const [isNotificationHistoryOpen, setIsNotificationHistoryOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
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
  
  // Handle opening settings modal
  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
  };
  
  // Handle closing settings modal
  const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
  };
  
  // Extract available stocks from current data
  const availableStocks = data 
    ? Object.keys(data.data).map(ticker => {
        // Extract exchange from ticker using the same logic as in useStockData
        let exchange = 'NSE'; // Default
        
        if (ticker.includes('FUT')) {
          if (ticker.includes('NIFTY')) {
            exchange = 'NFO';
          } else if (ticker.includes('SENSEX')) {
            exchange = 'BSE';
          } else if (ticker.includes('USDINR')) {
            exchange = 'CDS';
          } else if (ticker.includes('CRUDEOIL')) {
            exchange = 'MCX';
          }
        } else if (ticker.includes('RELIANCE') || ticker.includes('INFY')) {
          exchange = 'NSE';
        }
        
        return { ticker, exchange };
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col w-full bg-monitor-body">
      {/* Stale Data Alert - Now positioned as a banner at the top */}
      <div className="w-full sticky top-0 z-10">
        <StaleDataAlert 
          lastPriceChangeTime={lastPriceChangeTimestamp}
          isActive={connectionStatus === "connected" && !isLoading && !isError}
          staleStocks={staleStocks}
          onSettingsClick={handleOpenSettings}
        />
      </div>
      
      <div className="w-full flex-grow overflow-hidden flex flex-col relative transition-all duration-300">
        {/* Gradient accent at the top */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500"></div>
        
        <TerminalHeader 
          onRefresh={refresh} 
          onViewNotifications={handleViewNotifications}
          onClearNotifications={handleClearNotifications}
          onOpenSettings={handleOpenSettings}
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
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettings}
        availableStocks={availableStocks}
      />
    </div>
  );
}
