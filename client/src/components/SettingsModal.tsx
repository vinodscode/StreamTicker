import React, { useState } from 'react';
import { X, Info, Clock, AlertTriangle, Settings as SettingsIcon, ToggleLeft, ToggleRight, Bell } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, toggleMonitoring, toggleExchangeAlert } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-monitor-card border border-monitor rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-monitor-card-header border-b border-monitor">
          <div className="font-bold text-lg text-monitor-heading flex items-center gap-2">
            <SettingsIcon size={18} className="text-monitor-accent" />
            <span>Alert Settings</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-monitor-card-hover"
            aria-label="Close settings"
          >
            <X size={18} />
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

          {/* Exchange-specific alerts */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-sm flex items-center gap-1.5">
                <Bell size={16} className="text-monitor-accent" />
                Exchange Alerts
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              {Object.entries(settings.exchangeAlerts).map(([exchange, enabled]) => (
                <div 
                  key={exchange}
                  className="flex items-center justify-between p-2 border border-monitor rounded-md"
                >
                  <span className="text-sm font-medium">{exchange}</span>
                  <button
                    onClick={() => toggleExchangeAlert(exchange)}
                    className="text-monitor-accent p-1"
                    aria-label={enabled ? `Disable ${exchange} alerts` : `Enable ${exchange} alerts`}
                  >
                    {enabled ? (
                      <ToggleRight size={20} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={20} className="text-monitor-muted" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t border-monitor p-3 bg-monitor-card-footer flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-monitor-accent text-white rounded-md hover:bg-monitor-accent/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}