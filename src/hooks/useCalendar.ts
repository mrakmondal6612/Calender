import { useState, useCallback, useEffect } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format, setMonth, setYear } from "date-fns";
import type { NoteEntry, CalendarEvent, CalendarView } from "@/lib/calendar-utils";
import { getNotesKey } from "@/lib/calendar-utils";

const NOTES_KEY = "wall-calendar-notes";
const EVENTS_KEY = "wall-calendar-events";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [allNotes, setAllNotes] = useState<Record<string, NoteEntry[]>>(() => load(NOTES_KEY, {}));
  const [events, setEvents] = useState<CalendarEvent[]>(() => load(EVENTS_KEY, []));
  const [flipKey, setFlipKey] = useState(0);
  const [view, setView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes)); }, [allNotes]);
  useEffect(() => { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); }, [events]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); return; } // handled by WallCalendar
      if (e.key === "ArrowLeft") { e.preventDefault(); view === "week" ? goToPrevWeek() : view === "day" ? goToPrevDay() : goPrevMonth(); }
      if (e.key === "ArrowRight") { e.preventDefault(); view === "week" ? goToNextWeek() : view === "day" ? goToNextDay() : goNextMonth(); }
      if (e.key === "t" || e.key === "T") goToToday();
      if (e.key === "Escape") clearRange();
      if (e.key === "1") setView("month");
      if (e.key === "2") setView("week");
      if (e.key === "3") setView("day");
      if (e.key === "4") setView("agenda");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const goNextMonth = useCallback(() => { setCurrentMonth((m) => addMonths(m, 1)); setFlipKey((k) => k + 1); }, []);
  const goPrevMonth = useCallback(() => { setCurrentMonth((m) => subMonths(m, 1)); setFlipKey((k) => k + 1); }, []);
  const goToNextWeek = useCallback(() => { setCurrentMonth((m) => addWeeks(m, 1)); }, []);
  const goToPrevWeek = useCallback(() => { setCurrentMonth((m) => subWeeks(m, 1)); }, []);
  const goToNextDay = useCallback(() => { setCurrentMonth((m) => addDays(m, 1)); }, []);
  const goToPrevDay = useCallback(() => { setCurrentMonth((m) => subDays(m, 1)); }, []);
  const goToToday = useCallback(() => { setCurrentMonth(new Date()); setFlipKey((k) => k + 1); }, []);

  const goToMonthYear = useCallback((month: number, year: number) => {
    setCurrentMonth((m) => setYear(setMonth(m, month), year));
    setFlipKey((k) => k + 1);
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    if (!rangeStart || (rangeStart && rangeEnd)) { setRangeStart(date); setRangeEnd(null); }
    else { setRangeEnd(date); }
  }, [rangeStart, rangeEnd]);

  const handleDateMouseDown = useCallback((date: Date) => {
    setIsDragging(true); setRangeStart(date); setRangeEnd(null); setSelectedDate(date);
  }, []);

  const handleDateMouseEnter = useCallback((date: Date) => {
    if (isDragging) setRangeEnd(date);
  }, [isDragging]);

  const handleDateMouseUp = useCallback(() => { setIsDragging(false); }, []);
  const clearRange = useCallback(() => { setRangeStart(null); setRangeEnd(null); setSelectedDate(null); }, []);

  // Notes
  const notesKey = getNotesKey(rangeStart, rangeEnd, currentMonth);
  const currentNotes = allNotes[notesKey] || [];

  const addNote = useCallback((text: string) => {
    const entry: NoteEntry = { id: crypto.randomUUID(), text, date: new Date().toISOString() };
    setAllNotes((prev) => ({ ...prev, [notesKey]: [...(prev[notesKey] || []), entry] }));
  }, [notesKey]);

  const deleteNote = useCallback((id: string) => {
    setAllNotes((prev) => ({ ...prev, [notesKey]: (prev[notesKey] || []).filter((n) => n.id !== id) }));
  }, [notesKey]);

  // Events
  const addEvent = useCallback((event: CalendarEvent) => { setEvents((prev) => [...prev, event]); }, []);
  const updateEvent = useCallback((event: CalendarEvent) => { setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e))); }, []);
  const deleteEvent = useCallback((id: string) => { setEvents((prev) => prev.filter((e) => e.id !== id)); }, []);

  return {
    currentMonth, rangeStart, rangeEnd, flipKey, currentNotes, notesKey,
    events, view, selectedDate,
    setView, setSelectedDate,
    goNextMonth, goPrevMonth, goToNextWeek, goToPrevWeek, goToNextDay, goToPrevDay, goToToday, goToMonthYear,
    handleDateClick, handleDateMouseDown, handleDateMouseEnter, handleDateMouseUp,
    clearRange, addNote, deleteNote, addEvent, updateEvent, deleteEvent,
  };
}
