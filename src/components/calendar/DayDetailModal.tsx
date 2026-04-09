import { useMemo } from "react";
import { X, Calendar, Clock, MapPin, Users, Tag, CheckCircle2, Circle, AlertCircle, StickyNote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, getHoliday, EVENT_COLORS } from "@/lib/calendar-utils";
import type { CalendarEvent, NoteEntry } from "@/lib/calendar-utils";
import type { Todo } from "@/lib/calendar-types";
import { PRIORITY_CONFIG, STATUS_CONFIG, TODO_CATEGORIES } from "@/lib/calendar-types";

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: CalendarEvent[];
  todos: Todo[];
  notes: NoteEntry[];
  holidayCountry: string;
  onAddEvent: (date: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onEditTodo: (todo: Todo) => void;
}

export function DayDetailModal({
  isOpen,
  onClose,
  date,
  events,
  todos,
  notes,
  holidayCountry,
  onAddEvent,
  onEditEvent,
  onEditTodo,
}: DayDetailModalProps) {
  if (!isOpen || !date) return null;

  const dateStr = format(date, "yyyy-MM-dd");
  const holiday = getHoliday(date, holidayCountry);
  
  // Filter items for this date
  const dayEvents = useMemo(() => 
    events.filter(e => e.date === dateStr || (e.endDate && e.date <= dateStr && e.endDate >= dateStr)),
    [events, dateStr]
  );
  
  const dayTodos = useMemo(() => 
    todos.filter(t => t.dueDate === dateStr),
    [todos, dateStr]
  );
  
  const dayNotes = useMemo(() => 
    notes.filter(n => n.date.startsWith(dateStr)),
    [notes, dateStr]
  );

  const totalItems = dayEvents.length + dayTodos.length + dayNotes.length + (holiday ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl animate-slide-up">
        {/* Header with Date */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-blue-600 text-primary-foreground">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">
                  {format(date, "EEEE")}
                </p>
                <h2 className="text-4xl font-bold mt-1">
                  {format(date, "d")}
                </h2>
                <p className="text-lg text-primary-foreground/90">
                  {format(date, "MMMM yyyy")}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-white/20 rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Holiday Badge */}
            {holiday && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm animate-bounce-subtle">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">{holiday}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] p-5 space-y-5">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2">
            <StatCard icon={Calendar} count={dayEvents.length} label="Events" color="blue" />
            <StatCard icon={CheckCircle2} count={dayTodos.filter(t => t.status === "completed").length} label="Done" color="green" />
            <StatCard icon={Circle} count={dayTodos.filter(t => t.status !== "completed").length} label="Tasks" color="amber" />
            <StatCard icon={StickyNote} count={dayNotes.length} label="Notes" color="purple" />
          </div>

          {/* Events Section */}
          {dayEvents.length > 0 && (
            <Section title="📅 Events" count={dayEvents.length}>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEditEvent(event)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                      "bg-gradient-to-r from-blue-50/50 to-transparent border-blue-200 hover:border-blue-300",
                      "dark:from-blue-950/30 dark:border-blue-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: EVENT_COLORS.find(c => c.id === event.color)?.dot || "#6b7280" }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">{event.title}</h4>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {event.time && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                              <Clock className="h-3 w-3" />
                              {event.time}{event.endTime && ` - ${event.endTime}`}
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                          {event.category && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                              <Tag className="h-3 w-3" />
                              {event.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Todos Section */}
          {dayTodos.length > 0 && (
            <Section title="✅ Tasks" count={dayTodos.length}>
              <div className="space-y-2">
                {dayTodos.map((todo) => {
                  const priority = PRIORITY_CONFIG[todo.priority];
                  const status = STATUS_CONFIG[todo.status];
                  const category = TODO_CATEGORIES.find(c => c.id === todo.category);
                  
                  return (
                    <div
                      key={todo.id}
                      onClick={() => onEditTodo(todo)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                        todo.status === "completed" 
                          ? "bg-gradient-to-r from-green-50/50 to-transparent border-green-200 opacity-75"
                          : "bg-gradient-to-r from-amber-50/50 to-transparent border-amber-200 hover:border-amber-300",
                        "dark:from-amber-950/30 dark:border-amber-800"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className={cn(
                          "mt-0.5 shrink-0",
                          todo.status === "completed" ? "text-green-500" : "text-amber-500"
                        )}>
                          {status.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "font-semibold text-sm truncate",
                            todo.status === "completed" && "line-through text-muted-foreground"
                          )}>
                            {todo.title}
                          </h4>
                          {todo.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{todo.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span 
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: `hsl(${priority.color} / 0.2)`,
                                color: `hsl(${priority.color})`
                              }}
                            >
                              <AlertCircle className="h-3 w-3" />
                              {priority.label}
                            </span>
                            {category && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {category.emoji} {category.label}
                              </span>
                            )}
                            {todo.subtasks.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length} subtasks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Notes Section */}
          {dayNotes.length > 0 && (
            <Section title="📝 Notes" count={dayNotes.length}>
              <div className="space-y-2">
                {dayNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/30 dark:border-purple-800"
                  >
                    <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {format(new Date(note.date), "h:mm a")}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No events, tasks, or notes for this date</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => onAddEvent(date)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-4 bg-muted/30 flex gap-2">
          <Button 
            className="flex-1" 
            onClick={() => onAddEvent(date)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, count, label, color }: { icon: typeof Calendar; count: number; label: string; color: string }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  };
  
  return (
    <div className={cn("flex flex-col items-center p-3 rounded-xl", colorClasses[color as keyof typeof colorClasses])}>
      <Icon className="h-4 w-4 mb-1" />
      <span className="text-lg font-bold">{count}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-80">{label}</span>
    </div>
  );
}
