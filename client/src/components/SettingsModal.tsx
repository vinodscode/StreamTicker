import React from 'react';
import { X, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useSettings();

  if (!settings) {
    return null; // Return early if settings aren't loaded yet
  }

  const toggleMonitoring = () => {
    updateSettings({
      ...settings,
      monitoringEnabled: !settings.monitoringEnabled
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-monitor-bg rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-monitor">
          <h2 className="text-lg font-medium">Settings</h2>
          <button
            onClick={onClose}
            className="text-monitor-muted hover:text-monitor-text"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Global Monitoring Toggle */}
          <div className="mb-6 bg-monitor-card-accent p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className={settings.monitoringEnabled ? "text-green-500" : "text-monitor-muted"} />
                <span className="font-medium">Enable Monitoring Today</span>
              </div>
              <button 
                onClick={toggleMonitoring}
                className="text-monitor-accent p-1"
                aria-label={settings.monitoringEnabled ? "Disable monitoring" : "Enable monitoring"}
              >
                {settings.monitoringEnabled ? (
                  <ToggleRight size={24} className="text-green-500" />
                ) : (
                  <ToggleLeft size={24} className="text-monitor-muted" />
                )}
              </button>
            </div>
            <p className="text-xs text-monitor-muted mt-2">
              {settings.monitoringEnabled 
                ? "Monitoring is active. You will receive alerts for stale data." 
                : "Monitoring is disabled. You won't receive any alerts until tomorrow."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}