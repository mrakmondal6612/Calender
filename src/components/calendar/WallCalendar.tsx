import { useState, useCallback, useEffect } from "react";
import { addMonths } from "date-fns";
import { useCalendar } from "@/hooks/useCalendar";
import { useTodos } from "@/hooks/useTodos";
import { useSettings } from "@/hooks/useSettings";
import { CalendarHero } from "./CalendarHero";
import { SpiralBinding } from "./SpiralBinding";
import { CalendarNav } from "./CalendarNav";
import { ClockModal } from "./ClockModal";
import { DayDetailModal } from "./DayDetailModal";
import { CalendarGrid } from "./CalendarGrid";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { AgendaView } from "./AgendaView";
import { NotesPanel } from "./NotesPanel";
import { TodoPanel } from "./TodoPanel";
import { EventModal } from "./EventModal";
import { YearMonthPicker } from "./YearMonthPicker";
import { MiniCalendar } from "./MiniCalendar";
import { SearchPanel } from "./SearchPanel";
import { ExportPanel } from "./ExportPanel";
import { SettingsPanel } from "./SettingsPanel";
import { format } from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/calendar-utils";
import type { Todo } from "@/lib/calendar-types";
import { Keyboard, CheckSquare, StickyNote } from "lucide-react";
import { toast } from "sonner";

export function WallCalendar() {
  const cal = useCalendar();
  const todoHook = useTodos();
  const { settings, updateSettings } = useSettings();

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [selectedDetailDate, setSelectedDetailDate] = useState<Date | null>(null);
  const [rightTab, setRightTab] = useState<"notes" | "todos">("notes");

  // Ctrl+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAddEventForDate = useCallback((date: Date) => {
    setEventDate(format(date, "yyyy-MM-dd"));
    setEditingEvent(null);
    setShowEventModal(true);
  }, []);

  const handleAddEventGeneric = useCallback(() => {
    setEventDate(cal.selectedDate ? format(cal.selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    setEditingEvent(null);
    setShowEventModal(true);
  }, [cal.selectedDate]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventModal(true);
  }, []);

  const handleDateClickDetail = useCallback((date: Date) => {
    setSelectedDetailDate(date);
    setShowDayDetail(true);
  }, []);

  const handleSaveEvent = useCallback((event: CalendarEvent) => {
    if (editingEvent) { cal.updateEvent(event); toast.success("Event updated"); }
    else { cal.addEvent(event); toast.success("Event created"); }
    setShowDayDetail(false);
  }, [editingEvent, cal.updateEvent, cal.addEvent]);

  const handleEditTodoFromDetail = useCallback((todo: Todo) => {
    // Switch to todos tab and scroll to the todo
    setRightTab("todos");
    setShowDayDetail(false);
    toast.info(`Opening todo: ${todo.title}`);
  }, []);

  const onPrev = cal.view === "week" ? cal.goToPrevWeek : cal.view === "day" ? cal.goToPrevDay : cal.goPrevMonth;
  const onNext = cal.view === "week" ? cal.goToNextWeek : cal.view === "day" ? cal.goToNextDay : cal.goNextMonth;

  const notesLabel = cal.rangeStart && cal.rangeEnd
    ? `${format(cal.rangeStart < cal.rangeEnd ? cal.rangeStart : cal.rangeEnd, "MMM d")} – ${format(cal.rangeStart < cal.rangeEnd ? cal.rangeEnd : cal.rangeStart, "MMM d, yyyy")}`
    : format(cal.currentMonth, "MMMM yyyy");

  const miniMonths = [1, 2, 3].map((offset) => addMonths(cal.currentMonth, offset));

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main calendar card */}
        <div className="calendar-shadow flex-1 min-w-0 overflow-hidden rounded-lg bg-card">
          <div className="flex flex-col md:flex-row">
            {/* Left panel */}
            <div className="flex-1 min-w-0">
              {cal.view === "month" && (
                <>
                  <CalendarHero currentMonth={cal.currentMonth} flipKey={cal.flipKey} />
                  <SpiralBinding />
                </>
              )}
              <CalendarNav
                currentMonth={cal.currentMonth}
                rangeStart={cal.rangeStart}
                rangeEnd={cal.rangeEnd}
                view={cal.view}
                onPrev={onPrev}
                onNext={onNext}
                onToday={cal.goToToday}
                onClearRange={cal.clearRange}
                onViewChange={cal.setView}
                onOpenPicker={() => setShowPicker(true)}
                onAddEvent={handleAddEventGeneric}
                onSearch={() => setShowSearch(true)}
                onExport={() => setShowExport(true)}
                onSettings={() => setShowSettings(true)}
                onClock={() => setShowClock(true)}
              />

              {cal.view === "month" && (
                <CalendarGrid
                  currentMonth={cal.currentMonth}
                  rangeStart={cal.rangeStart}
                  rangeEnd={cal.rangeEnd}
                  events={cal.events}
                  holidayCountry={settings.holidayCountry}
                  onDateClick={handleDateClickDetail}
                  onDateMouseDown={cal.handleDateMouseDown}
                  onDateMouseEnter={cal.handleDateMouseEnter}
                  onDateMouseUp={cal.handleDateMouseUp}
                  onEventClick={handleEventClick}
                  onAddEvent={handleAddEventForDate}
                />
              )}

              {cal.view === "week" && (
                <WeekView currentDate={cal.currentMonth} events={cal.events} holidayCountry={settings.holidayCountry}
                  onEventClick={handleEventClick} onAddEvent={handleAddEventForDate} />
              )}

              {cal.view === "day" && (
                <DayView currentDate={cal.currentMonth} events={cal.events} holidayCountry={settings.holidayCountry}
                  onEventClick={handleEventClick} onAddEvent={handleAddEventForDate} />
              )}

              {cal.view === "agenda" && (
                <AgendaView currentMonth={cal.currentMonth} events={cal.events}
                  onEventClick={handleEventClick} />
              )}
            </div>

            {/* Right panel: notes / todos */}
            <div className="w-full md:w-[280px] flex flex-col border-l border-border">
              {/* Tab switcher */}
              <div className="flex border-b border-border">
                <button onClick={() => setRightTab("notes")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${rightTab === "notes" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <StickyNote className="h-3 w-3" /> Notes
                </button>
                <button onClick={() => setRightTab("todos")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${rightTab === "todos" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <CheckSquare className="h-3 w-3" /> Tasks
                  {todoHook.stats.todo + todoHook.stats.inProgress > 0 && (
                    <span className="bg-primary text-primary-foreground text-[9px] rounded-full px-1.5 py-0.5 leading-none">
                      {todoHook.stats.todo + todoHook.stats.inProgress}
                    </span>
                  )}
                </button>
              </div>

              {rightTab === "notes" ? (
                <NotesPanel notes={cal.currentNotes} label={notesLabel} onAdd={cal.addNote} onDelete={cal.deleteNote} />
              ) : (
                <TodoPanel
                  todos={todoHook.todos}
                  filteredTodos={todoHook.filteredAndSorted}
                  stats={todoHook.stats}
                  allTags={todoHook.allTags}
                  sortBy={todoHook.sortBy}
                  filters={todoHook.filters}
                  onSortChange={todoHook.setSortBy}
                  onFilterChange={todoHook.setFilters}
                  onAdd={(t) => { todoHook.addTodo(t); toast.success("Task created"); }}
                  onUpdate={(t) => { todoHook.updateTodo(t); toast.success("Task updated"); }}
                  onDelete={(id) => { todoHook.deleteTodo(id); toast.success("Task deleted"); }}
                  onToggleStatus={todoHook.toggleTodoStatus}
                  onToggleSubtask={todoHook.toggleSubtask}
                  onBulkDelete={todoHook.bulkDelete}
                  onBulkUpdateStatus={todoHook.bulkUpdateStatus}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-3 w-[180px] shrink-0">
          <div className="calendar-shadow rounded-lg bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Upcoming</p>
            {miniMonths.map((m) => (
              <MiniCalendar key={m.toISOString()} month={m} currentMonth={cal.currentMonth} events={cal.events} onSelectMonth={cal.goToMonthYear} />
            ))}
          </div>

          <button onClick={() => setShowShortcuts(!showShortcuts)} className="calendar-shadow rounded-lg bg-card p-3 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <Keyboard className="h-3 w-3" /> Shortcuts
            </p>
            {showShortcuts && (
              <div className="space-y-1 mt-2 animate-fade-in-up">
                {[["← →", "Navigate"], ["T", "Go to today"], ["1-4", "Switch view"], ["Esc", "Clear"], ["⌘K", "Search"], ["Dbl-click", "Add event"]].map(([key, desc]) => (
                  <div key={key} className="flex justify-between text-[9px]">
                    <kbd className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">{key}</kbd>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </button>

          <div className="calendar-shadow rounded-lg bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">This Month</p>
            <div className="space-y-1">
              {[
                ["Events", cal.events.filter(e => { const d = new Date(e.date); return d.getMonth() === cal.currentMonth.getMonth() && d.getFullYear() === cal.currentMonth.getFullYear(); }).length],
                ["Notes", cal.currentNotes.length],
                ["Tasks", todoHook.stats.total],
                ["Completed", todoHook.stats.completed],
              ].map(([label, count]) => (
                <div key={label as string} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventModal isOpen={showEventModal}
          onClose={() => { setShowEventModal(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
          onDelete={editingEvent ? (id) => { cal.deleteEvent(id); toast.success("Event deleted"); } : undefined}
          event={editingEvent} defaultDate={eventDate} />
      )}
      {showPicker && <YearMonthPicker currentMonth={cal.currentMonth} onSelect={cal.goToMonthYear} onClose={() => setShowPicker(false)} />}
      {showSearch && <SearchPanel events={cal.events} todos={todoHook.todos} onEventClick={handleEventClick} onTodoClick={() => { setRightTab("todos"); }} onClose={() => setShowSearch(false)} />}
      {showExport && <ExportPanel events={cal.events} todos={todoHook.todos} onClose={() => setShowExport(false)} />}
      {showSettings && <SettingsPanel settings={settings} onUpdate={updateSettings} onClose={() => setShowSettings(false)} />}
      {showClock && <ClockModal isOpen={showClock} onClose={() => setShowClock(false)} />}
      {showDayDetail && (
        <DayDetailModal
          isOpen={showDayDetail}
          onClose={() => setShowDayDetail(false)}
          date={selectedDetailDate}
          events={cal.events}
          todos={todoHook.todos}
          notes={cal.currentNotes}
          holidayCountry={settings.holidayCountry}
          onAddEvent={handleAddEventForDate}
          onEditEvent={handleEventClick}
          onEditTodo={handleEditTodoFromDetail}
        />
      )}
    </div>
  );
}
