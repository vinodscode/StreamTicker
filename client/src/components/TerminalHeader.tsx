import { 
  RefreshCw, Database, Wifi, Info, 
  BarChart3, X, Bell, Sun, Moon, Trash2, LayoutDashboard, ChevronDown
} from "lucide-react";
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
    <div className="bg-monitor-panel border-b border-monitor p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left side - Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-blue flex items-center justify-center shadow-sm">
          <BarChart3 className="text-white" size={20} />
        </div>
        
        <div>
          <h1 className="text-monitor-heading font-bold flex items-center">
            <span className="text-lg">Market</span>
            <span className="gradient-text gradient-blue ml-1 text-lg">Monitor</span>
          </h1>
          <div className="text-xs text-monitor-muted flex items-center gap-1">
            <span className="status-indicator status-active active-pulse"></span>
            <span>Real-time financial data stream</span>
          </div>
        </div>
      </div>
      
      {/* Center - Connection Status */}
      <div className="hidden md:flex items-center gap-2 text-monitor-accent bg-monitor-card/30 px-3 py-1.5 rounded-md">
        <Database size={15} className="text-monitor-accent/70" />
        <span className="text-sm font-medium">LIVE MARKET FEED</span>
        <Wifi size={15} className="text-monitor-positive active-pulse" />
      </div>
      
      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Info button with dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="text-monitor-muted hover:text-monitor-accent p-2 rounded-md transition-colors flex items-center"
            title="Information"
          >
            <Info size={18} />
            <ChevronDown size={14} className={`ml-0.5 transition-transform duration-200 ${showInfo ? 'rotate-180' : ''}`} />
          </button>
          
          {showInfo && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-monitor-card border border-monitor rounded-md shadow-lg z-10 text-sm">
              <div className="px-4 py-3 border-b border-monitor">
                <h4 className="font-medium text-monitor-heading flex items-center">
                  <LayoutDashboard size={14} className="mr-1.5 text-monitor-accent" /> 
                  About Market Monitor
                </h4>
              </div>
              <div className="p-4">
                <p className="mb-3 text-monitor-text">
                  Market Monitor provides real-time financial data via secure WebSocket connection from various financial exchanges.
                </p>
                <h5 className="font-medium text-monitor-warning flex items-center mb-1">
                  <Bell size={14} className="mr-1.5" /> 
                  Stale Data Detection
                </h5>
                <p className="text-monitor-muted">
                  Individual stocks are monitored for data freshness. When a stock's data hasn't updated in more than 30 seconds, visual and audio alerts will notify you.
                </p>
              </div>
              <div className="bg-monitor-header/50 px-4 py-2 rounded-b-md flex justify-end">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(false);
                  }}
                  className="px-3 py-1.5 rounded text-sm flex items-center transition-colors hover:bg-monitor-card/50"
                >
                  <X size={14} className="mr-1.5" />
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="text-monitor-muted hover:text-monitor-accent p-2 rounded-md transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>
        
        {/* Notification History Button */}
        <button
          onClick={onViewNotifications}
          className="text-monitor-muted hover:text-monitor-warning p-2 rounded-md transition-colors"
          title="View Notifications"
        >
          <Bell size={18} />
        </button>
        
        {/* Clear Notifications Button */}
        <button
          onClick={onClearNotifications}
          className="text-monitor-muted hover:text-monitor-negative p-2 rounded-md transition-colors"
          title="Clear Notifications"
        >
          <Trash2 size={18} />
        </button>
        
        {/* Refresh Button */}
        <button 
          onClick={handleRefresh} 
          className="bg-monitor-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center shadow-sm transition-all duration-200"
          title="Refresh Data"
        >
          <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-all duration-500" />
          Refresh
        </button>
      </div>
    </div>
  );
}
