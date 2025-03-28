import { RefreshCw, Database, Wifi, Info, Terminal, X, Bell, Sun, Moon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface TerminalHeaderProps {
  onRefresh: () => void;
  onViewNotifications: () => void;
  onClearNotifications: () => void;
}

export default function TerminalHeader({ 
  onRefresh, 
  onViewNotifications,
  onClearNotifications 
}: TerminalHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="dark:bg-gradient-to-r dark:from-terminal-header dark:to-gray-900 light:bg-gradient-to-r light:from-gray-200 light:to-gray-100 p-4 border-b border-terminal-border flex items-center sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-terminal-negative hover:brightness-125 transition-all cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-125 transition-all cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-terminal-positive hover:brightness-125 transition-all cursor-pointer"></div>
        </div>
        
        <div className="bg-terminal-accent/20 p-2 rounded-full">
          <Terminal className="text-terminal-accent" size={18} />
        </div>
        
        <div>
          <div className="font-bold text-lg dark:text-white light:text-gray-800">
            STOCK <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">TERMINAL</span>
          </div>
          <div className="text-xs text-terminal-muted">Real-time financial data streaming platform</div>
        </div>
      </div>
      
      <div className="text-terminal-muted flex-1 text-center flex items-center justify-center gap-2 ml-6">
        <Database size={16} className="text-terminal-accent" />
        <span className="font-medium tracking-wide">LIVE MARKET FEED</span>
        <Wifi size={16} className="text-terminal-positive animate-pulse" />
      </div>
      
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setShowInfo(!showInfo)}
          className="dark:hover:bg-gray-800 light:bg-gray-200 light:hover:bg-gray-300 p-2 rounded-md relative transition-colors focus:outline-none cursor-pointer"
          title="Information"
        >
          <Info size={18} className="text-terminal-muted hover:text-terminal-accent transition-colors" />
          
          {showInfo && (
            <div className="absolute right-0 top-full mt-2 w-80 dark:bg-gray-900 light:bg-white border border-terminal-border p-4 rounded-md shadow-lg z-10 text-sm text-terminal-text">
              <h4 className="font-bold mb-2 text-terminal-accent flex items-center">
                <Terminal size={14} className="mr-1" /> 
                About Stock Terminal
              </h4>
              <p className="mb-3 dark:text-gray-300 light:text-gray-700">
                Stock Terminal provides real-time market data via secure WebSocket connection from financial exchanges.
              </p>
              <h4 className="font-bold mb-1 text-yellow-500 flex items-center">
                <Bell size={14} className="mr-1" /> 
                Alert System
              </h4>
              <p className="mb-2 dark:text-gray-300 light:text-gray-700">
                When stock prices have not changed for more than 30 seconds, a stale data alert will be displayed at the top of the screen with audio notification.
              </p>
              <div className="border-t dark:border-gray-700 light:border-gray-300 mt-3 pt-3 flex justify-end">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(false);
                  }}
                  className="dark:bg-terminal-header dark:hover:bg-gray-700 light:bg-gray-200 light:hover:bg-gray-300 px-3 py-1.5 rounded text-sm flex items-center transition-colors"
                >
                  <X size={14} className="mr-1" />
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="dark:hover:bg-gray-800 light:bg-gray-200 light:hover:bg-gray-300 p-2 rounded-md transition-colors focus:outline-none"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={18} className="text-terminal-muted hover:text-yellow-400 transition-colors" />
          ) : (
            <Moon size={18} className="text-terminal-muted hover:text-blue-400 transition-colors" />
          )}
        </button>
        
        {/* Notification History Button */}
        <button
          onClick={onViewNotifications}
          className="dark:hover:bg-gray-800 light:bg-gray-200 light:hover:bg-gray-300 p-2 rounded-md transition-colors focus:outline-none"
          title="View Notifications"
        >
          <Bell size={18} className="text-terminal-muted hover:text-yellow-400 transition-colors" />
        </button>
        
        {/* Clear Notifications Button */}
        <button
          onClick={onClearNotifications}
          className="dark:hover:bg-gray-800 light:bg-gray-200 light:hover:bg-gray-300 p-2 rounded-md transition-colors focus:outline-none"
          title="Clear Notifications"
        >
          <Trash2 size={18} className="text-terminal-muted hover:text-terminal-negative transition-colors" />
        </button>
        
        {/* Refresh Button */}
        <button 
          onClick={handleRefresh} 
          className="bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 text-white px-4 py-2 rounded-md text-sm flex items-center shadow-md transition-all duration-200"
          title="Refresh Data"
        >
          <RefreshCw size={16} className="mr-2 hover:rotate-180 transition-all duration-500" />
          Refresh Data
        </button>
      </div>
    </div>
  );
}
