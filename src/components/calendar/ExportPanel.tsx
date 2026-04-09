import { useState } from "react";
import { X, Download, FileText, Calendar, FileJson, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/lib/calendar-utils";
import type { Todo } from "@/lib/calendar-types";
import { toast } from "sonner";

interface ExportPanelProps {
  events: CalendarEvent[];
  todos: Todo[];
  onClose: () => void;
}

type ExportFormat = "csv" | "ical" | "json" | "print";
type ExportScope = "events" | "todos" | "all";

export function ExportPanel({ events, todos, onClose }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [scope, setScope] = useState<ExportScope>("all");

  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filename}`);
  };

  const exportCSV = () => {
    const lines: string[] = [];
    if (scope !== "todos") {
      lines.push("Type,Title,Date,End Date,Time,End Time,Color,All Day,Recurring,Description");
      events.forEach((e) => {
        lines.push(`Event,"${e.title}",${e.date},${e.endDate || ""},${e.time || ""},${e.endTime || ""},${e.color},${e.isAllDay},${e.recurring || "none"},"${e.description}"`);
      });
    }
    if (scope !== "events") {
      if (lines.length > 0) lines.push("");
      lines.push("Type,Title,Priority,Status,Category,Due Date,Tags,Description");
      todos.forEach((t) => {
        lines.push(`Todo,"${t.title}",${t.priority},${t.status},${t.category},${t.dueDate || ""},"${t.tags.join(";")}","${t.description}"`);
      });
    }
    download(lines.join("\n"), "calendar-export.csv", "text/csv");
  };

  const exportIcal = () => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PowerCalendar//EN"];
    events.forEach((e) => {
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${e.id}`);
      lines.push(`SUMMARY:${e.title}`);
      lines.push(`DTSTART:${e.date.replace(/-/g, "")}${e.time ? `T${e.time.replace(":", "")}00` : ""}`);
      if (e.endDate) lines.push(`DTEND:${e.endDate.replace(/-/g, "")}`);
      if (e.description) lines.push(`DESCRIPTION:${e.description}`);
      if (e.recurring && e.recurring !== "none") {
        const freq = e.recurring.toUpperCase();
        lines.push(`RRULE:FREQ=${freq}`);
      }
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    download(lines.join("\r\n"), "calendar-export.ics", "text/calendar");
  };

  const exportJSON = () => {
    const data: any = {};
    if (scope !== "todos") data.events = events;
    if (scope !== "events") data.todos = todos;
    data.exportedAt = new Date().toISOString();
    download(JSON.stringify(data, null, 2), "calendar-export.json", "application/json");
  };

  const handleExport = () => {
    switch (format) {
      case "csv": exportCSV(); break;
      case "ical": exportIcal(); break;
      case "json": exportJSON(); break;
      case "print": window.print(); toast.success("Print dialog opened"); break;
    }
    onClose();
  };

  const formats: { id: ExportFormat; label: string; icon: typeof FileText; desc: string }[] = [
    { id: "csv", label: "CSV", icon: FileText, desc: "Excel & Google Sheets compatible" },
    { id: "ical", label: "iCalendar", icon: Calendar, desc: "Google Calendar, Outlook, Apple" },
    { id: "json", label: "JSON", icon: FileJson, desc: "Complete backup & restore" },
    { id: "print", label: "Print / PDF", icon: Printer, desc: "Professional formatted output" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-2xl animate-fade-in-up mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground">Export Data</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase">Scope</label>
            <div className="flex gap-1 mt-1">
              {(["all", "events", "todos"] as ExportScope[]).map((s) => (
                <button key={s} onClick={() => setScope(s)}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium capitalize transition-colors ${scope === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground uppercase">Format</label>
            <div className="space-y-1.5 mt-1">
              {formats.map((f) => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${format === f.id ? "bg-primary/10 border border-primary/30" : "bg-muted/40 hover:bg-muted"}`}>
                  <f.icon className={`h-4 w-4 shrink-0 ${format === f.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{f.label}</p>
                    <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="flex-1 gap-1" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
}
