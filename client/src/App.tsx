import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { ThemeProvider } from "@/context/ThemeContext";
import NotificationHistory from "@/components/NotificationHistory";
import { BellRing } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isNotificationHistoryOpen, setNotificationHistoryOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen">
          <Router />
          
          {/* Notification History Toggle Button */}
          <button
            onClick={() => setNotificationHistoryOpen(true)}
            className="fixed bottom-4 right-4 bg-terminal-accent hover:bg-terminal-accent-hover text-white p-3 rounded-full shadow-lg z-10 transition-all duration-200 hover:scale-110"
            title="View notification history"
          >
            <BellRing size={20} />
          </button>
          
          {/* Notification History Modal */}
          <NotificationHistory 
            isOpen={isNotificationHistoryOpen}
            onClose={() => setNotificationHistoryOpen(false)}
          />
          
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
