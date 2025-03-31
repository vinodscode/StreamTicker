import { useEffect, useState } from 'react';
import { Bell, XCircle, AlertTriangle, Clock, Trash2 } from 'lucide-react';

export interface NotificationItem {
  id: string;
  message: string;
  symbol?: string;
  exchange?: string;
  timestamp: Date;
  type: 'stale' | 'info' | 'error';
}

interface NotificationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationHistory({ isOpen, onClose }: NotificationHistoryProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Function to add a notification to the history
  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
  };

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Expose the addNotification and clearAllNotifications functions to the window object
  useEffect(() => {
    // @ts-ignore
    window.addStockNotification = (notification: NotificationItem) => {
      addNotification(notification);
    };

    // @ts-ignore
    window.clearAllStockNotifications = () => {
      clearAllNotifications();
    };

    return () => {
      // @ts-ignore
      delete window.addStockNotification;
      // @ts-ignore
      delete window.clearAllStockNotifications;
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all duration-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-monitor-card rounded-lg shadow-2xl border border-monitor overflow-hidden">
        <div className="sticky top-0 bg-monitor-card-header border-b border-monitor p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="text-monitor-accent mr-2" />
            <h2 className="text-lg font-bold text-monitor-heading">Notification History</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="p-2 hover:bg-monitor-card-hover rounded-md transition-colors"
              title="Clear Notifications"
            >
              <Trash2 className="text-monitor-muted hover:text-monitor-warning" size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-monitor-card-hover rounded-full transition-colors"
            >
              <XCircle className="text-monitor-muted hover:text-monitor-warning" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] p-4 bg-monitor-card">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-monitor-muted">
              <Bell className="mb-2 opacity-30" size={40} />
              <p>No notifications yet.</p>
              <p className="text-sm mt-1">Alerts about stale data will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-l-4 ${
                    notification.type === 'stale' 
                      ? 'border-yellow-500 bg-yellow-900/20' 
                      : notification.type === 'error'
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-blue-500 bg-blue-900/20'
                  } p-3 rounded-r-md`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {notification.type === 'stale' ? (
                        <AlertTriangle className="text-yellow-500 mt-1" size={16} />
                      ) : notification.type === 'error' ? (
                        <AlertTriangle className="text-red-500 mt-1" size={16} />
                      ) : (
                        <Bell className="text-blue-500 mt-1" size={16} />
                      )}
                      <div>
                        <div className="font-medium text-monitor-text">
                          {notification.symbol ? (
                            <span className="font-mono">{notification.symbol}</span>
                          ) : "System Alert"}
                          {notification.exchange && (
                            <span className="text-xs ml-2 bg-monitor-card-accent px-2 py-0.5 rounded-md">
                              {notification.exchange}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-monitor-text mt-1">{notification.message}</p>
                      </div>
                    </div>
                    <div className="text-xs text-monitor-muted flex items-center">
                      <Clock size={12} className="mr-1" />
                      {notification.timestamp.toLocaleTimeString('en-IN', {
                        hour: "2-digit" as const,
                        minute: "2-digit" as const,
                        second: "2-digit" as const,
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}