// ─── Todo Types ───
export type TodoPriority = "urgent" | "high" | "medium" | "low";
export type TodoStatus = "todo" | "in_progress" | "completed";

export type TodoCategory = "work" | "personal" | "health" | "finance" | "education" | "other";

export const TODO_CATEGORIES: { id: TodoCategory; label: string; emoji: string }[] = [
  { id: "work", label: "Work", emoji: "💼" },
  { id: "personal", label: "Personal", emoji: "🏠" },
  { id: "health", label: "Health", emoji: "🏃" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "other", label: "Other", emoji: "📌" },
];

export const PRIORITY_CONFIG: Record<TodoPriority, { label: string; color: string; dot: string }> = {
  urgent: { label: "Urgent", color: "0 72% 51%", dot: "#ef4444" },
  high: { label: "High", color: "25 95% 53%", dot: "#f97316" },
  medium: { label: "Medium", color: "48 96% 53%", dot: "#eab308" },
  low: { label: "Low", color: "142 71% 45%", dot: "#22c55e" },
};

export const STATUS_CONFIG: Record<TodoStatus, { label: string; icon: string }> = {
  todo: { label: "To Do", icon: "○" },
  in_progress: { label: "In Progress", icon: "◐" },
  completed: { label: "Completed", icon: "●" },
};

export type SubTask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  category: TodoCategory;
  tags: string[];
  dueDate?: string; // ISO date
  subtasks: SubTask[];
  createdAt: string;
  completedAt?: string;
  notes: string;
};

// ─── Settings Types ───
export type TimeFormat = "12h" | "24h";
export type WeekStartDay = 0 | 1; // 0=Sunday, 1=Monday
export type ThemeMode = "light" | "dark" | "system";

export type HolidayCountry = "us" | "uk" | "in" | "ca" | "au" | "de" | "fr" | "bd" | "pk" | "none";

export const HOLIDAY_COUNTRIES: { id: HolidayCountry; label: string; flag: string }[] = [
  { id: "us", label: "United States", flag: "🇺🇸" },
  { id: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { id: "in", label: "India", flag: "🇮🇳" },
  { id: "ca", label: "Canada", flag: "🇨🇦" },
  { id: "au", label: "Australia", flag: "🇦🇺" },
  { id: "de", label: "Germany", flag: "🇩🇪" },
  { id: "fr", label: "France", flag: "🇫🇷" },
  { id: "bd", label: "Bangladesh", flag: "🇧🇩" },
  { id: "pk", label: "Pakistan", flag: "🇵🇰" },
  { id: "none", label: "None", flag: "" },
];

export const TIMEZONE_OPTIONS = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Anchorage", "Pacific/Honolulu", "America/Toronto", "America/Vancouver",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Australia/Sydney",
  "UTC",
] as const;

export type CalendarSettings = {
  timeFormat: TimeFormat;
  weekStartDay: WeekStartDay;
  defaultEventDuration: number; // minutes
  timezone: string;
  holidayCountry: HolidayCountry;
  showWeekends: boolean;
  showHolidays: boolean;
  theme: ThemeMode;
};

export const DEFAULT_SETTINGS: CalendarSettings = {
  timeFormat: "12h",
  weekStartDay: 1,
  defaultEventDuration: 60,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
  holidayCountry: "us",
  showWeekends: true,
  showHolidays: true,
  theme: "light",
};

// ─── Event Categories ───
export type EventCategory = "meeting" | "appointment" | "birthday" | "deadline" | "travel" | "other";

export const EVENT_CATEGORIES: { id: EventCategory; label: string; emoji: string }[] = [
  { id: "meeting", label: "Meeting", emoji: "📅" },
  { id: "appointment", label: "Appointment", emoji: "🏥" },
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "deadline", label: "Deadline", emoji: "⏰" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "other", label: "Other", emoji: "📌" },
];

export const REMINDER_OPTIONS = [
  { value: 0, label: "At time of event" },
  { value: 5, label: "5 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
] as const;
