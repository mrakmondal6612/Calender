import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isWeekend,
  getYear,
  getMonth,
  setMonth,
  setYear,
  startOfDay,
  addDays,
  differenceInDays,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";

import januaryImg from "@/assets/calendar-january.jpg";
import februaryImg from "@/assets/calendar-february.jpg";
import marchImg from "@/assets/calendar-march.jpg";
import aprilImg from "@/assets/calendar-april.jpg";
import mayImg from "@/assets/calendar-may.jpg";
import juneImg from "@/assets/calendar-june.jpg";
import julyImg from "@/assets/calendar-july.jpg";
import augustImg from "@/assets/calendar-august.jpg";
import septemberImg from "@/assets/calendar-september.jpg";
import octoberImg from "@/assets/calendar-october.jpg";
import novemberImg from "@/assets/calendar-november.jpg";
import decemberImg from "@/assets/calendar-december.jpg";

export const MONTH_IMAGES: Record<number, string> = {
  0: januaryImg, 1: februaryImg, 2: marchImg, 3: aprilImg,
  4: mayImg, 5: juneImg, 6: julyImg, 7: augustImg,
  8: septemberImg, 9: octoberImg, 10: novemberImg, 11: decemberImg,
};

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const EVENT_COLORS = [
  { id: "blue", label: "Blue", bg: "210 80% 55%", dot: "#3b82f6" },
  { id: "red", label: "Red", bg: "0 72% 51%", dot: "#ef4444" },
  { id: "green", label: "Green", bg: "142 71% 45%", dot: "#22c55e" },
  { id: "amber", label: "Amber", bg: "38 92% 50%", dot: "#f59e0b" },
  { id: "purple", label: "Purple", bg: "262 83% 58%", dot: "#a855f7" },
  { id: "teal", label: "Teal", bg: "172 66% 50%", dot: "#14b8a6" },
] as const;

export type EventColor = typeof EVENT_COLORS[number]["id"];

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
  endTime?: string;
  color: EventColor;
  isAllDay: boolean;
  recurring?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  location?: string;
  attendees?: string;
  category?: string;
  reminders?: number[];
};

export type CalendarView = "month" | "week" | "day" | "agenda";

// Country-specific holidays
export const US_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-15": "Martin Luther King Jr. Day",
  "02-14": "Valentine's Day",
  "02-17": "Presidents' Day",
  "03-17": "St. Patrick's Day",
  "04-01": "April Fools' Day",
  "05-26": "Memorial Day",
  "06-19": "Juneteenth",
  "07-04": "Independence Day",
  "09-01": "Labor Day",
  "10-13": "Columbus Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "11-27": "Thanksgiving",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export const UK_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-17": "St. Patrick's Day",
  "04-01": "April Fools' Day",
  "04-18": "Good Friday",
  "04-21": "Easter Monday",
  "05-05": "Early May Bank Holiday",
  "05-26": "Spring Bank Holiday",
  "08-25": "Summer Bank Holiday",
  "10-31": "Halloween",
  "12-25": "Christmas Day",
  "12-26": "Boxing Day",
  "12-31": "New Year's Eve",
};

export const INDIA_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-26": "Republic Day",
  "02-14": "Valentine's Day",
  "03-08": "Holi",
  "03-25": "Good Friday",
  "04-01": "April Fools' Day",
  "04-14": "Dr. Ambedkar Jayanti",
  "05-01": "Labour Day",
  "06-29": "Eid al-Adha (Bakrid)",
  "08-15": "Independence Day",
  "08-19": "Raksha Bandhan",
  "08-28": "Janmashtami",
  "09-02": "Ganesh Chaturthi",
  "09-16": "Eid-e-Milad",
  "10-02": "Gandhi Jayanti",
  "10-10": "Dussehra",
  "10-31": "Halloween",
  "11-01": "Diwali",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export const CANADA_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "02-17": "Family Day",
  "03-17": "St. Patrick's Day",
  "04-01": "April Fools' Day",
  "04-18": "Good Friday",
  "05-19": "Victoria Day",
  "07-01": "Canada Day",
  "08-04": "Civic Holiday",
  "09-01": "Labour Day",
  "10-13": "Thanksgiving",
  "10-31": "Halloween",
  "11-11": "Remembrance Day",
  "12-25": "Christmas Day",
  "12-26": "Boxing Day",
  "12-31": "New Year's Eve",
};

export const AUSTRALIA_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-26": "Australia Day",
  "02-14": "Valentine's Day",
  "03-17": "St. Patrick's Day",
  "04-01": "April Fools' Day",
  "04-18": "Good Friday",
  "04-21": "Easter Monday",
  "04-25": "Anzac Day",
  "06-09": "Queen's Birthday",
  "10-31": "Halloween",
  "12-25": "Christmas Day",
  "12-26": "Boxing Day",
  "12-31": "New Year's Eve",
};

export const GERMANY_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-17": "St. Patrick's Day",
  "04-01": "April Fools' Day",
  "04-18": "Good Friday",
  "04-21": "Easter Monday",
  "05-01": "Labour Day",
  "05-29": "Ascension Day",
  "06-09": "Whit Monday",
  "10-03": "German Unity Day",
  "10-31": "Halloween",
  "12-25": "Christmas Day",
  "12-26": "Second Day of Christmas",
  "12-31": "New Year's Eve",
};

export const FRANCE_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-17": "St. Patrick's Day",
  "04-01": "April Fools' Day",
  "04-18": "Good Friday",
  "04-21": "Easter Monday",
  "05-01": "Labour Day",
  "05-08": "Victory in Europe Day",
  "05-29": "Ascension Day",
  "06-09": "Whit Monday",
  "07-14": "Bastille Day",
  "08-15": "Assumption of Mary",
  "10-31": "Halloween",
  "11-01": "All Saints' Day",
  "11-11": "Armistice Day",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export const BANGLADESH_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "02-21": "Language Martyrs' Day",
  "03-17": "Birthday of Bangabandhu",
  "03-26": "Independence Day",
  "04-01": "April Fools' Day",
  "04-14": "Pohela Boishakh",
  "05-01": "Labour Day",
  "08-15": "National Mourning Day",
  "10-31": "Halloween",
  "12-16": "Victory Day",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export const PAKISTAN_HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-23": "Pakistan Day",
  "04-01": "April Fools' Day",
  "05-01": "Labour Day",
  "08-14": "Independence Day",
  "09-06": "Defence Day",
  "10-31": "Halloween",
  "11-09": "Iqbal Day",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

// Map of all holidays by country
export const ALL_HOLIDAYS: Record<string, Record<string, string>> = {
  us: US_HOLIDAYS,
  uk: UK_HOLIDAYS,
  in: INDIA_HOLIDAYS,
  ca: CANADA_HOLIDAYS,
  au: AUSTRALIA_HOLIDAYS,
  de: GERMANY_HOLIDAYS,
  fr: FRANCE_HOLIDAYS,
  bd: BANGLADESH_HOLIDAYS,
  pk: PAKISTAN_HOLIDAYS,
  none: {},
};

// Legacy export for backward compatibility
export const HOLIDAYS = US_HOLIDAYS;

export type NoteEntry = {
  id: string;
  text: string;
  date: string;
};

export function getCalendarDays(date: Date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: calStart, end: calEnd });
}

export function getWeekDays(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

export function getHoliday(date: Date, country: string = "us"): string | undefined {
  const key = format(date, "MM-dd");
  const countryHolidays = ALL_HOLIDAYS[country] || ALL_HOLIDAYS["us"];
  return countryHolidays[key];
}

export function isInRange(date: Date, rangeStart: Date | null, rangeEnd: Date | null): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
  const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
  return isWithinInterval(date, { start, end });
}

export function isRangeStart(date: Date, rangeStart: Date | null, rangeEnd: Date | null): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
  return isSameDay(date, start);
}

export function isRangeEnd(date: Date, rangeStart: Date | null, rangeEnd: Date | null): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const end = rangeStart < rangeEnd ? rangeEnd : rangeStart;
  return isSameDay(date, end);
}

export function getNotesKey(rangeStart: Date | null, rangeEnd: Date | null, currentMonth: Date): string {
  if (rangeStart && rangeEnd) {
    const s = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const e = rangeStart < rangeEnd ? rangeEnd : rangeStart;
    return `range_${format(s, "yyyy-MM-dd")}_${format(e, "yyyy-MM-dd")}`;
  }
  return `month_${format(currentMonth, "yyyy-MM")}`;
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dateStr = format(date, "yyyy-MM-dd");
  return events.filter((e) => {
    if (e.date === dateStr) return true;
    if (e.endDate) {
      const start = parseISO(e.date);
      const end = parseISO(e.endDate);
      return isWithinInterval(date, { start, end });
    }
    return false;
  });
}

export function getEventsForMonth(events: CalendarEvent[], month: Date): CalendarEvent[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  return events.filter((e) => {
    const eDate = parseISO(e.date);
    return (
      isWithinInterval(eDate, { start: monthStart, end: monthEnd }) ||
      (e.endDate && isWithinInterval(parseISO(e.endDate), { start: monthStart, end: monthEnd }))
    );
  });
}

export {
  isSameMonth, isSameDay, isWeekend, format, addMonths, subMonths,
  addWeeks, subWeeks, getYear, getMonth, setMonth, setYear,
  startOfDay, addDays, differenceInDays, isAfter, isBefore, parseISO,
  startOfWeek, endOfWeek,
};
