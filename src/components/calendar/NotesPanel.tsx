import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NoteEntry } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  notes: NoteEntry[];
  label: string;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}

export function NotesPanel({ notes, label, onAdd, onDelete }: NotesPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col bg-calendar-notes-bg rounded-b-lg md:rounded-b-none md:rounded-r-lg border-t md:border-t-0 md:border-l border-border">
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-display text-sm font-semibold text-foreground">
          Notes
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
      </div>

      {/* Lined note area */}
      <div className="flex-1 overflow-y-auto px-4 min-h-[120px] max-h-[240px] md:max-h-none">
        {notes.length === 0 && (
          <p className="note-line py-2 text-xs text-muted-foreground/60 italic">
            No notes yet…
          </p>
        )}
        {notes.map((note, i) => (
          <div
            key={note.id}
            className={cn(
              "group flex items-start gap-2 py-1.5 note-line animate-fade-in-up"
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="flex-1 text-xs text-foreground leading-relaxed">
              {note.text}
            </span>
            <button
              onClick={() => onDelete(note.id)}
              className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add note */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a note…"
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        <Button type="submit" variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
