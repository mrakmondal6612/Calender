import { cn } from "@/lib/utils";
import {
  format,
  parseISO,
  EVENT_COLORS,
  getEventsForMonth,
  isSameDay,
} from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/calendar-utils";
import { CalendarDays, Clock, MapPin } from "lucide-react";

interface AgendaViewProps {
  currentMonth: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaView({ currentMonth, events, onEventClick }: AgendaViewProps) {
  const monthEvents = getEventsForMonth(events, currentMonth);
  const sortedEvents = [...monthEvents].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return (a.time || "").localeCompare(b.time || "");
  });

  // Group by date
  const grouped: Record<string, CalendarEvent[]> = {};
  for (const ev of sortedEvents) {
    if (!grouped[ev.date]) grouped[ev.date] = [];
    grouped[ev.date].push(ev);
  }

  const today = new Date();

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm">No events this month</p>
        <p className="text-xs mt-1">Double-click any date to add one</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border max-h-[450px] overflow-y-auto">
      {Object.entries(grouped).map(([dateStr, dayEvents]) => {
        const date = parseISO(dateStr);
        const isToday = isSameDay(date, today);

        return (
          <div key={dateStr} className="flex gap-4 p-3 md:p-4">
            {/* Date column */}
            <div className={cn(
              "flex flex-col items-center justify-start min-w-[50px] pt-1",
            )}>
              <span className={cn(
                "text-xs uppercase tracking-wider",
                isToday ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
                {format(date, "EEE")}
              </span>
              <span className={cn(
                "text-2xl font-bold",
                isToday ? "text-primary" : "text-foreground"
              )}>
                {format(date, "d")}
              </span>
            </div>

            {/* Events */}
            <div className="flex-1 space-y-2">
              {dayEvents.map((ev) => {
                const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
                return (
                  <button
                    key={ev.id}
                    onClick={() => onEventClick(ev)}
                    className="w-full text-left rounded-lg p-3 transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: colorObj?.dot + "12",
                      borderLeft: `3px solid ${colorObj?.dot}`,
                    }}
                  >
                    <p className="text-sm font-semibold text-foreground">{ev.title}</p>
                    {ev.time && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ""}
                      </p>
                    )}
                    {ev.isAllDay && (
                      <p className="text-xs text-muted-foreground mt-1">All day</p>
                    )}
                    {ev.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ev.description}</p>
                    )}
                    {ev.recurring && ev.recurring !== "none" && (
                      <p className="text-[10px] text-muted-foreground mt-1 capitalize">
                        🔁 {ev.recurring}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
