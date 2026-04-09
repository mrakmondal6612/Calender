import { cn } from "@/lib/utils";
import { isSameDay, getEventsForDate, getHoliday, format, EVENT_COLORS } from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/calendar-utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  holidayCountry?: string;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

export function DayView({ currentDate, events, holidayCountry = "us", onEventClick, onAddEvent }: DayViewProps) {
  const today = new Date();
  const isToday = isSameDay(currentDate, today);
  const holiday = getHoliday(currentDate, holidayCountry);
  const dayEvents = getEventsForDate(events, currentDate);
  const allDayEvents = dayEvents.filter((e) => e.isAllDay);
  const timedEvents = dayEvents.filter((e) => !e.isAllDay && e.time);

  return (
    <div className="flex flex-col">
      {/* Day header */}
      <div className={cn("text-center py-3 border-b border-border", isToday && "bg-calendar-range")}>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{format(currentDate, "EEEE")}</p>
        <p className={cn("text-3xl font-bold", isToday ? "text-primary" : "text-foreground")}>{format(currentDate, "d")}</p>
        <p className="text-xs text-muted-foreground">{format(currentDate, "MMMM yyyy")}</p>
        {holiday && <p className="text-[10px] text-calendar-holiday mt-1">{holiday}</p>}
      </div>

      {/* All day events */}
      {allDayEvents.length > 0 && (
        <div className="px-3 py-2 border-b border-border">
          <p className="text-[9px] uppercase text-muted-foreground mb-1">All Day</p>
          <div className="space-y-1">
            {allDayEvents.map((ev) => {
              const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
              return (
                <button key={ev.id} onClick={() => onEventClick(ev)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs font-medium truncate"
                  style={{ backgroundColor: colorObj?.dot + "20", color: colorObj?.dot, borderLeft: `3px solid ${colorObj?.dot}` }}>
                  {ev.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hourly grid */}
      <div className="max-h-[450px] overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = timedEvents.filter((e) => parseInt(e.time!.split(":")[0], 10) === hour);
          const nowHour = today.getHours();
          const isCurrentHour = isToday && hour === nowHour;

          return (
            <div key={hour} className={cn("flex min-h-[48px] border-b border-border", isCurrentHour && "bg-primary/5")}
              onDoubleClick={() => onAddEvent(currentDate)}>
              <div className="w-16 shrink-0 p-1 text-right pr-3 text-[10px] text-muted-foreground">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
              <div className="flex-1 p-0.5 relative">
                {isCurrentHour && (
                  <div className="absolute left-0 right-0 border-t-2 border-primary z-10"
                    style={{ top: `${(today.getMinutes() / 60) * 100}%` }}>
                    <div className="w-2 h-2 rounded-full bg-primary -mt-1 -ml-1" />
                  </div>
                )}
                {hourEvents.map((ev) => {
                  const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
                  return (
                    <button key={ev.id} onClick={() => onEventClick(ev)}
                      className="w-full text-left px-2 py-1 rounded text-xs font-medium truncate mb-0.5"
                      style={{ backgroundColor: colorObj?.dot + "20", color: colorObj?.dot, borderLeft: `2px solid ${colorObj?.dot}` }}>
                      {ev.time} {ev.title} {ev.endTime && `– ${ev.endTime}`}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
