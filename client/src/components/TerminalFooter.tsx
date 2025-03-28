import { 
  Wifi, Clock, AlertTriangle, BarChart3, 
  GitBranch, Shield, Server, Activity 
} from "lucide-react";

interface TerminalFooterProps {
  connectionStatus: "connected" | "disconnected";
  lastRefreshTime: string;
}

export default function TerminalFooter({ 
  connectionStatus, 
  lastRefreshTime 
}: TerminalFooterProps) {
  const isConnected = connectionStatus === "connected";
  
  const statusClassname = isConnected
    ? "text-monitor-positive" 
    : "text-monitor-negative";
  
  const statusText = isConnected
    ? "Connected" 
    : "Disconnected";

  const StatusIcon = isConnected
    ? Wifi 
    : AlertTriangle;

  return (
    <div className="bg-monitor-panel border-t border-monitor py-3 px-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-3 text-xs text-monitor-muted">
      {/* Left side - App information */}
      <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-monitor-card/50 rounded-md">
          <BarChart3 size={15} className="text-monitor-accent" />
          <span className="font-medium">MarketMonitor v1.0</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Server size={15} className="text-monitor-accent" />
          <span>API: ticks.rvinod.com</span>
        </div>
      </div>
      
      {/* Right side - Status information */}
      <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
        {/* Connection status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-monitor-card/50 rounded-md">
          <span className={`status-indicator ${isConnected ? 'status-active active-pulse' : 'status-stale stale-pulse'}`}></span>
          <StatusIcon size={14} className={statusClassname} />
          <span className={`${statusClassname} font-medium ml-0.5`}>
            {statusText}
            <span className="text-monitor-muted ml-1">(WebSocket)</span>
          </span>
        </div>
        
        {/* Last update time */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-monitor-card/50 rounded-md">
          <Clock size={14} className="text-monitor-accent" />
          <span>Last update:</span>
          <span className="text-monitor-text tabular-nums ml-0.5">{lastRefreshTime}</span>
        </div>
        
        {/* Connection security */}
        <div className="flex items-center gap-1.5">
          <Shield size={14} className="text-emerald-500" />
          <span className="text-emerald-500">Secure</span>
        </div>
      </div>
    </div>
  );
}
