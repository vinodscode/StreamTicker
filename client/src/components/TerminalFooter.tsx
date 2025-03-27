import { Wifi, Clock, AlertTriangle } from "lucide-react";

interface TerminalFooterProps {
  connectionStatus: "connected" | "disconnected";
  lastRefreshTime: string;
}

export default function TerminalFooter({ 
  connectionStatus, 
  lastRefreshTime 
}: TerminalFooterProps) {
  const statusClassname = connectionStatus === "connected" 
    ? "text-terminal-positive" 
    : "text-terminal-negative";
  
  const statusText = connectionStatus === "connected" 
    ? "Connected (WebSocket)" 
    : "Disconnected";

  const StatusIcon = connectionStatus === "connected" 
    ? Wifi 
    : AlertTriangle;

  return (
    <div className="px-4 py-3 bg-terminal-header border-t border-terminal-border flex justify-between items-center text-xs text-terminal-muted">
      <div className="flex items-center">
        <div className={`${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"} w-2 h-2 rounded-full mr-2 animate-pulse`}></div>
        <StatusIcon size={12} className={`${statusClassname} mr-1`} />
        <span>API Status: </span>
        <span className={`${statusClassname} font-semibold ml-1`}>{statusText}</span>
      </div>
      
      <div className="flex items-center">
        <Clock size={12} className="mr-1 text-terminal-accent" />
        <span>Last Update: </span>
        <span className="text-terminal-text ml-1">{lastRefreshTime}</span>
      </div>
      
      <div className="flex items-center">
        <span className="text-xs text-terminal-muted">© StockTerminal v1.0</span>
      </div>
    </div>
  );
}
