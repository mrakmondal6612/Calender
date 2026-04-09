import { cn } from "@/lib/utils";
import {
  getCalendarDays,
  isSameMonth,
  isSameDay,
  isWeekend,
  isInRange,
  isRangeStart,
  isRangeEnd,
  getHoliday,
  getEventsForDate,
  format,
  EVENT_COLORS,
} from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/calendar-utils";

const DAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface CalendarGridProps {
  currentMonth: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  events: CalendarEvent[];
  holidayCountry?: string;
  onDateClick: (date: Date) => void;
  onDateMouseDown: (date: Date) => void;
  onDateMouseEnter: (date: Date) => void;
  onDateMouseUp: () => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

export function CalendarGrid({
  currentMonth,
  rangeStart,
  rangeEnd,
  events,
  holidayCountry = "us",
  onDateClick,
  onDateMouseDown,
  onDateMouseEnter,
  onDateMouseUp,
  onEventClick,
  onAddEvent,
}: CalendarGridProps) {
  const days = getCalendarDays(currentMonth);
  const today = new Date();

  return (
    <div className="px-3 pb-3 pt-1 md:px-5 md:pb-5" onMouseUp={onDateMouseUp}>
      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7 gap-0">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={d}
            className={cn(
              "py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
              i >= 5 && "text-calendar-weekend"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const weekend = isWeekend(day);
          const inRange = isInRange(day, rangeStart, rangeEnd);
          const isStart = isRangeStart(day, rangeStart, rangeEnd);
          const isEnd = isRangeEnd(day, rangeStart, rangeEnd);
          const isSingleSelected = rangeStart && !rangeEnd && isSameDay(day, rangeStart);
          const holiday = getHoliday(day, holidayCountry);
          const dayEvents = getEventsForDate(events, day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "group relative flex flex-col items-center min-h-[44px] md:min-h-[60px] cursor-pointer transition-all duration-150 select-none",
                "hover:bg-muted/60",
                !inMonth && "opacity-40",
                inRange && !isStart && !isEnd && "bg-calendar-range",
                (isStart || isEnd || isSingleSelected) &&
                  "bg-calendar-range-start text-primary-foreground rounded-md z-10",
                isStart && rangeEnd && "rounded-r-none",
                isEnd && "rounded-l-none",
              )}
              onClick={() => onDateClick(day)}
              onMouseDown={(e) => { e.preventDefault(); onDateMouseDown(day); }}
              onMouseEnter={() => onDateMouseEnter(day)}
              onDoubleClick={() => onAddEvent(day)}
              title={holiday || "Double-click to add event"}
            >
              {/* Date number */}
              <span
                className={cn(
                  "mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium md:text-sm transition-colors",
                  inMonth && weekend && !(isStart || isEnd || isSingleSelected) && "text-calendar-weekend",
                  inMonth && !weekend && !(isStart || isEnd || isSingleSelected) && "text-foreground",
                  (isStart || isEnd || isSingleSelected) && "text-primary-foreground font-bold",
                  isToday && !(isStart || isEnd || isSingleSelected) && "bg-calendar-today text-primary-foreground font-bold",
                )}
              >
                {format(day, "d")}
              </span>

              {/* Holiday indicator */}
              {holiday && inMonth && (
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-calendar-holiday animate-pulse" title={holiday} />
              )}

              {/* Holiday title text */}
              {holiday && inMonth && (
                <span className="mt-0.5 px-1 text-[7px] md:text-[8px] text-center leading-tight text-calendar-holiday font-medium truncate max-w-full animate-fade-in">
                  {holiday}
                </span>
              )}

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-[90%]">
                  {dayEvents.slice(0, 3).map((ev) => {
                    const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
                    return (
                      <span
                        key={ev.id}
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: colorObj?.dot || "#3b82f6" }}
                        title={ev.title}
                        onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-muted-foreground leading-none">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}

              {/* Add event button (hover) */}
              <button
                className="absolute bottom-0 right-0 h-4 w-4 rounded-full opacity-0 group-hover:opacity-60 hover:!opacity-100 flex items-center justify-center text-[10px] text-muted-foreground transition-opacity"
                onClick={(e) => { e.stopPropagation(); onAddEvent(day); }}
                title="Add event"
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
