import { cn } from "@/lib/utils";
import {
  getCalendarDays, isSameMonth, isSameDay, isWeekend,
  format, getMonth, getYear, getEventsForDate,
} from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/calendar-utils";

interface MiniCalendarProps {
  month: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onSelectMonth: (month: number, year: number) => void;
}

export function MiniCalendar({ month, currentMonth, events, onSelectMonth }: MiniCalendarProps) {
  const days = getCalendarDays(month);
  const today = new Date();
  const isCurrentView = getMonth(month) === getMonth(currentMonth) && getYear(month) === getYear(currentMonth);

  return (
    <button
      onClick={() => onSelectMonth(getMonth(month), getYear(month))}
      className={cn(
        "rounded-lg p-2 text-left transition-all hover:bg-muted/60 w-full",
        isCurrentView && "ring-2 ring-primary bg-calendar-range"
      )}
    >
      <p className="text-[10px] font-semibold text-foreground mb-1 text-center">
        {format(month, "MMM")}
      </p>
      <div className="grid grid-cols-7 gap-0">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, today);
          const hasEvents = getEventsForDate(events, day).length > 0;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "text-[7px] h-3 flex items-center justify-center",
                !inMonth && "opacity-0",
                inMonth && "text-foreground",
                isWeekend(day) && inMonth && "text-calendar-weekend",
                isToday && "bg-primary text-primary-foreground rounded-full font-bold",
              )}
            >
              {inMonth && (
                <span className="relative">
                  {format(day, "d")}
                  {hasEvents && !isToday && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0.5 rounded-full bg-primary" />
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </button>
  );
}
