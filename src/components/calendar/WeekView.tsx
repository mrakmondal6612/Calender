import { cn } from "@/lib/utils";
import {
  getWeekDays,
  isSameDay,
  isWeekend,
  getEventsForDate,
  getHoliday,
  format,
  EVENT_COLORS,
} from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/calendar-utils";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
}

export function WeekView({ currentDate, events, onEventClick, onAddEvent }: WeekViewProps) {
  const days = getWeekDays(currentDate);
  const today = new Date();

  return (
    <div className="overflow-x-auto">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border sticky top-0 bg-card z-10">
        <div className="p-2" />
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const holiday = getHoliday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "p-2 text-center border-l border-border cursor-pointer hover:bg-muted/40",
                isToday && "bg-calendar-range"
              )}
              onDoubleClick={() => onAddEvent(day)}
            >
              <p className={cn(
                "text-[10px] uppercase tracking-wider",
                isWeekend(day) ? "text-calendar-weekend" : "text-muted-foreground"
              )}>
                {format(day, "EEE")}
              </p>
              <p className={cn(
                "text-lg font-semibold",
                isToday ? "text-primary" : "text-foreground"
              )}>
                {format(day, "d")}
              </p>
              {holiday && <p className="text-[8px] text-calendar-holiday truncate">{holiday}</p>}
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[400px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[48px]">
            <div className="p-1 text-right pr-2 text-[10px] text-muted-foreground border-b border-border">
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>
            {days.map((day) => {
              const dayEvents = getEventsForDate(events, day).filter((e) => {
                if (e.isAllDay) return false;
                if (!e.time) return false;
                const eventHour = parseInt(e.time.split(":")[0], 10);
                return eventHour === hour;
              });

              return (
                <div
                  key={day.toISOString()}
                  className="border-l border-b border-border p-0.5 hover:bg-muted/30 cursor-pointer relative"
                  onDoubleClick={() => onAddEvent(day)}
                >
                  {dayEvents.map((ev) => {
                    const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => onEventClick(ev)}
                        className="w-full text-left px-1 py-0.5 rounded text-[10px] font-medium truncate mb-0.5"
                        style={{
                          backgroundColor: colorObj?.dot + "20",
                          color: colorObj?.dot,
                          borderLeft: `2px solid ${colorObj?.dot}`,
                        }}
                      >
                        {ev.time} {ev.title}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* All-day events */}
      {days.some((day) => getEventsForDate(events, day).some((e) => e.isAllDay)) && (
        <div className="border-t border-border">
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            <div className="p-1 text-right pr-2 text-[9px] text-muted-foreground uppercase">All day</div>
            {days.map((day) => {
              const allDayEvents = getEventsForDate(events, day).filter((e) => e.isAllDay);
              return (
                <div key={day.toISOString()} className="border-l border-border p-0.5">
                  {allDayEvents.map((ev) => {
                    const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => onEventClick(ev)}
                        className="w-full text-left px-1 py-0.5 rounded text-[9px] font-medium truncate mb-0.5"
                        style={{ backgroundColor: colorObj?.dot + "25", color: colorObj?.dot }}
                      >
                        {ev.title}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
