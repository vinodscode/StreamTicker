import { RefreshCw, Database, Wifi } from "lucide-react";

interface TerminalHeaderProps {
  onRefresh: () => void;
}

export default function TerminalHeader({ onRefresh }: TerminalHeaderProps) {
  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="bg-terminal-header p-3 border-b border-terminal-border flex items-center">
      <div className="flex space-x-2 mr-4">
        <div className="w-3 h-3 rounded-full bg-terminal-negative hover:brightness-125 transition-all cursor-pointer"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-125 transition-all cursor-pointer"></div>
        <div className="w-3 h-3 rounded-full bg-terminal-positive hover:brightness-125 transition-all cursor-pointer"></div>
      </div>
      
      <div className="text-sm text-terminal-muted flex-1 text-center flex items-center justify-center gap-2">
        <Database size={14} className="text-terminal-accent" />
        <span className="font-medium tracking-wide">RealTime Stock Tracker</span>
        <Wifi size={14} className="text-terminal-positive animate-pulse" />
      </div>
      
      <div className="text-sm ml-4">
        <button 
          onClick={handleRefresh} 
          className="hover:text-terminal-accent transition-all duration-300 focus:outline-none p-1.5 rounded-md hover:bg-gray-800"
          title="Refresh Data"
        >
          <RefreshCw size={14} className="hover:rotate-180 transition-all duration-500" />
        </button>
      </div>
    </div>
  );
}
