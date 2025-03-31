// Market hours for different Indian stock market segments
interface MarketSegmentHours {
  name: string;
  exchange: string;
  startTime: string; // 24-hour format, IST
  endTime: string; // 24-hour format, IST
  weekdays: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export const MARKET_SEGMENTS: MarketSegmentHours[] = [
  {
    name: 'NSE Equity',
    exchange: 'NSE',
    startTime: '09:15',
    endTime: '15:30',
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    name: 'BSE Equity',
    exchange: 'BSE',
    startTime: '09:15',
    endTime: '15:30',
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    name: 'NSE F&O',
    exchange: 'NFO',
    startTime: '09:15',
    endTime: '15:30',
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    name: 'MCX Commodities',
    exchange: 'MCX',
    startTime: '09:00',
    endTime: '23:55',
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    name: 'Currency Derivatives',
    exchange: 'CDS',
    startTime: '09:00',
    endTime: '17:00',
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  {
    name: 'Bursa Malaysia Derivatives',
    exchange: 'BFO',
    startTime: '09:00',
    endTime: '17:00',
    weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  }
];

// Exchange-specific holidays for 2025
// Format: { date: 'YYYY-MM-DD', exchanges: string[] }
export interface MarketHoliday {
  date: string;
  exchanges: string[];
  name: string;
}

export const MARKET_HOLIDAYS_2025: MarketHoliday[] = [
  // NSE and BSE holidays
  { date: '2025-01-26', exchanges: ['NSE', 'BSE'], name: 'Republic Day' },
  { date: '2025-02-26', exchanges: ['NSE', 'BSE'], name: 'Maha Shivaratri' },
  { date: '2025-03-14', exchanges: ['NSE', 'BSE'], name: 'Holi' },
  { date: '2025-03-31', exchanges: ['NSE', 'BSE'], name: 'Eid-Ul-Fitr (Ramzan Eid)' },
  { date: '2025-04-10', exchanges: ['NSE', 'BSE'], name: 'Mahavir Jayanti' },
  { date: '2025-04-14', exchanges: ['NSE', 'BSE'], name: 'Dr. Baba Saheb Ambedkar Jayanti' },
  { date: '2025-04-18', exchanges: ['NSE', 'BSE', 'MCX'], name: 'Good Friday' },
  { date: '2025-05-01', exchanges: ['NSE', 'BSE'], name: 'Maharashtra Day' },
  { date: '2025-08-15', exchanges: ['NSE', 'BSE', 'MCX'], name: 'Independence Day' },
  { date: '2025-08-27', exchanges: ['NSE', 'BSE'], name: 'Ganesh Chaturthi' },
  { date: '2025-10-02', exchanges: ['NSE', 'BSE', 'MCX'], name: 'Mahatma Gandhi Jayanti' },
  { date: '2025-10-21', exchanges: ['NSE', 'BSE', 'MCX'], name: 'Diwali-Laxmi Pujan (Muhurat trading session)' },
  { date: '2025-10-22', exchanges: ['NSE', 'BSE'], name: 'Diwali-Balipratipada' },
  { date: '2025-11-05', exchanges: ['NSE', 'BSE'], name: 'Gurunanak Jayanti' },
  { date: '2025-12-25', exchanges: ['NSE', 'BSE', 'MCX'], name: 'Christmas' },
  
  // MCX-specific holidays
  { date: '2025-01-26', exchanges: ['MCX'], name: 'Republic Day' },
  { date: '2025-08-15', exchanges: ['MCX'], name: 'Independence Day' },
  { date: '2025-10-02', exchanges: ['MCX'], name: 'Mahatma Gandhi Jayanti' },
  { date: '2025-10-21', exchanges: ['MCX'], name: 'Diwali-Laxmi Pujan (Muhurat trading session)' },
  { date: '2025-12-25', exchanges: ['MCX'], name: 'Christmas' }
];

/**
 * Check if a given exchange is currently within market hours
 * @param exchange The exchange code to check
 * @returns boolean indicating if within market hours
 */
export function isWithinMarketHours(exchange: string): boolean {
  // Get current date and time in IST (Indian Standard Time)
  const now = new Date();
  const istOptions = { timeZone: 'Asia/Kolkata' };
  const istDateStr = now.toLocaleDateString('en-US', istOptions);
  const istTimeStr = now.toLocaleTimeString('en-US', istOptions);
  
  // Extract hours and minutes
  const [time, period] = istTimeStr.split(' ');
  const [hours, minutes] = time.split(':');
  
  // Convert to 24-hour format
  let hour24 = parseInt(hours);
  if (period === 'PM' && hour24 < 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  // Format current time as HH:MM for comparison
  const currentTime = `${hour24.toString().padStart(2, '0')}:${minutes}`;
  
  // Check if today is a holiday for this exchange
  const istDate = new Date(istDateStr);
  const dateString = istDate.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Check if there's a holiday for this exchange on current date
  const isHoliday = MARKET_HOLIDAYS_2025.some(
    holiday => holiday.date === dateString && holiday.exchanges.includes(exchange)
  );
  
  if (isHoliday) {
    return false;
  }
  
  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = istDate.getDay();
  
  // Find the segment for the given exchange
  const segment = MARKET_SEGMENTS.find(seg => seg.exchange === exchange);
  if (!segment) {
    // If segment not found, default to NSE hours
    const defaultSegment = MARKET_SEGMENTS[0];
    return (
      defaultSegment.weekdays.includes(currentDay) &&
      currentTime >= defaultSegment.startTime &&
      currentTime <= defaultSegment.endTime
    );
  }
  
  // Check if today is a trading day for this segment
  if (!segment.weekdays.includes(currentDay)) {
    return false;
  }
  
  // Check if current time is within trading hours
  return currentTime >= segment.startTime && currentTime <= segment.endTime;
}

/**
 * Get market status for a given exchange
 * @param exchange The exchange code
 * @returns Object with status info
 */
export function getMarketStatus(exchange: string): {
  isOpen: boolean;
  message: string;
  nextOpeningTime?: string;
} {
  const isOpen = isWithinMarketHours(exchange);
  
  // Find segment info
  const segment = MARKET_SEGMENTS.find(seg => seg.exchange === exchange) || MARKET_SEGMENTS[0];
  
  if (isOpen) {
    return {
      isOpen: true,
      message: `${segment.name} Market Open`
    };
  } else {
    // Get current date in IST
    const now = new Date();
    const istOptions = { timeZone: 'Asia/Kolkata' };
    const istDateStr = now.toLocaleDateString('en-US', istOptions);
    const istDate = new Date(istDateStr);
    
    // Check if today is a holiday for this exchange
    const dateString = istDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const holiday = MARKET_HOLIDAYS_2025.find(
      h => h.date === dateString && h.exchanges.includes(exchange)
    );
    
    if (holiday) {
      return {
        isOpen: false,
        message: `Market Closed (${holiday.name})`,
        nextOpeningTime: 'Check calendar for next trading day'
      };
    }
    
    // Get current day of week
    const currentDay = istDate.getDay();
    
    // If it's a trading day but outside trading hours
    if (segment.weekdays.includes(currentDay)) {
      return {
        isOpen: false,
        message: `Market Closed`,
        nextOpeningTime: `Opens at ${segment.startTime} IST`
      };
    } else {
      // Find the next trading day
      let nextDay = currentDay;
      let daysToAdd = 1;
      
      while (!segment.weekdays.includes(nextDay)) {
        nextDay = (nextDay + 1) % 7;
        daysToAdd++;
      }
      
      return {
        isOpen: false,
        message: `Market Closed (Weekend)`,
        nextOpeningTime: `Opens on ${getWeekdayName(nextDay)} at ${segment.startTime} IST`
      };
    }
  }
}

/**
 * Get name of the weekday from day number
 */
function getWeekdayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
}

/**
 * Check if stale data alert should be active for a given exchange
 * @param exchange The exchange code
 * @returns boolean - true if stale alert should be active
 */
export function shouldShowStaleAlert(exchange: string): boolean {
  return isWithinMarketHours(exchange);
}