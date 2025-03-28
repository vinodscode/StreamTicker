import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import NotificationHistory, { NotificationItem } from "@/components/NotificationHistory";
import { BellRing, Sun, Moon } from "lucide-react";

// Add global window interface extension
declare global {
  interface Window {
    addStockNotification?: (notification: NotificationItem) => void;
    clearAllStockNotifications?: () => void;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  // We no longer need local state for notification history as it's handled in TerminalApp
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <Router />
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
