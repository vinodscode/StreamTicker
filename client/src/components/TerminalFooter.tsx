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

  return (
    <div className="px-4 py-2 bg-terminal-header border-t border-terminal-border flex justify-between items-center text-xs text-terminal-muted">
      <div>
        API Status: <span className={statusClassname}>{statusText}</span>
      </div>
      <div>
        Last Update: <span>{lastRefreshTime}</span>
      </div>
    </div>
  );
}
