import { useState, useMemo } from "react";
import { Search, X, Calendar, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar-utils";
import { EVENT_COLORS } from "@/lib/calendar-utils";
import type { Todo } from "@/lib/calendar-types";
import { PRIORITY_CONFIG } from "@/lib/calendar-types";

interface SearchPanelProps {
  events: CalendarEvent[];
  todos: Todo[];
  onEventClick: (event: CalendarEvent) => void;
  onTodoClick: (todo: Todo) => void;
  onClose: () => void;
}

type SearchType = "all" | "events" | "todos";

export function SearchPanel({ events, todos, onEventClick, onTodoClick, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("all");

  const results = useMemo(() => {
    if (!query.trim()) return { events: [], todos: [] };
    const q = query.toLowerCase();

    const matchedEvents = (type === "all" || type === "events")
      ? events.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.date.includes(q)
      ).slice(0, 20)
      : [];

    const matchedTodos = (type === "all" || type === "todos")
      ? todos.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      ).slice(0, 20)
      : [];

    return { events: matchedEvents, todos: matchedTodos };
  }, [query, type, events, todos]);

  const totalResults = results.events.length + results.todos.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-card shadow-2xl animate-fade-in-up mx-4 max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, tasks, tags..."
            autoFocus className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          {query && <button onClick={() => setQuery("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        {/* Type filter */}
        <div className="flex gap-1 px-4 py-2 border-b border-border">
          {(["all", "events", "todos"] as SearchType[]).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={cn("px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors",
                type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
              {t}
            </button>
          ))}
          {query && <span className="ml-auto text-[10px] text-muted-foreground">{totalResults} results</span>}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {!query.trim() && (
            <div className="py-12 text-center text-xs text-muted-foreground">Start typing to search...</div>
          )}

          {results.events.map((ev) => {
            const colorObj = EVENT_COLORS.find((c) => c.id === ev.color);
            return (
              <button key={ev.id} onClick={() => { onEventClick(ev); onClose(); }}
                className="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 shrink-0" style={{ color: colorObj?.dot }} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                  <p className="text-[10px] text-muted-foreground">{ev.date} {ev.time && `· ${ev.time}`}</p>
                  {ev.description && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{ev.description}</p>}
                </div>
              </button>
            );
          })}

          {results.todos.map((todo) => {
            const priCfg = PRIORITY_CONFIG[todo.priority];
            return (
              <button key={todo.id} onClick={() => { onTodoClick(todo); onClose(); }}
                className="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex items-start gap-3">
                <CheckSquare className="h-4 w-4 mt-0.5 shrink-0" style={{ color: priCfg.dot }} />
                <div className="min-w-0">
                  <p className={cn("text-sm font-medium text-foreground truncate", todo.status === "completed" && "line-through")}>{todo.title}</p>
                  <p className="text-[10px] text-muted-foreground">{todo.status} · {todo.priority} {todo.dueDate && `· due ${todo.dueDate}`}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
