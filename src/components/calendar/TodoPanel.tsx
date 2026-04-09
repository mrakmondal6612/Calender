import { useState, useMemo } from "react";
import { Plus, Trash2, ChevronDown, Filter, ArrowUpDown, CheckCircle2, Circle, Clock, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Todo, TodoPriority, TodoStatus, TodoCategory, SubTask } from "@/lib/calendar-types";
import { PRIORITY_CONFIG, STATUS_CONFIG, TODO_CATEGORIES } from "@/lib/calendar-types";
import type { TodoSortBy, TodoFilterBy } from "@/hooks/useTodos";
import { TodoModal } from "./TodoModal";

interface TodoPanelProps {
  todos: Todo[];
  filteredTodos: Todo[];
  stats: { total: number; todo: number; inProgress: number; completed: number; overdue: number };
  allTags: string[];
  sortBy: TodoSortBy;
  filters: TodoFilterBy;
  onSortChange: (s: TodoSortBy) => void;
  onFilterChange: (f: TodoFilterBy) => void;
  onAdd: (todo: Todo) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkUpdateStatus: (ids: string[], status: TodoStatus) => void;
}

export function TodoPanel({
  todos, filteredTodos, stats, allTags, sortBy, filters,
  onSortChange, onFilterChange, onAdd, onUpdate, onDelete, onToggleStatus, onToggleSubtask,
  onBulkDelete, onBulkUpdateStatus,
}: TodoPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleEdit = (todo: Todo) => { setEditingTodo(todo); setShowModal(true); };
  const handleAdd = () => { setEditingTodo(null); setShowModal(true); };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-display text-sm font-semibold text-foreground">Tasks</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={handleAdd}>
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-2 px-4 py-2 text-[10px] text-muted-foreground border-b border-border bg-muted/30">
        <span>{stats.total} total</span>
        <span>·</span>
        <span className="text-primary">{stats.todo} todo</span>
        <span>·</span>
        <span className="text-amber-500">{stats.inProgress} active</span>
        <span>·</span>
        <span className="text-green-500">{stats.completed} done</span>
        {stats.overdue > 0 && <><span>·</span><span className="text-destructive">{stats.overdue} overdue</span></>}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 py-2 border-b border-border bg-muted/20 space-y-2 animate-fade-in-up">
          <div className="flex gap-2 flex-wrap">
            <select value={filters.status || "all"} onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
              className="text-[10px] rounded border border-border bg-background px-1.5 py-1 text-foreground">
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select value={filters.priority || "all"} onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as any })}
              className="text-[10px] rounded border border-border bg-background px-1.5 py-1 text-foreground">
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={filters.category || "all"} onChange={(e) => onFilterChange({ ...filters, category: e.target.value as any })}
              className="text-[10px] rounded border border-border bg-background px-1.5 py-1 text-foreground">
              <option value="all">All Category</option>
              {TODO_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value as TodoSortBy)}
              className="text-[10px] rounded border border-border bg-background px-1.5 py-1 text-foreground">
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
              <option value="created">Sort: Created</option>
            </select>
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border bg-primary/5 text-xs">
          <span className="text-muted-foreground">{selectedIds.length} selected</span>
          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => { onBulkUpdateStatus(selectedIds, "completed"); setSelectedIds([]); }}>
            <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive" onClick={() => { onBulkDelete(selectedIds); setSelectedIds([]); }}>
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setSelectedIds([])}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Todo list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filteredTodos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-xs">No tasks yet</p>
          </div>
        )}
        {filteredTodos.map((todo) => {
          const priorityCfg = PRIORITY_CONFIG[todo.priority];
          const isExpanded = expandedId === todo.id;
          const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
          return (
            <div key={todo.id} className={cn("px-4 py-2.5 hover:bg-muted/30 transition-colors", todo.status === "completed" && "opacity-60")}>
              <div className="flex items-start gap-2">
                <input type="checkbox" checked={selectedIds.includes(todo.id)} onChange={() => toggleSelect(todo.id)}
                  className="mt-1 rounded border-border" />
                <button onClick={() => onToggleStatus(todo.id)} className="mt-0.5 shrink-0" title="Toggle status">
                  {todo.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                    todo.status === "in_progress" ? <Clock className="h-4 w-4 text-amber-500" /> :
                      <Circle className="h-4 w-4 text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleEdit(todo)}>
                  <p className={cn("text-xs font-medium text-foreground truncate", todo.status === "completed" && "line-through")}>
                    {todo.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: priorityCfg.dot }} title={priorityCfg.label} />
                    <span className="text-[9px] text-muted-foreground">{TODO_CATEGORIES.find((c) => c.id === todo.category)?.emoji}</span>
                    {todo.dueDate && (
                      <span className={cn("text-[9px]", todo.dueDate < new Date().toISOString().slice(0, 10) && todo.status !== "completed" ? "text-destructive" : "text-muted-foreground")}>
                        {todo.dueDate}
                      </span>
                    )}
                    {todo.subtasks.length > 0 && (
                      <span className="text-[9px] text-muted-foreground">{completedSubtasks}/{todo.subtasks.length}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => setExpandedId(isExpanded ? null : todo.id)} className="text-muted-foreground hover:text-foreground mt-0.5">
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
                </button>
              </div>

              {isExpanded && (
                <div className="ml-10 mt-2 space-y-1.5 animate-fade-in-up">
                  {todo.description && <p className="text-[10px] text-muted-foreground">{todo.description}</p>}
                  {todo.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {todo.tags.map((tag) => (
                        <span key={tag} className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground flex items-center gap-0.5">
                          <Tag className="h-2 w-2" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {todo.subtasks.length > 0 && (
                    <div className="space-y-1">
                      {todo.subtasks.map((st) => (
                        <label key={st.id} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
                          <input type="checkbox" checked={st.completed} onChange={() => onToggleSubtask(todo.id, st.id)} className="rounded border-border" />
                          <span className={cn(st.completed && "line-through text-muted-foreground")}>{st.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {todo.notes && <p className="text-[10px] text-muted-foreground italic">{todo.notes}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <TodoModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditingTodo(null); }}
          onSave={(t) => editingTodo ? onUpdate(t) : onAdd(t)}
          onDelete={editingTodo ? onDelete : undefined}
          todo={editingTodo}
        />
      )}
    </div>
  );
}
