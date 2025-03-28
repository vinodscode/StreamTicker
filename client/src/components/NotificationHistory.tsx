import { useEffect, useState } from 'react';
import { Bell, XCircle, AlertTriangle, Clock } from 'lucide-react';

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
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-terminal-body rounded-lg shadow-2xl border border-terminal-border overflow-hidden">
        <div className="sticky top-0 bg-terminal-header border-b border-terminal-border p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="text-terminal-accent mr-2" />
            <h2 className="text-lg font-bold text-terminal-text">Notification History</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-opacity-20 hover:bg-terminal-muted rounded-full transition-colors"
          >
            <XCircle className="text-terminal-muted hover:text-terminal-negative" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] p-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-terminal-muted">
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
                      ? 'dark:border-yellow-500 dark:bg-yellow-900/20 border-yellow-500 bg-yellow-100/80' 
                      : notification.type === 'error'
                        ? 'dark:border-red-500 dark:bg-red-900/20 border-red-500 bg-red-100/80'
                        : 'dark:border-blue-500 dark:bg-blue-900/20 border-blue-500 bg-blue-100/80'
                  } p-3 rounded-r-md`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {notification.type === 'stale' ? (
                        <AlertTriangle className="text-yellow-500 dark:text-yellow-500 mt-1" size={16} />
                      ) : notification.type === 'error' ? (
                        <AlertTriangle className="text-red-500 dark:text-red-500 mt-1" size={16} />
                      ) : (
                        <Bell className="text-blue-500 dark:text-blue-500 mt-1" size={16} />
                      )}
                      <div>
                        <div className="font-medium text-terminal-text">
                          {notification.symbol ? (
                            <span className="font-mono">{notification.symbol}</span>
                          ) : "System Alert"}
                          {notification.exchange && (
                            <span className="text-xs ml-2 dark:bg-gray-800 bg-gray-200 px-2 py-0.5 rounded-md">
                              {notification.exchange}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-terminal-text mt-1">{notification.message}</p>
                      </div>
                    </div>
                    <div className="text-xs text-terminal-muted flex items-center">
                      <Clock size={12} className="mr-1" />
                      {notification.timestamp.toLocaleTimeString()}
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