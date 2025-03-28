import { Wifi, Clock, AlertTriangle, Terminal, GitBranch, Shield } from "lucide-react";

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
    <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-terminal-header/90 border-t border-terminal-border flex justify-between items-center text-sm text-terminal-muted">
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-terminal-header/50 px-3 py-1.5 rounded-full border border-terminal-border/50">
          <Terminal size={14} className="text-terminal-accent mr-2" />
          <span className="font-medium">StockTerminal v1.0</span>
        </div>
        
        <div className="flex items-center">
          <GitBranch size={14} className="text-terminal-accent mr-2" />
          <span>API: ticks.rvinod.com</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-900/60 px-3 py-1.5 rounded-full border border-terminal-border/30">
          <div className="flex mr-2">
            <div className={`${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"} w-2 h-2 rounded-full relative`}>
              {connectionStatus === "connected" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
            </div>
          </div>
          <StatusIcon size={14} className={`${statusClassname} mr-1`} />
          <span>Status: </span>
          <span className={`${statusClassname} font-semibold ml-1`}>{statusText}</span>
        </div>
        
        <div className="flex items-center bg-gray-900/60 px-3 py-1.5 rounded-full border border-terminal-border/30">
          <Clock size={14} className="mr-2 text-terminal-accent" />
          <span>Updated: </span>
          <span className="text-terminal-text ml-1 font-mono">{lastRefreshTime}</span>
        </div>
        
        <div className="flex items-center">
          <Shield size={14} className="text-green-500 mr-1" />
          <span className="text-xs text-green-500">Secure Connection</span>
        </div>
      </div>
    </div>
  );
}
