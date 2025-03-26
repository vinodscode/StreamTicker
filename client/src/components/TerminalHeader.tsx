import { RefreshCw } from "lucide-react";

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
        <div className="w-3 h-3 rounded-full bg-terminal-negative"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-terminal-positive"></div>
      </div>
      <div className="text-sm text-terminal-muted flex-1 text-center">
        stock-ticker@api-ticks.rvinod.com
      </div>
      <div className="text-sm ml-4">
        <button 
          onClick={handleRefresh} 
          className="hover:text-terminal-accent transition-colors focus:outline-none"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );
}
