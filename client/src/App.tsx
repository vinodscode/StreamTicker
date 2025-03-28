import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import NotificationHistory from "@/components/NotificationHistory";
import { BellRing, Sun, Moon } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [isNotificationHistoryOpen, setNotificationHistoryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col min-h-screen">
      <Router />
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-4 left-4 ${isDark ? 'bg-gray-800' : 'bg-white'} p-3 rounded-full shadow-lg z-10 transition-all duration-200 hover:scale-110 border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-blue-600" />
        )}
      </button>
      
      {/* Test Notification Button */}
      <button
        onClick={() => {
          // Add a test notification
          if (window.addStockNotification) {
            window.addStockNotification({
              id: Date.now().toString(),
              message: "This is a test notification for testing the notification system.",
              timestamp: new Date(),
              type: 'info'
            });
          }
        }}
        className={`fixed bottom-16 left-4 ${
          isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
        } text-white p-2 rounded-md text-xs shadow-lg z-10 transition-all duration-200`}
        title="Generate test notification"
      >
        Test Notification
      </button>
      
      {/* Notification History Toggle Button - More visible */}
      <button
        onClick={() => setNotificationHistoryOpen(true)}
        className={`fixed bottom-4 right-4 ${
          isDark 
            ? 'bg-terminal-accent hover:bg-cyan-600' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white p-4 rounded-full shadow-lg z-10 transition-all duration-200 hover:scale-110`}
        title="View notification history"
      >
        <BellRing size={22} />
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 bg-red-500 rounded-full"></span>
      </button>
      
      {/* Notification History Modal */}
      <NotificationHistory 
        isOpen={isNotificationHistoryOpen}
        onClose={() => setNotificationHistoryOpen(false)}
      />
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
