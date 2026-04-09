import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Todo, TodoPriority, TodoCategory, SubTask } from "@/lib/calendar-types";
import { PRIORITY_CONFIG, TODO_CATEGORIES } from "@/lib/calendar-types";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  todo?: Todo | null;
}

export function TodoModal({ isOpen, onClose, onSave, onDelete, todo }: TodoModalProps) {
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [priority, setPriority] = useState<TodoPriority>(todo?.priority || "medium");
  const [category, setCategory] = useState<TodoCategory>(todo?.category || "personal");
  const [dueDate, setDueDate] = useState(todo?.dueDate || "");
  const [tags, setTags] = useState(todo?.tags.join(", ") || "");
  const [subtasks, setSubtasks] = useState<SubTask[]>(todo?.subtasks || []);
  const [notes, setNotes] = useState(todo?.notes || "");
  const [newSubtask, setNewSubtask] = useState("");

  if (!isOpen) return null;

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), text: newSubtask.trim(), completed: false }]);
    setNewSubtask("");
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const t: Todo = {
      id: todo?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: todo?.status || "todo",
      category,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      dueDate: dueDate || undefined,
      subtasks,
      createdAt: todo?.createdAt || new Date().toISOString(),
      completedAt: todo?.completedAt,
      notes: notes.trim(),
    };
    onSave(t);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl animate-fade-in-up mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground">{todo ? "Edit Task" : "New Task"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" autoFocus
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TodoPriority)}
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as TodoCategory)}
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {TODO_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground uppercase">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground uppercase">Tags (comma separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="work, important, ..."
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase">Subtasks</label>
            <div className="space-y-1 mt-1">
              {subtasks.map((st, i) => (
                <div key={st.id} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs">{i + 1}.</span>
                  <span className="flex-1 text-foreground">{st.text}</span>
                  <button onClick={() => setSubtasks((p) => p.filter((s) => s.id !== st.id))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-1">
                <input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} placeholder="Add subtask"
                  onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none" />
                <Button variant="ghost" size="sm" className="h-7" onClick={addSubtask}><Plus className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground uppercase">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div>
            {todo && onDelete && (
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { onDelete(todo.id); onClose(); }}>Delete</Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>{todo ? "Update" : "Create"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
