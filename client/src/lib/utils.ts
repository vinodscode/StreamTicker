import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: string): string {
  // Convert to IST (UTC+5:30)
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', { 
    hour: "2-digit" as const, 
    minute: "2-digit" as const, 
    second: "2-digit" as const,
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
}

export function formatDateTime(timestamp: string): string {
  // Convert to IST (UTC+5:30)
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    year: "numeric" as const,
    month: "2-digit" as const,
    day: "2-digit" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    second: "2-digit" as const,
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
}

export function calculateChange(currentPrice: number, previousPrice: number): string {
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return change.toFixed(2);
}

export function getTimeSince(timestamp: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
