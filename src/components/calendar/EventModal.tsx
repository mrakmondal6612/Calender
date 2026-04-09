import { useState } from "react";
import { X, Clock, Calendar, Repeat, MapPin, Users, Bell, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent, EventColor } from "@/lib/calendar-utils";
import { EVENT_COLORS, format } from "@/lib/calendar-utils";
import { EVENT_CATEGORIES, REMINDER_OPTIONS } from "@/lib/calendar-types";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent | null;
  defaultDate?: string;
}

export function EventModal({ isOpen, onClose, onSave, onDelete, event, defaultDate }: EventModalProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || defaultDate || format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(event?.endDate || "");
  const [time, setTime] = useState(event?.time || "");
  const [endTime, setEndTime] = useState(event?.endTime || "");
  const [color, setColor] = useState<EventColor>(event?.color || "blue");
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay ?? true);
  const [recurring, setRecurring] = useState<CalendarEvent["recurring"]>(event?.recurring || "none");
  const [location, setLocation] = useState(event?.location || "");
  const [attendees, setAttendees] = useState(event?.attendees || "");
  const [category, setCategory] = useState(event?.category || "other");
  const [reminders, setReminders] = useState<number[]>(event?.reminders || []);

  if (!isOpen) return null;

  const toggleReminder = (val: number) => {
    setReminders((prev) => prev.includes(val) ? prev.filter((r) => r !== val) : [...prev, val]);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const newEvent: CalendarEvent = {
      id: event?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      date,
      endDate: endDate || undefined,
      time: isAllDay ? undefined : time || undefined,
      endTime: isAllDay ? undefined : endTime || undefined,
      color,
      isAllDay,
      recurring,
      location: location.trim() || undefined,
      attendees: attendees.trim() || undefined,
      category,
      reminders: reminders.length > 0 ? reminders : undefined,
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl animate-fade-in-up mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground">{event ? "Edit Event" : "New Event"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" autoFocus
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />

          {/* Category */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {EVENT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <input value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="Attendees (comma separated)"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Date row */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-xs text-muted-foreground">to</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* All day toggle + time */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} className="rounded border-border" />
              All day
            </label>
            {!isAllDay && (
              <div className="flex items-center gap-2 animate-fade-in-up">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <span className="text-xs text-muted-foreground">–</span>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            )}
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <select value={recurring} onChange={(e) => setRecurring(e.target.value as CalendarEvent["recurring"])}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="none">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Reminders */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Reminders</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {REMINDER_OPTIONS.map((r) => (
                <button key={r.value} onClick={() => toggleReminder(r.value)}
                  className={cn("px-2 py-1 rounded text-[10px] font-medium transition-colors",
                    reminders.includes(r.value) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Color:</span>
            <div className="flex gap-1.5">
              {EVENT_COLORS.map((c) => (
                <button key={c.id} onClick={() => setColor(c.id)}
                  className={cn("h-6 w-6 rounded-full border-2 transition-all", color === c.id ? "border-foreground scale-110" : "border-transparent")}
                  style={{ backgroundColor: c.dot }} title={c.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div>
            {event && onDelete && (
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                onClick={() => { onDelete(event.id); onClose(); }}>Delete</Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>{event ? "Update" : "Create"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
